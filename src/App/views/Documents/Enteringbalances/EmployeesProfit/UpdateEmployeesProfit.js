import React, { useState, useEffect} from "react";
import { Row, Col, Form, Button, DatePicker, Space, Input, Spin, Table, Tabs, InputNumber, Select, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";

import MainCard from "../../../../components/MainCard";
import classes from "./EmployeesProfit.module.css";
import { Notification } from "../../../../../helpers/notifications";
import EmployeeEnrolmentModal from "./EmployeeEnrolmentModal.js";
import EmployeesProfitServices from "../../../../../services/Documents/Enteringbalances/EmployeesProfit/EmployeesProfit.services";
import HelperServices from "../../../../../services/Helper/helper.services";

//import EdittableCell from "./EdittableCell";
import { CSSTransition } from 'react-transition-group';
const { Option } = Select;

const EdittableCell= ({
  editing,
  dataIndex,
  title,
  inputType,
  values,
  map,
  Sum,
  itemOfExpenses,
  organizationSettlement,
  index,
  subCalculationKind,
  children,
  onEnter,
  ...restProps
}) => {

  let inputNode = <Input />;
  if (dataIndex === 'SubCalculationKindID') {
    inputNode = (
      <Select
        style={{ width: 300 }}
        showSearch
        optionFilterProp="children">
        {subCalculationKind.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
      </Select>
    )

  } else if (dataIndex === 'Sum'){
    inputNode = <InputNumber
    onPressEnter={onEnter}
    // onBlur={onEnter}
    style={{ width: 110 }}
    decimalSeparator=','
    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
    className='edit-sum-input'

      />
  } else if(dataIndex === 'Date'){
    inputNode = <Input
     style={{ width: 100 }}
     onPressEnter={onEnter}
    //onBlur={onEnter}
     className='edit-sum-input'
     />
}else if(dataIndex === 'OrganizationsSettlementAccount') {
  inputNode = (
    <Select
      style={{ width: 350 }}
      showSearch
      optionFilterProp="children">
      {organizationSettlement.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}

    </Select>
  )
  }else if(dataIndex === 'ItemOfExpensesName') {
    inputNode = (
      <Select
        style={{ width: 350 }}
        showSearch
        optionFilterProp="children">
        {itemOfExpenses.map(item => <Option key={item.ID} value={item.ID}>{item.OnlyCode}</Option>)}
      </Select>
    )
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
            //     message: `Please Input ${title}!`,
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


const { TabPane } = Tabs;
// let tableRowChanged = false;

//main function
const UpdateEmployeesProfit = (props) => {
  const [loader, setLoader] = useState(true);
  const [rowId, setRowId] = useState(null);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
 // const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [qualificationCategoryId, setQualificationCategoryId] = useState(null);
  const [editingKey, setEditingKey] = useState("");
  const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)
  const docId = props.match.params.id ? props.match.params.id : 0;

  //enrolment modal table

  const [backendTableData, setBackendTableData] = useState([]);
  const [subCalculationKind, setSubCalculationKind] = useState([]);
  const [organizationSettlement, setOrganizationSettlement] = useState([]);
  const [itemOfExpenses, setItemOfExpenses] = useState([]);
  const [disabledActions, setDisabledActions] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableDoc2, setTableData2] = useState([]);
  const [tableDoc3, setTableData3] = useState([]);
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
        const EmployeeEnrolment = await EmployeesProfitServices.getById(docId);
        const minimalSalaryLs = await HelperServices.GetMinimalSalary(EmployeeEnrolment.data.Date);
        const SubCalculationKindList = await HelperServices.getAllSubCalculationKindList();
        const organizationSettlementList = await HelperServices.getOrganizationsSettlementAccountList();
        const ItemOfExpensesList = await HelperServices.GetItemOfExpensesList();
        setTableData2(EmployeeEnrolment.data.Tables2);
        setTableData3(EmployeeEnrolment.data.Tables3);
        setTableData(EmployeeEnrolment.data.Tables);
        setItemOfExpenses(ItemOfExpensesList.data);
        setOrganizationSettlement(organizationSettlementList.data);
        setEmployeeId(EmployeeEnrolment.data.EmployeeID)
        setSubCalculationKind(SubCalculationKindList.data.rows);
        setQualificationCategoryId(EmployeeEnrolment.data.QualificationCategoryID)
        if (EmployeeEnrolment.data.StatusID=== 2) {
          setDisabledActions(true);
        }
        setLoader(false);
        form.setFieldsValue({
          ...EmployeeEnrolment.data,
          Date: moment(EmployeeEnrolment.data.Date, 'DD.MM.YYYY'),
          minimalSalaryls: minimalSalaryLs.data,
        })

      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [docId, form]);
  //useffect end

  //table row delete status = 3
  const tableDataDeleteHandler = (deleteKey) => {
    tableData.forEach(item => {
      if (item.ID === 0 && item.key === deleteKey) {
        item.Status = 3
      } else if (item.ID !== 0 && item.ID === deleteKey) {
        item.Status = 3
      }
    })
    const filteredFrontData =tableData.filter(item => {
      return (item.Status !== 3)
    })
    const filteredBackendData =tableData.filter(item => {
      return (item.Status === 3)
    })
    setBackendTableData([...backendTableData, ...filteredBackendData])
    setTableData(filteredFrontData)
  }

    const tableDoc2DeleteHandler = (deleteKey) => {
      tableDoc2.forEach(item => {
        if (item.ID === 0 && item.key === deleteKey) {
          item.Status = 3
        } else if (item.ID !== 0 && item.ID === deleteKey) {
          item.Status = 3
        }
      })
      const filteredFrontData =tableDoc2.filter(item => {
        return (item.Status !== 3)
      })
      const filteredBackendData =tableDoc2.filter(item => {
        return (item.Status === 3)
      })
      setBackendTableData([...backendTableData, ...filteredBackendData])
      setTableData2(filteredFrontData)
    }


    const tableDoc3DeleteHandler = (deleteKey) => {
      tableDoc3.forEach(item => {
        if (item.ID === 0 && item.key === deleteKey) {
          item.Status = 3
        } else if (item.ID !== 0 && item.ID === deleteKey) {
          item.Status = 3
        }
      })
      const filteredFrontData =tableDoc3.filter(item => {
        return (item.Status !== 3)
      })
      const filteredBackendData =tableDoc3.filter(item => {
        return (item.Status === 3)
      })
      setBackendTableData([...backendTableData, ...filteredBackendData])
      setTableData3(filteredFrontData)
    }


    const fetchTableData = (params = {},filterValues, id) => {
      setTableLoading(true);
      let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder,
      fillId = id ? id : currentDocId


      EmployeesProfitServices.getTableData(fillId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
        .then((res) => {
          if (res.status === 200) {
            setTableData(res.data);
            setTableData2(res.data);
            setTableData3(res.data)
            console.log(res.data)
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
    console.log(values);
    form.validateFields()
   // .then((values) => {
     const filldata = {
      EmployeeID: employeeId,
      ID: currentDocId
     }

   // values.QualificationCategoryID = qualificationCategoryId;

    // values.Tables = [...tableData];
    // values.Tables2 = [...tableDoc2];
    // values.Tables3 = [...tableDoc3];
    //const { pagination } = tablePagination;
    setTableLoading(true);
    try {
       const mainData= await EmployeesProfitServices.postDataFillTableData(filldata)
        if (mainData.status === 200) {
          setCurrentDocId(mainData.data);
          const { pagination } = tablePagination;
          fetchTableData({ pagination }, {}, mainData.data);
        }
      }
      catch(err) {
        Notification('error', err);
        setTableLoading(false);
      }
   // })
  }
  //delete row clear


  //save All Edit
  const saveAllHandler = () => {
    form.validateFields()
    .then((values) => {
    values.EmployeeID = employeeId;
    values.QualificationCategoryID = qualificationCategoryId;
    values.ID =  currentDocId;
    values.Date = values.Date.format('DD.MM.YYYY');
    values.Tables = [...tableData];
    //values.Tables = [...tableData, ...backendTableData]
    values.Tables2 = [...tableDoc2, ...backendTableData]
    values.Tables3 = [...tableDoc3, ...backendTableData]

    setLoader(true);
    EmployeesProfitServices.postData(values)
      .then(res => {
        history.push('/EmployeesProfit');
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

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };
  const onReset = () => {
    form.setFieldsValue({ EmployeeFullName: null });
  };



  const getFullName = (name, id) => {
    setEmployeeId(id);
    form.setFieldsValue({ EmployeeFullName: name, EmployeeID: id });
  };

 const addButtonHandler = () => {
    let newTableData = {
      ID: 0,
      SubCalculationKindName: 0,
      Sum: 0,
      Date: '01.01.1991',
    };
    setTableData((prevState) => [...prevState, newTableData]);
    console.log(newTableData);
  };

  const addButton2Handler = () => {
    let newTableData = {
      ID: 0,
      SubCalculationKindName: "Ранее полученные премии для расчета больничных и отпусков",
      ItemOfExpensesName:0,
      OrganizationsSettlementAccount:0,
      Sum: 0,
      Date: '01.01.1991',
    };
    setTableData2((prevState) => [...prevState, newTableData]);
  };

  const addButton3Handler = () => {
    let newTableData = {
      ID: 0,
      ItemOfExpensesName:0,
      OrganizationsSettlementAccount:0,
      Sum: 0,
      Date: '01.01.1991',
    };
    setTableData3((prevState) => [...prevState, newTableData]);
  };



  //tabledata
  const isEditing = (values) => values.SubCalculationKindID === editingKey;

  const edit = (values) => {
    tableForm.setFieldsValue({
      ...values,
    });
    setEditingKey(values.SubCalculationKindID);
  };

  // const onTableValuesChange = () => {
  //   tableRowChanged = true;
  // }

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
        console.log(newData);
        newData.splice(index, 1, { ...item, ...row });
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
      setTableLoading(false);
    }
  };

  const setRowClassName = (values) => {
    return values.SubCalculationKindID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }



  const isEditing2 = (values) => values.ID === editingKey;

  const edit2 = (values) => {
    tableForm.setFieldsValue({
      ...values,
    });
    setEditingKey(values.ID);
  };
  const save2 = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...tableDoc2];
      console.log(newData);

      const index = newData.findIndex((item) => key === item.ID);

      if (index > -1) {
        const item = newData[index];

        if (item.Status === 0) {
          item.Status = 2;
        } else if (item.Status !== 0) {
          item.Status = 1;
        }
        newData.splice(index, 1, { ...item, ...row });
          setTableData2(newData);
          setEditingKey("");

      } else {
        newData.push(row);
        //setTableData(newData);
        setEditingKey("");
        setTableLoading(false);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      setTableLoading(false);
    }
  };
  const isEditing3 = (values) => values.ID === editingKey;

  const edit3 = (values) => {
    tableForm.setFieldsValue({
      ...values,
    });
    setEditingKey(values.ID);
  };
  const save3 = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...tableDoc3];

      const index = newData.findIndex((item) => key === item.ID);

      if (index > -1) {
        const item = newData[index];

        if (item.Status === 0) {
          item.Status = 2;
        } else if (item.Status !== 0) {
          item.Status = 1;
        }
        newData.splice(index, 1, { ...item, ...row });
          setTableData3(newData);
          setEditingKey("");

      } else {
        newData.push(row);
        //setTableData(newData);
        setEditingKey("");
        setTableLoading(false);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      setTableLoading(false);
    }
  };


 
  // const setRowClassName2 = (values) => {
  //   return values.ID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  // }

  // Table valuesum
  const Tables = [
    {
      title: t('ID'),
      dataIndex: 'ID',
      key: 'ID',
      width: '5%',
    },
    {
      title: t('Date'),
      dataIndex: 'Date',
      key: 'Date',
      width: '10%',
      editable: true,

    },
    {
      title: t('SubCalculationKindID'),
      dataIndex: 'SubCalculationKindID',
      key: 'SubCalculationKindID',
      editable: true,
      render: ((record, otherRecords) => {
        const housingSubCalculationKind = subCalculationKind.find(item => item.ID === record);
        return housingSubCalculationKind ? housingSubCalculationKind.Name : otherRecords.SubCalculationKindName;
      })
    //  render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t('Sum'),
      dataIndex: 'Sum',
      key: 'Sum',
      width: '12%',
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

            <Tooltip  title={t("Delete")}>
              <span onClick={() => {
                tableDataDeleteHandler(values.ID === 0 ? values.ID : values.ID);
              }}style={{ color: '#1890ff', cursor: 'pointer' }}>
                <i className="feather icon-trash-2 action-icon" />
              </span>
            </Tooltip >
          </Space>
        )
      },
    },
  ];
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
  //table
  const Tables2 = [
    {
      title: t('ID'),
      dataIndex: 'ID',
      key: 'ID',
      width: '5%',

    },
    {
      title: t('Date'),
      dataIndex: 'Date',
      key: 'Date',
      width: '5%',
      editable: true,

    },
    {
      title: t('SubCalculationKindName'),
      dataIndex: 'SubCalculationKindName',
      key: 'SubCalculationKindName',
      // editable: true,
      // render: ((record, otherRecords) => {
      //   const housingSubCalculationKind = subCalculationKind.find(item => item.ID === record);
      //   return housingSubCalculationKind ? housingSubCalculationKind.Name : otherRecords.SubCalculationKindName;
      // })
    },
    {
      title: t('ItemOfExpensesName'),
      dataIndex: 'ItemOfExpensesName',
      key: 'ItemOfExpensesName',
      width: '18%',
      editable: true,
      render: ((record, otherRecords) => {
        const housingSubCalculationKind = itemOfExpenses.find(item => item.ID === record);
        return housingSubCalculationKind ? housingSubCalculationKind.OnlyCode : otherRecords.ItemOfExpensesName;
      })
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
      title: t('OrganizationsSettlementAccount'),
      dataIndex: 'OrganizationsSettlementAccountID',
      key: 'OrganizationsSettlementAccountID',
      width: '8%',
      editable: true,
      render: ((record, otherRecords) => {
        const housingSubCalculationKind = organizationSettlement.find(item => item.ID === record);
        return housingSubCalculationKind ? housingSubCalculationKind.Name : otherRecords.OrganizationsSettlementAccountName;
      })
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
            <Tooltip  title={t("Delete")}>
              <span onClick={() => {
                tableDoc2DeleteHandler(values.ID === 0 ? values.ID : values.ID);
              }}style={{ color: '#1890ff', cursor: 'pointer' }}>
                <i className="feather icon-trash-2 action-icon" />
              </span>
            </Tooltip >
          </Space>
        )
      },
    },
  ];
  const mergedColumns2 = Tables2.map((col) => {
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
        organizationSettlement: organizationSettlement,
        itemOfExpenses:itemOfExpenses,
        editing: isEditing2(values),
        onEnter: () => save2(values.ID),
      })
    };
  });

  const Tables3 = [
    {
      title: t('ID'),
      dataIndex: 'ID',
      key: 'ID',
      width: '5%',
    },
    {
      title: t('Date'),
      dataIndex: 'Date',
      key: 'Date',
      width: '5%',
      editable: true,

    },
    // {
    //   title: t('SubCalculationKindName'),
    //   dataIndex: 'SubCalculationKindName',
    //   key: 'SubCalculationKindName',
    //   // editable: true,
    //   // render: ((record, otherRecords) => {
    //   //   const housingSubCalculationKind = subCalculationKind.find(item => item.ID === record);
    //   //   return housingSubCalculationKind ? housingSubCalculationKind.Name : otherRecords.SubCalculationKindName;
    //   // })
    // },
    {
      title: t('ItemOfExpensesName'),
      dataIndex: 'ItemOfExpensesName',
      key: 'ItemOfExpensesName',
      width: '18%',
      editable: true,
      render: ((record, otherRecords) => {
        const housingSubCalculationKind = itemOfExpenses.find(item => item.ID === record);
        return housingSubCalculationKind ? housingSubCalculationKind.OnlyCode : otherRecords.ItemOfExpensesName;
      })
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
      title: t('OrganizationsSettlementAccount'),
      dataIndex: 'OrganizationsSettlementAccountID',
      key: 'OrganizationsSettlementAccountID',
      width: '8%',
      editable: true,
      // render: ((record, otherRecords) => {
      //   const housingSubCalculationKind = organizationSettlement.find(item => item.ID === record);
      //   return housingSubCalculationKind ? housingSubCalculationKind.Name : otherRecords.organizationSettlement;
      // })
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
            <Tooltip  title={t("Delete")}>
              <span onClick={() => {
                tableDoc3DeleteHandler(values.ID === 0 ? values.ID : values.ID);
              }}style={{ color: '#1890ff', cursor: 'pointer' }}>
                <i className="feather icon-trash-2 action-icon" />
              </span>
            </Tooltip >

          </Space>
        )
      },
    },
  ];

  const mergedColumns3 = Tables3.map((col) => {
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
       organizationSettlement: organizationSettlement,
       itemOfExpenses:itemOfExpenses,
       editing: isEditing3(values),
        onEnter: () => save3(values.ID),
      })
    };
  });



  //main
  return (
    <Fade >
      <MainCard title={t("EmployeesProfit")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            onFinish={saveAllHandler}
            onFinishFailed={onFinishFailed}
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

              <Col xl={6} lg={8}>
                <div className={classes.EmployeeEnrolmentModal}>
                <CSSTransition
                mountOnEnter
                unmountOnExit
                in={employeeModalTableVisible}
                timeout={300}
              >
                    <EmployeeEnrolmentModal
                      visible={employeeModalTableVisible}
                      onCancel={() => setEmployeeTableVisible(false)}
                      getFullName={getFullName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("Employee")}
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


              <Col xl={24} lg={24} >
                <Form form={tableForm} component={false}
                // onValuesChange={onTableValuesChange}
                 >


              <Tabs defaultActiveKey="1"  key="1">
                <TabPane tab={t("Tab 1")} key="1">
                <div className={classes.buttons}>
                    <Button  onClick={addButtonHandler} disabled={disabledActions} >  {t('add-new')} + </Button>
                    <Button onClick={fillTableHandler} disabled={tableData.length !== 0 || disabledActions} >{t("Tuldirish")}</Button>
                    {/* <Button onClick={tableDataDeleteHandler} disabled={disabledActions}>{t("Delete")}</Button> */}
                    {/* <Button onClick={clearRowsHandler} disabled={disabledActions}>{t("Tozalash")}</Button>
                    <Button onClick={calculationTableHandler} disabled={tableData.length === 0 || disabledActions} >{t("Hisoblash")}</Button> */}
                  </div>
                <Table
                   columns={mergedColumns}
                    rowClassName={setRowClassName}
                    className="main-table inner-table"
                    dataSource={tableData}
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

                </TabPane>
                <TabPane tab={t("Tab 2")} key="2">
                <div className={classes.buttons}>
                    <Button type="date"  onClick={addButton2Handler} disabled={disabledActions} >  {t('add-new')} + </Button>
                    <Button onClick={fillTableHandler} disabled={tableData.length !== 0 || disabledActions} >{t("Tuldirish")}</Button>
                    {/* <Button onClick={tableDataDeleteHandler} disabled={disabledActions}>{t("Delete")}</Button> */}
                    {/* <Button onClick={clearRowsHandler} disabled={disabledActions}>{t("Tozalash")}</Button>
                    <Button onClick={calculationTableHandler} disabled={tableData.length === 0 || disabledActions} >{t("Hisoblash")}</Button> */}
                  </div>
                <Table
                    columns={mergedColumns2}
                   // rowClassName={setRowClassName2}
                    className="main-table inner-table"
                   // dataSource={tableDoc2}
                    showSorterTooltip={false}
                    rowKey={record => record.key ? record.key : record.ID}
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
                         edit2(values)
                         console.log(values);
                          let ignoreClickOnMeElement = document.querySelector('.clicked-row');
                          document.addEventListener('click', function clickHandler(event) {
                            let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                           if (!isClickInsideElement) {
                             save2(values.ID);
                             document.removeEventListener('click', clickHandler);
                           }
                          });
                         },
                        onClick: () => {
                          setRowId(values.ID);
                        },

                      };
                    }
                    }}
                  />
                </TabPane>
                <TabPane tab={t("Tab 3")} key="3">
                <div className={classes.buttons}>
                    <Button type="date" onClick={addButton3Handler}  disabled={disabledActions} >  {t('add-new')} + </Button>
                    <Button onClick={fillTableHandler} disabled={tableData.length !== 0 || disabledActions} >{t("Tuldirish")}</Button>
                    {/* <Button onClick={tableDataDeleteHandler} disabled={disabledActions}>{t("Delete")}</Button> */}
                    {/* <Button onClick={clearRowsHandler} disabled={disabledActions}>{t("Tozalash")}</Button>
                    <Button onClick={calculationTableHandler} disabled={tableData.length === 0 || disabledActions} >{t("Hisoblash")}</Button> */}
                  </div>
                <Table
                    columns={mergedColumns3}
                  //  rowClassName={setRowClassName2}
                    className="main-table inner-table"
                   // dataSource={tableDoc3}
                    showSorterTooltip={false}
                    rowKey={record => record.key ? record.key : record.ID}
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
                          edit3(values);
                          let ignoreClickOnMeElement = document.querySelector('.clicked-row');
                          document.addEventListener('click', function clickHandler(event) {
                            let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
                            if (!isClickInsideElement) {
                              save3(values.ID);
                              document.removeEventListener('click', clickHandler);
                            }
                          });
                        },
                        onClick: () => {
                          setRowId(values.ID);
                        },

                      };
                    }
                    }}
                  />
                </TabPane>
              </Tabs>
                </Form>
              </Col>
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
export default UpdateEmployeesProfit;
