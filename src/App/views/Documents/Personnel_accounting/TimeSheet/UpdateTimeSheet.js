import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, Table, Empty, Space, Tabs, InputNumber, Popconfirm, Upload } from "antd";
import { CheckCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
// import { appendArray } from "../../../../../helpers/helpers";

import Card from "../../../../components/MainCard";
// import classes from "./TimeSheetEdu.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import TimeSheetServices from "../../../../../services/Documents/Personnel_accounting/TimeSheet/TimeSheet.services";
import CommonServices from "../../../../../services/common/common.services";
import EditableCell from "./EditableCell";
import classes from './TimeSheet.module.css';

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
let tableRowChanged = false;
const defaultTablePagination = {
  current: 1,
  pageSize: 50,
}

const UpdateTimeSheet = (props) => {
  // const [timeSheetEdu, setTimeSheetEdu] = useState([]);
  const [timeSheetTypeList, setTimeSheetTypeList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [orgSettleAccList, setOrgSettleAccList] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [timesheetTableDocId, setTimesheetTableDocId] = useState(props.match.params.id ? props.match.params.id : 0);
  const [disabledActions, setDisabledActions] = useState(true);
  const [loader, setLoader] = useState(true);
  const [filelist, setFileList] = useState([]);
  const [tableId, setTableId] = useState(null);

  // Table states
  const [tableData, setTableData] = useState([]);
  const [tablePagination, setTablePagination] = useState({
    pagination: {
      current: 1,
      pageSize: 50
    }
  });
  const [editingKey, setEditingKey] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableFilterValues, setTableFilterValues] = useState({});
  // End Table states

  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const [tableForm] = Form.useForm();
  const totalReqRecCashRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeSht = await TimeSheetServices.getById(props.match.params.id ? props.match.params.id : 0);
        const timeShtLs = await HelperServices.GetTimeSheetTypeList();
        const divisionLs = await HelperServices.GetDivisionList();
        const orgSettleAccLs = await HelperServices.getOrganizationsSettlementAccountList();
        if (props.match.params.id) {
          const tableData = await TimeSheetServices.getTimeSheetTableData(props.match.params.id, 1, 50);
          const departmentLs = await HelperServices.getDepartmentList(timeSht.data.DivisionID);
          setDepartmentList(departmentLs.data);
          setTableData(tableData.data.rows);
          setTablePagination((prevState) => ({
            pagination: {
              ...prevState.pagination,
              total: tableData.data.total
            }
          }));
        }
        setTableId(timeSht.data.TableID);
        setTimeSheetTypeList(timeShtLs.data);
        setDivisionList(divisionLs.data);
        setOrgSettleAccList(orgSettleAccLs.data);
        if (timeSht.data.StatusID === 0 || timeSht.data.StatusID === 1 || timeSht.data.StatusID === 3 || timeSht.data.StatusID === 4 || timeSht.data.StatusID === 10) {
          setDisabledActions(false);
        }
        setLoader(false);
        mainForm.setFieldsValue({
          ...timeSht.data,
          Date: moment(timeSht.data.Date, 'DD.MM.YYYY'),
        })
      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [mainForm, props.match.params.id]);

  const divisionChangeHandler = divisionId => {
    HelperServices.getAllDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err => Notification('error', err))
  }

  // Table functions
  const isEditing = (record) => record.ID === editingKey;

  const edit = (record) => {
    tableForm.setFieldsValue({
      ...record,
      Total: record.TotalWorkLoad + record.TotalTeachingLoad
    });
    setEditingKey(record.ID);
  };

  // const cancel = () => {
  //   setEditingKey("");
  // };

  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...tableData];

      const index = newData.findIndex((item) => key === item.ID);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        if (tableRowChanged) {
          setTableLoading(true);
          const tableRow = await TimeSheetServices.saveTableRow({ ...item, ...row });
          if (tableRow.status === 200) {
            const { pagination } = tablePagination;
            fetchTableData({ pagination }, {});
            tableRowChanged = false;
          }
        }
        setTableData(newData);
        // setEditedTableData(prevState => [...prevState, newData]);
        setEditingKey("");
      } else {
        newData.push(row);
        // setTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      // console.log("Validate Failed:", errInfo);
      Notification('error', errInfo);
      setTableLoading(false);
      setEditingKey("");
      tableRowChanged = false;
    }
  };

  const tableColumns = [
    {
      title: t("personnelNumber"),
      dataIndex: "PersonnelNumber",
      width: 80,
      fixed: "left",
      sorter: true,
    },
    {
      title: t("employee"),
      dataIndex: "EmployeeFullName",
      fixed: "left",
      sorter: true,
      width: 200,
      // render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("checkedFromHr"),
      dataIndex: "IsChecked",
      fixed: "left",
      align: 'center',
      sorter: true,
      width: 110,
      render: record => record ?
        <CheckCircleFilled className={classes['valid-person-icon']} /> :
        <QuestionCircleFilled className={classes['invalid-person-icon']} />
    },
    {
      title: t("Department"),
      dataIndex: "DepartmentName",
      width: 120,
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("Position List"),
      dataIndex: "ListOfPositionName",
      width: 120,
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("EnrolmentDocumentID"),
      dataIndex: "EnrolmentDocumentID",
      width: 120,
      sorter: true
    },
    {
      title: t("OrganizationsSettlementAccount"),
      dataIndex: "OrganizationSettlementAccountName",
      width: 200,
      sorter: true
    },
    {
      title: t("WorkSchedule"),
      dataIndex: "WorkScheduleName",
      width: 200,
      sorter: true
    },
    {
      title: t("Rate"),
      dataIndex: "Rate",
      width: 80,
      sorter: true
    },
    {
      title: t("FactualDays"),
      dataIndex: "FactualDays",
      width: 90,
      editable: true,
      sorter: true
    },
    {
      title: t("FactHours"),
      dataIndex: "FactualHours",
      width: 100,
      editable: true,
      sorter: true
    },
    {
      title: t("HolidayHours"),
      dataIndex: "HolidayHours",
      width: 90,
      editable: true,
      sorter: true
    },
    {
      title: t("BeginNightHours"),
      dataIndex: "NightHours",
      width: 110,
      editable: true,
      sorter: true
    },
    {
      title: t("OverTimeHours"),
      dataIndex: "OverTimeHours",
      width: 90,
      editable: true,
      sorter: true
    },
    {
      title: t("HourlyWork"),
      dataIndex: "HourlyWork",
      width: 110,
      editable: true,
      sorter: true
    },
    {
      title: t("RepairHours"),
      dataIndex: "RepairHours",
      width: 100,
      editable: true,
      sorter: true
    },
    {
      title: t("SickDays"),
      dataIndex: "SickDays",
      width: 80,
      editable: true,
      sorter: true
    },
    {
      title: t("LeaveDays"),
      dataIndex: "LeaveDays",
      width: 100,
      editable: true,
      sorter: true,
    },
    {
      title: t("ExperienceContWork"),
      dataIndex: "ExperienceContWorkTableID",
      width: 150,
      sorter: true
    },
    {
      title: t("IndexationOfSalary"),
      dataIndex: "IndexationOfSalaryID",
      width: 120,
      sorter: true
    },
  ];

  const mergedColumns = tableColumns.map((col) => {
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
      })
    };
  });

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
    TimeSheetServices.deleteTableRow(selectedIds)
      .then(res => {
        if (res.status === 200) {
          setTableLoading(false)
          const { pagination } = tablePagination;
          fetchTableData({ pagination });
          setSelectedRows([]);
        }
      })
      .catch(err => {
        setTableLoading(false);
        Notification('error', err);
      })
  };

  const clearTableHandler = () => {
    if (timesheetTableDocId === 0) {
      Notification("warning", t("pleaseFill"));
      return;
    }
    setLoader(true);
    TimeSheetServices.clearTable(timesheetTableDocId)
      .then(res => {
        if (res.status === 200) {
          setLoader(false);
          setTableData([]);
        }
      })
      .catch(err => {
        setLoader(false);
        Notification('error', err);
      })
  };

  const handleTableChange = (pagination, filters, sorter) => {
    fetchTableData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    }, tableFilterValues);
  };

  const fetchTableData = (params = {}, filterValues, id) => {
    setTableLoading(true);
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder,
      fillId = id ? id : timesheetTableDocId

    TimeSheetServices.getTimeSheetTableData(fillId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.rows);
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

  const fillTableHandler = async () => {
    const values = await mainForm.validateFields()
    values.ID = timesheetTableDocId;
    values.Date = values.Date.format("DD.MM.YYYY");
    setLoader(true);
    try {
      const mainData = await TimeSheetServices.createTimeSheetMainData(values);
      if (mainData.status === 200) {
        setTimesheetTableDocId(mainData.data);
        const { pagination } = tablePagination;
        fetchTableData({ pagination }, {}, mainData.data);
      }
    } catch (err) {
      setLoader(false);
      // console.log(error);
      Notification('error', err);
    }
  };

  const saveAllHandler = () => {
    mainForm.validateFields()
      .then((values) => {
        setLoader(true);
        values.ID = timesheetTableDocId;
        values.Date = values.Date.format('DD.MM.YYYY');
        // values.DepartmentID = values.DepartmentID ? values.DepartmentID : null;
        // values.OrganizationsSettlementAccountID = values.OrganizationsSettlementAccountID ? values.OrganizationsSettlementAccountID : null;
        values.Tables = [...tableData];

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

        //  appendArray(formData, values.Tables, 'Tables');

        TimeSheetServices.postData(formData)
          .then(res => {
            Notification("success", t("saved"));
            setLoader(false);
            history.push('/TimeSheet');
          })
          .catch(err => {
            // console.log(err);
            Notification('error', err);
            setLoader(false);
          })
      })
  }

  const onTableFilterHandler = (filterValues) => {
    setTableFilterValues(filterValues);
    fetchTableData({ pagination: defaultTablePagination }, filterValues);
  };

  const onTableValuesChange = () => {
    tableRowChanged = true;
  }

  const setRowClassName = (record) => (record.ID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row')

  // End Table functions

  // File
  
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
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isLt1M) {
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
    CommonServices.deleteFile(timesheetTableDocId, tableId, 'timesheet')
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
    CommonServices.downloadFile(timesheetTableDocId, tableId, 'timesheet')
      .then(res => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "timesheetDoc.pdf");
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

  const { pagination } = tablePagination;

  return (
    <Fade>
      <Card title={t("TimeSheet")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            onFinish={fillTableHandler}
          >
            <Row gutter={[16, 16]}>
              <Col xl={4}>
                <Row gutter={[10]}>
                  <Col xl={8}>
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
                      <Input placeholder={t("number")} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col xl={16}>
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
                      <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xl={5}>
                <Form.Item
                  label={t("DisplayName")}
                  name="TimeSheetTypeID"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("DisplayName")}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {timeSheetTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={5}>
                <Form.Item
                  label={t("Division")}
                  name="DivisionID"
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("Division")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={divisionChangeHandler}>
                    {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={5}>
                <Form.Item
                  label={t("Department")}
                  name="DepartmentID"
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("Department")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={5}>
                <Form.Item
                  label={t("OrganizationsSettlementAccount")}
                  name="OrganizationsSettlementAccountID"
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
              <Col xl={3} lg={12}>
                <Form.Item
                  name="file"
                  // label={t('upload')}
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
                    {timesheetTableDocId !== 0 &&
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
            </Row>
          </Form>
          <Tabs defaultActiveKey="1">
            <TabPane tab={t('Табель')} key="1">
              <Form
                form={tableForm}
                component={false}
                onValuesChange={onTableValuesChange}
              >
                <Space size='middle' className={`fill-btns-wrapper align-start ${classes['mb-0']}`}>
                  {/* <Button
                    htmlType="submit"
                    form="mainForm"
                    // onClick={fillTableHandler}
                    disabled={tableData.length !== 0 || disabledActions}
                  >
                    {t("fill")}
                  </Button> */}
                  {totalReqRecCashRole &&
                    <Button
                      onClick={fillTableHandler}
                      disabled={tableData.length !== 0 || disabledActions}
                    >
                      {t("Tuldirish")}
                    </Button>
                  }
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
                  <Form
                    className='inner-table-filter-form'
                    onFinish={onTableFilterHandler}
                  >
                    <Space size='middle'>
                      <Form.Item
                        label={t('PrsNum')}
                        name="PersonNumber"
                      >
                        <InputNumber style={{ width: 100 }} min={0} placeholder={t('PrsNum')} />
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
                    </Space>
                  </Form>
                </Space>

                {tableData.length === 0 ?
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> :
                  <Table
                    bordered
                    size='middle'
                    rowClassName={setRowClassName}
                    className="main-table inner-table"
                    dataSource={tableData}
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
                      selections: [Table.SELECTION_INVERT]
                    }}
                    scroll={{
                      x: "max-content",
                      y: '75vh'
                    }}
                    onRow={(record) => {
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
                      } else {
                        return {
                          onClick: () => {
                            setRowId(record.ID);
                          }
                        }
                      }
                    }}
                  />
                }
              </Form>
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
      </Card>
    </Fade >
  );
};

export default UpdateTimeSheet;
