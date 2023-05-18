import React from 'react'
import { Dropdown, Menu, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import { Notification } from '../../../../../../../helpers/notifications';
import { setListPagination } from '../_redux/getListSlice';
import BLHoursGridServices from "./../../../../../../../services/Documents/Personnel_accounting/TariffList/BLHoursGrid/BLHoursGrid.services";

const TableData = ({ tableData, total, match, reduxList, refresh }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            render: (_, record) => {
                if (record.StatusID === 2) {
                    return record.ID;
                } else {
                    return <span style={{ color: 'red' }}>{record.ID}</span>
                }
            }
        },
        {
            title: t("number"),
            dataIndex: "Number",
            key: "Number",
            sorter: true,
            width: 80,
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
        },
        {
            title: t("Status"),
            dataIndex: "StatusName",
            key: "StatusName",
            sorter: true,
            render: (_, record) => {
                if (record.StatusID === 2) {
                    return (
                        <Tag color='#87d068'>
                            {record.StatusName}
                        </Tag>
                    );
                }
                return (
                    <Tag color='#f50'>
                        {record.StatusName}
                    </Tag>
                );
            }
            // width: 100
        },
        {
            title: t("StartYear"),
            dataIndex: "StartYear",
            key: "StartYear",
            sorter: true,
            width: 80
        },
        {
            title: t("EndYear"),
            dataIndex: "EndYear",
            key: "EndYear",
            sorter: true,
            width: 80
        },

        {
            title: t("TotalHours"),
            dataIndex: "TotalHours",
            key: "TotalHours",
            sorter: true,
            width: 100
        },
        {
            title: t("Comment"),
            dataIndex: "Comment",
            key: "Comment",
            sorter: true,
            // width: 100
        },

        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            render: (record) => {
                return (
                    <Space size="middle">
                        {/* <Tooltip title={t("Accept")} onClick={() => acceptHandler(record.ID)}>
                            <span>
                                <i className="far fa-check-circle action-icon" />

                            </span>
                        </Tooltip>
                        <Tooltip title={t("NotAccept")} onClick={() => declineHandler(record.ID)}>
                            <span>
                                <i className="far fa-times-circle action-icon" />
                            </span>
                        </Tooltip> */}
                        <Tooltip title={t("Edit")}>
                            <Link
                                to={`${match.path}/edit/${record.ID}`}
                            >
                                <i
                                    className='feather icon-edit action-icon'
                                    aria-hidden="true"
                                />
                            </Link>
                        </Tooltip>
                        {/* <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => deleteRowHandler(record.ID)}
                            okText={t("yes")}
                            cancelText={t("cancel")}
                        >
                            <Tooltip title={t("Delete")}>
                                <span>
                                    <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                                </span>
                            </Tooltip>
                        </Popconfirm> */}
                        <Dropdown
                            placement='bottom'
                            overlay={<Menu items={[
                                {
                                    key: 'print',
                                    label: (
                                        <span onClick={() => printById(record.ID)}>
                                            <i className="feather icon-printer action-icon" />&nbsp;
                                            {t("Print")}
                                        </span>
                                    ),
                                },
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
                                            <i className="far fa-times-circle action-icon" />&nbsp;
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

    function handleTableChange(pagination, _, sorter) {
        const { field, order } = sorter;

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );
    };

    const acceptHandler = (id) => {
        setConfirmLoading(true);
        BLHoursGridServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', t('edited'))
                }
            })
            .catch((err) => {
                setConfirmLoading(false);
                Notification('error', err);
            });
    };

    const declineHandler = (id) => {
        setConfirmLoading(true);
        BLHoursGridServices.NotAccept(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', t('edited'))
                }
            })
            .catch((err) => {
                setConfirmLoading(false)
                Notification('error', err)
            });
    };

    const printById = (id) => {
        setConfirmLoading(true);
        BLHoursGridServices.printById(id)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "BLHoursGrid.xlsx");
                document.body.appendChild(link);
                setConfirmLoading(false);
                link.click();
            })
            .catch(err => {
                Notification('error', err);
                setConfirmLoading(false);
            })
    }

    const deleteRowHandler = (id) => {
        setConfirmLoading(true);
        BLHoursGridServices.delete(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', t('deleted'))
                }
            })
            .catch((err) => {
                Notification('error', err)
                setConfirmLoading(false)
            });
    };

    const onTableRow = (record) => {
        return {
            onDoubleClick: () => {
                history.push(`${match.path}/edit/${record.ID}`);
            },
        };
    }

    return (
        <>
            <Table
                bordered
                size="middle"
                columns={columns}
                dataSource={tableData}
                loading={loading || confirmLoading}
                showSorterTooltip={false}
                onChange={handleTableChange}
                rowKey={(record) => record.ID}
                rowClassName="table-row"
                className='main-table'
                onRow={(record) => onTableRow(record)}
                scroll={{
                    x: 'max-content',
                    y: '50vh'
                }}
                pagination={{
                    ...pagination,
                    total: total,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
            />
        </>
    )
}

export default TableData