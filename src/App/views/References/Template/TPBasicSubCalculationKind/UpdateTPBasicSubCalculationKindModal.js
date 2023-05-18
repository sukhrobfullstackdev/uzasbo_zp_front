import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next';

import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import { CSSTransition } from 'react-transition-group';
import TPSubCalculationKindModal from '../TPLimitBySubCalculationKind/components/TPSubCalculationKindModal';
import TPBasicSubCalculationKindServices from '../../../../../services/References/Template/TPBasicSubCalculationKind/TPBasicSubCalculationKind.services';

const { Option } = Select;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const UpdateTPBasicSubCalculationKindModal = (props) => {
    // console.log(props.data);
    const { ID } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [tpBasicSubCalculationKind, setTPBasicSubCalculationKind] = useState({});
    const [orgTypeList, setOrgTypeList] = useState([]);
    const [tpSubcalculationKindModal, setTPSubcalculationKindModal] = useState(false);
    const [tpSubcalculationKindParams, setTPSubcalculationKindParams] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tpBasicSubCalculationKind, orgTypeList] = await Promise.all([
                TPBasicSubCalculationKindServices.getById(ID),
                HelperServices.GetAllOrganizationType(),
            ]);
            setTPBasicSubCalculationKind(tpBasicSubCalculationKind.data);
            setOrgTypeList(orgTypeList.data);

            if (tpBasicSubCalculationKind.data.ID !== 0) {
                mainForm.setFieldsValue({
                    ...tpBasicSubCalculationKind.data,
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
        TPBasicSubCalculationKindServices.postData({ ...tpBasicSubCalculationKind, ...values, })
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
            title={t("TPBasicSubCalculationKind")}
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
                        <Col span={24} md={8}>
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
                                    placeholder={t("OrganizationTypeID")}
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
                        <Col span={24} md={16}>
                            <Form.Item
                                label={t("SubCalculationKind")}
                                name="SubCalculationKind"
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
                                                    Name: 'SubCalculationKind',
                                                    ID: 'SubCalculationKindID'
                                                })}
                                            >
                                                <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                            </div>
                                        </div>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("SubCalculationKind")}
                                name="SubCalculationKindID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24} md={8}>
                                <Form.Item
                                    label="&zwnj;"
                                    name="IsByAppoint"
                                    valuePropName="checked"
                                >
                                    <Checkbox >
                                        {t("IsByAppoint")}
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        <Col span={12} md={8}>
                            <Form.Item
                                label={t("Sum")}
                                name="Sum"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder={t('Sum')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={8}>
                            <Form.Item
                                label={t("Percentage")}
                                name="Percentage"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder={t('Percentage')}
                                />
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

export default React.memo(UpdateTPBasicSubCalculationKindModal);