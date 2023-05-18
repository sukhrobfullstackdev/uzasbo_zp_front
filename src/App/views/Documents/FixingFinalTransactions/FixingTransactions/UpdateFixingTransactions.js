import React, { useState, useEffect } from 'react';
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, InputNumber, Space } from "antd";
import moment from 'moment';
import { CSSTransition } from 'react-transition-group';

import Card from "../../../../components/MainCard";
import FixingTransactionServices from "../../../../../services/Documents/FixingFinalTransactions/FixingTransaction/FixingTransaction.services";
import SubAccServices from "../../../../../services/References/Organizational/SubAcc/SubAcc.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../helpers/notifications";
import SubCountDb1Modal from './SubCountDb1Modal';
// import classes from './SalaryCalculation.module.css';

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

const UpdateFixingTransaction = (props) => {
  const [loader, setLoader] = useState(true);
  const [subAccList, setSubAccList] = useState([]);
  const [orgSetAccList, setOrgSetAccList] = useState([]);

  const [subCountDb1ModalVisible, setSubCountDb1ModalVisible] = useState(false);
  // const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);

  const { t } = useTranslation();
  const [mainForm] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const [fixingTrans, subAccLs, orgSetAccLs] = await Promise.all([
        FixingTransactionServices.getById(props.match.params.id ? props.match.params.id : 0),
        SubAccServices.getAll(),
        HelperServices.getOrganizationsSettlementAccountList()
      ]);
      if (props.match.params.id) {

      }
      setSubAccList(subAccLs.data.rows);
      setOrgSetAccList(orgSetAccLs.data);
      mainForm.setFieldsValue({
        ...fixingTrans.data,
        Date: moment(fixingTrans.data.Date, 'DD.MM.YYYY'),
      });
      setLoader(false);
    }

    fetchData().catch(err => {
      Notification('error', err);
      setLoader(false);
    });
  }, [props.match.params.id, mainForm]);

  const onMainFormFinish = (values) => {
    // values.ID = docId;
    // values.SubCalculationKindID = subCalcId ? subCalcId : salaryCalc.SubCalculationKindID;
    values.Date = values.Date.format("DD.MM.YYYY");
    setLoader(true);
    FixingTransactionServices.update(values)
      .then((res) => {
        if (res.status === 200) {
          setLoader(false);
          history.push(`/SalaryCalculation`);
          Notification('success', t('success-msg'));
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  }

  const getModalData = (name, id) => {
    // setSubCalcId(id);
    // mainForm.setFieldsValue({ SubCalculationKindName: name });
  };

  // let fillBtnVisible = true;
  // if (salaryCalc.StatusID === 2 || salaryCalc.StatusID === 6 || salaryCalc.StatusID === 8 || salaryCalc.StatusID === 12) {
  //   fillBtnVisible = false;
  // }

  return (
    <Fade>
      <Card title={t("fixingTransactions")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id="mainForm"
            onFinish={onMainFormFinish}
          >
            <Row gutter={[15, 0]}>
              <Col xl={3} lg={12}>
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
              <Col xl={3} lg={12}>
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
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} placeholder={t("date")} />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("Sum")}
                  name="Sum"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder={t("Sum")} />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("count")}
                  name="Count"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder={t("Count")} />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("MemorialOrderNumber")}
                  name="MemorialOrderNumber"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <InputNumber style={{ width: "100%" }} placeholder={t("MemorialOrderNumber")} />
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("subAccDb")}
                  name="SubAccDbID"
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
                    placeholder={t("subAccDb")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {subAccList.map((item) => (
                      <Option key={item.ID} value={item.ID}>
                        {item.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("organizationsSettlementAccountDb")}
                  name="organizationsSettlementAccountDbID"
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
                    placeholder={t("organizationsSettlementAccountDb")}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {orgSetAccList.map((item) => (
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
                <CSSTransition
                  mountOnEnter
                  unmountOnExit
                  in={subCountDb1ModalVisible}
                  timeout={300}
                >
                  <SubCountDb1Modal
                    visible={subCountDb1ModalVisible}
                    onCancel={() => setSubCountDb1ModalVisible(false)}
                    getModalData={getModalData}
                  />
                </CSSTransition>

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
                      placeholder={t('SubCalculationKindName')}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      setSubCountDb1ModalVisible(true);
                    }}
                    style={{ marginTop: 16 }}
                    icon={<i className="fas fa-calculator"></i>}
                  />
                </Space>
              </Col>
            </Row>
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
            >
              {t("save")}
            </Button>
          </Space>
        </Spin>
      </Card>
    </Fade>
  );
};

export default UpdateFixingTransaction;