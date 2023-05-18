import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next';

import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import { CSSTransition } from 'react-transition-group';
import TPLimitBySubCalculationKindServices from '../../../../../services/References/Template/TPLimitBySubCalculationKind/TPLimitBySubCalculationKind.services';
import TPSubCalculationKindModal from './components/TPSubCalculationKindModal';

const { Option } = Select;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const UpdateTPLimitBySubCalculationKindModal = (props) => {
    // console.log(props.data);
    const { ID } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [tpListOfPosition, setTPListOfPosition] = useState({});
    const [orgTypeList, setOrgTypeList] = useState([]);
    const [tpSubcalculationKindModal, setTPSubcalculationKindModal] = useState(false);
    const [tpSubcalculationKindParams, setTPSubcalculationKindParams] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tpListOfPosition, orgTypeList] = await Promise.all([
                TPLimitBySubCalculationKindServices.getById(ID),
                HelperServices.GetAllOrganizationType(),
            ]);
            setTPListOfPosition(tpListOfPosition.data);
            setOrgTypeList(orgTypeList.data);

            if (tpListOfPosition.data.ID !== 0) {
                mainForm.setFieldsValue({
                    ...tpListOfPosition.data,
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
        // console.log({ ...tpListOfPosition, ...values, });
        TPLimitBySubCalculationKindServices.postData({ ...tpListOfPosition, ...values, })
            .then((res) => {
                // console.log(res.data);
                Notification('success', t('edited'));
                props.onCancel();
                props.fetch();
            }).catch((err) => {
                Notification('error', err)
            })
    };

    const openTariffScaleModal = (values) => {
        setTPSubcalculationKindParams(values);
        setTPSubcalculationKindModal(true);
    };

    const onSelect = (data) => {
        // console.log(data);
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID
        });
    };


    return (
        <Modal
            width={768}
            title={t("TPLimitBySubCalculationKind")}
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
                        <Col span={12} md={12}>
                            <Form.Item
                                label={t("OrganizationType")}
                                name="OrganizationTypeID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("OrganizationType")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {orgTypeList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12} md={12}>
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
                        <Col  span={24} md={24}>
                            <Form.Item
                                label={t("TPSubCalculationKind")}
                                name="TPSubCalculationKind"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    readOnly
                                    className={'addonInput'}
                                    addonAfter={
                                        <div style={{ display: 'flex', pading: '0' }}>
                                            <div
                                                onClick={() => openTariffScaleModal({
                                                    Name: 'TPSubCalculationKind',
                                                    ID: 'TPSubCalculationKindID'
                                                })}
                                            >
                                                <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                            </div>
                                        </div>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("TPSubCalculationKind")}
                                name="TPSubCalculationKindID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={12}>
                            <Form.Item
                                label={t("LimitType")}
                                name="LimitTypeID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("LimitType")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    <Option key={1} value={1}>
                                        {t("Кол-во раза")}
                                    </Option>
                                    <Option key={2} value={2}>
                                        {t("По сумме")}
                                    </Option>
                                    <Option key={3} value={3}>
                                        {t("По процентам ")}
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12} md={12}>
                            <Form.Item
                                label={t("LimitOperType")}
                                name="LimitOperTypeID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("LimitOperType")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    <Option key={1} value={1}>
                                        {t("Равно")}
                                    </Option>
                                    <Option key={2} value={2}>
                                        {t("Не равно")}
                                    </Option>
                                    <Option key={3} value={3}>
                                        {t("Больше")}
                                    </Option>
                                    <Option key={4} value={4}>
                                        {t("Больше или равно")}
                                    </Option>
                                    <Option key={5} value={5}>
                                        {t("Меньше")}
                                    </Option>
                                    <Option key={6} value={6}>
                                        {t("Меньше или равно ")}
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12} md={12}>
                            <Form.Item
                                label={t("LimitValue")}
                                name="LimitValue"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder={t('LimitValue')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={12}>
                            <Form.Item
                                label={t("LimitPeriod")}
                                name="LimitPeriodTypeID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("LimitPeriod")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    <Option key={1} value={1}>
                                        {t("Ежемесячно")}
                                    </Option>
                                    <Option key={2} value={2}>
                                        {t("Ежеквартально")}
                                    </Option>
                                    <Option key={3} value={3}>
                                        {t("Ежегодно")}
                                    </Option>
                                    {/* logic */}
                                    <Option key={4} value={4}>
                                        {t("Указать период")}
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={tpSubcalculationKindModal}
                timeout={300}
            >
                <TPSubCalculationKindModal
                    visible={tpSubcalculationKindModal}
                    params={tpSubcalculationKindParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setTPSubcalculationKindModal(false);
                    }}
                />
            </CSSTransition>
        </Modal>
    )
}

export default React.memo(UpdateTPLimitBySubCalculationKindModal);