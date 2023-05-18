import React, { useEffect, useState } from "react";
import { Form, Input, Button, InputNumber } from "antd";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import CalcKindListModal from "./Modals/CalcKindListModal";
import MethodsOfUseModal from "./Modals/MethodsOfUseModal";
import IncomOnMinimumRateModal from "./Modals/IncomOnMinimumRateModal";

const layout = {
    labelCol: {
        span: 24,
    }
};

const CalculationTableHeader = (props) => {

    const { t } = useTranslation();
    const [addStaffForm] = Form.useForm();

    const [calcKindListModal, setCalcKindListModal] = useState(false);
    const [calculationKindParams, setCalculationKindParams] = useState([]);
    const [methodsOfUseModal, setMethodsOfUseModal] = useState(false);
    const [methodsOfUseParams, setMethodsOfUseParams] = useState([]);
    const [incomOnMinimumRateModal, setIncomOnMinimumRateModal] = useState(false);
    const [incomOnMinimumRateParams, setIncomOnMinimumRateParams] = useState([]);

    const addStaffHandler = () => {
        addStaffForm.validateFields()
            .then(values => {
                console.log(values);
                values.key = Math.random();
                values.ID = 0;
                values.Status = 1;
                // values.Code = Code;
                // values.Name = Name;
                props.addData(values);
            })
    };

    useEffect(() => {

    }, []);

    const openSubCalcKindListModal = (params) => {
        setCalculationKindParams(params);
        setCalcKindListModal(true);
    };

    const openMethodsOfUseModal = (params) => {
        setMethodsOfUseParams(params);
        setMethodsOfUseModal(true);
    };

    const openIncomOnMinimumRateModal = (params) => {
        setIncomOnMinimumRateParams(params);
        setIncomOnMinimumRateModal(true);
    };

    const onSelect = (data) => {
        // console.log(data);  
        addStaffForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
        });
    };

    const onSelectMethodIncom = (data) => {
        console.log(data);
        addStaffForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID,
        });
    };

    return (
        <>
            <Form
                {...layout}
                form={addStaffForm}
                component={false}
                initialValues={{
                    QuantityOfMinimalSalaries: 0
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
                            label={t('QuantityOfMinimalSalaries')}
                            name='QuantityOfMinimalSalaries'
                            rules={[
                                {
                                    required: true,
                                    message: t("inputValidData"),
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder={t('QuantityOfMinimalSalaries')}
                            />
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Form.Item
                                label={t('MethodsOfUse')}
                                name='MethodsOfUseName'
                                style={{ width: "calc(100% - 56px)" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <Input readOnly
                                    placeholder={t('MethodsOfUse')}
                                />
                            </Form.Item>
                            <Button.Group>
                                <Button
                                    type="primary"
                                    icon={<i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() => openMethodsOfUseModal({
                                        Name: 'MethodsOfUseName',
                                        ID: 'MethodsOfUseID'
                                    })}
                                />
                            </Button.Group>
                            <Form.Item
                                label={t("MethodsOfUse")}
                                name="IDMethodsOfUseID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </th>

                    <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Form.Item
                                label={t('UsedCalculationKindName')}
                                name='UsedCalculationKindName'
                                style={{ width: "calc(100% - 56px)" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <Input readOnly
                                    placeholder={t('UsedCalculationKindName')}
                                />
                            </Form.Item>
                            <Button.Group>
                                <Button
                                    type="primary"
                                    icon={<i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() => openSubCalcKindListModal({
                                        Name: 'UsedCalculationKindName',
                                        ID: 'UsedCalculationKindID'
                                    })}
                                />
                            </Button.Group>
                            <Form.Item
                                label={t("UsedCalculationKind")}
                                name="UsedCalculationKindID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                    </th>

                    <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Form.Item
                                label={t('IncomOnMinimumRate')}
                                name='IncomOnMinimumRateName'
                                style={{ width: "calc(100% - 56px)" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}
                            >
                                <Input readOnly
                                    placeholder={t('IncomOnMinimumRate')}
                                />
                            </Form.Item>
                            <Button.Group>
                                <Button
                                    type="primary"
                                    icon={<i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() => openIncomOnMinimumRateModal({
                                        Name: 'IncomOnMinimumRateName',
                                        ID: 'IncomOnMinimumRateID'
                                    })}
                                />
                            </Button.Group>
                            <Form.Item
                                label={t("IncomOnMinimumRate")}
                                name="IncomOnMinimumRateID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </div>
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
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={calcKindListModal}
                timeout={300}
            >
                <CalcKindListModal
                    visible={calcKindListModal}
                    params={calculationKindParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setCalcKindListModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={methodsOfUseModal}
                timeout={300}
            >
                <MethodsOfUseModal
                    visible={methodsOfUseModal}
                    params={methodsOfUseParams}
                    onSelect={onSelectMethodIncom}
                    onCancel={() => {
                        setMethodsOfUseModal(false);
                    }}
                />
            </CSSTransition>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={incomOnMinimumRateModal}
                timeout={300}
            >
                <IncomOnMinimumRateModal
                    visible={incomOnMinimumRateModal}
                    params={incomOnMinimumRateParams}
                    onSelect={onSelectMethodIncom}
                    onCancel={() => {
                        setIncomOnMinimumRateModal(false);
                    }}
                />
            </CSSTransition>
        </>
    );
};

export default React.memo(CalculationTableHeader);
