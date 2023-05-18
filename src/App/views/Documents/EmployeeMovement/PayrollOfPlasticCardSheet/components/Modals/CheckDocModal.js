import React, { useState } from "react";
import { Modal, Form, Spin, Space, Input, Button, Typography } from "antd";
import { useTranslation } from "react-i18next";

// import { Notification } from '../../../../../../helpers/notifications';
import { Notification } from '../../../../../../../helpers/notifications';
import PayrollOfPlasticCardSheetServices from "../../../../../../../services/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/PayrollOfPlasticCardSheet.services";

const { Text } = Typography;

const CheckDocModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const checkDocHandler = (values) => {
    setLoading(true);
    PayrollOfPlasticCardSheetServices.getPaymentOrderInfo({
      PaymentOrderID: values.paymentOrderId,
      DocumentID: props.id,
      TableID: '205'
    })
      .then(res => {
        setLoading(false);
        setErrMsg(res.data);
      })
      .catch(err => {
        Notification('error', err);
        setLoading(false);
      })
  }

  return (
    <Modal
      visible={props.visible}
      title={t("plasticPaymentInfo")}
      okText={t("confirm")}
      cancelText={t("cancel")}
      onCancel={() => {
        props.onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            props.onOk(values.paymentOrderId);
          })
          .catch((err) => err);
      }}
    >
      <Spin spinning={loading}>
        <Form
          layout='vertical'
          form={form}
          initialValues={{
            paymentOrderId: props.paymentOrderId
          }}
          onFinish={checkDocHandler}
        >
          <Space align="end">
            <Form.Item
              label={t("PaymentOrderID")}
              name="paymentOrderId"
              rules={[
                {
                  required: true,
                  message: t("Please input valid"),
                },
              ]}
            >
              <Input disabled={props.paymentOrderId !== 0} placeholder={t("PaymentOrderID")} />
            </Form.Item>
            <Form.Item>
              <Button
                htmlType="submit"
                disabled={props.paymentOrderId !== 0}
              >
                {t('check')}
              </Button>
            </Form.Item>
          </Space>
        </Form>
        {errMsg && <Text type="danger">{errMsg}</Text>}
      </Spin>
    </Modal>
  );
}

export default CheckDocModal;
