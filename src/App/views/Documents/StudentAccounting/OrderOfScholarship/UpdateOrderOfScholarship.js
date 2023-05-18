
import React, { useState, useEffect} from "react";
import { Row, Col, Form, Button, DatePicker, Input, Spin, Table, InputNumber, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import MainCard from "../../../../components/MainCard";
import classes from "./OrderOfScholarship.module.css";
import { Notification } from "../../../../../helpers/notifications";
import EmployeeMovementModal from "./EmployeeMovementModal.js";
import OrderOfScholarshipServices from "../../../../../services/Documents/StudentAccounting/OrderOfScholarship/OrderOfScholarship.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import { CSSTransition } from 'react-transition-group';
import EdittableCell from "./EdittableCell";
import { UserOutlined } from "@ant-design/icons";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { TextArea } = Input;
const { Option } = Select;
let tableRowChanged = false;

//main function
const EditOrderOfScholarship = (props) => {
  const [loader, setLoader] = useState(true);
  const [rowId, setRowId] = useState(null);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [qualificationCategoryId, setQualificationCategoryId] = useState(null);
  const [divisionList, setDivisionList] = useState([]);
  const [fakultitetLost, getFakultitetList] = useState([]);
  const [groupList, getGroupList] = useState([]);
  const [directionList, getDirectionList] = useState([]);
  const [listOfPositionList, setListOfPositionList] = useState([]);
  const [subCalculationKind, setSubCalculationKind] = useState([]);
  const [settlementAccountList, setSettlementAccountList] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
 // const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)
  const docId = props.match.params.id ? props.match.params.id : 0;

  //enrolment modal table
  const [tableData, setTableData] = useState([]);
  //const [enrolmentTableModalVisible, setEnrolmentTableModalVisible] = useState(false);
  //const [backendTableData, setBackendTableData] = useState([]);
  const [disabledActions, setDisabledActions] = useState(false);
  const [tablePagination, setTablePagination] = useState({
    pagination: {
      current: 1,
      pageSize: 50
    }
  });

  const [tableLoading, setTableLoading] = useState(false);
  // table date
  const { size } = useState([]);
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();
  const [mainForm] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      try {
        const OrderOfScholarship = await OrderOfScholarshipServices.getById(docId);
        const divitionLs = await HelperServices.GetDivisionList();
        const listOfPositionLs = await HelperServices.getListOfPositionList();
        const SubCalculationKindList = await HelperServices.getAllSubCalculationKindList();
        const settlementAccountList = await HelperServices.getOrganizationsSettlementAccountList();
        setDivisionList(divitionLs.data);
        setListOfPositionList(listOfPositionLs.data);
        setSubCalculationKind(SubCalculationKindList.data.rows);
        setSettlementAccountList(settlementAccountList.data)
        setTableData(OrderOfScholarship.data.Tables)
        setEmployeeId(OrderOfScholarship.data.EmployeeID)
        setQualificationCategoryId(OrderOfScholarship.data.QualificationCategoryID)
        divisionChangeHandler(OrderOfScholarship.data.DivisionID);
        if (OrderOfScholarship.data.StatusID === 2) {
          setDisabledActions(true);
        }
        setLoader(false);
        form.setFieldsValue({
          ...OrderOfScholarship.data,
          Date: moment(OrderOfScholarship.data.Date, 'DD.MM.YYYY'),
          BeginDate: moment(OrderOfScholarship.data.BeginDate, 'DD.MM.YYYY'),
          EndDate: moment(OrderOfScholarship.data.EndDate, 'DD.MM.YYYY'),
          DivisionID: OrderOfScholarship.data.ID === 0 ? null : OrderOfScholarship.data.DivisionID,
          DepartmentID: OrderOfScholarship.data.ID === 0 ? null : OrderOfScholarship.data.DepartmentID,
          ListOfPositionID: OrderOfScholarship.data.ID === 0 ? null : OrderOfScholarship.data.ListOfPositionID,
          PlanTotal:
            OrderOfScholarship.data.PlanWorkLoad + +OrderOfScholarship.data.PlanTeachingLoad,

          PlanTeaching:
            OrderOfScholarship.data.WorkLoad + +OrderOfScholarship.data.TeachingLoad,
        })



      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [docId, form]);

  //useffect end
  const fetchTableData = (params = {},  ) => {
    setTableLoading(true);
    
    OrderOfScholarshipServices.getTableData(docId)
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data);
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
        Notification('error', err);
        setLoader(false);
        setTableLoading(false);
      });
  };

  
  // //table row fill
  // const fillTableHandler = async (params) => {
  //   form.validateFields()
  //     .then((values) => {
  //       values.EmployeeID = employeeId;
  //       values.QualificationCategoryID = qualificationCategoryId;
  //       values.ID = currentDocId
  //       values.Tables = [...tableData];
  //       const { pagination } = tablePagination;
  //       setTableLoading(true);
  //       OrderOfScholarshipServices.postDataFillTableData(values)
  //         .then(res => {
  //           if (res.status === 200) {
  //             setTableData(res.data);
  //             setCurrentDocId(res.data[0].OwnerID)
  //             setTableLoading(false);
  //             setLoader(false);
  //             setTablePagination({
  //               pagination: {
  //                 ...params.pagination,
  //                 total: res.data.total,
  //               },

  //             });

  //           }
  //         })
  //         .catch(err => {
  //           // console.log(err);
  //           Notification('error', err);
  //           setTableLoading(false);
  //         })
  //     })
  // }

  // const calculationTableHandler = () => {
  //   form.validateFields()
  //     .then((values) => {
  //       values.ID = currentDocId
  //       values.EmployeeID = employeeId;
  //       // values.Date = values.Date.format('DD.MM.YYYY');
  //       values.Tables = [...tableData, ...backendTableData]
  //       // console.log(values.Tables)
  //       //values.Tables = [...tableData];
  //       //  console.log(tableData)
  //       setTableLoading(true);
  //       OrderOfScholarshipServices.postTableData(values)
  //         .then(res => {
  //           setTableData(res.data.Tables)
  //           form.setFieldsValue({ Salary: res.data.Salary });
  //           Notification("success", t("Calculate"));
  //           setTableLoading(false);
  //         })
  //         .catch(err => {
  //           // console.log(err);
  //           Notification('error', err);
  //           setTableLoading(false);
  //         })
  //     })
  // }

  //save All Edit
  const saveAllHandler = () => {
    form.validateFields()
      .then((values) => {
        values.EmployeeID = employeeId;
        values.QualificationCategoryID = qualificationCategoryId;
        values.ID = docId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.BeginDate = values.BeginDate.format('DD.MM.YYYY');
        values.EndDate = values.EndDate.format('DD.MM.YYYY');
        values.Tables = [...tableData];
        console.log(tableData);
      //  values.Tables = [...tableData, ...backendTableData]
        setLoader(true);
        OrderOfScholarshipServices.postData(values)
          .then(res => {
            history.push('/OrderOfScholarship');
            Notification("success", t("saved"));
            setLoader(false);
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setLoader(false);
          })
      })
  }

  //division department
  const divisionChangeHandler = divisionId => {
    // typeID = 2
    HelperServices.getGroupList(divisionId)
      .then(res => {
        getGroupList(res.data);

      })
      .catch(err => Notification('error', err));
    // typeID = 3
    HelperServices.getDirectionList(divisionId)
      .then(res => {
        getDirectionList(res.data);

      })
      .catch(err => Notification('error', err));


    HelperServices.getFakultitetList(divisionId)
      .then(res => {
        getFakultitetList(res.data);

      })
      .catch(err => Notification('error', err))
  }

  const deleteRowsHandler = () => {
    if (selectedRows.length === 0) {
      Notification("warning", t("please select row"));
      return;
    }
    setTableLoading(true);
    const selectedIds = selectedRows.map(item => item.ID);
    OrderOfScholarshipServices.deleteTableRow(selectedIds)
      .then(res => {
        if (res.status === 200) {
          const { pagination } = tablePagination;
          fetchTableData({ pagination });
          //setFilldata(res.data)
          setSelectedRows([]);
          setTableLoading(false);
        }
      })
      .catch(err => Notification('error', err))
      setTableLoading(false);
  }

    //delete row clear
    const clearRowsHandler = () => {
      setTableLoading(true);
      setTableData([]);
      OrderOfScholarshipServices.clearTable(docId)
        .then(res => setLoader(false))
        .catch(err => Notification('error', err))
        setTableLoading(false);
    };
  const getFullName = (name, id) => {
    setEmployeeId(id);
    mainForm.setFieldsValue({ FullName: name, EmployeeID: id });
  };

  const onHousingFinish = () => {
    mainForm.validateFields()
      .then((values) => {
        let newTableData = {
          ID: Math.random(),
          OwnerID: docId,
          OrderNumber: 0,
          RecalcSum: 0,
          Sum: values.Sum,
          Percentage: values.Percentage,
          FullName: values.FullName,
          EmployeeID: values.EmployeeID,
          StateID: 1,
          SubCalculationKindID: values.SubCalculationKindID,
          SubCalculationKindName: values.SubCalculationKindName,
          CreatedUserID: 0,
          ModifiedUserID: 0,
          DateOfCreated: "01.01.0001",
          DateOfModified: "01.01.0001",
          Status: 1
        }
        setTableData((prevState) => [...prevState, newTableData]);
        mainForm.resetFields()
      })
      .catch(err => err);
  };


  //tabledata
  const isEditing = (values) => values.SubCalculationKindID === editingKey;

  const edit = (values) => {
    tableForm.setFieldsValue({
      ...values,
    });

    setEditingKey(values.SubCalculationKindID);
  };

  const onTableValuesChange = () => {
    tableRowChanged = true;
  }

  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.SubCalculationKindID);
      if (index > -1) {
        const item = newData[index];
        if (item.Status === 0) {
          item.Status = 2;
        } else if (item.Status !== 0) {
          item.Status = 1;
        }
        newData.splice(index, 1, { ...item, ...row });
        if (tableRowChanged) {
          tableRowChanged = false;
        }
        setTableData(newData);
        setEditingKey("");

      } else {
        newData.push(row);
        setTableData(newData);
        setEditingKey("");
        setTableLoading(false);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      tableRowChanged = false;
      setTableLoading(false);
    }
  };

  const setRowClassName = (values) => {
    return values.SubCalculationKindID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };
  // Table valuesum
  const Tables = [

    {
      title: t('SubCalculationKindName'),
      dataIndex: 'SubCalculationKindID',
      key: 'SubCalculationKindName',
      render: ((record, otherRecords) => {
        const housingSubCalculationKind = subCalculationKind.find(item => item.ID === record);
        return housingSubCalculationKind ? housingSubCalculationKind.Name : otherRecords.SubCalculationKindName;
      })
    },
    {
      title: t('FullName'),
      dataIndex: 'FullName',
      key: 'EmployeeID',
      // width: '8%',
      //editable: true,
      // render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t('Percentage'),
      dataIndex: 'Percentage',
      key: 'Percentage',
      width: '5%',
      editable: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t('Sum'),
      dataIndex: 'Sum',
      key: 'Sum',
     // className: classes['out-sum'],
      editable: true,
      width: '5%',
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t('RecalcSum'),
      dataIndex: 'RecalcSum',
      key: 'RecalcSum',
      //className: classes['out-sum'],

      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },

    // {
    //   title: t('actions'),
    //   key: 'action',
    //   width: '10%',
    //   align: 'center',
    //   render: (values) => {
    //     return (
    //       <Space size="middle">
    //         {/* <span
    //           onClick={() => {
    //             setEditTableModalVisible(true);
    //             setEdit(record.ID ? record.ID : record.key);
    //           }}
    //           style={{ cursor: 'pointer', color: '#1890ff' }}>
    //           <i
    //             className='feather icon-edit action-icon'
    //             aria-hidden="true" />
    //         </span> */}
    //         <Popconfirm
    //           title={t("delete")}
    //           onClick={() => {
    //             //tableDataDeleteHandler(values.SubCalculationKindID === 0 ? values.SubCalculationKindID : values.SubCalculationKindID);
    //           }}
    //           okText={'yes'}
    //           cancelText={'cancel'}>
    //           <span style={{ color: '#1890ff', cursor: 'pointer' }}>
    //             <i className="feather icon-trash-2 action-icon" />
    //           </span>
    //         </Popconfirm>
    //       </Space>
    //     )
    //   },

    // },
  ];
  //table
  const mergedColumns = Tables.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (values) => ({
        values,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        subCalculationKind: subCalculationKind,
        editing: isEditing(values),
        onEnter: () => save(values.SubCalculationKindID),
      })
    };
  });

  //main
  return (
    <Fade >
      <MainCard title={t("OrderOfScholarship")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            className={classes.FilterForm}
            form={form}
          >
            <Row gutter={[16, 16]}>
              <Col xl={6} lg={8}>
                <div className={classes.InputsWrapper}>
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
                    <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                  </Form.Item>
                </div>
              </Col>
              <Col xl={6} lg={8}>
                <div className={classes.InputsWrapper}>
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
                  <Form.Item
                    label={t("DivisionUni")}
                    name="DivisionID"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("DprName")}
                      style={{ width: '100%' }}
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
                </div>
              </Col>

              <Col xl={6} lg={8}>
                <div className={classes.InputsWrapper}>
                  <Form.Item
                    label={t("FacultyName")}
                    name="FacultyID"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                    <Select
                      placeholder={t("FacultyName")}
                      style={{ width: '100%' }}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {fakultitetLost.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={t("StudyDirectionName")}
                    name="StudyDirectionID"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                    <Select
                      placeholder={t("StudyDirectionName")}
                      style={{ width: '100%' }}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {groupList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xl={6} lg={12}>
                <div className={classes.InputsWrapper}>
                  <Form.Item
                    label={t("StudyGroupName")}
                    name="StudyGroupID"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                    <Select
                      placeholder={t("StudyGroupName")}
                      style={{ width: '100%' }}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {directionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={t("ListOfPositionName")}
                    name="ListOfPositionID"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                    <Select
                      placeholder={t("ListOfPositionID")}
                      style={{ width: '100%' }}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {listOfPositionList.map(item => <Option key={item.ID} value={item.ID} data-tariff={item.TariffScaleID}>{item.Name}</Option>)}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col xl={6} lg={12}>
                <div className={classes.InputsWrapper}>
                  <Form.Item
                    label={t("OrganizationsSettlementAccount")}
                    name="OrganizationsSettlementAccountID"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                    <Select
                      placeholder={t("OrganizationsSettlementAccount")}
                      style={{ width: '100%' }}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {settlementAccountList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={t('AcademicYearStart')}
                    name="AcademicYearStart"
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}>
                    <InputNumber
                      defaultValue={2022}
                      style={{ width: '100%' }}

                    />
                  </Form.Item>
                </div>
              </Col>
              <Col xl={6} lg={12}>
                <div className={classes.InputsWrapper}>
                  <Form.Item
                    label={t('AcademicYearEnd')}
                    name="AcademicYearEnd"
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}
                    >
                    <InputNumber
                     disabled
                      defaultValue={2023}
                      style={{ color: 'black', width: '100%' }}

                    />
                  </Form.Item>
                  <Form.Item
                    label={t('Semester')}
                    name="Semester"
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}>
                    <InputNumber
                      min="0"
                      max="5"
                      style={{ width: '100%' }}
                      decimalSeparator=','
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    />
                  </Form.Item>
                </div>
              </Col>
              <Col xl={12} lg={6}>
                <Form.Item
                  label={t("Comment")}
                  name="Comment"
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}
                >
                  <TextArea rows={1} />
                </Form.Item>
              </Col>
              <Col xl={16} lg={8}>
                <Form
                  {...layout}
                  form={mainForm}
                  component={false}
                >
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
                      label={t("Student")}
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
                      <Form.Item
                    label={t("EmployeeID")}
                    name="EmployeeID"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]}
                  >
                    <Input disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                    <Form.Item
                      label={t("SubCalculationKind")}
                      name="SubCalculationKindID"
                      rules={[
                        {
                          required: true,
                          message: t("Please input valid"),
                        },
                      ]}
                    >
                      <Select
                        allowClear
                        style={{ width: '100%' }}
                        placeholder={t("SubCalculationKind")}
                        showSearch
                        optionFilterProp="children"
                      >
                        {subCalculationKind.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label={t("Summa")}
                      name="Sum"
                      style={{ width: "100%" }}>
                      <InputNumber min={0} max={10000000} defaultValue={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      label={t("Foiz")}
                      name="Percentage"
                      style={{ width: "100%" }}>
                      <InputNumber min={0} max={10000000} defaultValue={0} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item
                      label={t("Table add")}
                      style={{ width: "100%" }}>
                      <Button
                        type="date"
                        onClick={onHousingFinish}
                      >  {t('add-new')} + </Button>
                    </Form.Item>
                  </div>
                </Form>
              </Col>
              <Col xl={24} lg={24} >
                <Form form={tableForm} component={false}
                  onValuesChange={onTableValuesChange}
                >
                  <div className={classes.buttons}>
                  <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("Delete")}</Button>
                    {/* <Button onClick={fillTableHandler} disabled={tableData.length !== 0 || disabledActions} >{t("Tuldirish")}</Button> */}
                    <Button onClick={clearRowsHandler} disabled={disabledActions}>{t("Tozalash")}</Button>
                    {/* <Button onClick={calculationTableHandler} disabled={tableData.length === 0 || disabledActions} >{t("Hisoblash")}</Button> */}
                  </div>
                  <Table
                    columns={mergedColumns}
                    rowClassName={setRowClassName}
                    className="main-table inner-table"
                    dataSource={[...tableData]}
                    showSorterTooltip={false}
                    rowKey={record => record.key ? record.key : record.SubCalculationKindID}
                    pagination={false}
                    bordered
                    loading={tableLoading}
                    rowSelection={{
                      onChange: onSelectChange,
                      selections: [Table.SELECTION_INVERT],
                    }}
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
                            let ignoreClickOnMeElement = document.querySelector('.clicked-row');
                            document.addEventListener('click', function clickHandler(event) {
                              let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                              if (!isClickInsideElement) {
                                save(values.SubCalculationKindID);
                                document.removeEventListener('click', clickHandler);
                              }
                            });
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
               // in={enrolmentTableModalVisible}
                timeout={300}
              >
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
export default EditOrderOfScholarship;

