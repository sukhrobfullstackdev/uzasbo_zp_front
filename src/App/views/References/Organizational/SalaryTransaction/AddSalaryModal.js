import React, { useState, useEffect } from 'react';
import HelperServices from "../../../../../services/Helper/helper.services";
import { Modal, Col, Form, Select } from 'antd';
import { useTranslation } from 'react-i18next';

import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;

const AddSalaryModal = (props) => {
  const [allowedTransaction, setAllowedTransaction] = useState([]);
  const [subAccDbId, setSubAccDbId] = useState([]);
  const [subAccCrID, setSubAccCrID] = useState([]);
  const [accDbSubCount, setAccDbSubCount] = useState([]);
  const [accCrSubCount, setAccCrSubCount] = useState([]);
  const [salaryName, setSalaryName] = useState([]);
  const [names, setNames] = useState([]);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      try {
        setSalaryName(salaryName);
      } catch (err) {
        Notification('error', err);
        // console.log(err);
      }
    }
    fetchData();
  }, [salaryName]);

  const organizationSettlementChangeHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, OrganizationsSettlementAccountName: data['data-name'] }) }))
    HelperServices.getAllowedTransactionList(ID)
      .then(response => {
        setAllowedTransaction(response.data)
      })
      .catch(err => Notification('error', err));
  }

  const allowedTransactionChangeHander = async (ID, data) => {
    setNames((prevState => { return ({ ...prevState, AllowedTransactionName: data.children }) }))

    form.setFieldsValue({
      SubAccDbID: null,
      SubCountDb1ValueID: null,
      SubAccCrID: null,
      SubCountCr1ValueID: null
    });


    // setNames((prevState => { return ({ ...prevState, AllowedTransactionName: data['data-name'] }) }));

    //   const [subAccDbLs, subAccCrLs, subCountDbLs, subCountCrLs] = await Promise.all([
    //     HelperServices.GetSubAccDbCrList(data['data-accdbid']),
    //     HelperServices.GetSubAccDbCrList(data['data-acccrid']),
    //     HelperServices.getAllSubCount(data['data-accdbid']),
    //     HelperServices.getAllSubCount(data['data-acccrid']),
    //   ]);

    //   setSubAccDbId(subAccDbLs.data);
    //   setSubAccCrID(subAccCrLs.data);
    //   if (data['data-accdbid']===60||data['data-accdbid']===61||data['data-accdbid']===58){
    //     console.log(data['data-accdbid'])
    //     setAccDbSubCount([])
    //   }else{
    //   setAccDbSubCount(subCountDbLs.data.rows)};
    //   if (data['data-acccrid']===60||data['data-acccrid']===61||data['data-acccrid']===58){
    //     console.log(data['data-acccrid'])
    //     setAccDbSubCount([])
    //   }else{
    //   setAccCrSubCount(subCountCrLs.data.rows)};
    // } catch (error) {
    //   Notification('error', error);
    // }

    HelperServices.GetSubAccDbCrList(data['data-accdbid'])
      .then(response => {
        setSubAccDbId(response.data)
      })
      .catch(err => Notification('error', err));

    HelperServices.getSubAccDbCrList(data['data-acccrid'])
      .then(response => {
        setSubAccCrID(response.data)
      })
      .catch(err => Notification('error', err));

    if (data['data-accdbid'] === 60 || data['data-accdbid'] === 61 || data['data-accdbid'] === 58) {
      HelperServices.getAllSubCount(data['data-accdbid'])
        .then(response => {
          setAccDbSubCount([])
        })
    } else {
      HelperServices.getAllSubCount(data['data-accdbid'])
        .then(response => {
          setAccDbSubCount(response.data.rows)
        })
        .catch(err => Notification('error', err));
    }

    if (data['data-acccrid'] === 60 || data['data-acccrid'] === 61 || data['data-acccrid'] === 58) {
      HelperServices.getAllSubCount(data['data-acccrid'])
        .then(response => {
          setAccCrSubCount([])
        })
    } else {
      HelperServices.getAllSubCount(data['data-acccrid'])
        .then(response => {
          setAccCrSubCount(response.data.rows)
        })
        .catch(err => Notification('error', err));
    }
  }

  const SubAccDbNameHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubAccDbName: data.children }) }));
  }

  const SubCountDb1ValueIDHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubCountDb1ValueName: data.children }) }))
  }

  const SubAccCrIDHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubAccCrName: data.children }) }))
  }

  const SubCountCr1ValueIDHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubCountCr1ValueName: data.children }) }))
  }


  return (
    <Modal
      visible={props.visible}
      title={t('Salary Transaction')}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={() => {
        form.resetFields();
        props.onCancel();
      }}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            values.key = Math.random().toString();
            values.ID = 0;
            values.OwnerID = 0;
            values.OrganizationsSettlementAccountName = names.OrganizationsSettlementAccountName;
            values.AllowedTransactionName = names.AllowedTransactionName;
            values.SubAccDbName = names.SubAccDbName;
            values.SubCountDb1ValueName = names.SubCountDb1ValueName;
            values.SubAccCrName = names.SubAccCrName;
            values.SubCountCr1ValueName = names.SubCountCr1ValueName;
            values.Status = 1;

            props.onCreate(values);
            form.resetFields();
          })
          .catch((err) => {
           // Notification('error', err);
            // console.log('Validate Failed:', info);
          });
      }}
    >
      <Form form={form}
        layout='vertical'>
        <Col xl={24}>
          <Form.Item
            label={t("OrganizationsSettlementAccount")}
            name="OrganizationsSettlementAccountID"
            rules={[
              {
                required: true,
                message: t("Please input your")
              }
            ]}  >
            <Select
              style={{ width: "100%" }}
              placeholder={t("OrganizationsSettlementAccount")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={organizationSettlementChangeHandler}
            >
              {props.organizationSettlement.map(item => {
                return (
                  <Option key={item.ID} value={item.ID} data-name={item.Code}>{item.Code}</Option>)
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={24}>
          <Form.Item
            label={t("Allowed Transaction")}
            name="AllowedTransactionID"
            rules={[
              {
                required: true,
                message: t("Please input your")
              }
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder={t("Allowed Transaction")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={allowedTransactionChangeHander}
            >
              {allowedTransaction.map(allowedTransaction => <Option
                key={allowedTransaction.ID}
                value={allowedTransaction.ID}
                data-acccrid={allowedTransaction.AccCrID}
                data-accdbid={allowedTransaction.AccDbID}
                data-name={allowedTransaction.Name}>
                {allowedTransaction.Name}
              </Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={24}>
          <Form.Item
            label={t("SubAccDbName")}
            name="SubAccDbID"
            rules={[
              {
                required: true,
                message: t("Please input your")
              }
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder={t("SubAccDbName")}
              onChange={SubAccDbNameHandler}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {subAccDbId.map(subAccDbId => <Option key={subAccDbId.ID} value={subAccDbId.ID} data-name={subAccDbId.Code}>{subAccDbId.Code}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={24}>
          <Form.Item
            label={t("SubCountDb1ValueName")}
            name="SubCountDb1ValueID"
            rules={[
              {
                required:  accDbSubCount.length === 0 ? false : true,
                message: t("Please input your")
              }
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder={t("SubCountDb1ValueName")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={SubCountDb1ValueIDHandler}
            >
              {accDbSubCount.map(item => {
                return (
                  <Option key={item.ID} value={item.ID} data-name={item.Name}>{item.Name}</Option>)
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={24}>
          <Form.Item
            label={t("SubAccCrName")}
            name="SubAccCrID"
            rules={[
              {
                required: true,
                message: t("Please input your")
              }
            ]}>
            <Select
              style={{ width: "100%" }}
              placeholder={t("SubAccCrName")}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={SubAccCrIDHandler}
            >
              {subAccCrID.map(subAccCrID => <Option key={subAccCrID.ID} value={subAccCrID.ID} data-name={subAccCrID.Code}>{subAccCrID.Code}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col xl={24}>
          <Form.Item
            label={t("SubCountCr1Name")}
            name="SubCountCr1ValueID"
          
            rules={[
              {
                required: accCrSubCount.length === 0 ? false : true,
                message: t("Please input your")
              }
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder={t("SubCountCr1Name")}
              onChange={SubCountCr1ValueIDHandler}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }   
            >
              {accCrSubCount.map(item => {
                return (
                  <Option key={item.ID} value={item.ID} data-name={item.Name}>{item.Name}</Option>)
              })}
            </Select>
          </Form.Item>
        </Col>
      </Form>
    </Modal>
  )
};

export default AddSalaryModal;