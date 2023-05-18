import { Space, Table, Tag, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match, reduxList, openUpdateModal }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const columns = [
        {
            title: t("ID"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 150,
        },

        {
            title: t("Code"),
            dataIndex: "Code",
            key: "Code",
            sorter: true,
            width: 250,
        },
        {
            title: t("FunctionalItemOfExpense"),
            dataIndex: "FunctionalItemOfExpenseCode",
            key: "FunctionalItemOfExpenseCode",
            sorter: true,
            width: 250,
        },
        {
            title: t("Chapter"),
            dataIndex: "ChapterCode",
            key: "ChapterCode",
            sorter: true,
            width: 150,
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
                            <Tooltip title={t("Edit")}>
                                <span onClick={() => openUpdateModal({ ID: record.ID })}>
                                    <i
                                        className="feather icon-edit action-icon"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                            </Tooltip>
                        )}
                    </Space>
                );
            },
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

    // const deleteRowHandler = () => {
    //     console.log("deleteRowHandler");
    // }

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
                        openUpdateModal({ ID: record.ID })
                    },
                };
            }}
        />
    )
}

export default React.memo(TableData);