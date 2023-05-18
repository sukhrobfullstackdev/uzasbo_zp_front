import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Select, Spin, Table } from "antd";
import { useTranslation } from "react-i18next";

import HelperServices from "../../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../../helpers/notifications";
import SalaryCalculationServices from "../../../../../../services/Documents/EmployeeMovement/SalaryCalculation/SalaryCalculation.services";

const { Option } = Select;

const ChangeStatusModal = (props) => {
    const [editForm] = Form.useForm();
    const [selectLoading, setSelectLoading] = useState(true);
    const [selectData, setSelectData] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            const tableDt = await HelperServices.getStatusList();
            setSelectData(tableDt.data);
            setSelectLoading(false);
        }
        fetchData().catch(err => {
            setSelectLoading(false);
            Notification('error', err);
        });
    }, [props.id, editForm]);

    const onSubmit = () => {
        editForm.validateFields()
            .then(values => {
                SalaryCalculationServices.ChangeStatusByAdmin({
                    DocumentID: props.id,
                    StatusID: values.Status
                })
                    .then((res) => {
                        if (res.status === 200) {
                            Notification('success', t('edited'));
                            props.onCancel();
                        }
                    })
                    .catch((err) => {
                        Notification('error', err)
                        setSelectLoading(false);
                    });
            });
    };

    const onFinish = (values) => {
        console.log(values);
    };

    return (
        <Modal
            title={t("status")}
            visible={props.visible}
            cancelText={t("cancel")}
            onCancel={props.onCancel}
            width={340}
            footer={[
                <Button key="back" onClick={props.onCancel}>
                    {t("cancel")}
                </Button>,
                <Button key="submit" onClick={() => {
                    onSubmit();
                    props.onOk();
                }}
                    htmlType="submit" type="primary">
                    {t("OK")}
                </Button>,
            ]}
        >
            <Spin spinning={selectLoading} size='large'>
                <Form
                    form={editForm}
                    onFinish={onFinish}
                    className='table-filter-form'
                    initialValues={{
                        Status: props.statusID,
                    }}
                >
                    <Form.Item
                        name="Status"
                        label={t("Select Status")}
                    >
                        <Select
                            placeholder={t("Select Status")}
                            style={{ width: '160px' }}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {selectData.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal >
    )
}

export default ChangeStatusModal;