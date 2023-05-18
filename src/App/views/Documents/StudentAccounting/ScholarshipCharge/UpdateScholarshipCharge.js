import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, DatePicker, Input, Spin, Table, InputNumber, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import MainCard from "../../../../components/MainCard";
import classes from "./ScholarshipCharge.module.css";
import { Notification } from "../../../../../helpers/notifications";
import EmployeeMovementModal from "./EmployeeMovementModal.js";
import ScholarshipChargeServices from "../../../../../services/Documents/StudentAccounting/ScholarshipCharge/ScholarshipCharge.services";
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
const EditScholarshipCharge = (props) => {
  const [loader, setLoader] = useState(true);
  const [rowId, setRowId] = useState(null);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
  // const [employeeId, setEmployeeId] = useState(null);
  // const [qualificationCategoryId, setQualificationCategoryId] = useState(null);

  const [subCalculationKind, setSubCalculationKind] = useState([]);
  const [settlementAccountList, setSettlementAccountList] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
 // const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)
  const docId = props.match.params.id ? props.match.params.id : 0;

  //enrolment modal table

  const [tableData, setTableData] = useState([]);

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
        const ScholarshipCharge = await ScholarshipChargeServices.getById(docId);
        const SubCalculationKindList = await HelperServices.getAllSubCalculationKindList();
        const settlementAccountList = await HelperServices.getOrganizationsSettlementAccountList();
       
        setSubCalculationKind(SubCalculationKindList.data.rows);
        setSettlementAccountList(settlementAccountList.data)
        setTableData(ScholarshipCharge.data.Tables)
        //setEmployeeId(ScholarshipCharge.data.EmployeeID)
        //setQualificationCategoryId(ScholarshipCharge.data.QualificationCategoryID)
       // divisionChangeHandler(ScholarshipCharge.data.DivisionID);
        if (ScholarshipCharge.data.StatusID === 2) {
          setDisabledActions(true);
        }
        setLoader(false);
        form.setFieldsValue({
          ...ScholarshipCharge.data,
          Date: moment(ScholarshipCharge.data.Date, 'DD.MM.YYYY'),
          BeginDate: moment(ScholarshipCharge.data.BeginDate, 'DD.MM.YYYY'),
          EndDate: moment(ScholarshipCharge.data.EndDate, 'DD.MM.YYYY'),
          DivisionID: ScholarshipCharge.data.ID === 0 ? null : ScholarshipCharge.data.DivisionID,
          DepartmentID: ScholarshipCharge.data.ID === 0 ? null : ScholarshipCharge.data.DepartmentID,
          ListOfPositionID: ScholarshipCharge.data.ID === 0 ? null : ScholarshipCharge.data.ListOfPositionID,
          PlanTotal:
            ScholarshipCharge.data.PlanWorkLoad + +ScholarshipCharge.data.PlanTeachingLoad,

          PlanTeaching:
            ScholarshipCharge.data.WorkLoad + +ScholarshipCharge.data.TeachingLoad,
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
    
    ScholarshipChargeServices.getTableData(docId)
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
  // const fillTableHandler = async (params) => {
  //   form.validateFields()
  //     .then((values) => {
  //       values.EmployeeID = employeeId;
  //       values.QualificationCategoryID = qualificationCategoryId;
  //       values.ID = currentDocId
  //       values.Tables = [...tableData];
  //       const { pagination } = tablePagination;
  //       console.log(pagination)
  //       setTableLoading(true);
  //       ScholarshipChargeServices.postDataFillTableData(values)
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
  //       //  console.log(values);
  //       values.ID = currentDocId
  //       values.EmployeeID = employeeId;
  //       // values.Date = values.Date.format('DD.MM.YYYY');
  //      // values.Tables = [...tableData, ...backendTableData]
  //       // console.log(values.Tables)
  //       values.Tables = [...tableData];
  //       //  console.log(tableData)
  //       setTableLoading(true);
  //       ScholarshipChargeServices.postTableData(values)
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
        values.ID = docId;
        values.Date = values.Date.format('DD.MM.YYYY');

       // values.BeginDate = values.BeginDate.format('DD.MM.YYYY');
        //values.EndDate = values.EndDate.format('DD.MM.YYYY');
        values.Tables = [...tableData];
       // values.Tables = [...tableData, ...backendTableData]
        setLoader(true);
        ScholarshipChargeServices.postData(values)
          .then(res => {
            history.push('/ScholarshipCharge');
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

  const deleteRowsHandler = () => {
    if (selectedRows.length === 0) {
      Notification("warning", t("please select row"));
      return;
    }
    setTableLoading(true);
    const selectedIds = selectedRows.map(item => item.ID);
    ScholarshipChargeServices.deleteTableRow(selectedIds)
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

    //delete row clear
    const clearRowsHandler = () => {
      setTableLoading(true);
      setTableData([]);
      ScholarshipChargeServices.clearTable(docId)
        .then(res => setLoader(false))
        .catch(err => Notification('error', err))
        setTableLoading(false);
    };
  const getFullName = (name, id) => {
    //setEmployeeId(id);
    mainForm.setFieldsValue({ FullName: name, EmployeeID: id });
  };

  const onHousingFinish = () => {
    mainForm.validateFields()
      .then((values) => {
        let newTableData = {
          ID: Math.random(),
          OwnerID: props.match.params.id ? props.match.params.id : 0,
          OrderNumber: 0,
          RecalcSum: 0,
          Sum: values.Sum,
          Percentage: values.Percentage,
          FullName: values.FullName,
          EmployeeID: values.EmployeeID,
          StateID: 1,
          CreatedUserID: 0,
          ModifiedUserID: 0,
          DateOfCreated: "01.01.0001",
          DateOfModified: "01.01.0001",
          Status: 1
        }
        console.log(newTableData)
        setTableData((prevState) => [...prevState, newTableData]);
        mainForm.resetFields()
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
    console.log(selectedRows);
  };
  // Table valuesum
  const Tables = [

    // {
    //   title: t('SubCalculationKindName'),
    //   dataIndex: 'SubCalculationKindID',
    //   key: 'SubCalculationKindName',
    //   render: ((record, otherRecords) => {
    //     const housingSubCalculationKind = subCalculationKind.find(item => item.ID === record);
    //     return housingSubCalculationKind ? housingSubCalculationKind.Name : otherRecords.SubCalculationKindName;
    //   })
    // },
    {
      title: t('ID'),
      dataIndex: 'ID',
      key: 'ID',
      // width: '8%',
      //editable: true,
      // render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
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
      width: '25%',
      editable: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t('Sum'),
      dataIndex: 'Sum',
      key: 'Sum',
     // className: classes['out-sum'],
      editable: true,
      width: '25%',
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    // {
    //   title: t('RecalcSum'),
    //   dataIndex: 'RecalcSum',
    //   key: 'RecalcSum',
    //   //className: classes['out-sum'],

    //   render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    // },

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
      <MainCard title={t("ScholarshipCharge")}>
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
                      label={t("SubCalculationKind")}
                      name="SubCalculationKindID"
                      style={{ width: "50%" }}
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
                </div>
              </Col>
              <Col xl={6} lg={6}>
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
              <Col xl={12} lg={8}>
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
                  onValuesChange={onTableValuesChange}> <div className={classes.buttons}>
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
                    rowKey={record => record.key ? record.key : record.ID}
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
export default EditScholarshipCharge;



