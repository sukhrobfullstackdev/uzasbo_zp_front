import React, { useEffect } from "react";
import moment from 'moment';
import { Modal, Form, Input, DatePicker } from "antd";
// import { openSuccessNotification } from '../../../../../helpers/notifications';
import { useTranslation } from 'react-i18next';

// import { Notification } from '../../../../../helpers/notifications';
import classes from '../../Employee.module.scss';

const EditEducationModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    form.setFieldsValue({
      ...props.data,
      StartDate: props.data.StartDate === null ? null : moment(props.data.StartDate, 'DD.MM.YYYY'),
      EndDate: props.data.EndDate === null ? null : moment(props.data.EndDate, 'DD.MM.YYYY'),
    })
  }, [form, props.data]);

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
            values.ID = props.data.ID;
            values.key = Math.random().toString();
            values.Status = values.ID === 0 ? values.Status = 1 : values.Status = 2;
            values.EndDate = values.EndDate.format("DD.MM.YYYY");
            values.StartDate = values.StartDate.format("DD.MM.YYYY");
            let newData = [...props.tableData];
            const key = props.data.ID === 0 ? props.data.key : props.data.ID;
            const index = newData.findIndex(item => key === (item.ID === 0 ? item.key : item.ID));
            newData[index] = values;
            props.onEdit(newData);
            form.resetFields();
          })
          .catch(err => err);
      }}
    >
      <Form
        layout="vertical"
        form={form}
      >
        <Form.Item
          label={t('university')}
          name='Institution'
          rules={[
            {
              required: true,
              message: t('Please enter valid!'),
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
              message: t('Please input valid')
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
              message: t('Please input valid')
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
              getPopupContainer={trigger => trigger.parentNode}
            />
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
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode}
            />
          </Form.Item>
        </div>
        <Form.Item
          label={t('diploma')}
          name='Diploma'
          rules={[
            {
              required: true,
              message: t('Please input valid')
            },
          ]}
        >
          <Input placeholder={t('diploma')} />
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default React.memo(EditEducationModal);
