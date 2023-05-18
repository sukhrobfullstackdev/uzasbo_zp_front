import React, { useState } from "react";
import { Form, Select, Button, InputNumber, Input } from "antd";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const layout = {
    labelCol: {
        span: 24,
    }
};

const DiplomaTableHeader = (props) => {
    const [subjectName, setSubjectName] = useState('');
    const [specialityName, setSpecialityName] = useState('');

    const { t } = useTranslation();
    const [addHoursForm] = Form.useForm();

    const addStaffHandler = () => {
        addHoursForm.validateFields()
            .then(values => {
                values.key = Math.random().toString();
                values.ID = 0;
                values.Status = 1;
                values.Speciality = specialityName;
                values.SubjectName = subjectName;
                props.addData(values);
            })
            .catch(err => {
                return err;
            })
    }

    const specialityChangeHandler = (_, data) => {
        setSpecialityName(data.children);
    }
    const subjectsChangeHandler = (_, data) => {
        setSubjectName(data.children);
    }

    return (
        <Form
            {...layout}
            form={addHoursForm}
            component={false}
            initialValues={{
            }}
        >
            <tr>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('Series')}
                        name='Series'
                        rules={[
                            {
                                required: true,
                                message: t("PleaseFill"),
                            },
                        ]}
                    >
                        <Input placeholder={t('Series')} />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('Number')}
                        name='Number'
                        rules={[
                            {
                                required: true,
                                pattern: /^\d+$/,
                                message: t("PleaseFill"),
                            },
                        ]}
                    >
                        <Input placeholder={t('Number')} style={{ width: '100%' }}/>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('Speciality')}
                        name='SpecialityID'
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
                            placeholder={t("Speciality")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={specialityChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.diplomaSpecialityList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('SubjectName')}
                        name='SubjectID'
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
                            placeholder={t("SubjectName")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={subjectsChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.subjectsInBLHGT.map(item => <Option key={item.ID} value={item.SubjectsID}>{item.SubjectsName}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Button
                        type='primary'
                        shape="circle"
                        icon={<i className="fa fa-plus" aria-hidden="true" />}
                        htmlType='submit'
                        onClick={addStaffHandler}
                    />
                </th>
            </tr>
        </Form >
    );
};

export default React.memo(DiplomaTableHeader);
