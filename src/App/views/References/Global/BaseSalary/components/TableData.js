import React from 'react';
import { Table, Tooltip, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, reduxList, onClick }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            align: "center",
            sorter: (a, b) => a.code - b.code,

        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            align: "center",
            sorter: true,
        },
        {
            title: t("BaseSalary"),
            dataIndex: "BaseSalary",
            key: "BaseSalary",
            align: "center",
            sorter: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("ChangePercentage"),
            dataIndex: "ChangePercentage",
            key: "ChangePercentage",
            align: "center",
            width: "5%",
            sorter: true,
        },
        {
            title: t("NormativeAct"),
            dataIndex: "NormativeAct",
            key: "NormativeAct",
            sorter: true,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: "right",
            width: 80,
            render: (record) => {
                return (
                    <Space size="middle">
                        {adminViewRole && (
                            <Tooltip title={t("Edit")} 
                            onClick={() => onClick({ID: record.ID, ChangePercentage: record.ChangePercentage, 
                            Date: record.Date, BaseSalary: record.BaseSalary, NormativeAct: record.NormativeAct})}>
                                <span onClick={onClick}>
                                    <i className='feather icon-edit action-icon' aria-hidden="true" />
                                </span>
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
    ];

    const [confirmLoading] = React.useState(false);

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

    return (
        <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={tableData}
            loading={loading || confirmLoading}
            onChange={handleTableChange}
            rowKey={(record) => record.ID}
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
            // onRow={(record) => {
            //     return {
            //         onDoubleClick: () => {
            //             history.push(`${match.path}/edit/${record.ID}`);
            //         },
            //     };
            // }}
        />
    )
}

export default TableData;