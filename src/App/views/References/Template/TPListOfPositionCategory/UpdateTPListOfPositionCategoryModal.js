import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Spin } from 'antd'
import { useTranslation } from 'react-i18next';

import { Notification } from '../../../../../helpers/notifications';
import TPListOfPositionCategoryServices from '../../../../../services/References/Template/TPListOfPositionCategory/TPListOfPositionCategory.services';
import HelperServices from '../../../../../services/Helper/helper.services';

const { Option } = Select;

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};

const UpdateTPListOfPositionCategoryModal = (props) => {
    // console.log(props.data);
    const { ID } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [tpListOfPositionCategory, setTPListOfPositionCategory] = useState({});
    const [orgTypeList, setOrgTypeList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [tpListOfPositionCategory, orgTypeList] = await Promise.all([
                TPListOfPositionCategoryServices.getById(ID),
                HelperServices.GetAllOrganizationType(),
            ]);
            setTPListOfPositionCategory(tpListOfPositionCategory.data);
            setOrgTypeList(orgTypeList.data);

            if (tpListOfPositionCategory.data.ID !== 0) {
                mainForm.setFieldsValue({
                    ...tpListOfPositionCategory.data,
                });
            }
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [ID, mainForm]);

    const onMainFormFinish = (values) => {
        // console.log({ ...tpListOfPositionCategory, ...values, });
        TPListOfPositionCategoryServices.postData({ ...tpListOfPositionCategory, ...values, })
            .then((res) => {
                // console.log(res.data);
                Notification('success', t('edited'));
                props.onCancel();
                props.fetch();
            }).catch((err) => {
                Notification('error', err)
            })
    };

    return (
        <Modal
            width={768}
            title={t("TPListOfPositionCategory")}
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
                        <Col span={24} md={12}>
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

                                >
                                    {orgTypeList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.DisplayName}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24} md={12}>
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
                    </Row>
                </Form>
            </Spin>
        </Modal>
    )
}

export default React.memo(UpdateTPListOfPositionCategoryModal);