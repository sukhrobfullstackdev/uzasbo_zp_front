import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, Form, Input, Modal, Row, Space, Spin, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import Card from "../../../../components/MainCard";
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../helpers/notifications';
import AdditionalTab from './components/AdditionalTab';
import Taxes from './components/Taxes';
import CalculationKindModal from './components/Modals/CalculationKindModal';
import SalaryTransactionModal from './components/Modals/SalaryTransactionModal';
import SubCalculationKindServices from '../../../../../services/References/Organizational/SubCalculationKind/SubCalculationKind.services';
import PercentHistoryTable from './components/PercentHistoryTable';
import CalculationTypeTable from './components/CalculationTypeTable';

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const { TabPane } = Tabs;

const UpdateSubCalculationKind = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
    const subalcKindList = useSelector((state) => state.subalcKindList);
    let OrgID = subalcKindList?.filterData.OrgID;

    const [loader, setLoader] = useState(true);
    const [subCalculationKind, setSubCalculationKind] = useState([]);
    const [salaryTransactionModal, setSalaryTransactionModal] = useState(false);
    const [salaryTransactionParams, setSalaryTransactionParams] = useState([]);
    const [calculationKindModal, setCalculationKindModal] = useState(false);
    const [calculationKindParams, setCalculationKindParams] = useState([]);
    const [fillSubCalculationButton, setFillSubCalculationButton] = useState(false);
    const [fillSubCalculationLoader, setFillSubCalculationLoader] = useState(false);
    const [Additional, setAdditional] = useState([]);
    const [Tables, setTables] = useState([]);
    const [Tables1, setTables1] = useState([]);
    const [PerHistory, setPerHistory] = useState([]);

    const [calculationTypeID, setCalculationTypeID] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [subCalculationKind,] = await Promise.all([
                SubCalculationKindServices.getById(props.match.params.id ? props.match.params.id : `0&OrganizationID=${OrgID}`),

            ]);
            // if (props.match.params.id ? props.match.params.id : 0) {
            // console.log(subCalculationKind.data);  
            setSubCalculationKind(subCalculationKind.data);
            subCalculationKind.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(subCalculationKind.data.Tables);
            // setTables1(subCalculationKind.data.Tables1);
            subCalculationKind.data.PerHistory.map((data) => {
                data.key = Math.random();
                return data;
            })
            setPerHistory(subCalculationKind.data.PerHistory);
            // }

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...subCalculationKind.data,
                });
                setCalculationTypeID(subCalculationKind.data.CalculationTypeID)
            } else {
                mainForm.setFieldsValue({
                    ID: 0,
                });
            }
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const onSelect = (data) => {
        // console.log(data);
        // console.log({ [`${data.Name}`]: data.NameValue });
        // console.log({ [`${data.id}`]: data.ID });
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID,
        });
    };

    const onSelectParent = (data) => {
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID,
            [`CalculationTypeID`]: data.CalculationTypeID,
            [`ChargeFromAllSource`]: false,
        });
        setCalculationTypeID(data.CalculationTypeID)
    };

    const onMainFormFinish = (values) => {
        // console.log({
        //     ...subCalculationKind, ...values, ...Additional,
        //     OrganizationID: OrgID,
        //     Tables: Tables,
        //     Tables1: Tables1,
        //     PerHistory: PerHistory,
        // });
        setLoader(true);
        SubCalculationKindServices.update({
            ...subCalculationKind, ...values, ...Additional,
            OrganizationID: OrgID,
            Tables: Tables,
            Tables1: Tables1,
            PerHistory: PerHistory,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/subCalculationKind`);
                    Notification('success', t('success-msg'));
                }
            })
            .catch((err) => {
                Notification('error', err);
                setLoader(false);
            });
    };

    const openSalaryTransactionModal = (params) => {
        setSalaryTransactionParams(params);
        setSalaryTransactionModal(true);
    };

    const openCalculationKindModal = (params) => {
        setCalculationKindParams(params);
        setCalculationKindModal(true);
    };

    function confirmDeleteCalcTypeTable() {
        Modal.confirm({
            title: t('DeleteAll'),
            icon: <ExclamationCircleOutlined />,
            content: t('delete'),
            okText: 'OK',
            cancelText: t('cancel'),
            onOk: () => {
                setTables([]);
                setFillSubCalculationButton(false);
            }
        });
    };

    const fillSubCalculationKindTable = () => {
        setFillSubCalculationLoader(true);
        SubCalculationKindServices.fillSubCalculationKindTable({OrganizationID:OrgID})
            .then((res) => {
                res.data.map((data) => {
                    data.key = Math.random();
                    return data;
                })
                // console.log({ ...subCalculationKind, Tables: res.data });
                // setSubCalculationKind({ ...subCalculationKind, Tables: res.data });
                setTables(res.data);
                setFillSubCalculationButton(true);
                setFillSubCalculationLoader(false);
            }).catch((err) => {
                Notification('error', err);
                setFillSubCalculationLoader(false);
            });
    };

    const editAdditionalData = (data) => {
        setAdditional(data);
    };
    const editSubCalcKindTableData = (data) => {
        setTables(data);
    };
    const editTaxesTableData = (data) => {
        // console.log(data);
        setTables1(data);
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
                                label={t("Vish")}
                                name="ParentName"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    readOnly
                                    className={'addonInput'}
                                    addonAfter={
                                        <div style={{ display: 'flex' }}>
                                            <div
                                                onClick={() => openCalculationKindModal({
                                                    Name: 'ParentName',
                                                    ID: 'ParentID'
                                                })}
                                            >
                                                <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                            </div>
                                            {/* <div
                                                onClick={() => openCalculationKindModal({
                                                })}
                                            >
                                                <i className="fa fa-times" style={{ color: 'white', margin: '0 6px' }} />
                                            </div> */}
                                        </div>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("Vish")}
                                name="ParentID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
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
                                <Input
                                    className={'addonInput'}
                                />
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
                                label={t("SalaryTransaction")}
                                name="SalaryTransactionName"
                                style={{ width: "100%" }}
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    readOnly
                                    className={'addonInput'}
                                    addonAfter={
                                        <div style={{ display: 'flex' }}>
                                            <div
                                                onClick={() => openSalaryTransactionModal({
                                                    Name: 'SalaryTransactionName',
                                                    ID: 'SalaryTransactionID',
                                                    OrganizationID: OrgID
                                                })}
                                            >
                                                <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                            </div>
                                            {/* <div
                                                onClick={() => openSalaryTransactionModal({
                                                })}
                                            >
                                                <i className="fa fa-times" style={{ color: 'white', margin: '0 6px' }} />
                                            </div> */}
                                        </div>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("SalaryTransaction")}
                                name="SalaryTransactionID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        {calculationTypeID ? (
                            <Col span={24} xl={6} md={12}>
                                <Form.Item
                                    label="&zwnj;"
                                    name="ChargeFromAllSource"
                                    valuePropName="checked"
                                >
                                    <Checkbox disabled={calculationTypeID === (1 || 6)}>
                                        {t("Удерживат из всех Л/С")}
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        ) : (
                            <Col span={24} xl={6} md={12}>
                                <Form.Item
                                    label="&zwnj;"
                                    name="ChargeFromAllSource"
                                    valuePropName="checked"
                                >
                                    <Checkbox disabled={true} >
                                        {t("Удерживат из всех Л/С")}
                                    </Checkbox>
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                    <Tabs type="card"
                    // onChange={callback}
                    >
                        <TabPane tab={t('Дополнительнo')} key="1">
                            <AdditionalTab
                                mainForm={mainForm}
                                data={subCalculationKind}
                                editAdditionalData={editAdditionalData}
                            />
                        </TabPane>
                        <TabPane tab={t("Используемый вид расчета")} key="2">
                            <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                <Button
                                    type="secondary"
                                    onClick={confirmDeleteCalcTypeTable}
                                >
                                    {t('DeleteAll')}
                                </Button>
                                <Button
                                    disabled={fillSubCalculationButton}
                                    loading={fillSubCalculationLoader}
                                    onClick={fillSubCalculationKindTable}
                                    type="primary"
                                >
                                    {t('Заполнить все начисление')}
                                </Button>
                            </Space>
                            <CalculationTypeTable
                                data={Tables}
                                editSubCalcKindTableData={editSubCalcKindTableData}
                            />
                        </TabPane>
                        <TabPane tab={t("Процент")} key="3">
                            <PercentHistoryTable
                                data={PerHistory}
                                editPerHistoryTableData={editPerHistoryTableData}
                            />
                        </TabPane>
                        <TabPane tab={t("Налоги и Отчисление")} key="4">
                            <Taxes
                                data={subCalculationKind.Tables1}
                                editTaxesTableData={editTaxesTableData}
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
                    {adminViewRole && (
                        <Button
                            htmlType="submit"
                            form="mainForm"
                            type="primary"
                        >
                            {t("save")}
                        </Button>
                    )}
                </Space>
            </Spin>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={salaryTransactionModal}
                timeout={300}
            >
                <SalaryTransactionModal
                    visible={salaryTransactionModal}
                    params={salaryTransactionParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setSalaryTransactionModal(false);
                    }}
                />
            </CSSTransition>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={calculationKindModal}
                timeout={300}
            >
                <CalculationKindModal
                    visible={calculationKindModal}
                    params={calculationKindParams}
                    onSelect={onSelectParent}
                    onCancel={() => {
                        setCalculationKindModal(false);
                    }}
                />
            </CSSTransition>
        </Card>
    )
}

export default React.memo(UpdateSubCalculationKind);