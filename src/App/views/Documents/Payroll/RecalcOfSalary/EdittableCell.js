import React from "react";
import { InputNumber, Form} from "antd";

const EditableCell = ({
    editing,
    dataIndex,
    pattern,
    title,
    inputType,
    values,
    rules,
    tableForm,
    index,
    children,
    onEnter,
    ...restProps
}) => {

    // const setSum = e => {
    //   let sum = +e.target.value + +tableForm.getFieldsValue('Sum');
    //   tableForm.setFieldsValue({
    //       Sum: sum
    //   })
    // }

    // const totalSum  = () =>{

    // }

    let inputNode;
    if (dataIndex === 'Sum' || dataIndex === 'OutSum') {
        inputNode = <InputNumber
            onPressEnter={onEnter}
            //  onBlur={onEnter}
            style={{ width: '100%' }}
            decimalSeparator=','
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            className='edit-sum-input'
            // onChange={totalSum}
        />
    } 
   // const { getFieldDecorator } = this.props.form;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                dataIndex={dataIndex.EndPeriod ? dataIndex.EndPeriod : rules =/^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$/ }
               // EndPeriod={dataIndex.EndPeriod ? dataIndex.EndPeriod : rules [pattern=/^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$/] }
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
