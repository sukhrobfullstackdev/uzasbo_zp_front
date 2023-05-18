import React from "react";
import { InputNumber, Form } from "antd";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  onEnter,
  ...restProps
}) => {
  let inputNode = <InputNumber
    onPressEnter={onEnter}
    onBlur={onEnter}
    min={0}
    max={100000000000}
    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
    parser={value => value.replace(/\$\s?|( *)/g, '')}
    className='edit-sum-input'
    autoFocus
  // style={{textAlign: 'right', width: '160px'}}
  />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          className='input-number-wrapper'
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
