import React, { useState, useEffect } from 'react';
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, InputNumber, Switch, Space, Tabs, Table } from "antd";
import moment from 'moment';

import Card from "../../../../components/MainCard";
import SalaryCalculationServices from "../../../../../services/Documents/EmployeeMovement/SalaryCalculation/SalaryCalculation.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../helpers/notifications";
import SubCalcModal from './components/SubCalcModal';
import classes from './SalaryCalculation.module.css';

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
const { TabPane } = Tabs;

const UpdateSalaryCalculation = (props) => {
  const [loader, setLoader] = useState(true);
  const [salaryCalc, setSalaryCalc] = useState([]);
  const [roundingTypeList, setRoundingTypeList] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [orgSetAcc, setOrgSetAcc] = useState([]);

  const [salaryCalcTable, setSalaryCalcTable] = useState([]);
  const [salaryCalcFilterValues, setSalaryCalcFilterValues] = useState({});
  const [salaryCalcTablePagination, setSalaryCalcTablePagination] = useState({
    salaryCalcTablePagination: {
      current: 1,
      pageSize: 50
    }
  });
  const [salaryCalcTableLoading, setSalaryCalcTableLoading] = useState(false);

  const [subCalcModalVisible, setSubCalcModalVisible] = useState(false);
  const [isFinallyCalculation, setIsFinallyCalculation] = useState(false);
  const [subCalcId, setSubCalcId] = useState(null);
  const [mainFormValuesChanged, setMainFormValuesChanged] = useState(false);
  const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);

  const { t } = useTranslation();
  const [mainForm] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const slrCalc = await SalaryCalculationServices.getById(props.match.params.id ? props.match.params.id : 0);
      const roundingTpLs = await HelperServices.getRoundingTypeListForEnrolment();
      const divisionLs = await HelperServices.GetDivisionList();
      const orgSetAccLs = await HelperServices.getOrganizationsSettlementAccountList();
      if (props.match.params.id) {
        const slrCalcTable = await SalaryCalculationServices.getSalaryCalculationTableData(props.match.params.id, 1, 50);
        setSubCalcId(slrCalc.data.SubCalculationKindID);
        setSalaryCalcTable(slrCalcTable.data.rows);
        setSalaryCalcTablePagination(prevState => ({
          salaryCalcTablePagination: {
            ...prevState.salaryCalcTablePagination,
            total: slrCalcTable.data.total
          }
        }));
      }
      setSalaryCalc(slrCalc.data);
      setRoundingTypeList(roundingTpLs.data);
      setDivisions(divisionLs.data);
      setOrgSetAcc(orgSetAccLs.data);
      setIsFinallyCalculation(slrCalc.data.IsFinallyCalculation);
      mainForm.setFieldsValue({
        ...slrCalc.data,
        Date: moment(slrCalc.data.Date, 'DD.MM.YYYY'),
      });
      setLoader(false);
    }

    fetchData().catch(err => {
      Notification('error', err);
      // console.log(err);
    });
  }, [props.match.params.id, mainForm]);

  const onMainFormFinish = (values) => {
    values.ID = docId;
    values.SubCalculationKindID = subCalcId ? subCalcId : salaryCalc.SubCalculationKindID;
    values.Date = values.Date.format("DD.MM.YYYY");
    setLoader(true);
    SalaryCalculationServices.update(values)
      .then((res) => {
        if (res.status === 200) {
          history.push(`/SalaryCalculation`);
          Notification('success', t('success-msg'));
          return res;
        }
      })
      .catch((err) => {
        // console.log(err);
        Notification('error', err);
        setLoader(false);
      });
  }

  // const onMainFormFinishFailed = (errorInfo) => {
  //   Notification('error', errorInfo);
  //   // console.log(errorInfo);
  // }

  const onMainFormValuesChange = () => {
    setMainFormValuesChanged(true);
  }

  const getModalData = (name, id) => {
    setSubCalcId(id);
    mainForm.setFieldsValue({ SubCalculationKindName: name });
  };

  const switchChangeHandler = (e) => {
    setIsFinallyCalculation(e);
  }

  const handleSalaryCalcTableChange = (pagination, filters, sorter) => {
    fetchSalaryCalcTableData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    }, salaryCalcFilterValues);
  };

  const fetchSalaryCalcTableData = (params = {}, filterValues) => {
    setSalaryCalcTableLoading(true);
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder

    SalaryCalculationServices.getSalaryCalculationTableData(docId, pageNumber, pageLimit, sortColumn, orderType, filterValues)
      .then((res) => {
        if (res.status === 200) {
          setSalaryCalcTable(res.data.rows);
          setSalaryCalcTableLoading(false);
          setLoader(false);
          setSalaryCalcTablePagination({
            salaryCalcTablePagination: {
              ...params.pagination,
              total: res.data.total,
            },
          });
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
        setSalaryCalcTableLoading(false);
      });
  };

  const salaryCalcTableFilterHandler = (filterValues) => {
    const { salaryCalcTablePagination: pagination } = salaryCalcTablePagination;
    setSalaryCalcFilterValues(filterValues);
    fetchSalaryCalcTableData({ pagination }, filterValues);
  }

  const fillHandler = async () => {
    const values = await mainForm.validateFields()
    try {
      setSalaryCalcTableLoading(true);
      values.ID = docId;
      values.SubCalculationKindID = subCalcId;
      values.Date = values.Date.format("DD.MM.YYYY");
      const updateSalaryCalc = await SalaryCalculationServices.calculate(values, mainFormValuesChanged);
      if (updateSalaryCalc.status === 200) {
        setDocId(updateSalaryCalc.data);
        const { salaryCalcTablePagination: pagination } = salaryCalcTablePagination;
        fetchSalaryCalcTableData({ pagination }, {});
      }
    } catch (error) {
      // console.log(error);
      Notification('error', error);
      setSalaryCalcTableLoading(false);
    }
  }

  const salaryCalcColumns = [
    {
      title: t("personnelNumber"),
      dataIndex: "PersonnelNumber",
      width: 80,
      sorter: true
    },
    {
      title: t("EmpFullName"),
      dataIndex: "EmployeeFullName",
      width: 180,
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("DprName"),
      dataIndex: "DepartmentName",
      width: 120,
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("ListOfPosName"),
      dataIndex: "ListOfPositionName",
      width: 120,
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("Rate"),
      dataIndex: "Rate",
      width: 80,
      sorter: true
    },
    {
      title: t("SubCalcKindName"),
      dataIndex: "SubCalculationKindName",
      width: 120,
      sorter: true,
      render: record => <div className="ellipsis-2">{record}</div>
    },
    {
      title: t("PlanSum"),
      dataIndex: "PlanSum",
      width: 100,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("InSum"),
      dataIndex: "InSum",
      width: 100,
      sorter: true,
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("OutSum"),
      dataIndex: "OutSum",
      width: 100,
      sorter: true,
      className: classes['out-sum'],
      render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
    },
    {
      title: t("Percentage"),
      dataIndex: "Percentage",
      width: 110,
      sorter: true
    },
    {
      title: t("FactDays"),
      dataIndex: "FactDays",
      width: 110,
      sorter: true
    },
    {
      title: t("PlanDays"),
      dataIndex: "PlanDays",
      width: 100,
      sorter: true
    },
    {
      title: t("FactHours"),
      dataIndex: "FactHours",
      width: 90,
      sorter: true
    },
    {
      title: t("PlanHours"),
      dataIndex: "PlanHours",
      width: 80,
      sorter: true
    },
    {
      title: t("Code"),
      dataIndex: "Code",
      sorter: true
    },
    {
      title: t("EnrolmentDocumentID"),
      dataIndex: "EnrolmentDocumentID",
      width: 120,
      sorter: true
    },
    {
      title: t("DocumentID"),
      dataIndex: "DocumentID",
      width: 120,
      sorter: true
    },
  ];

  const { salaryCalcTablePagination: slrCalcTablePagination } = salaryCalcTablePagination;

  let fillBtnVisible = true;
  if (salaryCalc.StatusID === 2 || salaryCalc.StatusID === 6 || salaryCalc.StatusID === 8 || salaryCalc.StatusID === 12) {
    fillBtnVisible = false;
  }

  return (
    <Fade>
      <Card title={t("EditSalaryCalculation")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id="mainForm"
            onFinish={onMainFormFinish}
            // onFinishFailed={onMainFormFinishFailed}
            onValuesChange={onMainFormValuesChange}
          >
            <Row gutter={[15, 0]}>
              <Col xl={6} lg={12}>
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
                  <InputNumber style={{ width: "100%" }} placeholder={t("Number")} />
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("Date")}
                  name="Date"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}>
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} placeholder={t("date")} />
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("RoundingType")}
                  name="RoundingTypeID"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("RoundingType")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {roundingTypeList.map((item) => (
                      <Option key={item.ID} value={item.ID}>
                        {item.DisplayName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("division")}
                  name="DivisionID"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("division")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {divisions.map((item) => (
                      <Option key={item.ID} value={item.ID}>
                        {item.ShortName}
                      </Option>
                    ))}
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
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("OrganizationsSettlementAccount")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {orgSetAcc.map((item) => (
                      <Option key={item.ID} value={item.ID}>
                        {item.Code}
                      </Option>
                    ))}
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
                  ]}
                >
                  <TextArea rows={1} placeholder={t("Comment")} />
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Space>
                  <Form.Item
                    label={t("IsFinallyCalculation")}
                    name="IsFinallyCalculation"
                    valuePropName="checked"
                  >
                    <Switch onChange={switchChangeHandler} />
                  </Form.Item>
                </Space>
              </Col>
              <Col xl={6} lg={12}>
                {subCalcModalVisible &&
                  <SubCalcModal
                    visible={subCalcModalVisible}
                    onCancel={() => setSubCalcModalVisible(false)}
                    getModalData={getModalData}
                  />
                }
                {!isFinallyCalculation &&
                  <Space>
                    <Form.Item
                      label={t("SubCalculationKind")}
                      name="SubCalculationKindName"
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
                        placeholder={t('SubCalculationKindName')} />
                    </Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        setSubCalcModalVisible(true);
                      }}
                      style={{ marginTop: 16 }}
                      icon={<i className="fas fa-calculator"></i>}
                    />
                  </Space>
                }
              </Col>
              <Col xl={24} lg={24}>
                <Space size='middle' className='btns-wrapper'>
                  {fillBtnVisible &&
                    <Button
                      type="primary"
                      onClick={fillHandler}>
                      {t("fill1")}
                    </Button>
                  }
                </Space>
              </Col>
            </Row>
          </Form>

          <Tabs defaultActiveKey="1">
            <TabPane tab={t('Calculate')} key="1">
              <Form
                className='inner-table-filter-form'
                onFinish={salaryCalcTableFilterHandler}
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
              <Table
                bordered
                size='middle'
                rowClassName="table-row"
                className="main-table"
                dataSource={salaryCalcTable}
                columns={salaryCalcColumns}
                loading={salaryCalcTableLoading}
                rowKey={(record) => record.ID}
                onChange={handleSalaryCalcTableChange}
                showSorterTooltip={false}
                pagination={{
                  ...slrCalcTablePagination,
                  showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                }}
                scroll={{
                  x: "max-content",
                  y: '75vh'
                }}
              />
            </TabPane>
            {/* <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane> */}
          </Tabs>

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
            >
              {t("save")}
            </Button>
          </Space>
        </Spin>
      </Card>
    </Fade>
  );
};

export default UpdateSalaryCalculation;