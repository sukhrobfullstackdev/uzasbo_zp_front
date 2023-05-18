import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import Card from "../../../../components/MainCard";
import classes from "./ChangeSettlementAccount.module.css";
import {openWarningNotification,openSuccessNotification} from "../../../../../helpers/notifications";
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

//main function
const EditChangeSettlementAccount = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [loader, setLoader] = useState(true);
  const [ChangeSettlementAccountData, setChangeSettlementAccountData] =
    useState([]);

  const [account, setAccount] = useState([]);
  const { TextArea } = Input;

  useEffect(() => {
    async function fetchData() {
      try {
        const ChangeSettlementAccount =
          await ChangeSettlementAccountServices.getById(props.match.params.id);
        const accountLs =
          await CommonServices.getOrganizationsSettlementAccountList();
        setChangeSettlementAccountData(ChangeSettlementAccount.data);
        setAccount(accountLs.data);
        setLoader(false);
        //  
      } catch (err) {
        Notification('error', err);
        // console.log(err);
      }
    }
    fetchData();
  }, [props.match.params.id]);
  //useffect end

  //onfinish
  const onFinish = (values) => {
    values.ID = props.match.params.id;
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

  //main
  return (
    <Fade bottom>
      <Card title={t("Edit ChangeSettlement Account")}>
        <Form
          {...layout}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className={classes.FilterForm}
          form={form}
          initialValues={{
            ...ChangeSettlementAccountData,
            Date: moment(ChangeSettlementAccountData.Date, 'DD.MM.YYYY')
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
                name="OldOrgSettlementAccountID"
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
                name="NewOrgSettlementAccountID"
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

//main function end

export default EditChangeSettlementAccount;
