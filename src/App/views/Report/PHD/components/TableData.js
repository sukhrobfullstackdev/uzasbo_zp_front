import React from 'react'
import { Dropdown, Menu, Space, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
// import { useHistory, Link } from 'react-router-dom';

import { Notification } from '../../../../../helpers/notifications';
import { setListPagination } from '../_redux/getListSlice';
import EmployeeServices from '../../../../../services/References/Organizational/Employee/employee.services';

const TableData = ({ tableData, total, match, reduxList, refresh }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    // const history = useHistory();

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const columns = [
        {
            title: t("PNFL"),
            dataIndex: "PNFL",
            key: "PNFL",
            sorter: true,
            width: 80,
        },
        {
            title: t("FullName"),
            dataIndex: "FullName",
            key: "FullName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Degree"),
            dataIndex: "Degree",
            key: "Degree",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("diploma"),
            dataIndex: "DiplomNumber",
            key: "DiplomNumber",
            sorter: true,
            width: 120,
        },
        {
            title: t("ConfirmedDate"),
            dataIndex: "ConfirmedDate",
            key: "ConfirmedDate",
            sorter: true,
            width: 120,
        },
        {
            title: t("Position"),
            dataIndex: "Position",
            key: "Position",
            sorter: true,
            width: 120
        },
        {
            title: t("ScienceSector"),
            dataIndex: "ScienceSector",
            key: "ScienceSector",
            sorter: true,
            width: 120,
            render: record => <div className="ellipsis-2">{record}</div>
        },

        {
            title: t("Speciality"),
            dataIndex: "Speciality",
            key: "Speciality",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("ThemeName"),
            dataIndex: "ThemeName",
            key: "ThemeName",
            sorter: true,
            width: 250,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Place"),
            dataIndex: "Place",
            key: "Place",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("WorkPlace"),
            dataIndex: "WorkPlace",
            key: "ThemeName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        // {
        //     title: t("actions"),
        //     key: "action",
        //     align: "center",
        //     fixed: 'right',
        //     render: (record) => {
        //         return (
        //             <Space size="middle">
        //                 <Tooltip title={t("Edit")}>
        //                     <Link
        //                         to={`${match.path}/edit/${record.ID}`}
        //                     >
        //                         <i
        //                             className='feather icon-edit action-icon'
        //                             aria-hidden="true"
        //                         />
        //                     </Link>
        //                 </Tooltip>
        //                 <Dropdown
        //                     placement='bottom'
        //                     overlay={<Menu items={[
        //                         {
        //                             key: 'print',
        //                             label: (
        //                                 <span onClick={() => printById(record.ID)}>
        //                                     <i className="feather icon-printer action-icon" />&nbsp;
        //                                     {t("Print")}
        //                                 </span>
        //                             ),
        //                         },
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
        // },
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
        EmployeeServices.Accept(id)
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
        EmployeeServices.NotAccept(id)
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
        EmployeeServices.printById(id)
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
        EmployeeServices.delete(id)
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

    // const onTableRow = (record) => {
    //     return {
    //         onDoubleClick: () => {
    //             history.push(`${match.path}/edit/${record.ID}`);
    //         },
    //     };
    // }

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
                // onRow={(record) => onTableRow(record)}
                scroll={{
                    x: 'max-content',
                    y: '50vh'
                }}
                pagination={{
                    ...pagination,
                    total: tableData.length,
                    // showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
            />
        </>
    )
}

export default TableData