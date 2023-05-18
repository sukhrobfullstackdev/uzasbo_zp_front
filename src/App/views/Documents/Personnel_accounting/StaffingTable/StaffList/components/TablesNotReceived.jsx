import { Table } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';

const TablesNotReceived = (props) => {
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
    ]

    return (
        <Table
            bordered
            size='middle'
            pagination={false}
            rowClassName={'table-row'}
            className="main-table"
            columns={columns}
            dataSource={props.notReceivedTableData}
            scroll={{
                x: "max-content",
                y: '90vh'
            }}
        />
    )
}

export default TablesNotReceived