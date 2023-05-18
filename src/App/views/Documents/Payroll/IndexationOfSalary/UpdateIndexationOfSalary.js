import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, Space, InputNumber, Table, Popconfirm } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";;
import moment from 'moment';

import MainCard from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import IndexsationOfSalaryServices from "../../../../../services/Documents/Payroll/IndexationOfSalary/IndexationOfSalary.services";
import EditableCell from "./EditableCell";
import classes from './IndexationOfSalary.module.css';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { Option } = Select;
const { TextArea } = Input;
let tableRowChanged = false;
const defaultTablePagination = {
  current: 1,
  pageSize: 50,
}

const UpdateIndexationOfSalary = (props) => {
  const [divisionList, setDivisionList] = useState([]);
  const [roundingTypeList, setRoundingTypeList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [disabledActions, setDisabledActions] = useState(false);
  const [disabledInputs, setDisabledInputs] = useState(false);
  const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);
  const [loader, setLoader] = useState(true);
  // Table states
  const [selectedRows, setSelectedRows] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [rowId, setRowId] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableFilterValues, setTableFilterValues] = useState({});
  const [tablePagination, setTablePagination] = useState({
    pagination: {
      current: 1,
      pageSize: 50
    }
  });
  // EndTable states
  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const [tableForm] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      const [indexationOfSlr, divisionLs, roundingTypeLs] = await Promise.all([
        IndexsationOfSalaryServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.GetDivisionList(),
        HelperServices.getRoundingTypeList(),
      ]);

      if (props.match.params.id) {
        const tableDt = await IndexsationOfSalaryServices.getTableData(props.match.params.id, 1, 50);
        setTableData(tableDt.data.rows);
        setTablePagination({
          pagination: {
            ...defaultTablePagination,
            total: tableDt.data.total,
          },
        });
        setDisabledInputs(indexationOfSlr.data.Tables.length !== 0)
      }
      setDisabledActions(indexationOfSlr.data.StatusID === 2 ? true : false);
      setDivisionList(divisionLs.data);
      setRoundingTypeList(roundingTypeLs.data);
      setLoader(false);
      mainForm.setFieldsValue({
        ...indexationOfSlr.data,
        Date: moment(indexationOfSlr.data.Date, 'DD.MM.YYYY'),
      })
    }
    fetchData().catch(err => {
      // console.log(err);
      setLoader(false);
      Notification('error', err);
    });
  }, [props.match.params.id, mainForm]);

  const submitFormHandler = () => {
    mainForm.validateFields()
      .then(values => {
        setLoader(true);
        values.ID = +docId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.Tables = tableData;
        IndexsationOfSalaryServices.postData(values)
          .then(res => {
            if (res.status === 200) {
              Notification("success", t("saved"));
              setLoader(false);
              history.push('/IndexationOfSalary');
            }
          })
          .catch(err => {
            // console.log(err);
            setLoader(false);
            Notification("error", err);
          })
      })
  };

  const onTableRow = record => {
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
          const tableRow = await IndexsationOfSalaryServices.saveTableRow({ ...item, ...row });
          if (tableRow.status === 200) {
            fetchTableData(tablePagination, {});
            tableRowChanged = false;
          }
        }
        setTableData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setEditingKey("");
      }
    } catch (errInfo) {
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
      fixed: 'left',
      width: 90,
      sorter: true,
    },
    {
      title: t("employee"),
      dataIndex: "EmployeeFullName",
      fixed: 'left',
      sorter: true
    },
    {
      title: t("EnrolmentDocumentID"),
      dataIndex: "EnrolmentDocumentID",
      width: 120,
      sorter: true
    },
    {
      title: t("Position List"),
      dataIndex: "ListOfPositionName",
      // width: 120,
      sorter: true
    },
    {
      title: t("Rate"),
      dataIndex: "Rate",
      width: 80,
      sorter: true
    },
    {
      title: t("SubCalculationKindName"),
      dataIndex: "SubCalculationKindName",
      sorter: true
    },
    {
      title: t("OldSum"),
      dataIndex: "OldSum",
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("Sum"),
      dataIndex: "Sum",
      sorter: true,
      editable: true,
      align: 'right',
      width: 120,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("Percentage"),
      dataIndex: "Percentage",
      sorter: true,
      width: 110
    },
    {
      title: t("OutSum"),
      dataIndex: "OutSum",
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
      width: 110
    },
    {
      title: t("OrganizationsSettlementAccount"),
      dataIndex: "OrganizationSettlementAccountName",
      width: 200,
      sorter: true
    },
    {
      title: t("ID"),
      dataIndex: "ID",
      sorter: true,
    },
  ];

  const mergedTableColumns = tableColumns.map((col) => {
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
    IndexsationOfSalaryServices.deleteTableRow(selectedIds)
      .then(res => {
        if (res.status === 200) {
          fetchTableData(tablePagination);
          setSelectedRows([]);
        }
      })
      .catch(err => {
        setTableLoading(false);
        Notification('error', err);
      })
  };

  const clearTableHandler = () => {
    if (docId === 0) {
      Notification("warning", t("pleaseFill"));
      return;
    }
    setTableLoading(true);
    setTableData([]);
    IndexsationOfSalaryServices.clearTable(docId)
      .then(res => setTableLoading(false))
      .catch(err => {
        setTableLoading(false);
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
      fillId = id ? id : docId

    IndexsationOfSalaryServices.getTableData(fillId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
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
    values.ID = docId;
    values.Date = values.Date.format("DD.MM.YYYY");
    setTableLoading(true);
    try {
      const tableDt = await IndexsationOfSalaryServices.fillTableData(values);
      if (tableDt.status === 200) {
        setDocId(tableDt.data);
        fetchTableData({ pagination: defaultTablePagination }, {}, tableDt.data);
      }
    } catch (err) {
      setTableLoading(false);
      Notification('error', err);
    }
  };

  const calculateHandler = () => {
    setTableLoading(true);
    IndexsationOfSalaryServices.calculate(docId)
      .then(res => {
        if (res.status === 200) {
          fetchTableData(tablePagination, {});
        }
      })
      .catch(err => {
        setTableLoading(false);
        Notification('error', err);
      })
  }

  const setRowClassName = (record) => {
    return record.ID === rowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }

  const tableFilterHandler = (filterValues) => {
    setTableFilterValues(filterValues);
    fetchTableData({ pagination: defaultTablePagination }, filterValues);
  };

  const onTableValuesChange = () => {
    tableRowChanged = true;
  }
  // End Table functions

  const { pagination } = tablePagination;

  return (
    <Fade>
      <MainCard title={t('IndexationOfSalary')}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id='mainForm'
            scrollToFirstError
            onFinish={submitFormHandler}
          >
            <Row gutter={[16, 16]} align="top">
              <Col xl={3} lg={6}>
                <Form.Item
                  label={t("number")}
                  name="Number"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <InputNumber
                    placeholder={t("Number")}
                    style={{ width: '100%' }}
                    disabled={disabledInputs}
                  />
                </Form.Item>
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
                  <DatePicker
                    placeholder={t("date")}
                    format='DD.MM.YYYY'
                    style={{ width: '100%' }}
                    disabled={disabledInputs}
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
                    disabled={disabledInputs}
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
              <Col xl={4} lg={6}>
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
                    disabled={disabledInputs}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={10} lg={12}>
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
                  <TextArea
                    placeholder={t("Comment")}
                    rows={2}
                    disabled={disabledInputs}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Form
            form={tableForm}
            onFinish={tableFilterHandler}
            onValuesChange={onTableValuesChange}
          >
            <Space size='middle' className='fill-btns-wrapper align-start'>
              <Button onClick={deleteRowsHandler} disabled={disabledActions}>{t("deleted")}</Button>
              <Button
                onClick={fillTableHandler}
                disabled={tableData.length !== 0 || disabledActions}
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
              <Button onClick={calculateHandler} disabled={disabledActions}>{t("calculate")}</Button>
              <Form.Item
                label={t('PrsNum')}
                name="PersonNumber"
                className={classes['table-form-item']}
              >
                <InputNumber style={{ width: 100 }} min={0} placeholder={t('PrsNum')} />
              </Form.Item>

              <Form.Item
                label={t('fio')}
                name="EmpFullName"
                className={classes['table-form-item']}
              >
                <Input placeholder={t('fio')} />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Space>
            <Table
              bordered
              size='middle'
              className="main-table inner-table"
              loading={tableLoading}
              rowClassName={setRowClassName}
              dataSource={tableData}
              pagination={pagination}
              columns={mergedTableColumns}
              onChange={handleTableChange}
              rowKey={(record) => record.ID === 0 ? record.key : record.ID}
              showSorterTooltip={false}
              onRow={(record) => onTableRow(record)}
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
            />
          </Form>
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
              type="primary"
              onClick={submitFormHandler}
              disabled={disabledActions}
            >
              {t("save")}
            </Button>
          </Space>
        </Spin>
      </MainCard>
    </Fade>
  );
};

export default UpdateIndexationOfSalary;
