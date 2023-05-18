import { Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match, reduxList }) => {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const columns = [
        {
            title: t("Comment"),
            dataIndex: "Comment",
            key: "Comment",
            sorter: true,
            width: 300,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        // {
        //     title: t("Date"),
        //     dataIndex: "Date",
        //     key: "Date",
        //     sorter: true,
        //     width: 100
        // },
        {
            title: t("AccDb"),
            dataIndex: "DebitCode",
            key: "DebitCode",
            sorter: true,
            width: 150
        },
        {
            title: t("AccCr"),
            dataIndex: "CreditCode",
            key: "CreditCode",
            sorter: true,
            width: 150
        },
        {
            title: t("Sum"),
            dataIndex: "Amount",
            key: "Amount",
            sorter: true,
            with: 150
        },
        {
            title: t("ItemOfExpenseDebit"),
            dataIndex: "ItemOfExpenseDebit",
            key: "ItemOfExpenseDebit",
            sorter: true,
            width: 150
        },
        {
            title: t("ItemOfExpenseCredit"),
            dataIndex: "ItemOfExpenseCredit",
            key: "ItemOfExpenseCredit",
            sorter: true,
            width: 150
        },
        {
            title: t("SettleCode"),
            dataIndex: "SettleCode",
            key: "SettleCode",
            sorter: true,
            width: 250
        },
        // {
        //     title: t("actions"),
        //     key: "action",
        //     width: 100,
        //     align: "center",
        //     fixed: "right",
        //     render: (record) => {
        //         return (
        //             <Space size="middle">

        //             </Space>
        //         );
        //     },
        // },
    ];

    const [confirmLoading, setConfirmLoading] = React.useState(false);

    function handleTableChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
        const { field, order } = sorter;
        // console.log(field, order?.slice(0, -3));

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );

    };

    const handleDelete = (id) => {
        console.log("handleDelete");
    };

    return (
        <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={tableData}
            loading={loading || confirmLoading}
            onChange={handleTableChange}
            rowKey={Math.random()}
            rowClassName="table-row"
            className="main-table"
            showSorterTooltip={false}
            scroll={{
                x: "max-content",
                y: '50vh'
            }}
            pagination={{
                pageSize: Math.ceil(tableData?.length / 10) * 10,
                total: total,
                current: pagination.PageNumber,
                showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            onRow={(record) => {
                return {
                    onDoubleClick: () => {
                    },
                };
            }}
        />
    )
}

export default React.memo(TableData);