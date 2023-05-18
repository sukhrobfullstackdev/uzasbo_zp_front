import React from "react";
import { Modal, Form, InputNumber } from "antd";
import { useTranslation } from 'react-i18next';

const PhoneNumCleanerModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      width={400}
      visible={props.visible}
      title={t("cleaningPhoneNum")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            props.onCancel(values);
          })
          .catch(err => err);
      }}
    >
      <Form
        layout="vertical"
        form={form}
      >
        <Form.Item
          label={t('employeeId')}
          name='ID'
          rules={[
            {
              required: true,
              message: t("inputValidData"),
            },
          ]}
        >
          <InputNumber placeholder={t('employeeId')} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default PhoneNumCleanerModal;