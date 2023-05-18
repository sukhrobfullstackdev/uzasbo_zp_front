import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, InputNumber, Space, Tabs, Table, Popconfirm } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';

import Card from "../../../../components/MainCard";
import classes from "./RequestReceivingCash.module.css";
import months from '../../../../../helpers/months';
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import RequestReceivingCashServices from "../../../../../services/Documents/EmployeeMovement/RequestReceivingCash/RequestReceivingCash.services.js";
import EditableCell from "./EditableCell";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
// const defalutTableDocPagination = {
//   pagination: {
//     current: 1,
//     pageSize: 10
//   }
// }
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const currentDate = moment();
const currentMonth = currentDate.format('MM');
const currentYear = currentDate.format('YYYY');

const UpdateRequestReceivingCash = (props) => {
  const [reqRecCash, setReqRecCash] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0);
  const [cashTypeList, setCashTypeList] = useState([]);
  const [firstSign, setFirstSign] = useState([]);
  const [secondSign, setSecondSign] = useState([]);
  const [orgSettleAccList, setOrgSettleAccList] = useState([]);
  const [cashDocsTables, setCashDocsTables] = useState([]);
  // const [tableDoc1, setTableDoc1] = useState([]);
  // const [tableDoc2, setTableDoc2] = useState([]);
  // const [tableDoc3, setTableDoc3] = useState([]);
  // const [tableDoc4, setTableDoc4] = useState([]);
  // const [tableDoc5, setTableDoc5] = useState([]);
  // const [orgsTable, setOrgsTable] = useState([]);
  const [orgTableSelectedRows, setOrgTableSelectedRows] = useState([]);
  // const [tableDocPagination, setTableDocPagination] = useState(defalutTableDocPagination);
  // Main table states
  const [mainTableData, setMainTableData] = useState([]);
  // const [mainTablePagination, setMainTablePagination] = useState(defalutTableDocPagination);
  const [mainTableRowId, setMainTableRowId] = useState(null);
  const [editingKey, setEditingKey] = useState("");

  // const [mainTableLoading, setMainTableLoading] = useState(false);
  // End Main table states
  // const [tableDocLoading, setTableDocLoading] = useState(false);
  const [loader, setLoader] = useState(true);

  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const [mainTableForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;
  const RequestReceivingCashTableEditRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('RequestReceivingCashTableEdit');
  const CentralAccountingParentRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('CentralAccountingParent');
  const docOperationRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqRecCashData = await RequestReceivingCashServices.getData(docId);
        const cashTypeLs = await HelperServices.getReqRecCashTypeList();
        const frstSign = await HelperServices.getOrgSignList(1);
        const scndSign = await HelperServices.getOrgSignList(2);
        const orgSettleAccLs = await HelperServices.getOrganizationsSettlementAccountList();
        setCashTypeList(cashTypeLs.data);
        setFirstSign(frstSign.data);
        setSecondSign(scndSign.data);
        setReqRecCash(reqRecCashData.data);
        setOrgSettleAccList(orgSettleAccLs.data);
        setMainTableData(reqRecCashData.data.Tables);
        setCashDocsTables(reqRecCashData.data);
        // setTableDoc1(reqRecCashData.data.TablesDoc1);
        // setTableDoc2(reqRecCashData.data.TablesDoc2);
        // setTableDoc3(reqRecCashData.data.TablesDoc3);
        // setTableDoc4(reqRecCashData.data.TablesDoc4);
        // setTableDoc5(reqRecCashData.data.TablesDoc5);
        // setOrgsTable(reqRecCashData.data.TablesOrg);
        setLoader(false);
        mainForm.setFieldsValue({
          ...reqRecCashData.data,
          Date: moment(reqRecCashData.data.Date, 'DD.MM.YYYY'),
          DocMonth: docId === 0 ? currentMonth : reqRecCashData.data.DocMonth,
          DocYear: docId === 0 ? currentYear : reqRecCashData.data.DocYear,
          FirstSign: docId === 0 ? frstSign.data[0].FIO : reqRecCashData.data.FirstSign,
          SecondSign: docId === 0 ? scndSign.data[0].FIO : reqRecCashData.data.SecondSign,
          ReqRecCashTypeID: docId === 0 ? null : reqRecCashData.data.ReqRecCashTypeID,
          OrganizationsSettlementAccountID: docId === 0 ? null : reqRecCashData.data.OrganizationsSettlementAccountID,
        })
      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [mainForm, docId]);

  const onFinish = (values) => {
    values.ID = currentDocId;
    values.Date = values.Date.format("DD.MM.YYYY");
    values.Tables = mainTableData;
    values.TablesDoc1 = cashDocsTables.TablesDoc1;
    values.TablesDoc2 = cashDocsTables.TablesDoc2;
    values.TablesDoc3 = cashDocsTables.TablesDoc3;
    values.TablesDoc4 = cashDocsTables.TablesDoc4;
    values.TablesDoc5 = cashDocsTables.TablesDoc5;
    values.TablesOrg = cashDocsTables.TablesOrg;
    setLoader(true);
    RequestReceivingCashServices.postData(values)
      .then((res) => {
        if (res.status === 200) {
          history.push(`/RequestReceivingCash`);
        }
      })
      .catch((err) => {
        setLoader(false);
        // console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };

  const fillAllDocs = async () => {
    const values = await mainForm.validateFields();
    try {
      values.ID = currentDocId;
      values.Date = values.Date.format("DD.MM.YYYY");
      setLoader(true);
      const dataForTableDocs = await RequestReceivingCashServices.postData(values);
      setCurrentDocId(dataForTableDocs.data.ID);
      const cashDocs = await RequestReceivingCashServices.getCashDocsTable(dataForTableDocs.data.ID);
      setCashDocsTables(cashDocs.data);
      setMainTableData([]);
      setLoader(false);
    } catch (err) {
      Notification('error', err)
      setLoader(false);
    }
  }

  // const tableDocChangeHandler = (pagination, filters, sorter, record) => {
  //   setTableDocPagination({
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     pagination,
  //     ...filters,
  //   });
  // };

  // const tabsChangeHandler = () => {
  //   setTableDocPagination(defalutTableDocPagination);
  // }

  const deleteTableDocRowHandler = async (id) => {
    setLoader(true);
    try {
      const deletedRow = await RequestReceivingCashServices.deleteCashDocTableRow(id);
      if (deletedRow.status === 200) {
        const updatedCashDocsTable = await RequestReceivingCashServices.getUpdatedCashDocsTable(currentDocId);
        setCashDocsTables(updatedCashDocsTable.data);
      }
      setLoader(false);
    } catch (error) {
      // console.log(error);
      setLoader(false);
    }
  }

  const tableDocColums = [
    {
      title: t("id"),
      dataIndex: "ID",
      width: 120,
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t("number"),
      dataIndex: "Number",
      width: 100,
      sorter: (a, b) => a.Number - b.Number,
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      width: 120,
      sorter: (a, b) => a.Date.length - b.Date.length,
    },
    {
      title: t("Sum"),
      dataIndex: "Sum",
      width: 160,
      align: 'right',
      sorter: (a, b) => a.Sum - b.Sum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("division"),
      dataIndex: "DivisionName",
      // width: 80,
      sorter: (a, b) => a.DivisionName.length - b.DivisionName.length,
    },
    {
      title: t("Comment"),
      dataIndex: "Comment",
      // width: 120,
      sorter: (a, b) => a.Comment.length - b.Comment.length,
    },
    {
      title: t("actions"),
      key: "action",
      align: "center",
      fixed: 'right',
      width: 80,
      render: (record) => {
        if (btnsDisabled) {
          return (
            <div
              style={{ cursor: 'not-allowed' }}
            >
              <i className="feather icon-trash-2 disabled-action-icon" aria-hidden="true" />
            </div>
          );
        }
        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => deleteTableDocRowHandler(record.ID)}
          >
            <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
          </div>
        );
      },
    },
  ];

  // Main table functions
  const isEditing = (record) => record.ID === editingKey;

  const edit = (record) => {
    mainTableForm.setFieldsValue({
      ...record
    });
    setEditingKey(record.ID);
  };

  const save = async (key) => {
    try {
      const row = await mainTableForm.validateFields();
      const newData = [...mainTableData];

      const index = newData.findIndex((item) => key === item.ID);

      if (index > -1) {
        const item = newData[index];
        item.Status = 2;
        newData.splice(index, 1, { ...item, ...row });
        setMainTableData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setMainTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const mainTablecolumns = [
    {
      title: t('id'),
      dataIndex: "ID",
      // width: 80,
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t('ItemOfExpensesName'),
      dataIndex: "ItemOfExpensesName",
      width: 200,
      sorter: (a, b) => a.ItemOfExpensesName.length - b.ItemOfExpensesName.length,
    },
    {
      title: t('CalculationTypeName'),
      dataIndex: "CalculationTypeName",
      // width: 120,
      sorter: (a, b) => a.CalculationTypeName.length - b.CalculationTypeName.length,
    },
    {
      title: t('SubCalculationKindName'),
      dataIndex: "SubCalculationKindName",
      // width: 120,
      sorter: (a, b) => a.SubCalculationKindName.length - b.SubCalculationKindName.length,
    },
    {
      title: t('Sum'),
      dataIndex: "Sum",
      width: 184,
      sorter: (a, b) => a.Sum - b.Sum,
      editable: true,
      align: 'right',
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t('OrginalSum'),
      dataIndex: "OrginalSum",
      width: 150,
      sorter: true,
      align: 'right',
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
  ];

  const mergedColumns = mainTablecolumns.map((col) => {

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

  const setRowClassName = (record) => {
    return record.ID === mainTableRowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }

  const fillMainTableHandler = () => {
    setLoader(true);
    RequestReceivingCashServices.fillMainTable(currentDocId)
      .then(res => {
        if (res.status === 200) {
          console.log(res);
          setMainTableData(res.data);
          setLoader(false);
        }
      })
      .catch(err => {
        Notification('error', err);
        setLoader(false);
      })
  }

  // const mainTableChangeHandler = (pagination, filters, sorter, record) => {
  //   setMainTablePagination({
  //     sortField: sorter.field,
  //     sortOrder: sorter.order,
  //     pagination,
  //     ...filters,
  //   });
  // }

  // End Main table functions

  // Orgs table
  const onOrgsTableSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRows);
    setOrgTableSelectedRows(selectedRows);
  };

  const deleteOrgsTableRowHandler = (id) => {
    // console.log(id);
  }

  const deleteMultipleOrgsTableRowHandler = () => {
    // setTableLoading(true);
    const selectedIds = orgTableSelectedRows.map(item => item.ID);
    RequestReceivingCashServices.deleteMultipleTableRow(selectedIds)
    // .then(res => {
    //   if (res.status === 200) {
    //     setTableLoading(false)
    //     const { pagination } = tablePagination;
    //     fetchTableData({ pagination });
    //   }
    // })
    // .catch(err => console.log(err))
  };

  const orgsTableColums = [
    {
      title: t('id'),
      dataIndex: "ID",
      // width: 80,
      sorter: (a, b) => a.ID - b.ID,
    },
    {
      title: t('docId'),
      dataIndex: "DocumentID",
      // width: 180,
      sorter: (a, b) => a.DocumentID - b.DocumentID,
    },
    {
      title: t('number'),
      dataIndex: "Number",
      // width: 120,
      sorter: (a, b) => a.Number - b.Number,
    },
    {
      title: t("date"),
      dataIndex: "Date",
      // width: 120,
      sorter: (a, b) => a.Date.length - b.Date.length,
    },
    {
      title: t("month"),
      dataIndex: "Month",
      // width: 80,
      sorter: (a, b) => a.Month.length - b.Month.length,
    },
    {
      title: t('sum'),
      dataIndex: "Sum",
      // width: 120,
      align: 'right',
      sorter: (a, b) => a.Sum - b.Sum,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t('OrganizationName'),
      dataIndex: "OrganizationName",
      // width: 120,
      sorter: (a, b) => a.OrganizationName.length - b.OrganizationName.length,
    },
    {
      title: t("actions"),
      key: "action",
      align: "center",
      fixed: 'right',
      // width: 100,
      render: (record) => {
        return (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => deleteOrgsTableRowHandler(record.ID)}
            okText={t("yes")}
            cancelText={t("cancel")}
          >
            <span>
              <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
            </span>
          </Popconfirm>
        );
      },
    },
  ];

  // End Orgs table

  let btnsDisabled = false;
  if (reqRecCash.StatusID === 2 || reqRecCash.StatusID === 6 || reqRecCash.StatusID === 8 || reqRecCash.StatusID === 9 || reqRecCash.StatusID === 12) {
    btnsDisabled = true;
  }

  // const { pagination } = tableDocPagination;

  // if (loader) {
  //   return (
  //     <div className="spin-wrapper">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <Fade>
      <Card title={t("RequestReceivingCash")}>
        <Spin size='large' spinning={loader}>
          <Form
            {...layout}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            // className={classes.FilterForm}
            form={mainForm}
            id='mainForm'
          // initialValues={{
          //   ...reqRecCash,
          //   Date: moment(reqRecCash.Date, 'DD.MM.YYYY'),
          //   DocMonth: docId === 0 ? currentMonth : reqRecCash.DocMonth,
          //   DocYear: docId === 0 ? currentYear : reqRecCash.DocYear,
          //   FirstSign: docId === 0 ? firstSign[0].FIO : reqRecCash.FirstSign,
          //   SecondSign: docId === 0 ? secondSign[0].FIO : reqRecCash.SecondSign,
          // }}
          >
            <Row gutter={[16, 16]}>
              <Col xl={4} lg={12}>
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
                  <InputNumber placeholder={t("number")} className={classes['input']} />
                </Form.Item>
              </Col>
              <Col xl={5} lg={12}>
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
                  <DatePicker placeholder={t("date")} format='DD.MM.YYYY' className={classes['input']} />
                </Form.Item>
              </Col>
              <Col xl={5} lg={12}>
                <Form.Item
                  label={t("Month")}
                  name="DocMonth"
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
                    className={classes['input']}
                    placeholder={t("month")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {months.map(item => <Option key={item.id} value={item.id}>{t(item.name)}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t('Year')}
                  name='DocYear'
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <InputNumber placeholder={t('year')} max={currentYear} className={classes['input']} />
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("ReqRecCashType")}
                  name="ReqRecCashTypeID"
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
                    className={classes['input']}
                    placeholder={t("ReqRecCashType")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {cashTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("FirstSign")}
                  name="FirstSign"
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
                    className={classes['input']}
                    placeholder={t("FirstSign")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {firstSign.map(item => <Option key={item.Number} value={item.FIO}>{item.FIO}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("SecondSign")}
                  name="SecondSign"
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
                    className={classes['input']}
                    placeholder={t("SecondSign")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {secondSign.map(item => <Option key={item.Number} value={item.FIO}>{item.FIO}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
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
                    className={classes['input']}
                    placeholder={t("OrganizationsSettlementAccount")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {orgSettleAccList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("Comment")}
                  name="Comment"
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}>
                  <TextArea rows={1} placeholder={t("Comment")} />
                </Form.Item>
              </Col>
              <Col xl={24} lg={12}>
                <Space size='middle' className='fill-main-table-btn-wrapper'>
                  <Button
                    type="primary"
                    onClick={fillAllDocs}
                    disabled={btnsDisabled || mainTableData.length !== 0}
                    // disabled={!docOperationRole || mainTableData.length !== 0}
                  >
                    {t("fillAllDocs")}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>

          <Tabs defaultActiveKey="1">
            <TabPane tab={t("Ведомость (Аванс)")} key="1">
              <Table
                bordered
                size='middle'
                rowClassName="table-row"
                className={classes['table-doc'] + " main-table"}
                dataSource={cashDocsTables.TablesDoc1}
                columns={tableDocColums}
                // loading={tableDocLoading}
                rowKey={(record) => record.ID}
                // onChange={tableDocChangeHandler}
                pagination={false}
                showSorterTooltip={false}
                // pagination={{
                //   // ...pagination,
                //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                // }}
                scroll={{
                  x: "max-content",
                  y: '20vh'
                }}
              />
            </TabPane>
            <TabPane tab={t("Ведомость (Аванс пластик)")} key="2">
              <Table
                bordered
                size='middle'
                rowClassName="table-row"
                className={classes['table-doc'] + " main-table"}
                dataSource={cashDocsTables.TablesDoc2}
                columns={tableDocColums}
                // loading={tableDocLoading}
                rowKey={(record) => record.ID}
                pagination={false}
                showSorterTooltip={false}
                // onChange={tableDocChangeHandler}
                // pagination={{
                //   // ...pagination,
                //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                // }}
                scroll={{
                  x: "max-content",
                  y: '20vh'
                }}
              />
            </TabPane>
            <TabPane tab={t("Ведомость (Зарплата)")} key="3">
              <Table
                bordered
                size='middle'
                rowClassName="table-row"
                className={classes['table-doc'] + " main-table"}
                dataSource={cashDocsTables.TablesDoc3}
                columns={tableDocColums}
                // loading={tableDocLoading}
                rowKey={(record) => record.ID}
                pagination={false}
                showSorterTooltip={false}
                // onChange={tableDocChangeHandler}
                // pagination={{
                //   // ...pagination,
                //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                // }}
                scroll={{
                  x: "max-content",
                  y: '20vh'
                }}
              />
            </TabPane>
            <TabPane tab={t("Ведомость (Зарплата пластик)")} key="4">
              <Table
                bordered
                size='middle'
                rowClassName="table-row"
                className={classes['table-doc'] + " main-table"}
                dataSource={cashDocsTables.TablesDoc4}
                columns={tableDocColums}
                // loading={tableDocLoading}
                rowKey={(record) => record.ID}
                pagination={false}
                showSorterTooltip={false}
                // onChange={tableDocChangeHandler}
                // pagination={{
                //   // ...pagination,
                //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                // }}
                scroll={{
                  x: "max-content",
                  y: '20vh'
                }}
              />
            </TabPane>
            <TabPane tab={t("Расчет зарплаты")} key="5">
              <Table
                bordered
                size='middle'
                rowClassName="table-row"
                className={classes['table-doc'] + " main-table"}
                dataSource={cashDocsTables.TablesDoc5}
                columns={tableDocColums}
                // loading={tableDocLoading}
                rowKey={(record) => record.ID}
                pagination={false}
                showSorterTooltip={false}
                // onChange={tableDocChangeHandler}
                // pagination={{
                //   // ...pagination,
                //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                // }}
                scroll={{
                  x: "max-content",
                  y: '20vh'
                }}
              />
            </TabPane>
            {CentralAccountingParentRole &&
              <TabPane tab="Organizations" key="6">
                <Space size='middle' className='fill-main-table-btn-wrapper'>
                  <Button type="danger" onClick={deleteMultipleOrgsTableRowHandler}>
                    {t("deleteBtn")}
                  </Button>
                </Space>
                <Table
                  bordered
                  size='middle'
                  rowClassName="table-row"
                  className={`main-table ${classes['org-table']}`}
                  dataSource={cashDocsTables.TablesOrg}
                  columns={orgsTableColums}
                  // loading={orgsTableLoading}
                  rowKey={(record) => record.ID}
                  showSorterTooltip={false}
                  rowSelection={{
                    onChange: onOrgsTableSelectChange,
                    selections: [Table.SELECTION_INVERT]
                  }}
                  pagination={false}
                  scroll={{
                    x: "max-content",
                    y: '20vh'
                  }}
                />
              </TabPane>
            }
          </Tabs>

          <Space size='middle' className='fill-main-table-btn-wrapper'>
            <Button
              type="primary"
              // disabled={!docOperationRole}
              disabled={btnsDisabled || currentDocId === 0}
              onClick={fillMainTableHandler}
            >
              {t("fill")}
            </Button>
          </Space>

          <Form form={mainTableForm} component={false}>
            <Table
              bordered
              size='middle'
              rowClassName={setRowClassName}
              className="main-table inner-table"
              dataSource={mainTableData}
              columns={mergedColumns}
              // loading={mainTableLoading}
              rowKey={(record) => record.ID}
              pagination={false}
              showSorterTooltip={false}
              // onChange={mainTableChangeHandler}
              // pagination={{
              //   // ...mainTablePagination,
              //   showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
              // }}
              components={{
                body: {
                  cell: EditableCell
                }
              }}
              scroll={{
                x: "max-content",
                y: '40vh'
              }}
              onRow={(record) => {
                return {
                  onDoubleClick: () => {
                    if (RequestReceivingCashTableEditRole) {
                      edit(record)
                    }
                  },
                  onClick: () => {
                    setMainTableRowId(record.ID);
                  }
                };
              }}
            />
          </Form>
          <Space size='middle' className='btns-wrapper'>
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
              htmlType="submit"
              form="mainForm"
              type="primary"
              disabled={btnsDisabled}
            >
              {t("save")}
            </Button>
          </Space>
        </Spin>
      </Card>
    </Fade >
  );
};

export default UpdateRequestReceivingCash;