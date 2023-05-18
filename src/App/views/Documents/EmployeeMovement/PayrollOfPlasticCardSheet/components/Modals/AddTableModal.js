import React, { useState, useCallback } from "react";
import { Modal, Row, Col, Form, InputNumber, Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import { UserOutlined } from "@ant-design/icons";

import classes from "../../PayrollOfPlasticCardSheet.module.css";
import EmployeeModal from './EmployeeModal';

const AddTableModal = (props) => {
  // console.log(props.cardType)
  const [employeeListModal, setEmployeeList] = useState(false);
  const [empFullData, setEmpFullData] = useState({});
  const [employeeTableData, setEmployeeTable] = useState([]);
  // const [loader, setLoader] = useState(true);

  const [form] = Form.useForm();
  const { t } = useTranslation();


  const createTableDataHandler = useCallback((values) => {
    // console.log(values)
    setEmployeeTable((employeeTableData) => [...employeeTableData, values])
    setEmployeeList(false)
  }, []);

  const onFinish = (filterFormValues) => {
    const newEmpFullData = { ...empFullData };
    newEmpFullData.Sum = filterFormValues.Sum;
    // console.log(newEmpFullData);
    setEmpFullData(newEmpFullData);
  };

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };

  const getEmpData = (empData) => {
    // console.log(empData);
    setEmpFullData(empData);
    form.setFieldsValue({ FullName: empData.FullName });
  };

  return (
    <Modal
      visible={props.visible}
      title={t("employee")}
      okText={t("save")}
      cancelText={t("cancel")}
      onCancel={() => {
        props.onCancel();
        form.resetFields();
      }}
      // onOk={AddEmployeeTable}
      onOk={() => {
        form.validateFields()
          .then(() => {
            const newEmpFullData = { ...empFullData };
            newEmpFullData.Sum = form.getFieldValue('Sum');
            // newEmpFullData.PayrollSum = form.getFieldValue('Sum');
            // newEmpFullData.OwnerID = props.currentDocId;
            // newEmpFullData.PlasticCardBankID = props.bankId;
            // newEmpFullData.PlasticCardType = props.cardType;
            // console.log(newEmpFullData);
            props.getModalData(newEmpFullData);
            props.onCancel();
          })
          .catch(err => {
            // console.log(err);
          })
      }}
    >
      {employeeListModal && (
        <EmployeeModal
          visible={employeeListModal}
          onCancel={() => setEmployeeList(false)}
          getEmpData={getEmpData}
          onCreate={createTableDataHandler}
          employeeTableData={employeeTableData}
          parentId={props.parentId}
          OwnerID={props.currentDocId}
          PlasticCardBankID={props.bankId}
          PlasticCardType={props.cardType}
          key="1"
        // getModalData={getModalData}

        />
      )}

      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[16, 16]}>
          <Col xl={24} lg={24}>
            <div className={classes.EmployeeStateModal}>
              <Form.Item
                label={t("Employee")}
                name="FullName"
                style={{ width: '100%' }}
                rules={[
                  {
                    required: true,
                    message: t("Please input valid"),
                  },
                ]}
              >
                <Input disabled
                  style={{ color: 'black' }} />
              </Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  setEmployeeList(true);
                }}
                shape="circle"
                icon={<UserOutlined />}
              />
            </div>
          </Col>
          <Col xl={22} lg={24}>
            <Form.Item
              label={t("Sum")}
              name="Sum"
              rules={[
                {
                  required: true,
                  message: t("Please input valid"),
                },
              ]}
            >
              <InputNumber
                className={classes['year-input']}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                parser={value => value.replace(/\$\s?|( *)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal >
  );
}

export default AddTableModal;
