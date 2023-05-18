import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, Popconfirm, Typography, Table, Empty } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";;
import moment from 'moment';

import Card from "../../../../components/MainCard";
import classes from "./TimeSheet.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import TimeSheetServices from "../../../../../services/Documents/Payroll/TimeSheet/TimeSheet.services";
import EditableCell from "./EditableCell";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { Option } = Select;

// const originData = [];

// for (let i = 0; i < 10; i++) {
//   originData.push({
//     key: i.toString(),
//     status: 2,
//     PersonnelNumber: i,
//     EmployeeFullName: `Edrward ${i}`,
//     DepartmentName: `London Park no. ${i}`,
//     ListOfPositionName: `ListOfPositionName ${i}`,
//     EnrolmentDocumentID: `EnrolmentDocumentID`,
//     OrganizationSettlementAccountName: `OrganizationSettlementAccountName`,
//     WorkScheduleName: `WorkScheduleName ${i}`,
//     Rate: `Rate ${i}`,
//     FactualDays: 0,
//     FactualHours: 0,
//     HolidayHours: 0,
//     NightHours: 0,
//     OrderNumber: 0
//   });
// }

const EditTimeSheet = (props) => {
  const [timeSheet, setTimeSheet] = useState([]);
  const [timeSheetTypeList, setTimeSheetTypeList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [orgSettleAccList, setOrgSettleAccList] = useState([]);
  const [loader, setLoader] = useState(true);

  // Table states
  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState({
    pagination: {
      current: 1,
      pageSize: 5
    }
  });
  const [editingKey, setEditingKey] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  // End Table states

  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeSht = await TimeSheetServices.getById(props.match.params.id);
        const timeShtLs = await HelperServices.GetTimeSheetTypeList();
        const divisionLs = await HelperServices.GetDivisionList();
        const orgSettleAccLs = await HelperServices.getOrganizationsSettlementAccountList();
        setTimeSheet(timeSht.data);
        setTimeSheetTypeList(timeShtLs.data);
        setDivisionList(divisionLs.data);
        setOrgSettleAccList(orgSettleAccLs.data);
        divisionChangeHandler(timeSht.data.DivisionID);
        setLoader(false);
      } catch (err) {
        // console.log(err);
      }
    }

    fetchData();

  }, []);

  const onFinish = (values) => {
    values.ID = props.match.params.id;

    TimeSheetServices.postTopData(values)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          history.push('/TimeSheet');
          Notification("success", t("success-msg"));
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };

  const divisionChangeHandler = divisionId => {
    HelperServices.getAllDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err => Notification('error', err))
  }

  // Table functions
  const isEditing = (record) => record.ID === editingKey;

  const edit = (record) => {
    tableForm.setFieldsValue({
      ...record
    });
    setEditingKey(record.ID);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.ID);

      if (index > -1) {
        const item = newData[index];
        item.status = 2;
        newData.splice(index, 1, { ...item, ...row });
        setTableData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const Tablecolumns = [
    {
      title: "Personnel Number",
      dataIndex: "PersonnelNumber",
      width: 150
    },
    {
      title: "Employee FullName",
      dataIndex: "EmployeeFullName",
      width: 200
    },
    {
      title: "Department Name",
      dataIndex: "DepartmentName",
      width: 200
    },
    {
      title: "List Of Position Name",
      dataIndex: "ListOfPositionName",
      width: 200
    },
    {
      title: "Enrolment Document ID",
      dataIndex: "EnrolmentDocumentID",
      width: 200
    },
    {
      title: "Organization Settlement AccountName",
      dataIndex: "OrganizationSettlementAccountName",
      width: 200
    },
    {
      title: "Work Schedule Name",
      dataIndex: "WorkScheduleName",
      width: 200
    },
    {
      title: "Rate",
      dataIndex: "Rate",
      width: 200
    },
    {
      title: "Factual Days",
      dataIndex: "FactualDays",
      width: 150,
      editable: true
    },
    {
      title: "Factual Hours",
      dataIndex: "FactualHours",
      width: 150,
      editable: true
    },
    {
      title: "Holiday Hours",
      dataIndex: "HolidayHours",
      width: 150,
      editable: true
    },
    {
      title: "Night Hours",
      dataIndex: "NightHours",
      width: 150,
      editable: true
    },
    {
      title: "Over Time Hours",
      dataIndex: "OverTimeHours",
      width: 150,
      editable: true
    },
    {
      title: "Hourly work",
      dataIndex: "HourlyWork",
      width: 150,
      editable: true
    },
    {
      title: "Repair Hours",
      dataIndex: "RepairHours",
      width: 150,
      editable: true
    },
    {
      title: "Sick days",
      dataIndex: "SickDays",
      width: 150,
      editable: true
    },
    {
      title: "Leave days",
      dataIndex: "LeaveDays",
      width: 150,
      editable: true
    },
    {
      title: "Experience Cont Work Table ID",
      dataIndex: "ExperienceContWorkTableID",
      width: 150,
    },
    {
      title: "Indexation Of Salary ID",
      dataIndex: "IndexationOfSalaryID",
      width: 150,
    },
    {
      title: "operation",
      dataIndex: "operation",
      fixed: "right",
      width: 100,
      align: 'center',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                save(record.ID);
              }}
              style={{
                marginRight: 8
              }}
            >
              Save
            </a>
            <Popconfirm title={t('delete')} onConfirm={cancel}okText={t("yes")}
                cancelText={t("cancel")}>
              <a>Cancel</a>
            </Popconfirm>
          </div>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            <i
              className='feather icon-edit action-icon'
              aria-hidden="true"
            />
          </Typography.Link>
        );
      }
    }
  ];

  const mergedColumns = Tablecolumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        // inputType: col.dataIndex === "age" ? "number" : "text",
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const deleteRowsHandler = () => {
    setTableLoading(true);
    const selectedIds = selectedRows.map(item => item.ID);
    TimeSheetServices.deleteTableRow(selectedIds)
      .then(res => {
        if (res.status === 200) {
          setTableLoading(false)
          const { pagination } = tablePagination;
          fetchTableData({ pagination });
        }
      })
      .catch(err => Notification('error', err))
  };

  const clearDataHandler = () => {
    setLoader(true);
    setTableData([]);
    setDisableButton(false);
    TimeSheetServices.deleteTableData(props.match.params.id)
      .then(res => setLoader(false))
      .catch(err => Notification('error', err))
  };

  const fillTableHandler = () => {
    setLoader(true);
    setDisableButton(true);
    const { pagination } = tablePagination;
    fetchTableData({ pagination });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    fetchTableData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  const fetchTableData = (params = {}) => {
    setTableLoading(true);
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder

    TimeSheetServices.getTimeSheetTableData(props.match.params.id, pageNumber, pageLimit, sortColumn, orderType)
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.rows);
          setTableLoading(false);
          setLoader(false);
          setTablePagination({
            pagination: {
              ...params.pagination,
              total: res.data.total,
            },
          });
        }
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const saveAllHandler = () => {
    let allData = { ...form.getFieldsValue() };
    allData.Date = allData.Date.format('DD.MM.YYYY');
    allData.tables = [...tableData];
    TimeSheetServices.postData(allData)
      .then(res => {
        if (res.status === 200) {
          history.push('/TimeSheet');
          Notification("success", t("saved"));
        }
      })
      .catch(err => Notification('error', err))
  }
  // End Table functions

  const { pagination } = tablePagination;

  if (loader) {
    return (
      <div className="spin-wrapper">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Fade bottom>
      <Card title={t("EditTimeSheet")}>
        <Form
          {...layout}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // className={classes.FilterForm}
          form={form}
          initialValues={{
            ...timeSheet,
            Date: moment(timeSheet.Date, 'DD.MM.YYYY'),
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("number")}
                name="Number"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData")
                  },
                ]}
              >
                <Input placeholder={t("number")} />
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("date")}
                name="Date"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("TimeSheetType")}
                name="TimeSheetTypeID"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Select
                  placeholder={t("TimeSheetType")}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
                  {timeSheetTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("DivisionName")}
                name="DivisionID"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Select
                  placeholder={t("DivisionName")}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={divisionChangeHandler}>
                  {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("DepartmentName")}
                name="DepartmentID"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Select
                  placeholder={t("DepartmentName")}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={divisionChangeHandler}>
                  {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("OrganizationsSettlementAccountName")}
                name="OrganizationsSettlementAccountID"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Select
                  placeholder={t("OrganizationsSettlementAccountName")}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={divisionChangeHandler}>
                  {orgSettleAccList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                </Select>
              </Form.Item>

            </Col>
            <Col xl={24} lg={24} align='right'>
              <Button type="primary" htmlType="submit">
                {t("save")}
              </Button>
            </Col>
          </Row>
        </Form>
        <Form form={tableForm} component={false} scrollToFirstError>
          <div className={classes.buttons}>
            <Button onClick={fillTableHandler} disabled={disableButton}>Fill</Button>
            <Button onClick={deleteRowsHandler}>Delete</Button>
            <Button onClick={clearDataHandler}>Clear</Button>
          </div>
          {tableData.length === 0 ?
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
            <Table
              bordered
              rowClassName="editable-row table-row"
              className="main-table"
              dataSource={tableData}
              columns={mergedColumns}
              loading={tableLoading}
              rowKey={(record) => record.ID}
              onChange={handleTableChange}
              pagination={pagination}
              components={{
                body: {
                  cell: EditableCell
                }
              }}
              rowSelection={{
                onChange: onSelectChange
              }}
              scroll={{
                x: "max-content",
                y: '50vh'
              }}
            />}
        </Form>
        <div className={classes.buttons} style={{ margin: 0 }}>
          <Button
            type="danger"
            onClick={() => {
              history.goBack();
              Notification("warning", t("not-saved"));
            }}
          >
            {t("back")}
          </Button>
          <Button
            onClick={saveAllHandler}
            type="primary"
          >
            {t("saveAll")}
          </Button>
        </div>
      </Card>
    </Fade>
  );
};

export default EditTimeSheet;