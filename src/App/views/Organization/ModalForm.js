import React from "react";
import { Modal, Form, Input, Select } from "antd";
import { openSuccessNotification } from '../../../../helpers/notifications';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const ModalForm = ({ visible, onCancel, onCreate, tableData, clicked, edit, contractorid, banks, state }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  let bankId;

  const filteredData = tableData.filter((item) => {
    return (item.code === clicked);
  })

  let itemIndex;
  tableData.forEach((item, index) => {
    if (item.code === clicked) {
      itemIndex = index
    }
  })
  
  if (clicked && filteredData.length !== 0) {
    let status;
    if (filteredData[0].stateid === '1' || filteredData[0].stateid === 1) {
      status = 'Active'
    } else if (filteredData[0].stateid === '2' || filteredData[0].stateid === 2) {
      status = 'Passive'
    }
    form.setFieldsValue({
      code: filteredData[0].code,
      bankname: filteredData[0].bankname,
      accountname: filteredData[0].accountname,
      stateid: status,
    });
  }
  const onCodeBlur = (e) => {
    tableData.forEach(item => {
      if (item.code === e.target.value) {
        alert(`Duplicate code is entered: ${e.target.value}`)
        form.setFieldsValue({
          code: filteredData[0].code
        });
      }
    })
  }
  return (
    <Modal
      visible={visible}
      title={t('edit-accounts')}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            values.Status = 1;
            values.id = 0;
            values.contractorid = 0;
            if (edit) {
              values.Status = filteredData[0].Status === 1 ? filteredData[0].Status : 2;
              values.id = filteredData[0].id === 0 ? 0 : filteredData[0].id;
              values.contractorid = parseInt(contractorid) === 0 ? 0 : parseInt(contractorid);
            }
            if (values.stateid === "Пассив" || values.stateid === "Пассив" || values.stateid === "Пассив" || values.stateid === "2") {
              values.stateid = 2
            } else if (values.stateid === "Актив" || values.stateid === "Актив" || values.stateid === "Актив" || values.stateid === "1") {
              values.stateid = 1
            }
            values.bankid = bankId ? bankId : filteredData[0].bankid;
            tableData[itemIndex] = values

            // for adding new data
            if (itemIndex === undefined) {
              tableData = [values]
            }
            form.resetFields();
            onCreate(tableData);
            openSuccessNotification('success', 'edited')
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
          name={'code'}
          rules={[
            {
              required: true,
              message: 'Please enter valid Code!',
            },
          ]}
        >
          <Input placeholder={t('code')} onBlur={onCodeBlur} />
        </Form.Item>
        <Form.Item
          label={t('accountname')}
          name='accountname'
          rules={[
            {
              required: true,
              message: 'Please enter valid Account name!',
            },
          ]}
        >
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
            getPopupContainer={trigger => trigger.parentNode}
          >
            {banks.map(bank =>
              <Option value={bank.name} data-id={bank.id} key={bank.id}>{bank.name}</Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('status')}
          name="stateid"
          rules={[
            {
              required: true,
              message: 'Please select Status!',
            },
          ]}>
        <Select
         placeholder={t("Select State")}
         showSearch        
         optionFilterProp="children"
         filterOption={(input, option) =>
           option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
         }
         getPopupContainer={trigger => trigger.parentNode}     
          >
            {state.map(state =>
              <Option value={state.id} key={state.id}>{state.name}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default ModalForm;