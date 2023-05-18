import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, Table, Space, Tabs, InputNumber, Card, Switch, Typography, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';
import { CSSTransition } from 'react-transition-group';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { appendArray } from "../../../../../helpers/helpers";

import MainCard from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import CommonServices from "../../../../../services/common/common.services";
import EmployeeDismissalServices from "../../../../../services/Documents/Personnel_accounting/EmployeeDismissal/EmployeeDismissal.services";
import EditableCell from "./EditableCell";
import EmployeeModal from "../../../commonComponents/EmployeeModal";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Text } = Typography;

// const defaultTablePagination = {
//   current: 1,
//   pageSize: 50,
// }

const UpdateEmployeeDismissal = (props) => {
  // const [employeeDismissal, setEmployeeDismissal] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [dismissalReasonList, setDismissalReasonList] = useState([]);
  const [roundingTypeList, setRoundingTypeList] = useState([]);
  const [orgSettleAccList, setOrgSettleAccList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [divisionId, setDivisionId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [sum, setSum] = useState(null);
  const [docId] = useState(props.match.params.id ? props.match.params.id : 0);
  const [tableId, setTableId] = useState(null);
  const [filelist, setFileList] = useState([]);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [disabledActions, setDisabledActions] = useState(false);
  const [calcCompensation, setCalcCompensation] = useState(false);
  const [allSource, setAllSource] = useState(false);
  const [loader, setLoader] = useState(true);

  // Table states
  const [calcTableData, setCalcTableData] = useState([]);
  const [awardTableData, setAwardTableData] = useState([]);
  const [calcDetailsTableData, setCalcDetailsTableData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  // const [selectedRows, setSelectedRows] = useState([]);
  // const [tableFilterValues, setTableFilterValues] = useState({});
  // End Table states

  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const [tableForm] = Form.useForm();
  const totalReqRecCashRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empDismissal, divisionLs, orgSettleAccLs, dismissalReasonLs, roundingTypeLs, expensesLs] = await Promise.all([
          EmployeeDismissalServices.getById(props.match.params.id ? props.match.params.id : 0),
          HelperServices.GetDivisionList(),
          HelperServices.getOrganizationsSettlementAccountList(),
          HelperServices.getDismissalReason(),
          HelperServices.getRoundingTypeListForEnrolment(),
          HelperServices.getItemOfExpensesList(0),
        ]);

        if (props.match.params.id) {
          // const tableData = await TimeSheetServices.getTimeSheetTableData(docId, 1, 5);
          const departmentLs = await HelperServices.getDepartmentList(empDismissal.data.DivisionID);
          setDepartmentList(departmentLs.data);
          // setTableData(tableData.data.rows);
          setEmployeeId(empDismissal.data.EmployeeID);
          setCalcCompensation(empDismissal.data.CalculateCompensation);
          setAllSource(empDismissal.data.ByAllSource);
          setDivisionId(empDismissal.data.DivisionID);
          setDepartmentId(empDismissal.data.DepartmentID);
        }
        setDisabledActions(empDismissal.data.StatusID === 2 ? true : false);
        // setEmployeeDismissal(empDismissal.data);
        setDivisionList(divisionLs.data);
        setOrgSettleAccList(orgSettleAccLs.data);
        setDismissalReasonList(dismissalReasonLs.data);
        setRoundingTypeList(roundingTypeLs.data);
        setSum(empDismissal.data.Sum);
        setCalcTableData(empDismissal.data.Tables2);
        setAwardTableData(empDismissal.data.Tables);
        setCalcDetailsTableData(empDismissal.data.Tables1);
        setExpensesList(expensesLs.data);
        setTableId(empDismissal.data.TableID);
        setLoader(false);
        mainForm.setFieldsValue({
          ...empDismissal.data,
          Date: moment(empDismissal.data.Date, 'DD.MM.YYYY'),
          DateOfDismissal: moment(empDismissal.data.DateOfDismissal, 'DD.MM.YYYY'),
          DivisionID: null,
          DepartmentID: null,
          EnrolmentTypeID: null,
          EnrolmentDocumentID: null,
          ReasonsOfDismissalID: null
        })
      } catch (err) {
        // console.log(err);
        Notification('error', err);
        setLoader(false);
      }
    }
    fetchData();
  }, [props.match.params.id, mainForm]);

  const divisionChangeHandler = divisionId => {
    mainForm.setFieldsValue({
      EmployeeFullName: null,
      EnrolmentDocumentID: null,
      DepartmentID: null
    });

    setDivisionId(divisionId);
    setEmployeeId(null);
    HelperServices.getAllDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err => Notification('error', err));
  }

  const departmentChangeHandler = id => {
    mainForm.setFieldsValue({ EmployeeFullName: null, EnrolmentDocumentID: null });
    setEmployeeId(null);
    setDepartmentId(id);
  }

  // Table functions
  const isEditing = (record) => record.ID === editingKey;

  const edit = (record) => {
    tableForm.setFieldsValue({
      ...record,
    });
    setEditingKey(record.ID);
  };

  // const cancel = () => {
  //   setEditingKey("");
  // };

  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...calcTableData];
      const index = newData.findIndex((item) => key === item.ID);

      if (index > -1) {
        const item = newData[index];
        item.Status = 2;
        newData.splice(index, 1, { ...item, ...row });
        setCalcTableData(newData);
        setEditingKey("");
        let tableSum = 0;
        newData.forEach(item => {
          tableSum += item.LeaveSum
        });
        setSum(tableSum);
      } else {
        newData.push(row);
        // setTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      // alert(errInfo);
      setEditingKey("");
    }
  };

  const calcColumns = [
    {
      title: t("ID"),
      dataIndex: "ID",
      width: 90,
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t("OrganizationsSettlementAccount"),
      dataIndex: "OrganizationsSettlementAccountName",
      width: 120,
      sorter: (a, b) => a.OrganizationsSettlementAccountName.length - b.OrganizationsSettlementAccountName.length,
    },
    {
      title: t("Month"),
      dataIndex: "Month",
      // width: 120,
      sorter: (a, b) => a.Month.length - b.Month.length,
    },
    {
      title: t("Salary"),
      dataIndex: "Salary",
      // width: 120,
      sorter: (a, b) => a.Salary - b.Salary,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("BonusSum"),
      dataIndex: "BonusSum",
      // width: 120,
      sorter: (a, b) => a.BonusSum - b.BonusSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("DailySalary"),
      dataIndex: "DailySalary",
      // width: 120,
      sorter: (a, b) => a.DailySalary - b.DailySalary,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("LeaveDays"),
      dataIndex: "LeaveDays",
      width: 90,
      sorter: (a, b) => a.LeaveDays - b.LeaveDays,
    },
    {
      title: t("LeaveSum"),
      dataIndex: "LeaveSum",
      width: 150,
      align: 'right',
      editable: true,
      sorter: (a, b) => a.LeaveSum - b.LeaveSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("ItemOfExpensesName"),
      dataIndex: "ItemOfExpensesID",
      editable: true,
      width: 140,
      // ellipsis: true,
      sorter: (a, b) => a.ItemOfExpensesID - b.ItemOfExpensesID,
      render: (record => {
        const expense = expensesList.find(item => item.ID === record);
        if (expense) {
          return expense.OnlyCode;
        }
        return;
      })
    },
    {
      title: t("OrginalSum"),
      dataIndex: "OrginalSum",
      width: 90,
      sorter: (a, b) => a.OrginalSum - b.OrginalSum,
    },
  ];

  const awardTableColumns = [
    {
      title: t("ID"),
      dataIndex: "ID",
      width: 90,
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t("OrganizationsSettlementAccount"),
      dataIndex: "OrganizationsSettlementAccountName",
      width: 120,
      sorter: (a, b) => a.OrganizationsSettlementAccountName.length - b.OrganizationsSettlementAccountName.length,
    },
    {
      title: t("Month"),
      dataIndex: "BonusMonth",
      // width: 120,
      sorter: (a, b) => a.BonusMonth.length - b.BonusMonth.length,
    },
    {
      title: t("BonusSum"),
      dataIndex: "BonusSum",
      // width: 120,
      sorter: (a, b) => a.BonusSum - b.BonusSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("ItemOfExpensesName"),
      dataIndex: "ItemOfExpensesName",
      editable: true,
      width: 140,
      sorter: (a, b) => a.ItemOfExpensesName.length - b.ItemOfExpensesName.length,
    },
  ];

  const calcDetailsTableColumns = [
    {
      title: t("Month"),
      dataIndex: "Month",
      // width: 120,
      sorter: (a, b) => a.Month.length - b.Month.length,
    },
    {
      title: t("OrganizationsSettlementAccount"),
      dataIndex: "OrganizationsSettlementAccountName",
      width: 120,
      sorter: (a, b) => a.OrganizationsSettlementAccountName.length - b.OrganizationsSettlementAccountName.length,
    },
    {
      title: t("SubCalculationKindName"),
      dataIndex: "SubCalculationKindName",
      editable: true,
      width: 140,
      sorter: (a, b) => a.SubCalculationKindName.length - b.SubCalculationKindName.length,
    },
    {
      title: t("ItemOfExpensesName"),
      dataIndex: "ItemOfExpensesName",
      editable: true,
      width: 140,
      sorter: (a, b) => a.ItemOfExpensesName.length - b.ItemOfExpensesName.length,
    },
    {
      title: t("OutSum"),
      dataIndex: "OutSum",
      // width: 120,
      sorter: (a, b) => a.OutSum - b.OutSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("Percentage"),
      dataIndex: "Percentage",
      // width: 120,
      sorter: (a, b) => a.Percentage - b.Percentage,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("FactDays"),
      dataIndex: "FactDays",
      width: 120,
      sorter: (a, b) => a.FactDays - b.FactDays,
    },
    {
      title: t("FactHours"),
      dataIndex: "FactHours",
      width: 120,
      sorter: (a, b) => a.FactHours - b.FactHours,
    },
    {
      title: t("PlanDays"),
      dataIndex: "PlanDays",
      width: 120,
      sorter: (a, b) => a.PlanDays - b.PlanDays,
    },
    {
      title: t("PlanHours"),
      dataIndex: "PlanHours",
      width: 120,
      sorter: (a, b) => a.PlanHours - b.PlanHours,
    },
  ];

  const mergedColumns = calcColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        title: col.title,
        dataIndex: col.dataIndex,
        editing: isEditing(record),
        expensesList: expensesList
      })
    };
  });

  // const onSelectChange = (selectedRowKeys, selectedRows) => {
  //   setSelectedRows(selectedRows);
  // };

  // const deleteRowsHandler = () => {
  //   if (selectedRows.length === 0) {
  //     Notification("warning", t("please select row"));
  //     return;
  //   }
  //   const selectedIds = selectedRows.map(item => item.ID);
  //   // TimeSheetServices.deleteTableRow(selectedIds)
  //   //   .then(res => {
  //   //     if (res.status === 200) {
  //   //       setTableLoading(false)
  //   //       const { pagination } = tablePagination;
  //   //       fetchTableData({ pagination });
  //   //       setSelectedRows([]);
  //   //     }
  //   //   })
  //   //   .catch(err => console.log(err))
  // };

  // const clearTableHandler = () => {
  //   setLoader(true);
  //   setCalcTableData([]);
  //   // TimeSheetServices.clearTable(docId)
  //   //   .then(res => setLoader(false))
  //   //   .catch(err => console.log(err))
  // };

  // const handleTableChange = (pagination, filters, sorter) => {
  //   fetchTableData({
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     pagination,
  //     ...filters,
  //   }, tableFilterValues);
  // };

  // const fetchTableData = (params = {}, filterValues, id) => {

  //   let pageNumber = params.pagination.current,
  //     pageLimit = params.pagination.pageSize,
  //     sortColumn = params.sortField,
  //     orderType = params.sortOrder,
  //     fillId = id ? id : docId

  //   // TimeSheetServices.getTimeSheetTableData(fillId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
  //   //   .then((res) => {
  //   //     if (res.status === 200) {
  //   //       setTableData(res.data.rows);
  //   //       setTableLoading(false);
  //   //       setLoader(false);
  //   //       setTablePagination({
  //   //         pagination: {
  //   //           ...params.pagination,
  //   //           total: res.data.total,
  //   //         },
  //   //       });
  //   //     }
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log(err);
  //   //     setLoader(false);
  //   //     setTableLoading(false);
  //   //   });
  // };

  const fillTableHandler = async (values) => {
    values.ID = +docId;
    values.Date = values.Date.format('DD.MM.YYYY');
    values.DateOfDismissal = values.DateOfDismissal.format('DD.MM.YYYY');
    values.EmployeeID = employeeId;
    setLoader(true);
    try {
      const tablesData = await EmployeeDismissalServices.calculate(values);
      if (tablesData.status === 200) {
        setLoader(false);
        // setDocId(mainData.data);
        // const { pagination } = tablePagination;
        // fetchTableData({ pagination }, {}, mainData.data);
      }
    } catch (error) {
      setLoader(false);
      Notification('error', error);
      // console.log(error);
    }
  };

  const fillTableHandlerFailed = (errorInfo) => {
    Notification('error', t('pleaseFillAllInputs'));
    console.log('Failed:', errorInfo);
  };

  const saveAllHandler = () => {
    mainForm.validateFields()
      .then((values) => {
        console.log(values);
        setLoader(true);
        values.ID = +docId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.DateOfDismissal = values.DateOfDismissal.format('DD.MM.YYYY');
        values.EmployeeID = employeeId;
        values.Tables = awardTableData;
        values.Tables1 = calcDetailsTableData;
        values.Tables2 = calcTableData;

        const formData = new FormData();
        filelist.forEach(file => {
          formData.append('file', file);
        });

        for (const key in values) {
          if (key === 'file' || key === 'Tables') {
            continue;
          }
          formData.append(key, values[key]);
        }

        appendArray(formData, values.Tables, 'Tables');


        EmployeeDismissalServices.postData(formData)
          .then(res => {
            if (res.status === 200) {
              Notification("success", t("saved"));
              setLoader(false);
              history.push('/EmployeeDismissal');
            }
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err)
            setLoader(false);
          })
      })
      .catch(err => {
        Notification('error', t('PleaseFill'));
      })
  }

  // const onTableFilterHandler = (filterValues) => {
  //   setTableFilterValues(filterValues);
  //   fetchTableData({ pagination: defaultTablePagination }, filterValues);
  //   // console.log('Success:', filterValues);
  // };

  // const onTableFilterFailedHandler = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };

  // End Table functions

  // Employee modal Functions
  const closeEmployeeModalHandler = () => {
    setEmployeeModalVisible(false);
  }

  const getModalData = (name, id, enrolmentDocumentId) => {
    setEmployeeId(id);
    mainForm.setFieldsValue({ EmployeeFullName: name, EnrolmentDocumentID: enrolmentDocumentId });
  };
  // Employee modal Functions

  const setRowClassName = (record) => {
    return record.ID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }

  const calcCompensationChangeHandler = (value) => {
    setCalcCompensation(value);
  }

  const allSourceChangeHandler = (value) => {
    setAllSource(value);
  }

  const onCalcTableRow = (record) => {
    if (!disabledActions && editingKey === '') {
      return {
        onDoubleClick: () => {
          edit(record);
          let ignoreClickOnMeElement = document.querySelector('.clicked-row');
          document.addEventListener('click', function clickHandler(event) {
            let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
            if (!isClickInsideElement) {
              save(record.ID);
              document.removeEventListener('click', clickHandler);
            }
          });
        },
        onClick: () => {
          setRowId(record.ID);
        },
      };
    }
    return {
      onClick: () => {
        setRowId(record.ID);
      }
    }
  }

  // File 
  const uploadProps = {
    maxCount: 1,
    onRemove: file => {
      setFileList(prevState => {
        const index = prevState.indexOf(file);
        const newFileList = prevState.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setFileList(prevState => ([...prevState, file]));
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        Notification('error', t('fileSizeAlert'));
      }
      return false;
    },
    filelist,
  };

  const normFile = (e) => {
    // console.log('Upload event:', e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const deleteFileHandler = () => {
    setLoader(true);
    CommonServices.deleteFile(docId, tableId, 'employeedismissal')
      .then(res => {
        if (res.status === 200) {
          Notification('success', t('deleteded'));
          setLoader(false);
        }
      })
      .catch(err => {
        Notification('error', err);
        setLoader(false);
      })
  }

  const donwloadFileHandler = () => {
    setLoader(true);
    CommonServices.downloadFile(docId, tableId, 'employeedismissal')
      .then(res => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "empDismissal.pdf");
          document.body.appendChild(link);
          link.click();
          setLoader(false);
        }
      })
      .catch(err => {
        setLoader(false);
        Notification('error', t('fileNotFound'));
      })
  }
  // End File 

  return (
    <Fade>
      <MainCard title={t('EmployeeDismissal')}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id='mainForm'
            scrollToFirstError
            onFinish={fillTableHandler}
            onFinishFailed={fillTableHandlerFailed}
          >
            <Row gutter={[16, 16]} align="top">
              <Col xl={12} lg={12}>
                <Card
                  hoverable
                  title="Card"
                  size='small'
                  className='inputs-wrapper-card'
                  style={{ marginBottom: '16px' }}
                >
                  <Row gutter={[10, 10]}>
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
                        label={t("Date")}
                        name="Date"
                        rules={[
                          {
                            required: true,
                            message: t("pleaseSelect"),
                          },
                        ]}
                      >
                        <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("DateOfDismissal")}
                        name="DateOfDismissal"
                        rules={[
                          {
                            required: true,
                            message: t("pleaseSelect"),
                          },
                        ]}
                      >
                        <DatePicker placeholder={t("DateOfDismissal")} format='DD.MM.YYYY' style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
                <Card
                  hoverable
                  title="Card"
                  size='small'
                  className='inputs-wrapper-card'
                >
                  <Row gutter={[10, 10]}>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("Division")}
                        name="DivisionID"
                        rules={[
                          {
                            required: true,
                            message: t("pleaseSelect")
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          showSearch
                          placeholder={t("Division")}
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          onChange={divisionChangeHandler}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("Department")}
                        name="DepartmentID"
                        rules={[
                          {
                            required: true,
                            message: t("pleaseSelect")
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          showSearch
                          placeholder={t("Department")}
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          onChange={departmentChangeHandler}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("dismissalReason")}
                        name="ReasonsOfDismissalID"
                        rules={[
                          {
                            required: true,
                            message: t("pleaseSelect")
                          },
                        ]}
                      >
                        <Select
                          allowClear
                          showSearch
                          placeholder={t("dismissalReason")}
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {dismissalReasonList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={10} lg={12}>
                      <Form.Item
                        label={t("EnrolmentDocumentID")}
                        name="EnrolmentDocumentID"
                      >
                        <InputNumber
                          disabled
                          style={{ width: '100%' }}
                          className='disabled-input'
                          placeholder={t("EnrolmentDocumentID")}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={14} lg={12}>
                      <Space
                        align='start'
                        className='modal-input'
                      >
                        <Form.Item
                          label={t('Employee')}
                          name="EmployeeFullName"
                          style={{ width: '100%' }}
                          rules={[
                            {
                              required: true,
                              message: t('inputValidData'),
                            },
                          ]}
                        >
                          <Input
                            disabled
                            className='disabled-input'
                            placeholder={t('Employee')}
                          />
                        </Form.Item>
                        <Button
                          type="primary"
                          disabled={disabledActions}
                          onClick={() => {
                            setEmployeeModalVisible(true);
                          }}
                          icon={<i className='feather icon-user' aria-hidden="true" />}
                        />
                        <CSSTransition
                          mountOnEnter
                          unmountOnExit
                          in={employeeModalVisible}
                          timeout={300}
                        >
                          <EmployeeModal
                            visible={employeeModalVisible}
                            onCancel={closeEmployeeModalHandler}
                            getModalData={getModalData}
                            divisionId={divisionId}
                            departmentId={departmentId}
                          />
                        </CSSTransition>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xl={12} lg={12}>
                <Card
                  hoverable
                  title="Card"
                  size='small'
                  className='inputs-wrapper-card'
                  style={{ marginBottom: '16px' }}
                >
                  <Row gutter={[10, 10]}>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("CalculateCompensation")}
                        name="CalculateCompensation"
                        valuePropName="checked"
                      >
                        <Switch onChange={calcCompensationChangeHandler} />
                      </Form.Item>
                    </Col>
                    {calcCompensation &&
                      <>
                        <Col xl={8} lg={12}>
                          <Form.Item
                            label={t("ByAllSource")}
                            name="ByAllSource"
                            valuePropName="checked"
                          >
                            <Switch onChange={allSourceChangeHandler} />
                          </Form.Item>
                        </Col>
                        {allSource &&
                          <Col xl={8} lg={12}>
                            <Form.Item
                              label={t("OnlyBySelectedSource")}
                              name="OnlyBySelectedSource"
                              valuePropName="checked"
                            >
                              <Switch />
                            </Form.Item>
                          </Col>
                        }
                      </>
                    }
                  </Row>
                </Card>
                {calcCompensation &&
                  <Card
                    hoverable
                    title="Card"
                    size='small'
                    className='inputs-wrapper-card'
                  >
                    <Row gutter={[10, 10]}>
                      <Col xl={8} lg={12}>
                        <Form.Item
                          label={t("RoundingType")}
                          name="RoundingTypeID"
                          rules={[
                            {
                              required: true,
                              message: t("pleaseSelect")
                            },
                          ]}
                        >
                          <Select
                            allowClear
                            showSearch
                            placeholder={t("RoundingType")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                          >
                            {roundingTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={12}>
                        <Form.Item
                          label={t("BasicLeaveDaysCount")}
                          name="BasicLeaveDaysCount"
                        >
                          <InputNumber
                            min={0}
                            max={300}
                            placeholder={t("BasicLeaveDaysCount")}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xl={8} lg={12}>
                        <Form.Item
                          label={t("BonusMonthCount")}
                          name="BonusMonthCount"
                        >
                          <InputNumber
                            min={0}
                            max={12}
                            placeholder={t("BonusMonthCount")}
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xl={12} lg={12}>
                        <Form.Item
                          label={t("Comment")}
                          name="Comment"
                          rules={[
                            {
                              required: true,
                              message: t("inputValidData")
                            },
                          ]}
                        >
                          <TextArea placeholder={t("Comment")} rows={2} />
                        </Form.Item>
                      </Col>
                      {allSource &&
                        <Col xl={12} lg={12}>
                          <Form.Item
                            label={t("OrganizationsSettlementAccount")}
                            name="OrganizationsSettlementAccountID"
                          >
                            <Select
                              allowClear
                              showSearch
                              placeholder={t("OrganizationsSettlementAccount")}
                              style={{ width: '100%' }}
                              optionFilterProp="children"
                              filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {orgSettleAccList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                            </Select>
                          </Form.Item>
                        </Col>
                      }
                    </Row>
                  </Card>
                }
              </Col>

              <Col xl={3} lg={12}>
                <Form.Item
                  name="file"
                  label={t('upload')}
                  // valuePropName="fileList"
                  getValueFromEvent={normFile}
                // rules={[
                //   {
                //     required: true,
                //     message: t("pleaseSelect"),
                //   },
                // ]}
                >
                  <Space>
                    <Upload
                      {...uploadProps}
                      openFileDialogOnClick
                      accept='.pdf'
                    >
                      <Button icon={<UploadOutlined />}>{t('clickUpload')}</Button>
                    </Upload>
                    {docId !== 0 &&
                      <>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={donwloadFileHandler}
                        >
                          &nbsp;{t('download')}
                        </Button>
                        <Button
                          type="danger"
                          icon={<i className="feather icon-trash-2" aria-hidden="true" />}
                          onClick={deleteFileHandler}
                        >
                          &nbsp;{t('Delete')}
                        </Button>
                      </>
                    }
                  </Space>
                </Form.Item>
              </Col>

            </Row>
          </Form>

          
          {calcCompensation &&
            <>
              <Space size='middle' className='fill-btns-wrapper' style={{ marginTop: '16px' }}>
                <Button
                  htmlType="submit"
                  form="mainForm"
                  disabled={calcTableData.length !== 0 || disabledActions}
                >
                  {t("calculate")}
                </Button>
                <Text
                  mark
                  strong
                  underline
                  className='highlighted-text'
                >
                  {t('sum')}: {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(sum)}
                </Text>
                {/* <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("deleted")}</Button>
            <Button onClick={clearTableHandler} disabled={disabledActions}>{t("Tozalash")}</Button> */}
              </Space>
              <Tabs defaultActiveKey="1">
                <TabPane tab={t('Табель')} key="1">
                  <Form
                    form={tableForm}
                    component={false}
                  >
                    <Table
                      bordered
                      size='middle'
                      rowClassName={setRowClassName}
                      className="main-table"
                      showSorterTooltip={false}
                      dataSource={calcTableData}
                      columns={mergedColumns}
                      rowKey={(record) => record.ID}
                      components={{
                        body: {
                          cell: EditableCell
                        }
                      }}
                      scroll={{
                        x: "max-content",
                        y: '90vh'
                      }}
                      onRow={(record) => onCalcTableRow(record)}
                    />
                  </Form>
                </TabPane>
                <TabPane tab={t('awards')} key="2">
                  <Table
                    bordered
                    size='middle'
                    rowClassName='table-row'
                    className="main-table"
                    dataSource={awardTableData}
                    columns={awardTableColumns}
                    rowKey={(record) => record.ID}
                    scroll={{
                      x: "max-content",
                      y: '90vh'
                    }}
                  />
                </TabPane>
                <TabPane tab={t('calcDetails')} key="3">
                  <Table
                    bordered
                    size='middle'
                    rowClassName='table-row'
                    className="main-table"
                    showSorterTooltip={false}
                    dataSource={calcDetailsTableData}
                    columns={calcDetailsTableColumns}
                    rowKey={(record) => record.ID}
                    scroll={{
                      x: "max-content",
                      y: '90vh'
                    }}
                  />
                </TabPane>
              </Tabs>
            </>
          }
          <Space size='middle' className='btns-wrapper'>
            <Button
              type="danger"
              onClick={() => {
                Notification("warning", t("not-saved"));
                history.goBack();
              }}
            >
              {t("back")}
            </Button>
            <Button
              onClick={saveAllHandler}
              type="primary"
              disabled={disabledActions}
            >
              {t("save")}
            </Button>
          </Space>
        </Spin>
      </MainCard>
    </Fade >
  );
};

export default UpdateEmployeeDismissal;
