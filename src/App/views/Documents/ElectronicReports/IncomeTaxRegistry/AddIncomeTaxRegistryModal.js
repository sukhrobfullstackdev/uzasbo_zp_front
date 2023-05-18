import React from "react";
import { Modal, Select, Row, Col, Form, InputNumber } from "antd";
import moment from 'moment';
import { useTranslation } from "react-i18next";

import { Notification } from '../../../../../helpers/notifications';
import IncomeTaxRegistryServices from "../../../../../services/Documents/ElectronicReports/IncomeTaxRegistry/IncomeTaxRegistry.services";
import classes from "./IncomeTaxRegistry.module.css";

const { Option } = Select;

const AddIncomeTaxRegistryModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      // visible={props.addVisible}
      visible={props.visible}
      title={t("IncomeTaxRegistry")}
      okText={t("save")}
      cancelText={t("cancel")}
      width={600}
      onCancel={() => {
        props.onCancel();
        form.resetFields();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            values.ID = 0;
            IncomeTaxRegistryServices.postData(values)
            .then(res => {
              if (res.status === 200) {
                Notification('success', 'added');
              }
            })
            .catch((err)=>{
              Notification('error', err);
            })
           
            props.onCancel();
            // props.onCreate(values);
            form.resetFields();
          })
          .catch((info) => {
            Notification('error', info);
            // console.log('Validate Failed:', info);
          });
        }}
    >
      <Form
        form={form}
        initialValues={{
          FinanceYear: moment().year()
        }}>
        <Row gutter={[16, 16]}>
          <Col xl={12} lg={16}>
            <Form.Item label={t("FinanceYear")} name="FinanceYear">
              <InputNumber className={classes['year-input']} />
            </Form.Item>
          </Col>
          <Col xl={12} lg={16}>
            <Form.Item
              label={t("select")}
              name="MonthIncomeTax"
              rules={[
                {
                  required: true,
                  message: t("pleaseSelect"),
                },
              ]}>
              <Select placeholder={t("select")}>
                <Option value="1">{t('january')}</Option>
                <Option value="2">{t('february')}</Option>
                <Option value="3">{t('march')}</Option>
                <Option value="4">{t('april')}</Option>
                <Option value="5">{t('may')}</Option>
                <Option value="6">{t('june')}</Option>
                <Option value="7">{t('july')}</Option>
                <Option value="8">{t('august')}</Option>
                <Option value="9">{t('september')}</Option>
                <Option value="10">{t('october')}</Option>
                <Option value="11">{t('november')}</Option>
                <Option value="12">{t('december')}</Option> 
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddIncomeTaxRegistryModal;
