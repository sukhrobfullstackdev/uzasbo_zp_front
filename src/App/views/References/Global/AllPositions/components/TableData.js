import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, Space, Table } from 'antd';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../../helpers/notifications';
import AllPositionsServices from '../../../../../../services/References/Global/AllPositions/AllPositions.services';

import { setListPagination } from '../_redux/getListSlice';

const TableData = ({ tableData, total, match, openUpdateModal, reduxList }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    let loading = reduxList?.listBegin;
    let pagination = reduxList?.paginationData;

    const columns = [
        {
            title: t("ID"),
            dataIndex: "ID",
            key: "ID",
            sorter: true,
            width: 100,
        },

        {
            title: t("PositionCode"),
            dataIndex: "PositionCode",
            key: "PositionCode",
            sorter: true,
            width: 150,
        },
        {
            title: t("PositionNameUzb"),
            dataIndex: "PositionNameUzb",
            key: "PositionNameUzb",
            sorter: true,
            width: 250,
        },
        {
            title: t("PositionNameRus"),
            dataIndex: "PositionNameRus",
            key: "PositionNameRus",
            sorter: true,
            width: 250,
        },
        {
            title: t("DisplayName"),
            dataIndex: "DisplayName",
            key: "DisplayName",
            sorter: true,
            width: 100,
        },
        {
            title: t("actions"),
            key: "action",
            width: 40,
            align: "center",
            fixed: "right",
            render: (record) => {
                return (
                    <Space size="middle">
                        {adminViewRole && (
                            <>
                                <span onClick={() => openUpdateModal({ ID: record.ID })}>
                                    <i
                                        className="feather icon-edit action-icon"
                                        aria-hidden="true"
                                    ></i>
                                </span>
                                <span onClick={() => handleDelete(record.ID)}>
                                    <i
                                        className="feather icon-trash-2 action-icon"
                                        aria-hidden="true" disabled
                                    ></i>
                                </span>
                            </>
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

    const handleDelete = (id) => {
        Modal.confirm({
            title: t('Delete'),
            icon: <ExclamationCircleOutlined />,
            content: t('delete'),
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                setConfirmLoading(true);
                AllPositionsServices.delete(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            setConfirmLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setConfirmLoading(false);
                    })
            }
        });
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
                        openUpdateModal({ ID: record.ID })
                    },
                };
            }}
        />
    )
}

export default React.memo(TableData);