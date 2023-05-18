import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Form, Space, InputNumber, Select, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';

import SubjectsInBLGHTTableHeader from './SubjectsInBLGHTTableHeader';

const { Option } = Select;

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
    subjectsList,
    ...restProps
}) => {
    // console.log(record);
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

    let childNode = children;

    if (editable && (dataIndex === 'SubjectsID' || dataIndex === 'ParentID')) {
        let childContent = subjectsList?.find(subject => subject.ID === record.SubjectsID);
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                    width: 'fit-content',
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Select
                    placeholder={t("Select from list")}
                    showSearch
                    ref={inputRef} onPressEnter={save} onBlur={save}
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {subjectsList.map((item) => (
                        <Option key={item.ID} value={item.ID}>
                            {item.NameUzb}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {childContent?.NameUzb}
            </div>
        );
    };
    if (editable && (
        dataIndex === 'IsGroup' || dataIndex === 'ForHoursGrid' || dataIndex === 'ForBillingList'
        || dataIndex === 'CanEdit' || dataIndex === 'OpenDividedSciences'
    )) {
        childNode =
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: false,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Checkbox
                        ref={inputRef} onChange={save} defaultChecked={record[dataIndex]}
                    ></Checkbox>
                </div>
            </Form.Item>
    };

    return <td {...restProps}>
        {childNode}
    </td>;
};

const SubjectsInBLGHTTable = ({
    data, editTableData, tableHeaders, subjectsList, mainForm
}) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 80,
        },
        {
            title: t("Subjects"),
            dataIndex: "SubjectsID",
            key: "SubjectsID",
            width: 250,
            sorter: true,
            editable: true,
        },
        {
            title: t("IsGroup"),
            dataIndex: "IsGroup",
            key: "IsGroup",
            width: 120,
            sorter: true,
            editable: true,
        },
        {
            title: t("ParentID"),
            dataIndex: "ParentID",
            key: "ParentID",
            width: 250,
            editable: true,
        },
        {
            title: t("ForHoursGrid"),
            dataIndex: "ForHoursGrid",
            key: "ForHoursGrid",
            width: 120,
            editable: true,
        },
        {
            title: t("ForBillingList"),
            dataIndex: "ForBillingList",
            key: "ForBillingList",
            width: 120,
            editable: true,
        },
        {
            title: t("CanEdit"),
            dataIndex: "CanEdit",
            key: "CanEdit",
            width: 120,
            editable: true,
        },
        {
            title: t("OpenDividedSciences"),
            dataIndex: "OpenDividedSciences",
            key: "OpenDividedSciences",
            width: 120,
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
    const [filteredDataSource, setFilteredDataSource] = useState([]);

    useEffect(() => {
        setDataSource(data);
        let filteredData = data.filter(data => data.Status !== 3)
        setFilteredDataSource(filteredData);
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
        setFilteredDataSource(lastDataSource);
        editTableData(data);
    };

    const addTableDataHandler = (enteredData) => {
        // console.log([enteredData, ...dataSource]);   
        setDataSource([enteredData, ...dataSource]);
        editTableData([enteredData, ...data]);
    };

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setDataSource(newData);
        editTableData(newData);
    };

    const components = {
        header: {
            row: () => <SubjectsInBLGHTTableHeader
                addData={addTableDataHandler}
                tableHeaders={tableHeaders}
                subjectsList={subjectsList}
                mainForm={mainForm}
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
                subjectsList: subjectsList
            }),
        };
    });
    return (
        <div>
            <Table
                bordered
                size='middle'
                rowClassName="table-row"
                className="main-table"
                dataSource={filteredDataSource}
                columns={newColumns}
                components={components}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={false}
            />
        </div>
    );
}

export default React.memo(SubjectsInBLGHTTable);