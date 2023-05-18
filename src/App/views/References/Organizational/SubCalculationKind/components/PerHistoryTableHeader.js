import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

const layout = {
    labelCol: {
        span: 24,
    }
};

const PerHistoryTableHeader = (props) => {

    const [Date, setDate] = useState(null);

    const { t } = useTranslation();
    const [addeRowForm] = Form.useForm();

    const addStaffHandler = () => {
        addeRowForm.validateFields()
            .then(values => {
                console.log(values);
                values.key = Math.random();
                values.ID = 0;
                values.Status = 1;
                values.Date = Date;
                props.addData(values);
            })
    };

    useEffect(() => {

    }, []);

    const onChangeDate = (date, dateString) => {
        setDate(dateString);
    };

    return (
        <Form
            {...layout}
            form={addeRowForm}
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
                        label={t('date')}
                        name='Date'
                        rules={[
                            {
                                required: true,
                                message: t("Please input valid"),
                            },
                        ]}
                    >
                        <DatePicker
                            format="DD.MM.YYYY" style={{ width: '100%' }}
                            placeholder={t('Date')} onChange={onChangeDate}
                        />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('percent')}
                        name='Percentage'
                        rules={[
                            {
                                required: true,
                                message: t("Please input valid"),
                            },
                        ]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0} max={100}
                            formatter={value => `${value}%`}
                            parser={value => value.replace('%', '')}
                            placeholder={t('percent')}
                        />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('Sum')}
                        name='Sum'
                        rules={[
                            {
                                required: true,
                                message: t("Please input valid"),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t('Sum')}
                        />
                    </Form.Item>
                </th>
                <th className='ant-table-cell'>
                    <Form.Item
                        label={t('NormativeAct')}
                        name='NormativeAct'
                        rules={[
                            {
                                required: true,
                                message: t("Please input valid"),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t('NormativeAct')}
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
};

export default PerHistoryTableHeader;