import React from 'react'
import { Dropdown, Space, Table, Tag, Tooltip, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useHistory, Link } from 'react-router-dom';

import SickListServices from '../../../../../../services/Documents/Payroll/SickList/SickList.services';
import { Notification } from '../../../../../../helpers/notifications';
import TableRightClick from '../TableRightClick';
import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match, reduxList, refresh }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const location = useLocation();

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
        },
        {
            title: t("IssueDate"),
            dataIndex: "IssueDate",
            key: "IssueDate",
            sorter: true,
        },
        {
            title: t("Seria"),
            dataIndex: "Seria",
            key: "Seria",
            sorter: true,
            width: 80
        },
        {
            title: t("SickNumber"),
            dataIndex: "SickNumber",
            key: "SickNumber",
            sorter: true,
            width: 110
        },
        {
            title: t("BeginDate"),
            dataIndex: "BeginDate",
            key: "BeginDate",
            sorter: true,
        },
        {
            title: t("endDate"),
            dataIndex: "EndDate",
            key: "EndDate",
            sorter: true,
            width: 100
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
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
            title: t("Sum"),
            dataIndex: "Sum",
            key: "Sum",
            width: 100,
            sorter: true,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
        },
        {
            title: t("FullName"),
            dataIndex: "FullName",
            key: "FullName",
            sorter: true,
        },
        {
            title: t("SubcName"),
            dataIndex: "SubcName",
            key: "SubcName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("personnelNumber"),
            dataIndex: "PersonnelNumber",
            key: "PersonnelNumber",
            sorter: true,
            width: 100
        },
        {
            title: t("DivName"),
            dataIndex: "DivName",
            key: "DivName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("DprName"),
            dataIndex: "DprName",
            key: "DprName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("SettleCode"),
            dataIndex: "SettleCode",
            key: "SettleCode",
            sorter: true,
        },
        {
            title: t("calcType"),
            dataIndex: "CalcTypeName",
            key: "CalcTypeName",
            width: 200,
            sorter: true,
            render: record => <div className="ellipsis-2">{record}</div>
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

                        <Dropdown
                            placement='bottom'
                            overlay={<Menu items={[
                                // {
                                //     key: 'edit',
                                //     label: (
                                //         <Link to={`${location.pathname}/edit/${record.ID}`}>
                                //             <i className='feather icon-edit action-icon' aria-hidden="true" />&nbsp;
                                //             {t('Edit')}
                                //         </Link>
                                //     ),
                                // },
                                {
                                    key: 'accept',
                                    label: (
                                        <span onClick={() => printRow(record.ID)}>
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
                                            <i className="far fa-check-circle action-icon" />&nbsp;
                                            {t("NotAccept")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'delete',
                                    label: (
                                        <span onClick={() => deleteRowHandler(record.ID)}>
                                            <i className="far fa-check-circle action-icon" />&nbsp;
                                            {t("Delete")}
                                        </span>
                                    ),
                                },
                                // {
                                //     key: 'clone',
                                //     label: (
                                //         <Link to={`${location.pathname}/add?id=${record.ID}&IsClone=true`}>
                                //             <i className="far fa-clone action-icon" />&nbsp;
                                //             {t("clone")}
                                //         </Link>
                                //     ),
                                // },
                                
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
        SickListServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', t('saved'))
                }
            })
            .catch((err) => {
                setConfirmLoading(false);
                Notification('error', err);
            });
    };

    const declineHandler = (id) => {
        setConfirmLoading(true);
        SickListServices.NotAccept(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', t('saved'))
                }
            })
            .catch((err) => {
                setConfirmLoading(false)
                Notification('error', err)
            });
    };

    const printRow = (id) => {
        setConfirmLoading(true);
        SickListServices.printRow(id)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "SickList.pdf");
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
        SickListServices.delete(id)
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
            <TableRightClick
                {...tablePopup}
                deleteRow={deleteRowHandler}
                accept={acceptHandler}
                notAccept={declineHandler}
                parentPath={match.path}
                printRow={printRow}
            />
        </>
    )
}

export default TableData