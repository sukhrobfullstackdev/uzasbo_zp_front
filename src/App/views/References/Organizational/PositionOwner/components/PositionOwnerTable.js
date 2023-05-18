import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Form, Space, Checkbox, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import classes from '../PositionOwner.module.css';
import PositionOwnerTableHeader from './PositionOwnerTableHeader';
import { CSSTransition } from 'react-transition-group';
// import AllowedTransactionModal from './Modals/AllowedTransactionModal';

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
    allPositions,
    positionCategoryList,
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
    ;
    if (editable && dataIndex === 'AllPositionsID') {
        let childContent = allPositions?.find(position => position.ID === record.AllPositionsID);
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
                    {allPositions.map((taxItem) => (
                        <Option key={taxItem.ID} value={taxItem.ID}>
                            {taxItem.Name}
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
                {childContent?.Name}
            </div>
        );
    };
    if (editable && dataIndex === 'PositionCategoryID') {
        let childContent = positionCategoryList?.find(position => position.ID === record.PositionCategoryID);
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
                    {positionCategoryList.map((taxItem) => (
                        <Option key={taxItem.ID} value={taxItem.ID}>
                            {taxItem.Name}
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
                {childContent?.Name}
            </div>
        );
    };

    return <td {...restProps}>
        {childNode}
    </td>;
};

const PositionOwnerTable = ({ data, allPositions, positionCategoryList, editTableData }) => {
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
            title: t("AllPositions"),
            dataIndex: "AllPositionsID",
            key: "AllPositionsID",
            width: 250,
            sorter: true,
            editable: true,
        },
        {
            title: t("PositionCategory"),
            dataIndex: "PositionCategoryID",
            key: "PositionCategoryID",
            width: 250,
            sorter: true,
            editable: true,
        },
        {
            title: t("IsByBasicTariff"),
            dataIndex: "IsByBasicTariff",
            key: "IsByBasicTariff",
            width: 200,
            sorter: true,
            render: (record, fullRecord) => {
                return (
                    <Space size="middle" style={{ display: 'flex', justifyContent: 'center' }} >
                        <Checkbox defaultChecked={fullRecord.IsByBasicTariff}
                            onChange={() => onChangeIsByBasicTariff(fullRecord)}
                        ></Checkbox>
                    </Space>
                );
            },
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
        // console.log([...data, enteredData]);
        setDataSource([enteredData, ...dataSource]);
        editTableData([enteredData, ...data]);
    };

    const onChangeIsByBasicTariff = (record) => {
        record.IsByBasicTariff = !record.IsByBasicTariff;
        record.Status = 2;
        dataSource.map(row => {
            if (row.key === record.key) {
                row = record;
            }
            return row;
        })
        filteredDataSource.map(row => {
            if (row.key === record.key) {
                row = record;
            }
            return row;
        })
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
            row: () => <PositionOwnerTableHeader
                addData={addTableDataHandler}
                allPositions={allPositions}
                positionCategoryList={positionCategoryList}
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
                allPositions: allPositions,
                positionCategoryList: positionCategoryList
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
                dataSource={dataSource}
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


export default PositionOwnerTable;