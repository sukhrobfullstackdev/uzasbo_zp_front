import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, Table, Empty, Space, Tabs, InputNumber, Popconfirm, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';

import Card from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import TimeSheetEduServices from "../../../../../services/Documents/Personnel_accounting/TimeSheetEdu/TimeSheetEdu.services";
import EditableCell from "./EditableCell";
import CommonServices from "../../../../../services/common/common.services";
import classes from './TimeSheetEdu.module.css';
import { appendArray } from "../../../../../helpers/helpers";

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

const UpdateTimeSheetEdu = (props) => {
  // const [timeSheetEdu, setTimeSheetEdu] = useState([]);
  const [timeSheetTypeList, setTimeSheetTypeList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [rowId, setRowId] = useState(null);
  const [timesheetTableDocId, setTimesheetTableDocId] = useState(props.match.params.id ? props.match.params.id : 0);
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
  const [disabledActions, setDisabledActions] = useState(true);
  // End Table states

  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const [tableForm] = Form.useForm();
  const totalReqRecCashRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeShtEdu = await TimeSheetEduServices.getById(props.match.params.id ? props.match.params.id : 0);
        const timeShtLs = await HelperServices.GetTimeSheetTypeList();
        const divisionLs = await HelperServices.GetDivisionList();
        if (props.match.params.id) {
          const tableData = await TimeSheetEduServices.getTimeSheetEduTableData(props.match.params.id, 1, 50);
          const departmentLs = await HelperServices.getDepartmentList(timeShtEdu.data.DivisionID);
          setDepartmentList(departmentLs.data);
          setTableData(tableData.data.rows);
          setTablePagination((prevState) => ({
            pagination: {
              ...prevState.pagination,
              total: tableData.data.total
            }
          }));
        }
        // setTimeSheetEdu(timeShtEdu.data);
        setTableId(timeShtEdu.data.TableID);
        setTimeSheetTypeList(timeShtLs.data);
        setDivisionList(divisionLs.data);
        if (timeShtEdu.data.StatusID === 2) {
          setDisabledActions(true);
        }
        if (timeShtEdu.data.StatusID === 0 || timeShtEdu.data.StatusID === 1 || timeShtEdu.data.StatusID === 3 || timeShtEdu.data.StatusID === 4 || timeShtEdu.data.StatusID === 10) {
          setDisabledActions(false);
        }
        
        setLoader(false);
        mainForm.setFieldsValue({
          ...timeShtEdu.data,
          Date: moment(timeShtEdu.data.Date, 'DD.MM.YYYY'),
        })
      } catch (err) {
        Notification('error', err);
        // setLoader(false);
      }
    }
    fetchData();
  }, [props.match.params.id, mainForm]);

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
        // item.Status = 2;
        newData.splice(index, 1, { ...item, ...row });
        if (tableRowChanged) {
          setTableLoading(true);
          const tableRow = await TimeSheetEduServices.saveTableRow({ ...item, ...row });
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
      setEditingKey("");
      setTableLoading(false);
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
      // ellipsis: true
    },
    {
      title: t("employee"),
      dataIndex: "EmployeeFullName",
      fixed: "left",
      sorter: true,
      width: 180,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("EnrolDocId"),
      dataIndex: "EnrolmentDocumentID",
      width: 100,
      sorter: true,
    },
    {
      title: t("Position List"),
      dataIndex: "ListOfPositionName",
      width: 120,
      // fixed: "left",
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("WorkLoad"),
      dataIndex: "WorkLoad",
      sorter: true,
      width: 100,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("TeachingLoad"),
      dataIndex: "TeachingLoad",
      width: 100,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("CheckNotebookHour"),
      dataIndex: "CheckNotebookHour",
      width: 120,
      editable: true,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("CheckNotebookSmallHour"),
      dataIndex: "CheckNotebookSmallHour",
      width: 130,
      editable: true,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("HourlyWork"),
      dataIndex: "HourlyWork",
      width: 110,
      editable: true,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("IndTrainingHours"),
      dataIndex: "IndTrainingHours",
      width: 110,
      editable: true,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("MissedWorkHours"),
      dataIndex: "MissedWorkHours",
      width: 110,
      editable: true,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("MissedTeachingHours"),
      dataIndex: "MissedTeachingHours",
      width: 120,
      editable: true,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("TotalWorkLoad"),
      dataIndex: "TotalWorkLoad",
      width: 90,
      editable: true,
      sorter: true,
      className: 'disabled-input',
      render: (record => {
        if (record < 0) {
          return <span style={{ color: 'red' }}>{record}</span>
        } else {
          return record;
        }
      })
    },
    {
      title: t("TotalTeachingLoad"),
      dataIndex: "TotalTeachingLoad",
      width: 90,
      editable: true,
      sorter: true,
      className: 'disabled-input',
      render: (record => {
        if (record < 0) {
          return <span style={{ color: 'red' }}>{record}</span>
        } else {
          return record;
        }
      })
    },
    {
      title: t("total"),
      dataIndex: "Total",
      width: 80,
      editable: true,
      className: 'disabled-input',
      render: (ownData, record) => {
        if (ownData) {
          return ownData.toFixed(2);
        } else {
          return (record.TotalWorkLoad + record.TotalTeachingLoad).toFixed(2);
        }
      },
    },
    {
      title: t("FactualDays"),
      dataIndex: "FactualDays",
      width: 90,
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
      width: 80,
      editable: true,
      sorter: true,
    },
    {
      title: t("OrganizationsSettlementAccount"),
      dataIndex: "OrganizationSettlementAccountCode",
      width: 200,
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
        onEnter: () => save(record.ID),
        tableForm: tableForm,
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
    TimeSheetEduServices.deleteTableRow(selectedIds)
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
    setTableData([]);
    TimeSheetEduServices.clearTable(timesheetTableDocId)
      .then(res => setLoader(false))
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

    TimeSheetEduServices.getTimeSheetEduTableData(fillId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
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
      const mainData = await TimeSheetEduServices.createTimeSheetEduMainData(values);
      if (mainData.status === 200) {
        setTimesheetTableDocId(mainData.data);
        const { pagination } = tablePagination;
        fetchTableData({ pagination }, {}, mainData.data);
      }
    } catch (err) {
      setLoader(false);
      Notification('error', err);
    }
  };

  const saveAllHandler = () => {
    mainForm.validateFields()
      .then((values) => {
        setLoader(true);
        values.ID = timesheetTableDocId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.Tables = [...tableData];

        //upload 
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
        console.log(values.Tables);

        TimeSheetEduServices.postData(formData)
          .then(res => {
            Notification("success", t("save"));
            setLoader(false);
            history.push('/TimeSheetEdu');
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
    // console.log('Success:', filterValues);
  };

  const onTableValuesChange = () => {
    tableRowChanged = true;
  }

  const setRowClassName = (record) => {
    return record.ID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }
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
      CommonServices.deleteFile(timesheetTableDocId, tableId, 'timesheetedu')
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
      CommonServices.downloadFile(timesheetTableDocId, tableId, 'timesheetedu')
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
      <Card title={t("TimeSheetEdu")}>
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
            </Row>
          </Form>

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
          {/* <Divider /> */}
          <Tabs defaultActiveKey="1">
            <TabPane tab={t('TimeSheet')} key="1">
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
                    // disabled={tableData.length !== 0 || disabledActions}
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
                    showSorterTooltip={false}
                    rowClassName={setRowClassName}
                    className="main-table inner-table"
                    dataSource={tableData}
                    columns={mergedColumns}
                    loading={tableLoading}
                    rowKey={(record) => record.ID}
                    onChange={handleTableChange}
                    pagination={{
                      ...pagination,
                      showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                    }}
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
                      y: '70vh'
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

export default UpdateTimeSheetEdu;
