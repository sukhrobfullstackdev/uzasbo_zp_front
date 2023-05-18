import React from "react";
import { Form, Select, Input, Button, InputNumber, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const { Option } = Select;
const layout = {
    labelCol: {
        span: 24,
    }
};

const QualCategoryTableHeader = (props) => {
    const { t } = useTranslation();
    const [headerForm] = Form.useForm();
    const [subjectName, setSubjectName] = useState('');
    const [posQualName, setPosQualName] = useState('');

    const addDataHandler = () => {
        headerForm.validateFields()
            .then(values => {
                values.key = Math.random().toString();
                values.ID = 0;
                values.Status = 1;
                values.DateOfIssue = values.DateOfIssue.format("DD.MM.YYYY");
                values.ExpireDate = values.ExpireDate.format("DD.MM.YYYY");
                values.SubjectName = subjectName;
                values.PositionQualificationName = posQualName;
                props.addData(values);
            })
            .catch(err => {
                return err;
            })
    }

    const subjectsChangeHandler = (_, data) => {
        setSubjectName(data.children);
    }

    const posQualChangeHandler = (_, data) => {
        setPosQualName(data.children);
    }

    return (
        <Form
            {...layout}
            form={headerForm}
            component={false}
        >
            <tr>
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
                            {props.subjects.map(item => <Option key={item.ID} value={item.SubjectsID}>{item.NameUzb}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('PositionQualification')}
                        name='PositionQualificationID'
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
                            placeholder={t("PositionQualification")}
                            style={{ width: '100%' }}
                            optionFilterProp="children"
                            onChange={posQualChangeHandler}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {props.posQualList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('passportSeries')}
                        name='Series'
                        rules={[
                            {
                                required: true,
                                message: t("inputValidData"),
                            },
                        ]}
                    >
                        <Input placeholder={t('passportSeries')} style={{ width: '100%' }} />
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
                                message: t("inputValidData"),
                            },
                        ]}
                    >
                        <Input placeholder={t('Number')} style={{ width: '100%' }} />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('dateOfIssue')}
                        name='DateOfIssue'
                        rules={[
                            {
                                required: true,
                                message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <DatePicker
                            format="DD.MM.YYYY"
                            placeholder={t('dateOfIssue')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('dateOfExpire')}
                        name='ExpireDate'
                        rules={[
                            {
                                required: true,
                                message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <DatePicker
                            format="DD.MM.YYYY"
                            placeholder={t('dateOfExpire')}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Button
                        type='primary'
                        shape="circle"
                        icon={<i className="fa fa-plus" aria-hidden="true" />}
                        htmlType='submit'
                        onClick={addDataHandler}
                    />
                </th>
            </tr>
        </Form >
    );
};

export default React.memo(QualCategoryTableHeader);
