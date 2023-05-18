import React, { useState } from 'react'
import { Table, Space, Tooltip } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";

import { setListPagination, setListFilter } from '../_redux/getListSlice';

// const { confirm } = Modal;

const GetListTable = ({ tableData, total, match, tableList }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const [loading, setLoading] = useState(false);

    let storeLoading = tableList.listBegin;
    // let filter = tableList?.filterData;
    let pagination = tableList.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: (a, b) => a.code - b.code,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
        },
        {
            title: t("CalculationType"),
            dataIndex: "CalculationType",
            key: "CalculationType",
            sorter: true,
        },
        {
            title: t('actions'),
            key: 'action',
            width: '10%',
            align: 'center',
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t('Edit')}>
                            <Link
                                data-id={record.id}
                                to={`${match.path}/edit/${record.ID}`}
                            >
                                <i className="feather icon-edit action-icon" aria-hidden="true"></i>
                            </Link>
                        </Tooltip>
                    </Space>
                )
            },
        },
    ];

    const handleTableChange = (pagination, filters, sorter, extra) => {
        const { field, order } = sorter;
        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );
    }

    const onTableRow = (record) => {
        return {
            onDoubleClick: () => {
                history.push(`${location.pathname}/edit/${record.ID}`);
            },
        };
    }

    return (
        <>
            <Table
                bordered
                size="middle"
                rowClassName="table-row"
                className="main-table"
                columns={columns}
                dataSource={tableData}
                loading={storeLoading || loading}
                onChange={handleTableChange}
                rowKey={(record) => record.ID}
                showSorterTooltip={false}
                onRow={(record) => onTableRow(record)}
                scroll={{
                    x: "max-content",
                    y: '50vh'
                }}
                pagination={{
                    pageSize: tableData?.length,
                    total: total,
                    current: pagination.PageNumber,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
            />
        </>
    )
}

export default GetListTable;