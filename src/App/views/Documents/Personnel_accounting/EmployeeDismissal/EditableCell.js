import React from "react";
import { InputNumber, Form, Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const EditableCell = ({ editing, dataIndex, expensesList, children, ...restProps }) => {
  const { t } = useTranslation();
  let inputNode = <InputNumber min={0} />;

  if (dataIndex === 'LeaveSum') {
    inputNode = <InputNumber
      min={0}
      max={999999995904}
      className='edit-sum-input'
      style={{ width: '100%' }}
      size='small'
      decimalSeparator=','
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
    />
  } else if (dataIndex === 'ItemOfExpensesID') {
    inputNode = (
      <Select
        allowClear
        showSearch
        size='small'
        placeholder={t("ItemOfExpensesName")}
        style={{ width: 120 }}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {expensesList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
      </Select>
    )
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          className='input-number-wrapper'
          name={dataIndex}
          style={{
            margin: 0
          }}
        // rules={[
        //   {
        //     required: true,
        //     message: dataIndex === 'LeaveSum' ? t('inputValidData') : t('pleaseSelect'),
        //   },
        // ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
