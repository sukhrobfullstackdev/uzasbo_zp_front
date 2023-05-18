import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import classes from '../TPSalaryTransaction.module.css';
import SalaryTransactionTableHeader from './SalaryTransactionTableHeader';
import { CSSTransition } from 'react-transition-group';
import AllowedTransactionModal from './Modals/AllowedTransactionModal';

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

    const [subCalcKindListModal, setSubCalcKindListModal] = useState(false);
    const [calculationKindParams, setCalculationKindParams] = useState([]);

    const openSubCalcKindListModal = (params) => {
        setCalculationKindParams(params);
        setSubCalcKindListModal(true);
    };

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

    const save = async () => {
        try {
            const values = await form.validateFields();
            let status = 0;
            if (record.Status === 0) {
                status = 2;
            } else if (record.Status === 1) {
                status = 1;
            }
            toggleEdit();
            handleSave({ ...record, ...values, Status: status });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    const onSelect = (data) => {
        let status = 0;
        if (record.Status === 0) {
            status = 2;
        } else if (record.Status === 1) {
            status = 1;
        }
        form.setFieldsValue({
            "AllowedTransaction": data.NameValue,
            "AllowedTransactionID": data.ID,
            Status: status
        });
        handleSave({
            ...record,
            "AllowedTransaction": data.NameValue,
            "AllowedTransactionID": data.ID,
            Status: status
        });
        setEditing(!editing);
    };

    let childNode = children;
    ;
    if (editable && dataIndex === 'AllowedTransaction') {
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
                <Input
                    ref={inputRef} onPressEnter={save} readOnly className={'addonInput'}
                    onBlur={() => {
                        setTimeout(() => {
                            setEditing(!editing)
                        }, 150);
                    }}
                    addonAfter={
                        <div
                            onClick={() => openSubCalcKindListModal({
                                Name: 'AllowedTransaction',
                                ID: 'AllowedTransactionID'
                            })}
                        >
                            <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                        </div>
                    }
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

    return <td {...restProps}>
        {childNode}
        <CSSTransition
            mountOnEnter
            unmountOnExit
            in={subCalcKindListModal}
            timeout={300}
        >
            <AllowedTransactionModal
                visible={subCalcKindListModal}
                params={calculationKindParams}
                onSelect={onSelect}
                onCancel={() => {
                    setSubCalcKindListModal(false);
                }}
            />
        </CSSTransition>
    </td>;
};

const SalaryTransactionTable = ({ data, editSubCalcKindTableData }) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100,
        },
        {
            title: t("Allowed Transaction"),
            dataIndex: "AllowedTransaction",
            key: "AllowedTransaction",
            width: 250,
            sorter: true,
            editable: true,
        },
        {
            title: '',
            dataIndex: "",
            key: "",
            sorter: false,
            width: 50,
            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }}>
                        <span onClick={() => handleDelete(record.key)}>
                            <i className="feather icon-trash-2 action-icon" />
                        </span>
                    </Space>
                ) : null,
        },
    ];

    const [dataSource, setDataSource] = useState([]);

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
        editSubCalcKindTableData(data);
    };

    const addTableDataHandler = (enteredData) => {
        // console.log([...data, enteredData]);
        setDataSource([enteredData, ...dataSource]);
        editSubCalcKindTableData([enteredData, ...data]);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        editSubCalcKindTableData(newData);
    };

    const components = {
        header: {
            row: () => <SalaryTransactionTableHeader
                addData={addTableDataHandler}
            />
        },
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


export default SalaryTransactionTable;