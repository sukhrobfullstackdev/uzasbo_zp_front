import { Space, Table, Tag, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    const appointQualCategoryList = useSelector((state) => state.appointQualCategoryList);
    let loading = appointQualCategoryList?.listBegin;
    let pagination = appointQualCategoryList?.paginationData;

    const columns = [
        {
            title: t("id"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100,
        },
        {
            title: t("EmployeeName"),
            dataIndex: "EmployeeName",
            key: "EmployeeName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("PositionQualificationName"),
            dataIndex: "PositionQualificationName",
            key: "PositionQualificationName",
            sorter: true,
            width: 200,
        },
        {
            title: t("SubjectName"),
            dataIndex: "SubjectName",
            key: "SubjectName",
            sorter: true,
            width: 200,
        },
        {
            title: t("StartDate"),
            dataIndex: "StartDate",
            key: "StartDate",
            sorter: true,
            width: 100,
        },
        {
            title: t("DocDate"),
            dataIndex: "DocDate",
            key: "DocDate",
            sorter: true,
            width: 100,
        },
        {
            title: t("DocumentNumber"),
            dataIndex: "DocumentNumber",
            key: "DocumentNumber",
            sorter: true,
            width: 100,
        },
        {
            title: t("DocumentSeries"),
            dataIndex: "DocumentSeries",
            key: "DocumentSeries",
            sorter: true,
            width: 100,
        },
        {
            title: t("DetailInfo"),
            dataIndex: "DetailInfo",
            key: "DetailInfo",
            sorter: true,
            width: 100,
        },
        {
            title: t("DocNumber"),
            dataIndex: "DocNumber",
            key: "DocNumber",
            sorter: true,
            width: 100,
        },
        {
            title: t("Organization"),
            dataIndex: "GivenOrganization",
            key: "GivenOrganization",
            sorter: true,
            width: 100,
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 100,
            render: (_, record) => {
                if (record.StatusID === 2) {
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
            width: 100,
            render: (record) => {
                return (
                    <Space size="middle">
                        <Tooltip title={t("Edit")}>
                            <span onClick={() => {
                                history.push(`${match.path}/edit/${record.ID}`);
                            }}>
                                <i className="feather icon-edit action-icon" />
                            </span>
                        </Tooltip>
                    </Space>
                );
            },
        },
    ];

    const [confirmLoading, setConfirmLoading] = React.useState(false);

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
    )
}

export default TableData