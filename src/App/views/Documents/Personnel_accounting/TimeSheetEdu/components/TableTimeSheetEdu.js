import { Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../../helpers/notifications';
import TimeSheetEduServices from '../../../../../../services/Documents/Personnel_accounting/TimeSheetEdu/TimeSheetEdu.services';
import { getListStartAction, setListPagination } from '../_redux/TimeSheetEduSlice';

const TableTimeSheetEdu = ({ tableData, total, match }) => {
  const { t } = useTranslation();
  const totalReqRecCashRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');
  const dispatch = useDispatch();
  const history = useHistory();

  const loading = useSelector((state) => state.timeSheetEduList?.listBegin);
  const pagination = useSelector((state) => state.timeSheetEduList?.paginationData);
  const filter = useSelector((state) => state.timeSheetEduList?.filterData);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const columns = [
    {
      title: t("ID"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
      render: (_, record) => {
        if (record.StatusID === 2) {
          return record.ID;
        }
        return <span style={{ color: 'red' }}>{record.ID}</span>
      }
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      key: "Date",
      sorter: true,
      width: 100
    },
    {
      title: t("number"),
      dataIndex: "Number",
      key: "Number",
      sorter: true,
      width: 90
    },
    {
      title: t("SheetType"),
      dataIndex: "SheetType",
      key: "SheetType",
      sorter: true,
      width: 250
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      sorter: true,
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
      title: t("DivName"),
      dataIndex: "DivName",
      key: "DivName",
      sorter: true,
      width: 200,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("DprName"),
      dataIndex: "DprName",
      key: "DprName",
      sorter: true,
      width: 150
    },
    {
      title: t("DateOfModified"),
      dataIndex: "DateOfModified",
      key: "DateOfModified",
      sorter: true,
      // width: 250
    },
    {
      title: t("actions"),
      key: "action",
      align: "center",
      fixed: 'right',
      render: (record) => {
        return (
          <Space size="middle">
            {/* <Tooltip title={t("Accept")}>
                        <span onClick={() => this.acceptHandler(record.ID)}>
                            <i className="far fa-check-circle action-icon" />
                        </span>
                        </Tooltip>
                        <Tooltip title={t("NotAccept")}>
                        <span onClick={() => this.declineHandler(record.ID)}>
                            <i className="far fa-times-circle action-icon" />
                        </span>
                        </Tooltip> */}
            {totalReqRecCashRole &&
              <>
                <Tooltip title={t("Accept")}>
                  <span onClick={() => acceptHandler(record.ID)}>
                    <i className="far fa-check-circle action-icon" />
                  </span>
                </Tooltip>

                <Tooltip title={t("NotAccept")}>
                  <span onClick={() => declineHandler(record.ID)}>
                    <i className="far fa-times-circle action-icon" />
                  </span>
                </Tooltip>
              </>
            }
            <Tooltip title={t("Edit")}>
              <Link to={`${match.path}/edit/${record.ID}`}>
                <i className='feather icon-edit action-icon' aria-hidden="true" />
              </Link>
            </Tooltip>
            <Popconfirm
              title={t('delete')}
              onConfirm={() => deleteRowHandler(record.ID)}
            >
              <Tooltip title={t("Delete")}>
                <span>
                  <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                </span>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  function handleTableChange(pagination, filters, sorter) {
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

  const acceptHandler = (id) => {
    setConfirmLoading(true);
    TimeSheetEduServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('accepted'));
          dispatch(getListStartAction({
            ...filter,
            ...pagination,
          }));
          setConfirmLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setConfirmLoading(false);
      });
  };

  const declineHandler = (id) => {
    setConfirmLoading(true);
    TimeSheetEduServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('notAccepted'));
          dispatch(getListStartAction({
            ...filter,
            ...pagination,
          }));
          setConfirmLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setConfirmLoading(false);
      });
  };

  const deleteRowHandler = (id) => {
    setConfirmLoading(true);
    TimeSheetEduServices.delete(id)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          Notification('success', t("deleted"));
          dispatch(getListStartAction({
            ...filter,
            ...pagination,
          }));
          setConfirmLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setConfirmLoading(false);
      });
  };

  return (
    <>
      <Table
        bordered
        size="middle"
        rowClassName="table-row"
        className="main-table"
        showSorterTooltip={false}
        columns={columns}
        dataSource={tableData}
        loading={loading || confirmLoading}
        onChange={handleTableChange}
        rowKey={(record) => record.ID}
        pagination={{
          pageSize: Math.ceil(tableData?.length / 10) * 10,
          total: total,
          current: pagination.PageNumber,
          showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
        }}
        scroll={{
          x: "max-content",
          y: '50vh'
        }}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              history.push(`${match.path}/edit/${record.ID}`);
            },
          };
        }}
      />
    </>
  )
}

export default TableTimeSheetEdu;