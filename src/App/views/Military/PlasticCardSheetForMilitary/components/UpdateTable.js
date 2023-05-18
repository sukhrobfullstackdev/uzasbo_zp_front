import React from 'react'
import {  Table} from 'antd';
import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from 'react-redux';
// import { useLocation, useHistory } from "react-router-dom";

// import { setListPagination, setListFilter } from '../_redux/getListSlice';
// import { Notification } from '../../../../../helpers/notifications';
// import SalaryCalculationServices from '../../../../../services/Documents/EmployeeMovement/SalaryCalculation/SalaryCalculation.services'
// import classes from "../PlasticCardSheetForMilitary.module.css";

const GetListTable = (props) => {
  const { t } = useTranslation();

  const columns = [
    {
      title: t("id"),
      dataIndex: "ID",
      width: 80,
      sorter: true
    },
    {
      title: t("Number"),
      dataIndex: "RowNumber",
      width: 80,
      sorter: true,
    },
    {
      title: t("fio"),
      dataIndex: "EmployeeName",
      width: 150,
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("PayrollSum"),
      dataIndex: "PayrollSum",
      width: 120,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("Percentage"),
      dataIndex: "Percentage",
      width: 80,
      sorter: true
    },
    {
      title: t("sum"),
      dataIndex: "Sum",
      width: 120,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("plasticCardNumber"),
      dataIndex: "PlasticCardNumber",
      width: 100,
      sorter: true,
    },
  ];

  return (
    <Table
      bordered
      size='middle'
      rowClassName="table-row"
      className="main-table"
      style={{marginTop: 20}}
      dataSource={props.data}
      columns={columns}
      loading={props.loading}
      rowKey={(record) => record.ID}
      // onChange={handleSalaryCalcTableChange}
      showSorterTooltip={false}
      pagination={false}
      scroll={{
        x: "max-content",
        y: '75vh'
      }}
    />
  )
}

export default GetListTable;