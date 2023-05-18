import { Table, Tag, Space, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setListPagination } from '../_redux/prefOrgsSlice';

const TablePrefOrgs = ({ tableData, total, match, superAdminViewRole }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    console.log(tableData)
    const prefOrgsList = useSelector((state) => state.prefOrgsList);
    let loading = prefOrgsList?.listBegin;
    let pagination = prefOrgsList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100
        },
        {
            title: t("OrganizationName"),
            dataIndex: "OrganizationName",
            key: "OrganizationName",
            sorter: true,
            width: 130,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("BenefitTypeName"),
            dataIndex: "BenefitTypeName",
            key: "BenefitTypeName",
            width: 150,
            sorter: true,
        },
        {
            title: t("oblastname"),
            dataIndex: "oblastname",
            key: "oblastname",
            sorter: true,
            width: 120
        },
        {
            title: t("regionname"),
            dataIndex: "regionname",
            key: "regionname",
            sorter: true,
            width: 120
        },
        {
            title: t("State"),
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
            title: t("DateOfCreated"),
            dataIndex: "DateOfCreated",
            key: "DateOfCreated",
            sorter: true,
            width: 100
        },

        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 110,
            render: (record) => {
                if(superAdminViewRole){
                    return (
                        <Space size="middle">
                            <Tooltip title={t("Organization Edit")}>
                                <span onClick={() => {
                                    history.push(`${match.path}/edit/${record.ID}`);
                                }}>
                                    <i className="feather icon-edit action-icon" />
                                </span>
                            </Tooltip>
                            
                        </Space>
                    );
                }
            },
        },

    ];

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
            loading={loading}
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
                ...pagination,
                showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            onRow={(record) => {
                if(superAdminViewRole){
                    return {
                        onDoubleClick: () => {
                            history.push(`${match.path}/edit/${record.ID}`);
                        },
                    };  
                }
            }}
        />
    )
}

export default TablePrefOrgs