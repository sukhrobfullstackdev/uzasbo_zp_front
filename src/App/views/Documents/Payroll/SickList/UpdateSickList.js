import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, Table, Space, Tabs, InputNumber, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';
import { CSSTransition } from 'react-transition-group';
// import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { appendArray } from "../../../../../helpers/helpers";

import MainCard from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import CommonServices from "../../../../../services/common/common.services";
import SickListServices from "../../../../../services/Documents/Payroll/SickList/SickList.services";
import EditableCell from "./EditableCell";
import EmployeeModal from "../../../commonComponents/EmployeeModal";
import SickListFromHRModal from "./components/SickListFromHRModal";

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

// const defaultTablePagination = {
//   current: 1,
//   pageSize: 50,
// }

const UpdateSickList = (props) => {
  // only for super admin linked via UserID
  // const superAdminViewRole = JSON.parse(localStorage.getItem('userInfo')).UserID === 41283;
  const AllowForSickList = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('AllowForSickList');

  const [sickList, setSickList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [roundingTypeList, setRoundingTypeList] = useState([]);
  const [orgSettleAccList, setOrgSettleAccList] = useState([]);
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
  const [isChecked, setIsChecked] = useState(false);
  const [loader, setLoader] = useState(true);

  // Table states
  const [calcTableData, setCalcTableData] = useState([]);
  const [awardTableData, setAwardTableData] = useState([]);
  const [calcDetailsTableData, setCalcDetailsTableData] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [filelist, setFileList] = useState([]);
  const [tableId, setTableId] = useState(null);
  // const [selectedRows, setSelectedRows] = useState([]);
  // const [tableFilterValues, setTableFilterValues] = useState({});
  // End Table states
  const [sickListFromHRModal, setSickListFromHRModal] = useState(false);
  const [sickListFromHRParams, setSickListFromHRParams] = useState(null);

  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const [tableForm] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const [sickList, divisionLs, orgSettleAccLs, roundingTypeLs, SubCalculationKindLs, calcTypeLs] = await Promise.all([
        SickListServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.GetDivisionList(),
        HelperServices.getOrganizationsSettlementAccountList(),
        HelperServices.getRoundingTypeListForEnrolment('false'),
        HelperServices.getAllSubCalculationKindList({ IsSickList: true }),
        HelperServices.getLeaveCalcType()
      ]);

      if (props.match.params.id) {
        const departmentLs = await HelperServices.getDepartmentList(sickList.data.DivisionID);
        setDepartmentList(departmentLs.data);
        setSickList(sickList.data);
        setEmployeeId(sickList.data.EmployeeID);
        setDivisionId(sickList.data.DivisionID);
        setDepartmentId(sickList.data.DepartmentID);
        setCalcTypeId(sickList.data.CalcTypeID);
        setAwardTableData(sickList.data.Tables);
        setCalcDetailsTableData(sickList.data.Tables1);
        setCalcTableData(sickList.data.Tables2);
      }
      setDisabledActions(sickList.data.StatusID === 2 ? true : false);
      // setEmployeeDismissal(leavePayment.data);
      setDivisionList(divisionLs.data);
      setOrgSettleAccList(orgSettleAccLs.data);
      setRoundingTypeList(roundingTypeLs.data);
      setSum(sickList.data.Sum);
      // setCalcTableData(leavePayment.data.Tables2);
      // setAwardTableData(leavePayment.data.Tables);
      // setCalcDetailsTableData(leavePayment.data.Tables1);
      setSubCalcKindList(SubCalculationKindLs.data.rows);
      setCalcTypeList(calcTypeLs.data);
      setTableId(sickList.data.TableID);
      setIsChecked(sickList.data.IsChecked);
      setLoader(false);
      mainForm.setFieldsValue({
        ...sickList.data,
        Date: moment(sickList.data.Date, 'DD.MM.YYYY'),
        BeginDate: moment(sickList.data.BeginDate, 'DD.MM.YYYY'),
        EndDate: moment(sickList.data.EndDate, 'DD.MM.YYYY'),
        IssueDate: moment(sickList.data.IssueDate, 'DD.MM.YYYY'),
        CalcTypeID: sickList.data.CalcTypeID === 0 ? null : sickList.data.CalcTypeID,
        Percentage: sickList.data.Percentage === 0 ? null : sickList.data.Percentage,
        RoundingTypeID: sickList.data.RoundingTypeID === 0 ? null : sickList.data.RoundingTypeID,
      })
    }
    fetchData().catch(err => {
      // console.log(err);
      Notification('error', err);
    });
  }, [props.match.params.id, mainForm]);

  const divisionChangeHandler = divisionId => {
    mainForm.setFieldsValue({ EmployeeFullName: null, DepartmentID: null, EnrolmentDocumentID: null });
    setDivisionId(divisionId);
    setEmployeeId(null);
    if (divisionId === undefined) {
      setDepartmentList([]);
      setDivisionId(null)
      setDepartmentId(null)
    } else {
      HelperServices.getDepartmentList(divisionId)
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
      setDepartmentId(id)
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

  // const cancel = () => {
  //   setEditingKey("");
  // };

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
          tableSum += item.SickSum
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
      dataIndex: "OrganizationsSettlementAccountCode",
      width: 120,
      sorter: (a, b) => a.OrganizationsSettlementAccountCode.length - b.OrganizationsSettlementAccountCode.length,
    },
    {
      title: t("Month"),
      dataIndex: "Month",
      width: 80,
      sorter: (a, b) => a.Month.length - b.Month.length,
    },
    {
      title: t("Days"),
      dataIndex: "Days",
      width: 80,
      sorter: (a, b) => a.Days.length - b.Days.length,
    },
    {
      title: t("Salary"),
      dataIndex: "Salary",
      width: 120,
      sorter: (a, b) => a.Salary - b.Salary,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("BonusSum"),
      dataIndex: "BonusSum",
      width: 120,
      sorter: (a, b) => a.BonusSum - b.BonusSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("DailySalary"),
      dataIndex: "DaylySalary",
      width: 120,
      sorter: (a, b) => a.DaylySalary - b.DaylySalary,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("SickDays"),
      dataIndex: "SickDays",
      width: 90,
      sorter: (a, b) => a.SickDays - b.SickDays,
    },
    {
      title: t("SickSum"),
      dataIndex: "SickSum",
      width: 120,
      align: 'right',
      editable: true,
      sorter: (a, b) => a.SickSum - b.SickSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("OrginalSum"),
      dataIndex: "OrginalSum",
      width: 90,
      sorter: (a, b) => a.OrginalSum - b.OrginalSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
  ];

  const awardTableColumns = [
    {
      title: t("ID"),
      dataIndex: "ID",
      width: 80,
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t("OrganizationsSettlementAccount"),
      dataIndex: "OrganizationsSettlementAccountCode",
      width: 150,
      sorter: (a, b) => a.OrganizationsSettlementAccountName.length - b.OrganizationsSettlementAccountName.length,
    },
    {
      title: t("Month"),
      dataIndex: "BonusMonth",
      width: 80,
      sorter: (a, b) => a.BonusMonth.length - b.BonusMonth.length,
    },
    {
      title: t("SubCalculationKindName"),
      dataIndex: "SubCalculationKindName",
      editable: true,
      width: 150,
      sorter: (a, b) => a.SubCalculationKindName.length - b.SubCalculationKindName.length,
    },
    {
      title: t("BonusSum"),
      dataIndex: "BonusSum",
      width: 120,
      sorter: (a, b) => a.BonusSum - b.BonusSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
  ];

  const calcDetailsTableColumns = [
    {
      title: t("OrganizationsSettlementAccount"),
      dataIndex: "OrganizationsSettlementAccountCode",
      width: 120,
      sorter: (a, b) => a.OrganizationsSettlementAccountName.length - b.OrganizationsSettlementAccountName.length,
    },
    {
      title: t("Month"),
      dataIndex: "Month",
      width: 100,
      sorter: (a, b) => a.Month.length - b.Month.length,
    },
    {
      title: t("SubCalculationKindName"),
      dataIndex: "SubCalculationKindName",
      editable: true,
      width: 140,
      sorter: (a, b) => a.SubCalculationKindName.length - b.SubCalculationKindName.length,
    },
    // {
    //   title: t("ItemOfExpensesName"),
    //   dataIndex: "ItemOfExpensesName",
    //   editable: true,
    //   width: 140,
    //   sorter: (a, b) => a.ItemOfExpensesName.length - b.ItemOfExpensesName.length,
    // },
    {
      title: t("InSum"),
      dataIndex: "InSum",
      width: 150,
      sorter: (a, b) => a.OutSum - b.OutSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("OutSum"),
      dataIndex: "OutSum",
      width: 150,
      sorter: (a, b) => a.OutSum - b.OutSum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("Percentage"),
      dataIndex: "Percentage",
      width: 100,
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
        editing: isEditing(record)
      })
    };
  });

  // const onSelectChange = (selectedRowKeys, selectedRows) => {
  //   setSelectedRows(selectedRows);
  // };

  // const deleteRowsHandler = () => {
  //   if (selectedRows.length === 0) {
  //     Notification("warning", t("please select row"));
  //     return;
  //   }
  //   const selectedIds = selectedRows.map(item => item.ID);
  //   // TimeSheetServices.deleteTableRow(selectedIds)
  //   //   .then(res => {
  //   //     if (res.status === 200) {
  //   //       setTableLoading(false)
  //   //       const { pagination } = tablePagination;
  //   //       fetchTableData({ pagination });
  //   //       setSelectedRows([]);
  //   //     }
  //   //   })
  //   //   .catch(err => console.log(err))
  // };

  // const clearTableHandler = () => {
  //   setLoader(true);
  //   setCalcTableData([]);
  //   // TimeSheetServices.clearTable(docId)
  //   //   .then(res => setLoader(false))
  //   //   .catch(err => console.log(err))
  // }; 

  // const handleTableChange = (pagination, filters, sorter) => {
  //   fetchTableData({
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     pagination,
  //     ...filters,
  //   }, tableFilterValues);
  // };

  // const fetchTableData = (params = {}, filterValues, id) => {
  //   let pageNumber = params.pagination.current,
  //     pageLimit = params.pagination.pageSize,
  //     sortColumn = params.sortField,
  //     orderType = params.sortOrder,
  //     fillId = id ? id : docId

  //   // TimeSheetServices.getTimeSheetTableData(fillId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
  //   //   .then((res) => {
  //   //     if (res.status === 200) {
  //   //       setTableData(res.data.rows);
  //   //       setTableLoading(false);
  //   //       setLoader(false);
  //   //       setTablePagination({
  //   //         pagination: {
  //   //           ...params.pagination,
  //   //           total: res.data.total,
  //   //         },
  //   //       });
  //   //     }
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log(err);
  //   //     setLoader(false);
  //   //     setTableLoading(false);
  //   //   });
  // };

  const fillTableHandler = async (values) => {
    values.ID = +docId;
    values.Date = values.Date.format('DD.MM.YYYY');
    values.BeginDate = values.BeginDate.format('DD.MM.YYYY');
    values.EndDate = values.EndDate.format('DD.MM.YYYY');
    values.IssueDate = values.IssueDate.format('DD.MM.YYYY');
    values.EmployeeID = employeeId;
    setLoader(true);
    try {
      const tablesData = await SickListServices.calculate({ ...sickList, ...values });
      if (tablesData.status === 200) {
        // console.log(tablesData);
        setSum(tablesData.data.Sum)
        setAwardTableData(tablesData.data.Tables);
        setCalcDetailsTableData(tablesData.data.Tables1);
        setCalcTableData(tablesData.data.Tables2);
        setDocId(tablesData.data.ID);
        setLoader(false);
        // setDocId(mainData.data);
        // const { pagination } = tablePagination;
        // fetchTableData({ pagination }, {}, mainData.data);
      }
    } catch (error) {
      setLoader(false);
      Notification('error', error);
      // console.log(error);
    }
  };

  const fillTableHandlerFailed = (errorInfo) => {
    Notification('error', t('PleaseFill'));
    // console.log('Failed:', errorInfo);
  };

  const saveAllHandler = () => {
    mainForm.validateFields()
      .then((values) => {
        setLoader(true);
        values.ID = +docId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.BeginDate = values.BeginDate.format('DD.MM.YYYY');
        values.EndDate = values.EndDate.format('DD.MM.YYYY');
        values.IssueDate = values.IssueDate.format('DD.MM.YYYY');
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

        SickListServices.postData({ ...sickList, ...values, Sum: sum })
          .then(res => {
            if (res.status === 200) {
              Notification("success", t("saved"));
              setLoader(false);
              history.push('/SickList');
            }
          })
          .catch(err => {
            // console.log(err);
            Notification("error", err);
            setLoader(false);
          })
      })
      .catch(err => {
        Notification('error', t('PleaseFill'));
      })
  }

  // const onTableFilterHandler = (filterValues) => {
  //   setTableFilterValues(filterValues);
  //   fetchTableData({ pagination: defaultTablePagination }, filterValues);
  //   // console.log('Success:', filterValues);
  // };

  // const onTableFilterFailedHandler = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };

  // End Table functions

  // Employee modal Functions
  const closeEmployeeModalHandler = () => {
    setEmployeeModalVisible(false);
    setEmployeeModalVisible(false);
  }

  const getModalData = useCallback((name, id, enrolmentDocumentId, PINFL) => {
    setEmployeeId(id);
    // console.log(name, id, enrolmentDocumentId, PINFL);
    mainForm.setFieldsValue({ EmployeeFullName: name, EnrolmentDocumentID: enrolmentDocumentId });
    setAwardTableData([]);
    setCalcDetailsTableData([]);
    setCalcTableData([]);
    setLoader(true);
    SickListServices.InsertSickListFromHR(PINFL)
      .then(res => {
        // setSickList(res.data);
        // console.log(res?.data?.IsChecked, res?.data);
        openSickListFromHRModal(res.data);
        mainForm.setFieldsValue({
          SubCalculationKindID: null,
          Diagnosis: null,
          BeginDate: null,
          EndDate: null,
          IssueDate: null,
          Seria: null,
          Number: null,
          Checked: null,
          IsChecked: null,
        })
        setLoader(false);
      })
      .catch(err => {
        setLoader(false);
        Notification('error', err);
      })
  }, [mainForm]);
  // Employee modal Functions

  const setRowClassName = (record) => {
    return record.ID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
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
    if (e === 1) {
      mainForm.setFieldsValue({
        ByAllSource: true,
        OrganizationsSettlementAccountID: null
      })
    } else {
      mainForm.setFieldsValue({
        ByAllSource: false
      })
    }
    if (e === 3) {
      mainForm.setFieldsValue({
        OnlyBySelectedSource: true
      })
    } else {
      mainForm.setFieldsValue({
        OnlyBySelectedSource: false
      })
    }
    setCalcTypeId(e);
  }

  // File 
  // const uploadProps = {
  //   maxCount: 1,
  //   onRemove: file => {
  //     setFileList(prevState => {
  //       const index = prevState.indexOf(file);
  //       const newFileList = prevState.slice();
  //       newFileList.splice(index, 1);
  //       return newFileList;
  //     });
  //   },
  //   beforeUpload: file => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     setFileList(prevState => ([...prevState, file]));
  //     const isLt2M = file.size / 1024 / 1024 < 1;
  //     if (!isLt2M) {
  //       Notification('error', t('fileSizeAlert'));
  //     }
  //     return false;
  //   },
  //   filelist,
  // };

  // const normFile = (e) => {
  //   // console.log('Upload event:', e);

  //   if (Array.isArray(e)) {
  //     return e;
  //   }

  //   return e && e.fileList;
  // };

  // const deleteFileHandler = () => {
  //   setLoader(true);
  //   CommonServices.deleteFile(docId, tableId, 'sicklist')
  //     .then(res => {
  //       if (res.status === 200) {
  //         Notification('success', t('deleteded'));
  //         setLoader(false);
  //       }
  //     })
  //     .catch(err => {
  //       Notification('error', err);
  //       setLoader(false);
  //     })
  // }

  // const donwloadFileHandler = () => {
  //   setLoader(true);
  //   CommonServices.downloadFile(docId, tableId, 'sicklist')
  //     .then(res => {
  //       if (res.status === 200) {
  //         const url = window.URL.createObjectURL(new Blob([res.data]));
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", "sicklist.pdf");
  //         document.body.appendChild(link);
  //         link.click();
  //         setLoader(false);
  //       }
  //     })
  //     .catch(err => {
  //       setLoader(false);
  //       Notification('error', t('fileNotFound'));
  //     })
  // }
  // End File 

  const openSickListFromHRModal = (params) => {
    setSickListFromHRParams(params);
    setSickListFromHRModal(true);
  }

  const onSelect = useCallback((data) => {
    setSickListFromHRModal(false);
    setIsChecked(data?.IsChecked);
    if (data.Checked === true) {
      Notification('error', t('"Тиббиёт ахборот тизими"дан олинган электрон маълумотда ҳам касаллик ва шикастланганлик бўйича меҳнатга лаёқатсизлик, ҳам ҳомиладорлик ва туғиш бўйича меҳнатга лаёқатсизлик бўйича маълумотлар акс этган. Уларга тўланадиган нафақа фоизи турлича бўлганлиги сабабли дастурда бир ҳужжатнинг ичида ҳисоблаб бўлмайди. Шу сабабли меҳнатга лаёқатсизлик варақасини тақдим этган соғлиқни сақлаш муассасасига мурожаат этинг.'));
    } else {
      mainForm.setFieldsValue({
        SubCalculationKindID: data.SubCalculationKindID,
        Diagnosis: data.Diagnosis,
        BeginDate: moment(data.BeginDate, "DD.MM.YYYY"),
        EndDate: moment(data.EndDate, "DD.MM.YYYY"),
        IssueDate: moment(data.IssueDate, "DD.MM.YYYY"),
        Issue: data.Issue,
        Seria: data.Seria,
        Number: data.Number,
        Checked: data.Checked,
        IsChecked: data.IsChecked,
      })
    }
  }, [mainForm])

  const handleSubCalculationKind = (id) => {
    const thisSubCalc = subCalcKindList.filter(item => item.ID === id)
    if (thisSubCalc[0].SubCalculationKindParentID === 11) {
      mainForm.setFieldsValue({ RoundingTypeID: 5, });
    }
  }
  // console.log(AllowForSickList, isChecked, !(AllowForSickList && !isChecked));
  return (
    <Fade>
      <MainCard title={t('SickList')}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id='mainForm'
            scrollToFirstError
            onFinish={fillTableHandler}
            onFinishFailed={fillTableHandlerFailed}
          >
            <Row gutter={[15, 0]} align="top">
              <Col xl={3} lg={4}>
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
                  <DatePicker
                    placeholder={t("date")}
                    format='DD.MM.YYYY'
                    style={{ width: '100%' }}
                  />
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
                <Form.Item
                  label={t("ByAllSource")}
                  name="ByAllSource"
                  hidden={true}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t("OnlyBySelectedSource")}
                  name="OnlyBySelectedSource"
                  hidden={true}
                >
                  <Input />
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
              <Col xl={4} lg={6}>
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
              <Col xl={7} lg={7}>
                <Space
                  align='start'
                  className='modal-input'
                >
                  <Form.Item
                    label={t('oneEmployee')}
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
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={sickListFromHRModal}
                    timeout={300}
                  >
                    <SickListFromHRModal
                      visible={sickListFromHRModal}
                      params={sickListFromHRParams}
                      onSelect={onSelect}
                      onCancel={() => {
                        setSickListFromHRModal(false);
                        setIsChecked(false);
                      }}
                    />
                  </CSSTransition>
                </Space>
              </Col>
              <Col xl={4} lg={6}>
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
              <Col xl={5} lg={6}>
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
                    disabled={!(AllowForSickList && !isChecked)}
                    placeholder={t("SubCalculationKind")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    onSelect={handleSubCalculationKind}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {subCalcKindList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col xl={4} lg={6}>
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
                            </Col> */}
              <Col xl={4} lg={4}>
                <Form.Item
                  label={t("AddPayedDays")}
                  name="Seniority"
                >
                  <InputNumber
                    min={0}
                    max={300}
                    placeholder={t("AddPayedDays")}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={4}>
                <Form.Item
                  label={t("Percentage")}
                  name="Percentage"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect")
                    },
                  ]}
                >
                  <Select
                    allowClear
                    // showSearch
                    placeholder={t("Percentage")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                  // filterOption={(input, option) =>
                  //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  // }
                  >
                    <Option value={60}>60%</Option>
                    <Option value={75}>75%</Option>
                    <Option value={80}>80%</Option>
                    <Option value={100}>100%</Option>
                  </Select>
                  {/* <InputNumber
                                        min={0}
                                        max={100}
                                        // formatter={value => `${value}%`}
                                        // parser={value => value?.replace('%', '')}
                                        // addonAfter={<i className="feather icon-percent action-icon" />}
                                        placeholder={t("Percentage")}
                                        style={{ width: '100%' }}
                                    /> */}
                </Form.Item>
              </Col>
              <Col xl={3} lg={4}>
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
              <Col xl={4} lg={6}>
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
              {calcTypeId !== 1 &&
                <Col xl={7} lg={7}>
                  <Form.Item
                    label={t("OrganizationsSettlementAccount")}
                    name="OrganizationsSettlementAccountID"
                    rules={[
                      {
                        required: true,
                        message: t("pleaseSelect"),
                      },
                    ]}
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
              <Col xl={3} lg={4}>
                <Form.Item
                  label={t("IssueDate")}
                  name="IssueDate"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker
                    disabled={!(AllowForSickList && !isChecked)}
                    placeholder={t("IssueDate")}
                    format='DD.MM.YYYY'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={4}>
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
                    disabled={!(AllowForSickList && !isChecked)}
                    placeholder={t("BeginDate")}
                    format='DD.MM.YYYY'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={4}>
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
                    disabled={!(AllowForSickList && !isChecked)}
                    placeholder={t("EndDate")}
                    format='DD.MM.YYYY'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={6}>
                <Form.Item
                  label={t("Seria")}
                  name="Seria"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input
                    disabled={!(AllowForSickList && !isChecked)}
                    placeholder={t("Seria")}
                  />
                </Form.Item>
              </Col>
              <Col xl={4} lg={6}>
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
                  <Input
                    disabled={!(AllowForSickList && !isChecked)}
                    placeholder={t("number")}
                  />
                </Form.Item>
              </Col>
              <Col xl={16} lg={16}>
                <Form.Item
                  label={t("Diagnosis")}
                  name="Diagnosis"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input
                    disabled={!(AllowForSickList && !isChecked)}
                    placeholder={t("Diagnosis")}
                  />
                </Form.Item>
              </Col>
              <Col xl={8} lg={8}>
                <Form.Item
                  label={t("Issue")}
                  name="Issue"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <Input disabled placeholder={t("Issue")} />
                </Form.Item>
              </Col>

              <Col xl={24} lg={24}>
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
                  <TextArea placeholder={t("Comment")} rows={1} />
                </Form.Item>
                <Form.Item
                  label={t("Checked")}
                  name="Checked"
                  hidden={true}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label={t("IsChecked")}
                  name="IsChecked"
                  hidden={true}
                >
                  <Input />
                </Form.Item>
              </Col>

              {/* <Col xl={4} lg={6}>
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
                                        {docId !== 0 &&
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
                            </Col> */}

            </Row>
          </Form>
          {/* {superAdminViewRole && ( */}
          <Space size='middle' className='fill-btns-wrapper' style={{ marginTop: '16px' }}>
            <Button
              htmlType="submit"
              form="mainForm"
              disabled={disabledActions}
            // disabled={calcTableData.length !== 0 || disabledActions}
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
          {/* )} */}
          <Tabs defaultActiveKey="1">
            <TabPane tab={t('calculated')} key="1">
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
                showSorterTooltip={false}
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

export default UpdateSickList;
