import React, { useState } from 'react'
import { Table, Tag, Space, Dropdown, Menu, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory, Link } from "react-router-dom";
// import { CSSTransition } from 'react-transition-group';

import { setListPagination, getListStartAction } from '../_redux/getListSlice';
import SubjectsInBLHGTApis from '../../../../../../services/References/Organizational/SubjectInBLGHT/SubjectInBLGHT'
import { Notification } from '../../../../../../helpers/notifications';
import '../../../../../../helpers/prototypeFunctions'


const TableData = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const tableList = useSelector((state) => state.subjectsInBLGHTList);
  const filterData = tableList?.filterData;
  const paginationData = tableList?.paginationData;
  const storeLoading = tableList.listBegin;
  const userListPagination = tableList.paginationData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const [loading, setLoading] = useState(false);

  const deleteRowHandler = id => {
    setLoading(true);
    SubjectsInBLHGTApis.delete(id)
      .then(res => {
        if (res.status === 200) {
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
          setLoading(false);
        }
      })
      .catch(err => {
        setLoading(false);
        Notification('error', err);
      })
  }

  const acceptHandler = (id) => {
    setLoading(true);
    SubjectsInBLHGTApis.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', t('accepted'));
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  };

  const declineHandler = (id) => {
    setLoading(true);
    SubjectsInBLHGTApis.cancel(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('warning', t('canceled'));
          dispatch(getListStartAction({
            ...filterData,
            ...paginationData,
          }));
          setLoading(false);
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  };

  // const deleteModalHandler = (id) => {
  //   Modal.confirm({
  //     title: t('delete') + id,
  //     icon: <ExclamationCircleOutlined />,
  //     okText: t('yes'),
  //     cancelText: t('cancel'),
  //     onOk: () => deleteRowHandler(id),
  //   });
  // }

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      sorter: true,
      width: 80,
      // render: (_, record) => {
      //   if (record.StatusID === 2 || record.StatusID === 8) {
      //     return record.ID;
      //   }
      //   return <span style={{ color: 'red' }}>{record.ID}</span>
      // }
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      sorter: true,
      width: 200,
      // render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("BLHGType"),
      dataIndex: "BLHGType",
      sorter: true,
      // width: 120
    },
    {
      title: t("TeachingAtHome"),
      dataIndex: "TeachingAtHome",
      sorter: true,
      width: 150,
      align: 'center'
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      sorter: true,
      width: 150,
      render: (_, record) => {
        if (record.StatusID === 2 || record.StatusID === 9) {
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
            <Tooltip title={t("Edit")}>
              <Link to={`${location.pathname}/edit/${record.ID}`}>
                <i
                  className="feather icon-edit action-icon"
                  aria-hidden="true"
                ></i>
              </Link>
            </Tooltip>

            <Dropdown
              placement="bottom"
              overlay={<Menu items={[
                {
                  key: 'accept',
                  label: (
                    <span onClick={() => acceptHandler(record.ID)}>
                      <i className="far fa-check-circle action-icon" />&nbsp;
                      {t("Accept")}
                    </span>
                  ),
                },
                {
                  key: 'notAccept',
                  label: (
                    <span onClick={() => declineHandler(record.ID)}>
                      <i className="far fa-check-circle action-icon" />&nbsp;
                      {t("NotAccept")}
                    </span>
                  ),
                },
                {
                  key: 'delete',
                  label: (
                    <span
                      // onClick={() => deleteModalHandler(record.ID)}
                      onClick={() => deleteRowHandler(record.ID)}
                    >
                      <i className="feather icon-trash-2 action-icon" aria-hidden="true" />&nbsp;
                      {t("Delete")}
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
    },
  ];

  const handleTableChange = (pagination, _, sorter,) => {
    const { field, order } = sorter;
    dispatch(setListPagination({
      OrderType: order?.slice(0, -3),
      SortColumn: field,
      PageNumber: pagination.current,
      PageLimit: pagination.pageSize,
    })
    );
  }

  const onTableRow = (record) => {
    return {
      onDoubleClick: () => {
        history.push(`${location.pathname}/edit/${record.ID}`);
      },
    };
  }

  return (
    <>
      <Table
        bordered
        size="middle"
        rowClassName="table-row"
        className="main-table"
        columns={columns}
        dataSource={tableData}
        loading={storeLoading || loading}
        onChange={handleTableChange}
        rowKey={(record) => record.ID}
        showSorterTooltip={false}
        onRow={(record) => onTableRow(record)}
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
    </>
  )
}

export default React.memo(TableData);