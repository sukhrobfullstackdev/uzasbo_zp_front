import React from 'react'
import { CheckCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { Space, Table, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';

import classes from "../Employee.module.scss";
import { setListPagination } from '../_redux/EmployeeSlice';

const TableEmployees = ({ tableData, total, OrgTypeID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const loading = useSelector((state) => state.employeeList?.listBegin);
  const employeeListPagination = useSelector((state) => state.employeeList?.paginationData);

  // const [confirmLoading, setConfirmLoading] = React.useState(false);

  const columns = [
    {
      title: t("DisplayName"),
      dataIndex: "DisplayName",
      key: "DisplayName",
      sorter: true,
    },
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
    },
    {
      title: t("personnelNumber"),
      dataIndex: "PersonnelNumber",
      key: "PersonnelNumber",
      sorter: true,
      width: 80
    },
    {
      title: t("fullname"),
      dataIndex: "FullName",
      key: "FullName",
      sorter: true,
    },
    {
      title: t("inn"),
      dataIndex: "INN",
      key: "INN",
      sorter: true,
      width: 100
    },
    {
      title: t("Pol"),
      dataIndex: "Pol",
      key: "Pol",
      sorter: true,
    },
    {
      title: t("DateOfBirth"),
      dataIndex: "DateOfBirth",
      key: "DateOfBirth",
      sorter: true,
      width: 100
    },
    {
      title: t("INPSCode"),
      dataIndex: "INPSCode",
      key: "INPSCode",
      sorter: true,
    },
    {
      title: t("isCheckedPerson"),
      dataIndex: "IsChecked",
      key: "IsChecked",
      sorter: true,
      align: 'center',
      width: 110,
      render: record => record ?
        <CheckCircleFilled className={classes['valid-person-icon']} /> :
        <QuestionCircleFilled className={classes['invalid-person-icon']} />
    },
    {
      title: t("benefitsIncomeTax"),
      dataIndex: "BenefitsIncomeTax",
      key: "BenefitsIncomeTax",
      sorter: true,
      width: 140
    },
    {
      title: t("PhoneNumber"),
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
      sorter: true,
      width: 200
    },
    {
      title: t("Address"),
      dataIndex: "Address",
      key: "Address",
      sorter: true,
      width: 200,
      render: record => <div className="ellipsis-2">{record}</div>
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
            {/* <Tooltip title={t("print")}>
                  <span onClick={() => this.printById(record.ID)}>
                    <i className='feather icon-printer action-icon' aria-hidden="true" />
                  </span>
                </Tooltip> */}
            <Tooltip title={t("Edit")}>
              <Link to={`/employee/edit/${record.ID}`}>
                <i className='feather icon-edit action-icon' aria-hidden="true" />
              </Link>
            </Tooltip>
            {/* <Tooltip title={t("Delete")}>
                  <Popconfirm
                    disabled
                    title="Sure to delete?"
                    onConfirm={() => this.handleDelete(record.ID)}
                  >
                    <span className='disabled-action-icon'>
                      <i className="feather icon-trash-2" aria-hidden="true" />
                    </span>
                  </Popconfirm>
                </Tooltip> */}
          </Space>
        );
      },
    },
  ];
  const hemisColumns = [
    {
      title: t("DisplayName"),
      dataIndex: "DisplayName",
      key: "DisplayName",
      sorter: true,
    },
    {
      title: t("id"),
      dataIndex: "ID",
      key: "ID",
      sorter: true,
    },
    {
      title: t("personnelNumber"),
      dataIndex: "PersonnelNumber",
      key: "PersonnelNumber",
      sorter: true,
      width: 80
    },
    {
      title: t("fullname"),
      dataIndex: "FullName",
      key: "FullName",
      sorter: true,
    },
    {
      title: t("inn"),
      dataIndex: "INN",
      key: "INN",
      sorter: true,
      width: 100
    },
    {
      title: t("Pol"),
      dataIndex: "Pol",
      key: "Pol",
      sorter: true,
    },
    {
      title: t("DateOfBirth"),
      dataIndex: "DateOfBirth",
      key: "DateOfBirth",
      sorter: true,
      width: 100
    },
    {
      title: t("INPSCode"),
      dataIndex: "INPSCode",
      key: "INPSCode",
      sorter: true,
    },
    {
      title: t("isCheckedPerson"),
      dataIndex: "IsChecked",
      key: "IsChecked",
      sorter: true,
      align: 'center',
      width: 110,
      render: record => record ?
        <CheckCircleFilled className={classes['valid-person-icon']} /> :
        <QuestionCircleFilled className={classes['invalid-person-icon']} />
    },
    {
      title: t("isCheckedHemis"),
      dataIndex: "IsCheckedHemis",
      key: "IsCheckedHemis",
      sorter: true,
      align: 'center',
      width: 110,
      render: (_, record) => record.EmployeeTypeID === 3 && <>
        {record.IsCheckedHemis === true ? (
          <CheckCircleFilled className={classes['valid-person-icon']} />
        ) : (
          <QuestionCircleFilled className={classes['invalid-person-icon']} />
        )}
      </>
    },
    {
      title: t("benefitsIncomeTax"),
      dataIndex: "BenefitsIncomeTax",
      key: "BenefitsIncomeTax",
      sorter: true,
      width: 140
    },
    {
      title: t("PhoneNumber"),
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
      sorter: true,
      width: 200
    },
    {
      title: t("Address"),
      dataIndex: "Address",
      key: "Address",
      sorter: true,
      width: 200,
      render: record => <div className="ellipsis-2">{record}</div>
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
            {/* <Tooltip title={t("print")}>
                  <span onClick={() => this.printById(record.ID)}>
                    <i className='feather icon-printer action-icon' aria-hidden="true" />
                  </span>
                </Tooltip> */}
            <Tooltip title={t("Edit")}>
              <Link to={`/employee/edit/${record.ID}`}>
                <i className='feather icon-edit action-icon' aria-hidden="true" />
              </Link>
            </Tooltip>
            {/* <Tooltip title={t("Delete")}>
                  <Popconfirm
                    disabled
                    title="Sure to delete?"
                    onConfirm={() => this.handleDelete(record.ID)}
                  >
                    <span className='disabled-action-icon'>
                      <i className="feather icon-trash-2" aria-hidden="true" />
                    </span>
                  </Popconfirm>
                </Tooltip> */}
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

  return (
    <Table
      bordered
      size="middle"
      columns={(OrgTypeID === 9 || OrgTypeID === 15) ? hemisColumns : columns}
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
            history.push(`/employee/edit/${record.ID}`);
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
        current: employeeListPagination.PageNumber,
        showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
      }}
    />
  )
}

export default TableEmployees