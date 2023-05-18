import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin, Tabs, TimePicker } from 'antd'
import { useTranslation } from 'react-i18next';
import moment from "moment";

import { Notification } from '../../../../../helpers/notifications';
import TPWorkScheduleServices from '../../../../../services/References/Template/TPWorkSchedule/TPWorkSchedule.services';
import WorkingHoursTable from './components/WorkingHoursTable';
import ShiftsTable from './components/ShiftsTable';

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

const UpdateTPWorkScheduleModal = (props) => {
    // console.log(props.data);
    const { ID } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [tpWorkSchedule, setTPWorkSchedule] = useState({});
    const [Tables, setTables] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [tpWorkSchedule] = await Promise.all([
                TPWorkScheduleServices.getById(ID),
            ]);
            setTPWorkSchedule(tpWorkSchedule.data);
            // tpWorkSchedule.data.Tables.map((data) => {
            //     data.key = Math.random();
            //     return data;
            // })
            setTables(tpWorkSchedule.data.Tables);

            if (tpWorkSchedule.data.ID !== 0) {
                mainForm.setFieldsValue({
                    ...tpWorkSchedule.data,
                    BeginDayHours: moment(tpWorkSchedule.data.BeginDayHours, 'HH:mm'),
                    BeginEveningHours: moment(tpWorkSchedule.data.BeginEveningHours, 'HH:mm'),
                    BeginNightHours: moment(tpWorkSchedule.data.BeginNightHours, 'HH:mm'),
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
        console.log({ ...tpWorkSchedule, ...values, Tables: Tables });
        // TPWorkScheduleServices.postData({ ...tpSalaryTransaction, ...values, Tables: Tables  })
        //     .then((res) => {
        //         // console.log(res.data);
        //         Notification('success', t('edited'));
        //         props.onCancel();
        //         props.fetch();
        //     }).catch((err) => {
        //         Notification('error', err)
        //     })
    };

    const editTPSalaryTransactionTableData = (data) => {
        setTables(data);
    };

    return (
        <Modal
            width={1190}
            title={t("TPWorkSchedule")}
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
                        <Col span={24} md={6}>
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
                        <Col span={12} md={6}>
                            <Form.Item
                                label={t("WorkScheduleKind")}
                                name="WorkSheduleKindID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("WorkSheduleKind")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    <Option key={1} value={1}>
                                        {t("Пятидневка ")}
                                    </Option>
                                    <Option key={2} value={2}>
                                        {t("Шестидневка ")}
                                    </Option>
                                    <Option key={2} value={2}>
                                        {t("Сменный  ")}
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12} md={4}>
                            <Form.Item
                                label={t("BeginDayHours")}
                                name="BeginDayHours"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <TimePicker style={{ width: "100%" }} format="HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={4}>
                            <Form.Item
                                label={t("BeginEveningHours")}
                                name="BeginEveningHours"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <TimePicker style={{ width: "100%" }} format="HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={4}>
                            <Form.Item
                                label={t("BeginNightHours")}
                                name="BeginNightHours"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <TimePicker style={{ width: "100%" }} format="HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={4}>
                            <Form.Item
                                label={t("FirstDayOff")}
                                name="FirstDayOff"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <InputNumber style={{ width: "100%" }} placeholder={t("FirstDayOff")} />
                            </Form.Item>
                        </Col>
                        <Col span={12} md={4}>
                            <Form.Item
                                label={t("SecondDayOff")}
                                name="SecondDayOff"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("pleaseSelect"),
                                    },
                                ]}>
                                <InputNumber style={{ width: "100%" }} placeholder={t("SecondDayOff")} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Tabs type="card"
                    // onChange={callback}
                    >
                        <TabPane tab={t("workingHours")} key="1">
                            <WorkingHoursTable
                                data={tpWorkSchedule.Table2}
                                editSubCalcKindTableData={editTPSalaryTransactionTableData}
                            />
                        </TabPane>
                        <TabPane tab={t("shifts")} key="2">
                            <ShiftsTable
                                data={tpWorkSchedule.Table1}
                                editSubCalcKindTableData={editTPSalaryTransactionTableData}
                            />
                        </TabPane>
                    </Tabs>
                </Form>
            </Spin>
        </Modal>
    )
}

export default UpdateTPWorkScheduleModal;