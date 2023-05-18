import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";

import MainCard from "../../../../components/MainCard";
import classes from "./OrderToSendBusTrip.module.css";
import { Notification } from "../../../../../helpers/notifications";
import OrderToSendBusTripModal from "./OrderToSendBusTripModal";
import HelperServices from "../../../../../services/Helper/helper.services";
import OrderToSendBusTripServices from "../../../../../services/Documents/Personnel_accounting/OrderToSendBusTrip/OrderToSendBusTrip.services";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

//main function
const UpdateOrderToSendBusTripServices = (props) => {
  const [loader, setLoader] = useState(true);
 // const [OrderOnLeaveOfAbsenceDate, setOrderOnLeaveOfAbsenceData] = useState([]);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const { size } = useState([]);
 // const [orgSettleAccList, setOrgSettleAccList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const docId = props.match.params.id ? props.match.params.id : 0;

  const { TextArea } = Input;
  const { Option } = Select;
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      try {
        const OrderOnLeaveOfAbsence = await OrderToSendBusTripServices.getById(docId);
        const divisionLs = await HelperServices.GetDivisionList();
        //const orgSettleAccLs = await HelperServices.getOrganizationsSettlementAccountList();
       // const departmentLs = await HelperServices.getAllDepartmentList();
        //setOrderOnLeaveOfAbsenceData(OrderOnLeaveOfAbsence.data);
      //  setOrgSettleAccList(orgSettleAccLs.data);
      
        setDivisionList(divisionLs.data);
        divisionChangeHandler(OrderOnLeaveOfAbsence.data.DivisionID)
        console.log(OrderOnLeaveOfAbsence.data.DivisionID)
        setEmployeeId(OrderOnLeaveOfAbsence.data.EmployeeID)
        setLoader(false);
        form.setFieldsValue({
          ...OrderOnLeaveOfAbsence.data,
          Date: moment(OrderOnLeaveOfAbsence.data.Date, 'DD.MM.YYYY'),
          EndDate: moment(OrderOnLeaveOfAbsence.data.EndDate, 'DD.MM.YYYY'),
          BeginDate: moment(OrderOnLeaveOfAbsence.data.BeginDate, 'DD.MM.YYYY'),
        })
      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [docId, form]);
  //useffect end

  //onfinish
  const onFinish = (filterFormValues) => {
    filterFormValues.ID = docId;
    filterFormValues.EmployeeID = employeeId;
    OrderToSendBusTripServices.postData(filterFormValues)
      .then((res) => {
        if (res.status === 200) {
          history.push("/OrderToSendBusTrip");
          Notification("success", t("success-msg"));
        }
      })
      .catch((err) => {
        // console.log(err);
        Notification('error', err);
      });
  };
  //onfinish end

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };

  const getFullName = (name, EnrolmentDocumentID, ID) => {
    setEmployeeId(ID);
    //console.log(ID)
    form.setFieldsValue({ FullName: name, EnrolmentDocumentID: EnrolmentDocumentID, EmployeeID: ID });
  };

  const divisionChangeHandler = divisionId => {
    HelperServices.getDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err => Notification('error', err));
  }

  //main
  return (
    <Fade>
      <MainCard title={t("OrderToSendBusTrip")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={classes.FilterForm}
            form={form}
          >
            <Row gutter={[16, 16]}>
              <Col xl={2} lg={12}>
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
              <Col xl={2} lg={12}>
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
              <Col xl={8} lg={12}>
                <div className={classes.OrderToSendBusTripModal}>
                  {employeeModalTableVisible && (
                    <OrderToSendBusTripModal
                      visible={employeeModalTableVisible}
                      onCancel={() => setEmployeeTableVisible(false)}
                      getFullName={getFullName}
                    />
                  )}
                  <Form.Item
                    label={t('employee')}
                    name="FullName"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                  label={t("EnrolmentDocumentID")}
                  name="EnrolmentDocumentID"

                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
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
              <Col xl={2} lg={12}>
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
                  >
                    {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("DepartmentName")}
                  name="DepartmentID"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("DepartmentName")}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                   // onChange={divisionChangeHandler}
                    >
                    {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              {/* <Col xl={3} lg={12}>
                <Form.Item label={t("PaymentOrderID")}
                  name="paymentOrderID"
                  style={{ width: '100%' }}
                >
                  <Input disabled
                    style={{ color: 'black' }} />
                </Form.Item>
              </Col> */}

              {/* <Col xl={4} lg={12}>
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
              </Col> */}
              <Col xl={2} lg={12}>
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
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col xl={2} lg={12}>
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
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>
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
                  <TextArea rows={2} />
                </Form.Item>
              </Col>
              <Col xl={24} lg={24}>
                <div className={classes.Buttons}>
                  <Button
                    type="danger"
                    onClick={() => {
                      history.goBack();
                      Notification("warning", t("not-saved"));
                    }}
                  >
                    {t("back")}
                  </Button>
                  <Button type="primary" htmlType="submit">
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

//main function end

export default UpdateOrderToSendBusTripServices;
