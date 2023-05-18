import React from 'react'
import { Dropdown, Menu, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import { Notification } from '../../../../../../../helpers/notifications';
import { setListPagination } from '../_redux/getListSlice';
import BillingListServices from "./../../../../../../../services/Documents/Personnel_accounting/TariffList/BillingList/BillingList.services";

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
            title: t("Date"),
            dataIndex: "Date",
            key: "Date",
            sorter: true,
            width: 150
        },
        {
            title: t("Number"),
            dataIndex: "Number",
            key: "Number",
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
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 150,
            render: (_, record) => {
                if (record.StatusID === 2 || record.StatusID === 13) {
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
            title: t("TotalSum"),
            dataIndex: "TotalSum",
            key: "TotalSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
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
                        {/* <Tooltip title={t("Send")}>
                            <span onClick={() => sendHandler(record.ID)}>
                                <i className="far fa-share-square action-icon"></i>
                            </span>
                        </Tooltip> */}
                        {/* <Tooltip title={t("Print")}>
                            <span onClick={() => printHandler(record.ID)}>
                                <i className='feather icon-printer action-icon' aria-hidden="true" />
                            </span>
                        </Tooltip>
                        <Tooltip title={t("Accept")}>
                            <span onClick={() => acceptHandler(record.ID)}>
                                <i className="far fa-check-circle action-icon" />
                            </span>
                        </Tooltip>
                        <Tooltip title={t("NotAccept")}>
                            <span onClick={() => declineHandler(record.ID)}>
                                <i className="far fa-times-circle action-icon" />
                            </span>
                        </Tooltip> */}
                        <Tooltip title={t("Edit")}>
                            <Link to={`${match.path}/edit/${record.ID}`}>
                                <i className='feather icon-edit action-icon' aria-hidden="true" />
                            </Link>
                        </Tooltip>
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
                                    key: 'send',
                                    label: (
                                        <span onClick={() => sendHandler(record.ID)}>
                                            <i className="far fa-share-square action-icon" />&nbsp;
                                            {t("Send")}
                                        </span>
                                    ),
                                },
                                {
                                    key: 'print',
                                    label: (
                                        <span onClick={() => printHandler(record.ID)}>
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
        }
    ];

    const columnsAdmin = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 120
        },
        {
            title: t("OrgName"),
            dataIndex: "OrgName",
            key: "OrgName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("OrgINN"),
            dataIndex: "OrgINN",
            key: "OrgINN",
            sorter: true,
            width: 120
        },
        {
            title: t("OblName"),
            dataIndex: "OblName",
            key: "OblName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("RegName"),
            dataIndex: "RegName",
            key: "RegName",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Year"),
            dataIndex: "Year",
            key: "Year",
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
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 120,
            render: (_, record) => {
                if (record.StatusID === 2 || record.StatusID === 13) {
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
            title: t("TotalSum"),
            dataIndex: "TotalSum",
            key: "TotalSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowanceClassGuidance"),
            dataIndex: "AllowanceClassGuidance",
            key: "AllowanceClassGuidance",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowanceElementaryCheckNoteBook"),
            dataIndex: "AllowanceElementaryCheckNoteBook",
            key: "AllowanceElementaryCheckNoteBook",
            sorter: true,
            width: 170,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowanceForProfessionalitySum"),
            dataIndex: "AllowanceForProfessionalitySum",
            key: "AllowanceForProfessionalitySum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowanceForeignLanguageSum"),
            dataIndex: "AllowanceForeignLanguageSum",
            key: "AllowanceForeignLanguageSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowanceHasInformaticsCabinetSum"),
            dataIndex: "AllowanceHasInformaticsCabinetSum",
            key: "AllowanceHasInformaticsCabinetSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowanceInDepthSum"),
            dataIndex: "AllowanceInDepthSum",
            key: "AllowanceInDepthSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowanceIslamicUnivSum"),
            dataIndex: "AllowanceIslamicUnivSum",
            key: "AllowanceIslamicUnivSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowanceMountainousPlacesSum"),
            dataIndex: "AllowanceMountainousPlacesSum",
            key: "AllowanceMountainousPlacesSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowancePhysicalEducationSum"),
            dataIndex: "AllowancePhysicalEducationSum",
            key: "AllowancePhysicalEducationSum",
            sorter: true,
            width: 180,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("AllowanceSeniorCheckNoteBook"),
            dataIndex: "AllowanceSeniorCheckNoteBook",
            key: "AllowanceSeniorCheckNoteBook",
            sorter: true,
            width: 170,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("DirectorsFundSuperTeacherSum"),
            dataIndex: "DirectorsFundSuperTeacherSum",
            key: "DirectorsFundSuperTeacherSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("ElementaryClassTeachingLoad"),
            dataIndex: "ElementaryClassTeachingLoad",
            key: "ElementaryClassTeachingLoad",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("ElementaryClassTeachingLoadSum"),
            dataIndex: "ElementaryClassTeachingLoadSum",
            key: "ElementaryClassTeachingLoadSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("ElementaryClassWorkLoad"),
            dataIndex: "ElementaryClassWorkLoad",
            key: "ElementaryClassWorkLoad",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("ElementaryClassWorkLoadSum"),
            dataIndex: "ElementaryClassWorkLoadSum",
            key: "ElementaryClassWorkLoadSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("ForeignLangSum"),
            dataIndex: "ForeignLangSum",
            key: "ForeignLangSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("HonoredTeacherSum"),
            dataIndex: "HonoredTeacherSum",
            key: "HonoredTeacherSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("IndTraingClassWorkLoad"),
            dataIndex: "IndTraingClassWorkLoad",
            key: "IndTraingClassWorkLoad",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("IndTraingClassWorkLoadSum"),
            dataIndex: "IndTraingClassWorkLoadSum",
            key: "IndTraingClassWorkLoadSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("JuniorClassTeachingLoad"),
            dataIndex: "JuniorClassTeachingLoad",
            key: "JuniorClassTeachingLoad",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("JuniorClassWorkLoadSum"),
            dataIndex: "JuniorClassWorkLoadSum",
            key: "JuniorClassWorkLoadSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("LongServicePaymentSum"),
            dataIndex: "LongServicePaymentSum",
            key: "LongServicePaymentSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("NaturalSciencesSum"),
            dataIndex: "NaturalSciencesSum",
            key: "NaturalSciencesSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("OlympicsSum"),
            dataIndex: "OlympicsSum",
            key: "OlympicsSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("RedSchoolSum"),
            dataIndex: "RedSchoolSum",
            key: "RedSchoolSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("RemoteRegionSum"),
            dataIndex: "RemoteRegionSum",
            key: "RemoteRegionSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("ScienceCandidateSum"),
            dataIndex: "ScienceCandidateSum",
            key: "ScienceCandidateSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("SeniorClassTeachingLoad"),
            dataIndex: "SeniorClassTeachingLoad",
            key: "SeniorClassTeachingLoad",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("SeniorClassTeachingLoadSum"),
            dataIndex: "SeniorClassTeachingLoadSum",
            key: "SeniorClassTeachingLoadSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("SeniorClassWorkLoad"),
            dataIndex: "SeniorClassWorkLoad",
            key: "SeniorClassWorkLoad",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        },
        {
            title: t("SeniorClassWorkLoadSum"),
            dataIndex: "SeniorClassWorkLoadSum",
            key: "SeniorClassWorkLoadSum",
            sorter: true,
            width: 150,
            render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
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
                        <Tooltip title={t("Print")}>
                            <span onClick={() => printHandler(record.ID)}>
                                <i className='feather icon-printer action-icon' aria-hidden="true" />
                            </span>
                        </Tooltip>
                    </Space>
                );
            },
        }
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
        BillingListServices.Send(id)
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
        BillingListServices.Accept(id)
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
        BillingListServices.NotAccept(id)
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
        BillingListServices.printById(id)
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
        BillingListServices.delete(id)
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
                columns={adminRole ? columnsAdmin : columns}
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