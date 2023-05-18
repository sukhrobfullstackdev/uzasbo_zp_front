import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Popconfirm, Form, Space, DatePicker, InputNumber } from 'antd';
// import PerHistoryTableHeader from './PerHistoryTableHeader';
import { useTranslation } from 'react-i18next';
import moment from "moment";

import classes from '../TPWorkSchedule.module.css';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
    // console.log(props);
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    // console.log(dataIndex);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    const { t } = useTranslation();

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const onChangeDate = (_, dateString) => {
        record.Date = dateString;
        handleSave(record);
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            let status = 0;
            if (record.Status === 0){
                status = 2;
            } else if (record.Status === 1){
                status = 1;
            }
            handleSave({ ...record, ...values, Status: status });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;
    ;
    if (editable && dataIndex === 'Date') {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                // name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <DatePicker
                    style={{ width: '100%' }} ref={inputRef}
                    format="DD.MM.YYYY" className='datepicker'
                    defaultValue={moment(record.Date, "DD.MM.YYYY")}
                    onChange={onChangeDate}
                    placeholder={t('QuantityOfMinimalSalaries')}
                />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };
    if (editable && (dataIndex === 'Percentage')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber min={0} max={100} style={{ width: '100%' }} ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };
    if (editable && (dataIndex === 'Sum')) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <InputNumber style={{ width: '100%' }} ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };
    if (editable && dataIndex === 'NormativeAct') {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    };

    return <td {...restProps}>{childNode}</td>;
};

const ShiftsTable = ({ data, editPerHistoryTableData }) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            editable: true,
            width: 100,
        },
        {
            title: t("DayNumber"),
            dataIndex: "DayNumber",
            key: "DayNumber",
            width: 200,
            sorter: true,
            editable: true,
        },
        {
            title: t("ShiftName"),
            dataIndex: "ShiftName",
            key: "ShiftName",
            sorter: true,
            width: 200,
            editable: true,
        },
        // {
        //     title: '',
        //     dataIndex: "",
        //     key: "",
        //     sorter: false,
        //     width: 50,
        //     render: (_, record) =>
        //         dataSource.length >= 1 ? (
        //             <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
        //                 <Popconfirm title={t('delete')} onConfirm={() => handleDelete(record.key)}>
        //                     <i className="feather icon-trash-2 action-icon" />
        //                 </Popconfirm>
        //             </Space>
        //         ) : null,
        // },
    ];

    const [dataSource, setDataSource] = useState([]);
    const [count, setCount] = useState(null);

    useEffect(() => {
        setDataSource(data);
    }, [data])

    const handleDelete = (key) => {
        data.map(row => {
            if (row.key === key) {
                row.Status = 3;
            };
            return row;
        })
        const lastDataSource = data.filter((item) => item.Status !== 3);
        setDataSource(lastDataSource);
        editPerHistoryTableData(data);
    };

    const addTableDataHandler = (enteredData) => {
        console.log([...data, enteredData]);
        setDataSource([enteredData, ...dataSource]);
        editPerHistoryTableData([enteredData, ...data]);
        // console.log(calcTypeTables);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        editPerHistoryTableData(newData);
    };

    const components = {
        // header: {
        //     row: () => <PerHistoryTableHeader
        //         addData={addTableDataHandler}
        //     />
        // },
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const newColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });
    return (
        <div>
            <Table
                className={classes.editable}
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={newColumns}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={false}
            />
        </div>
    );
}

export default ShiftsTable;