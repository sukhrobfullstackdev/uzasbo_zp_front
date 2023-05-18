import React from 'react'
import { Table } from "antd";
import { useTranslation } from 'react-i18next';

const HumanResourceTable = ({ tableData }) => {
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
            title: t("DocNumber"),
            dataIndex: "Number",
            key: "Number",
            sorter: true,
            width: 100
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
            width: 90
        },
        {
            title: t("Division"),
            dataIndex: "Division",
            key: "Division",
            sorter: true,
            width: 150
        },
        {
            title: t("Department"),
            dataIndex: "Department",
            key: "Department",
            sorter: true,
            width: 180,
            render: record => <div className='ellipsis-2'>{record}</div>
        },
        {
            title: t("position"),
            dataIndex: "Position",
            key: "Position",
            sorter: true,
            width: 120
        },
        {
            title: t("EnrolmentType"),
            dataIndex: "EnrolmentType",
            key: "EnrolmentType",
            sorter: true,
            width: 120
        },
        {
            title: t("Rate"),
            dataIndex: "Rate",
            key: "Rate",
            sorter: true,
            width: 80
        },
        {
            title: t("Tariff Scale"),
            dataIndex: "TariffScale",
            key: "TariffScale",
            sorter: true,
            width: 80
        },
        {
            title: t("CorrectionFactor"),
            dataIndex: "CorrectionFactor",
            key: "CorrectionFactor",
            sorter: true,
            width: 80
        },
        {
            title: t("WorkSchedule"),
            dataIndex: "WorkSchedule",
            key: "WorkSchedule",
            sorter: true,
            width: 120,
            render: record => <div className='ellipsis-2'>{record}</div>
        },
    ];

    return (
        <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={tableData}
            rowKey={(record) => record.ID}
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

export default HumanResourceTable