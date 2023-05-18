import { Input, Table } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next';

const RowsTable = (props) => {
    const { t } = useTranslation();

    const rowColumns = [
        {
            title: t("StaffListRowType"),
            dataIndex: "StaffListRowTypeName",
            key: "StaffListRowTypeName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("StaffQuantity"),
            dataIndex: "StaffQuantity",
            key: "StaffQuantity",
            sorter: true,
            width: 50,
            render: record => new Intl.NumberFormat('ru-RU', {}).format(record),
        },
        {
            title: t("FOT"),
            dataIndex: "FOT",
            key: "FOT",
            sorter: true,
            width: 50,
            render: (_, record) => {
                return ((record.CanEdit) && (record.Status === 1 || record.Status === 2)) ? (
                    <Input
                        // ref={inputRef}
                        // onPressEnter={(e) => { saveInput(e, record); inputRef.current.blur(); }}
                        // onBlur={(e) => saveInput(e, record)} defaultValue={record.FOT}
                        placeholder={t('FOT')}
                    />
                ) : (
                    <>{new Intl.NumberFormat('ru-RU', {}).format(record.FOT)} UZS</>
                )
            }
        },
    ]


    return (
        <Table
            bordered
            size='middle'
            pagination={false}
            rowClassName={'table-row'}
            className="main-table"
            columns={rowColumns}
            dataSource={props.rowTableData}
            scroll={{
                x: "max-content",
                y: '90vh'
            }}
        />
    )
}

export default RowsTable