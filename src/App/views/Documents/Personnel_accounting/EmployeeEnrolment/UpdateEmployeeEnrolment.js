import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Space, Popconfirm, Input, Spin, Table, InputNumber, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { appendArray } from "../../../../../helpers/helpers";
import { UserOutlined, UploadOutlined, DownloadOutlined, SearchOutlined, DeleteOutlined } from "@ant-design/icons";

import MainCard from "../../../../components/MainCard";
import classes from "./EmployeeEnrolment.module.css";
import { Notification } from "../../../../../helpers/notifications";
import EmployeeEnrolmentModal from "./EmployeeEnrolmentModal.js";
import EmployeeEnrQualicationModal from "./EmployeeEnrQualicationModal";
import EmployeeEnrolmentServices from "../../../../../services/Documents/Personnel_accounting/EmployeeEnrolment/EmployeeEnrolment.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import CommonServices from "../../../../../services/common/common.services";
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
  onPressEnter,
  inputRef,
  form,
  ...restProps
}) => {
  // console.log(dataIndex);
  // const inputRef = useRef(null);

  let inputNode;
  if (dataIndex === 'Percentage') {
    inputNode = <InputNumber
      min={0} max={1000}
      onPressEnter={onPressEnter}
      onBlur={onEnter}

      style={{ width: '100%' }}
      decimalSeparator=','
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      className='edit-sum-input'
    // ref={(Input) => {Input && Input.focus() }}
    />;
  } else if (dataIndex === 'Sum' || dataIndex === 'OutSum') {
    inputNode = <InputNumber
      //min={0} max={10000000}
      onPressEnter={onPressEnter}
      onBlur={onEnter}
      style={{ width: '100%' }}
      decimalSeparator=','
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      className='edit-sum-input'
    // ref={(Input) => {Input && Input.focus() }}
    />
  } else if (dataIndex === 'StartPeriod') {
    inputNode = <Input
      style={{ width: "100%" }}
      onPressEnter={onPressEnter}
      onBlur={onEnter}
      className='edit-sum-input'
    />
  } else if (dataIndex === 'EndPeriod') {
    inputNode = <Input
      style={{ width: "100%" }}
      onPressEnter={onPressEnter}
      onBlur={onEnter}
      className='edit-sum-input'
    />
  } else if (dataIndex === 'OrganizationsSettlementAccountID') {
    inputNode = (
      <Select
        showSearch
        style={{ width: "90%" }}
        optionFilterProp="children"
      >
        {settlementAccountList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
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

const { TextArea } = Input;
const { Option } = Select;
let tableRowChanged = false;

const EditEmployeeEnrolment = (props) => {
  const [loader, setLoader] = useState(true);
  const [rowId, setRowId] = useState(null);
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
  const [tariffScaleList, setTariffScaleList] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [showTariffScale, setShowTariffScale] = useState(false);

  const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)
  const docId = props.match.params.id ? props.match.params.id : 0;
  const [tableId, setTableId] = useState(null);

  //enrolment modal table
  const [tableData, setTableData] = useState([]);
  const [enrolmentTableModalVisible, setEnrolmentTableModalVisible] = useState(false);
  const [backendTableData, setBackendTableData] = useState([]);
  const [mainCardData, setMaincardData] = useState([]);
  const [minimalSalary, setMinimalSalary] = useState([]);
  const [disabledActions, setDisabledActions] = useState(false);
  const [filelist, setFileList] = useState([]);
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
  const MultiSourceSubCalculationKind = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('MultiSourceSubCalculationKind');
  const totalReqRecCashRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');

  useEffect(() => {
    async function fetchData() {
      try {

        const EmployeeEnrolment = await EmployeeEnrolmentServices.getById(docId);
        const divitionLs = await HelperServices.GetDivisionList();
        const listOfPositionLs = await HelperServices.getListOfPositionList();
        const enrolmentTypeLs = await HelperServices.GetEnrolmentTypeList();
        const WorkScheduleLs = await HelperServices.GetWorkScheduleList();
        const roundingTypeLs = await HelperServices.GetRoundingTypeList();
        const settlementAccountList = await HelperServices.getOrganizationsSettlementAccountList();
        const minimalSalaryLs = await HelperServices.GetMinimalSalary(EmployeeEnrolment.data.Date);
        const tariffScaleList = await HelperServices.GetTariffScaleTableList(EmployeeEnrolment.data.TariffScaleTypeID);

        setTariffScaleList(tariffScaleList.data);
        setDivisionList(divitionLs.data);
        setListOfPositionList(listOfPositionLs.data);
        setEnrolmentTypeList(enrolmentTypeLs.data);
        setSettlementAccountList(settlementAccountList.data)
        setWorkScheduleList(WorkScheduleLs.data)
        setRoundingTypeList(roundingTypeLs.data);
        setTableData(EmployeeEnrolment.data.Tables)
        setMaincardData(EmployeeEnrolment.data)
        setMinimalSalary(minimalSalaryLs)
        setEmployeeId(EmployeeEnrolment.data.EmployeeID)
        setQualificationCategoryId(EmployeeEnrolment.data.QualificationCategoryID)
        divisionChangeHandler(EmployeeEnrolment.data.DivisionID);
        setShowTariffScale(EmployeeEnrolment.data.TariffScaleID)
        setTableId(EmployeeEnrolment.data.TableID);
        if (EmployeeEnrolment.data.StatusID === 2) {
          setDisabledActions(true);
        }
        setLoader(false);
        form.setFieldsValue({
          ...EmployeeEnrolment.data,
          Date: moment(EmployeeEnrolment.data.Date, 'DD.MM.YYYY'),
          // minimalSalaryls: minimalSalaryLs.data,
          // Number: EmployeeMovement.data.ID === 0 ? null : EmployeeMovement.data.Number,
          DivisionID: EmployeeEnrolment.data.ID === 0 ? null : EmployeeEnrolment.data.DivisionID,
          DepartmentID: EmployeeEnrolment.data.ID === 0 ? null : EmployeeEnrolment.data.DepartmentID,
          // EnrolmentDocumentID: EmployeeEnrolment.data.ID === 0 ? null : EmployeeEnrolment.data.EnrolmentDocumentID,
          ListOfPositionID: EmployeeEnrolment.data.ID === 0 ? null : EmployeeEnrolment.data.ListOfPositionID,
          // EnrolmentTypeID: EmployeeEnrolment.data.ID === 0 ? null : EmployeeEnrolment.data.EnrolmentTypeID,
          //Salary: EmployeeEnrolment.data.ID === 0 ? null : EmployeeEnrolment.data.Salary,
          PlanTotal:
            EmployeeEnrolment.data.PlanWorkLoad + +EmployeeEnrolment.data.PlanTeachingLoad,

          PlanTeaching:
            EmployeeEnrolment.data.WorkLoad + +EmployeeEnrolment.data.TeachingLoad,
          // ListOfPositionID: EmployeeEnrolment.data.ListOfPositionID = 0 ? EmployeeEnrolment.data.ListOfPositionID : null,
          // DivisionID: EmployeeEnrolment.data.DivisionID = 0 ? EmployeeEnrolment.data.DivisionID : null,
          // DepartmentID: EmployeeEnrolment.data.DepartmentID = 0 ? EmployeeEnrolment.data.DepartmentID : null,
          // Salary: EmployeeEnrolment.data.Salary = 0 ? EmployeeEnrolment.data.Salary : null,
        })

        // form.setFieldsValue(EmployeeEnrolment.data.ListOfPositionID = 0 ? EmployeeEnrolment.data.ListOfPositionID: null)

      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [docId, form]);


  //useffect end
  const createTableDataHandler = useCallback((values) => {
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

  //table row fill
  const fillTableHandler = async (params) => {
    form.validateFields()
      .then((values) => {
        values.EmployeeID = employeeId;
        values.QualificationCategoryID = qualificationCategoryId;
        values.ID = currentDocId
        values.Tables = [...tableData];
        const { pagination } = tablePagination;
        console.log(pagination)
        setTableLoading(true);
        EmployeeEnrolmentServices.postDataFillTableData(values)
          .then(res => {
            if (res.status === 200) {
              setTableData(res.data);
              setCurrentDocId(res.data[0].OwnerID)
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
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setTableLoading(false);
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

  const calculationTableHandler = (values) => {
    form.validateFields()
      .then((values) => {
        values.ID = currentDocId
        values.EmployeeID = employeeId;
        values.QualificationCategoryID = qualificationCategoryId;
        values.Tables = [...tableData];
        values.Tables = [...tableData, ...backendTableData]
        setTableLoading(true);
        EmployeeEnrolmentServices.postTableData(values)
          .then(res => {
            setTableData(res.data.Tables)
            setMaincardData(res.data)
            //form.setFieldsValue({ Salary: res.data.Salary });
            Notification("success", t("Calculate"));
            setTableLoading(false);
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setTableLoading(false);
          })
      })
  }

  //save All Edit
  const saveAllHandler = () => {
    form.validateFields()
    
      .then((values) => {
        console.log(values)
        values.EmployeeID = employeeId;
        values.QualificationCategoryID = qualificationCategoryId;
        values.ID = currentDocId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.Tables = [...tableData];
        values.Tables = [...tableData, ...backendTableData]

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
        
        setLoader(true);
        EmployeeEnrolmentServices.postData(formData)
          .then(res => {
            history.push('/EmployeeEnrolment');
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
  const onReset = () => {
    form.setFieldsValue({ QualificationCategoryName: null });
  };

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

  const getFullName = (name, id) => {
    setEmployeeId(id);
    form.setFieldsValue({ FullName: name, EmployeeID: id });
  };

  const getQualificationCategoryName = (name, id) => {
    setQualificationCategoryId(id);
    form.setFieldsValue({ QualificationCategoryName: name });
  };

  //add two input number in teachers
  const setPlanWorkLoad = (e) => {
    let sum = +e.target.value + +form.getFieldValue('PlanTeachingLoad');
    form.setFieldsValue({
      PlanTotal: sum
    })
  }

  const setPlanTeachingLoad = (e) => {
    let sum = +form.getFieldValue('PlanWorkLoad') + +e.target.value;
    form.setFieldsValue({
      PlanTotal: sum
    })
  }

  const setWorkLoad = (e) => {
    let sum = (+form.getFieldValue('PlanTeachingLoad') / +form.getFieldValue('PlanWorkLoad')) * +e.target.value;
    form.setFieldsValue({
      TeachingLoad: sum
    })
    let sum1 = +e.target.value + +form.getFieldValue('TeachingLoad');
    form.setFieldsValue({
      PlanTeaching: sum1
    })
  }

  // table data modal
  const getModalData = (values) => {
    let newTableData = {
      ID: 0,
      OwnerID: 0,
      CalculationTypeID: 0,
      OrderNumber: 0,
      IsByAppoint: false,
      Sum: 0,
      Percentage: 0,
      ParentID: 0,
      OutSum: 0,
      StartPeriod: '01.01.1991',
      EndPeriod: null,
      StateID: 1,
      SubCalculationKindParentID: values.SubCalculationKindParentID,
      SubCalculationKindID: values.ID,
      SubCalculationKindName: values.Name,
      OrganizationsSettlementAccountID: 0,
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

  const onTableValuesChange = () => {
    tableRowChanged = true;
  }

  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...tableData];
      console.log(tableData)
      console.log(newData)
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
    CommonServices.deleteFile(currentDocId, tableId, 'employeeenrolment')
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
    CommonServices.downloadFile(currentDocId, tableId, 'employeeenrolment')
      .then(res => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "empEnrolmentDoc.pdf");
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

  // Table valuesum
  const Tables = [
    {
      title: t('OrganizationsSettlementAccount'),
      dataIndex: 'OrganizationsSettlementAccountID',
      key: 'OrganizationsSettlementAccountID',
      editable: true,
      // render: ((record, otherRecords) => {
      //   const housingSubCalculationKind = subCalculationKind.find(item => item.ID === record);
      //   return housingSubCalculationKind ? housingSubCalculationKind.Name : otherRecords.SubCalculationKind;
      // })
      render: (record, otherRecords) => {
        const housingSubCalculationKind = settlementAccountList.find(item => item.ID === record);
        return housingSubCalculationKind ? housingSubCalculationKind.Code : otherRecords.OrganizationsSettlementAccountID;
        // return settlementAccountList[0].Code

      }
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
      width: '10%',
      editable: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
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
      title: t('OutSum'),
      dataIndex: 'OutSum',
      key: 'OutSum',
      className: classes['out-sum'],
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
    },
    {
      title: t('StartPeriod'),
      dataIndex: 'StartPeriod',
      key: 'StartPeriod',
      editable: true,
      width: '10%',
      render: record => {
        if (typeof record === 'string') {
          return record;
        } else {
          return record.format("DD.MM.YYYY");
        }
      }
    },
    {
      title: t('EndPeriod'),
      dataIndex: 'EndPeriod',
      key: 'EndPeriod',
      editable: true,
      width: '10%',
      render: record => {
        if (typeof record === 'string') {
          return record;
        } else if (record === null) {
          return record;
        } else {
          return record;
        }
      }
    },
    {
      title: t('actions'),
      key: 'action',
      width: '5%',
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

  const roleBasedColumns = Tables.filter(item => {
    if (MultiSourceSubCalculationKind) {
      return item;
    }
    return item.dataIndex !== 'OrganizationsSettlementAccountID';
  });
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
        title: col.title,
        settlementAccountList: settlementAccountList,
        editing: isEditing(values),
        onEnter: () => save(values.SubCalculationKindID),
        onPressEnter: () => save(values.SubCalculationKindID),
      })
    };
  });

  //main
  return (
    <Fade >
      <MainCard title={t("EmployeeEnvorment")} isOption EmployeeEnrolment={mainCardData} minimalSalary={minimalSalary}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            // onFinish={saveAllHandler}
            onFinishFailed={onFinishFailed}
            className={classes.FilterForm}
            form={form}
          >
            <Row gutter={[16, 16]}>
              <Col xl={3} lg={6}>
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

                </div>
              </Col>

              <Col xl={3} lg={6}>
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

              <Col xl={7} lg={8}>
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
              <Col xl={3} lg={8}>
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

              <Col xl={4} lg={8}>
                <Form.Item
                  label={t("division")}
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
                    placeholder={t("division")}
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

              <Col xl={4} lg={8}>
                {/* <div className={classes.InputsWrapper}> */}
                <Form.Item
                  label={t("department")}
                  name="DepartmentID"
                  // style={{ width: "50%" }}
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
              {/*
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("Salary")}
                  name="Salary"
                  // style={{ width: "50%" }}
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <InputNumber
                    disabled
                    placeholder={t("Salary")}
                    style={{ color: 'black', width: '100%' }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    decimalSeparator=','
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
                    placeholder={t("EnrolmentTypeName")}
                    // style={{ width: '100%' }}
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
                    placeholder={t("WorkScheduleName")}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {WorkScheduleList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={5} lg={8}>
                {/* <div className={classes.InputsWrapper}> */}
                <Form.Item
                  label={t("OrganizationsSettlementAccount")}
                  name="OrganizationsSettlementAccountID"
                  // style={{ width: "50%" }}
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

              <Col xl={3} lg={8}>
                <Form.Item
                  label={t("RoundingTypeID")}
                  name="RoundingTypeID"
                  // style={{ width: "50%" }}
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
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {roundingTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              {showTariffScale !== 3 && (
                <Col xl={5} lg={12}>
                  <div className={classes.EmployeeEnrolmentModal}>
                    {employeeEnrQualicationModal && (
                      <EmployeeEnrQualicationModal
                        visible={employeeEnrQualicationModal}
                        onCancel={() => setEmployeeEnrQualicationModal(false)}
                        getQualificationCategoryName={getQualificationCategoryName}
                      />
                    )}
                    <Form.Item
                      label={t("QualificationCategoryName")}
                      name="QualificationCategoryName"
                      style={{ width: "100%" }}
                      rules={[
                        {
                          // required: true,
                          message: t("Please input valid"),
                        },
                      ]}>
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
              )}

              {showTariffScale === 3 && (
                <Col xl={8} lg={12}>
                  <div className={classes.EmployeeEnrolmentModal}>
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
                      rules={[
                        {
                          required: true,
                          message: t("Please input valid"),
                        },
                      ]}>
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
              )}

              {showTariffScale !== 3 && (
                <Col xl={3} lg={12}>
                  {/* <Form.Item
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
                  </Form.Item> */}
                  {/* {showTariffScale !== 3 && ( */}
                  <Form.Item
                    label={t("Rate")}
                    name="Rate"

                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]} >
                    <InputNumber max={2} min={0} placeholder={t("Rate")} style={{ width: '100%' }} />
                  </Form.Item>

                  {/* )} */}

                </Col>

              )}

              {showTariffScale !== 3 && (
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
                      showSearch
                      allowClear
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }>
                      {tariffScaleList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                    </Select>
                  </Form.Item>
                </Col>)}
              {showTariffScale !== 3 && (
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
                    <InputNumber
                      placeholder={t("CorrectionFactor")}
                      style={{ width: '100%' }}
                      step="0.0000"
                      stringMode
                    />
                  </Form.Item>

                </Col>)}
              {showTariffScale === 3 && (<Col xl={4} lg={12}>

                <Form.Item
                  label={t("PlanWorkLoad")}
                  name="PlanWorkLoad"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}>
                  <Input placeholder={t("PlanWorkLoad")} onChange={setPlanWorkLoad} />
                </Form.Item>
              </Col>)}
              {showTariffScale === 3 && (<Col xl={4} lg={12}>
                <Form.Item
                  label={t("PlanTeachingLoad")}
                  name="PlanTeachingLoad"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}>
                  <Input placeholder={t("PlanTeachingLoad")} onChange={setPlanTeachingLoad} />
                </Form.Item>
              </Col>)}
              {showTariffScale === 3 && (<Col xl={4} lg={12}>
                <Form.Item
                  label={t("PlanTotal")}
                  name="PlanTotal"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}>
                  <Input placeholder={t("PlanTotal")} value={"number2"}
                    disabled style={{ color: 'black' }} />
                </Form.Item>
              </Col>)}
              {showTariffScale === 3 && (<Col xl={4} lg={12}>
                <Form.Item
                  label={t("PlanMonthLoad")}
                  name="PlanMonthLoad"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}>
                  <Input placeholder={t("PlanMonthLoad")} />
                </Form.Item>
              </Col>)}
              {showTariffScale === 3 && (
                <Col xl={4} lg={12}>
                  <Form.Item
                    label={t("CheckNotebookHour")}
                    name="CheckNotebookHour"
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]}>
                    <Input placeholder={t("CheckNotebookHour")} />
                  </Form.Item>
                </Col>)}
              {showTariffScale === 3 && (<Col xl={4} lg={12}>
                <Form.Item
                  label={t("CheckNotebookSmallHour")}
                  name="CheckNotebookSmallHour"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}>
                  <Input placeholder={t("CheckNotebookSmallHour")} />
                </Form.Item>
              </Col>)}
              {showTariffScale === 3 && (<Col xl={4} lg={12}>
                <Form.Item
                  label={t("WorkLoad")}
                  name="WorkLoad"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}>
                  <Input placeholder={t("WorkLoad")} onChange={setWorkLoad} />
                </Form.Item>
              </Col>)}

              {showTariffScale === 3 && (
                <Col xl={4} lg={12}>
                  <Form.Item
                    label={t("TeachingLoad")}
                    name="TeachingLoad"
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]}>
                    <Input placeholder={t("TeachingLoad")}
                    // onChange={setTeachingLoad}
                    />
                  </Form.Item>
                </Col>
              )}
              {showTariffScale === 3 && (
                <Col xl={4} lg={12}>
                  <Form.Item
                    label={t("PlanTeaching")}
                    name="PlanTeaching"
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]}>
                    <Input placeholder={t("PlanTeaching")} disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                </Col>
              )}

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
                <Col xl={18} lg={6}>
                  <Form.Item
                    label={t("Comment")}
                    name="Comment"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t("Please input valid"),
                  //   },
                  // ]}
                  >
                    <TextArea rows={1} />
                  </Form.Item>
                </Col>)}
              {showTariffScale === 3 && (
                <Col xl={12} lg={6}>
                  <Form.Item
                    label={t("Comment")}
                    name="Comment"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t("Please input valid"),
                  //   },
                  // ]}
                  >
                    <TextArea rows={1} />
                  </Form.Item>
                </Col>)}

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
                    {currentDocId !== 0 &&
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

              <Col xl={24} lg={24} >
                <Form form={tableForm} component={false}
                  onValuesChange={onTableValuesChange}
                >
                  <div className={classes.buttons}>
                    <Button
                      type="date"
                      onClick={() => { setEnrolmentTableModalVisible(true); }}
                      disabled={disabledActions}
                    >
                      {t('add-new')} +
                    </Button>
                    {totalReqRecCashRole &&
                      <Button
                        onClick={fillTableHandler} disabled={tableData.length !== 0 || disabledActions}  > {t("Tuldirish")}
                      </Button>
                    }
                    <Button onClick={clearRowsHandler} disabled={disabledActions}>{t("Tozalash")}</Button>
                    <Button onClick={calculationTableHandler} disabled={tableData.length === 0 || disabledActions} >{t("Hisoblash")}</Button>
                  </div>
                  <Table
                    columns={mergedColumns}
                    rowClassName={setRowClassName}
                    className="main-table inner-table"
                    dataSource={[...tableData]}
                    showSorterTooltip={false}
                    rowKey={record => record.key ? record.key : record.SubCalculationKindID}
                    key={record => record.key}
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

              {/*
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
              </CSSTransition> */}
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
export default EditEmployeeEnrolment;
