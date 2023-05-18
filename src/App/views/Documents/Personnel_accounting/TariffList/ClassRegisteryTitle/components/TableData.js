import React from 'react'
import { Dropdown, Menu, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import { Notification } from '../../../../../../../helpers/notifications';
import { setListPagination } from '../_redux/getListSlice';
import ClassRegisteryTitleServices from '../../../../../../../services/Documents/Personnel_accounting/TariffList/ClassRegisteryTitle/ClassRegisteryTitle.services';

const TableData = ({ tableData, total, match, reduxList, refresh }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [tablePopup, setTablePopup] = React.useState({
        visible: false,
        x: 0,
        y: 0
    });

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 150,
            render: (_, record) => {
                if (record.StatusID === 2) {
                    return record.ID;
                } else {
                    return <span style={{ color: 'red' }}>{record.ID}</span>
                }
            }
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
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 150,
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
            title: t("Comment"),
            dataIndex: "Comment",
            key: "Comment",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
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
                                <i className="feather icon-edit action-icon" />
                            </Link>
                        </Tooltip>
                        {/* <Tooltip title={t("Accept")}>
                            <span onClick={() => acceptHandler(record.ID)}>
                                <i className="far fa-check-circle action-icon" />
                            </span>
                        </Tooltip>
                        <Tooltip title={t("NotAccept")}>
                            <span onClick={() => declineHandler(record.ID)}>
                                <i className="far fa-times-circle action-icon" />
                            </span>
                        </Tooltip> */}
                        {/* <Tooltip title={t("Print")}>
                            <span onClick={() => printRow(record.ID)}>
                                <i className="feather icon-printer action-icon" />
                            </span>
                        </Tooltip> */}
                        {/* <Tooltip title={t("Delete")}>
                            <Popconfirm
                                title={t("delete")}
                                onConfirm={() => deleteRowHandler(record.ID)}
                                okText={t("yes")}
                                cancelText={t("cancel")}
                            >
                                <span>
                                    <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                                </span>
                            </Popconfirm>
                        </Tooltip> */}
                        <Dropdown
                            placement='bottom'
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
        ClassRegisteryTitleServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', res.statusText)
                }
            })
            .catch((err) => {
                setConfirmLoading(false);
                Notification('error', err);
            });
    };

    const declineHandler = (id) => {
        setConfirmLoading(true);
        ClassRegisteryTitleServices.Cancel(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', res.statusText)
                }
            })
            .catch((err) => {
                setConfirmLoading(false)
                Notification('error', err)
            });
    };

    const printRow = (id) => {
        setConfirmLoading(true);
        ClassRegisteryTitleServices.PrintById(id)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "employee.pdf");
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
        ClassRegisteryTitleServices.delete(id)
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
            onContextMenu: event => {
                event.preventDefault()
                if (!tablePopup.visible) {
                    document.addEventListener(`click`, function onClickOutside() {
                        setTablePopup({ visible: false })
                        document.removeEventListener(`click`, onClickOutside);
                    });

                    document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
                        setTablePopup({ visible: false })
                        document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
                    })
                }
                setTablePopup({
                    record,
                    visible: true,
                    x: event.clientX,
                    y: event.clientY
                })
            }
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