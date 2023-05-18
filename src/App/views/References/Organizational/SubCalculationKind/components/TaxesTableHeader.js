import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useTranslation } from "react-i18next";

const layout = {
    labelCol: {
        span: 24,
    }
};

const TaxesTableHeader = (props) => {

    const { t } = useTranslation();
    const [addStaffForm] = Form.useForm();

    const addStaffHandler = () => {
        addStaffForm.validateFields()
            .then(values => {
                values.key = Math.random().toString();
                values.ID = 0;
                values.Status = 1;
                props.addData(values);
            })
    };

    useEffect(() => {

    }, []);

    return (
        <Form
            {...layout}
            form={addStaffForm}
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
                        <Input
                            disabled
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
                        <Input
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
                            <Input
                                placeholder={t('UsedCalculationKindName')}
                            />
                        </Form.Item>
                        <Button.Group>
                            <Button
                                type="primary"
                                icon={<i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                            // onClick={() => openHistoryModal({
                            //     DataID: children.ID,
                            //     TableID: 248, //children
                            //     ColumnName: 'DocumentSeries',
                            // })}
                            />
                            <Button
                                type="danger"
                                icon={<i className="fa fa-times" style={{ color: 'white', margin: '0 6px', fontSize: '14px' }} />}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', width: "28px" }}
                            // onClick={() => openHistoryModal({
                            //     DataID: children.ID,
                            //     TableID: 248, //children
                            //     ColumnName: 'DocumentSeries',
                            // })}
                            />
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
                        htmlType='submit'
                        onClick={addStaffHandler}
                    />
                </th>
            </tr >
        </Form >
    );
};

export default React.memo(TaxesTableHeader);
