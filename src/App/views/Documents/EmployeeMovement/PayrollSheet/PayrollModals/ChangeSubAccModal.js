import React, { useState, useEffect } from "react";
import { Modal, Select, Form, Spin } from "antd";
import { useTranslation } from "react-i18next";

import { Notification } from '../../../../../../helpers/notifications';
import HelperServices from "../../../../../../services/Helper/helper.services";

const { Option } = Select;

const ChangeSubAccModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [subAccList, setSubAccList] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    async function fetchData() { 
      try {
        const subAcc = await HelperServices.GetSubAcc60List();
        setSubAccList(subAcc.data);
        setLoader(false);
      } catch (err) {
        // console.log(err);
      }
    }
    fetchData();
  }, []);

  return (
    <Modal
      visible={props.visible}
      title={t("Change subaccount")}
      okText={t("Confirm")}
      cancelText={t("cancel")}
      onCancel={() => {
        props.onCancel();
        form.resetFields();
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            values.ID = props.id;
            props.onCreate(values);
            Notification('success', 'Successfully changed');
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Spin spinning={loader}>
        <Form
          form={form}
          initialValues={{
            SubAccDbID: props.subName
          }}>

          <Form.Item
            label={t("subacc")}
            name="SubAccDbID"
            rules={[
              {
                required: true,
                message: t("Please select subaccount"),
              },
            ]}
          >
            <Select
              placeholder={t("Select subacc")}
              allowClear
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              {subAccList.map((subacc) => (
                <Option key={subacc.ID} value={subacc.ID}>
                  {subacc.Code}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default ChangeSubAccModal;
