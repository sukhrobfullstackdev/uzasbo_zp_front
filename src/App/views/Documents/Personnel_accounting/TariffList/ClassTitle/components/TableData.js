import React from 'react'
import { Space, Table, Tag, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import { Notification } from '../../../../../../../helpers/notifications';
import { setListPagination } from '../_redux/getListSlice';
import ClassTitleServices from '../../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitle.services';

const TableData = ({ tableData, total, match, reduxList, refresh }) => {
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
            width: 100,
            render: (_, record) => {
                if (record.StatusID === 2) {
                    return record.ID;
                } else {
                    return <span style={{ color: 'red' }}>{record.ID}</span>
                }
            }
        },
        {
            title: t("OrganizationName"),
            dataIndex: "OrganizationName",
            key: "OrganizationName",
            sorter: true,
            width: 150,
        },
        {
            title: t("StartYear"),
            dataIndex: "StartYear",
            key: "StartYear",
            sorter: true,
            width: 80,
        },
        {
            title: t("EndYear"),
            dataIndex: "EndYear",
            key: "EndYear",
            sorter: true,
            width: 80,
        },
        {
            title: t("Comment"),
            dataIndex: "Comment",
            key: "Comment",
            sorter: true,
            width: 150,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("Status"),
            dataIndex: "Status",
            key: "Status",
            sorter: true,
            width: 100,
            render: (_, record) => {
                if (record.StatusID === 13) {
                    return (
                        <Tag color='#87d068'>
                            {record.StatusName}
                        </Tag>
                    );
                }
                return (
                    <Tag color='#f50'>
                        {record.StatusName}
                    </Tag>
                );
            }
        },
        {
            title: t("BLHGType"),
            dataIndex: "BLHGTypeName",
            key: "BLHGTypeName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        {
            title: t("SpecializedSubjects"),
            dataIndex: "SpecializedSubjectsName",
            key: "SpecializedSubjectsName",
            sorter: true,
            width: 200,
            render: record => <div className="ellipsis-2">{record}</div>
        },
        // {
        //     title: t("Tip"),
        //     dataIndex: "Tip",
        //     key: "Tip",
        //     sorter: true,
        // },

        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 80,
            render: (record) => {
                return (
                    <Space size="middle">
                        <span onClick={() => printById(record.ID)}>
                            <i
                                className='feather icon-printer action-icon'
                                aria-hidden="true"
                            />
                        </span>
                        <Tooltip title={t("view")}>
                            <Link
                                to={`${match.path}/view/${record.ID}`}
                            >
                                <i
                                    className='feather icon-eye action-icon'
                                    aria-hidden="true"
                                />
                            </Link>
                        </Tooltip>
                    </Space>
                );
            },
        },
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

    const printById = (id) => {
        setConfirmLoading(true);
        ClassTitleServices.printById(id)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "ClassTitle.xlsx");
                document.body.appendChild(link);
                setConfirmLoading(false);
                link.click();
            })
            .catch(err => {
                Notification('error', err);
                setConfirmLoading(false);
            })
    }

    const onTableRow = (record) => {
        return {
            onDoubleClick: () => {
                history.push(`${match.path}/view/${record.ID}`);
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