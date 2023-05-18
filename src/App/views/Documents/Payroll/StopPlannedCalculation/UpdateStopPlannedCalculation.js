
import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, DatePicker, Select,  Input, Spin, Table, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import MainCard from "../../../../components/MainCard";
import classes from "./StopPlannedCalculation.module.css";
import { Notification } from "../../../../../helpers/notifications";
//import EmployeeMovementModal from "./EmployeeMovementModal.js";
//import EmployeeEnrQualicationModal from "./EmployeeEnrQualicationModal";
import StopPlannedCalculationServices from "../../../../../services/Documents/Payroll/StopPlannedCalculation/StopPlannedCalculation.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import TableModal from "./TableModal";
//import CalculationModal from "./CalculationModal"
//import EdittableCell from "./EdittableCell";
//const { Option } = Select;

const EdittableCell= ({
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
  if ( dataIndex === 'Percentage' || dataIndex === 'StartPeriod') {
      inputNode = <InputNumber   min={0} max={1000} onPressEnter={onEnter} onBlur={onEnter} />;
  } else if (dataIndex === 'Sum' || dataIndex === 'OutSum'){
      inputNode = <InputNumber min={0} max={1000000} onPressEnter={onEnter} onBlur={onEnter}  />

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
  // const [EmployeeMovementDate, setEmployeeMovementData] = useState([]);
  // const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  //const [calculationModal, setCalculationModal] = useState(false);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [subCalculationList, setSubCalculationKindList] = useState([]);
  // const [enrolmentTypeList, setEnrolmentTypeList] = useState([]);
  // const [WorkScheduleList, setWorkScheduleList] = useState([]);
  const [settlementAccountList, setSettlementAccountList] = useState([]);
  // const [roundingTypeList, setRoundingTypeList] = useState([]);
 // const [minimalSalaryList, setMinimalSalaryList] = useState([]);
  // const [tariffScaleList, setTariffScaleList] = useState([]);
  const [showTariffScale, setShowTariffScale] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [currentDocId, setCurrentDocId] = useState( props.match.params.id ? props.match.params.id:0)
  //const [selectionType, setSelectionType] = useState('checkbox');
 // const [filldata, setFilldata] = useState([]);
  //Movement modal table
  const [tableData, setTableData] = useState([]);
  const [MovementTableModalVisible, setMovementTableModalVisible] = useState(false);
  // const [backendTableData, setBackendTableData] = useState([]);
  const [disabledActions, setDisabledActions] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const [tablePagination, setTablePagination] = useState({
    pagination: {
      current: 1,
      pageSize: 50
    }
  });

  const [tableLoading, setTableLoading] = useState(false);
  // table date
  //const { size } = useState([]);
  const { TextArea } = Input;
  const { Option } = Select;
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;
  const MultiSourceSubCalculationKind = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('MultiSourceSubCalculationKind');

  useEffect(() => {
    async function fetchData() {
      try {
        const EmployeeMovement = await StopPlannedCalculationServices.getById(docId);
        const divitionLs = await HelperServices.GetDivisionList();
        const subcalculationKindLs = await HelperServices.getAllSubCalculationKindList();
       // const enrolmentTypeLs = await HelperServices.GetEnrolmentTypeList();
      //  const WorkScheduleLs = await HelperServices.GetWorkScheduleList();
        // const roundingTypeLs = await HelperServices.GetRoundingTypeList();
        const settlementAccountList = await HelperServices.getOrganizationsSettlementAccountList();
        const minimalSalaryLs = await HelperServices.GetMinimalSalary(EmployeeMovement.data.Date);
      // setFilldata(EmployeeMovement.data);
        setDivisionList(divitionLs.data);
        setSubCalculationKindList(subcalculationKindLs.data.rows);
     //   setEnrolmentTypeList(enrolmentTypeLs.data);
        setSettlementAccountList(settlementAccountList.data)
      //  setWorkScheduleList(WorkScheduleLs.data)
        // setRoundingTypeList(roundingTypeLs.data);
       // setMinimalSalaryList(minimalSalaryLs.data);
        setTableData(EmployeeMovement.data.Tables)
     //   setEmployeeMovementData(EmployeeMovement.data);
        setEmployeeId(EmployeeMovement.data.EmployeeID)
      //  setQualificationCategoryId(EmployeeMovement.data.QualificationCategoryID)
        divisionChangeHandler(EmployeeMovement.data.DivisionID);
        setShowTariffScale(EmployeeMovement.data._TariffScaleID)
        if (EmployeeMovement.data.StatusID=== 2) {
          setDisabledActions(true);
        }
        setLoader(false);
        form.setFieldsValue({
          ...EmployeeMovement.data,
          Date: moment(EmployeeMovement.data.Date, 'DD.MM.YYYY'),
          minimalSalaryls: minimalSalaryLs.data,
        })
      } catch (err) {
        // console.log(err);
      }
    }
    fetchData();
  }, [docId, form]);
  //useffect end
  const createTableDataHandler = useCallback((values) => {
    setTableData((tableData) => [values, ...tableData])
    setMovementTableModalVisible(false)
   // setEmployeeTableVisible(false)

  }, []);

  //table row delete status = 3
  // const tableDataDeleteHandler = (deleteKey) => {
  //   tableData.forEach(item => {
  //     if (item.EnrolmentDocumentID === 0 && item.key === deleteKey) {
  //       item.Status = 3
  //     } else if (item.EnrolmentDocumentID !== 0 && item.EnrolmentDocumentID === deleteKey) {
  //       item.Status = 3
  //     }
  //   })
  //   const filteredFrontData = tableData.filter(item => {
  //     return (item.Status !== 3)
  //   })
  //   const filteredBackendData = tableData.filter(item => {
  //     return (item.Status === 3)
  //   })
  //   setBackendTableData([...backendTableData, ...filteredBackendData])
  //   setTableData(filteredFrontData)
  // }


    const fetchTableData = (params= {}, filterValues, id) => {
      setTableLoading(true);
      let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder,
      fillId = id ? id : currentDocId
      StopPlannedCalculationServices.getTableData(fillId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
      .then((res) => {
        if (res.status === 200) {
         //(fillId);
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
        console.log(err);
        setLoader(false);
        setTableLoading(false);
      });
  };
  //table row fill
  const fillTableHandler = async (values) => {
    form.validateFields()
    //.then((data) => {
      let data = { ...form.getFieldsValue() };
     // data.EmployeeID = employeeId;
      data.ID = currentDocId;
      data.Date = data.Date.format('DD.MM.YYYY');

    setTableLoading(true);
 try {
   const mainData = await StopPlannedCalculationServices.postDataFillTableData(data)
        if (mainData.status === 200) {
          setCurrentDocId(mainData.data);
          console.log(mainData.data)
          const { pagination } = tablePagination;
          fetchTableData({ pagination }, {}, mainData.data);
        }
    }
      catch(err) {
        // console.log(err);
        Notification('error', err)
        setTableLoading(false);
      }
   // })
  }
  //delete row clear
  const clearRowsHandler = () => {
    setLoader(true);
    setTableData([]);
    StopPlannedCalculationServices.clearTable(docId)
      .then(res => setLoader(false))
      .catch(err => Notification('error', err))
  };

  //delete select row

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

 const deleteRowsHandler = () => {
  if (selectedRows.length === 0) {
    Notification("warning", t("please select row"));
    return;
  }
  setTableLoading(true);
  const selectedIds = selectedRows.map(item => item.ID);
  StopPlannedCalculationServices.deleteTableRow(selectedIds)
    .then(res => {
      if (res.status === 200) {
        setTableLoading(false)
        const { pagination } = tablePagination;
        fetchTableData({ pagination });
       // setFilldata(res.data)
        setSelectedRows([]);
      }
    })
    .catch(err => console.log(err))
  }

  // const calculationTableHandler = (values) => {


  //   StopPlannedCalculationServices.postCalculatePayrollCharges(docId, values.IsByTimeSheet, values.TimeSheetStartDate, values.TimeSheetEndDate)
  //     .then(res => {
  //       const { pagination } = tablePagination;
  //       setTableData(res.data);
  //       fetchTableData({ pagination });
  //      // setCalculationModal(false)
  //      // form.setFieldsValue({ Salary: res.data.Salary });
  //       // console.log(res.data.Salary)
  //       Notification("success", t("Calculate"));
  //       setLoader(false);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       setLoader(false);
  //     })

  // }
  //save All ADD
  const saveAllHandler = () => {
    form.validateFields()
      .then((values) => {
        values.EmployeeID = employeeId;
       // Values.QualificationCategoryID = qualificationCategoryId;
        values.ID = currentDocId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.Tables = [...tableData];
       // values.Tables = [...tableData, ...backendTableData]
        setLoader(true);
        StopPlannedCalculationServices.postData(values)
          .then(res => {
            history.push('/StopPlannedCalculation');
            Notification("success", t("saved"));
            setLoader(false);
          })
          .catch(err => {
            // console.log(err);
            setLoader(false);
          })
      })
      .catch(err => {
        Notification('error', err);
      })
  }
  //division department
  const divisionChangeHandler = divisionId => {
    HelperServices.getDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err =>Notification('error', err))
  }
  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };
  // const onReset = () => {
  //   form.setFieldsValue({ QualificationCategoryName: null });
  // };
  //tariffScale
  // const tariffScaleHandler = (TariffScaleID, data) => {
  //   HelperServices.GetTariffScaleTableList(data['data-tariff'])

  //     .then(res => {
  //       setTariffScaleList(res.data);
  //       console.log(res.data)
  //     })
  //     .catch(err => console.log(err))
  // }
  // const SelectChange = (e, option) => {
  //   setShowTariffScale(option['data-tariff']);
  // }
  //loader
  // if (loader) {
  //   return (
  //     <div className="spin-wrapper">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

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
      ListOfPositionID: values.ListOfPositionID,
      DepartmentName: values.DepartmentName,
      FullName: values.FullName,
      DepartmentID: values.DepartmentID,
      Division: values.Division,
      EnrolmentDocumentID: values.EnrolmentDocumentID,
      EmployeeID: values.ID,
      OrderNumber: values.OrderNumber,
      ModifiedUserID: 0,
      CreatedUserID: 0,
      Salary: 0,
      IsByAppoint: true,
      DisplayName: values.DisplayName,
      EnrolmentType:  values.EnrolmentType,
      INPSCode: values.INPSCode,
      StateID: 1,
      PersonnelNumber:  values.PersonnelNumber,
      PlasticCardNumber: values.PlasticCardNumber,
      SubCalculationKindName: values.Name,
      PlasticCardNumberHumo: values.PlasticCardNumberHumo,
      PositionName: values.PositionName,
      Rate: values.Rate,
      SettleCode: values.SettleCode,
      DateOfReception: values.DateOfReception,
      Status: 1,
      Sum: 0,
      Percentage: 0,
      Days: 0,
      Hours: 0,
      WorkScheduleName: values.WorkScheduleName

    }

    setTableData((prevState) => [...prevState, newTableData]);
  };
  //tabledata
  const isEditing = (values) => values.EnrolmentDocumentID === editingKey;
  // const edit = (values) => {
  //   tableForm.setFieldsValue({
  //     ...values,
  //   });
  //   setEditingKey(values.EnrolmentDocumentID);
  // };
  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.EnrolmentDocumentID);
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
      // console.log("Validate Failed:", errInfo);  
      Notification('error', errInfo);
    }
  };
  // Table valuesum
  const Tables = [
    {
      title: t('ID'),
      dataIndex: 'ID',
      key: 'ID',
    },
      {
      title: t('PersonnelNumber'),
      dataIndex: 'PersonnelNumber',
      key: 'PersonnelNumber',
    },
     {
      title: t('FullName'),
      dataIndex: 'EmployeeFullName',
      key: 'EmployeeFullName',
    },
    {
      title: t('EnrolmentDocumentID'),
      dataIndex: 'EnrolmentDocumentID',
      key: 'EnrolmentDocumentID',
    },

    {
      title: t('PositionName'),
      dataIndex: 'ListOfPositionName',
      key: 'ListOfPositionName',
    },


    {
      title: t('Rate'),
      dataIndex: 'Rate',
      key: 'Rate',
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
        onEnter: () => save(values.EnrolmentDocumentID),
      })
    };
  });

  //main
  return (
    <Fade >
      <MainCard title={t("StopPlanned Calculation")}>
      <Spin spinning={loader} size='large'>
        <Form
          {...layout}
          form={form}
          id="form"
          onFinish={saveAllHandler}
          onFinishFailed={onFinishFailed}
          className={classes.FilterForm}

          // initialValues={{
          //   ...EmployeeMovementDate,
          //   Date: moment(EmployeeMovementDate.Date, 'DD.MM.YYYY'),
          //   EndDate: moment(EmployeeMovementDate.EndDate, 'DD.MM.YYYY'),
          //   minimalSalaryls: minimalSalaryList,
          // }}
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
              </div>
            </Col>


            <Col xl={6} lg={8}>
              <div className={classes.InputsWrapper}>
                <Form.Item
                  label={t("position")}
                  name="SubCalculationKindID"
                  style={{ width: "50%" }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}>
                  <Select
                    placeholder={t("SubCalculationKindID")}
                    style={{ width: '100%' }}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    // onChange={tariffScaleHandler}
                    // onSelect={SelectChange}
                  >
                    {subCalculationList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item
                  label={t("Division")}
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
                    placeholder={t("DivName")}
                    style={{ width: '100%' }}
                    showSearch
                    allowClear
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
                  label={t("department")}
                  name="DepartmentID"
                  style={{ width: "55%" }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}>
                  <Select
                    placeholder={t("department")}
                    style={{ width: '100%' }}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
                {/* <Form.Item

                  label={t("Salary")}
                  name="Salary"
                  // getSalary={getSalary}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t("inputValidData")
                  //   },
                  // ]}
                >
                  <Input placeholder={t("Salary")} disabled
                    style={{ color: 'black' }} />
                </Form.Item> */}
              </div>
            </Col>
            <Col xl={6} lg={12}>
              <div className={classes.InputsWrapper}>
                <Form.Item
                  label={t("OrganizationsSettlementAccount")}
                  name="OrganizationsSettlementAccountID"
                  style={{ width: "90%" }}
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
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {settlementAccountList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                  </Select>
                </Form.Item>
                {/* <Form.Item
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
                    style={{ width: '100%' }}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {roundingTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item> */}
              </div>
            </Col>
            {showTariffScale !== 3 && (
              <Col xl={24} lg={6}>
                <Form.Item
                  label={t("Comment")}
                  name="Comment"
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}>
                  <TextArea rows={3} />
                </Form.Item>
              </Col>)}

            <Col xl={24} lg={24} >
              <Form form={tableForm} component={false} >
                <div className={classes.buttons}>
                  <Button disabled ={disabledActions} style={{ color: 'black' }} onClick={() => {setMovementTableModalVisible(true);}}> {t('add-new')} +  </Button>
                  <Button onClick= {deleteRowsHandler}  disabled={disabledActions}>{t("Delete")}</Button>
                  <Button type="primary" onClick={fillTableHandler} disabled={tableData.length !== 0 || disabledActions} > {t("Tuldirish")}</Button>
                  <Button onClick={clearRowsHandler} disabled={disabledActions}>{t("Tozalash")}</Button>
                  {/* <Button onClick={ ()=> { setCalculationModal(true)} }>{t("Hisoblash")}</Button> */}
                </div>

                <Table
                  columns={mergedColumns}
                  dataSource={[...tableData]}
                  showSorterTooltip={false}
                  rowKey={record => record.key ? record.key : record.ID}
                  pagination={false}
                  bordered
                  loading={tableLoading}
                  rowSelection={{
                    onChange: onSelectChange,
                    selections: [Table.SELECTION_INVERT],
                    //type: selectionType,

                  }}
                  components={{
                    body: {
                      cell: EdittableCell
                    }
                  }}
                  onRow={(values) => {
                    return {
                     // onDoubleClick: () => edit(values),
                    };
                  }}
                />
              </Form>
            </Col>
            {MovementTableModalVisible &&
              <TableModal
              //rowSelection={rowSelection}
                visible={MovementTableModalVisible}
                onCancel={() => setMovementTableModalVisible(false)}
                onCreate={createTableDataHandler}
                //tableData={tableData}
                getModalData={getModalData}
                console={getModalData}
                //getFullName={getFullName}

              />
            }
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
