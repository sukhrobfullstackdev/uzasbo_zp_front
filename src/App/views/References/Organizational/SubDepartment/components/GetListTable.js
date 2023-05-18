import React, { useState } from 'react'
import { Table, Tag, Tooltip, Space, Modal, Popconfirm } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";

import { setListPagination, setListFilter } from '../_redux/getListSlice';
// import BasicEducationalPlanServices from '../../../../../../services/References/Organizational/BasicEducationalPlan/BasicEducationalPlan.services'
// import { Notification } from '../../../../../../helpers/notifications';
// import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const GetListTable = ({ tableData, total, match, tableList }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const [loading, setLoading] = useState(false);

    let storeLoading = tableList.listBegin;
    let filter = tableList?.filterData;
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
            title: t("DepartmentID"),
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
                        <Tooltip title="Edit">
                            <Link
                                data-id={record.id}
                                to={`${this.props.match.path}/edit/${record.ID}`}
                            >
                                <i
                                    className="feather icon-edit action-icon"
                                    aria-hidden="true"
                                ></i>
                            </Link>
                        </Tooltip>

                        <Popconfirm

                            title="Sure to delete?"
                            onConfirm={() => this.handleDelete(record.ID)}
                        >
                            <Tooltip title="Delete">
                                <span style={{ color: "#1890FF", cursor: "pointer" }}>
                                    <i
                                        className="feather icon-trash-2 action-icon"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    // const acceptHandler = (id) => {
    //     confirm({
    //         title: t('Accept'),
    //         icon: <CheckCircleOutlined />,
    //         content: t('acceptText'),
    //         okText: 'OK',
    //         cancelText: t('cancel'),
    //         onOk: () => {
    //             setLoading(true);
    //             BasicEducationalPlanServices.Accept(id)
    //                 .then((res) => {
    //                     if (res.status === 200) {
    //                         Notification('success', t('accepted'));
    //                         dispatch(setListFilter(filter))
    //                         setLoading(false);
    //                     }
    //                 }).catch((err) => {
    //                     Notification('error', err);
    //                     setLoading(false);
    //                 })
    //         }
    //     });
    // };

    // const declineHandler = (id) => {
    //     confirm({
    //         title: t('cancel'),
    //         icon: <InfoCircleOutlined />,
    //         content: t('cancelText'),
    //         okText: 'OK',
    //         cancelText: t('cancel'),
    //         onOk: () => {
    //             setLoading(true);
    //             BasicEducationalPlanServices.NotAccept(id)
    //                 .then((res) => {
    //                     if (res.status === 200) {
    //                         Notification('success', t('notAccepted'));
    //                         dispatch(setListFilter(filter))
    //                         setLoading(false);
    //                     }
    //                 }).catch((err) => {
    //                     Notification('error', err);
    //                     setLoading(false);
    //                 })
    //         }
    //     });
    // };


    // const deleteRowHandler = (id) => {
    //     confirm({
    //         title: t('Delete'),
    //         icon: <InfoCircleOutlined />,
    //         content: t('delete'),
    //         okText: 'OK',
    //         cancelText: t('cancel'),
    //         onOk: () => {
    //             setLoading(true);
    //             BasicEducationalPlanServices.delete(id)
    //                 .then((res) => {
    //                     if (res.status === 200) {
    //                         Notification('success', t('success-msg'));
    //                         dispatch(setListFilter(filter))
    //                         setLoading(false);
    //                     }
    //                 }).catch((err) => {
    //                     Notification('error', err);
    //                     setLoading(false);
    //                 })
    //         }
    //     });
    // };

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