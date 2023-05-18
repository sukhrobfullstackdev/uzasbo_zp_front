import React, { useEffect, useState } from 'react'
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next';
import moment from "moment";

import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import TaxReliefServices from '../../../../../services/References/Global/TaxRelief/TaxRelief.services';

const { Option } = Select;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const UpdateAllPositionsModal = (props) => {
    // console.log(props.data);
    const { ID } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [allPositions, setAllPositions] = useState({});
    const [stateList, setStateList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [allPositions, orgTypeList] = await Promise.all([
                TaxReliefServices.getById(ID),
                HelperServices.getStateList(),
            ]);
            setAllPositions(allPositions.data);
            setStateList(orgTypeList.data);

            if (allPositions.data.ID !== 0) {
                mainForm.setFieldsValue({
                    ...allPositions.data,
                    NormativeActDate: moment(allPositions.data.NormativeActDate, 'DD.MM.YYYY'),
                    StartDate: moment(allPositions.data.StartDate, 'DD.MM.YYYY'),
                    EndDate: moment(allPositions.data.EndDate, 'DD.MM.YYYY'),
                });
            }
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [ID, mainForm]);

    const onMainFormFinish = (values) => {
        // console.log({ ...allPositions, ...values, }); 
        TaxReliefServices.postData({ ...allPositions, ...values, })
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
            width={768}
            title={t("TaxRelief")}
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
            <Spin size='large' spinning={loader}>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                    initialValues={{
                    }}
                >
                    <Row gutter={[15, 0]}>
                        <Col span={24} md={12}>
                            <Form.Item
                                label={t("Code")}
                                name="ItemCode"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder={t('ItemCode')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
                            <Form.Item
                                label={t("NormativeAct")}
                                name="NormativeAct"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    style={{ width: "100%" }}
                                    placeholder={t('NormativeAct')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={24}>
                            <Form.Item
                                label={t("NameUzb")}
                                name="NameUzb"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    style={{ width: "100%" }}
                                    placeholder={t('NameUzb')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={24}>
                            <Form.Item
                                label={t("NameRus")}
                                name="NameRus"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    style={{ width: "100%" }}
                                    placeholder={t('NameRus')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={6}>
                            <Form.Item
                                name="NormativeActDate"
                                label={t("NormativeActDate")}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="DD.MM.YYYY"
                                    className='datepicker'
                                    placeholder={t("NormativeActDate")}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={6}>
                            <Form.Item
                                name="StartDate"
                                label={t("startDate")}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="DD.MM.YYYY"
                                    className='datepicker'
                                    placeholder={t("startDate")}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={6}>
                            <Form.Item
                                name="EndDate"
                                label={t("endDate")}
                            >
                                <DatePicker
                                    style={{ width: "100%" }}
                                    format="DD.MM.YYYY"
                                    className='datepicker'
                                    placeholder={t("endDate")}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={6}>
                            <Form.Item
                                label={t("State")}
                                name="StateID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("State")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {stateList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal>
    )
}

export default React.memo(UpdateAllPositionsModal);