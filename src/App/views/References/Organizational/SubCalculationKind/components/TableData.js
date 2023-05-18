import { Space, Table, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { setListPagination } from '../_redux/getListSlice';
import LeavePayDataModal from './Modals/LeavePayDataModal';

const TableData = ({ tableData, total, match }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    const subalcKindList = useSelector((state) => state.subalcKindList);
    let loading = subalcKindList?.listBegin;
    let pagination = subalcKindList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
        },
        {
            title: t("name"),
            dataIndex: "Name",
            key: "Name",
            sorter: true,
            width: 250,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("CalculationType"),
            dataIndex: "CalculationType",
            key: "CalculationType",
            sorter: true,
            width: 150
        },
        {
            title: t("TaxItem"),
            dataIndex: "TaxItem",
            key: "TaxItem",
            sorter: true,
            width: 150
        },
        {
            title: t("SalaryTransaction"),
            dataIndex: "SalaryTransaction",
            key: "SalaryTransaction",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Status"),
            dataIndex: "StateName",
            key: "StateName",
            sorter: true,
            width: 80,
        },
        {
            title: t("Vish"),
            dataIndex: "ParentName",
            key: "ParentName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("TPOwnerID"),
            dataIndex: "TPOwnerID",
            key: "TPOwnerID",
            width: 100,
            sorter: true,
        },
        {
            title: t("TPOwnerName"),
            dataIndex: "TPOwnerName",
            key: "TPOwnerName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("TPOwnerOrgName"),
            dataIndex: "TPOwnerOrgName",
            key: "TPOwnerOrgName",
            width: 100,
            sorter: true,
        },
        {
            title: t("CalculationMethod"),
            dataIndex: "CalculationMethod",
            key: "CalculationMethod",
            sorter: true,
            width: 150,
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: "right",
            width: 80,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("Edit")}>
                            <Link to={`${match.path}/edit/${record.ID}`}>
                                <i className='feather icon-edit action-icon' aria-hidden="true" />
                            </Link>
                        </Tooltip>
                        <Tooltip title={t("settings")}>
                            <span onClick={() => openSettingsModal({
                                DocumentID: record.ID, 
                                ParentID: record.ParentID,
                                Name: record.Name,
                            })}>
                                <i className='feather icon-settings action-icon' aria-hidden="true" />
                            </span>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const [leavePayDataModal, setLeavePayDataModal] = React.useState(false);
    const [leavePayDataParams, setLeavePayDataParams] = React.useState(null);
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

    };

    const openSettingsModal = (params) => {
        setLeavePayDataParams(params);
        setLeavePayDataModal(true);
    };

    const onSelect = (data) => {
        console.log(data);
    };

    return (
        <div>
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
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={leavePayDataModal}
                timeout={300}
            >
                <LeavePayDataModal
                    visible={leavePayDataModal}
                    params={leavePayDataParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setLeavePayDataModal(false);
                    }}
                />
            </CSSTransition>
        </div>
    )
}

export default TableData;