import React, { useState } from 'react'
import { Table, Tag } from 'antd';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from "react-router-dom";

import { setListPagination } from '../_redux/getListSlice';

const GetListTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const tableList = useSelector((state) => state.userErrorList);
  const storeLoading = tableList.listBegin;
  const userListPagination = tableList.paginationData;
  const tableData = tableList.listSuccessData?.rows;
  const total = tableList.listSuccessData?.total;

  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      sorter: true,
      width: 80,
    },
    {
      title: t("errorCode"),
      dataIndex: "Code",
      sorter: true,
      width: 90
    },
    {
      title: t("errorNameUzb"),
      dataIndex: "ErrorNameUzb",
      sorter: true,
      width: 200,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("errorNameRus"),
      dataIndex: "ErrorNameRus",
      sorter: true,
      width: 200,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("descriptionUzb"),
      dataIndex: "DescriptionUzb",
      sorter: true,
      width: 200,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("descriptionRus"),
      dataIndex: "DescriptionRus",
      sorter: true,
      width: 200,
      render: record => <div className='ellipsis-2'>{record}</div>
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      sorter: true,
      width: 80,
      render: (_, record) => record.StateID === 1 ? <Tag color='#87d068'>{record.status}</Tag> : <Tag color='#f50'>{record.status}</Tag>
    },
  ];

  const handleTableChange = (pagination, filters, sorter, extra) => {
    const { field, order } = sorter;
    dispatch(
      setListPagination({
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
  )
}

export default React.memo(GetListTable);