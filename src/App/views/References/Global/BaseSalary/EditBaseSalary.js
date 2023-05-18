import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Input, Spin, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Fade } from "react-awesome-reveal";

import Card from "../../../../components/MainCard";
import classes from "./BaseSalary.module.css";
import { Notification } from "../../../../../helpers/notifications";
// import HelperServices from "../../../../../services/Helper/helper.services";
import BaseSalaryService from "../../../../../services/References/Global/BaseSalary/BaseSalary.services";

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

//main function
const EditBaseSalary = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [form] = Form.useForm();
    const [baseSalary, setBaseSalary] = useState([]);
    const [loader, setLoader] = useState(true);

    //onfinish
    const onFinish = (values) => {
        values.ID = props.match.params.id;
        BaseSalaryService.postData(values)
            .then((res) => {
                if (res.status === 200) {
                    history.push("/baseSalary");
                    Notification("success", t("success-msg"));
                }
            })
            .catch((err) => {
                alert("Not allowed");
                console.log(err);
            });
    };
    //onfinish end

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    };
    //useeffect

    useEffect(() => {
        async function fetchData() {
            try {
                const baseSl = await BaseSalaryService.getById(props.match.params.id);
                setBaseSalary(baseSl.data);
                setLoader(false);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [props.match.params.id]);
    //useffect end

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
        <Fade bottom>
            <Card title={t("Edit BaseSalary")}>
                <Form
                    {...layout}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className={classes.FilterForm}
                    form={form}
                    initialValues={{
                        ...baseSalary,
                        Date: moment(baseSalary.Date, "DD.MM.YYYY"),
                    }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xl={8} lg={12}>
                            <Form.Item
                                label={t("Date ")}
                                name="Date"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please select valid Date",
                                    },
                                ]}
                            >
                                <DatePicker
                                    format="DD.MM.YYYY"
                                    style={{ width: "100%" }}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    placeholder={t("Date")}
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("NormativeAct")}
                                name="NormativeAct"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input valid NormativeAct",
                                    },
                                ]}
                            >
                                <Input placeholder={t("NormativeAct")} />
                            </Form.Item>
                        </Col>
                        <Col xl={8} lg={12}>
                            <Form.Item
                                label={t("BaseSalary")}
                                name={"BaseSalary"}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input valid BaseSalary",
                                    },
                                ]}
                            >
                                <Input placeholder={t("BaseSalary")} />
                            </Form.Item>
                        </Col>
                        <Col xl={8} lg={12}>
                            <Form.Item
                                label={t("ChangePercentage")}
                                name="ChangePercentage"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input valid ChangePercentage",
                                    },
                                ]}
                            >
                                <Input placeholder={t("ChangePercentage")} />
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
                                <Button type="primary" htmlType="submit">
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

export default EditBaseSalary;
