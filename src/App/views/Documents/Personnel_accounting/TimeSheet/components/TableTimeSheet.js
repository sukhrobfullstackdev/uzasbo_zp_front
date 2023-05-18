import React, { useState } from 'react'
import { Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import TimeSheetServices from "../../../../../../services/Documents/Personnel_accounting/TimeSheet/TimeSheet.services";
import { getListStartAction, setListPagination } from '../_redux/TimeSheetSlice';
import { Notification } from '../../../../../../helpers/notifications';

const TableTimeSheet = ({ tableData, total, match, startDate }) => {
    const { t } = useTranslation();
    const totalReqRecCashRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');
    const dispatch = useDispatch();
    const history = useHistory();

    const loading = useSelector((state) => state.timeSheetList?.listBegin);
    const pagination = useSelector((state) => state.timeSheetList?.paginationData);
    const filter = useSelector((state) => state.timeSheetList?.filterData);

    const [confirmLoading, setConfirmLoading] = useState(false);

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
            width: 80
        },
        {
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
        },
        {
            title: t("SheetType"),
            dataIndex: "SheetType",
            key: "SheetType",
            sorter: true,
            // width: 130
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
            title: t("SettleCode"),
            dataIndex: "SettleCode",
            key: "SettleCode",
            sorter: true,
            width: 150
        },
        {
            title: t("Division"),
            dataIndex: "DivName",
            key: "DivName",
            sorter: true,
            width: 160,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("DprName"),
            dataIndex: "DprName",
            key: "DprName",
            sorter: true,
            width: 160,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("DateOfModified"),
            dataIndex: "DateOfModified",
            key: "DateOfModified",
            sorter: true,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            render: (record) => {
                return (
                    <Space size="middle">

                        {totalReqRecCashRole &&
                            <>
                                <Tooltip title={t("Accept")}>
                                    <span onClick={() => acceptHandler(record.ID)}>
                                        <i className="far fa-check-circle action-icon" />
                                    </span>
                                </Tooltip>

                                <Tooltip title={t("NotAccept")}>
                                    <span onClick={() => declineHandler(record.ID)}>
                                        <i className="far fa-times-circle action-icon" />
                                    </span>
                                </Tooltip>
                            </>
                        }
                        {/* <Tooltip title={t("Accept")}>
                        <span onClick={() => this.acceptHandler(record.ID)}>
                            <i className="far fa-check-circle action-icon" />
                        </span>
                        </Tooltip>
        
                        <Tooltip title={t('NotAccept')}>
                        <span onClick={() => this.declineHandler(record.ID)}>
                            <i className="far fa-times-circle action-icon" />
                        </span>
                        </Tooltip> */}

                        {/* <Tooltip title={t("Edit")}>
                        <Link to={`${this.props.match.path}/edit/${record.ID}`}>
                            <i className='feather icon-edit action-icon' aria-hidden="true" />
                        </Link>
                        </Tooltip> */}
 
                        <Tooltip title={t("Print")}>
                            <span onClick={() => printHandler(record.ID)}>
                                <i className='feather icon-printer action-icon' aria-hidden="true" />
                            </span>
                        </Tooltip>

                        <Tooltip title={`${t("Print")} 2`}>
                            <span onClick={() => printMFHandler(record.ID)}>
                                <i className='feather icon-printer action-icon' aria-hidden="true" />
                            </span>
                        </Tooltip>

                        <Popconfirm
                            title={t('delete')}
                            okText={t('yes')}
                            cancelText={t('cancel')}
                            onConfirm={() => deleteRowHandler(record.ID)}
                        >
                            <Tooltip title={t("Delete")}>
                                <span>
                                    <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                                </span>
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    function handleTableChange(pagination, filters, sorter) {
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
        TimeSheetServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', t('accepted'));
                    dispatch(getListStartAction({
                        ...filter,
                        ...pagination,
                    }));
                    setConfirmLoading(false);
                }
            })
            .catch((err) => {
                Notification('error', err);
                setConfirmLoading(false);
            });
    };

    const declineHandler = (id) => {
        setConfirmLoading(true);
        TimeSheetServices.NotAccept(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', t('notAccepted'));
                    dispatch(getListStartAction({
                        ...filter,
                        ...pagination,
                    }));
                    setConfirmLoading(false);
                }
            })
            .catch((err) => {
                Notification('error', err);
                setConfirmLoading(false);
            });
    };

    const deleteRowHandler = (id) => {
        setConfirmLoading(true);
        TimeSheetServices.delete(id)
            .then((res) => {
                console.log(res);
                if (res.status === 200) {
                    Notification('success', t("deleted"));
                    dispatch(getListStartAction({
                        ...filter,
                        ...pagination,
                    }));
                    setConfirmLoading(false);
                }
            })
            .catch((err) => {
                Notification('error', err);
                setConfirmLoading(false);
            });
    };

    const printHandler = (id) => {
        setConfirmLoading(true);
        TimeSheetServices.printById(id)
            .then(res => {
                if (res.status === 200) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "UZAsbo_Salary.xlsx");
                    document.body.appendChild(link);
                    link.click();
                    setConfirmLoading(false);
                }
            })
            .catch(err => {
                Notification('error', err);
                setConfirmLoading(false);
            })
    };

    const printMFHandler = () => {
        setConfirmLoading(true);
        TimeSheetServices.printMF({
            Month: startDate.format('MM.DD.YYYY').slice(0,2),
            Year: startDate.format('MM.DD.YYYY').slice(6,10),
        })
            .then(res => {
                if (res.status === 200) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", "UZAsbo_Salary_MF.xlsx");
                    document.body.appendChild(link);
                    link.click();
                    setConfirmLoading(false);
                }
            })
            .catch(err => {
                Notification('error', err);
                setConfirmLoading(false);
            })
    };

    return (
        <>
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
        </>
    )
};

export default TableTimeSheet;