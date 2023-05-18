import React, { useState } from "react";
import { Form, Select, Button, InputNumber, Input } from "antd";
import { useTranslation } from "react-i18next";
import { CSSTransition } from "react-transition-group";
import BonusInfoModal from "../components/BonusInfoModal";

const { Option } = Select;
const layout = {
    labelCol: {
        span: 24,
    }
};

const MethodUnionTableHeader = (props) => {
    const [subjectName, setSubjectName] = useState('');
    const [bonusModalVisible, setBonusModalVisible] = useState(false);
    const [bonusModalId, setBonusModalId] = useState(null);

    const { t } = useTranslation();
    const [addHoursForm] = Form.useForm();

    const addStaffHandler = () => {
        addHoursForm.validateFields()
            .then(values => {
                values.key = Math.random().toString();
                values.ID = 0;
                values.Status = 1;
                
                values.AllowanceTypeID = 2;
                values.SubjectName = subjectName;
                props.addData(values);
            })
            .catch(err => {
                return err;
            })
    }

    const subjectsChangeHandler = (_, data) => {
        setSubjectName(data.children);
    }

    const openBonusModalHandler = inputName => {
        setBonusModalId(inputName);
        setBonusModalVisible(true);
    }

    const closeBonusModalHandler = () => {
        setBonusModalVisible(false);
    }

    return (
        <>
            <Form
                {...layout}
                form={addHoursForm}
                component={false}
                initialValues={{
                }}
            >
                <tr>
                    <th className='ant-table-cell'>
                        <Form.Item
                            label={t('Subjects')}
                            name='SubjectID'
                            rules={[
                                {
                                    required: true,
                                    message: t("pleaseSelect"),
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder={t("SubjectName")}
                                style={{ width: '100%' }}
                                optionFilterProp="children"
                                onChange={subjectsChangeHandler}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {props.subjectsInBLHGT.map(item => <Option key={item.ID} value={item.SubjectsID}>{item.SubjectsName}</Option>)}
                            </Select>
                        </Form.Item>
                    </th>
                    <th className='ant-table-cell'>
                        <div style={{ display: 'flex', alignItems: 'center'}}>
                            <Form.Item
                                label={t('Percentage')}
                                name='Percentage'
                                rules={[
                                    {
                                        required: true,
                                        message: t("PleaseFill"),
                                    },
                                ]}
                            >
                                {/* <InputNumber min={0} max={100} placeholder={t('Percentage')} style={{ width: '100%' }} /> */}
                                <Select
                                    allowClear
                                    placeholder={t("Percentage")}
                                    style={{ width: '100%' }}
                                    optionFilterProp="children"
                                >
                                    <Option value={0}>0%</Option>
                                    <Option value={10}>10%</Option>
                                </Select>
                            </Form.Item>
                            {/* <Form.Item label="&nbsp;">
                                <Button
                                    icon={<i style={{ width: '28px' }} className="feather icon-info" />}
                                    onClick={() => openBonusModalHandler(1)}
                                />
                            </Form.Item> */}
                        </div>
                    </th>
                    <th className='ant-table-cell'>
                        <Button
                            type='primary'
                            shape="circle"
                            icon={<i className="fa fa-plus" aria-hidden="true" />}
                            htmlType='submit'
                            onClick={addStaffHandler}
                        />
                    </th>
                </tr>
            </Form >
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={bonusModalVisible}
                timeout={300}
            >
                <BonusInfoModal
                    visible={bonusModalVisible}
                    id={bonusModalId}
                    onCancel={closeBonusModalHandler}
                />
            </CSSTransition>
        </>
    );
};

export default React.memo(MethodUnionTableHeader);
