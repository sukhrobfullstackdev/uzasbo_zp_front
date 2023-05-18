import { Form, Input, Select } from 'antd';
const { Option } = Select;

const HousingTableEditableCell = ({ editing, dataIndex, title, record, index, children, subCalculationKind, status, ...restProps }) => {
  let inputNode = <Input />;
  if (dataIndex === 'SubCalculationKindID') {
    inputNode = (
      <Select
        showSearch
        style={{ width: 290 }}
        optionFilterProp="children"
      >
        {subCalculationKind.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
      </Select>
    )
  }else if (dataIndex === 'StateID') {
    inputNode = (
      <Select>
        {status.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
      </Select>
    )
  }
  
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
            width: '100%'
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default HousingTableEditableCell;