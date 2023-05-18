
import React, { useState, useEffect} from "react";
import { Row, Col, Form, Button, DatePicker, Input, Spin, Table} from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import MainCard from "../../../../components/MainCard";
import classes from "./ContractOfScholarship.module.css";
import { Notification } from "../../../../../helpers/notifications";
import EmployeeMovementModal from "./EmployeeMovementModal.js";
import ContractOfScholarshipServices from "../../../../../services/Documents/StudentAccounting/ContractOfScholarship/ContractOfScholarship.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import { CSSTransition } from 'react-transition-group';
//import EdittableCell from "./EdittableCell";
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
//const { Option } = Select;
let tableRowChanged = false;

//main function
const EditContractOfScholarship = (props) => {
  const [loader, setLoader] = useState(true);
  const [rowId, setRowId] = useState(null);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
  const [orderOfScholorship, setOrderOfScholorship] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
 // const [qualificationCategoryId, setQualificationCategoryId] = useState(null);
  const [subCalculationKind, setSubCalculationKind] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)
  const docId = props.match.params.id ? props.match.params.id : 0;

  //enrolment modal table
  const [tableData, setTableData] = useState([]);
 // const [enrolmentTableModalVisible, setEnrolmentTableModalVisible] = useState(false);
 
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

  useEffect(() => {
    async function fetchData() {
      try {
        const ContractOfScholarship = await ContractOfScholarshipServices.getById(docId);
        const SubCalculationKindList = await HelperServices.getAllSubCalculationKindList();
       // const departmentLs = await HelperServices.getDepartmentList(ContractOfScholarship.data.DivisionID);
        //setDepartmentList(departmentLs.data);
        setSubCalculationKind(SubCalculationKindList.data.rows);
        setDepartmentList(ContractOfScholarship.data)
        setTableData(ContractOfScholarship.data.Tables)
       // setQualificationCategoryId(ContractOfScholarship.data.QualificationCategoryID)
       // divisionChangeHandler(ContractOfScholarship.data.DivisionID);
        if (ContractOfScholarship.data.StatusID === 2) {
          setDisabledActions(true);
        }
        setLoader(false);
        form.setFieldsValue({
          ...ContractOfScholarship.data,
          Number: ContractOfScholarship.data.OrderNumber,
          Date: moment(ContractOfScholarship.data.Date, 'DD.MM.YYYY'),
          //   keyBeginDate: moment(ContractOfScholarship.data.BeginDate, 'DD.MM.YYYY'),
          EndDate: moment(ContractOfScholarship.data.EndDate, 'DD.MM.YYYY'),
          OrderDate: moment(ContractOfScholarship.data.OrderDate, 'DD.MM.YYYY'),
         //Date: moment(ContractOfScholarship.data.Date, 'DD.MM.YYYY'),
          
        })
      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [docId, form]);

  //useffect end
  const fetchTableData = (params = {}, id) => {
    setTableLoading(true);
    
    ContractOfScholarshipServices.getTableData(id)
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
  const fillTableHandler = async () => {
    form.validateFields()
      //.then((values) => {
        let data = {...departmentList, ...orderOfScholorship };
        data.OrderOfScholarshipID = data.ID
        data.ID = currentDocId
        data.OrderDate = data.Date;
        data.OrderNumber = data.Number;
        //184005
        data.Recalc = 0;
        const { pagination } = tablePagination;
        console.log(pagination)
        setTableLoading(true);
        ContractOfScholarshipServices.postDataFillTableData(data)
  
          .then(res => {
            console.log(res)
            if (res.status === 200) {
              setCurrentDocId(res.data)
              setTableLoading(false);
              setLoader(false);
              fetchTableData({ pagination }, res.data)
            }
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setTableLoading(false);
          })
    // })
  }


  //save All Edit

   //table row fill
   const saveAllHandler = async () => {
    form.validateFields()
      .then((values) => {
        let data = {...departmentList, ...values };
        data.OrderOfScholarshipID = data.ID
        data.ID = currentDocId
        data.OrderDate = data.Date;
        data.OrderNumber = data.Number;
        //184005
       
        data.Tables = [...tableData];
        data.OrderDate = data.Date;
        data.OrderNumber = data.Number;
     
        setTableLoading(true);
        ContractOfScholarshipServices.postData(data)
          .then(res => {
            history.push('/ContractOfScholarship');
             Notification("success", t("saved"));
             setLoader(false);
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setTableLoading(false);
          })
     })
  }

  const deleteRowsHandler = () => {
    console.log(currentDocId)
    if (selectedRows.length === 0) {
      Notification("warning", t("please select row"));
      return;
    }
    setTableLoading(true);
    const selectedIds = selectedRows.map(item => item.ID);
    ContractOfScholarshipServices.deleteTableRow(selectedIds)
      .then(res => { 
        
        if (res.status === 200) {
          setTableLoading(false)
          const { pagination } = tablePagination;
         fetchTableData({ pagination }, currentDocId);
          //setFilldata(res.data)
          setSelectedRows([]);
        }
      })
      .catch(err => Notification('error', err))
      setTableLoading(false);
  }

  const getFullName = ( record, Date) => {
    setOrderOfScholorship(record)
    form.setFieldsValue({ ...record, OrderOfScholarshipID: record.ID,  Date: moment(record.Date, 'DD.MM.YYYY'), EndDate: moment(record.EndDate, 'DD.MM.YYYY')});
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

    // {
    //   title: t('PersonnelNumber'),
    //   dataIndex: 'PersonnelNumber',
    //   key: 'PersonnelNumber',
    //   // render: ((record, otherRecords) => {
    //   //   const housingSubCalculationKind = subCalculationKind.find(item => item.ID === record);
    //   //   return housingSubCalculationKind ? housingSubCalculationKind.Name : otherRecords.SubCalculationKindName;
    //   // })
    // },
    {
      title: t('EmployeeFullName'),
      dataIndex: 'EmployeeFullName',
      key: 'EmployeeID',
      // width: '8%',
      //editable: true,
      // render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t('DateOfCreated'),
      dataIndex: 'DateOfCreated',
      key: 'DateOfCreated',
      width: '5%',
    
    },
    {
      title: t('ID'),
      dataIndex: 'ID',
      key: 'ID',
     // className: classes['out-sum'],
      // editable: true,
      // width: '5%',
      // render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
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
      <MainCard title={t("ContractOfScholarship")}>
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
                    label={t("OrderNumber")}
                    name="Number"
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]}
                  >
                    <Input disabled placeholder={t("OrderNumber")} />
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
                      label={t("OrderOfScholarshipID")}
                      name="OrderOfScholarshipID"
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
              <Col xl={6} lg={8}>
                <div className={classes.InputsWrapper}>
                {/* <Form.Item
                    label={t("OrderNumber")}
                    name="Number"
                    rules={[
                      {
                        required: true,
                        message: t("pleaseSelect"),
                      },
                    ]}
                  >
                    <Input disabled />
                  </Form.Item> */}
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
                    <DatePicker format="DD.MM.YYYY" disabled style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    label={t("OrderDate")}
                    name="OrderDate"
                    rules={[
                      {
                        required: true,
                        message: t("pleaseSelect"),
                      },
                    ]}
                  >
                    <DatePicker format="DD.MM.YYYY" disabled style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    label={t("DivisionUni")}
                    name="DivisionName"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}
                  >
                   <Input disabled />
                  </Form.Item>
                </div>
              </Col>

              <Col xl={6} lg={8}>
                <div className={classes.InputsWrapper}>
                  <Form.Item
                    label={t("FacultyName")}
                    name="FacultyName"
                   
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                   <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label={t("StudyDirectionName")}
                    name="StudyDirectionName"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                      <Input disabled />
                  </Form.Item>
                </div>
              </Col>
              <Col xl={6} lg={12}>
                <div className={classes.InputsWrapper}>
                  <Form.Item
                    label={t("StudyGroupName")}
                    name="StudyGroupName"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                 <Input disabled />
                  </Form.Item>
                  <Form.Item
                    label={t("ListOfPositionName")}
                    name="ListOfPositionName"
                    style={{ width: "50%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                   
                   <Input disabled />
                  </Form.Item>
                </div>
              </Col>
              <Col xl={4} lg={12}>
                <div className={classes.InputsWrapper}>
                  <Form.Item
                    label={t("OrganizationsSettlementAccount")}
                    name="OrganizationsSettlementAccountCode"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData"),
                      },
                    ]}>
                    <Input disabled />
                  </Form.Item>
              
                </div>
              </Col>
             
              <Col xl={14} lg={6}>
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
             
              <Col xl={24} lg={24} >
                <Form form={tableForm} component={false}
                  onValuesChange={onTableValuesChange}
                >
                  <div className={classes.buttons}>

                  <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("Delete")}</Button>
                    <Button onClick={fillTableHandler} disabled={tableData.length !== 0 || disabledActions} >{t("Tuldirish")}</Button>
                    {/* <Button onClick={clearRowsHandler} disabled={disabledActions}>{t("Tozalash")}</Button> */}
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
                      // body: {
                      //   cell: EdittableCell
                      // }
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
                //in={enrolmentTableModalVisible}
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
export default EditContractOfScholarship;


