import React from "react";
import { InputNumber, Form } from "antd";

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  let inputNode = <InputNumber
    min={0}
    className='edit-sum-input'
    decimalSeparator=','
    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
    style={{ width: '100%' }}
  />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          // className='input-number-wrapper'
          name={dataIndex}
          style={{
            margin: 0
          }}
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
