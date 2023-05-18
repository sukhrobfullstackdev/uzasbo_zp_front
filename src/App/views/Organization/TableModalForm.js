import React from "react";
import { Modal, Form, Input, Select } from "antd";
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ModalForm = ({ visible, onCancel, onCreate, banks, tableData, contractorid, state }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  let bankId;

  const onCodeBlur = (e) => {
    tableData.forEach(item => {
      if (item.code === e.target.value) {
        alert(`Duplicate code is entered: ${e.target.value}`)
        form.setFieldsValue({
          code: ''
        });
      }
    })
  }

  function onChange(event, index, value) {
    bankId = parseInt(index.key)
  }

  return (
    <Modal
      visible={visible}
      title={t('create-accounts')}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={onCancel}
      forceRender
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            values.Status = 1;
            values.id = 0;
            values.contractorid = contractorid ? contractorid : 0;
            console.log(values.stateid);
            switch (values.stateid) {
              case "Passive":
                values.stateid = 2;
                break;
              case "Active":
                values.stateid = 1;
                break;
              case "2":
                values.stateid = 2;
                break;
              case "1":
                values.stateid = 1;
                break;
              // default:
              //   return values.stateid;
            }
            values.bankid = bankId;
            tableData = values;
            console.log(tableData);
            form.resetFields();
            onCreate(tableData);
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        layout="vertical"
        form={form}
      >
        <Form.Item
          label={t('code')}
          name='code'
          rules={[
            {
              required: true,
              message: 'Please enter valid code!',
            },
          ]}>
          <Input placeholder={t('code')} onBlur={onCodeBlur} />
        </Form.Item>
        <Form.Item
          label={t('accountname')}
          name='accountname'
          rules={[
            {
              required: true,
              message: 'Please enter valid accountname',
            },
          ]}>
          <Input placeholder={t('accountname')} />
        </Form.Item>
        <Form.Item
          label={t('Banks')}
          name="bankname"
          rules={[
            {
              required: true,
              message: 'Please select Bank!',
            },
          ]}>
          <Select
            showSearch
            placeholder={t('choose')}
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            getPopupContainer={trigger => trigger.parentNode}
          >
            {banks.map(bank =>
              <Option value={bank.name} data-id={bank.id} key={bank.id}>{bank.name}</Option>
            )}
          </Select>
        </Form.Item>
        <Form.Item
          label={t('status')}
          name="StateID"
          rules={[
            {
              required: true,
            },
          ]}>
          <Select
            placeholder="Select State"
            allowClear
            getPopupContainer={trigger => trigger.parentNode}                  >
            {state.map(
              state => <Option value={state.id} key={state.id}>{state.name}</Option>)
            }
          </Select>
        </Form.Item>

      </Form>
    </Modal >
  );
};

export default ModalForm;