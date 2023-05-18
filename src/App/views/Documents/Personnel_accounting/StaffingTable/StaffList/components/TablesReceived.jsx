import { Table } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';

const TablesReceived = (props) => {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("Number"),
            dataIndex: "Number",
            key: "Number",
            sorter: true,
            width: 100,
        },
        {
            title: t("Organization"),
            dataIndex: "Organization",
            key: "Organization",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("INN"),
            dataIndex: "INN",
            key: "INN",
            sorter: true,
            width: 100,
        },
        {
            title: t("ContactInfo"),
            dataIndex: "ContactInfo",
            key: "ContactInfo",
            sorter: true,
            width: 100,
        },
        // {
        //     title: t("ContactInfo"),
        //     dataIndex: "ContactInfo",
        //     key: "ContactInfo",
        //     sorter: true,
        //     width: 100,
        // },
        {
            title: t("FinanceYear"),
            dataIndex: "Year",
            key: "Year",
            sorter: true,
            width: 100,
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
            width: 100,
        },
        {
            title: t("TotalSum"),
            dataIndex: "TotalSum",
            key: "TotalSum",
            sorter: true,
            width: 100,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("StaffListGroup"),
            dataIndex: "StaffListGroupName",
            key: "StaffListGroupName",
            sorter: true,
            width: 100,
        },
        {
            title: t("SettlementAccount"),
            dataIndex: "SettlementAccountCode",
            key: "SettlementAccountCode",
            sorter: true,
            width: 150,
        },
        {
            title: t("StaffListType"),
            dataIndex: "StaffListTypeName",
            key: "StaffListTypeName",
            sorter: true,
            width: 100,
        },
    ]

    return (
        <Table
            bordered
            size='middle'
            pagination={false}
            rowClassName={'table-row'}
            className="main-table"
            columns={columns}
            dataSource={props.receivedTableData}
            scroll={{
                x: "max-content",
                y: '90vh'
            }}
        />
    )
}

export default TablesReceived