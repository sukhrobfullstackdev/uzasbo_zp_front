import React from 'react'
import { CheckCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import classes from "../Employee.module.scss";
import { setListPagination } from '../_redux/ReportsOfStudentsSlice';

const TableEmployees = ({ tableData, total }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const loading = useSelector((state) => state.reportOfStudentsList?.listBegin);
  const employeeListPagination = useSelector((state) => state.reportOfStudentsList?.paginationData);

  const columns = [
    {
      title: t("PersonnelNumber"),
      dataIndex: "PersonnelNumber",
      key: "PersonnelNumber",
      sorter: true,
      width: 100
    },
    {
      title: t("FullName"),
      dataIndex: "FullName",
      key: "FullName",
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>,
      width: 100
    },
    {
      title: t("Cours"),
      dataIndex: "Cours",
      key: "Cours",
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>,
      width: 80
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      key: "Date",
      sorter: true,
      width: 100
    },
    {
      title: t("BeginDate"),
      dataIndex: "BeginDate",
      key: "BeginDate",
      sorter: true,
      width: 100
    },
    {
      title: t("EndDate"),
      dataIndex: "EndDate",
      key: "EndDate",
      sorter: true,
      width: 100
    },
    {
      title: t("Division"),
      dataIndex: "Division",
      key: "Division",
      sorter: true,
      // width: 80
    },
    {
      title: t("Faculty"),
      dataIndex: "Faculty",
      key: "Faculty",
      sorter: true,
      // width: 100
    },
    {
      title: t("isCheckedPerson"),
      dataIndex: "IsChecked",
      key: "IsChecked",
      // sorter: true,
      align: 'center',
      render: record => record ?
      <CheckCircleFilled className={classes['valid-person-icon']} /> :
      <QuestionCircleFilled className={classes['invalid-person-icon']} />,
      width: 100
    },
    {
      title: t("phone-num"),
      dataIndex: "EmployeePhoneNumber",
      key: "EmployeePhoneNumber",
      sorter: true,
      width: 150
    },
    {
      title: t("inpsCode"),
      dataIndex: "EmployeePINFL",
      key: "EmployeePINFL",
      sorter: true,
      width: 100
    },

    {
      title: t("DateOfBirth"),
      dataIndex: "DateOfBirth",
      key: "DateOfBirth",
      sorter: true,
      width: 100
    },
    {
      title: t("Direction"),
      dataIndex: "StudentDirection",
      key: "StudentDirection",
      sorter: true,
      width: 120
    },
    {
      title: t("Group"),
      dataIndex: "SudentGroup",
      key: "SudentGroup",
      sorter: true,
      width: 120
    },

    {
      title: t("SettleCode"),
      dataIndex: "OrganizationsSettlementAccoun",
      key: "OrganizationsSettlementAccoun",
      sorter: true,
      width: 250
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
      rowKey={(record) => record.PersonnelNumber}
      rowClassName="table-row"
      className='main-table'
      scroll={{
        x: 'max-content',
        y: '50vh'
      }}
      pagination={{
        pageSize: Math.ceil(tableData?.length / 10) * 10,
        total: total,
        current: employeeListPagination.PageNumber,
        showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
      }}
    />
  )
}

export default TableEmployees