import React from "react";
import { InputNumber, Form, Select, Input } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const EditableCell = ({ editing, dataIndex, children, save, classList, classLetters, classLanguageList, shifts, ...restProps }) => {
  const { t } = useTranslation();

  const saveHandler = () => {
    save(restProps.record.key);
  }

  let inputNode = <InputNumber min={0} />;

  inputNode = <Input
    style={{ width: '100%' }}
    size='small'
  />

  if (dataIndex === 'ClassNumberID') {
    inputNode = <Select
      allowClear
      showSearch
      placeholder={t("ClassName")}
      style={{ width: 250 }}
      optionFilterProp="children"
      onBlur={saveHandler}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {classList.map(item => <Option key={item.ID} value={item.ID}>{item.NameUzb}</Option>)}
    </Select>
  } else if (dataIndex === 'Name'){
    inputNode = <Select
      allowClear
      showSearch
      placeholder={t("ClassName")}
      style={{ width: 250 }}
      optionFilterProp="children"
      onBlur={saveHandler}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {classLetters.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
    </Select>
  } else if (dataIndex === 'ClassLanguageID') {
    inputNode = <Select
      allowClear
      showSearch
      placeholder={t("ClassLanguageName")}
      style={{ width: 250 }}
      optionFilterProp="children"
      onBlur={saveHandler}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {classLanguageList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
    </Select>
  } else if (dataIndex === 'ShiftID') {
    inputNode = <Select
      allowClear
      showSearch
      placeholder={t("ShiftName")}
      style={{ width: 250 }}
      optionFilterProp="children"
      onBlur={saveHandler}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {shifts.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
    </Select>
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
          {/* {selectNode} */}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
