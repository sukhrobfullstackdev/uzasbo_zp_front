import React from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import { useTranslation } from 'react-i18next';
// import moment from 'moment';

import classes from '../../Employee.module.scss';
// import { Notification } from '../../../../../helpers/notifications';

const EducationModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      visible={props.visible}
      title={t("Образование и стаж работы")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.ID = 0;
            values.Status = 1;
            values.key = Math.random().toString();
            values.EndDate = values.EndDate.format("DD.MM.YYYY");
            values.StartDate = values.StartDate.format("DD.MM.YYYY");
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
        //   Institution: 'MIT',
        //   Faculty: 'SOCIE',
        //   Specialty: 'software engineer',
        //   StartDate: moment().subtract(30, "year"),
        //   EndDate: moment(),
        //   Diploma: 'International'
        // }}
      >
        <Form.Item
          label={t('university')}
          name='Institution'
          rules={[
            {
              required: true,
              message: t('Please input valid'),
            },
          ]}
        >
          <Input placeholder={t('university')} />
        </Form.Item>
        <Form.Item
          label={t('faculty')}
          name='Faculty'
          rules={[
            {
              required: true,
              message: t('Please input valid'),
            },
          ]}
        >
          <Input placeholder={t('faculty')} />
        </Form.Item>
        <Form.Item
          label={t('specialty')}
          name='Specialty'
          rules={[
            {
              required: true,
              message: t('Please input valid'),
            },
          ]}
        >
          <Input placeholder={t('specialty')} />
        </Form.Item>
        <div className={classes.InputsWrapper}>
          <Form.Item
            label={t('startDate')}
            name="StartDate"
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
          <Form.Item
            label={t('endDate')}
            name="EndDate"
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
          label={t('diploma')}
          name='Diploma'
          rules={[
            {
              required: true,
              message: t('Please input valid'),
            },
          ]}
        >
          <Input placeholder={t('diploma')} />
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default React.memo(EducationModal);