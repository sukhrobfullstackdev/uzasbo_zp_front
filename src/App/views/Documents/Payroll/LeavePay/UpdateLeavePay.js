import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, Table, Space, Tabs, InputNumber, Card, Typography, Upload } from "antd";
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
import LeavePayServices from "../../../../../services/Documents/Payroll/LeavePay/LeavePay.services";
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



const UpdateLeavePay = (props) => {
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [roundingTypeList, setRoundingTypeList] = useState([]);
  const [orgSettleAccList, setOrgSettleAccList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [subCalcKindList, setSubCalcKindList] = useState([]);
  const [calcTypeList, setCalcTypeList] = useState([]);
  const [calcTypeId, setCalcTypeId] = useState(null);
  const [rowId, setRowId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [divisionId, setDivisionId] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [sum, setSum] = useState(null);
  const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [disabledActions, setDisabledActions] = useState(false);
  const [loader, setLoader] = useState(true);

  // Table states
  const [calcTableData, setCalcTableData] = useState([]);
  const [awardTableData, setAwardTableData] = useState([]);
  const [calcDetailsTableData, setCalcDetailsTableData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [filelist, setFileList] = useState([]);
  const [tableId, setTableId] = useState(null);


  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const [tableForm] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const [leavePayment, divisionLs, orgSettleAccLs, roundingTypeLs, expensesLs, SubCalculationKindLs, calcTypeLs] = await Promise.all([
        LeavePayServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.GetDivisionList(),
        HelperServices.getOrganizationsSettlementAccountList(),
        HelperServices.getRoundingTypeListForEnrolment(),
        HelperServices.getItemOfExpensesList(0),
        HelperServices.getAllSubCalculationKindList({ IsLeavePay: true }),
        HelperServices.getLeaveCalcType()
      ]);

      if (props.match.params.id) {
        const departmentLs = await HelperServices.getDepartmentList(leavePayment.data.DivisionID);
        setDepartmentList(departmentLs.data);
        setEmployeeId(leavePayment.data.EmployeeID);
        setDivisionId(leavePayment.data.DivisionID);
        setDepartmentId(leavePayment.data.DepartmentID);
        setCalcTypeId(leavePayment.data.CalcTypeID);
        setAwardTableData(leavePayment.data.Tables);
        setCalcDetailsTableData(leavePayment.data.Tables1);
        setCalcTableData(leavePayment.data.Tables2);
      }
      setDisabledActions(leavePayment.data.StatusID === 2);
      setDivisionList(divisionLs.data);
      setOrgSettleAccList(orgSettleAccLs.data);
      setRoundingTypeList(roundingTypeLs.data);
      setSum(leavePayment.data.Sum);
      setCalcTableData(leavePayment.data.Tables2);
      setAwardTableData(leavePayment.data.Tables);
      setCalcDetailsTableData(leavePayment.data.Tables1);
      setExpensesList(expensesLs.data);
      setSubCalcKindList(SubCalculationKindLs.data.rows);
      setCalcTypeList(calcTypeLs.data);
      setTableId(leavePayment.data.TableID);
      setLoader(false);
      mainForm.setFieldsValue({
        ...leavePayment.data,
        Date: moment(leavePayment.data.Date, 'DD.MM.YYYY'),
        BeginDate: moment(leavePayment.data.BeginDate === null ? new Date() : leavePayment.data.BeginDate, 'DD.MM.YYYY'),
        EndDate: moment(leavePayment.data.EndDate === null ? new Date() : leavePayment.data.EndDate, 'DD.MM.YYYY'),
        ForBeginDate: moment(leavePayment.data.ForBeginDate, 'DD.MM.YYYY'),
        ForEndDate: moment(leavePayment.data.ForEndDate, 'DD.MM.YYYY'),
      })
    }
    fetchData().catch(err => {
      Notification('error', err)
    });
  }, [props.match.params.id, mainForm]);


  const divisionChangeHandler = divisionId => {
    console.log(divisionId, 'division');
    mainForm.setFieldsValue({ EmployeeFullName: null, DepartmentID: null, EnrolmentDocumentID: null });
    setDivisionId(divisionId);
    setEmployeeId(null);
    if (divisionId === undefined) {
      setDepartmentList([]);
      setDivisionId(null)
      setDepartmentId(null)
    } else {
      HelperServices.getAllDepartmentList(divisionId)
        .then(res => {
          setDepartmentList(res.data);
        })
        .catch(err => Notification('error', err))
    }

  }

  const departmentChangeHandler = id => {
    mainForm.setFieldsValue({ EmployeeFullName: null, EnrolmentDocumentID: null });
    setEmployeeId(null);
    if (id === undefined) {
      setDepartmentId(null)
    } else {
      setDepartmentId(id);
    }
  }

  // Table functions
  const isEditing = (record) => record.ID === editingKey;

  const edit = (record) => {
    tableForm.setFieldsValue({
      ...record,
    });
    setEditingKey(record.ID);
  };



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
      title: t("SubCalculationKindName"),
      dataIndex: "SubCalculationKindName",
      editable: true,
      width: 140,
      sorter: (a, b) => a.SubCalculationKindName.length - b.SubCalculationKindName.length,
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
      title: t("SubCalculationKindName"),
      dataIndex: "SubCalculationKindName",
      editable: true,
      width: 140,
      sorter: (a, b) => a.SubCalculationKindName.length - b.SubCalculationKindName.length,
    },

    {
      title: t("InSum"),
      dataIndex: "InSum",
      // width: 120,
      sorter: (a, b) => a.OutSum - b.OutSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
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


  const fillTableHandler = async (values) => {
    values.ID = +docId;
    values.Date = values.Date.format('DD.MM.YYYY');
    values.BeginDate = values.BeginDate.format('DD.MM.YYYY');
    values.EndDate = values.EndDate.format('DD.MM.YYYY');
    values.ForBeginDate = values.ForBeginDate.format('DD.MM.YYYY');
    values.ForEndDate = values.ForEndDate.format('DD.MM.YYYY');
    values.EmployeeID = employeeId;
    setLoader(true);
    try {
      const tablesData = await LeavePayServices.calculate(values);
      if (tablesData.status === 200) {
        mainForm.setFieldsValue({
          ...tablesData.data,
          Date: moment(tablesData.data.Date, 'DD.MM.YYYY'),
          BeginDate: moment(tablesData.data.BeginDate, 'DD.MM.YYYY'),
          EndDate: moment(tablesData.data.EndDate, 'DD.MM.YYYY'),
          ForBeginDate: moment(tablesData.data.ForBeginDate, 'DD.MM.YYYY'),
          ForEndDate: moment(tablesData.data.ForEndDate, 'DD.MM.YYYY'),
        })
        setCalcTableData(tablesData.data.Tables2);
        setAwardTableData(tablesData.data.Tables);
        setSum(tablesData.data.Sum);
        setCalcDetailsTableData(tablesData.data.Tables1);
        setDocId(tablesData.data.ID);
        setLoader(false);

      }
    } catch (error) {
      setLoader(false);
      Notification('error', error);
    }
  };

  const fillTableHandlerFailed = (errorInfo) => {
    Notification('error', t('PleaseFill'));
  };

  const saveAllHandler = () => {
    mainForm.validateFields()
      .then((values) => {
        setLoader(true);
        values.ID = +docId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.BeginDate = values.BeginDate.format('DD.MM.YYYY');
        values.EndDate = values.EndDate.format('DD.MM.YYYY');
        values.ForBeginDate = values.ForBeginDate.format('DD.MM.YYYY');
        values.ForEndDate = values.ForEndDate.format('DD.MM.YYYY');
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

        LeavePayServices.postData(formData)
          .then(res => {
            if (res.status === 200) {
              Notification("success", t("saved"));
              setLoader(false);
              history.push('/LeavePay');
            }
          })
          .catch(err => {
            setLoader(false);
            Notification("error", err);
          })
      })
      .catch(err => {
        Notification('error', t('PleaseFill'));
      })
  }

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

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const deleteFileHandler = () => {
    setLoader(true);
    CommonServices.deleteFile(docId, tableId, 'leavepay')
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
    CommonServices.downloadFile(docId, tableId, 'leavepay')
      .then(res => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "leavepay.pdf");
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

  const calcTypeChangeHandler = (e) => {
    setCalcTypeId(e);
  }

  return (
    <Fade>
      <MainCard title={t('LeavePay')}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id='mainForm'
            scrollToFirstError
            onFinish={fillTableHandler}
            onFinishFailed={fillTableHandlerFailed}
          >
            <Row gutter={[16, 0]} align="top">
              <Col xl={4} lg={5}>
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
              <Col xl={4} lg={5}>
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
              <Col xl={6} lg={8}>
                <Form.Item
                  label={t("SubCalculationKind")}
                  name="SubCalculationKindID"
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
                    placeholder={t("SubCalculationKind")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {subCalcKindList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={5} lg={7}>
                <Form.Item
                  label={t("calcType")}
                  name="CalcTypeID"
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
                    placeholder={t("calcType")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    onChange={calcTypeChangeHandler}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {calcTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={5} lg={6}>
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
              <Col xl={4} lg={5}>
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
              {calcTypeId !== 1 &&
                <Col xl={6} lg={8}>
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
              <Col xl={6} lg={8}>
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
                    disabled={(divisionId === null || departmentId === null)}
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
              <Col xl={5} lg={6}>
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
              <Col xl={4} lg={5}>
                <Form.Item
                  label={t("BeginDate")}
                  name="BeginDate"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker
                    placeholder={t("BeginDate")}
                    format='DD.MM.YYYY'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={5}>
                <Form.Item
                  label={t("EndDate")}
                  name="EndDate"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker
                    placeholder={t("EndDate")}
                    format='DD.MM.YYYY'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={5}>
                <Form.Item
                  label={t("ForBeginDate")}
                  name="ForBeginDate"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker
                    placeholder={t("ForBeginDate")}
                    format='DD.MM.YYYY'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={5}>
                <Form.Item
                  label={t("ForEndDate")}
                  name="ForEndDate"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker
                    placeholder={t("ForEndDate")}
                    format='DD.MM.YYYY'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={6}>
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
              <Col xl={3} lg={4}>
                <Form.Item
                  label={t("AddPayedDays")}
                  name="AddPayedDays"
                >
                  <InputNumber
                    min={0}
                    max={300}
                    placeholder={t("AddPayedDays")}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={6}>
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



              <Col xl={4} lg={5}>
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



              <Col xl={14} lg={12}>
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
            </Row>
          </Form>
          <Space size='middle' className='fill-btns-wrapper' style={{ marginTop: '16px' }}>
            <Button
              htmlType="submit"
              form="mainForm"
              disabled={calcTableData.length !== 0 && disabledActions}
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

export default UpdateLeavePay;
