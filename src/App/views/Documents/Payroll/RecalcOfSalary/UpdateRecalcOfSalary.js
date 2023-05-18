import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Space, Popconfirm, Input, Spin, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";

import MainCard from "../../../../components/MainCard";
import classes from "./RecalcOfSalary.module.css";
import { Notification } from "../../../../../helpers/notifications";
import RecalcOfSalaryModal from "./RecalcOfSalaryModal.js";
import RecalcOfSalaryServices from "../../../../../services/Documents/Payroll/RecalcOfSalary/RecalcOfSalary.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import TableModal from "./TableModal";
import EdittableCell from "./EdittableCell";
import { CSSTransition } from 'react-transition-group';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;
let tableRowChanged = false;

//main function
const EditRecalcOfSalary = (props) => {
  const [loader, setLoader] = useState(true);
  const [rowId, setRowId] = useState(null);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [settlementAccountList, setSettlementAccountList] = useState([]);
  const [editingKey, setEditingKey] = useState("");

  // const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)
  // const docId = props.match.params.id ? props.match.params.id : 0;
  const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);

  //enrolment modal table
  const [tableData, setTableData] = useState([]);
  const [tableDataSum, setTableDataSum] = useState([]);
  const [enrolmentTableModalVisible, setEnrolmentTableModalVisible] = useState(false);
  const [backendTableData, setBackendTableData] = useState([]);
  const [disabledActions, setDisabledActions] = useState(false);
  // const [tablePagination, setTablePagination] = useState({
  //   pagination: {
  //     current: 1,
  //     pageSize: 50
  //   }
  // });

  const [tableLoading, setTableLoading] = useState(false);
  // table date
  const { size } = useState([]);
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [tableForm] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      try {
        const RecalcOfSalary = await RecalcOfSalaryServices.getById(docId);
        const divitionLs = await HelperServices.GetDivisionList();
        const settlementAccountList = await HelperServices.getOrganizationsSettlementAccountList();
        setDivisionList(divitionLs.data);
        setSettlementAccountList(settlementAccountList.data);
        setTableData(RecalcOfSalary.data.Tables);
        setTableDataSum(RecalcOfSalary.data.Sum);
        setEmployeeId(RecalcOfSalary.data.EmployeeID)
        console.log(RecalcOfSalary.data)
        divisionChangeHandler(RecalcOfSalary.data.DivisionID);
        if (RecalcOfSalary.data.StatusID === 2) {
          setDisabledActions(true);
        }
        setLoader(false);
        form.setFieldsValue({
          ...RecalcOfSalary.data,
          Date: moment(RecalcOfSalary.data.Date, 'DD.MM.YYYY'),
          // Sum: values.Sum
        })

      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [docId, form]);
  //useffect end
  const createTableDataHandler = useCallback((values) => {
    console.log(values)
    values.Tables.forEach(item => { item.Status = 1 })
    setTableData((tableData) => [values, ...tableData])
    setEnrolmentTableModalVisible(false)
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


  //save All Edit
  const saveAllHandler = () => {
    form.validateFields()
      .then((values) => {
        values.EmployeeID = employeeId;
        values.ID = docId;
       // values.Sum = values.Sum;
        // values.Date = values.Date.format('DD.MM.YYYY');
        //values.Tables = [...tableData];
        values.Tables = [...tableData, ...backendTableData]
        setLoader(true);
        RecalcOfSalaryServices.postData(values)
          .then(res => {
            history.push('/RecalcOfSalary');
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
    HelperServices.getDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);

      })
      .catch(err => Notification('error', err))
  }

  
  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };

  const getFullName = (name, id) => {
    console.log(name,id);
    setEmployeeId(id);
    form.setFieldsValue({ EmployeeFullName: name, EmployeeID: id });
  };

  // const getQualificationCategoryName = (name, id) => {
  //   setQualificationCategoryId(id);
  //   form.setFieldsValue({ QualificationCategoryName: name });
  // };



  // table data modal
  const getModalData = (values) => {
    let newTableData = {
      ID: 0,
      OwnerID: 0,
      OrderNumber: 0,
      Sum: 0,
      ParentID: 0,
      StateID: 1,
      // SubCalculationKindParentID: values.SubCalculationKindParentID,
      // SubCalculationKindID: values.ID,
      // SubCalculationKindName: values.Name,
      OrganizationsSettlementAccountID: 0,
      Status: 1
    }
    setTableData((prevState) => [...prevState, newTableData]);
  };
  //tabledata
  const isEditing = (values) => values.SubCalculationKindID === editingKey;

  const edit = (values) => {
    tableForm.setFieldsValue({
      ...values,
      // StartPeriod: values.StartPeriod ? values.StartPeriod.format("DD.MM.YYYY") : moment().format("DD.MM.YYYY"),
      // EndPeriod: values.EndPeriod ? values.EndPeriod.format("DD.MM.YYYY") : moment().format("DD.MM.YYYY"),
    });
    // tableForm.setFieldsValue({
    //   Sum: values.Sum,
    //   Percentage: values.Percentage,
    //   StartPeriod: values.StartPeriod,
    //   EndPeriod: values.EndPeriod,

    // })
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
  // Table valuesum
  const Tables = [
    {
      title: t('id'),
      dataIndex: 'ID',
      key: 'ID',
    },
    {
      title: t('SubCalculationKindName'),
      dataIndex: 'SubCalculationKindName',
      key: 'SubCalculationKindName',
    },
    {
      title: t('Sum'),
      dataIndex: 'Sum',
      key: 'Sum',
      width: '8%',
      editable: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
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
              title={t("delete")}
              onClick={() => {
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
        editing: isEditing(values),
        onEnter: () => save(values.SubCalculationKindID),
      })
    };
  });

  const fillTableHandler = async () => {
    const values = await form.validateFields()
    values.ID = docId;
    values.Date = values.Date.format("DD.MM.YYYY");
    setTableLoading(true);
    try {
      const tableDt = await RecalcOfSalaryServices.fillTableData(values);
      if (tableDt.status === 200) {
        setDocId(tableDt.data);
        // fetchTableData({ pagination: defaultTablePagination }, {}, tableDt.data);
      }
    } catch (err) {
      setTableLoading(false);
      Notification('error', err);
    }
  };

  //main
  return (
    <Fade >
      <MainCard title={t("RecalcOfSalary")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            // onFinish={saveAllHandler}
            onFinishFailed={onFinishFailed}
            className={classes.FilterForm}
            form={form}
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
              {/* </div> */}


              <Col xl={8} lg={8}>
                <div className={classes.RecalcOfSalaryModal}>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={employeeModalTableVisible}
                    timeout={300}
                  >
                    <RecalcOfSalaryModal
                      visible={employeeModalTableVisible}
                      onCancel={() => setEmployeeTableVisible(false)}
                      getFullName={getFullName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t('employee')}
                    name="EmployeeFullName"
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

                  <Form.Item
                    label={t("EmployeeID")}
                    name="EmployeeID"

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
                <div className={classes.InputsWrapper}>
                  <Form.Item
                    label={t("DprName")}
                    name="DivisionID"
                    style={{ width: "100%" }}
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

              <Col xl={4} lg={8}>
                <div className={classes.InputsWrapper}>
                  <Form.Item
                    label={t("department")}
                    name="DepartmentID"
                    style={{ width: "100%" }}
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
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                    </Select>
                  </Form.Item>

                </div>
              </Col>
              <Col xl={5} lg={12}>
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
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {settlementAccountList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                    </Select>
                  </Form.Item>

                </div>
              </Col>

              <Col xl={15} lg={6}>
                <Form.Item
                  label={t("Comment")}
                  name="Comment"
                >
                  <TextArea rows={1} />
                </Form.Item>
              </Col>

              <Col xl={24} lg={24} >
                <Form form={tableForm} component={false}
                  onValuesChange={onTableValuesChange}
                >

                  <div className={classes.buttons}>
                    <Button
                      type="date"
                      onClick={() => { setEnrolmentTableModalVisible(true); }} disabled={disabledActions} >  {t('add-new')} + </Button>
                    <Button onClick={fillTableHandler} disabled={tableData.length !== 0 || disabledActions} >{t("Tuldirish")}</Button>
                    <Button onClick={clearRowsHandler} disabled={disabledActions}>{t("Tozalash")}</Button>
                    <Text
                      mark
                      strong
                      underline
                      className='highlighted-text'
                      type="primary"
                    //  style={{backgroundColor:'#d1d7dc', height:25}}
                    >
                      {t('Sum')}: {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(tableDataSum)}
                    </Text>
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
                    components={{
                      body: {
                        cell: EdittableCell
                      }
                    }}
                    // rowSelection={{
                    //   onChange: onSelectChange,
                    //   selections: [Table.SELECTION_INVERT]
                    // }}
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
                in={enrolmentTableModalVisible}
                timeout={300}
              >
                <TableModal
                  visible={enrolmentTableModalVisible}
                  onCancel={() => setEnrolmentTableModalVisible(false)}
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
                    // onDoubleClick={onFinish}
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
export default EditRecalcOfSalary;
