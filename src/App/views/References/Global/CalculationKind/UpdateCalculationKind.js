import { Button, Checkbox, Col, Form, Input, Row, Select, Space, Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Card from "../../../../components/MainCard";
import CalculationKindServices from '../../../../../services/References/Global/CalculationKind/CalculationKind.services';
import HelperServices from '../../../../../services/Helper/helper.services';
import PercentHistoryTable from '../../Organizational/SubCalculationKind/components/PercentHistoryTable';
import CalculationTypeTable from './components/CalculationTypeTable';

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const { Option } = Select;
const { TabPane } = Tabs;

const UpdateCalculationKind = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [calculationKind, setCalculationKind] = useState([]);
    const [calcTypeList, setCalcTypeList] = useState([]);
    const [calcMethodList, setCalcMethodList] = useState([]);
    const [Tables, setTables] = useState([]);
    const [PerHistory, setPerHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [calculationKind, calcTypeList, calcMethodList] = await Promise.all([
                CalculationKindServices.getById(props.match.params.id),
                HelperServices.GetAllCalculationType(),
                HelperServices.GetAllCalculationMethod(),

            ]);
            // if (props.match.params.id ? props.match.params.id : 0) {
            // console.log(salaryTransactionList.data);  
            setCalculationKind(calculationKind.data);
            setCalcTypeList(calcTypeList.data);
            setCalcMethodList(calcMethodList.data);
            calculationKind.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(calculationKind.data.Tables);
            calculationKind.data.PerHistoryTables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setPerHistory(calculationKind.data.PerHistoryTables)
            // }

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...calculationKind.data,
                });
            }
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const onMainFormFinish = (values) => {
        console.log({
            ...calculationKind, ...values,
            Tables: Tables,
            PerHistoryTables: PerHistory,
        });
        setLoader(true);
        CalculationKindServices.update({
            ...calculationKind, ...values,
            Tables: Tables,
            PerHistoryTables: PerHistory,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/calculationKind`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    const editSubCalcKindTableData = (data) => {
        setTables(data);
    };
    const editPerHistoryTableData = (data) => {
        setPerHistory(data);
    };

    return (
        <Card title={t("SubCalculationKind")}>
            <Spin spinning={loader} size='large'>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                >
                    <Row gutter={[15, 0]}>
                        <Col span={24} xl={6} md={12}>
                            <Form.Item
                                label={t("Name")}
                                name="Name"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label={t("id")}
                                name="ID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={24} xl={6} md={12}>
                            <Form.Item
                                label={t("CalculationType")}
                                name="CalculationTypeID"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please select"),
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("CalculationType")}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {calcTypeList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} xl={6} md={12}>
                            <Form.Item
                                label={t("CalculationMethod")}
                                name="CalculationMethodID"

                                rules={[
                                    {
                                        required: true,
                                        message: t("Please select"),
                                    },
                                ]}>
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder={t("CalculationMethod")}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {calcMethodList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} xl={6} md={12}>
                            <Form.Item
                                label={t("Formula")}
                                name="Formula"
                                style={{ width: "100%" }}
                            >
                                <Input placeholder={t("Formula")} />
                            </Form.Item>
                        </Col>
                        <Col span={24} xl={6} md={12}>
                            <Form.Item
                                label={t("NormativeAct")}
                                name="NormativeAct"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input placeholder={t("NormativeAct")} />
                            </Form.Item>
                        </Col>
                        <Col span={12} xl={6} md={12}>
                            <Form.Item
                                label="&zwnj;"
                                name="IsBenefit"
                                valuePropName="checked"
                            >
                                <Checkbox>
                                    {t("IsBenefit")}
                                </Checkbox>
                            </Form.Item>
                        </Col>
                        <Col span={12} xl={6} md={12}>
                            <Form.Item
                                label="&zwnj;"
                                name="AllowEditChild"
                                valuePropName="checked"
                            >
                                <Checkbox>
                                    {t("AllowEditChild")}
                                </Checkbox>
                            </Form.Item>
                        </Col>
                        <Col span={12} xl={6} md={12}>
                            <Form.Item
                                label={t("State")}
                                name="StateID"

                                rules={[
                                    {
                                        required: true,
                                        message: t("Please select"),
                                    },
                                ]}>
                                <Select
                                    placeholder={t("Select from list")}
                                    allowClear
                                    optionFilterProp="children"
                                >
                                    <Option key={1} value={1}>
                                        {t("active")}
                                    </Option>
                                    <Option key={2} value={2}>
                                        {t("passive")}
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Tabs type="card">
                        <TabPane tab={t("Используемый вид расчета")} key="2">
                            <CalculationTypeTable
                                data={calculationKind.Tables}
                                editSubCalcKindTableData={editSubCalcKindTableData}
                            />
                        </TabPane>
                        <TabPane tab={t("Процент")} key="3">
                            <PercentHistoryTable
                                data={calculationKind.PerHistoryTables}
                                editPerHistoryTableData={editPerHistoryTableData}
                            />
                        </TabPane>
                    </Tabs>
                </Form>

                <Space size='middle' className='btns-wrapper'>
                    <Button
                        type="default"
                        onClick={() => {
                            history.goBack();
                            Notification("warning", t("not-saved"));
                        }}
                    >
                        {t("back")}
                    </Button>
                    <Button
                        htmlType="submit"
                        form="mainForm"
                        type="primary"
                    >
                        {t("save")}
                    </Button>
                </Space>
            </Spin>
        </Card>
    )
}

export default React.memo(UpdateCalculationKind);