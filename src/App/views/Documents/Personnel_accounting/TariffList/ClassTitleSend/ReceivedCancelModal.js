import React from "react";
import { Modal, Row, Col, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

import { Notification } from '../../../../../../helpers/notifications';
import ClassTitleSendServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitleSend/ClassTitleSend.services";
import classes from "./ClassTitle.module.css";

const RecievedCancelModal = (props) => {
  // console.log(props);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      // visible={props.addVisible}
      visible={props.visible}
      title={t("Description")}
      okText={t("send")}
      cancelText={t("cancel")}
      width={600}
      onCancel={() => {
        props.onCancel();
        form.resetFields();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            values.ID = props.id
            ClassTitleSendServices.NotAccept(values)
            .then(res => {
              if (res.status === 200) {
                Notification('success', 'received');
              }
            })
            .catch((err)=>{
              Notification('error', err);
            })
           
            props.onCancel();
            form.resetFields();
          })
          .catch((info) => {
            Notification('error', info);
          });
        }}
    >
      <Form
        form={form}
        >
        <Row gutter={[16, 16]}>
          <Col xl={24} lg={24}>
            <Form.Item label={t("Description")} name="Description">
              <Input className={classes['year-input']} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default RecievedCancelModal;
