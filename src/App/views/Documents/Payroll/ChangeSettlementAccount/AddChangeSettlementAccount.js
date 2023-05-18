import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Input } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import Card from "../../../../components/MainCard";
import classes from "./ChangeSettlementAccount.module.css";
import { openWarningNotification, openSuccessNotification} from "../../../../../helpers/notifications";
import CommonServices from "../../../../../services/common/common.services";
import ChangeSettlementAccountServices from "../../../../../services/Documents/Payroll/ChangeSettlementAccount/ChangeSettlementAccount.services";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { Option } = Select;

const AddChangeSettlementAccount = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();

  const [account, setAccount] = useState([]);
  const { TextArea } = Input;

  useEffect(() => {
    async function fetchData() {
      try {
        const accountLs = await CommonServices.getOrganizationsSettlementAccountList();
        setAccount(accountLs.data);
      } catch (err) {
        // console.log(err);
      }
    }
    fetchData();
  }, []);

  const onFinish = (values) => {
    values.ID = 0;
    values.Date = values.Date.format("DD.MM.YYYY");
    ChangeSettlementAccountServices.postData(values)
      .then((res) => {
        if (res.status === 200) {
          history.push("/ChangeSettlementAccount");
          openSuccessNotification("success", t("success-msg"));
        }
      })
      .catch((err) => {
        // console.log(err);
        Notification('error', err);
        // alert(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };

  return (
    <Fade bottom>
      <Card title={t("Add ChangeSettlement Account")}>
        <Form
          {...layout}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className={classes.FilterForm}
          form={form}
          initialValues={{
            Date: moment(),
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xl={8} lg={12}>
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
              <Form.Item
                label={t("OldCode")}
                name="oldOrgSettlementAccountID"
                rules={[
                  {
                    required: true,
                    message: `Please select account!`,
                  },
                ]}
              >
                <Select
                  placeholder={t("Select Account")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {account.map((account) => (
                    <Option key={account.ID} value={account.ID}>
                      {account.Code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("NewCode")}
                name="newOrgSettlementAccountID"
                rules={[
                  {
                    required: true,
                    message: `Please select account!`,
                  },
                ]}
              >
                <Select
                  placeholder={t("Select Account")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {account.map((account) => (
                    <Option key={account.ID} value={account.ID}>
                      {account.Code}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={24} lg={24}>
              <Form.Item
                label={t("Comment")}
                name="comment"
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
                    openWarningNotification("warning", t("not-saved"));
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

export default AddChangeSettlementAccount;
