import React, { useState } from 'react'
import { Table, Tag } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { useLocation, useHistory} from "react-router-dom";

import { setListPagination} from '../_redux/getListSlice';

const GetListTable = ({ tableData, total, match, tableList }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const [loading] = useState(false);

    let storeLoading = tableList.listBegin;
    let pagination = tableList.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: (a, b) => a.code - b.code,

        },
        {
            title: t("CategoryName"),
            dataIndex: "CategoryName",
            key: "CategoryName",
            sorter: true,
        },
        {
            title: t("Price"),
            dataIndex: "Price",
            key: "Price",
            sorter: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
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