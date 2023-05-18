import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Input, Switch, Tabs, Table, InputNumber, Spin, Empty, Typography, Card, Popconfirm } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { BankOutlined } from "@ant-design/icons";

import MainCard from "../../../../components/MainCard";
import classes from "./PayrollOfPlasticCardSheet.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import PayrollOfPlasticCardSheetServices from "../../../../../services/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/PayrollOfPlasticCardSheet.services";
import BanksModal from './components/Modals/BanksModal';
import AddTableModal from './components/Modals/AddTableModal';
import months from "../../../../../helpers/months";
import EditableCell from "./EditableCell";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { TabPane } = Tabs;
const { Text } = Typography;
let tableRowChanged = false;

const EditPayrollOfPlasticCardSheet = (props) => {
  const [rowId, setRowId] = useState(null);
  const [roundingType, setRoundingType] = useState(null);
  const [divisionList, setDivisionList] = useState([]);
  const [payrollList, setPayrollList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [subAccList, setSubAccList] = useState([]);
  const [orgSettleAccList, setOrgSettleAccList] = useState([]);
  const [roundingTypeList, setRoundingTypeList] = useState([]);
  const [itemOfExpensesList, setItemOfExpensesList] = useState([]);
  const [banksStateModal, setBanksState] = useState(false);
  const [employeeStateModal, setEmployeeState] = useState(false);
  const [bankId, setBankId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [isFinalCalculation, setIsFinalCalculation] = useState(true);
  const [plasticCardSheet, setPlasticCardSheet] = useState([]);
  const [loader, setLoader] = useState(true);
  const [accShow, setAccShow] = useState(false);
  const [plasticDocsTables, setPlasticDocsTables] = useState([]);
  const [plasticOrgTables, setPlasticOrgTables] = useState([])
  const [tableLoading, setTableLoading] = useState(false);
  const [tablePagination, setTablePagination] = useState({
    pagination: {
      current: 1,
      pageSize: 50
    }
  });
  const [editingKey, setEditingKey] = useState("");
  const [disabledAddBtn, setDisabledAddBtn] = useState(false);
  const [disabledActions, setDisabledActions] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [parentId, setParentId] = useState(false);
  const [cardType, setCardType] = useState([]);
  const [totalPlasticSum, setTotalPlasticSum] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0);
  const docId = props.match.params.id ? props.match.params.id : 0;
  // const RequestReceivingCashTableEditRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('RequestReceivingCashTableEdit');
  const CentralAccountingParentRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('CentralAccountingParent');

  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const { TextArea } = Input;
  const { Option } = Select;
  const [tableForm] = Form.useForm();
  const docTitle = docId === 0 ? t('PayrollOfPlasticCardSheet') : t('PayrollOfPlasticCardSheet');

  const billColumn = [
    {
      title: t("personnelNumber"),
      dataIndex: "PersonnelNumber",
      key: "PersonnelNumber",
      sorter: true,
      align: 'center',
      width: 90
    },
    {
      title: t("employee"),
      dataIndex: "EmployeeFullName",
      key: "EmployeeFullName",
      sorter: true,
      // width: 180,
      align: 'center'
    },
    {
      title: t("DprName"),
      dataIndex: "DepartmentName",
      key: "DepartmentName",
      sorter: true,
      align: 'center',
      width: 160,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("PayrollSum"),
      dataIndex: "PayrollSum",
      key: "PayrollSum",
      sorter: true,
      align: 'right',
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
      width: 150
    },
    {
      title: t("%"),
      dataIndex: "Percentage",
      key: "Percentage",
      sorter: true,
      editable: true,
      align: 'center',
    },
    {
      title: t("Sum"),
      dataIndex: "Sum",
      key: "Sum",
      // width: 150,
      sorter: (a, b) => a.Sum - b.Sum,
      editable: true,
      align: 'right',
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("plasticCardNumber"),
      dataIndex: "PlasticCardNumber",
      key: "PlasticCardNumber",
      sorter: true,
      align: 'center'
    },
    {
      title: t("fullname"),
      dataIndex: "EmployeeName",
      key: "EmployeeName",
      sorter: true,
      // width: 180,
      align: 'center'
    },
    {
      title: t("organization"),
      dataIndex: "Organization",
      key: "Organization",
      sorter: true,
      width: 150,
      align: 'center'
    },
    {
      title: t("id"),
      dataIndex: "EmployeeID",
      key: "EmployeeID",
      sorter: true,
      align: 'center'
    },
  ];

  const payrollCalculation = [
    {
      title: t("id"),
      dataIndex: "id",
      key: "id",
      sorter: true,
      align: 'center'
    },
    {
      title: t("personnelNumber"),
      dataIndex: "PersonnelNumber",
      key: "PersonnelNumber",
      sorter: true,
      align: 'center',
      width: 120
    },
    {
      title: t("Date"),
      dataIndex: "date",
      key: "date",
      sorter: true,
      align: 'center'
    },
    {
      title: t("Division"),
      dataIndex: "Division",
      key: "Division",
      sorter: true,
      align: 'center',
      width: 140
    },
    {
      title: t("SubcName"),
      dataIndex: "SubcName",
      key: "SubcName",
      sorter: true,
      align: 'right',
    },
    {
      title: t("Comment"),
      dataIndex: "Comment",
      key: "Comment",
      sorter: true,
      align: 'center',
    },
  ];

  const orgTable = [
    {
      title: t("OrderNumber"),
      dataIndex: "OrderNumber",
      key: "OrderNumber",
      sorter: true,
      align: 'center',
      width: 180
    },
    {
      title: t("EnrolmentDocumentID"),
      dataIndex: "DocumentID",
      key: "DocumentID",
      sorter: true,
      align: 'center',
      width: 180
    },
    {
      title: t("№"),
      dataIndex: "Number",
      key: "Number",
      sorter: true,
      align: 'center',
      width: 120
    },
    {
      title: t("Date"),
      dataIndex: "date",
      key: "date",
      sorter: true,
      align: 'center'
    },
    {
      title: t("Month"),
      dataIndex: "Month",
      key: "Month",
      sorter: true,
      width: 120
    },
    {
      title: t("Sum"),
      dataIndex: "Sum",
      key: "Sum",
      sorter: true,
      width: 120
    },

    {
      title: t("Division"),
      dataIndex: "DivisionName",
      key: "DivisionName",
      sorter: true,
      align: 'center',
      width: 140
    },
    {
      title: t("Comment"),
      dataIndex: "Comment",
      key: "Comment",
      sorter: true,
      align: 'center',
    },
    {
      title: t("OrganizationINN"),
      dataIndex: "OrganizationINN",
      key: "OrganizationINN",
      sorter: true,
      width: 180
    },
    {
      title: t("OrganizationName"),
      dataIndex: "OrganizationName",
      key: "OrganizationName",
      sorter: true,
      width: 180
    },
    // {
    //     title: t("inn"),
    //     dataIndex: "INN",
    //     key: "INN",
    //     sorter: true,
    //     width: 120
    // },
    {
      title: t("SettleCode"),
      dataIndex: "SettlementAccountCode",
      key: "SettlementAccountCode",
      sorter: true,
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const plasticCardSht = await PayrollOfPlasticCardSheetServices.getById(docId);
        const divisionLs = await HelperServices.GetDivisionList();
        const payrollLs = await HelperServices.GetPayrollList();
        const departmentLs = await HelperServices.getDepartmentList(plasticCardSht.data.DivisionID);
        const subAccLs = await HelperServices.getPayrollSubAccList();
        const orgSettleAccLs = await HelperServices.getOrganizationsSettlementAccountList();
        const roundingTypeLs = await HelperServices.getRoundingTypeList();
        const itemOfExpensesLs = await HelperServices.getItemOfExpensesList();
        const toatalPlasticSum = await PayrollOfPlasticCardSheetServices.CalculateSum(docId);
        const plasticDocsTables = await PayrollOfPlasticCardSheetServices.getPlasticCardTableData(docId, 1, 50);
        setPlasticCardSheet(plasticCardSht.data);
        setDivisionList(divisionLs.data);
        setPayrollList(payrollLs.data);
        setDepartmentList(departmentLs.data);
        setSubAccList(subAccLs.data);
        setOrgSettleAccList(orgSettleAccLs.data);
        setRoundingTypeList(roundingTypeLs.data);
        setItemOfExpensesList(itemOfExpensesLs.data);
        setPlasticDocsTables(plasticDocsTables.data.rows);
        setPlasticOrgTables(plasticCardSht.data);
        setCardType(plasticCardSht.data.PlasticCardType);
        setParentId(plasticCardSht.data.ParentID);
        setAccShow(plasticCardSht.data.AccID);
        setRoundingType(plasticCardSht.data.RoundingTypeID);
        setTotalPlasticSum(toatalPlasticSum.data);
        if (plasticCardSht.data.ParentID === 18 || plasticCardSht.data.ParentID === 19) {
          setDisabledAddBtn(true);
        }
        if (plasticCardSht.data.StatusID === 1 || plasticCardSht.data.StatusID === 3 || plasticCardSht.data.StatusID === 4 || plasticCardSht.data.StatusID === 10) {
          setDisabledActions(false);
        }
        setTablePagination((prevState) => (
          {
            pagination: {
              ...prevState.pagination,
              total: plasticDocsTables.data.total
            }
          }
        ));
        setLoader(false);
        mainForm.setFieldsValue({
          ...plasticCardSht.data,
          Date: moment(plasticCardSht.data.Date, 'DD.MM.YYYY'),
          docYear: moment().year(),
          PlasticCardType: plasticCardSht.data.PlasticCardType.toString(),
          PlasticCardBankCode: plasticCardSht.data.PlasticCardBankCode,
          DocMonth: plasticCardSht.data.DocMonth.toString()
        });
      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [docId, mainForm]);

  const createTableDataHandler = useCallback((values) => {
    setPlasticDocsTables((plasticDocsTables) => [...plasticDocsTables, values])
    setEmployeeState(false)
  }, []);

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const getModalData = async (data) => {
    const empTableData = {
      EmployeeID: data.ID,
      OwnerID: currentDocId,
      PayrollSum: data.Sum,
      PlasticCardType: +mainForm.getFieldValue('PlasticCardType'),
      PlasticCardBankID: bankId
    }

    try {
      await PayrollOfPlasticCardSheetServices.getPlasticTable(empTableData);
      const toatalPlasticSum = await PayrollOfPlasticCardSheetServices.CalculateSum(currentDocId);
      setTotalPlasticSum(toatalPlasticSum.KJKJJKJKJKKIUIIPOI);
      const { pagination } = tablePagination;
      await fetchTableData({ pagination });
      setLoader(false);
    } catch (error) {
      // console.log(error);
      Notification('error', error)
      setLoader(false);
    }
  }

  const isEditing = (record) => record.ID === editingKey;

  const edit = (record) => {
    tableForm.setFieldsValue({
      ...record
    });
    setEditingKey(record.ID);
  };

  const onTableFilterHandler = (filterValues) => {
    const { pagination } = tablePagination;
    fetchTableData({ pagination }, filterValues);
  };

  const onTableFilterFailedHandler = (errorInfo) => {
    // console.log('Failed:', errorInfo);
    Notification('errorInfo', errorInfo);
  };

  const onTableValuesChange = () => {
    tableRowChanged = true;
  }

  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...plasticDocsTables];
      const index = newData.findIndex((item) => key === item.ID);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        if (tableRowChanged) {
          setTableLoading(true);
          const tableRow = await PayrollOfPlasticCardSheetServices.saveTableRow({ ...item, ...row });
          if (tableRow.status === 200) {
            const { pagination } = tablePagination;
            fetchTableData({ pagination }, {});
            tableRowChanged = false;
          }
        }
        setPlasticDocsTables(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setPlasticDocsTables(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      Notification('Validate Failed', errInfo);
      // console.log("Validate Failed:", errInfo);
      // alert(errInfo);
      setEditingKey("");
      setTableLoading(false);
      tableRowChanged = false;
    }
  };

  const divisionChangeHandler = divisionId => {
    HelperServices.getDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);

      })
      .catch(err => Notification('error', err))
  }

  const SelectChange = (e, option) => {
    if (option['data-parent'] === 18 || option['data-parent'] === 19) {
      setDisabledAddBtn(true);
      setParentId(option['data-parent']);
      setParentId(option['data-parent']);
    } else {
      setDisabledAddBtn(false);
      setParentId(option['data-parent']);
      setParentId(option['data-parent']);
    }
  }

  const AccSelectChange = (e, option) => {
    // console.log(option)
    setAccShow(option['data-acc']);
  }

  const SwitchChange = (value) => {
    setIsFinalCalculation(value);
  }

  const mergedColumns = billColumn.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        summax: record.PayrollSum,
        editing: isEditing(record),
        onEnter: () => save(record.ID),
        tableform: tableForm,
        roundingtype: roundingType
      })
    };
  });

  const mergedColumns2 = payrollCalculation.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        onEnter: () => save(record.ID),
      })
    };
  });
  const mergedOrgTable = orgTable.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "number",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        onEnter: () => save(record.ID),
        tableform: tableForm,
      })
    };
  });

  const saveAllHandler = () => {
    setLoader(true);
    mainForm.validateFields()
      .then(values => {
        values.ID = currentDocId;
        values.BankID = bankId ? bankId : plasticCardSheet.BankID;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.tables = [...plasticDocsTables];
        // values.tablesOrg = [...plasticCardSht];
        PayrollOfPlasticCardSheetServices.postData(values)
          .then(res => {
            if (res.status === 200) {
              Notification("success", t("saved"));
              setLoader(false);
              history.push('/PayrollOfPlasticCardSheet');
            }
          })
          .catch(err => {
            // console.log(err);
            Notification('err', err);
            setLoader(false);
          })
      })
      .catch(err => {
        // alert('please fill all inputs');
        Notification('err', err);
        setLoader(false);
      })
  }

  const AddBtn = async () => {
    const values = await mainForm.validateFields();
    try {
      setLoader(true);
      values.BankID = bankId
      values.ID = currentDocId;
      values.Date = values.Date.format("DD.MM.YYYY");
      const dataForTableDocs = await PayrollOfPlasticCardSheetServices.addEmployeeTable(values);
      setCurrentDocId(dataForTableDocs.data);
      setLoader(false);
      setEmployeeState(true);
    } catch (error) {
      // console.log(error);
      Notification('error', error)
      setLoader(false);
    }
  }

  const deleteRowsHandler = () => {
    setTableLoading(true);
    const selectedIds = selectedRows.map(item => item.ID);
    PayrollOfPlasticCardSheetServices.deleteTableRow(selectedIds)
      .then(res => {
        if (res.status === 200) {
          setTableLoading(false)
          const { pagination } = tablePagination;
          fetchTableData({ pagination });
        }
      })
      .catch(err => Notification('error', err))
  };

  const handleTableChange = (pagination, filters, sorter) => {
    fetchTableData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  const onFinish = async (filterFormValues) => {
    filterFormValues.ID = currentDocId;
    filterFormValues.BankID = bankId ? bankId : plasticCardSheet.BankID;
    filterFormValues.EmployeeID = employeeId ? employeeId : plasticCardSheet.EmployeeID;
    filterFormValues.Date = filterFormValues.Date.format("DD.MM.YYYY");
    filterFormValues.TablesOrg = plasticOrgTables.TablesOrg;
    setLoader(true);

    try {
      const mainData = await PayrollOfPlasticCardSheetServices.CreatePayrollOfPlasticCardSheetMainData({ ...plasticCardSheet, ...filterFormValues });
      if (mainData.status === 200) {
        setCurrentDocId(mainData.data);
        const { pagination } = tablePagination;
        fetchTableData({ pagination }, {}, mainData.data);
      }
    } catch (error) {
      setLoader(false);
      // console.log(error);
      Notification('error', error)
    }
  };

  const fetchTableData = (params = {}, filterValues) => {
    setTableLoading(true);
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder

    PayrollOfPlasticCardSheetServices.getPlasticCardTableData(currentDocId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
      .then((res) => {
        if (res.status === 200) {
          setPlasticDocsTables(res.data.rows);
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
        Notification('err', err);
        setLoader(false);
        setTableLoading(false);
      });
  };

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
    Notification('errorInfo', errorInfo);
  };

  const getFullName = (code, id) => {
    setBankId(id);
    mainForm.setFieldsValue({ PlasticCardBankCode: code });
    setEmployeeId(id);
  };

  const setRowClassName = (record) => {
    return record.ID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }

  const roundingChangeHandler = (rounding) => {
    setRoundingType(rounding);
  }

  const onMonthChange = (value, data) => {
    const month = data.children;
    const year = mainForm.getFieldValue('docYear');
    const plasticCardTypeId = +mainForm.getFieldValue('PlasticCardType');
    let subCalcKind = '';
    if (parentId === 18) {
      subCalcKind = 'з/п за 1-половину'
    } else if (parentId === 19) {
      subCalcKind = 'з/п за 2-половину'
    }

    let plasticCardType = '';
    if (plasticCardTypeId === 1) {
      plasticCardType = 'HUMO';
    } else if (plasticCardTypeId === 2) {
      plasticCardType = 'UzCard';
    } else if (plasticCardTypeId === 3) {
      plasticCardType = 'Duet';
    }

    const comment = `${subCalcKind} ${month} ${year ? year : ''}. (${plasticCardType})`;
    mainForm.setFieldsValue({ Comment: comment });
  }

  const onYearChange = (value) => {
    let subCalcKind = '';
    if (parentId === 18) {
      subCalcKind = 'з/п за 1-половину'
    } else if (parentId === 19) {
      subCalcKind = 'з/п за 2-половину'
    }

    const monthId = mainForm.getFieldValue('DocMonth');
    const month = months.find(item => {
      if (item.id === monthId) {
        return item;
      }
      return 0;
    });

    const year = value;

    const plasticCardTypeId = +mainForm.getFieldValue('PlasticCardType');
    let plasticCardType = '';
    if (plasticCardTypeId === 1) {
      plasticCardType = 'HUMO';
    } else if (plasticCardTypeId === 2) {
      plasticCardType = 'UzCard';
    } else if (plasticCardTypeId === 3) {
      plasticCardType = 'Duet';
    }

    const comment = `${subCalcKind} ${t(month.name)} ${year}. (${plasticCardType})`;
    mainForm.setFieldsValue({ Comment: comment });
  }

  const onSubCalcChange = (value, data) => {
    let subCalcKind = '';
    if (data['data-parent'] === 18) {
      subCalcKind = 'з/п за 1-половину'
    } else if (data['data-parent'] === 19) {
      subCalcKind = 'з/п за 2-половину'
    }

    const monthId = mainForm.getFieldValue('DocMonth');
    const month = months.find(item => {
      if (item.id === monthId) {
        return item;
      }
      return 0;
    });

    const year = mainForm.getFieldValue('DocYear');

    const plasticCardTypeId = +mainForm.getFieldValue('PlasticCardType');
    let plasticCardType = '';
    if (plasticCardTypeId === 1) {
      plasticCardType = 'HUMO';
    } else if (plasticCardTypeId === 2) {
      plasticCardType = 'UzCard';
    } else if (plasticCardTypeId === 3) {
      plasticCardType = 'Duet';
    }

    const comment = `${subCalcKind} ${t(month.name)} ${year}. (${plasticCardType})`;
    mainForm.setFieldsValue({ Comment: comment });
  }

  const onPlasticCardChange = (value, data) => {
    let subCalcKind = '';
    if (parentId === 18) {
      subCalcKind = 'з/п за 1-половину'
    } else if (parentId === 19) {
      subCalcKind = 'з/п за 2-половину'
    }

    const monthId = mainForm.getFieldValue('DocMonth');
    const month = months.find(item => {
      if (item.id === monthId) {
        return item;
      }
      return 0;
    });

    const year = mainForm.getFieldValue('DocYear');

    const plasticCardTypeId = +value;
    let plasticCardType = '';
    if (plasticCardTypeId === 1) {
      plasticCardType = 'HUMO';
    } else if (plasticCardTypeId === 2) {
      plasticCardType = 'UzCard';
    } else if (plasticCardTypeId === 3) {
      plasticCardType = 'Duet';
    }

    const comment = `${subCalcKind} ${t(month.name)} ${year}. (${plasticCardType})`;
    mainForm.setFieldsValue({ Comment: comment });
  }
  // End Auto comment writer functions

  const clearTableHandler = () => {
    console.log('clear');
    setLoader(true);
    setPlasticDocsTables([]);
    PayrollOfPlasticCardSheetServices.clearTable(currentDocId)
      .then(res => setLoader(false))
      .catch(err => Notification('error', err))
  };

  const { pagination } = tablePagination;

  let subAccListNode = null;
  let percent = null;
  if (parentId === 18 || parentId === 19) {
    subAccListNode = (
      <Form.Item
        label={t("subAccList")}
        name="SalarySubAccID"
        rules={[
          {
            required: true,
            message: t("inputValidData"),
          },
        ]}
      >
        <Select
          placeholder={t("subAccList")}
          style={{ width: '100%' }}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={AccSelectChange}
        >
          {subAccList.map(item => <Option key={item.ID} value={item.ID} data-acc={item.AccID}>{item.SubAcc}</Option>)}
        </Select>
      </Form.Item>
    );

    percent = (
      <Form.Item label={t("percent")}
        name="PlasticCardPercentage"
        style={{ width: '100%' }}
        rules={[
          {
            required: true,
            message: t("Please input valid"),
          },
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          formatter={value => `${value}%`}
        />
      </Form.Item>
    )
  }

  let itemOfExpense = null;
  if (accShow !== 60 && (parentId === 19 || parentId === 18)) {
    itemOfExpense = (
      <Form.Item
        label={t("ItemOfExpensesID")}
        name="ItemOfExpensesID"
        rules={[
          {
            required: true,
            message: t("inputValidData"),
          },
        ]}
      >
        <Select
          placeholder={t("ItemOfExpensesID")}
          style={{ width: '100%' }}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {itemOfExpensesList.map(item => <Option key={item.ID} value={item.ID} >{item.Code}</Option>)}
        </Select>
      </Form.Item>
    )
  }

  let ignoreCustomPercentage = null;
  if (parentId === 18 || parentId === 19) {
    ignoreCustomPercentage = (
      <Form.Item
        label={t('IgnoreCustomPercentage')}
        name='IgnoreCustomPercentage'
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    )
  }

  let isAliment = null;
  if (parentId === 63) {
    isAliment = (
      <Form.Item
        label={t('IsAliment')}
        name='IsAliment'
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    )
  }

  let isAfterPrePayment = null;
  let isFinallyCalculation = null;
  if (parentId === 19) {
    isAfterPrePayment = (
      <Form.Item
        label={t('IsAfterPrePayment')}
        name='IsAfterPrePayment'
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    )

    isFinallyCalculation = (
      <Form.Item
        label={t('IsFinallyCalculation')}
        name='IsFinallyCalculation'
        valuePropName="checked"
      >
        <Switch onChange={SwitchChange} />
      </Form.Item>
    )
  }

  return (
    <Fade>
      <MainCard title={docTitle}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={classes.FilterForm}
            form={mainForm}
            id='mainForm'
          >
            <Row gutter={[16, 16]} >
              <Col xl={12} lg={12}>
                <Card
                  hoverable
                  title=" "
                  size='small'
                  className='inputs-wrapper-card'
                  style={{ marginBottom: '16px' }}
                >
                  <Row gutter={[10, 10]} style={{rowGap: 7}}>
                    <Col xl={8} lg={12}>
                      <Form.Item label={t("number")}
                        name="Number"
                        style={{ width: '100%' }}
                        rules={[
                          {
                            required: true,
                            message: t("Please input valid"),
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("Date")}
                        name="Date"
                        rules={[
                          {
                            required: true,
                            message: t("inputValidData"),
                          },
                        ]}
                      >
                        <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("SelectMonth")}
                        name="DocMonth"
                        rules={[
                          {
                            required: true,
                            message: t("pleaseSelect"),
                          },
                        ]}>

                        <Select placeholder={t("SelectMonth")} onSelect={onMonthChange}>
                          {months.map(item => <Option key={item.id} value={item.id}>{t(item.name)}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("Year")}
                        name="docYear"
                        rules={[
                          {
                            required: true,
                            message: t("pleaseSelect"),
                          },
                        ]}
                      >
                        <InputNumber className={classes['year-input']} onChange={onYearChange} />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("division")}
                        name="DivisionID"
                        rules={[
                          {
                            required: true,
                            message: t("inputValidData"),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t("division")}
                          style={{ width: '100%' }}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={divisionChangeHandler}
                        // onChange={handleCommentChange}
                        >
                          {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("department")}
                        name="DepartmentID"
                      >
                        <Select
                          placeholder={t("department")}
                          style={{ width: '100%' }}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={divisionChangeHandler}
                        >
                          {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t("RoundingTypeID")}
                        name="RoundingTypeID"
                        rules={[
                          {
                            required: true,
                            message: t("inputValidData"),
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          placeholder={t("RoundingTypeID")}
                          style={{ width: '100%' }}
                          optionFilterProp="children"
                          onChange={roundingChangeHandler}
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {roundingTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item label={t("PaymentOrderID")}
                        name="paymentOrderID"
                        style={{ width: '100%' }}
                      >
                        <Input disabled
                          style={{ color: 'black' }} />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      {percent}
                    </Col>
                    <Col xl={24} lg={24}>
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

                        <TextArea
                          rows={2}
                        />

                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xl={12} lg={12}>
                <Card
                  hoverable
                  title=" "
                  size='small'
                  className='inputs-wrapper-card'
                  style={{ marginBottom: '16px' }}
                >
                  <Row gutter={[10, 10]}>
                    <Col xl={7} lg={12}>
                      <div className={classes.EmployeeStateModal}>
                        {banksStateModal && (
                          <BanksModal
                            visible={banksStateModal}
                            onCancel={() => setBanksState(false)}
                            getFullName={getFullName}

                          />
                        )}

                        <Form.Item
                          label={t("Banks")}
                          name="PlasticCardBankCode"
                          style={{ width: '100%' }}
                          rules={[
                            {
                              required: true,
                              message: t("Please input valid"),
                            },
                          ]}
                        >
                          <Input
                            disabled
                            style={{ color: 'black' }}
                          />
                        </Form.Item>
                        <Button
                          type="primary"
                          onClick={() => {
                            setBanksState(true);
                          }}
                          style={{ marginTop: 38 }}
                          icon={<BankOutlined />}
                        />
                      </div>

                    </Col>
                    <Col xl={7} lg={12}>
                      <Form.Item
                        label={t("SelectPlasticTyp")}
                        name="PlasticCardType"
                        rules={[
                          {
                            required: true,
                            message: t("pleaseSelect"),
                          },
                        ]}>
                        <Select
                          onSelect={onPlasticCardChange}
                          placeholder={t("SelectPlasticTyp")}>
                          <Option value="1">{t("HUMO")} </Option>
                          <Option value="2">{t("UZCARD")}</Option>
                          <Option value="3">{t("DUET")}</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={10} lg={12}>
                      <Form.Item
                        label={t("Typeofcalculation")}
                        name="SubCalculationKindID"
                        rules={[
                          {
                            required: true,
                            message: t("inputValidData"),
                          },
                        ]}

                      >
                        <Select
                          placeholder={t("Typeofcalculation")}
                          style={{ width: '100%' }}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          onChange={SelectChange}
                          onSelect={onSubCalcChange}
                        >
                          {payrollList.map(item => <Option key={item.ID} value={item.ID} data-parent={item.ParentID}>{item.Name}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={9} lg={12}>
                      <Form.Item
                        label={t("OrganizationsSettlementAccount")}
                        name="OrganizationsSettlementAccountID"
                        rules={[
                          {
                            required: true,
                            message: t("inputValidData"),
                          },
                        ]}
                      >
                        <Select
                          placeholder={t("OrganizationsSettlementAccount")}
                          style={{ width: '100%' }}
                          showSearch
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {orgSettleAccList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xl={15} lg={12}>
                      {subAccListNode}
                    </Col>
                    <Col xl={12} lg={12}>
                      {itemOfExpense}
                    </Col>
                    <Col xl={12} lg={12}>
                      {ignoreCustomPercentage}
                    </Col>
                    <Col xl={12} lg={12}>
                      {isAfterPrePayment}
                    </Col>
                    <Col xl={12} lg={12}>
                      {isFinallyCalculation}
                    </Col>
                    <Col xl={12} lg={12}>
                      {isAliment}
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Form>
          {/* Vedmost Table */}
          <Tabs defaultActiveKey="1">
            <TabPane tab={t("Bill")} key="1">
              <Form
                form={tableForm}
                component={false}
                scrollToFirstError
                onValuesChange={onTableValuesChange}
                onFinish={onTableFilterHandler}
                onFinishFailed={onTableFilterFailedHandler}
              >
                {employeeStateModal && (
                  <AddTableModal
                    visible={employeeStateModal}
                    onCancel={() => setEmployeeState(false)}
                    onCreate={createTableDataHandler}
                    plasticDocsTables={plasticDocsTables}
                    getModalData={getModalData}
                    parentId={parentId}
                    currentDocId={currentDocId}
                    bankId={bankId}
                    cardType={cardType}
                  />
                )}

                {/* <Form
                                    onFinish={onTableFilterHandler}
                                    onFinishFailed={onTableFilterFailedHandler}
                                > */}
                <div className={classes.buttons}>

                  <Button type="primary"
                    disabled={disabledAddBtn}
                    onClick={AddBtn}
                  >{t('add')}
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    form="mainForm"
                  >
                    {t("fill")}
                  </Button>
                  <Popconfirm
                    title={t('delete')}
                    onConfirm={() => clearTableHandler()}
                    disabled={disabledActions}
                    okText={t('yes')}
                    cancelText={t('cancel')}
                  >
                    <Button disabled={disabledActions}>
                      {t("Tozalash")}
                    </Button>
                  </Popconfirm>

                  <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("deleted")}</Button>

                </div>

                <div className={classes.filterData}>

                  <Form.Item
                    label={t('PrsNum')}
                    name="PersonnelNumber"
                  >
                    <InputNumber
                      min={0} placeholder={t('PrsNum')} />
                  </Form.Item>

                  <Form.Item
                    label={t('fio')}
                    name="Search"
                  >
                    <Input placeholder={t('fio')} />
                  </Form.Item>

                  <Button type="primary" htmlType="submit">
                    <i className="feather icon-refresh-ccw" />
                  </Button>

                  <Text
                    mark
                    strong
                    underline
                    className='highlighted-text'
                    type="primary"
                  //  style={{backgroundColor:'#d1d7dc', height:25}}
                  >
                    {t('Sum')}: {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalPlasticSum.Sum)}
                  </Text>
                  <Text
                    mark
                    strong
                    underline
                    className='highlighted-text'
                    type="primary"
                  // style={{backgroundColor:'#d1d7dc', height:25}}
                  >
                    {t('Sum')}:{new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(totalPlasticSum.SumPayrollSum)}
                  </Text>
                  <Text
                    mark
                    strong
                    underline
                    className='highlighted-text'
                    type="primary"
                  // style={{backgroundColor:'#d1d7dc', height:25}}  
                  >
                    {t('percent')}: {totalPlasticSum.Percentage}
                  </Text>


                </div>

                {/* </Form> */}

                {plasticDocsTables.length === 0 ?
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                  <Table
                    bordered
                    size='middle'
                    rowClassName={setRowClassName}
                    className="main-table inner-table"
                    dataSource={plasticDocsTables}
                    columns={mergedColumns}
                    loading={tableLoading}
                    rowKey={(record) => record.ID}
                    onChange={handleTableChange}
                    pagination={pagination}
                    showSorterTooltip={false}
                    components={{
                      body: {
                        cell: EditableCell
                      }
                    }}
                    rowSelection={{
                      onChange: onSelectChange,
                      selections: [Table.SELECTION_INVERT],
                    }}
                    scroll={{
                      x: "max-content",
                      y: '80vh'
                    }}
                    getModalData={getModalData}
                    onRow={(record) => {
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
                    }}
                  />}

              </Form>
            </TabPane>


            {/* Payroll Calculation */}
            {
              !isFinalCalculation &&
              <TabPane tab={t("PayCalc")} key="2">

                <Form
                  form={tableForm}
                  component={false}
                  scrollToFirstError
                  onFinish={onTableFilterHandler}
                  onFinishFailed={onTableFilterFailedHandler}
                >
                  <div className={classes.buttons}>

                    {employeeStateModal && (
                      <AddTableModal
                        visible={employeeStateModal}
                        onCancel={() => setEmployeeState(false)}
                        onCreate={createTableDataHandler}
                        plasticDocsTables={plasticDocsTables}
                        getModalData={getModalData}
                      />
                    )}

                    <Button
                      type="primary"
                      htmlType="submit"
                    >
                      {t("fill")}
                    </Button>

                    <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("deleted")}</Button>

                    <Form.Item
                      label={t('PrsNum')}
                      name="PersonNumber"
                    >
                      <InputNumber style={{ width: 80 }} min={0} placeholder={t('PrsNum')} />
                    </Form.Item>

                    <Form.Item
                      label={t('fio')}
                      name="EmpFullName"
                    >
                      <Input placeholder={t('fio')} />
                    </Form.Item>

                    <Button type="primary" htmlType="submit">
                      <i className="feather icon-refresh-ccw" />
                    </Button>

                  </div>
                  {plasticDocsTables.length === 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                    <Table
                      bordered
                      size='middle'
                      rowClassName="editable-row table-row"
                      className="main-table inner-table"
                      dataSource={plasticDocsTables}
                      columns={mergedColumns2}
                      loading={tableLoading}
                      rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                      onChange={handleTableChange}
                      pagination={pagination}
                      showSorterTooltip={false}
                      components={{
                        body: {
                          cell: EditableCell
                        }
                      }}

                      rowSelection={{
                        onChange: onSelectChange,
                        selections: [Table.SELECTION_INVERT],
                      }}
                      scroll={{
                        x: "max-content",
                        y: '90vh'
                      }}
                      getModalData={getModalData}
                      onRow={(record) => {
                        return {
                          onDoubleClick: () => {
                            // if (RequestReceivingCashTableEditRole) {
                            edit(record)
                            // }
                          },
                        };
                      }}
                    />}

                </Form>
              </TabPane>
            }

            {CentralAccountingParentRole &&
              <TabPane tab={t("orgTable")} key="3">

                <Form
                  form={tableForm}
                  component={false}
                  scrollToFirstError
                  onFinish={onTableFilterHandler}
                  onFinishFailed={onTableFilterFailedHandler}
                >
                  <div className={classes.buttons}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled
                    >
                      {t("fill")}
                    </Button>

                    <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("deleted")}</Button>
                    <Popconfirm
                      title={t('delete')}
                      onConfirm={() => clearTableHandler()}
                      disabled={disabledActions}
                      okText={t('yes')}
                      cancelText={t('cancel')}
                    >
                      <Button disabled={disabledActions}>
                        {t("Tozalash")}
                      </Button>
                    </Popconfirm>

                  </div>
                  {plasticOrgTables === 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                    <Table
                      bordered
                      size='middle'
                      rowClassName="editable-row table-row"
                      className="main-table inner-table"
                      showSorterTooltip={false}
                      dataSource={plasticOrgTables.TablesOrg}
                      columns={mergedOrgTable}
                      loading={tableLoading}
                      rowKey={(record) => record.ID === 0 ? record.key : record.ID}
                      onChange={handleTableChange}
                      pagination={pagination}
                      components={{
                        body: {
                          cell: EditableCell
                        }
                      }}

                      rowSelection={{
                        onChange: onSelectChange,
                        selections: [Table.SELECTION_INVERT],
                      }}
                      scroll={{
                        x: "max-content",
                        y: '90vh'
                      }}
                      getModalData={getModalData}
                      onRow={(record) => {
                        return {
                          onDoubleClick: () => {
                            edit(record)
                            // if (RequestReceivingCashTableEditRole) {
                            //     edit(record)
                            // }
                          },
                        };
                      }}
                    />
                  }

                </Form>
              </TabPane>
            }

          </Tabs >


          <div className={classes.buttons} style={{ margin: 0 }}>
            <Button
              type="danger"
              onClick={() => {
                history.goBack();
                Notification("warning", t("not-saved"));
              }}
            >
              {t("back")}
            </Button>
            <Button
              onClick={saveAllHandler}
              type="primary"
            >
              {t("save")}
            </Button>
          </div>
        </Spin>
      </MainCard >
    </Fade >
  );
};
export default EditPayrollOfPlasticCardSheet;