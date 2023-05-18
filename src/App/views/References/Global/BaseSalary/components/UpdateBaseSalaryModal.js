import React from 'react'
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row } from 'antd'
import { useTranslation } from 'react-i18next';
import moment from "moment";
import { Notification } from '../../../../../../helpers/notifications';
import BaseSalaryServices from '../../../../../../services/References/Global/BaseSalary/BaseSalary.services';

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const UpdateBaseSalaryModal = (props) => {
    // console.log(props.data);
    const { ID, Date, BaseSalary, ChangePercentage, NormativeAct } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const onMainFormFinish = (values) => {
        // console.log({ ID, ...values });
        values.Date = values.Date?.format("DD.MM.YYYY");
        BaseSalaryServices.postData({ ID, ...values })
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
            title={t("BaseSalary")}
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
                    BaseSalary: BaseSalary,
                    ChangePercentage: ChangePercentage,
                    NormativeAct: NormativeAct,
                }}
            >
                <Row gutter={[15, 0]}>
                    <Col span={12} md={8}>
                        <Form.Item
                            label={t("date")}
                            name="Date"
                            style={{ width: '100%' }}
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
                            label={t("BaseSalary")}
                            name="BaseSalary"
                            rules={[
                                {
                                    required: true,
                                    message: t("Please input valid"),
                                },
                            ]}>
                            <InputNumber
                                style={{ width: "100%" }}
                                placeholder={t('BaseSalary')}
                            />
                        </Form.Item>
                    </Col>
                    <Col md={8}>
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
                                placeholder={t('ChangePercentage')}
                            />
                        </Form.Item>
                    </Col>
                    <Col md={24}>
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
                                placeholder={t('NormativeAct')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default UpdateBaseSalaryModal;