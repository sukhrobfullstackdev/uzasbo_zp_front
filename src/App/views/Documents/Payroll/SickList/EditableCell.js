import React from "react";
import { InputNumber, Form } from "antd";
// import { useTranslation } from "react-i18next";

const EditableCell = ({ editing, dataIndex, expensesList, children, ...restProps }) => {
  // const { t } = useTranslation();
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
