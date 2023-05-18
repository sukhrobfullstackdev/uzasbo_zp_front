import React from 'react'
import { Table, Tooltip, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

// import classes from "../Division.module.scss";
import { setListPagination } from '../_redux/DivisionSlice';

const TableDivisions = ({ tableData, total, match }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const loading = useSelector((state) => state.DivisionList?.listBegin);
  const DivisionListPagination = useSelector((state) => state.DivisionList?.paginationData);

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: (a, b) => a.code - b.code,
      width: 100,

    },
    {
      title: t("shortname"),
      dataIndex: "ShortName",
      key: "ShortName",
      sorter: true,
      width: 300,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("name"),
      dataIndex: "Name",
      key: "Name",
      sorter: true,
      width: 300,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t('status'),
      dataIndex: 'Status',
      key: 'Status',
      width: 100,
      render: (status) => {
        if (status === "Актив") {
          return (<Tag color="#87d068" key={status}>{status}</Tag>)
        } else if (status === "Пассив") {
          return (<Tag color="#f50" key={status}>{status}</Tag>)
        }
      }
    },
    {
      title: t('actions'),
      key: 'action',
      width: 80,
      align: 'center',
      render: (record) => {
        return (
          <Tooltip title={t("Edit")}>
            <Link to={`${match.path}/edit/${record.ID}`}>
              <i className="feather icon-edit action-icon" />
            </Link>
          </Tooltip>
        )
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

  return (
    <Table
      bordered
      size="middle"
      columns={columns}
      dataSource={tableData}
      loading={loading}
      showSorterTooltip={false}
      onChange={handleTableChange}
      rowKey={(record) => record.ID}
      rowClassName="table-row"
      className='main-table'
      onRow={(record) => {
        return {
          onDoubleClick: () => {
            history.push(`/Division/edit/${record.ID}`);
          },
        };
      }}
      scroll={{
        x: 'max-content',
        y: '50vh'
      }}
      pagination={{
        pageSize: Math.ceil(tableData?.length / 10) * 10,
        total: total,
        current: DivisionListPagination.PageNumber,
        showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
      }}
    />
  )
}

export default TableDivisions