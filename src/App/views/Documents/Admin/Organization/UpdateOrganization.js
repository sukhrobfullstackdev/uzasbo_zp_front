import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Input, Spin, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';

import MainCard from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";
import OrganizationModal from "./OrganizationModal";
import OrganizationServices from "../../../../../services/Documents/Admin/Organization/Organization.services";
import classes from "./EmployeeMovement.module.css";

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};


const UpdateOrganization = (props) => {
    const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
    const [headerId, setHeaderId] = useState(null);
    const [docId] = useState(props.match.params.id ? props.match.params.id : 0[0]);
    const [loader, setLoader] = useState(true);


    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();
    const { size } = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [organizationLs] = await Promise.all([
                    OrganizationServices.getById(props.match.params.id ? props.match.params.id : 0),
                   
                ]);
                setLoader(false);
                // console.log(organizationLs);
                mainForm.setFieldsValue({
                    ...organizationLs.data,
                    // OblName: organizationLs.data.OblastID.toString(),
                   
                })
            } catch (err) {
                // console.log(err);
                Notification('error', err);
                setLoader(false);
            }
        }
        fetchData();
    }, [props.match.params.id, mainForm]);

    const getHeaderStaffListOrganizationName = (name, HeaderID) => {
        console.log(HeaderID);
         setHeaderId(HeaderID);
        mainForm.setFieldsValue({ HeaderStaffListOrganizationName: name, HeaderStaffListOrganizationID: HeaderID });
    };
    const onReset = () => {
        mainForm.setFieldsValue({ 
            HeaderStaffListOrganizationName: null,
            HeaderStaffListOrganizationID: null,
         });
    };

  

   

    const saveAllHandler = () => {
        setLoader(true);
        mainForm.validateFields()
            .then((values) => {
                console.log(values);
           
                setLoader(true);
                values.ID = +docId;
              
                values.HeaderStaffListOrganizationID = headerId ? headerId : null;
                // values.Date = values.Date.format('DD.MM.YYYY');
                // values.DateOfDismissal = values.DateOfDismissal.format('DD.MM.YYYY');
                console.log(values);
                OrganizationServices.postData(values)
                    .then(res => {
                        if (res.status === 200) {
                            Notification("success", t("saved"));
                            setLoader(false);
                            history.push('/Organization');
                        }
                    })
                    .catch(err => {
                        // console.log(err);
                        Notification('error', err)
                        setLoader(false);
                    })
            })
            .catch(err => {
                Notification('error', err);
            })
    }

    return (
        <Fade>
            <MainCard title={t('Organization')}>
                <Spin spinning={loader} size='large'>
                    <Form
                        {...layout}
                        form={mainForm}
                        id='mainForm'
                        scrollToFirstError
                    // onFinish={fillTableHandler}
                    // onFinishFailed={fillTableHandlerFailed}
                    >
                        <Row gutter={[16, 16]} align="top">
                            <Col span={24} xl={7} lg={12}>
                                <Form.Item
                                    label={t("Name")}
                                    name="Name"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("Name")} disabled />
                                </Form.Item>
                            </Col>

                            <Col span={12} xl={7} lg={12}>
                                <Form.Item
                                    label={t("INN")}
                                    name="INN"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("INN")} disabled />
                                </Form.Item>
                            </Col>

                            <Col span={12} xl={7} lg={12}>
                                <Form.Item
                                    label={t("accounter")}
                                    name="Accounter"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("accounter")} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24} xl={7} lg={12}>
                                <Form.Item
                                    label={t("address")}
                                    name="Adress"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("address")} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12} xl={7} lg={12}>
                                <Form.Item
                                    label={t("Cashier")}
                                    name="Cashier"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("Cashier")} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12} xl={7} lg={12}>
                                <Form.Item
                                    label={t("ContactInfo")}
                                    name="ContactInfo"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("ContactInfo")} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24} xl={7} lg={12}>
                                <Form.Item
                                    label={t("director")}
                                    name="Director"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("director")} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24} xl={7} lg={12}>
                                <Form.Item
                                    label={t("OrgFullName")}
                                    name="FullName"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("OrgFullName")} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24} xl={7} lg={12}>
                                <div className={classes.EmployeeEnrolmentModal}>
                                    <CSSTransition
                                        mountOnEnter
                                        unmountOnExit
                                        in={employeeEnrQualicationModal}
                                        timeout={300}
                                    >
                                        <OrganizationModal
                                            visible={employeeEnrQualicationModal}
                                            onCancel={() => setEmployeeEnrQualicationModal(false)}
                                            getHeaderStaffListOrganizationName={getHeaderStaffListOrganizationName}
                                        />
                                    </CSSTransition>
                                    <Form.Item
                                        label={t("HeaderStaffListOrganizationName")}
                                        name="HeaderStaffListOrganizationName"
                                        style={{ width: "100%" }}
                                        rules={[
                                            {
                                                // required: true,
                                                message: t("Please input valid"),
                                            },
                                        ]}>
                                        <Input disabled
                                            style={{ color: 'black' }} />
                                    </Form.Item>
                                    <Button
                                        type="primary"
                                        onClick={() => {
                                            setEmployeeEnrQualicationModal(true);
                                        }}
                                        shape="circle"
                                        style={{ marginTop: 38 }}
                                        icon={<SearchOutlined />}
                                        size={size}
                                    />
                                    <Button
                                        type="primary"
                                        onClick={onReset}
                                        shape="circle"
                                        style={{ marginTop: 38 }}
                                        icon={<DeleteOutlined />}
                                        size={size}
                                    />
                                </div>
                            </Col>
                            <Col span={12} xl={7} lg={12}>
                                <Form.Item
                                    label={t("OblName")}
                                    name="OblName"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("OblName")} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12} xl={7} lg={12}>
                                <Form.Item
                                    label={t("RegName")}
                                    name="RegName"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("RegName")} disabled />
                                </Form.Item>
                            </Col>

                            <Col span={12} xl={7} lg={12}>
                                <Form.Item
                                    label={t("zip code")}
                                    name="ZipCode"
                                    // rules={[
                                    //     {
                                    //         required: true,
                                    //         message: t("inputValidData")
                                    //     },
                                    // ]}
                                >
                                    <Input placeholder={t("zip code")} disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                   
                    <Space size='middle' className='btns-wrapper'>
                        <Button
                            type="danger"
                            onClick={() => {
                                Notification("warning", t("not-saved"));
                                history.goBack();
                            }}
                        >
                            {t("back")}
                        </Button>
                        <Button
                            onClick={saveAllHandler}
                            type="primary"
                        >
                            {t("save")}
                        </Button>
                    </Space>
                </Spin>
            </MainCard>
        </Fade >
    );
};

export default UpdateOrganization;
