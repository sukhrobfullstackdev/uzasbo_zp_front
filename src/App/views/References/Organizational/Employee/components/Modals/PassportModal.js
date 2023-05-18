import React from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import { useTranslation } from 'react-i18next';
// import moment from 'moment';

// import { Notification } from '../../../../../helpers/notifications';
import classes from '../../Employee.module.scss';

const { Option } = Select;

const PassportModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      visible={props.visible}
      title={t("Паспортные данные")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      // forceRender
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.ID = 0;
            values.Status = 1;
            values.key = Math.random().toString();
            values.DateOfIssue = values.DateOfIssue.format("DD.MM.YYYY");
            values.DateOfExpire = values.DateOfExpire.format("DD.MM.YYYY");
            props.onCreate(values);
            form.resetFields();
          })
          .catch(err => err);
      }}
    >
      <Form
        layout="vertical"
        form={form}
        // initialValues={{
        //   Series: 'AA',
        //   Number: 8480482,
        //   DateOfIssue: moment('13.01.1999', 'DD.MM.YYYY'),
        //   DateOfExpire: moment('13.01.2022', 'DD.MM.YYYY'),
        //   Authoriry: 'Qibray',
        //   StateID: 1
        // }}
      >
        <Form.Item
          label={t('passportSeries')}
          name='Series'
          rules={[
            {
              required: true,
              pattern: /[A-Z]{2,2}$/,
              message: t("inputValidData"),
            },
          ]}>
          <Input placeholder={t('passportSeries')} maxLength={2} />
        </Form.Item>
        <Form.Item
          label={t('passportNumber')}
          name='Number'
          rules={[
            {
              required: true,
              pattern: /^[\d]{7,7}$/,
              message: t("inputValidData"),
            },
          ]}>
          <Input placeholder={t('passportNumber')} maxLength={7} />
        </Form.Item>
        <div className={classes.InputsWrapper}>
          <Form.Item
            label={t('dateOfIssue')}
            name="DateOfIssue"
            rules={[
              {
                required: true,
                message: t("Please select"),
              },
            ]}
          >
            <DatePicker
              format="DD.MM.YYYY"
              style={{ width: 150 }}
              getPopupContainer={trigger => trigger.parentNode} />
          </Form.Item>
          <Form.Item
            label={t('dateOfExpire')}
            name="DateOfExpire"
            rules={[
              {
                required: true,
                message: t('Please select'),
              },
            ]}
          >
            <DatePicker
              format="DD.MM.YYYY"
              style={{ width: 150 }}
              getPopupContainer={trigger => trigger.parentNode} />
          </Form.Item>
        </div>
        <Form.Item
          label={t('authority')}
          name='Authoriry'
          rules={[
            {
              required: true,
              message: t("Please input valid"),
            },
          ]}>
          <Input placeholder={t('authority')} />
        </Form.Item>
        <Form.Item
          label={t('Please select')}
          name="StateID"
          rules={[
            {
              required: true,
            },
          ]}>
          <Select
            placeholder={t('Please select')}
            getPopupContainer={trigger => trigger.parentNode}>
            {props.status.map(
              status => <Option value={status.ID} key={status.ID}>{status.Name}</Option>
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default React.memo(PassportModal);