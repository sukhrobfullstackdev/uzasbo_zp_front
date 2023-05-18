import React, { useEffect, useState } from 'react';
import { Checkbox, Col, Form, Input, Row, Select, InputNumber } from "antd";
import { useTranslation } from 'react-i18next';
import { CSSTransition } from 'react-transition-group';
import ScholarshipCategoryModal from './Modals/ScholarshipCategoryModal';
import ItemOfExpensesModal from './Modals/ItemOfExpensesModal';
import HelperServices from '../../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../../helpers/notifications';
import TpOwnerModal from './Modals/TpOwnerModal';
import TaxReliefServices from '../../../../../../services/References/Global/TaxRelief/TaxRelief.services';

const { Option } = Select;

const AdditionalTab = ({ data, editAdditionalData, mainForm }) => {
    // console.log(data);
    const { t } = useTranslation();
    // const [mainForm] = Form.useForm();

    const [itemOfExpensesModal, setItemOfExpensesModal] = useState(false);
    const [scholarshipCategoryModal, setScholarshipCategoryModal] = useState(false);
    const [tpOwnerModal, setTpOwnerModal] = useState(false);
    const [itemOfExpensesParams, setItemOfExpensesParams] = useState([]);
    const [scholarshipCategoryParams, setScholarshipCategoryParams] = useState([]);
    const [tpOwnerParams, setTpOwnerParams] = useState([]);
    const [taxItemList, setTaxItemList] = useState([]);
    const [taxReliefList, setTaxReliefList] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            const [taxItemList, taxReliefList,] = await Promise.all([
                HelperServices.GetTaxItemList(),
                TaxReliefServices.GetIncomeTaxReliefList(),
            ]);
            setTaxItemList(taxItemList.data);
            setTaxReliefList(taxReliefList.data.rows);
        }
        fetchData().catch(err => {
            Notification('error', err);
        });
    }, [])
    
    const onSelect = (data) => {
        // console.log(data);
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onChangeAllowForRate = (event) => {
        mainForm.setFieldsValue({
            [`AllowForRate`]: event.target.checked,
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onChangeByTimeSheet = (event) => {
        mainForm.setFieldsValue({
            [`ByTimeSheet`]: event.target.checked,
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onChangeByHourTimeSheet = (event) => {
        mainForm.setFieldsValue({
            [`ByHourTimeSheet`]: event.target.checked,
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onChangeNotPayAboveNorm = (event) => {
        mainForm.setFieldsValue({
            [`NotPayAboveNorm`]: event.target.checked,
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onChangeNotPayOnBusTrip = (event) => {
        mainForm.setFieldsValue({
            [`NotPayOnBusTrip`]: event.target.checked,
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onChangePayOnlyMadeWork = (event) => {
        mainForm.setFieldsValue({
            [`PayOnlyMadeWork`]: event.target.checked,
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onChangeShortNameUzb = (event) => {
        mainForm.setFieldsValue({
            [`ShortNameUzb`]: event.target.value
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onChangeShortNameRus = (event) => {
        mainForm.setFieldsValue({
            [`ShortNameRus`]: event.target.value
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onSelectTaxItem = (value) => {
        mainForm.setFieldsValue({
            [`TaxItemID`]: value
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onSelectIncomeTaxRelief = (value) => {
        mainForm.setFieldsValue({
            [`IncomeTaxReliefid`]: value
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onSelectSocialTaxRelief = (value) => {
        mainForm.setFieldsValue({
            [`SocialTaxReliefID`]: value
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onSelectState = (value) => {
        mainForm.setFieldsValue({
            [`StateID`]: value
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const onChangeNormativeAct = (event) => {
        mainForm.setFieldsValue({
            [`NormativeAct`]: event.target.value
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    const openItemOfExpensesModal = (params) => {
        setItemOfExpensesParams(params);
        setItemOfExpensesModal(true);
    };
    const openScholarshipCategoryModal = (params) => {
        setScholarshipCategoryParams(params);
        setScholarshipCategoryModal(true);
    };
    const openTPOwnerModal = (params) => {
        setTpOwnerParams(params);
        setTpOwnerModal(true);
    };

    const clearSelected = (params) => {
        mainForm.setFieldsValue({
            [`${params.Name}`]: null,
            [`${params.ID}`]: null
        });
        editAdditionalData(mainForm.getFieldsValue());
    };

    return (
        <>
            <Row gutter={[15, 0]}>
                <Col span={24} xl={6} md={12}>
                    <Form.Item
                        label={t("NormativeAct")}
                        name="NormativeAct"
                        style={{ width: "100%" }}
                        rules={[
                            {
                                required: false,
                                message: t("Please input valid"),
                            },
                        ]}>
                        <Input
                            onChange={onChangeNormativeAct}
                            className={'addonInput'}
                        />
                    </Form.Item>
                </Col>
                <Col span={24} xl={6} md={12}>
                    <Form.Item
                        label={t("State")}
                        name="StateID"
                        style={{ width: "100%" }}
                        rules={[
                            {
                                required: true,
                                message: t("pleaseSelect"),
                            },
                        ]}>
                        <Select
                            placeholder={t("Select from list")}
                            allowClear
                            onSelect={onSelectState}
                            getPopupContainer={(trigger) => trigger.parentNode}
                        >
                            <Option key={1} value={1}>
                                {t("active")}
                            </Option>
                            <Option key={2} value={2}>
                                {t("passive")}
                            </Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24} xl={6} md={12}>
                    <Form.Item
                        label={t("Code3")}
                        name="ItemOfExpensesName"
                        rules={[
                            {
                                required: false,
                                message: t("pleaseSelect"),
                            },
                        ]}
                    >
                        <Input
                            readOnly
                            className={'addonInput'}
                            addonAfter={
                                <div style={{ display: 'flex' }}>
                                    <div
                                        onClick={() => openItemOfExpensesModal({
                                            Name: 'ItemOfExpensesName',
                                            ID: 'ItemOfExpensesID',
                                        })}
                                    >
                                        <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                    </div>
                                    <div
                                        onClick={() => clearSelected({
                                            Name: 'ItemOfExpensesName',
                                            ID: 'ItemOfExpensesID',
                                        })}
                                    >
                                        <i className="fa fa-times" style={{ color: 'white', margin: '0 6px' }} />
                                    </div>
                                </div>
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label={t("ItemOfExpensesID")}
                        name="ItemOfExpensesID"
                        hidden={true}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={24} xl={6} md={12}>
                    <Form.Item
                        label={t("ScholarshipCategory")}
                        name="ScholarshipCategoryName"
                        style={{ width: "100%" }}
                        rules={[
                            {
                                required: false,
                                message: t("Please input valid"),
                            },
                        ]}>
                        <Input
                            readOnly
                            className={'addonInput'}
                            addonAfter={
                                <div style={{ display: 'flex' }}>
                                    <div
                                        onClick={() => openScholarshipCategoryModal({
                                            Name: 'ScholarshipCategoryName',
                                            ID: 'ScholarshipCategoryID',
                                        })}
                                    >
                                        <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                    </div>
                                    <div
                                        onClick={() => clearSelected({
                                            Name: 'ScholarshipCategoryName',
                                            ID: 'ScholarshipCategoryID',
                                        })}
                                    >
                                        <i className="fa fa-times" style={{ color: 'white', margin: '0 6px' }} />
                                    </div>
                                </div>
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label={t("ScholarshipCategory")}
                        name="ScholarshipCategoryID"
                        hidden={true}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12} xl={4} md={8}>
                    <Form.Item
                        // label={t("AllowForRate")}
                        name="AllowForRate"
                        valuePropName="checked"
                    >
                        <Checkbox
                            onChange={onChangeAllowForRate}
                        >
                            {t("AllowForRate")}
                        </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12} xl={4} md={8}>
                    <Form.Item
                        // label={t("ByTimeSheet")}
                        name="ByTimeSheet"
                        valuePropName="checked"
                    >
                        <Checkbox
                            onChange={onChangeByTimeSheet}
                        >
                            {t("ByTimeSheet")}
                        </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12} xl={4} md={8}>
                    <Form.Item
                        // label={t("ByHourTimeSheet")}
                        name="ByHourTimeSheet"
                        valuePropName="checked"
                    >
                        <Checkbox
                            onChange={onChangeByHourTimeSheet}
                        >
                            {t("ByHourTimeSheet")}
                        </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12} xl={4} md={8}>
                    <Form.Item
                        // label={t("NotPayAboveNorm")}
                        name="NotPayAboveNorm"
                        valuePropName="checked"
                    >
                        <Checkbox
                            onChange={onChangeNotPayAboveNorm}
                        >
                            {t("NotPayAboveNorm")}
                        </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12} xl={4} md={8}>
                    <Form.Item
                        // label={t("NotPayOnBusTrip")}
                        name="NotPayOnBusTrip"
                        valuePropName="checked"
                    >
                        <Checkbox
                            onChange={onChangeNotPayOnBusTrip}
                        >
                            {t("NotPayOnBusTrip")}
                        </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12} xl={4} md={8}>
                    <Form.Item
                        // label={t("PayOnlyMadeWork")}
                        name="PayOnlyMadeWork"
                        valuePropName="checked"
                    >
                        <Checkbox
                            onChange={onChangePayOnlyMadeWork}
                        >
                            {t("PayOnlyMadeWork")}
                        </Checkbox>
                    </Form.Item>
                </Col>
                <Col span={12} xl={6} md={12}>
                    <Form.Item
                        label={t("ShortNameUzb")}
                        name="ShortNameUzb"
                        style={{ width: "100%" }}
                        rules={[
                            {
                                required: false,
                                message: t("Please input valid"),
                            },
                        ]}>
                        <Input
                            onChange={onChangeShortNameUzb}
                            className={'addonInput'}
                        />
                    </Form.Item>
                </Col>
                <Col span={12} xl={6} md={12}>
                    <Form.Item
                        label={t("ShortNameRus")}
                        name="ShortNameRus"
                        style={{ width: "100%" }}
                        rules={[
                            {
                                required: false,
                                message: t("Please input valid"),
                            },
                        ]}>
                        <Input
                            onChange={onChangeShortNameRus}
                            className={'addonInput'}
                        />
                    </Form.Item>
                </Col>
                <Col span={24} xl={6} md={12}>
                    <Form.Item
                        label={t("TaxItem")}
                        name="TaxItemID"
                        style={{ width: "100%" }}
                        rules={[
                            {
                                required: false,
                                message: t("pleaseSelect"),
                            },
                        ]}>
                        <Select
                            placeholder={t("Select from list")}
                            allowClear
                            onSelect={onSelectTaxItem}
                            getPopupContainer={(trigger) => trigger.parentNode}
                        >
                            {taxItemList.map((taxItem) => (
                                <Option key={taxItem.ID} value={taxItem.ID}>
                                    {taxItem.ItemShortName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24} xl={6} md={12}>
                    <Form.Item
                        label={t("IncomeTaxRelief")}
                        name="IncomeTaxReliefID"
                        style={{ width: "100%" }}
                        rules={[
                            {
                                required: false,
                                message: t("pleaseSelect"),
                            },
                        ]}>
                        <Select
                            placeholder={t("Select from list")}
                            allowClear
                            onSelect={onSelectIncomeTaxRelief}
                            getPopupContainer={(trigger) => trigger.parentNode}
                        >
                            {taxReliefList.map((taxItem) => (
                                <Option key={taxItem.ID} value={taxItem.ID}>
                                    {taxItem.NameRus}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24} xl={6} md={12}>
                    <Form.Item
                        label={t("SocialTaxRelief")}
                        name="SocialTaxRelief"
                        style={{ width: "100%" }}
                        rules={[
                            {
                                required: false,
                                message: t("pleaseSelect"),
                            },
                        ]}>
                        <Select
                            placeholder={t("Select from list")}
                            allowClear
                            onSelect={onSelectSocialTaxRelief}
                            getPopupContainer={(trigger) => trigger.parentNode}
                        >
                            {taxReliefList.map((taxItem) => (
                                <Option key={taxItem.ID} value={taxItem.ID}>
                                    {taxItem.NameRus}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24} xl={6} md={12}>
                    <Form.Item
                        label={t("TPOwnerID")}
                        name="TPOwnerName"
                        rules={[
                            {
                                required: false,
                                message: t("Please input valid"),
                            },
                        ]}>
                        <Input
                            // onChange={onChangeTPOwnerID}
                            readOnly 
                            style={{ width: "100%" }}
                            className={'addonInput'}
                            addonAfter={
                                <div style={{ display: 'flex' }}>
                                    <div
                                        onClick={() => openTPOwnerModal({
                                            Name: 'TPOwnerName',
                                            ID: 'TPOwnerID',
                                        })}
                                    >
                                        <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                    </div>
                                    <div
                                        onClick={() => clearSelected({
                                            Name: 'TPOwnerName',
                                            ID: 'TPOwnerID',
                                        })}
                                    >
                                        <i className="fa fa-times" style={{ color: 'white', margin: '0 6px' }} />
                                    </div>
                                </div>
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        label={t("TPOwnerID")}
                        name="TPOwnerID"
                        hidden={true}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={itemOfExpensesModal}
                timeout={300}
            >
                <ItemOfExpensesModal
                    visible={itemOfExpensesModal}
                    params={itemOfExpensesParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setItemOfExpensesModal(false);
                    }}
                />
            </CSSTransition>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={scholarshipCategoryModal}
                timeout={300}
            >
                <ScholarshipCategoryModal
                    visible={scholarshipCategoryModal}
                    params={scholarshipCategoryParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setScholarshipCategoryModal(false);
                    }}
                />
            </CSSTransition>
            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={tpOwnerModal}
                timeout={300}
            >
                <TpOwnerModal
                    visible={tpOwnerModal}
                    params={tpOwnerParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setTpOwnerModal(false);
                    }}
                />
            </CSSTransition>
        </>
    )
}

export default AdditionalTab;