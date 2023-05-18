import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, Form, Input, Modal, Row, Select, Space, Spin, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import Card from "../../../../components/MainCard";
import { useHistory } from 'react-router-dom';
import { Notification } from '../../../../../helpers/notifications';
import TPSubCalculationKindServices from '../../../../../services/References/Template/TPSubCalculationKind/TPSubCalculationKind.services';
import PercentHistoryTable from '../../Organizational/SubCalculationKind/components/PercentHistoryTable';
import SalaryTransactionModal from '../../Organizational/SubCalculationKind/components/Modals/SalaryTransactionModal';
import CalculationKindModal from '../../Organizational/SubCalculationKind/components/Modals/CalculationKindModal';
import AdditionalTab from './components/AdditionalTab';
import HelperServices from '../../../../../services/Helper/helper.services';
import Taxes from '../../Organizational/SubCalculationKind/components/Taxes';
import CalculationTypeTable from './components/CalculationTypeTable';

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

const TPUpdateSubCalculationKind = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [mainForm] = Form.useForm();

    const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    const [loader, setLoader] = useState(false);
    const [tpSubCalculationKind, setSubCalculationKind] = useState([]);
    const [salaryTransactionModal, setSalaryTransactionModal] = useState(false);
    const [salaryTransactionParams, setSalaryTransactionParams] = useState([]);
    const [calculationKindModal, setCalculationKindModal] = useState(false);
    const [calculationKindParams, setCalculationKindParams] = useState([]);
    const [fillSubCalculationButton, setFillSubCalculationButton] = useState(false);
    const [fillSubCalculationLoader, setFillSubCalculationLoader] = useState(false);
    const [organizationTypeList, setOrganizationTypeList] = useState([]);
    const [Additional, setAdditional] = useState([]);
    const [Tables, setTables] = useState([]);
    const [Tables1, setTables1] = useState([]);
    const [PerHistory, setPerHistory] = useState([]);

    const [calculationTypeID, setCalculationTypeID] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tpSubCalculationKind, organizationTypeList] = await Promise.all([
                TPSubCalculationKindServices.getById(props.match.params.id ? props.match.params.id : `0`),
                HelperServices.GetAllOrganizationType(),
            ]);
            // if (props.match.params.id ? props.match.params.id : 0) {
            setSubCalculationKind(tpSubCalculationKind.data);
            tpSubCalculationKind.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(tpSubCalculationKind.data.Tables);
            setTables1(tpSubCalculationKind.data.Tables1);
            tpSubCalculationKind.data.PerHistory?.map((data) => {
                data.key = Math.random();
                return data;
            })
            setPerHistory(tpSubCalculationKind.data.PerHistory);
            setOrganizationTypeList(organizationTypeList.data);
            // }

            if (props.match.params.id) {
                mainForm.setFieldsValue({
                    ...tpSubCalculationKind.data,
                });
                setCalculationTypeID(tpSubCalculationKind.data.CalculationTypeID)
            } else {
                mainForm.setFieldsValue({
                    ID: 0,
                });
            }
            setFillSubCalculationButton(false);
            setLoader(false);
        };
        setLoader(true);
        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [props.match.params.id, mainForm]);

    const handleOrganizationTypeID = (id) => {
        console.log(id);
        if (!props.match.params.id) {
            setLoader(true);
            TPSubCalculationKindServices.getById(`0&OrganizationTypeID=${id}`)
                .then(res => {
                    setSubCalculationKind(res.data);
                    setTables1(res.data.Tables1);
                    setLoader(false);
                }).catch(err => {
                    Notification('error', err)
                    setLoader(false);
                })
        }
    }

    const onSelect = (data) => {
        // console.log(data);
        // console.log({ [`${data.Name}`]: data.NameValue });
        // console.log({ [`${data.id}`]: data.ID });
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID
        });
    };

    const onSelectParent = (data) => {
        // console.log(data);
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID,
            [`CalculationTypeID`]: data.CalculationTypeID,
            [`ChargeFromAllSource`]: false,
        });
        // console.log(data.CalculationTypeID);
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
        TPSubCalculationKindServices.update({
            ...tpSubCalculationKind, ...values, ...Additional,
            Tables: Tables,
            Tables1: Tables1,
            PerHistory: PerHistory,
        })
            .then((res) => {
                if (res.status === 200) {
                    setLoader(false);
                    history.push(`/TPSubCalculationKind`);
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
            cancelText: t('Cancel'),
            onOk: () => setSubCalculationKind({ ...tpSubCalculationKind, Tables: [] })
        });
    };

    const fillSubCalculationKindTable = () => {
        setFillSubCalculationLoader(true);
        TPSubCalculationKindServices.fillSubCalculationKindTable({ OrganizationTypeId: tpSubCalculationKind.OrganizationTypeID })
            .then((res) => {
                res.data.map((data) => {
                    data.key = Math.random();
                    return data;
                })
                // console.log({ ...subCalculationKind, Tables: res.data });
                // setSubCalculationKind({ ...tpSubCalculationKind, Tables: res.data });
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
                        <Col span={12} xl={6} md={12}>
                            <Form.Item
                                label={t("OrganizationType")}
                                name="OrganizationTypeID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("OrganizationType")}
                                    // style={{ marginBottom: 0 }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={handleOrganizationTypeID}
                                >
                                    {organizationTypeList.map(item =>
                                        <Option key={item.ID} value={item.ID} >
                                            {item.DisplayName}
                                        </Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12} xl={6} md={12}>
                            <Form.Item
                                label="&zwnj;"
                                name="ChargeFromAllSource"
                                valuePropName="checked"
                            >
                                <Checkbox disabled={!(calculationTypeID === 2 || calculationTypeID === 6)}>
                                    {t("Удерживат из всех Л/С")}
                                </Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Tabs type="card"
                    // onChange={callback}
                    >
                        <TabPane tab={t('Дополнительнo')} key="1">
                            <AdditionalTab
                                mainForm={mainForm}
                                data={tpSubCalculationKind}
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
                                data={tpSubCalculationKind.Tables1}
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

export default React.memo(TPUpdateSubCalculationKind);