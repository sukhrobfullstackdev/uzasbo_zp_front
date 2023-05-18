import React, { useState } from 'react'
import { Space, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';

import { setListPagination } from '../_redux/usersSlice';
import UserRoleModal from './UserRoleModal';
import { Notification } from '../../../../../../helpers/notifications';
import UserServices from '../../../../../../services/Documents/Admin/User/User.services';
import { CSSTransition } from 'react-transition-group';

const TableUsers = ({ tableData, total }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const loading = useSelector((state) => state.userList?.listBegin);
    const userListPagination = useSelector((state) => state.userList?.paginationData);

    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [docID, setDocID] = useState(null);

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 80
        },
        {
            title: t("Name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 130,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("fullname"),
            dataIndex: "DisplayName",
            key: "DisplayName",
            width: 150,
            sorter: true,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("VerifyEDS"),
            dataIndex: "VerifyEDS",
            key: "VerifyEDS",
            sorter: true,
            width: 120
        },
        {
            title: t("INN"),
            dataIndex: "INN",
            key: "INN",
            sorter: true,
            width: 120
        },
        {
            title: t("status"),
            dataIndex: "State",
            key: "State",
            sorter: true,
            width: 100,
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
            title: t("Organization"),
            dataIndex: "Organization",
            key: "Organization",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("OrganizationID"),
            dataIndex: "OrganizationID",
            key: "OrganizationID",
            sorter: true,
            width: 110,
        },
        {
            title: t("LastAccessTime"),
            dataIndex: "LastAccessTime",
            key: "LastAccessTime",
            sorter: true,
            width: 150,
        },
        {
            title: t("LastIP"),
            dataIndex: "LastIP",
            key: "LastIP",
            sorter: true,
            width: 110,
        },
        {
            title: t("Email"),
            dataIndex: "Email",
            key: "Email",
            sorter: true,
            width: 110,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 120,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("role")}>
                            <span onClick={() => showRoleModal(record.ID)}>
                                <i className="feather icon-sliders action-icon" />
                            </span>
                        </Tooltip>
                        <Tooltip title={t("changeEDS")}>
                            <span onClick={() => ChangeEDSCommand(record.ID)}>
                                <i className="feather icon-edit action-icon" />
                            </span>
                        </Tooltip>
                        <Tooltip title={t("createTemplates")}>
                            <span onClick={() => CreateTemplatesCommand(record.ID)}>
                                <i className="feather icon-list action-icon" />
                            </span>
                        </Tooltip>
                    </Space>
                );
            },
        },

    ];

    const ChangeEDSCommand = (id) => {
        setConfirmLoading(true);
        UserServices.ChangeEDS(id)
            .then(response => {
                setConfirmLoading(false);
                Notification('success', response.data);
                dispatch(setListPagination(userListPagination));
            }).catch(error => {
                Notification('error', error);
                setConfirmLoading(false);
            });
    };

    const CreateTemplatesCommand = (id) => {
        setConfirmLoading(true);
        UserServices.CreateTemplates(id)
            .then(response => {
                setConfirmLoading(false);
                Notification('success', response.data);
                dispatch(setListPagination(userListPagination));
            }).catch(error => {
                Notification('error', error);
                setConfirmLoading(false);
            });
    }

    function handleTableChange(pagination, filters, sorter, extra) {
        const { field, order } = sorter;
        // console.log(pagination);

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );
    };

    const showRoleModal = (id) => {
        setIsModalVisible(true);
        setDocID(id);
    };

    const closeRoleModal = (id) => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Table
                bordered
                size='middle'
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
                    current: userListPagination.PageNumber,
                    showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
            />

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={isModalVisible}
                timeout={300}
            >
                <UserRoleModal
                    id={docID}
                    visible={isModalVisible}
                    onCancel={closeRoleModal}
                />
            </CSSTransition>
        </>
    )
}

export default TableUsers;