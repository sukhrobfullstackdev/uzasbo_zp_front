import React, { useState, useEffect } from 'react';
import HelperServices from "../../../../../services/Helper/helper.services";
import { Modal, Col, Form, Select, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../../../helpers/notifications';
const { Option } = Select;

const EditSalaryModal = (props) => {
  const [allowedTransaction, setAllowedTransaction] = useState([]);
  const [subAccDbId, setSubAccDbId] = useState([]);
  const [accDbSubCount, setAccDbSubCount] = useState([]);
  const [accCrSubCount, setAccCrSubCount] = useState([]);
  const [subAccCrID, setSubAccCrID] = useState([]);
  const [names, setNames] = useState([]);
  const [loader, setLoader] = useState(true);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  let itemIndex;

  useEffect(() => {
    async function fetchData() {
      try {

        const allowedTransaction = await HelperServices.getAllowedTransactionList();
        setAllowedTransaction(allowedTransaction.data);

        const allowTransactionData = allowedTransaction.data.filter(item => item.ID === filteredData[0].AllowedTransactionID);


        const subAcc = await HelperServices.GetSubAccDbCrList(allowTransactionData[0].AccDbID);
        setSubAccDbId(subAcc.data);



        const subAccCr = await HelperServices.getSubAccDbCrList(allowTransactionData[0].AccCrID);
        setSubAccCrID(subAccCr.data);


        if (allowTransactionData[0].AccDbID === 58 || allowTransactionData[0].AccDbID === 61 || allowTransactionData[0].AccDbID === 60) {
          setAccDbSubCount([]);
        }
        else {
          const accDbSubCount = await HelperServices.getAllSubCount(allowTransactionData[0].AccDbID);
          setAccDbSubCount(accDbSubCount.data.rows)
        };



        if (allowTransactionData[0].AccCrID === 60 || allowTransactionData[0].AccCrID === 61 || allowTransactionData[0].AccCrID === 58) {      
          setAccCrSubCount([]);
        } else {
          const accCrSubCount = await HelperServices.getAllSubCount(allowTransactionData[0].AccCrID);

          setAccCrSubCount(accCrSubCount.data.rows)
        };

        // const subAccCrName = await HelperServices.GetAllSubCount(allowTransactionData[0].ID);
        // setTaxesAndChargesAll(subAccCrName.data.rows);


        setLoader(false);
      } catch (err) {
        Notification('error', err);
      }
    }
    fetchData();
  }, );


  const filteredData = props.tableData.filter((item, index) => {
    if (item.ID === 0 && item.key === props.rowId) {
      itemIndex = index;
      return (item.key === props.rowId);
    }
    else if (item.ID !== 0 && item.ID === props.rowId) {
      itemIndex = index;
      return (item.ID === props.rowId);
    } else {
      return 0
    }
  })

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
    setNames((prevState => { return ({ ...prevState, SubAccDbName: data['data-name'] }) }))
  }

  const SubCountDb1ValueIDHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubCountDb1ValueName: data['data-name'] }) }))
  }

  const SubAccCrIDHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubAccCrName: data['data-name'] }) }))
  }

  const SubCountCr1ValueIDHandler = (ID, data) => {
    setNames((prevState => { return ({ ...prevState, SubCountCr1ValueName: data['data-name'] }) }))
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
            if (values.ID === 0) {
              values.Status = 1;
            } else if (values.Status !== 0) {
              values.Status = 2;
            }
            // values.key = filteredData[0].key;
            values.OrganizationsSettlementAccountName = names.OrganizationsSettlementAccountName ? names.OrganizationsSettlementAccountName : filteredData[0].OrganizationsSettlementAccountName;
            values.AllowedTransactionName = names.AllowedTransactionName ? names.AllowedTransactionName : filteredData[0].AllowedTransactionName;
            values.SubAccDbName = names.SubAccDbName ? names.SubAccDbName : filteredData[0].SubAccDbName;
            values.SubCountDb1ValueName = names.SubCountDb1ValueName ? names.SubCountDb1ValueName : filteredData[0].SubCountDb1ValueName;
            values.SubAccCrName = names.SubAccCrName ? names.SubAccCrName : filteredData[0].SubAccCrName;
            values.SubCountCr1ValueName = names.SubCountCr1ValueName ? names.SubCountCr1ValueName : filteredData[0].SubCountCr1ValueName;
            values.OwnerID = names.OwnerID ? names.OwnerID : filteredData[0].OwnerID;
            values.ID = names.ID ? names.ID : filteredData[0].ID;
            //values.Status = 2;

            let newData = [...props.tableData];
            console.log(newData);
            console.log(values);
            newData[itemIndex] = values;
            console.log(newData);

            if (itemIndex === undefined) {
              newData = [values]
              //values.ID = filteredData[0].ID;
            }
            props.onCreate(newData);
            form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}>
      {loader ? <Skeleton active /> :
        <Form
          form={form}
          layout='vertical'
          initialValues={{
            ...filteredData[0],
          }}
        >
          <Col xl={24}>
            <Form.Item
              label={t("OrganizationsSettlementAccount")}
              name="OrganizationsSettlementAccountID"
              rules={[
                {
                  required: true,
                  message: t("Please input your")
                }
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder={t("OrganizationsSettlementAccount")}
                showSearch 
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
                onChange={organizationSettlementChangeHandler}
              >
                {props.organizationSettlement.map(item => {
                  return (
                    <Option key={item.ID} data-name={item.Code} value={item.ID}>{item.Code}</Option>)
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col xl={24}>
            <Form.Item
              label={t("Allowed Transaction")}
              name="AllowedTransactionID"
              showSearch
              rules={[
                {
                  required: true,
                  message: t("Please input your")
                }
              ]}
            >
              <Select
                style={{ width: "100%" }}
                placeholder="AllowedTransaction Name"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={allowedTransactionChangeHander}>
                {allowedTransaction.map(allowedTransaction => <Option
                  key={allowedTransaction.ID}
                  value={allowedTransaction.ID}
                  data-acccrid={allowedTransaction.AccCrID}
                  data-accdbid={allowedTransaction.AccDbID}
                  data-name={allowedTransaction.Name}>
                  {allowedTransaction.Name}</Option>)}
                  
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
                {subAccDbId.map(subAccDbId => <Option key={subAccDbId.ID} data-name={subAccDbId.Code} value={subAccDbId.ID}>{subAccDbId.Code}</Option>)}
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

                {/*          
           {accDbSubCount.map(item =>{
           if(accDbSubCount.r === null){
            setAccDbSubCount([]);
           }else{<Option key={item.ID} value={item.ID} data-name={item.Name}>{item.Name}</Option>}})} */}

                {accDbSubCount.map(item => <Option key={item.ID} value={item.ID} data-name={item.Name}>{item.Name}</Option>)}
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
                onChange={SubAccCrIDHandler}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {subAccCrID.map(subAccCrID => <Option key={subAccCrID.ID} data-name={subAccCrID.Code} value={subAccCrID.ID}> {subAccCrID.Code}</Option>)}
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
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={SubCountCr1ValueIDHandler}
              >
                {accCrSubCount.map(item => <Option key={item.ID} value={item.ID} data-name={item.Name}>{item.Name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Form>
      }
    </Modal>
  )
};

export default EditSalaryModal;
