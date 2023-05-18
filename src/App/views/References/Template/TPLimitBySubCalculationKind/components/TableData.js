import { Space, Table, Tooltip } from 'antd';
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
            width: 70,
        },

        {
            title: t("TypeOrgName"),
            dataIndex: "TypeOrgName",
            key: "TypeOrgName",
            sorter: true,
            width: 150,
        },
        {
            title: t("NormativeAct"),
            dataIndex: "NormativeAct",
            key: "NormativeAct",
            sorter: true,
            width: 300,
        },
        {
            title: t("SubCalculationKind"),
            dataIndex: "SubCalculationKind",
            key: "SubCalculationKind",
            sorter: true,
            width: 300,
        },
        {
            title: t("LimitType"),
            dataIndex: "LimitType",
            key: "LimitType",
            sorter: true,
        },
        {
            title: t("LimitPeriod"),
            dataIndex: "LimitPeriod",
            key: "LimitPeriod",
            sorter: true,
        },
        {
            title: t("LimitOperType"),
            dataIndex: "LimitOper",
            key: "LimitOper",
            sorter: true,
            width: 100,
        },
        {
            title: t("LimitValue"),
            dataIndex: "LimitValue",
            key: "LimitValue",
            sorter: true,
            width: 100,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: "right",
            width: 100,
            render: (record) => {
                return (
                    <Space size="middle">

                        {adminViewRole && (
                            <>
                                <Tooltip title={t("Edit")}>
                                    <span onClick={() => openUpdateModal({ ID: record.ID })}>
                                        <i
                                            className="feather icon-edit action-icon"
                                            aria-hidden="true"
                                        ></i>
                                    </span>
                                </Tooltip>
                                {/* <Popconfirm
                                    title={t("delete")}
                                    onConfirm={() => this.handleDelete(record.ID)}
                                >
                                    <span style={{ color: "#1890FF", cursor: "pointer" }}>
                                        <i
                                            className="feather icon-trash-2 action-icon"
                                            aria-hidden="true" disabled
                                        ></i>
                                    </span>
                                </Popconfirm> */}
                            </>
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