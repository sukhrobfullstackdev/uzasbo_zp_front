import React, { useState } from "react";
import { Form, Select, Input, Button, Switch } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 24,
  }
};

const ClassTableHeader = (props) => {
  const { t } = useTranslation();
  const [addClassForm] = Form.useForm();
  const [specialDisable, setSpecialDisable] = useState(true);

  const onChange = (value) => {
    if (value === true) {
      setSpecialDisable(false);
    } else {
      setSpecialDisable(true);
    }
  }

  const addClassHandler = () => {
    addClassForm.validateFields()
      .then(values => {
        values.key = Math.random().toString();
        values.ID = 0;
        values.Status = 1;
        props.addData(values);
      })
  }

  return (
    <Form
      {...layout}
      form={addClassForm}
      component={false}
    // classLetters={classLetters}
    >
      <tr>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('ClassName')}
            name='ClassNumberID'
            rules={[
              {
                required: true,
                message: t("pleaseSelect"),
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder={t("ClassName")}
              // style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              disabled
            >
              {props.classList.map(item => <Option key={item.ID} value={item.ID}>{item.NameUzb}</Option>)}
            </Select>
          </Form.Item>
        </th>
        <th className='ant-table-cell'>
          <Form.Item
            label={t('ClassName')}
            name='Name'
            rules={[
              {
                required: true,
                message: t("pleaseSelect"),
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder={t("ClassName")}
              // style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              disabled
            >
              {props.classLetters.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>
        </th>

        <th className='ant-table-cell' style={{ width: 200 }}>
          <Form.Item
            label={t('ChildrenCount')}
            name='ChildrenCount'
            // rules={[
            //   {
            //     required: true,
            //     message: t("inputValidData"),
            //   },
            // ]}
          >
            <Input placeholder={t('ChildrenCount')} style={{ width: '100%' }} disabled/>
          </Form.Item>
        </th>

        <th className='ant-table-cell' style={{ width: 200 }} >
          <Form.Item
            label={t('FemaleCount')}
            name='FemaleCount'
            // rules={[
            //   {
            //     required: true,
            //     message: t("inputValidData"),
            //   },
            // ]}
          >
            <Input placeholder={t('FemaleCount')}
            // style={{ width: '100%' }}
            disabled
            />
          </Form.Item>
        </th>

        <th className='ant-table-cell' style={{ width: 250 }} >
          <Form.Item
            label={t('TeachingAtHomeCount')}
            name='TeachingAtHomeCount'
            // width={180}
            // rules={[
            //   {
            //     required: true,
            //     message: t("inputValidData"),
            //   },
            // ]}
          >
            <Input placeholder={t('TeachingAtHomeCount')}
            disabled
            />
          </Form.Item>
        </th>

        <th className='ant-table-cell' style={{ width: 200 }}>
          <Form.Item
            label={t('ClassLanguageName')}
            name='ClassLanguageID'
            rules={[
              {
                required: true,
                message: t("pleaseSelect"),
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder={t("ClassLanguageName")}
              // style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              disabled
            >
              {props.classLanguageList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
            </Select>
          </Form.Item>
        </th>

        <th className='ant-table-cell'>
          <Form.Item
            label={t('ShiftName')}
            name='ShiftID'
            rules={[
              {
                required: true,
                message: t("pleaseSelect"),
              },
            ]}
          >
            <Select
              allowClear
              showSearch
              placeholder={t("ShiftName")}
              // style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              disabled
            >
              {props.shifts.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>
        </th>

        <th className='ant-table-cell'>
          <Form.Item
            label={t('IsSpecialized')}
            name='IsSpecialized'
            valuePropName="checked"
          >
            <Switch onChange={onChange} disabled/>
          </Form.Item>
        </th>

        <th className='ant-table-cell' style={{ width: 200 }}>
          <Form.Item
            label={t("SpecializedSubjects")}
            name="SpecializedSubjectsID"
          >
            <Select
              mode="multiple"
              allowClear
              disabled={specialDisable}
              showSearch
              placeholder={t("SpecializedSubjects")}
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              disabled
            >
              {props.specializedSubjectsList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
            </Select>
          </Form.Item>
        </th>

        <th className='ant-table-cell'>
          <Button
            shape="circle"
            icon='+'
            type='submit'
            onClick={addClassHandler}
            disabled
          />
        </th>
      </tr >
    </Form>
  );
};

export default ClassTableHeader;
