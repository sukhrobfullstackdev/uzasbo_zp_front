import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, InputNumber, Select } from "antd";
import { useTranslation } from "react-i18next";
import HelperServices from "../../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../../helpers/notifications";

const layout = {
    labelCol: {
        span: 24,
    }
};

const { Option } = Select;

const StaffPositionAmountHeader = (props) => {

    const { t } = useTranslation();
    const [addRowForm] = Form.useForm();

    const addStaffHandler = () => {
        addRowForm.validateFields()
            .then(values => {
                console.log(values);
                values.key = Math.random();
                values.ID = 0;
                values.Status = 1;
                props.addData(values);
            })
    };

    const handleSelectionChange = (event, fullEvent) => {
        // console.log(event, fullEvent.children);
        addRowForm.setFieldsValue({
            'PositionQualificationName': fullEvent.children,
        });
    };

    return (
        <Form
            {...layout}
            form={addRowForm}
            component={false}
            initialValues={{
            }}
        >
            <tr>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('id')}
                        name='ID'
                        rules={[
                            {
                                required: false,
                                // message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <Input disabled
                            placeholder={t('0')}
                        />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('position')}
                        name='PositionID'
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
                            {props.allPositions.map((taxItem) => (
                                <Option key={taxItem.ID} value={taxItem.ID}>
                                    {taxItem.Name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('StaffListGroup')}
                        name='StaffListGroupID'
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
                            {props.staffListGroup.map((item) => (
                                <Option key={item.ID} value={item.ID}>
                                    {item.NameRus}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('PositionQualificationName')}
                        name='PositionQualificationID'
                        rules={[
                            {
                                required: true,
                                message: t("Please input valid"),
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            onSelect={handleSelectionChange}
                            placeholder={t("PositionQualificationName")}
                        >
                            {props.qualificationList.map((qual) => (
                                <Option key={qual.ID} value={qual.ID}>
                                    {qual.Name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={t("PositionQualificationName")}
                        name="PositionQualificationName"
                        hidden={true}
                    >
                        <Input />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('Amount')}
                        name='Amount'
                        rules={[
                            {
                                required: true,
                                message: t("Please input valid"),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t('Amount')}
                        />
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
    );
}

export default StaffPositionAmountHeader;