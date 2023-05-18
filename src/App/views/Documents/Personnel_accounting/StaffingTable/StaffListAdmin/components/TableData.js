import React from 'react'
import { Dropdown, Menu, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import { Notification } from '../../../../../../../helpers/notifications';
import { setListPagination } from '../_redux/getListSlice';
import StaffListServices from '../../../../../../../services/Documents/Personnel_accounting/StaffingTable/StaffList/StaffList.services';

const TableData = ({ tableData, total, match, reduxList, refresh, adminRole }) => {
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
            width: 120
        },
        {
            title: t("OblName"),
            dataIndex: "OblName",
            key: "OblName",
            sorter: true,
            width: 150
        },
        {
            title: t("RegName"),
            dataIndex: "RegName",
            key: "RegName",
            sorter: true,
            width: 150
        },
        {
            title: t("OrgFullName"),
            dataIndex: "OrgFullName",
            key: "OrgFullName",
            sorter: true,
            width: 150
        },
        {
            title: t("OrgINN"),
            dataIndex: "OrgINN",
            key: "OrgINN",
            sorter: true,
            width: 150
        },
        {
            title: t("Year"),
            dataIndex: "Year",
            key: "Year",
            sorter: true,
            width: 150
        },
        {
            title: t("SettleCode"),
            dataIndex: "SettleCode",
            key: "SettleCode",
            sorter: true,
            width: 150
        },
        {
            title: t("TotalSum"),
            dataIndex: "TotalSum",
            key: "TotalSum",
            sorter: true,
            width: 150
        },
        {
            title: t("DisplayName"),
            dataIndex: "DisplayName",
            key: "DisplayName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        // {
        //     title: t("actions"),
        //     key: "action",
        //     align: "center",
        //     fixed: 'right',
        //     width: 80,
        //     render: (record) => {
        //         return (
        //             <Space size="middle">
        //                 {/* <Tooltip title={t("Edit")}>
        //                     <Link to={`${match.path}/edit/${record.ID}`}>
        //                         <i className='feather icon-edit action-icon' aria-hidden="true" />
        //                     </Link>
        //                 </Tooltip> */}
        //                 <Dropdown
        //                     placement='bottom'
        //                     overlay={<Menu items={[
        //                         {
        //                             key: 'send',
        //                             label: (
        //                                 <span onClick={() => sendHandler(record.ID)}>
        //                                     <i className="far fa-share-square action-icon" />&nbsp;
        //                                     {t("Send")}
        //                                 </span>
        //                             ),
        //                         },
        //                         // {
        //                         //     key: 'print',
        //                         //     label: (
        //                         //         <span onClick={() => printHandler(record.ID)}>
        //                         //             <i className="feather icon-printer action-icon" />&nbsp;
        //                         //             {t("Print")}
        //                         //         </span>
        //                         //     ),
        //                         // },
        //                         {
        //                             key: 'accept',
        //                             label: (
        //                                 <span onClick={() => acceptHandler(record.ID)}>
        //                                     <i className="far fa-check-circle action-icon" />&nbsp;
        //                                     {t("Accept")}
        //                                 </span>
        //                             ),
        //                         },
        //                         {
        //                             key: 'notAccept',
        //                             label: (
        //                                 <span onClick={() => declineHandler(record.ID)}>
        //                                     <i className="far fa-times-circle action-icon" />&nbsp;
        //                                     {t("NotAccept")}
        //                                 </span>
        //                             ),
        //                         },
        //                         {
        //                             key: 'delete',
        //                             label: (
        //                                 <span onClick={() => deleteRowHandler(record.ID)}>
        //                                     <i className="feather icon-trash-2 action-icon" />&nbsp;
        //                                     {t("Delete")}
        //                                 </span>
        //                             ),
        //                         },
        //                     ]} />}
        //                 >
        //                     <i className='feather icon-list action-icon' aria-hidden="true" />
        //                 </Dropdown>
        //             </Space>
        //         );
        //     },
        // }
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

    const sendHandler = (id) => {
        setConfirmLoading(true);
        StaffListServices.SendHashStaffListRegistery(id)
            .then((res) => {
                if (res.status === 200) {
                    refresh()
                    setConfirmLoading(false)
                    Notification('success', t('edited'))
                }
            })
            .catch((err) => {
                Notification('error', err);
                setConfirmLoading(false);
            });
    };

    const acceptHandler = (id) => {
        setConfirmLoading(true);
        StaffListServices.AcceptStaffListRegistery(id)
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
        StaffListServices.CancelStaffListRegistery(id)
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

    const printHandler = (id) => {
        setConfirmLoading(true);
        StaffListServices.printById(id)
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
        StaffListServices.DeleteRegistery(id)
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
                    current: pagination.PageNumber,
                    pageSize: pagination.PageLimit,
                    total: total,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
            />
        </>
    )
}

export default TableData