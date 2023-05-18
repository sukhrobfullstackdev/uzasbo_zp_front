import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next';

import { Notification } from '../../../../../helpers/notifications';
import HelperServices from '../../../../../services/Helper/helper.services';
import TPListOfPositionServices from "./../../../../../services/References/Template/TPListOfPosition/TPListOfPosition.services";
import { CSSTransition } from 'react-transition-group';
import TariffScaleModal from './components/TariffScaleModal';
import TPListOfPositionCategoryServices from '../../../../../services/References/Template/TPListOfPositionCategory/TPListOfPositionCategory.services';

const { Option } = Select;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const UpdateTPListOfPositionModal = (props) => {
    // console.log(props.data);
    const { ID } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [tpListOfPosition, setTPListOfPosition] = useState({});
    const [orgTypeList, setOrgTypeList] = useState([]);
    const [tpListOfPositionCategory, setTPListOfPositionCategory] = useState([]);
    const [tariffScaleModal, setTariffScaleModal] = useState(false);
    const [tariffScaleParams, setTariffScaleParams] = useState(null);
    const [OrganizationTypeID, setOrganizationTypeID] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const [tpListOfPosition, orgTypeList, tpListOfPositionCategory] = await Promise.all([
                TPListOfPositionServices.getById(ID),
                HelperServices.GetAllOrganizationType(),
                // TPListOfPositionCategoryServices.getList(),
            ]);
            setTPListOfPosition(tpListOfPosition.data);
            setOrgTypeList(orgTypeList.data);
            setOrganizationTypeID(tpListOfPosition.data.OrganizationTypeID);
            // setTPListOfPositionCategory(tpListOfPositionCategory.data.rows);

            if (tpListOfPosition.data.ID !== 0) {
                mainForm.setFieldsValue({
                    ...tpListOfPosition.data,
                });
            }
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [ID, mainForm]);

    useEffect(() => {
        if (OrganizationTypeID) {
            TPListOfPositionCategoryServices.GetAllTPListOfPositionCategory(OrganizationTypeID)
                .then(response => {
                    setTPListOfPositionCategory(response.data)
                })
                .catch((err) => Notification('error', err));
        }
    }, [OrganizationTypeID])

    const onMainFormFinish = (values) => {
        // console.log({ ...tpListOfPosition, ...values, });
        TPListOfPositionServices.postData({ ...tpListOfPosition, ...values, })
            .then((res) => {
                // console.log(res.data);
                Notification('success', t('edited'));
                props.onCancel();
                props.fetch();
            }).catch((err) => {
                Notification('error', err)
            })
    };

    const openTariffScaleModal = (values) => {
        setTariffScaleParams(values);
        setTariffScaleModal(true);
    };

    const onSelect = (data) => {
        // console.log(data);
        mainForm.setFieldsValue({
            [`${data.Name}`]: data.NameValue,
            [`${data.id}`]: data.ID
        });
    };

    const handleOrganizationTypeID = (value)=>{
        setOrganizationTypeID(value);
        mainForm.setFieldsValue({
            [`Category`]: null,
            [`CategoryID`]: null,
        })
    };

    return (
        <Modal
            width={768}
            title={t("TPListOfPosition")}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("close")}
                </Button>,
                <Button
                    type="primary"
                    form='mainForm'
                    htmlType="submit"
                // onClick={selectRow}
                >
                    {t("save")}
                </Button>,
            ]}
        >
            <Spin size='large' spinning={loader}>
                <Form
                    {...layout}
                    form={mainForm}
                    id="mainForm"
                    onFinish={onMainFormFinish}
                    initialValues={{
                    }}
                >
                    <Row gutter={[15, 0]}>
                        <Col md={12}>
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
                                    placeholder={t("OrganizationTypeID")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onSelect={handleOrganizationTypeID}
                                >
                                    {orgTypeList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label={t("Code")}
                                name="Code"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <InputNumber
                                    style={{ width: "100%" }}
                                    placeholder={t('Code')}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label={t("ShortName")}
                                name="ShortName"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    style={{ width: "100%" }}
                                    placeholder={t('ShortName')}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label={t("Name")}
                                name="Name"
                                rules={[
                                    {
                                        required: true,
                                        message: t("Please input valid"),
                                    },
                                ]}>
                                <Input
                                    style={{ width: "100%" }}
                                    placeholder={t('Name')}
                                />
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label={t("Category")}
                                name="CategoryID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("CategoryID")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {tpListOfPositionCategory.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={12}>
                            <Form.Item
                                label={t("TariffScale")}
                                name="TariffScale"
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
                                        <div style={{ display: 'flex', pading: '0' }}>
                                            <div
                                                onClick={() => openTariffScaleModal({
                                                    Name: 'TariffScale',
                                                    ID: 'TariffScaleID'
                                                })}
                                            >
                                                <i className="fa fa-ellipsis-h" style={{ color: 'white', margin: '0 6px' }} />
                                            </div>
                                        </div>
                                    }
                                />
                            </Form.Item>
                            <Form.Item
                                label={t("TariffScale")}
                                name="TariffScaleID"
                                hidden={true}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>

            <CSSTransition
                mountOnEnter
                unmountOnExit
                in={tariffScaleModal}
                timeout={300}
            >
                <TariffScaleModal
                    visible={tariffScaleModal}
                    params={tariffScaleParams}
                    onSelect={onSelect}
                    onCancel={() => {
                        setTariffScaleModal(false);
                    }}
                />
            </CSSTransition>
        </Modal>
    )
}

export default React.memo(UpdateTPListOfPositionModal);