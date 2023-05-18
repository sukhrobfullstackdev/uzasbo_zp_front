import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Modal, Row, Select, Spin, Tabs } from 'antd'
import { useTranslation } from 'react-i18next';

import HelperServices from "./../../../../../services/Helper/helper.services";
import PositionOwnerTable from './components/PositionOwnerTable';
import { Notification } from "../../../../../helpers/notifications";
import PositionOwnerServices from '../../../../../services/References/Organizational/PositionOwner/PositionOwner.services';
import AllPositionsServices from '../../../../../services/References/Global/AllPositions/AllPositions.services';

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

const UpdatePositionOwnerModal = (props) => {
    // console.log(props.data);
    const { ID } = props.data;

    const { t } = useTranslation();
    const [mainForm] = Form.useForm();

    const [loader, setLoader] = useState(true);
    const [positionOwner, setPositionOwner] = useState([]);
    const [functionalItemOfExpenseList, setFunctionalItemOfExpenseList] = useState([]);
    const [chapterToPositionOwnerList, setChapterToPositionOwnerList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [allPositions, setAllPositions] = useState([]);
    const [positionCategoryList, setPositionCategoryList] = useState([]);
    const [Tables, setTables] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const [positionOwner, functionalItemOfExpenseList, chapterToPositionOwnerList, stateList, allPositions, positionCategoryList] = await Promise.all([
                PositionOwnerServices.getById(ID), 
                HelperServices.getFunctionalItemOfExpenseList(),
                HelperServices.getChapterToPositionOwnerList(),
                HelperServices.getStateList(),
                AllPositionsServices.getAll(),
                HelperServices.getPositionCategoryList(),
            ]);
            setPositionOwner(positionOwner.data);
            positionOwner.data.Tables.map((data) => {
                data.key = Math.random();
                return data;
            })
            setTables(positionOwner.data.Tables);
            setFunctionalItemOfExpenseList(functionalItemOfExpenseList.data);
            setChapterToPositionOwnerList(chapterToPositionOwnerList.data);
            setStateList(stateList.data);
            setAllPositions(allPositions.data);
            setPositionCategoryList(positionCategoryList.data);

            if (positionOwner.data.ID !== 0) {
                mainForm.setFieldsValue({
                    ...positionOwner.data,
                });
            }
            setLoader(false);
        };

        fetchData().catch(err => {
            Notification('error', err);
            setLoader(false);
        });
    }, [])

    const onMainFormFinish = (values) => {
        console.log({ ...positionOwner, ...values, Tables: Tables });
        PositionOwnerServices.postData({ ...positionOwner, ...values, Tables: Tables })
            .then((res) => {
                // console.log(res.data);
                Notification('success', t('edited'));
                props.onCancel();
                props.fetch();
            }).catch((err) => {
                Notification('error', err)
            })
    };

    const editTPSalaryTransactionTableData = (data) => {
        setTables(data);
    };

    return (
        <Modal
            width={992}
            title={t("PositionOwner")}
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
                        <Col md={8}>
                            <Form.Item
                                label={t("FunctionalItemOfExpense")}
                                name="FunctionalItemOfExpenseID"
                                rules={[
                                    {
                                        required: true,
                                        message: t("inputValidData")
                                    },
                                ]}
                            >
                                <Select
                                    placeholder={t("Select from list")}
                                    // style={{ width: '100%' }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                >
                                    {functionalItemOfExpenseList.map(item =>
                                        <Option key={item.ID} value={item.ID} >
                                            {item.Name}
                                        </Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={8}>
                            <Form.Item
                                label={t("Chapter")}
                                name="ChapterID"
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {chapterToPositionOwnerList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col md={8}>
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                >
                                    {stateList.map((item) => (
                                        <Option key={item.ID} value={item.ID}>
                                            {item.Name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <PositionOwnerTable
                        data={Tables}
                        allPositions={allPositions}
                        positionCategoryList={positionCategoryList}
                        editTableData={editTPSalaryTransactionTableData}
                    />
                </Form>
            </Spin>
        </Modal>
    )
}

export default React.memo(UpdatePositionOwnerModal);