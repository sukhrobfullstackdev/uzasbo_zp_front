import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import Card from "../../../../components/MainCard";
import classes from "./Department.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import DepartmentServices from "../../../../../services/References/Organizational/Department/department.services";

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
    const [division, setDivision] = useState([]);

    //onfinish
    const onFinish = (values) => {
        values.ID = props.match.params.id;
        DepartmentServices.update(values)
            .then((res) => {
                if (res.status === 200) {
                    history.push("/department");
                    Notification("success", t("saved"));
                }
            })
            .catch((err) => {
                // console.log(err);
                Notification('error', err);
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
                const division = await DepartmentServices.getById(props.match.params.id ? props.match.params.id : 0);
                const status = await HelperServices.getStateList();
                const divisionList = await HelperServices.GetDivisionList();
                setDivisionData(division.data);
                setStatus(status.data);
                setDivision(divisionList.data);
                setLoader(false);
            } catch (err) {
                alert(err);
                console.log(err);
            }
        }
        fetchData();

        HelperServices.GetDivisionList()
            .then((response) => {
                setDivision(response.data);
            })
            .catch((err) => {
                // console.log(err);
                Notification('error', err);
            });
    }, [props.match.params.id]);
    //useffect end

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
            <Card title={t("Department")}>
                <Form
                    {...layout}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    className={classes.FilterForm}
                    form={form}
                    initialValues={divisionData}
                >
                    <Row gutter={[16, 16]}>
                        <Col xl={8} lg={12}>
                            <Form.Item
                                label={t("Code")}
                                name="Code"
                                rules={[
                                    {
                                        required: true,
                                        message: t('Please input valid'),
                                    },
                                ]}
                            >
                                <Input placeholder={t("Code")} />
                            </Form.Item>
                            <Form.Item
                                label={t("division")}
                                name="DivisionID"

                            >
                                <Select
                                    placeholder={t("Select Division")}
                                    allowClear
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                                        0
                                    }
                                >
                                    {division.map((division) => (
                                        <Option key={division.ID} value={division.ID}>
                                            {division.ShortName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xl={8} lg={12}>
                            <Form.Item
                                label={t("shortname")}
                                name={"ShortName"}
                                rules={[
                                    {
                                        required: true,
                                        message: t('Please input valid'),
                                    },
                                ]}
                            >
                                <Input placeholder={t("shortname")} />
                            </Form.Item>
                            <Form.Item
                                label={t("status")}
                                name="StateID"
                                rules={[
                                    {
                                        required: true,
                                        message: t('Please select'),
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
                        </Col>
                        <Col xl={8} lg={12}>
                            <Form.Item
                                label={t("name")}
                                name="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: t('Please input valid'),
                                    },
                                ]}
                            >
                                <Input placeholder={t("name")} />
                            </Form.Item>

                            <div className={classes.SwitchWrapper}>
                                <Form.Item
                                    label={t("forStaffList")}
                                    name="ForStaffList"
                                    valuePropName="checked"
                                >
                                    <Switch />
                                </Form.Item>

                                <div className={classes.Buttons}>
                                    <Button
                                        type="danger"
                                        onClick={() => {
                                            history.goBack();
                                            Notification("success", t("not-saved"));
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
