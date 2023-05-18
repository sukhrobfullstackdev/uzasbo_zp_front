import React from 'react'
import { Table } from "antd";
import { useTranslation } from 'react-i18next';

const CalculationKindTable = ({ tableData }) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("DocumentID"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 120
        },
        {
            title: t("position"),
            dataIndex: "Position",
            key: "Position",
            sorter: true,
            width: 100
        },
        {
            title: t("Rate"),
            dataIndex: "Rate",
            key: "Rate",
            sorter: true,
            width: 90
        },
        {
            title: t("CalcType"),
            dataIndex: "CalcType",
            key: "CalcType",
            sorter: true,
            width: 120
        },
        {
            title: t("Name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 200,
            render: record => <div className='ellipsis-2'>{record}</div>
        },
        {
            title: t("CalculationMethod"),
            dataIndex: "CalcMethod",
            key: "CalcMethod",
            sorter: true,
            width: 150
        },
        {
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            sorter: true,
            width: 120
        },
        {
            title: t("Percentage"),
            dataIndex: "Percentage",
            key: "Percentage",
            sorter: true,
            width: 80
        },
        // {
        //     title: t("DocumentName"),
        //     dataIndex: "DocumentName",
        //     key: "DocumentName",
        //     sorter: true,
        //     width: 150
        // },
        {
            title: t("StartDate"),
            dataIndex: "StartDate",
            key: "StartDate",
            sorter: true,
            width: 110
        },
        {
            title: t("EndDate"),
            dataIndex: "EndDate",
            key: "EndDate",
            sorter: true,
            width: 100
        },
        {
            title: t("Основание"),
            dataIndex: "Основание",
            key: "Основание",
            sorter: true,
            width: 200,
            render: (_, record) => <div className='ellipsis-2'>
                {record.DocumentID} ({record.DocumentName})
            </div>

        },
    ];

    return (
        <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={tableData}
            rowKey={() => Math.random()}
            rowClassName="table-row"
            className="main-table"
            showSorterTooltip={false}
            pagination={false}
            scroll={{
                x: "max-content",
                y: '50vh'
            }}
        />
    )
}

export default CalculationKindTable