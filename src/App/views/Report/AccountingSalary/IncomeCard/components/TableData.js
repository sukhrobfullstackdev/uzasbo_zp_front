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
        // {
        //     title: t("Comment"),
        //     dataIndex: "Comment",
        //     key: "Comment",
        //     sorter: true,
        //     width: 300,
        //     render: record => <div className="ellipsis-2">{record}</div>
        // },
        {
            title: t("Year"),
            dataIndex: "Year",
            key: "Year",
            sorter: true,
            width: 100
        },
        {
            title: t("Month"),
            dataIndex: "Month",
            key: "Month",
            sorter: true,
            width: 120
        },
        {
            title: t("Income"),
            dataIndex: "Income",
            key: "Income",
            sorter: true,
            width: 120
        },
        {
            title: t("WorkInAridAndMountainous"),
            dataIndex: "WorkInAridAndMountainous",
            key: "WorkInAridAndMountainous",
            sorter: true,
            width: 120
        },
        {
            title: t("NotTaxableIncome"),
            dataIndex: "NotTaxableIncome",
            key: "NotTaxableIncome",
            sorter: true,
            width: 120
        },
        {
            title: t("TaxableIncome"),
            dataIndex: "TaxableIncome",
            key: "TaxableIncome",
            sorter: true,
            width: 120
        },
        {
            title: t("Incometax"),
            dataIndex: "Incometax",
            key: "Incometax",
            sorter: true,
            width: 120
        },
        {
            title: t("inpsInfo"),
            dataIndex: "INPS",
            key: "INPS",
            sorter: true,
            width: 120
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