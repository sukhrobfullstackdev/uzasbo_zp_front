import React, { useState, useEffect } from 'react';
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Select, Spin, DatePicker, Space, Switch } from "antd";
import moment from 'moment';
import { useDispatch } from "react-redux";

import Card from "../../../../components/MainCard";
import SubjectsInBLHGTApis from '../../../../../services/References/Organizational/SubjectInBLGHT/SubjectInBLGHT'
import HelperServices from '../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../helpers/notifications';
import SubjectsInBLGHTTable from './components/SubjectsInBLGHTTable';
import SubjectsServices from '../../../../../services/References/Global/Subjects/Subjects.services';

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const { Option } = Select;

const UpdateSubjectsInBLGHT = (props) => {
    const { t } = useTranslation();
    const [mainForm] = Form.useForm();
    const history = useHistory();
    //   const location = useLocation();
    //   const store = useSelector(state => state.contracts)
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [mainData, setMainData] = useState([]);
    const [BLHGType, setBLHGType] = useState([]);
    const [subjects, setSubjects] = useState([]);

    const [Tables, setTables] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [formDt, blhgList, subjects] = await Promise.all([
                SubjectsInBLHGTApis.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getBLHGTypeList(),
                SubjectsServices.getAll(),
            ]);
            setMainData(formDt.data);
            formDt.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(formDt.data.Tables);
            setBLHGType(blhgList.data);
            setSubjects(subjects.data);

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...formDt.data,
                    Date: moment(formDt.data.Date, 'DD.MM.YYYY'),
                });
            } else {
                mainForm.setFieldsValue({
                    ...formDt.data,
                    Date: moment(formDt.data.Date, 'DD.MM.YYYY'),
                    BLHGTypeID: null,
                });
            }
            setLoading(false);
        }

        fetchData().catch(err => {
            Notification('error', err);
            setLoading(false);
        });
    }, [mainForm, props.match.params.id, dispatch]);

    const onMainFormFinish = (values) => {
        values.Date = values.Date.format("DD.MM.YYYY");
        setLoading(true);
        console.log({
            ...mainData, ...values,
            Tables: Tables,
        });

        SubjectsInBLHGTApis.update({
            ...mainData, ...values,
            Tables: Tables,
        })
            .then((res) => {
                if (res.status === 200) {
                    history.push(`/SubjectInBLGHT`);
                    Notification('success', t('success-msg'));
                    return res;
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoading(false);
            });
    }

    const editTableData = (data) => {
        setTables(data);
    };

    return (
        <Fade>
            <Card title={t("SubjectsInBLHGT")}>
                <Spin spinning={loading} size='large'>

                    <Form
                        {...layout}
                        form={mainForm}
                        id="mainForm"
                        onFinish={onMainFormFinish}
                    >
                        <Row gutter={[15, 0]}>

                            <Col span={12} xl={3} lg={6}>
                                <Form.Item
                                    label={t("Date")}
                                    // name="Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}>
                                    <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} placeholder={t("date")} />
                                </Form.Item>
                            </Col>
                            <Col span={24} xl={4} lg={8}>
                                <Form.Item
                                    label={t("BLHGType")}
                                    name="BLHGTypeID"
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder={t("BLHGType")}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {BLHGType.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={12} xl={2} lg={2}>
                                <Space>
                                    <Form.Item
                                        label={t("TeachingAtHome")}
                                        name="TeachingAtHome"
                                        valuePropName="checked"
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Space>
                            </Col>

                        </Row>
                    </Form>

                    <SubjectsInBLGHTTable
                        data={Tables}
                        editTableData={editTableData}
                        subjectsList={subjects}
                        mainForm={mainForm}
                    />

                    <Space size='middle' className='btns-wrapper'>
                        <Button
                            type="danger"
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


        </Fade>
    );
};

export default React.memo(UpdateSubjectsInBLGHT);