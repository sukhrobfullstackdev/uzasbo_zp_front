
import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Space, Popconfirm, Input, Spin, Table, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { UserOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";

import MainCard from "../../../../components/MainCard";
import classes from "./EmployeeTempEnrolment.module.css";
import { Notification } from "../../../../../helpers/notifications";
import EmployeeMovementModal from "./EmployeeMovementModal.js";
import EmployeeEnrQualicationModal from "./EmployeeEnrQualicationModal";
import EmployeeTempEnrolmentServices from "../../../../../services/Documents/Personnel_accounting/EmployeeTempEnrolment/EmployeeTempEnrolment.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import TableModal from "./TableModal";
import { CSSTransition } from 'react-transition-group';

const EdittableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  values,
  map,
  index,
  settlementAccountList,
  children,
  onEnter,
  ...restProps
}) => {

  let inputNode = <Input />;
  if (dataIndex === 'Percentage') {
    inputNode = <InputNumber
      min={0} max={1000}
      onPressEnter={onEnter}
       onBlur={onEnter} 
      style={{ width: '100%' }}
      decimalSeparator=','
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      className='edit-sum-input'
    />;
  } else if (dataIndex === 'Sum' || dataIndex === 'OutSum') {
    inputNode = <InputNumber
      onPressEnter={onEnter}
      onBlur={onEnter} 
      style={{ width: '100%' }}
      decimalSeparator=','
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      className='edit-sum-input'
    />
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        //  rules={[
        //    {
        //      required: true,
        //      message: `Please Input ${title}!`,
        //    },
        //  ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

//main function
const EmployeeMovement = (props) => {
  const [loader, setLoader] = useState(true);
  const [rowId, setRowId] = useState(null);
  //const [EmployeeMovementDate, setEmployeeMovementData] = useState([]);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
  const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [qualificationCategoryId, setQualificationCategoryId] = useState(null);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [listOfPositionList, setListOfPositionList] = useState([]);
  const [enrolmentTypeList, setEnrolmentTypeList] = useState([]);
  const [WorkScheduleList, setWorkScheduleList] = useState([]);
  const [settlementAccountList, setSettlementAccountList] = useState([]);
  const [roundingTypeList, setRoundingTypeList] = useState([]);
  const [mainCardData, setMaincardData] = useState([]);
  const [minimalSalary, setMinimalSalary] = useState([]);
  // const [minimalSalaryList, setMinimalSalaryList] = useState([]);
  const [tariffScaleList, setTariffScaleList] = useState([]);
  const [showTariffScale, setShowTariffScale] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)

  //Movement modal table
  const [tableData, setTableData] = useState([]);
  const [MovementTableModalVisible, setMovementTableModalVisible] = useState(false);
  const [disabledActions, setDisabledActions] = useState(false);
  const [backendTableData, setBackendTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState({
    pagination: {
      current: 1,
      pageSize: 50
    }
  });

  const [tableLoading, setTableLoading] = useState(false);
  // table date
  const { size } = useState([]);
  const { TextArea } = Input;
  const { Option } = Select;
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;
  const MultiSourceSubCalculationKind = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('MultiSourceSubCalculationKind');
  const totalReqRecCashRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');

  useEffect(() => {
    async function fetchData() {
      try {
        const EmployeeMovement = await EmployeeTempEnrolmentServices.getById(docId);
        const divitionLs = await HelperServices.GetDivisionList();
        const listOfPositionLs = await HelperServices.getListOfPositionList();
        const enrolmentTypeLs = await HelperServices.GetEnrolmentTypeList();
        const WorkScheduleLs = await HelperServices.GetWorkScheduleList();
        const roundingTypeLs = await HelperServices.GetRoundingTypeList();
        const settlementAccountList = await HelperServices.getOrganizationsSettlementAccountList();
        const minimalSalaryLs = await HelperServices.GetMinimalSalary(EmployeeMovement.data.Date);
        const tariffScaleList = await HelperServices.GetTariffScaleTableList(EmployeeMovement.data.TariffScaleID);
        setTariffScaleList(tariffScaleList.data);
        setDivisionList(divitionLs.data);
        setListOfPositionList(listOfPositionLs.data);
        setEnrolmentTypeList(enrolmentTypeLs.data);
        setSettlementAccountList(settlementAccountList.data)
        setWorkScheduleList(WorkScheduleLs.data)
        setRoundingTypeList(roundingTypeLs.data);
        setMaincardData(EmployeeMovement.data)
        setMinimalSalary(minimalSalaryLs)
        // setMinimalSalaryList(minimalSalaryLs.data);
        setTableData(EmployeeMovement.data.Tables)
        //  setEmployeeMovementData(EmployeeMovement.data);
        setEmployeeId(EmployeeMovement.data.EmployeeID)
        setQualificationCategoryId(EmployeeMovement.data.QualificationCategoryID)
        divisionChangeHandler(EmployeeMovement.data.DivisionID);
        if (EmployeeMovement.data.StatusID === 2) {
          setDisabledActions(true);
        }
        setShowTariffScale()
        setLoader(false);
        form.setFieldsValue({
          ...EmployeeMovement.data,
          Date: moment(EmployeeMovement.data.Date, 'DD.MM.YYYY'),
          EndDate: moment(EmployeeMovement.data.EndDate, 'DD.MM.YYYY'),
          minimalSalaryls: minimalSalaryLs.data,
          // Number: EmployeeMovement.data.Number = 0 ? EmployeeMovement.data.Number : null,
         //  ListOfPositionID: EmployeeMovement.data.ListOfPositionID = 0 ? EmployeeMovement.data.ListOfPositionID : null,
         //  DivisionID: EmployeeMovement.data.DivisionID = 0 ? EmployeeMovement.data.DivisionID : null,
         // DepartmentID: EmployeeMovement.data.DepartmentID = 0 ? EmployeeMovement.data.DepartmentID : null,
         // EnrolmentDocumentID: EmployeeMovement.data.EnrolmentDocumentID = 0 ? EmployeeMovement.data.EnrolmentDocumentID : null,
         // EnrolmentTypeID: EmployeeMovement.data.EnrolmentTypeID = 0 ? EmployeeMovement.data.EnrolmentTypeID : null,
         // RoundingTypeID: EmployeeMovement.data.RoundingTypeID = 0 ? EmployeeMovement.data.RoundingTypeID : null,
          // Salary: EmployeeMovement.data.Salary = 0 ? EmployeeMovement.data.Salary : null,
          // Rate: EmployeeMovement.data.Rate = 0 ? EmployeeMovement.data.Rate : null
        })
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [docId, form]);
  //useffect end
  const createTableDataHandler = useCallback((values) => {
    setTableData((tableData) => [values, ...tableData])
    setMovementTableModalVisible(false)
  }, []);

  //table row delete status = 3
  const tableDataDeleteHandler = (deleteKey) => {
    tableData.forEach(item => {
      if (item.SubCalculationKindID === 0 && item.key === deleteKey) {
        item.Status = 3
      } else if (item.SubCalculationKindID !== 0 && item.SubCalculationKindID === deleteKey) {
        item.Status = 3
      }
    })
    const filteredFrontData = tableData.filter(item => {
      return (item.Status !== 3)
    })
    const filteredBackendData = tableData.filter(item => {
      return (item.Status === 3)
    })
    setBackendTableData([...backendTableData, ...filteredBackendData])
    setTableData(filteredFrontData)
  }
  //table row fill
  const fillTableHandler = async (params) => {
    form.validateFields()
      .then((values) => {
        values.EmployeeID = employeeId;
        values.QualificationCategoryID = qualificationCategoryId;
        values.ID = currentDocId
        values.OrganizationID = 1363
        values.Tables = [...tableData];
        const { pagination } = tablePagination;
        console.log(pagination)
        setTableLoading(true);
        EmployeeTempEnrolmentServices.postDataFillTableData(values)
          .then(res => {
            if (res.status === 200) {
              setTableData(res.data);
              setCurrentDocId(res.data[0].OwnerID)
              setTableLoading(false);
              setTablePagination({
                pagination: {
                  ...params.pagination,
                  total: res.data.total,
                },
              });
            }
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setLoader(false);
          })
      })
  }
  //delete row clear
  const clearRowsHandler = () => {
    let deletedData = [...tableData];
    deletedData.forEach(item => {
      item.Status = 3
    })
    const filteredFrontData = deletedData.filter(item => {
      return (item.Status !== 3)
    })
    const filteredBackendData = deletedData.filter(item => {
      return (item.Status === 3)
    })
    setBackendTableData([...backendTableData, ...filteredBackendData])
    setTableData(filteredFrontData)
  };

  const calculationTableHandler = () => {
    form.validateFields()
      .then((values) => {
        values.EmployeeID = employeeId;
        values.QualificationCategoryID = qualificationCategoryId;
        values.ID = tableData[0].OwnerID;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.Tables = [...tableData];
        values.Tables = [...tableData, ...backendTableData]
        setTableLoading(true);
        EmployeeTempEnrolmentServices.postDataCalTableData(values)
          .then(res => {
            setTableData(res.data.Tables);
            form.setFieldsValue({ Salary: res.data.Salary });
            Notification("success", t("Calculate"));
            setTableLoading(false);;
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setTableLoading(false);
          })
      })

  }
  //save All ADD
  const saveAllHandler = () => {
    form.validateFields()
      .then((values) => {
        values.EmployeeID = employeeId;
        values.QualificationCategoryID = qualificationCategoryId;
        values.ID = currentDocId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.Tables = [...tableData];
        values.Tables = [...tableData, ...backendTableData]
        setLoader(true);
        EmployeeTempEnrolmentServices.postData(values)
          .then(res => {
            history.push('/EmployeeTempEnrolment');
            Notification("success", t("saved"));
            setLoader(false);
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setLoader(false);
          })
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err)
      })
  }
  //division department
  const divisionChangeHandler = divisionId => {
    HelperServices.getDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err => Notification('error', err))
  }
  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };
  const onReset = () => {
    form.setFieldsValue({ QualificationCategoryName: null });
  };
  //tariffScale
  const tariffScaleHandler = (TariffScaleID, data) => {
    HelperServices.GetTariffScaleTableList(data['data-tariff'])
      .then(res => {
        setTariffScaleList(res.data);
      })
      .catch(err => Notification('error', err))
  }
  const SelectChange = (e, option) => {
    setShowTariffScale(option['data-tariff']);
  }

  const getFullName = (name, ID) => {
    setEmployeeId(ID);
    //console.log(ID)
    form.setFieldsValue({ FullName: name, EmployeeID: ID });
  };

  const getQualificationCategoryName = (name, id) => {
    setQualificationCategoryId(id);
    form.setFieldsValue({ QualificationCategoryName: name });
  };


  // fetch = (params = {}, filterFormValues) => {
  //   const date = {
  //     EndDate: filterFormValues.EndDate ? filterFormValues.EndDate.format("DD.MM.YYYY") : moment().format("DD.MM.YYYY"),
  //     StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(10, "year").format("DD.MM.YYYY"),
  //   };
  // };



  // table data modal
  const getModalData = (values) => {
    let newTableData = {
      ID: 0,
      OwnerID: 0,
      OrderNumber: 0,
      IsByAppoint: false,
      Sum: 0,
      Percentage: 0,
      OutSum: 0,
      ParentID: values.SubCalculationKindParentID,
      SubCalculationKindID: values.ID,
      SubCalculationKindName: values.Name,
      CreatedUserID: 0,
      ModifiedUserID: 0,
      DateOfCreated: "01.01.0001",
      DateOfModified: "01.01.0001",
      Status: 1
    }
    setTableData((prevState) => [...prevState, newTableData]);
  };
  //tabledata
  const isEditing = (values) => values.SubCalculationKindID === editingKey;
  const edit = (values) => {
    tableForm.setFieldsValue({
      ...values,
    });
    setEditingKey(values.SubCalculationKindID);
  };
  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.SubCalculationKindID);
      if (index > -1) {
        const item = newData[index];
        // item.Status = 2;
        if (item.Status === 0) {
          item.Status = 2;
        } else if (item.Status !== 0) {
          item.Status = 1;
        }


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

  const setRowClassName = (values) => {
    return values.SubCalculationKindID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }
  // Table valuesum
  const Tables = [

    {
      title: t('SubCalculationKindName'),
      dataIndex: 'SubCalculationKindName',
      key: 'SubCalculationKindID',

    },
    {
      title: t('Sum'),
      dataIndex: 'Sum',
      key: 'Sum',
      width: '15%',
      editable: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t('Percentage'),
      dataIndex: 'Percentage',
      key: 'Percentage',
      editable: true,
      width: '10%',
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)

    },
    {
      title: t('OutSum'),
      dataIndex: 'OutSum',
      key: 'OutSum',
      className: classes['out-sum'],
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },

    {
      title: t('actions'),
      key: 'action',
      width: '10%',
      align: 'center',
      render: (values) => {
        return (
          <Space size="middle">
            {/* <span
              onClick={() => {
                setEditTableModalVisible(true);
                setEdit(record.ID ? record.ID : record.key);
              }}
              style={{ cursor: 'pointer', color: '#1890ff' }}>
              <i
                className='feather icon-edit action-icon'
                aria-hidden="true" />
            </span> */}
            <Popconfirm
              title={t('Delete')}
              onConfirm={() => {
                tableDataDeleteHandler(values.SubCalculationKindID === 0 ? values.SubCalculationKindID : values.SubCalculationKindID);
              }}
              okText={'yes'}
              cancelText={'cancel'}>
              <span style={{ color: '#1890ff', cursor: 'pointer' }}>
                <i className="feather icon-trash-2 action-icon" />
              </span>
            </Popconfirm>
          </Space>
        )
      },
    },
  ];

  const roleBasedColumns = Tables.filter(item => {
    if (MultiSourceSubCalculationKind) {
      return item;
    }
    return item.dataIndex !== 'OrganizationsSettlementAccountID';
  });

  //table
  const mergedColumns = roleBasedColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (values) => ({
        values,
        inputType: "number",
        dataIndex: col.dataIndex,
        settlementAccountList: settlementAccountList,
        title: col.title,
        editing: isEditing(values),
        onEnter: () => save(values.SubCalculationKindID),
        onPressEnter: () => save(values.SubCalculationKindID),
      })
    };
  });

  //main
  return (
    <Fade >
      <MainCard title={t("EmployeeTempEnrolment")} isOption EmployeeEnrolment = {mainCardData} minimalSalary = {minimalSalary}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={form}
            id="form"
            onFinish={saveAllHandler}
            onFinishFailed={onFinishFailed}
            className={classes.FilterForm}
          >
            <Row gutter={[16, 16]}>
              <Col xl={3} lg={8}>
                {/* <div className={classes.InputsWrapper}> */}
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

                {/* </div> */}
              </Col>

              <Col xl={3} lg={8}>
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
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xl={3} lg={8}>
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
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xl={6} lg={8}>

                <div className={classes.EmployeeMovementModal}>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={employeeModalTableVisible}
                    timeout={300}
                  >
                    <EmployeeMovementModal
                      key="5"
                      visible={employeeModalTableVisible}
                      onCancel={() => setEmployeeTableVisible(false)}
                      getFullName={getFullName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("Employee")}
                    name="FullName"

                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}
                  >
                    <Input disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      setEmployeeTableVisible(true);
                    }}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<UserOutlined />}
                    size={size}
                  />
                </div>
              </Col>
              <Col xl={4} lg={8}>
                {/* <div className={classes.InputsWrapper}> */}
                <Form.Item
                  label={t("position")}
                  name="ListOfPositionID"
                  // style={{ width: "50%" }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}>
                  <Select
                    placeholder={t("position")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={tariffScaleHandler}
                    onSelect={SelectChange}
                  >
                    {listOfPositionList.map(item => <Option key={item.ID} value={item.ID} data-tariff={item.TariffScaleID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>

                {/* </div> */}
              </Col>

              <Col xl={5} lg={8}>
                <Form.Item
                  label={t("Division")}
                  name="DivisionID"
                  // style={{ width: "50%" }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("DivName")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={divisionChangeHandler}
                  >
                    {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={5} lg={8}>
                <Form.Item
                  label={t("department")}
                  name="DepartmentID"
                  // style={{ width: "55%" }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}>
                  <Select
                    placeholder={t("department")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
                {/* </div> */}
              </Col>

              {/* <Col xl={3} lg={12}>
                <Form.Item

                  label={t("Salary")}
                  name="Salary"
                  // getSalary={getSalary}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <InputNumber
                    disabled
                    style={{ color: 'black', width: '100%' }}
                    decimalSeparator=','
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                  />
                </Form.Item>
              </Col> */}

              <Col xl={4} lg={12}>
                {/* <div className={classes.InputsWrapper}> */}
                <Form.Item
                  label={t("EnrolmentTypeName")}
                  name="EnrolmentTypeID"
                  // style={{ width: "50%" }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}>
                  <Select
                    placeholder={t("EnrolmentTypeID")}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {enrolmentTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item>

                {/* </div> */}
              </Col>

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("WorkScheduleName")}
                  name="WorkScheduleID"
                  // style={{ width: "45%" }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}>
                  <Select
                    placeholder={t("WorkScheduleID")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {WorkScheduleList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={5} lg={12}>
                {/* <div className={classes.InputsWrapper}> */}
                <Form.Item
                  label={t("OrganizationsSettlementAccount")}
                  name="OrganizationsSettlementAccountID"
                  // style={{ width: "90%" }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}>
                  <Select
                    placeholder={t("OrganizationsSettlementAccount")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {settlementAccountList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                  </Select>
                </Form.Item>

                {/* </div> */}
              </Col>

              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("RoundingTypeID")}
                  name="RoundingTypeID"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}>
                  <Select
                    placeholder={t("RoundingType")}
                    // style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {roundingTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={6} lg={12}>
                <div className={classes.EmployeeMovementModal}>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={employeeEnrQualicationModal}
                    timeout={300}
                  >
                    <EmployeeEnrQualicationModal
                      visible={employeeEnrQualicationModal}
                      onCancel={() => setEmployeeEnrQualicationModal(false)}
                      getQualificationCategoryName={getQualificationCategoryName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("QualificationCategoryName")}
                    name="QualificationCategoryName"
                    style={{ width: "100%" }}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t("Please input valid"),
                  //   },
                  // ]}
                  >
                    <Input disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      setEmployeeEnrQualicationModal(true);
                    }}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<SearchOutlined />}
                    size={size}
                  />
                  <Button
                    type="primary"
                    onClick={onReset}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<DeleteOutlined />}
                    size={size}
                  />
                </div>
              </Col>
              {/* <Col xl={3} lg={12}>
                  <Form.Item
                    label={t('Minimal Salary')}
                    name="minimalSalaryls"
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}>

                    <InputNumber
                      disabled
                      style={{ color: 'black', width: '100%' }}
                      decimalSeparator=','
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    />
                  </Form.Item>
              </Col> */}

              {showTariffScale !== 3 && (
                <Col xl={2} lg={12}>
                  <Form.Item
                    label={t("Rate")}
                    name="Rate"

                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]} >
                    <InputNumber max={0.5} min={0} placeholder={t("Rate")} />
                  </Form.Item>

                </Col>
              )}

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("Tariff Scale")}
                  name="TariffScaleTableID"

                // rules={[
                //   {
                //     required: true,
                //     message: t("inputValidData"),
                //   },
                // ]}
                >
                  <Select
                    placeholder={t("Tariff Scale")}
                    style={{ width: '100%' }}
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {tariffScaleList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={2} lg={12}>
                <Form.Item
                  label={t("CorrectionFactor")}
                  name="CorrectionFactor"
                  style={{ width: '100%' }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}>
                  <InputNumber style={{ width: '100%' }} placeholder={t("CorrectionFactor")} step="1.00" />
                </Form.Item>
              </Col>

              <Col xl={7} lg={6}>
                <Form.Item
                  label={t("Comment")}
                  name="Comment"
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}>
                  <TextArea rows={1} />
                </Form.Item>
              </Col>

              <Col xl={24} lg={24} >
                <Form form={tableForm} component={false} >
                  <div className={classes.buttons}>
                    <Button type="date" onClick={() => { setMovementTableModalVisible(true); }} disabled={disabledActions}> {t('add-new')} + </Button>
                    {/* <Button onClick={fillTableHandler} disabled={tableData.length !== 0 || disabledActions} >{t("Tuldirish")}</Button> */}
                    {totalReqRecCashRole &&
                      <Button
                        onClick={fillTableHandler}
                        disabled={tableData.length !== 0 || disabledActions}
                      >
                        {t("Tuldirish")}
                      </Button>
                    }
                    <Button onClick={clearRowsHandler} disabled={disabledActions}>{t("Tozalash")}</Button>
                    <Button onClick={calculationTableHandler} disabled={tableData.length === 0 || disabledActions}>{t("Hisoblash")}</Button>
                  </div>

                  <Table
                    columns={mergedColumns}
                    dataSource={[...tableData]}
                    rowClassName={setRowClassName}
                    rowKey={record => record.key ? record.key : record.SubCalculationKindID}
                    key={record => record.key}
                    className="main-table inner-table"
                    pagination={false}
                    showSorterTooltip={false}
                    bordered
                    loading={tableLoading}
                    components={{
                      body: {
                        cell: EdittableCell
                      }
                    }}
                    onRow={(values) => {
                      if (!disabledActions && editingKey === '') {
                        return {
                          onDoubleClick: () => {
                            edit(values);
                            // let ignoreClickOnMeElement = document.querySelector('.clicked-row');
                            // document.addEventListener('click', function clickHandler(event) {
                            //   let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                            //   if (!isClickInsideElement) {
                            //     save(values.SubCalculationKindID);
                            //     document.removeEventListener('click', clickHandler);
                            //   }
                            // });

                          },
                          onClick: () => {
                            setRowId(values.SubCalculationKindID);
                          },
                        };
                      }
                    }}
                  />
                </Form>
              </Col>
              <CSSTransition
                mountOnEnter
                unmountOnExit
                in={MovementTableModalVisible}
                timeout={300}
              >
                <TableModal
                  visible={MovementTableModalVisible}
                  onCancel={() => setMovementTableModalVisible(false)}
                  onCreate={createTableDataHandler}
                  tableData={tableData}
                  getModalData={getModalData}

                />
              </CSSTransition>
              <Col xl={24} lg={24}>
                <div className={classes.Buttons}>
                  <Button
                    type="danger"
                    onClick={() => {
                      history.goBack();
                      Notification("warning", t("not-saved"));
                    }}>
                    {t("back")}
                  </Button>
                  <Button
                    onClick={saveAllHandler}
                    type="primary"
                  >
                    {t("save")}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </MainCard>
    </Fade>
  );
};
export default EmployeeMovement;
