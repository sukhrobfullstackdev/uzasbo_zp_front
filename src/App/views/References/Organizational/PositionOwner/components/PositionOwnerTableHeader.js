import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox, Select } from "antd";
import { useTranslation } from "react-i18next";

const layout = {
    labelCol: {
        span: 24,
    }
};
const { Option } = Select;

const PositionOwnerTableHeader = (props) => {

    // const [loader, setLoader] = useState(true);

    const { t } = useTranslation();
    const [addStaffForm] = Form.useForm();

    const addStaffHandler = () => {
        addStaffForm.validateFields()
            .then(values => {
                console.log(values);
                values.key = Math.random();
                values.ID = 0;
                values.Status = 1;
                props.addData(values);
            })
    };

    useEffect(() => {

    }, []);

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
                            label={t('Position')}
                            name='AllPositionsID'
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: true,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <Select
                                placeholder={t("Select from list")}
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {props.allPositions.map((taxItem) => (
                                    <Option key={taxItem.ID} value={taxItem.ID}>
                                        {taxItem.Name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('PositionCategory')}
                            name='PositionCategoryID'
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: true,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <Select
                                placeholder={t("Select from list")}
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {props.positionCategoryList.map((taxItem) => (
                                    <Option key={taxItem.ID} value={taxItem.ID}>
                                        {taxItem.Name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </th>

                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('IsByBasicTariff')}
                            name='IsByBasicTariff'
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
        </>
    );
};

export default React.memo(PositionOwnerTableHeader);
