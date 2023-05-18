
import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Input, Spin, Table, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import MainCard from "../../../../components/MainCard";
import classes from "./PayrollandCharge.module.css";
import { Notification } from "../../../../../helpers/notifications";
import EmployeeEnrQualicationModal from "./EmployeeEnrQualicationModal";
import PayrollandChargeServices from "../../../../../services/Documents/Payroll/PayrollandCharge/PayrollandCharge.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import TableModal from "./TableModal";
import CalculationModal from "./CalculationModal";
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
    inputNode = <InputNumber min={0}
    max={1000}
    onPressEnter={onEnter}
    style={{ width: '100%' }}
      decimalSeparator=','
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
    />;
  } else if (dataIndex === 'Sum' ) {
    inputNode = <InputNumber
     style={{ width: '100%' }}
      onPressEnter={onEnter}       
      decimalSeparator=','
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
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
          // rules={[
          //   {
          //     required: true,
          //     message: `Please Input ${title}!`,
          //   },
          // ]}
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
 // const [EmployeeMovementDate, setEmployeeMovementData] = useState([]);
  const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [calculationModal, setCalculationModal] = useState(false);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [subCalculationList, setSubCalculationKindList] = useState([]);
  const [settlementAccountList, setSettlementAccountList] = useState([]);
  const [roundingTypeList, setRoundingTypeList] = useState([]);
  const [showTariffScale, setShowTariffScale] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)
  // const [selectionType, setSelectionType] = useState('checkbox');
  //const [filldata, setFilldata] = useState([]);
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
        const EmployeeMovement = await PayrollandChargeServices.getById(docId);
        const divitionLs = await HelperServices.GetDivisionList();
        const subcalculationKindLs = await HelperServices.getAllSubCalculationKindList();
        const roundingTypeLs = await HelperServices.GetRoundingTypeList();
        const settlementAccountList = await HelperServices.getOrganizationsSettlementAccountList();
       // setFilldata(EmployeeMovement.data);
        setDivisionList(divitionLs.data);
        setSubCalculationKindList(subcalculationKindLs.data.rows);
        setSettlementAccountList(settlementAccountList.data)
        setRoundingTypeList(roundingTypeLs.data);
        setTableData(EmployeeMovement.data.Tables)
       // setEmployeeMovementData(EmployeeMovement.data);
        setEmployeeId(EmployeeMovement.data.EmployeeID)
        divisionChangeHandler(EmployeeMovement.data.DivisionID);
        setShowTariffScale(EmployeeMovement.data._TariffScaleID);
        if (EmployeeMovement.data.StatusID=== 2) {
          setDisabledActions(true);
        }
        setLoader(false);
        form.setFieldsValue({
          ...EmployeeMovement.data,
          Date: moment(EmployeeMovement.data.Date, 'DD.MM.YYYY'),
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

  const fetchTableData = (params = {},  ) => {
    setTableLoading(true);
    
    PayrollandChargeServices.getTableData(currentDocId )
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
  //table row fill
  const fillTableHandler = async (values) => {
    form.validateFields()
    //.then((data) => {
      let data = { ...form.getFieldsValue() };
      data.EmployeeID = employeeId;
      data.ID = currentDocId;
      data.Date = data.Date.format('DD.MM.YYYY');
    setTableLoading(true);
    try {
    PayrollandChargeServices.postDataFillTableData(values, data)
      .then(res => {
        if (res.status === 200) {
          const { pagination } = tablePagination;
          
          console.log(res.data);
          setTableLoading(false);
          setTableData(res.data);
          setEmployeeEnrQualicationModal(false);
          setCurrentDocId(res.data[0].OwnerID);
          fetchTableData({ pagination });
         // setTableLoading(false);
        }
      })
    }
   // })
      catch(err) {
        // console.log(err);
        Notification('error', err)
        setTableLoading(false);
      }
    
  }

  
  //delete row clear
  const clearRowsHandler = () => {
    setTableLoading(true);
    setTableData([]);
    PayrollandChargeServices.clearTable(docId)
      .then(res => setLoader(false))
      .catch(err => Notification('error', err))
      setTableLoading(false);
  };

  //delete select row

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
    console.log(selectedRows);
  };

  const deleteRowsHandler = () => {
    if (selectedRows.length === 0) {
      Notification("warning", t("please select row"));
      return;
    }
    setTableLoading(true);
    const selectedIds = selectedRows.map(item => item.ID);
    PayrollandChargeServices.deleteTableRow(selectedIds)
      .then(res => {
        if (res.status === 200) {
          setTableLoading(false)
          const { pagination } = tablePagination;
          fetchTableData({ pagination });
          //setFilldata(res.data)
          setSelectedRows([]);
        }
      })
      .catch(err => Notification('error', err))
      setTableLoading(false);
  }

  const calculationTableHandler = (values) => {  
    setTableLoading(true)
    PayrollandChargeServices.postCalculatePayrollCharges(currentDocId, values.IsByTimeSheet, values.TimeSheetStartDate, values.TimeSheetEndDate)
      .then(res => {
        const { pagination } = tablePagination;
        setTableData(res.data);
        fetchTableData({ pagination });
        setCalculationModal(false)
        Notification("success", t("Calculate"));
        setTableLoading(false);
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err)
        setLoader(false);
        setTableLoading(false);
      })
  }
  //save All ADD
  const saveAllHandler = () => {
    form.validateFields()
      .then((values) => {
       // let allData = { ...form.getFieldsValue() };
        values.EmployeeID = employeeId;
        // values.QualificationCategoryID = qualificationCategoryId;
        values.ID = currentDocId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.Tables = [...tableData];
       // values.Tables = [...tableData, ...backendTableData]
        // console.log(tableData)
        setLoader(true);
        PayrollandChargeServices.postData(values)
          .then(res => {
            history.push('/PayrollandCharge');
            Notification("success", t("saved"));
            setLoader(false);
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setLoader(false);
            setTableLoading(false);
          })
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err);
      })
  }
  //division department
  const divisionChangeHandler = divisionId => {
    HelperServices.getDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err => Notification('error', err))
      setTableLoading(false);
  }

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
      EnrolmentType: values.EnrolmentType,
      INPSCode: values.INPSCode,
      StateID: 1,
      PersonnelNumber: values.PersonnelNumber,
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
  const edit = (values) => {
    tableForm.setFieldsValue({
      ...values,
    });
    setEditingKey(values.EnrolmentDocumentID);
  };
  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.EnrolmentDocumentID);
      if (index > -1) {
        const item = newData[index];
        if (item.Status === 0) {
          item.Status = 2;
        } else if (item.Status !== 0) {
          item.Status = 1;
        }
        newData.splice(index, 1, { ...item, ...row });
        setTableData(newData);
        setEditingKey("");
        setTableLoading(false);
        // console.log(item)
        // console.log(item.Status)
        // console.log(newData)
      } else {
        newData.push(row);
        setTableData(newData);
        setEditingKey("");

      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      setTableLoading(false);
    }
  };


  const setRowClassName = (values) => {
    return values.EnrolmentDocumentID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }
  // Table valuesum
  const Tables = [
    {
      title: t('ID'),
      dataIndex: 'ID',
      key: 'ID',
      width: '7%'
    },
    {
      title: t('personnelNumber'),
      dataIndex: 'PersonnelNumber',
      key: 'PersonnelNumber',
      width: '6%'
    },
    {
      title: t('FullName'),
      dataIndex: 'FullName',
      key: 'EmployeeFullName',
      width: '12%'
    },
    {
      title: t('EnrolmentDocumentID'),
      dataIndex: 'EnrolmentDocumentID',
      key: 'EnrolmentDocumentID',
      width: '10%'
    },
    {
      title: t('DepartmentName'),
      dataIndex: 'DepartmentName',
      key: 'DepartmentName',
      width: '10%'
    },
    {
      title: t('PositionName'),
      dataIndex: 'ListOfPositionName',
      key: 'ListOfPositionName',
      width: '10%'
    },

    {
      title: t('Sum'),
      dataIndex: 'Sum',
      key: 'Sum',
      editable: true,
      width: '10%',
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t('Percentage'),
      dataIndex: 'Percentage',
      key: 'Percentage',
      width: '10%',
      editable: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)

    },
    {
      title: t('Days'),
      dataIndex: 'Days',
      key: 'Days',
      editable: true,
      width: '9%'
    },
    {
      title: t('Hours'),
      dataIndex: 'Hours',
      key: 'Hours',
      editable: true,
      width: '9%'
    },
    {
      title: t('Rate'),
      dataIndex: 'Rate',
      key: 'Rate',
      width: '6%'
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
      <MainCard title={t("PayrollandCharge")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={form}
            id="form"
            onFinish={saveAllHandler}
            className={classes.FilterForm}  >
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
                    label={t("SubcName")}
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
                      }>
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
                    ]} >
                    <Select
                      placeholder={t("DivName")}
                      style={{ width: '100%' }}
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={divisionChangeHandler}  >
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
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: t("inputValidData"),
                    //   },
                    // ]}
                    >
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
                  <Form.Item
                    label={t("Salary")}
                    name="Salary"
                  >
                     <InputNumber
                      disabled
                      placeholder={t("Salary")}
                      style={{ color: 'black', width: '100%' }}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                      decimalSeparator=','
                    />
                  </Form.Item>
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
                      style={{ width: '100%' }}
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {roundingTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              {showTariffScale === 8 && (
                <Col xl={4} lg={12}>
                  <Form.Item
                    label={t("ByHour")}
                    name="ByHour"
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]}>
                    <Input placeholder={t("ByHour")} />
                  </Form.Item>
                </Col>)}
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
                    <Button onClick={() => { setMovementTableModalVisible(true); }} disabled={disabledActions}> {t('add-new')} + </Button>
                    <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("Delete")}</Button>
                    <Button type="primary" onClick={() => { setEmployeeEnrQualicationModal(true); }} disabled={tableData.length !== 0 || disabledActions} > {t("Tuldirish")}</Button>
                    <Button onClick={clearRowsHandler}disabled={disabledActions}>{t("Tozalash")}</Button>
                    <Button onClick={() => { setCalculationModal(true) }} disabled={tableData.length === 0 || disabledActions} >{t("Hisoblash")}</Button>
                  </div>

                  <Table
                    columns={mergedColumns}
                    dataSource={[...tableData]}
                   //rowKey={record => record.EnrolmentDocumentID}
                    className="main-table inner-table"
                    rowKey={record => record.key ? record.key : record.EnrolmentDocumentID}
                    rowClassName={setRowClassName}
                    pagination={false}
                    showSorterTooltip={false}
                    bordered
                    loading={tableLoading}
                    rowSelection={{
                      onChange: onSelectChange,
                      selections: [Table.SELECTION_INVERT],
                    }}
                    scroll={{
                      x: '90vh',
                      y: '90vh'
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
                              save(values.EnrolmentDocumentID);
                              document.removeEventListener('click', clickHandler);
                            }
                          });
                        },
                        onClick: () => {
                          setRowId(values.EnrolmentDocumentID);
                        },

                      };
                    }
                    }}
                    // onRow={(values) => {
                    //   return {
                    //     onDoubleClick: () => edit(values),
                    //   };
                    // }}
                  />
                </Form>
              </Col>

              <CSSTransition
                mountOnEnter
                unmountOnExit
                in={employeeEnrQualicationModal}
                timeout={300}
              >
                <EmployeeEnrQualicationModal
                  visible={employeeEnrQualicationModal}
                  onCancel={() => setEmployeeEnrQualicationModal(false)}
                  // getQualificationCategoryName={getQualificationCategoryName}
                  onCreate={fillTableHandler}
                />
              </CSSTransition>

              <CSSTransition
                mountOnEnter
                unmountOnExit
                in={calculationModal}
                timeout={300}
              >
              <CalculationModal
                  visible={calculationModal}
                  onCancel={() => setCalculationModal(false)}
                  onCreate={calculationTableHandler}
                />           

              </CSSTransition>
               <CSSTransition
                mountOnEnter
                unmountOnExit
                in={MovementTableModalVisible}
                timeout={300}
              > 
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
