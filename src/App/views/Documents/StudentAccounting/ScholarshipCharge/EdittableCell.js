import React from "react";
import { InputNumber, Form, Input } from "antd";
const EditableCell = ({
    editing,
    dataIndex,
    pattern,
    title,
    inputType,
    EndPeriod,
    values,
    rules,
    index,
    children,
    onEnter,
    ...restProps
}) => {
    let inputNode;
    if (dataIndex === 'Percentage') {
        inputNode = <InputNumber
            min={0} max={1000}
            onPressEnter={onEnter}
            //  onBlur={onEnter}
            style={{ width: '50%' }}
            decimalSeparator=','
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            className='edit-sum-input'
        />;
    } else if (dataIndex === 'Sum' || dataIndex === 'OutSum') {
        inputNode = <InputNumber
            onPressEnter={onEnter}
            //  onBlur={onEnter}
            style={{ width: '50%' }}
            decimalSeparator=','
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            className='edit-sum-input'
        />
    } else if (dataIndex === 'StartPeriod') {
        inputNode = <InputNumber
            style={{ width: "100%" }}
            onPressEnter={onEnter}
            forceRender
            decimalSeparator=','
            // onBlur={onEnter}
            className='edit-sum-input'
        />
    } else if (dataIndex === 'EndPeriod') {
        inputNode = <Input
            style={{ width: "100%" }}
            onPressEnter={onEnter}
            decimalSeparator=','
            className='edit-sum-input'
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
