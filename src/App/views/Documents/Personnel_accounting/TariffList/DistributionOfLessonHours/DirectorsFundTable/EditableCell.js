import React from "react";
import { Form, InputNumber, Select } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const EditableCell = ({ editing, dataIndex, children, save, posQualList, ...restProps }) => {
  const { t } = useTranslation();

  let inputNode = (
    <InputNumber
      style={{ width: '100%' }}
    />
  );

  if (dataIndex === 'PositionQualificationID') {
    inputNode = (
      <Select
        allowClear
        showSearch
        placeholder={t("PositionQualification")}
        style={{ width: '100%' }}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {posQualList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
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
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default React.memo(EditableCell);
