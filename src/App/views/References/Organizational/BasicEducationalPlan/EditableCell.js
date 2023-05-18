import React from "react";
import { InputNumber, Form } from "antd";

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, onEnter, ...restProps }) => {
  const round = (number, decimalPlaces) => {
    const factorOfTen = Math.pow(10, decimalPlaces)
    return Math.round(number * factorOfTen) / factorOfTen
  }

  const percentBlurHandler = e => {
    const percent = +e.target.value > 100 ? 100 : +e.target.value;
    const fullPayrollSum  = +e.target.dataset.payrollsum;
    const roundedPayrollSum = round(fullPayrollSum, 0);
    const remainderPayrollSum = +(fullPayrollSum - roundedPayrollSum).toFixed(2);
    const sum = roundedPayrollSum * (percent / 100);
    if (percent === 0) {
      restProps.tableform.setFieldsValue({ Sum: 0 });
      return;
    }
    if (restProps.roundingtype === 2) {
      restProps.tableform.setFieldsValue({ Sum: round(sum, 0) });
    } else if (restProps.roundingtype === 3) {
      restProps.tableform.setFieldsValue({ Sum: round(sum, -1) });
    } else if (restProps.roundingtype === 4) {
      restProps.tableform.setFieldsValue({ Sum: round(sum, -2) });
    } else if (restProps.roundingtype === 5) {
      restProps.tableform.setFieldsValue({ Sum: round(sum, -3) });
    } else {
      restProps.tableform.setFieldsValue({ Sum: round(sum, 0) + remainderPayrollSum });
    }
  }

  let inputNode;

  if (dataIndex === 'Percentage') {
    inputNode = <InputNumber
      min={0}
      max={100}
      onBlur={percentBlurHandler}
      style={{ width: '50px' }}
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      parser={value => value.replace(/\$\s?|( *)/g, '')}
      data-payrollsum={dataIndex && record.PayrollSum}
    />;
  } else if (dataIndex === 'Sum') {
    inputNode = <InputNumber
      decimalSeparator=','
      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
      // parser={value => value.replace(/\$\s?|( *)/g, '')}
      // style={{ width: '40px' }}
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
