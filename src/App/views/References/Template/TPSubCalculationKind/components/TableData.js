import { Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const tpSubcalcKindList = useSelector((state) => state.tpSubcalcKindList);
    let loading = tpSubcalcKindList?.listBegin;
    let pagination = tpSubcalcKindList?.paginationData;

    const columns = [
        {
            title: t("ID"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 80
        },

        {
            title: t("Vish"),
            dataIndex: "Vish",
            key: "Vish",
            sorter: true,
            width: 250
        },
        {
            title: t("DpName"),
            dataIndex: "DpName",
            key: "DpName",
            sorter: true,
            width: 150
        },
        {
            title: t("SubCalcName"),
            dataIndex: "SubCalcName",
            key: "SubCalcName",
            sorter: true,
            width: 250
        },
        {
            title: t("NormativeAct"),
            dataIndex: "NormativeAct",
            key: "NormativeAct",
            sorter: true,
            width: 250

        },
        {
            title: t("ShortNameUzb"),
            dataIndex: "ShortNameUzb",
            key: "ShortNameUzb",
            sorter: true,
            width: 150

        }, {
            title: t("ShortNameRus"),
            dataIndex: "ShortNameRus",
            key: "ShortNameRus",
            sorter: true,
            width: 150

        },
        {
            title: t('Status'),
            dataIndex: 'Status',
            key: 'Status',
            width: '12%',
            render: (status) => {
                if (status === "Актив") {
                    return (<Tag color="#87d068" key={status}>{status}</Tag>)
                } else if (status === "Пассив") {
                    return (<Tag color="#f50" key={status}>{status}</Tag>)
                }
            }
        },
        {
            title: t("actions"),
            key: "action",
            align: "center",
            fixed: 'right',
            width: 90,
            render: (record) => {
                return (
                    <Space size="middle">
                        {adminViewRole && (
                            <Link
                                to={`${match.path}/edit/${record.ID}`}
                            >
                                <i
                                    className='feather icon-edit action-icon'
                                    aria-hidden="true"
                                />
                            </Link>
                            /* <Popconfirm
                                title={t("delete")}
                                onConfirm={() => deleteRowHandler(record.ID)}
                            >
                                <span>
                                    <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                                </span>
                            </Popconfirm> */
                        )}
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

    const deleteRowHandler = () => {
        console.log("deleteRowHandler");
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

export default React.memo(TableData);