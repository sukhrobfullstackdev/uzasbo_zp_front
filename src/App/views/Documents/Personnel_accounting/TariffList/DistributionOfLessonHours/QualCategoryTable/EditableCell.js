import React from "react";
import { Form, InputNumber, Select, Input, DatePicker } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const EditableCell = ({ editing, dataIndex, children, save, posQualList, subjects, ...restProps }) => {
  const { t } = useTranslation();

  let inputNode = (
    <InputNumber
      style={{ width: '100%' }}
    />
  );

  if (dataIndex === 'SubjectID') {
    inputNode = (
      <Select
        allowClear
        showSearch
        placeholder={t("SubjectName")}
        style={{ width: '100%' }}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {subjects.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
      </Select>
    )
  } else if (dataIndex === 'PositionQualificationID') {
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
  } else if (dataIndex === 'Series') {
    inputNode = (
      <Input placeholder={t('Series')} style={{ width: '100%' }} />
    )
  } else if (dataIndex === 'DateOfIssue' || dataIndex === 'ExpireDate') {
    inputNode = (
      <DatePicker
        format="DD.MM.YYYY"
        placeholder={t(dataIndex)}
        style={{ width: '100%' }}
      />
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
