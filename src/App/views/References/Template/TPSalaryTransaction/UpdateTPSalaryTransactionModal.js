import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Spin, Tabs } from 'antd'
import { useTranslation } from 'react-i18next';

import TPSalaryTransactionServices from '../../../../../services/References/Template/TPSalaryTransaction/TPSalaryTransaction.services';
import HelperServices from "./../../../../../services/Helper/helper.services";
import SalaryTransactionTable from './components/SalaryTransactionTable';
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const { TabPane } = Tabs;

const UpdateTPSalaryTransactionModal = (props) => {
    // console.log(props.data);
    const { ID } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [tpSalaryTransaction, setTPSalaryTransaction] = useState([]);
    const [organizationTypeList, setOrganizationTypeList] = useState([]);
    const [calcType, setCalcType] = useState([]);
    const [Tables, setTables] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [tpSalaryTransaction, organizationTypeList, calcType] = await Promise.all([
                TPSalaryTransactionServices.getById(ID),
                HelperServices.GetAllOrganizationType(),
                HelperServices.GetAllCalculationType(),
            ]);
            setTPSalaryTransaction(tpSalaryTransaction.data);
            tpSalaryTransaction.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(tpSalaryTransaction.data.Tables);
            setOrganizationTypeList(organizationTypeList.data);
            setCalcType(calcType.data);

            if (tpSalaryTransaction.data.ID !== 0) {
                mainForm.setFieldsValue({
                    ...tpSalaryTransaction.data,
                });
            }
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [])

    const onMainFormFinish = (values) => {
        // console.log({ ...tpSalaryTransaction, ...values, Tables: Tables });
        TPSalaryTransactionServices.postData({ ...tpSalaryTransaction, ...values, Tables: Tables  })
            .then((res) => {
                // console.log(res.data);
                Notification('success', t('edited'));
                props.onCancel();
                props.fetch();
            }).catch((err) => {
                Notification('error', err)
            })
    };

    const editTPSalaryTransactionTableData = (data) => {
        setTables(data);
    };

    return (
        <Modal
            width={992}
            title={t("TPSalaryTransaction")}
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
                                label={t("Name")}
                                name="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    style={{ width: "100%" }}
                                    placeholder={t('Name')}
                                />
                            </Form.Item>
                        </Col>
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
                                    placeholder={t("OrganizationType")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {organizationTypeList.map(item =>
                                        <Option key={item.ID} value={item.ID} >
                                            {item.DisplayName}
                                        </Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} md={8}>
                            <Form.Item
                                label={t("CalculationTypeName")}
                                name="CalculationTypeID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {calcType.map((calcType) => (
                                        <Option key={calcType.ID} value={calcType.ID}>
                                            {calcType.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Tabs type="card"
                    // onChange={callback}
                    >
                        <TabPane tab={t("Используемый вид расчета")} key="2">
                            <SalaryTransactionTable
                                data={Tables}
                                editSubCalcKindTableData={editTPSalaryTransactionTableData}
                            />
                        </TabPane>
                    </Tabs>
                </Form>
            </Spin>
        </Modal>
    )
}

export default React.memo(UpdateTPSalaryTransactionModal);