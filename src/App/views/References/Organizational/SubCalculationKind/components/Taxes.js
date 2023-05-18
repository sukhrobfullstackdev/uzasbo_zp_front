import { Checkbox, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

const Taxes = ({ data, editTaxesTableData }) => {
    // console.log(data);
    const { t } = useTranslation();

    const columns = [
        {
            title: t("Check"),
            dataIndex: "Checked",
            key: "Checked",
            width: 60,
            render: (record, allRecord) => {
                return (
                    <Space size="middle" >
                        <Checkbox checked={allRecord.Checked}
                            onChange={() => handleCheckTax(allRecord.SubcID, allRecord.Checked)}
                        ></Checkbox>
                    </Space>
                );
            },
        },
        {
            title: t("SubcName"),
            dataIndex: "SubcName",
            key: "SubcName",
            sorter: true,
            width: 200,
        },
        {
            title: t("SubcID"),
            dataIndex: "SubcID",
            key: "SubcID",
            sorter: true,
            width: 100,
        },
    ];

    const [loading, setLoading] = React.useState(false);
    const [calcTypeTables, setCalcTypeTables] = React.useState([]);
    // const [editedCalcTypeTables, setEditedCalcTypeTables] = useState([]);

    const [checkAll, setCheckAll] = React.useState(false);

    useEffect(() => {
        setCalcTypeTables(data);
    }, [data])

    const handleCheckTax = (id) => {
        // console.log(id);

        let newCalcTypeTable = calcTypeTables.find(calcType => calcType.SubcID === id);
        newCalcTypeTable.Checked = !newCalcTypeTable.Checked;
        newCalcTypeTable.Status = 2;
        let newCalcTypeTables = calcTypeTables.map(row => {
            if (row.SubcID === newCalcTypeTable.SubcID) {
                row = newCalcTypeTable;
            }
            return row;
        });

        // let isExist = editedCalcTypeTables.find(table => table.SubcID === newCalcTypeTable.SubcID);
        // if (isExist) {
        //     let lastCalcTypeTables = editedCalcTypeTables.filter(table => table.SubcID !== newCalcTypeTable.SubcID);
        //     setEditedCalcTypeTables(lastCalcTypeTables);
        //     editTaxesTableData(lastCalcTypeTables);
        //     // console.log(lastCalcTypeTables);
        // } else {
        //     setEditedCalcTypeTables([...editedCalcTypeTables, newCalcTypeTable]);
        //     editTaxesTableData([...editedCalcTypeTables, newCalcTypeTable]);
        //     // console.log([...editedCalcTypeTables, newCalcTypeTable]);
        // }
        // console.log(newCalcTypeTables);
        setCalcTypeTables(newCalcTypeTables);
        editTaxesTableData(newCalcTypeTables);
    };

    const handleCheckAll = (event) => {
        // console.log(event.target.checked);
        setCheckAll(event.target.checked);
        if (event.target.checked) {
            const newCalcTypeTables = calcTypeTables.map(calcType => {
                calcType.Checked = true;
                calcType.Status = 2;
                return calcType;
            })
            setCalcTypeTables(newCalcTypeTables);
            editTaxesTableData(newCalcTypeTables);
        } else {
            const newCalcTypeTables = calcTypeTables.map(calcType => {
                calcType.Checked = false;
                calcType.Status = 2;
                return calcType;
            })
            setCalcTypeTables(newCalcTypeTables);
            editTaxesTableData(newCalcTypeTables);
        }
    };

    return (
        <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={calcTypeTables}
            loading={loading}
            rowKey={(record) => record.SubcID}
            rowClassName="table-row"
            className="main-table"
            showSorterTooltip={false}
            scroll={{
                x: "max-content",
                y: '50vh'
            }}
            components={{
                header: {
                    row: () => <tr>
                        <th>
                            <Space>
                                <Checkbox
                                    onChange={handleCheckAll}
                                    checked={checkAll}
                                >
                                    {t("SelectAll")}
                                </Checkbox>
                            </Space>
                        </th>
                        <th>{t("SubcName")}</th>
                        <th>{t("ID")}</th>
                    </tr>
                },
            }}
            pagination={false}
        />
    )
}

export default Taxes;