import React from 'react'
import { Dropdown, Input, Menu, Modal, Space, Table, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Notification } from '../../../../../../../helpers/notifications';
import { setListPagination } from '../_redux/getListSlice';
import StaffListServices from '../../../../../../../services/Documents/Personnel_accounting/StaffingTable/StaffList/StaffList.services';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const TableData = ({ tableData, total, reduxList, refresh }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const StaffListAcceptMinFin = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('StaffListAcceptMinFin');

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [description, setDescription] = React.useState('');

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
            dataIndex: "OrgName",
            key: "OrgName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
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
            dataIndex: "INN",
            key: "INN",
            sorter: true,
            width: 150
        },
        {
            title: t("Year"),
            dataIndex: "Year",
            key: "Year",
            sorter: true,
            width: 100
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
            title: t("SettlementAccount"),
            dataIndex: "SettlementAccount",
            key: "SettlementAccount",
            sorter: true,
            width: 150
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 100,
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
                        <Dropdown
                            placement='bottom'
                            overlay={<Menu items={[
                                ...[StaffListAcceptMinFin && {
                                    key: 'accept',
                                    label: (
                                        <span onClick={() => acceptHandler(record.ID, record.TableID)}>
                                            <i className="far fa-check-circle action-icon" />&nbsp;
                                            {t("Accept")}
                                        </span>
                                    ),
                                }],
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
                                    key: 'print',
                                    label: (
                                        <span onClick={() => printHandler(record.ID, record.TableID)}>
                                            <i className="feather icon-printer action-icon" />&nbsp;
                                            {t("Print")}
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

    const acceptHandler = (id, tableId) => {
        setConfirmLoading(true);
        StaffListServices.Received(id, tableId)
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
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: <div>
                <div>{t('Description')}</div>
                <Input
                    style={{ marginTop: 32 }}
                    name="Description"
                    placeholder={t('Description')}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>,
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                setConfirmLoading(true);
                StaffListServices.CancelStaffListRegistery(id, description)
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
            },
            onCancel() {
                // console.log("Cancel");
            }
        });
    };

    const printHandler = (id, tableId) => {
        setConfirmLoading(true);
        StaffListServices.PrintStaffList2(id, tableId)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "PrintStaffList2.xlsx");
                document.body.appendChild(link);
                setConfirmLoading(false);
                link.click();
            })
            .catch(err => {
                Notification('error', err);
                setConfirmLoading(false);
            })
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
                // onRow={(record) => onTableRow(record)}
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