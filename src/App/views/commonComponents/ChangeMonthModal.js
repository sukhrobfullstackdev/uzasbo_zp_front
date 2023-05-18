import React from "react";
import { Modal, Form, DatePicker } from "antd";
import { useTranslation } from "react-i18next";
import moment from 'moment';

const ChangeMonthModal = (props) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();

    const closeModalHandler = () => {
        form.validateFields()
            .then(values => {
                values.Date = values.Date.format("DD.MM.YYYY");
                props.onCancel(values);
            })
    }

    return (
        <Modal
            title={t("changeDate")}
            visible={props.visible}
            cancelText={t("cancel")}
            okText={t("save")}
            onCancel={props.onCancel}
            onOk={closeModalHandler}
            width={500}
        >
            <Form
                form={form}
                className='table-filter-form'
                initialValues={{
                    Date: moment(),
                }}
            >
                <Form.Item
                    label={t("Date")}
                    name="Date"
                >
                    <DatePicker
                        picker="month"
                        format="01.MM.YYYY"
                        placeholder={t("Date")}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ChangeMonthModal;