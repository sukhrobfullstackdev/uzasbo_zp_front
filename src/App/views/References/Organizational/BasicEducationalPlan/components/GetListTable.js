import React, { useState } from 'react'
import { Table, Tag, Tooltip, Space, Menu, Dropdown, Modal } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";

import { setListPagination, setListFilter } from '../_redux/getListSlice';
import BasicEducationalPlanServices from '../../../../../../services/References/Organizational/BasicEducationalPlan/BasicEducationalPlan.services'
import { Notification } from '../../../../../../helpers/notifications';
import { CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

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
            sorter: true,
            width: 120
            // render: (_, record) => {
            //   if (record.StatusID === 2 || record.StatusID === 11) {
            //     return record.ID;
            //   } else {
            //     return <span style={{ color: 'red' }}>{record.ID}</span>
            //   }
            // }
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
            width: 120
        },
        {
            title: t("StartYear"),
            dataIndex: "StartYear",
            key: "StartYear",
            sorter: true,
            width: 120
        },
        {
            title: t("EndYear"),
            dataIndex: "EndYear",
            key: "EndYear",
            sorter: true,
            width: 120
        },
        {
            title: t("TotalHours"),
            dataIndex: "TotalHours",
            key: "TotalHours",
            sorter: true,
            width: 120,
            // render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("BLHGType"),
            dataIndex: "BLHGType",
            key: "BLHGType",
            sorter: true,
            width: 180,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("TeachingAtHome"),
            dataIndex: "TeachingAtHome",
            key: "TeachingAtHome",
            sorter: true,
            width: 140,
        },
        {
            title: t("Comment"),
            dataIndex: "Comment",
            key: "Comment",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>

        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 120,
            render: (_, record) => {
                if (record.StatusID === 2 || record.StatusID === 8) {
                    return (
                        <Tag color='#87d068'>
                            {record.Status}
                        </Tag>
                    );
                }
                return (
                    <Tag color='#f50'>
                        {record.Status}
                    </Tag>
                );
            }
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 80,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("Edit")}>
                            <Link to={`${match.path}/edit/${record.ID}`}>
                                <i className='feather icon-edit action-icon' aria-hidden="true" />
                            </Link>
                        </Tooltip>

                        <Dropdown
                            placement="bottom"
                            overlay={<Menu items={[
                                {
                                    key: 'accept',
                                    label: (
                                        <span onClick={() => acceptHandler(record.ID)}>
                                            <i className="far fa-check-circle action-icon" />&nbsp;
                                            {t("Accept")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'notAccept',
                                    label: (
                                        <span onClick={() => declineHandler(record.ID)}>
                                            <i className="far fa-check-circle action-icon" />&nbsp;
                                            {t("NotAccept")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'delete',
                                    label: (
                                        <span onClick={() => deleteRowHandler(record.ID)}>
                                            <i className="feather icon-trash-2 action-icon" />&nbsp;
                                            {t("Delete")}
                                        </span>
                                    ),
                                },
                            ]} />}
                        >
                            <i className='feather icon-list action-icon' aria-hidden="true" />
                        </Dropdown>
                    </Space>
                );
            },
        },
    ];

    const acceptHandler = (id) => {
        confirm({
            title: t('Accept'),
            icon: <CheckCircleOutlined />,
            content: t('acceptText'),
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                setLoading(true);
                BasicEducationalPlanServices.Accept(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('accepted'));
                            dispatch(setListFilter(filter))
                            setLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setLoading(false);
                    })
            }
        });
    };

    const declineHandler = (id) => {
        confirm({
            title: t('cancel'),
            icon: <InfoCircleOutlined />,
            content: t('cancelText'),
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                setLoading(true);
                BasicEducationalPlanServices.NotAccept(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('notAccepted'));
                            dispatch(setListFilter(filter))
                            setLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setLoading(false);
                    })
            }
        });
    };


    const deleteRowHandler = (id) => {
        confirm({
            title: t('Delete'),
            icon: <InfoCircleOutlined />,
            content: t('delete'),
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                setLoading(true);
                BasicEducationalPlanServices.delete(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            dispatch(setListFilter(filter))
                            setLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setLoading(false);
                    })
            }
        });
    };

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