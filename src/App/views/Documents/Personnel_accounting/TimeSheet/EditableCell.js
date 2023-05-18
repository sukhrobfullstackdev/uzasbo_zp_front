import React from "react";
import { InputNumber, Form } from "antd";

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  let inputNode;
  if (dataIndex === 'FactualDays' || dataIndex === 'SickDays' || dataIndex === 'LeaveDays') {
    inputNode = <InputNumber min={0} max={31} />;
  } else if (dataIndex === 'FactualHours') {
    inputNode = <InputNumber min={0} max={465} />;
  } else if (dataIndex === 'HolidayHours' || dataIndex === 'NightHours' || dataIndex === 'OverTimeHours' || dataIndex === 'HourlyWork' || dataIndex === 'RepairHours') {
    inputNode = <InputNumber min={0} max={200} />;
  }

  return (
    <td {...restProps}>
      {editing && !record.IsChecked ? (
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
