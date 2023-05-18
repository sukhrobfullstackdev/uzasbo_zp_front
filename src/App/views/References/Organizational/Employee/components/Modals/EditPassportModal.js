import React, { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import classes from '../../Employee.module.scss';
// import { Notification } from '../../../../../helpers/notifications';

const { Option } = Select;

const EditPassportModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    form.setFieldsValue({
      ...props.data,
      DateOfIssue: props.data.DateOfIssue === null ? null : moment(props.data.DateOfIssue, 'DD.MM.YYYY'),
      DateOfExpire: props.data.DateOfExpire === null ? null : moment(props.data.DateOfExpire, 'DD.MM.YYYY'),
    })
  }, [form, props.data]);

  return (
    <Modal
      visible={props.visible}
      title={t("Паспортные данные")}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.ID = props.data.ID;
            values.key = Math.random().toString();
            values.Status = values.ID === 0 ? values.Status = 1 : values.Status = 2;
            values.DateOfIssue = values.DateOfIssue.format("DD.MM.YYYY");
            values.DateOfExpire = values.DateOfExpire.format("DD.MM.YYYY");
            const newData = [...props.tableData];
            const key = props.data.ID === 0 ? props.data.key : props.data.ID;
            const index = newData.findIndex(item => key === (item.ID === 0 ? item.key : item.ID));
            newData[index] = values;
            // console.log(values);
            // if (itemIndex === undefined) {
            //   newData = [values]
            // }
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
              message: t("Please input valid"),
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
                message: t("Please input valid"),
              },
            ]}>
            <DatePicker
              format="DD.MM.YYYY"
              style={{ width: 150 }}
              getPopupContainer={trigger => trigger.parentNode}
            />
          </Form.Item>
          <Form.Item
            label={t('dateOfExpire')}
            name="DateOfExpire"
            rules={[
              {
                required: true,
                message: t("Please input valid"),
              },
            ]}>
            <DatePicker
              format="DD.MM.YYYY"
              style={{ width: 150 }}
              getPopupContainer={trigger => trigger.parentNode}
            />
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
          label={t('status')}
          name="StateID"
          rules={[
            {
              required: true,
              message: t("pleaseSelect"),
            },
          ]}>
          <Select
            allowClear
            placeholder="Select Status"
            getPopupContainer={trigger => trigger.parentNode}
          >
            {props.status.map(
              status => <Option value={status.ID} key={status.ID}>{status.Name}</Option>
            )}
          </Select>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default React.memo(EditPassportModal);
