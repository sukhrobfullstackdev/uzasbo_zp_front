import React, { useState } from 'react'
import { Table, Tag, Tooltip, Space, Popconfirm } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";

import { setListPagination } from '../_redux/getListSlice';

// const { confirm } = Modal;

const GetListTable = ({ tableData, total, match, tableList }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const [loading] = useState(false);

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
            title: t("Code"),
            dataIndex: "Code",
            key: "Code",
            sorter: true,
        },
        {
            title: t("NameUzb"),
            dataIndex: "NameUzb",
            key: "NameUzb",
            sorter: true,
        },
        {
            title: t("NameRus"),
            dataIndex: "NameRus",
            key: "NameRus",
            sorter: true,
        },
        {
            title: t("Department"),
            dataIndex: "Department",
            key: "Department",
            sorter: true,
        },
        {
            title: t("status"),
            dataIndex: "State",
            key: "State",
            width: "2%",
            render: (status) => {
                if (status === "Актив") {
                    return (
                        <Tag color="#87d068" key={status}>
                            {status}
                        </Tag>
                    );
                } else if (status === "Пассив") {
                    return (
                        <Tag color="#f50" key={status}>
                            {status}
                        </Tag>
                    );
                }
            },
        },
        {
            title: t("actions"),
            key: "action",
            width: "10%",
            align: "center",
            fixed: "right",
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("Edit")}>

                            <Link
                                to={`${this.props.match.path}/edit/${record.ID}`}
                            >
                                <i
                                    className='feather icon-edit action-icon'
                                    aria-hidden="true"
                                />
                            </Link>
                        </Tooltip>
                        <Tooltip title={t("Delete")}>
                            <Popconfirm
                                title="Sure to delete?"
                                onConfirm={() => this.handleDelete(record.ID)}
                            >
                                <span style={{ color: "#1890FF", cursor: "pointer" }}>
                                    <i
                                        className="feather icon-trash-2 action-icon"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                );
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