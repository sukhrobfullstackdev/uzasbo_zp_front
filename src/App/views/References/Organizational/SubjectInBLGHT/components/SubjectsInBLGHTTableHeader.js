import React, { useState } from "react";
import { Form, Input, Button, Select, Checkbox } from "antd";
import { useTranslation } from "react-i18next";

const layout = {
    labelCol: {
        span: 24,
    }
};
const { Option } = Select;

const SubjectsInBLGHTTableHeader = (props) => {
    // console.log(props.addable);

    const { t } = useTranslation();
    const [addStaffForm] = Form.useForm();

    const addStaffHandler = () => {
        addStaffForm.validateFields()
            .then(values => {
                props.mainForm.validateFields().then(mainValues => {
                    values.key = Math.random();
                    values.ID = 0;
                    values.Status = 1;
                    props.addData(values);
                })
            })
    };

    return (
        <>
            <Form
                {...layout}
                form={addStaffForm}
                component={false}
                initialValues={{
                }}
            >
                <tr>
                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('Code')}
                            name='ID'
                            rules={[
                                {
                                    required: false,
                                    // message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <Input
                                placeholder={t('0')}
                            />
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('Subjects')}
                            name='SubjectsID'
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: true,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <Select
                                placeholder={t("Select from list")}
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {props.subjectsList.map((taxItem) => (
                                    <Option key={taxItem.ID} value={taxItem.ID}>
                                        {taxItem.NameUzb}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('IsGroup')}
                            name='IsGroup'
                            valuePropName="checked"
                            rules={[
                                {
                                    required: false,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Checkbox></Checkbox>
                            </div>
                        </Form.Item>
                    </th>
                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('ParentID')}
                            name='ParentID'
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: true,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <Select
                                placeholder={t("Select from list")}
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {props.subjectsList.map((item) => (
                                    <Option key={item.ID} value={item.ID}>
                                        {item.NameUzb}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>
                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('ForHoursGrid')}
                            name='ForHoursGrid'
                            valuePropName="checked"
                            rules={[
                                {
                                    required: false,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Checkbox></Checkbox>
                            </div>
                        </Form.Item>
                    </th>
                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('ForBillingList')}
                            name='ForBillingList'
                            valuePropName="checked"
                            rules={[
                                {
                                    required: false,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Checkbox></Checkbox>
                            </div>
                        </Form.Item>
                    </th>
                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('CanEdit')}
                            name='CanEdit'
                            valuePropName="checked"
                            rules={[
                                {
                                    required: false,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Checkbox></Checkbox>
                            </div>
                        </Form.Item>
                    </th>
                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('OpenDividedSciences')}
                            name='OpenDividedSciences'
                            valuePropName="checked"
                            rules={[
                                {
                                    required: false,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Checkbox></Checkbox>
                            </div>
                        </Form.Item>
                    </th>


                    <th className='ant-table-cell' style={{ textAlign: 'center' }}>
                        <Button
                            type='primary'
                            shape="circle"
                            icon={<i className="feather icon-plus" aria-hidden="true" />}
                            // htmlType='submit'
                            onClick={addStaffHandler}
                        />
                    </th>
                </tr >
            </Form >
        </>
    );
};

export default React.memo(SubjectsInBLGHTTableHeader);
