import { Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match, openUpdateModal }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const subalcKindList = useSelector((state) => state.subalcKindList);
    let loading = subalcKindList?.listBegin;
    let pagination = subalcKindList?.paginationData;

    const columns = [
        {
            title: t("ID"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
        },

        {
            title: t("TypeOrgName"),
            dataIndex: "TypeOrgName",
            key: "TypeOrgName",
            sorter: true,
        },
        {
            title: t("Code"),
            dataIndex: "Code",
            key: "Code",
            sorter: true,
        },
        {
            title: t("Name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
        },
        {
            title: t("ShortName"),
            dataIndex: "ShortName",
            key: "ShortName",
            sorter: true,
        },
        {
            title: t("Category"),
            dataIndex: "Category",
            key: "Category",
            sorter: true,
        },
        {
            title: t("TariffScale"),
            dataIndex: "TariffScale",
            key: "TariffScale",
            sorter: true,
        },
        {
            title: t("actions"),
            key: "action",
            width: 100,
            align: "center",
            fixed: "right",
            render: (record) => {
                return (
                    <Space size="middle">
                        {adminViewRole && (
                            <>
                                <span onClick={() => openUpdateModal({ ID: record.ID })}>
                                    <i
                                        className="feather icon-edit action-icon"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                                {/* <Popconfirm
                                    title={t("delete")}
                                    onConfirm={() => handleDelete(record.ID)}
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