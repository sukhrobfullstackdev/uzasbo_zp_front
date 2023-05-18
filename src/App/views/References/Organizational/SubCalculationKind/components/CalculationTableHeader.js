import React, { useEffect, useState } from "react";
import { Form, Select, Input, Button, InputNumber, Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import SubCalcKindListModal from "./Modals/SubCalcKindListModal";

const layout = {
    labelCol: {
        span: 24,
    }
};

const CalculationTableHeader = (props) => {

    const [loader, setLoader] = useState(true);
    const [UsedCalculationKindID, setUsedCalculationKindID] = useState(null);

    const { t } = useTranslation();
    const [addStaffForm] = Form.useForm();

    const [subCalcKindListModal, setSubCalcKindListModal] = useState(false);
    const [calculationKindParams, setCalculationKindParams] = useState([]);

    const addStaffHandler = () => {
        addStaffForm.validateFields()
            .then(values => {
                console.log(values);
                values.key = Math.random();
                values.ID = 0;
                values.Status = 1;
                values.UsedCalculationKindID = UsedCalculationKindID;
                // values.Code = Code;
                // values.Name = Name;
                props.addData(values);
            })
    };

    useEffect(() => {

    }, []);

    const openSubCalcKindListModal = (params) => {
        setCalculationKindParams(params);
        setSubCalcKindListModal(true);
    };

    const onSelect = (data) => {
        // console.log(data);
        addStaffForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
        });
        setUsedCalculationKindID(data.ID)
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
                                {/* <Button
                                    type="danger"
                                    icon={<i className="fa fa-times" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                                    onClick={() => openSubCalcKindListModal({
                                    })}
                                /> */}
                            </Button.Group>
                        </div>

                    </th>
                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('CalcFromInSum')}
                            name='CalcFromInSum'
                            valuePropName="checked"
                            rules={[
                                {
                                    required: false,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Checkbox
                                // onChange={handleIsEmployee}
                                ></Checkbox>
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
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={subCalcKindListModal}
                timeout={300}
            >
                <SubCalcKindListModal
                    visible={subCalcKindListModal}
                    params={calculationKindParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setSubCalcKindListModal(false);
                    }}
                />
            </CSSTransition>
        </>
    );
};

export default React.memo(CalculationTableHeader);
