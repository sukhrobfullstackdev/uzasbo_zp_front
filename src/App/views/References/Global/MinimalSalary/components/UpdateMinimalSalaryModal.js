import React, { useEffect } from 'react'
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row } from 'antd'
import { useTranslation } from 'react-i18next';
import moment from "moment";
import MinimalSalaryServices from '../../../../../../services/References/Global/MinimalSalary/MinimalSalary.services';
import { Notification } from '../../../../../../helpers/notifications';

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const UpdateMinimalSalaryModal = (props) => {
    console.log(props);
    
    const { ID, Date, MinimalSalary, ChangePercentage, NormativeAct } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    // useEffect(() => {
        
    //     mainForm.setFieldsValue({
    //         ...props.data,
    //     });
    // }, [props.data, mainForm]);

    const onMainFormFinish = (values) => {
        // console.log({ ID, ...values });
        values.Date = values.Date?.format("DD.MM.YYYY");
        MinimalSalaryServices.postData({ ID, ...values })
            .then((res) => {
                // console.log(res.data);
                Notification('success', t('edited'));
                props.onCancel();
                props.fetch();
            }).catch((err) => {
                Notification('error', err)
            })
    };

    return (
        <Modal
            title={t("MinimalSalary")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    type="primary"
                    form='mainForm'
                    htmlType="submit"
                // onClick={selectRow}
                >
                    {t("save")}
                </Button>,
            ]}
        >
            <Form
                {...layout}
                form={mainForm}
                id="mainForm"
                onFinish={onMainFormFinish}
                initialValues={{
                    Date: Date ? moment(Date, "DD.MM.YYYY") : null,
                    MinimalSalary: MinimalSalary,
                    ChangePercentage: ChangePercentage,
                    NormativeAct: NormativeAct,
                }}
            >
                <Row gutter={[15, 0]}>
                    <Col span={12} md={8}>
                        <Form.Item
                            label={t("date")}
                            name="Date"
                            rules={[
                                {
                                    required: true,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD.MM.YYYY" className='datepicker'
                                // onChange={onChangeDate}
                                placeholder={t('QuantityOfMinimalSalaries')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12} md={8}>
                        <Form.Item
                            label={t("MinimalSalary")}
                            name="MinimalSalary"
                            rules={[
                                {
                                    required: true,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                className={'addonInput'}
                                placeholder={t('MinimalSalary')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={8}>
                        <Form.Item
                            label={t("ChangePercentage")}
                            name="ChangePercentage"
                            rules={[
                                {
                                    required: true,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                className={'addonInput'}
                                placeholder={t('ChangePercentage')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={24}>
                        <Form.Item
                            label={t("NormativeAct")}
                            name="NormativeAct"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: true,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <Input
                                className={'addonInput'}
                                placeholder={t('NormativeAct')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default UpdateMinimalSalaryModal