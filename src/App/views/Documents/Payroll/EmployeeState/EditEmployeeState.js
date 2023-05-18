import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { UserOutlined } from "@ant-design/icons";

import Card from "../../../../components/MainCard";
import classes from "./EmployeeState.module.css";
import { Notification } from "../../../../../helpers/notifications";
import EmployeeStateModal from "./EmployeeStateModal.js";
import CommonServices from "../../../../../services/common/common.services";
import EmployeeStateServices from "../../../../../services/Documents/Payroll/EmployeeState/EmployeeState.services";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

//main function
const EditEmployeeState = (props) => {
  const [loader, setLoader] = useState(true);
  const [EmployeeStateDate, setEmployeeStateData] = useState([]);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const { size } = useState([]);
  const [taxpayers, setTaxpayers] = useState([]);

  const { TextArea } = Input;
  const { Option } = Select;
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      try {
        const EmployeeState = await EmployeeStateServices.getById(props.match.params.id);
        const taxpayersLs = await CommonServices.getOrganizationsSettlementTaxPayerList();
        setTaxpayers(taxpayersLs.data);
        setEmployeeStateData(EmployeeState.data);
        setLoader(false);
      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [props.match.params.id]);
  //useffect end

  //onfinish
  const onFinish = (filterFormValues) => {
    filterFormValues.ID = props.match.params.id;;
    filterFormValues.EmployeeID = employeeId;
    EmployeeStateServices.postData(filterFormValues)
      .then((res) => {
        if (res.status === 200) {
          history.push("/EmployeeState");
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

  //loader
  if (loader) {
    return (
      <div className="spin-wrapper">
        <Spin size="large" />
      </div>
    );
  }
  //loader end

  const getFullName = (name, id) => {
    setEmployeeId(id);
    form.setFieldsValue({ FullName: name });
  };

  //main
  return (
    <Fade bottom>
      <Card title={t("Employee State")}>
        <Form
          {...layout}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className={classes.FilterForm}
          form={form}
          initialValues={{
            ...EmployeeStateDate,
            Date: moment(EmployeeStateDate.Date, 'DD.MM.YYYY'),
            EndDate: moment(EmployeeStateDate.EndDate, 'DD.MM.YYYY'),
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xl={6} lg={12}>
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
            <Col xl={6} lg={12}>
              <div className={classes.EmployeeStateModal}>
                {employeeModalTableVisible && (
                  <EmployeeStateModal
                    visible={employeeModalTableVisible}
                    onCancel={() => setEmployeeTableVisible(false)}
                    getFullName={getFullName}
                  />
                )}
                <Form.Item
                  label={t("employee")}
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
            <Col xl={6} lg={12}>
              <Form.Item
                label={t("TaxPayer")}
                name="EmployeeTPCID"
                rules={[
                  {
                    required: true,
                    message: `Please select TPCName!`,
                  },
                ]}
              >
                <Select
                  placeholder={t("Select TPCName")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {taxpayers.map((taxpayers) => (
                    <Option key={taxpayers.ID} value={taxpayers.ID}>
                      {taxpayers.DisplayName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={6} lg={12}>
              <Form.Item label={t("EndDate")} name="EndDate">
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
                <TextArea rows={4} />
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
      </Card>
    </Fade>
  );
};

//main function end

export default EditEmployeeState;
