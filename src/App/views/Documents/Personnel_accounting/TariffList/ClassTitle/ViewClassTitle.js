import React, { useState, useEffect } from 'react';
import { Spin, Form, Row, Col, DatePicker, InputNumber, Select, Input, Button, Table, Switch, Modal, Space, Tag, Card } from 'antd';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';
import { CloseOutlined, CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';

import HelperServices from "../../../../../../services/Helper/helper.services";
import classes from "./ClassTitle.module.css";
import MainCard from "../../../../../components/MainCard";
import classLetters from "../../../../../../helpers/classLetters"
import shifts from "../../../../../../helpers/shifts"
import { Notification } from "../../../../../../helpers/notifications";
import ClassTitleServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitle.services";

const { confirm } = Modal;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};
const { Option } = Select;
const { TextArea } = Input;

// let editing = false;

const ViewClassTitle = (props) => {
    const { t } = useTranslation();
    const [mainForm] = Form.useForm();
    const [cancelForm] = Form.useForm();
    const history = useHistory();
    const [classTableForm] = Form.useForm();
    const docId = props.match.params.id ? props.match.params.id : 0;
    const receivedRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('AcceptClassTitleRegistryIndexSend');
    const receivedCancelRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('CancelBillingListSend');

    const [classTitle, setClassTitle] = useState([]);
    const [blhgTypeList, setBlhgTypeList] = useState([]);
    const [specializedSubjectsList, setSpecializedSubjectsList] = useState([]);
    const [classList, setClassList] = useState([]);
    const [classLanguageList, setClassLanguageList] = useState([]);
    const [classTableData, setClassTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredTableData, setFilteredTableData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {

            const [classTitleLs, blhgLsType, specializedSubjectsLt, classLs, classLanguageLs] = await Promise.all([
                ClassTitleServices.getById(docId),
                HelperServices.getBLHGTypeList(),
                HelperServices.getSpecializedSubjectsList(),
                HelperServices.getClassNumberList(),
                HelperServices.getClassLanguageList()
            ]);
            setClassTitle(classTitleLs.data);
            setClassTableData(classTitleLs.data.Tables);
            setFilteredTableData(classTitleLs.data.Tables);
            setBlhgTypeList(blhgLsType.data);
            setSpecializedSubjectsList(specializedSubjectsLt.data);
            // console.log(specializedSubjectsLt.data)
            setClassList(classLs.data);
            console.log(classLs.data)
            setClassLanguageList(classLanguageLs.data)
            setLoading(false);
            mainForm.setFieldsValue({
                ...classTitleLs.data,
                Date: moment(classTitleLs.data.Date, 'DD.MM.YYYY')
            })
        }
        fetchData().catch(err => {
            // console.log(err);
            Notification('error', err);
        });
    }, [docId, mainForm])



    const classTableColumns = [
        {
            title: t("ClassNumberName"),
            dataIndex: "ClassNumberName",
            key: "ClassNumberName",
            sorter: true,
            width: 180,
            // render: (value) => {
            //   const classLs = classList.find(item => item.ID === value);
            //   return classLs ? classLs.NameUzb : '';
            // }

        },
        {
            title: t("Name"),
            dataIndex: "Name",
            key: "Name",
            width: 150,
            sorter: true,
            // render: (value) => { 
            //   const classLettersLs = classLetters.find(item => item.id === value);
            //   return classLettersLs ? classLettersLs.name : '';
            // }
        },
        {
            title: t("ChildrenCount"),
            dataIndex: "ChildrenCount",
            key: "ChildrenCount",
            sorter: true,
            width: 120
        },
        {
            title: t("FemaleCount"),
            dataIndex: "FemaleCount",
            key: "FemaleCount",
            sorter: true,
            width: 120
        },
        {
            title: t("TeachingAtHomeCount"),
            dataIndex: "TeachingAtHomeCount",
            key: "TeachingAtHomeCount",
            sorter: true,
            width: 150
        },
        {
            title: t("ClassLanguageName"),
            dataIndex: "ClassLanguageID",
            key: "ClassLanguageName",
            sorter: true,
            render: (value) => {
                const classLanguageLs = classLanguageList.find(item => item.ID === value);
                return classLanguageLs ? classLanguageLs.Name : '';
            }
        },
        {
            title: t("ShiftName"),
            dataIndex: "ShiftName",
            key: "ShiftName",
            sorter: true,
            render: (value) => {
                const shiftsLs = shifts.find(item => item.name === value);
                return shiftsLs ? shiftsLs.name : '';
            }
        },
        {
            title: t("IsSpecialized"),
            dataIndex: "IsSpecialized",
            sorter: true,
            render: (value) => (< Switch defaultChecked={value} disabled />),
            width: 180
        },
        {
            title: t("SubjectName"),
            dataIndex: "Subjects",
            sorter: true,
            width: 240,
            render: (value) => {
                // console.log(value);
                // const specializedSubjectsLt = specializedSubjectsList.find(item => item.ID === value);
                // console.log(specializedSubjectsLt);
                // return specializedSubjectsLt ? specializedSubjectsLt.Name : '';
                if (value.length > 0) {
                    return value.map(subject => `${subject}; `);
                } else {
                    return null;
                }
            }
        }
    ]
    // End Class Table functions

    const onSearch = (event) => {
        const filteredTable = classTableData.filter(model => model.ClassNumberName.toLowerCase().includes(event.target.value.toLowerCase()));
        setFilteredTableData(filteredTable);
    };

    const handleRecieved = (id) => {
        // console.log(id);
        confirm({
            title: t('receive'),
            icon: <InfoCircleOutlined />,
            content: t('acceptText'),
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                setLoading(true);
                ClassTitleServices.Received(id)
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('success-msg'));
                            history.push('/ClassTitle')
                            setLoading(false);
                        }
                    }).catch((err) => {
                        Notification('error', err);
                        setLoading(false);
                    })
            }
        });
    }

    const handleRecievedCancel = (id) => {
        // console.log(id);
        confirm({
            title: t('receiveCancel'),
            icon: <InfoCircleOutlined />,
            content:
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Form
                        form={cancelForm}
                        id='cancelForm'
                        layout='vertical'
                    >
                        <Form.Item
                            label={t("Description")}
                            name="Description"
                            rules={[
                                {
                                    required: true,
                                    message: t("inputValidData")
                                },
                            ]}
                        >
                            <Input
                                placeholder={t('Description')}
                                style={{ width: "300px" }}
                            />
                        </Form.Item>
                    </Form>
                </div>,
            okText: t('yes'),
            cancelText: t('cancel'),
            onOk: () => {
                cancelForm.validateFields()
                    .then(values => {
                        setLoading(true);
                        ClassTitleServices.ReceivedCancel(id, values.Description)
                            .then((res) => {
                                if (res.status === 200) {
                                    Notification('success', t('success-msg'));
                                    history.push('/ClassTitle')
                                    setLoading(false);
                                }
                            }).catch((err) => {
                                Notification('error', err);
                                setLoading(false);
                            })
                    }).catch((err) => {
                        Notification('error', t('PleaseFill'));
                    });
            }
        });
    }

    return (
        <Fade>
            <MainCard title={t('ClassTitle')}>
                <Spin spinning={loading} size='large'>
                    <Form
                        {...layout}
                        form={mainForm}
                        id='mainForm'
                    // onFinish={fillTableHandler}
                    // onFinishFailed={fillTableHandlerFailed}
                    >
                        <Row gutter={[16, 16]}>
                            {/* <Col xl={3}>
                                <Form.Item
                                    label={t("Date")}
                                    name="Date"
                                    rules={[
                                        {
                                            // required: true,
                                            message: t("pleaseSelect"),
                                        },
                                    ]}
                                >
                                    <DatePicker disabled placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xl={2}>
                                <Form.Item
                                    label={t("StartYear")}
                                    name="StartYear"
                                    rules={[
                                        {
                                            // required: true,
                                            message: t("inputValidData")
                                        },
                                    ]}
                                >
                                    <InputNumber disabled placeholder={t("StartYear")} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col xl={2}>
                                <Form.Item
                                    label={t("EndYear")}
                                    name="EndYear"
                                    rules={[
                                        {
                                            // required: true,
                                            message: t("inputValidData")
                                        },
                                    ]}
                                >
                                    <InputNumber disabled placeholder={t("EndYear")} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col> */}

                            {/* <Col xl={4}>
                                <Form.Item
                                    label={t("BLHGListType")}
                                    name="BLHGTypeID"
                                    rules={[
                                        {
                                            // required: true,
                                            message: t("pleaseSelect")
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        showSearch disabled
                                        placeholder={t("BLHGListType")}
                                        style={{ width: '100%' }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {blhgTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col> */}

                            {/* <Col xl={4}>
                                <Form.Item
                                    label={t("SpecializedSubjects")}
                                    name="SpecializedSubjectsID"
                                >
                                    <Select
                                        allowClear
                                        showSearch disabled
                                        placeholder={t("SpecializedSubjects")}
                                        style={{ width: '100%' }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {specializedSubjectsList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col> */}

                            {/* <Col xl={7} lg={12} md={16}>
                                <Form.Item
                                    label={t("Comment")}
                                    name="Comment"
                                    rules={[
                                        {
                                            // required: true,
                                            message: t("inputValidData")
                                        },
                                    ]}
                                >
                                    <TextArea disabled placeholder={t("Comment")} rows={1} />
                                </Form.Item>
                            </Col> */}

                            {/* <Col xl={2}>
                                <Form.Item
                                    label="&nbsp;"
                                    name='IsTown'
                                    valuePropName='checked'
                                >
                                    <Switch disabled checkedChildren={t('IsTown')}
                                        unCheckedChildren={t('district')}> </Switch>
                                </Form.Item>
                            </Col> */}
                        </Row>
                    </Form>
                    <Row gutter={[16, 16]}>
                        <Col xl={12}>
                            <Card>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("id")}: </div><div className={classes.value}>{classTitle.ID}</div>
                                </div>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("Date")}: </div><div className={classes.value}>{classTitle.Date}</div>
                                </div>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("acadYear")}: </div><div className={classes.value}>{classTitle.StartYear}/{classTitle.EndYear}</div>
                                </div>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("IsTown")}: </div><div className={classes.value}>{classTitle.IsTown ? t('yes') : t('no')}</div>
                                </div>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("XtvTarifficationTitleID")}: </div><div className={classes.value}>{classTitle.XtvTarifficationTitleID}</div>
                                </div>
                            </Card>
                        </Col>
                        <Col xl={12}>
                            <Card>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("BLHGTypeName")}: </div><div className={classes.value}>{classTitle.BLHGTypeName}</div>
                                </div>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("SpecializedSubjects")}: </div><div className={classes.value}>{
                                        // classTitle.SpecializedSubjects ? classTitle.SpecializedSubjects.map(subject => `${subject}; `) : t('no')
                                        classTitle.SpecializedSubjects ? classTitle.SpecializedSubjects : t('no')
                                    }</div>
                                </div>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("Comment")}: </div><div className={classes.value}>{classTitle.Comment}</div>
                                </div>
                                <div className={classes.orgInfo}>
                                    <div className={classes.key}>{t("Status")}: </div><div className={classes.value}>
                                        {classTitle.StatusID === 13 ?
                                            <Tag color='#87d068'>{classTitle.StatusName}</Tag> : <Tag color='#f50'> {classTitle.StatusName} </Tag>}
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xl={24}>
                            <div style={{ margin: '12px 0' }}>
                                <Input.Search
                                    className="table-search"
                                    enterButton
                                    placeholder={`${t('search')} (${t("ClassNumberName")})`}
                                    onChange={onSearch}
                                />
                                {(receivedRole && classTitle.CanReceive) && (
                                <Button
                                    type="primary"
                                    onClick={() => handleRecieved(props.match.params.id ? props.match.params.id : 0)}
                                >
                                    {t("receive")}
                                </Button>
                                )}
                                {(receivedCancelRole && classTitle.CanReceivedCancel) && (
                                <Button
                                    type="danger" style={{ marginLeft: 16 }}
                                    onClick={() => handleRecievedCancel(props.match.params.id ? props.match.params.id : 0)}
                                >
                                    {t("receiveCancel")}
                                </Button>
                                )}
                            </div>
                        </Col>
                    </Row>
                    <Form
                        form={classTableForm}
                        // onFinish={addClassTableDataHandler}
                        component={false}
                    >
                        <Table
                            bordered
                            size='middle'
                            rowClassName={'table-row'}
                            className="main-table"
                            rowKey={(record) => record.ID}
                            columns={classTableColumns}
                            dataSource={filteredTableData}
                            pagination={false}
                            scroll={{
                                x: "max-content",
                                y: '50vh'
                            }}
                        />
                    </Form>

                    <div className={classes.buttons} style={{ margin: 0 }}>
                        <Button
                            type="danger"
                            onClick={() => {
                                history.goBack();
                                // Notification("warning", t("not-saved"));
                            }}
                        >
                            {t("back")}
                        </Button>
                    </div>

                </Spin>
            </MainCard>
        </Fade>
    );
};

export default React.memo(ViewClassTitle);