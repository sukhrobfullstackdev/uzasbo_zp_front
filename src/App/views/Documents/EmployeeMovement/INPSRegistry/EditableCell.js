import React from "react";
import { InputNumber, Form } from "antd";

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, onEnter, ...restProps}) => {

  let inputNode;

  if (dataIndex === 'INPSSum') {
    inputNode = <InputNumber
    onPressEnter={onEnter}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      parser={value => value.replace(/\$\s?|( *)/g, '')}
      data-payrollsum={dataIndex && record.TotalSum}
    />;
  }else if (dataIndex === 'VoluntarySum') {
    inputNode = <InputNumber
    onPressEnter={onEnter}
      decimalSeparator=','
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      className='edit-sum-input'
      min={0}
    />;
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
