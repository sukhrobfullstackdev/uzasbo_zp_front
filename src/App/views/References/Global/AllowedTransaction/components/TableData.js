import { Table } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match, reduxList }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: (a, b) => a.code - b.code,

        },
        {
            title: t("Code"),
            dataIndex: "Code",
            key: "Code",
            sorter: true,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
        },
        {
            title: t("Acc Db"),
            dataIndex: "AccDb",
            key: "AccDb",
            sorter: true,
            width: 60,
        },
        {
            title: t("AccCr"),
            dataIndex: "AccCr",
            key: "AccCr",
            sorter: true,
            width: 60,
        },
        {
            title: t("MemorialOrderNumber"),
            dataIndex: "MemorialOrderNumber",
            key: "MemorialOrderNumber",
            sorter: true,
            width: 100,
        },
        {
            title: t("DisplayName"),
            dataIndex: "DisplayName",
            key: "DisplayName",
            sorter: true,
        },
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
            onRow={(record) => {
                return {
                    onDoubleClick: () => {
                        history.push(`${match.path}/edit/${record.ID}`);
                    },
                };
            }}
        />
    )
}

export default TableData;