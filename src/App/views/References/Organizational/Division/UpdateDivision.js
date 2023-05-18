import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import Card from "../../../../components/MainCard";
import classes from "./Division.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import DivisionServices from "../../../../../services/References/Organizational/Division/division.services";

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
const { Option } = Select;

//main function
const UpdateDivision = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [form] = Form.useForm();
    const [status, setStatus] = useState([]);
    const [divisionData, setDivisionData] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [division, status] = await Promise.all([
                DivisionServices.getById(props.match.params.id ? props.match.params.id : 0),
                HelperServices.getStateList(),

            ]);
            setDivisionData(division.data);
            setStatus(status.data);
            setLoader(false);
        }
        fetchData().catch(err => {
            Notification('error', err);
        });
    }, [props.match.params.id]);
    
    //useffect end

    //onfinish
    const onFinish = (values) => {
        values.ID = props.match.params.id;
        DivisionServices.postData(values)
            .then((res) => {
                if (res.status === 200) {
                    history.push("/division");
                    Notification("success", t("success-msg"));
                }
            })
            .catch((err) => {
                // console.log(err);
                Notification('error', err);
            });
    };
    //onfinish end

    const onFinishFailed = (errorInfo) => {
        // console.log(errorInfo);
    };

    //loader
    if (loader) {
        return (
            <div className="spin-wrapper">
                <Spin size="large" />
            </div>
        );
    }
    //loader end

    //main
    return (
        <Fade>
            <Card title={t("UpdateDivision")}>
                <Form
                    {...layout}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className={classes.FilterForm}
                    form={form}
                    initialValues={divisionData}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24} xl={8} lg={12}>
                            <Form.Item
                                label={t("shortname")}
                                name={"ShortName"}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please Input shortname"),
                                    },
                                ]}
                            >
                                <Input placeholder={t("shortname")} />
                            </Form.Item>
                        </Col>
                        <Col span={24} xl={8} lg={12}>
                            <Form.Item
                                label={t("name")}
                                name="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please Input name"),
                                    },
                                ]}
                            >
                                <Input placeholder={t("name")} />
                            </Form.Item>
                        </Col>
                        <Col span={24} xl={8} lg={12}>
                            <Form.Item
                                label={t("Status")}
                                name="StateID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please select status"),
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("Select State")}
                                    allowClear
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {status.map((status) => (
                                        <Option value={status.ID} key={status.ID}>
                                            {status.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <div className={classes.Buttons}>
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
                                    type="primary"
                                    htmlType="submit"
                                >
                                    {t("save")}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Fade>
    );
    //main end
};

//main function end

export default UpdateDivision;
