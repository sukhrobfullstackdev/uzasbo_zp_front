import { Popconfirm, Space, Table, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../../helpers/notifications';
import OrganizationServices from '../../../../../../services/Documents/Admin/Organization/Organization.services';
import { setListPagination } from '../_redux/organizationsSlice';

const TableOrganizations = ({ tableData, total, match }) => {

    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    const organizationList = useSelector((state) => state.organizationList);
    let loading = organizationList?.listBegin;
    let organizationListPagination = organizationList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
        },
        {
            title: t("OrgFullName"),
            dataIndex: "OrgFullName",
            key: "OrgFullName",
            sorter: true,
            width: 300,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("OrgINN"),
            dataIndex: "OrgINN",
            key: "OrgINN",
            width: 150,
            sorter: true,
        },
        {
            title: t("OrgType"),
            dataIndex: "OrgType",
            key: "OrgType",
            sorter: true,
            width: 120
        },
        {
            title: t("RegName"),
            dataIndex: "RegName",
            key: "RegName",
            sorter: true,
            width: 120
        },
        {
            title: t("StateID"),
            dataIndex: "StateID",
            key: "StateID",
            sorter: true,
            width: 100
        },
        {
            title: t("OblName"),
            dataIndex: "OblName",
            key: "OblName",
            sorter: true,
            width: 100
        },
        {
            title: t("HeaderFromBalance"),
            dataIndex: "HeaderFromBalance",
            key: "HeaderFromBalance",
            sorter: true,
            width: 250,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("HeaderID"),
            dataIndex: "HeaderID",
            key: "HeaderID",
            sorter: true,
            width: 150,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 110,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("Organization Edit")}>
                            <span onClick={() => {
                                history.push(`${match.path}/edit/${record.ID}`);
                            }}>
                                <i className="feather icon-edit action-icon" />
                            </span>
                        </Tooltip>
                        <Popconfirm
                            title='Снять ожидающий запрос ?'
                            onConfirm={() => userJobCleanerHandler(record.ID)}
                            okText={t("yes")}
                            cancelText={t("cancel")}
                        >
                            <span>
                                <i className="feather icon-delete action-icon"></i>
                            </span>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];

    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const userJobCleanerHandler = (id) => {
        setConfirmLoading(true);
        OrganizationServices.userJobCleaner(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', t('edited'));
                };
                setConfirmLoading(false);
            })
            .catch((err) => {
                setConfirmLoading(false);
                Notification('error', err);
            });
    }

    function handleTableChange(pagination, filters, sorter, extra) {
        // console.log('params', pagination, filters, sorter, extra);
        const { field, order } = sorter;
        // console.log(field, order?.slice(0, -3));

        dispatch(
            setListPagination({
                OrderType: order?.slice(0, -3),
                SortColumn: field,
                PageNumber: pagination.current,
                PageLimit: pagination.pageSize,
            })
        );

    }

    return (
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
                current: organizationListPagination.PageNumber,
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
    )
}

export default TableOrganizations;