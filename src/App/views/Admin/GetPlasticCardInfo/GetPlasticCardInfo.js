import { Button, Form, Input, Spin } from 'antd';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Fade } from "react-awesome-reveal";
import { Notification } from '../../../../helpers/notifications';
import PayrollOfPlasticCardSheetServices from '../../../../services/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/PayrollOfPlasticCardSheet.services';

import Card from "../../../components/MainCard";

const GetPlasticCardInfo = () => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [plasticCardsInfo, setPlasticCardsInfo] = useState([]);

    const onFinish = () => {
        setLoading(true)
        filterForm.validateFields()
            .then(values => {
                console.log(values);
                PayrollOfPlasticCardSheetServices.getPlasticCardInfo(values)
                    .then((res) => {
                        setPlasticCardsInfo(res.data);
                        setLoading(false)
                    }).catch(err => {
                        Notification('error', err);
                        setLoading(false)
                    })
            });
    };

    return (
        <Card title={t("GetPlasticCardInfo")}>
            <Fade>
                <Form
                    className='table-filter-form'
                    form={filterForm}
                    onFinish={onFinish}
                >
                    <div className="form-elements">
                        <Form.Item
                            name="PINFL"
                            rules={[
                                {
                                    required: true,
                                    message: t('pleaseSelect'),
                                    pattern: /^[A-Za-z0-9]{14,14}$/
                                },
                            ]}
                        >
                            <Input
                                style={{ width: '100%' }}
                                maxLength={14}
                                placeholder={t("inpsCode")}
                                onPressEnter={onFinish}
                            />
                        </Form.Item>
                        <Form.Item
                            name="MFOCode"
                            rules={[
                                {
                                    required: false,
                                    message: t('pleaseSelect'),
                                },
                            ]}
                        >
                            <Input
                                style={{ width: '100%' }}
                                maxLength={5}
                                placeholder={t("MFOCode")}
                                onPressEnter={onFinish}
                            />
                        </Form.Item>
                        <Form.Item
                            name="SettlementeAccountCode"
                            style={{ width: 250 }}
                            rules={[
                                {
                                    required: false,
                                    message: t('pleaseSelect'),
                                },
                            ]}
                        >
                            <Input
                                style={{ width: '100%' }}
                                maxLength={20}
                                placeholder={t("searchByAccCode")}
                                onPressEnter={onFinish}
                            />
                        </Form.Item>
                        <Form.Item
                            name="OrgID"
                            rules={[
                                {
                                    required: false,
                                    message: t('pleaseSelect'),
                                },
                            ]}
                        >
                            <Input
                                style={{ width: '100%' }}
                                maxLength={5}
                                placeholder={t("OrgID")}
                                onPressEnter={onFinish}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                // style={{ padding: '0 8px' }}
                                htmlType="submit"
                            >
                                <i className="feather icon-refresh-ccw" />
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </Fade >
            <Fade>
                <Spin spinning={loading}>
                    <div style={{ fontSize: 16, backgroundColor: '#333', padding: 16 }}>
                        <pre style={{ color: 'white', margin: 0 }}>
                            {JSON.stringify(plasticCardsInfo, null, 2)}
                        </pre>
                    </div>
                </Spin>
            </Fade>
        </Card >
    )
}

export default React.memo(GetPlasticCardInfo);