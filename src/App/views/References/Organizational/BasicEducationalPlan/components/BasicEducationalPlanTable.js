import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Form, Space, InputNumber, Checkbox } from 'antd';
import { useTranslation } from 'react-i18next';

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
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

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
    if (editable && record.CanEdit) {
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
                        pattern: /^\d+(?:\.5)?$/,
                    },
                ]}
            >
                <InputNumber min={0} style={{ width: '100%' }} ref={inputRef} onPressEnter={save} onBlur={save} />
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
    </td>;
};

const BasicEducationalPlanTable = ({ data, editTableData, handleTotalHours }) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("Code"),
            dataIndex: "Code",
            width: 80,
            // sorter: true
        },
        {
            title: t("Subjects"),
            dataIndex: "SubjectsName",
            width: 180,
            // sorter: true,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("1stClass"),
            dataIndex: "Class1",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("2ndClass"),
            dataIndex: "Class2",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("3rdClass"),
            dataIndex: "Class3",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("4thClass"),
            dataIndex: "Class4",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("5thClass"),
            dataIndex: "Class5",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("6thClass"),
            dataIndex: "Class6",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("7thClass"),
            dataIndex: "Class7",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("8thClass"),
            dataIndex: "Class8",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("9thClass"),
            dataIndex: "Class9",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("10thClass"),
            dataIndex: "Class10",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        {
            title: t("11thClass"),
            dataIndex: "Class11",
            width: 80,
            // sorter: true,
            editable: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        },
        // {
        //     title: t("TotalWeeklyHours"),
        //     dataIndex: "TotaWeeklylHours",
        //     width: 200,
        //     // sorter: true,
        //     editable: true,
        //     render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(record)
        // },
        {
            title: t("TotalWeeklyHours"),
            dataIndex: "TotaWeeklylHours",
            width: 200,
            // sorter: true,
            // editable: true,
            render: (_, record) => {
                return (
                    <div>{
                        record.Class1 + record.Class2 + record.Class3
                        + record.Class4 + record.Class5 + record.Class5
                        + record.Class6 + record.Class7 + record.Class8
                        + record.Class9 + record.Class10 + record.Class11}
                    </div>
                )
            }
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

    const onChangeCalcFromInSum = (record) => {
        record.CalcFromInSum = !record.CalcFromInSum;
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

    const tableSummaryHandler = records => {
        let total1 = 0;
        let total2 = 0;
        let total3 = 0;
        let total4 = 0;
        let total5 = 0;
        let total6 = 0;
        let total7 = 0;
        let total8 = 0;
        let total9 = 0;
        let total10 = 0;
        let total11 = 0;
        let total = 0;

        records.forEach(item => {
            total1 += +item.Class1;
            total2 += +item.Class2;
            total3 += +item.Class3;
            total4 += +item.Class4;
            total5 += +item.Class5;
            total6 += +item.Class6;
            total7 += +item.Class7;
            total8 += +item.Class8;
            total9 += +item.Class9;
            total10 += +item.Class10;
            total11 += +item.Class11;
            total = total1 + total2 + total3 + total4 + total5
                + total6 + total7 + total8 + total9 + total10 + total11
        });

        handleTotalHours(total)

        return (
            <Table.Summary.Row>
                <Table.Summary.Cell></Table.Summary.Cell>
                <Table.Summary.Cell>{t("TotalHours")}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total1)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total2)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total3)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total4)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total5)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total6)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total7)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total8)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total9)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total10)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total11)}</Table.Summary.Cell>
                <Table.Summary.Cell>{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(total)}</Table.Summary.Cell>
            </Table.Summary.Row>
        );
    }

    return (
        <Table
            bordered
            size='middle'
            className="main-table"
            rowClassName="table-row"
            dataSource={filteredDataSource}
            columns={newColumns}
            components={components}
            summary={records => tableSummaryHandler(records)}
            scroll={{
                x: "max-content",
                y: '50vh'
            }}
            pagination={false}
        />
    )
}

export default BasicEducationalPlanTable