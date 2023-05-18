import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import Card from "../../../../components/MainCard";
import classes from "./SubDepartment.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import SubDepartmentServices from "../../../../../services/References/Organizational/SubDepartment/SubDepartment.services";

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
const UpdateSubDepartment = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [form] = Form.useForm();
    const [status, setStatus] = useState([]);
    const [divisionData, setDivisionData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [subdepartment, setSubDepartment] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const division = await SubDepartmentServices.getById(props.match.params.id ? props.match.params.id : 0);
                const status = await HelperServices.getStateList();
                const divisionList = await HelperServices.getAllDepartmentList();
                setDivisionData(division.data);
                setStatus(status.data);
                setSubDepartment(divisionList.data);
                setLoader(false);
            } catch (err) {
                Notification('error', err);
                // console.log(err);
            }
        }
        fetchData();
    }, [props.match.params.id]);

    //onfinish
    const onFinish = (values) => {
        values.ID = props.match.params.id;
        SubDepartmentServices.update(values)
            .then((res) => {
                if (res.status === 200) {
                    Notification("success", t("success-msg"));
                    history.push("/subDepartment");
                }
            })
            .catch((err) => {
                Notification('error', err);
                // console.log(err);
            });
    };

    //loader
    if (loader) {
        return (
            <div className="spin-wrapper">
                <Spin size='large' />
            </div>
        );
    }
    //loader end

    //main
    return (
        <Fade bottom>
            <Card title={t("Edit SubDepartment")}>
                <Form
                    {...layout}
                    onFinish={onFinish}
                    className={classes.FilterForm}
                    form={form}
                    initialValues={divisionData}
                >
                    <Row gutter={[16, 16]}>
                        <Col span={24} xl={8} lg={12}>
                            <Form.Item
                                label={t("Code")}
                                name="Code"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}
                            >
                                <Input placeholder={t("Code")} />
                            </Form.Item>
                            <Form.Item
                                label={t("Department")}
                                name="DepartmentID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please select"),
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("Select DepartmentID")}
                                    allowClear
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {subdepartment.map((subdepartment) => (
                                        <Option key={subdepartment.ID} value={subdepartment.ID}>
                                            {subdepartment.ShortName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("NameUzb")}
                                name={"NameUzb"}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid")
                                    },
                                ]}
                            >
                                <Input placeholder={t("NameUzb")} />
                            </Form.Item>
                            <Form.Item
                                label={t("status")}
                                name="StateID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("Select Status")}
                                    allowClear
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {status.map((status) => (
                                        <Option key={status.ID} value={status.ID}>
                                            {status.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label={t("NameRus")}
                                name="NameRus"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid")
                                    },
                                ]}
                            >
                                <Input placeholder={t("NameRus")} />
                            </Form.Item>
                        </Col>
                        <Col span={24} xl={8} lg={12}>
                            <div className={classes.SwitchWrapper}>
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

export default UpdateSubDepartment;