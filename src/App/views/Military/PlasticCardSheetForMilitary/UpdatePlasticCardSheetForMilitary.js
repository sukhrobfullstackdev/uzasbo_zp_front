import React, { useState, useEffect } from 'react';
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, InputNumber, Space, Upload } from "antd";
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';

import { plasticCards } from '../../../../helpers/helpers';
import Card from "../../../components/MainCard";
import Table from './components/UpdateTable';
import PlasticCardSheetForMilitaryServices from "../../../../services/Military/PlasticCardSheetForMilitary.services";
import HelperServices from "../../../../services/Helper/helper.services";
import { Notification } from "../../../../helpers/notifications";
import classes from './PlasticCardSheetForMilitary.module.css';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;
const { TextArea } = Input;

const UpdatePlasticCardSheetForMilitary = (props) => {
  const [loader, setLoader] = useState(true);
  const [fileList, setFileList] = useState([]);
  const [orgSettAccList, setOrgSettAccList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [status, setStatus] = useState(null);
  // Table states
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  // Table states end
  const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);

  const { t } = useTranslation();
  const [mainForm] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const [formDt, orgSettAccLs, bankLs] = await Promise.all([
        PlasticCardSheetForMilitaryServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.getOrganizationsSettlementAccountList(),
        HelperServices.getBankList(),
        // HelperServices.getStatusList(),
      ]);

      setOrgSettAccList(orgSettAccLs.data);
      setBankList(bankLs.data.rows);
      setStatus(formDt.data.StatusID);
      setTableData(formDt.data.Table);
      mainForm.setFieldsValue({
        ...formDt.data,
        Date: moment(formDt.data.Date, 'DD.MM.YYYY'),
        PaymentOrderDate: moment(formDt.data.PaymentOrderDate, 'DD.MM.YYYY'),
        PaymentType: props.match.params.id ? formDt.data.PaymentType : 1,
        // Number: 1,
        // Date: moment(),
        // // Month: moment(),
        // Month: 1,
        // Sum: 2000,
        // PaymentOrderNumber: '77',
        // PaymentOrderDate: moment(),
        // Comment: 'comment',
        // BankID: 20,
        // PlasticCardType: '1'
      });
      setLoader(false);
    }

    fetchData().catch(err => {
      Notification('error', err);
    });
  }, [props.match.params.id, mainForm]);

  const onMainFormFinish = (values) => {
    setLoader(true);
    values.ID = docId;
    values.Date = values.Date.format("DD.MM.YYYY");
    values.PaymentOrderDate = values.PaymentOrderDate.format("DD.MM.YYYY");

    PlasticCardSheetForMilitaryServices.update(values)
      .then((res) => {
        if (res.status === 200) {
          history.push(`/PlasticCardSheetForMilitary`);
          Notification('success', props.match.params.id ? t('edited') : t('success-msg'));
          return res;
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  }

  const fillHandler = async () => {
    const values = await mainForm.validateFields()
    try {
      setTableLoading(true);
      values.ID = docId;
      values.Date = values.Date.format("DD.MM.YYYY");
      values.PaymentOrderDate = values.PaymentOrderDate.format("DD.MM.YYYY");

      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('file', file);
      });

      for (const key in values) {
        if (key === 'file') {
          continue;
        }
        formData.append(key, values[key]);
      }

      const fill = await PlasticCardSheetForMilitaryServices.fill(formData);
      if (fill.status === 200) {
        const tableData = await PlasticCardSheetForMilitaryServices.getTable(fill.data)
        setDocId(fill.data);
        setTableData(tableData.data);
        setTableLoading(false);
      }
    } catch (error) {
      Notification('error', error);
      setTableLoading(false);
    }
  }

  const uploadProps = {
    maxCount: 1,
    onRemove: file => {
      setFileList(prevState => {
        const index = prevState.indexOf(file);
        const newFileList = prevState.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setFileList(prevState => ([...prevState, file]));
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isLt2M) {
      //   Notification('error', 'file must smaller than 2MB!');
      // }
      return false;
    },
    fileList,
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const clearTable = () => {
    setTableLoading(true);
    PlasticCardSheetForMilitaryServices.deleteTable(docId)
      .then(res => {
        if (res.status === 200) {
          setTableData([]);
          setTableLoading(false);
        }
      })
      .catch(err => {
        Notification('error', err);
        setTableLoading(false);
      })
  }

  return (
    <Fade>
      <Card title={t("PlasticCardSheetForMilitary")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id="mainForm"
            onFinish={onMainFormFinish}
          >
            <Row gutter={[15, 0]}>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("number")}
                  name="Number"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <InputNumber disabled={(status === 8) || (status === 9)|| (status === 11)} style={{ width: "100%" }} placeholder={t("Number")} />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("Date")}
                  name="Date"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}>
                  <DatePicker disabled={(status === 8) || (status === 9)|| (status === 11)} format="DD.MM.YYYY" style={{ width: "100%" }} placeholder={t("date")} />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("Month")}
                  name="Month"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <InputNumber disabled={(status === 8) || (status === 9)|| (status === 11)} style={{ width: "100%" }} placeholder={t("Month")} />
                  {/* <DatePicker
                    picker="month"
                    format="01.MM.YYYY"
                    style={{ width: "100%" }}
                    placeholder={t("month")}
                  /> */}
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("sum")}
                  name="Sum"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <InputNumber
                    disabled={(status === 8) || (status === 9)|| (status === 11)}
                    style={{ width: "100%" }}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    parser={value => value.replace(/\$\s?|( *)/g, '')}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("paymentOrderNumber")}
                  name="PaymentOrderNumber"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <InputNumber
                    disabled={(status === 8) || (status === 9)|| (status === 11)}
                    style={{ width: "100%" }}
                    placeholder={t("paymentOrderNumber")}
                  />
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("paymentOrderDate")}
                  name="PaymentOrderDate"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker
                    disabled={(status === 8) || (status === 9)|| (status === 11)}
                    format="DD.MM.YYYY"
                    style={{ width: "100%" }}
                    placeholder={t("date")}
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={12}>
                <Form.Item
                  label={t("OrganizationsSettlementAccount")}
                  name="OrganizationsSettlementAccountID"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    disabled={(status === 8) || (status === 9)|| (status === 11)}
                    placeholder={t("OrganizationsSettlementAccount")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {orgSettAccList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={6} lg={12}>
                <Form.Item
                  label={t("Bank")}
                  name="BankID"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    disabled={(status === 8) || (status === 9)|| (status === 11)}
                    placeholder={t("Bank")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {bankList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={3} lg={12}>
                <Form.Item
                  label={t("PlasticCardType")}
                  name="PlasticCardType"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}>
                  <Select
                    placeholder={t("PlasticCardType")}
                    disabled={(status === 8) || (status === 9)|| (status === 11)}
                  >
                    {plasticCards.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("paymentType")}
                  name="PaymentType"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    disabled={(status === 8) || (status === 9)|| (status === 11)}
                    placeholder={t("paymentType")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    <Option value={1}>{t('pension')}</Option>
                    <Option value={2}>{t('aliment')}</Option>
                    {/* {statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)} */}
                  </Select>
                </Form.Item>
              </Col>
              {/* <Col xl={3} lg={12}>
                <Form.Item
                  name="file"
                  label={t('upload')}
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                // rules={[
                //   {
                //     required: true,
                //     message: t("pleaseSelect"),
                //   },
                // ]}
                >
                  <Upload
                    {...uploadProps}
                    openFileDialogOnClick
                    accept='.xlsx'
                  >
                    <Button icon={<UploadOutlined />}>{t('upload')}</Button>
                  </Upload>
                </Form.Item>
              </Col> */}
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("payerSettlementCode")}
                  name="PayeeSettlementCode"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <Input disabled={(status === 8) || (status === 9)|| (status === 11)} style={{ width: "100%" }} placeholder={t("payerSettlementCode")} />
                </Form.Item>
              </Col>
              <Col xl={7} lg={12}>
                <Form.Item
                  label={t("Comment")}
                  name="Comment"
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <TextArea disabled={(status === 8) || (status === 9)|| (status === 11)} rows={1} placeholder={t("Comment")} />
                </Form.Item>
              </Col>

              <Col xl={24} lg={24}>
                <div className='main-table-filter-wrapper'>
                  <Form.Item
                    name="file"
                    // label={t('upload')}
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    style={{ marginBottom: 0 }}
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t("pleaseSelect"),
                  //   },
                  // ]}
                  >
                    <Upload
                      {...uploadProps}
                      openFileDialogOnClick
                      accept='.xlsx'
                    >
                      <Button
                        disabled={(status === 8) || (status === 9)|| (status === 11)}
                        icon={<UploadOutlined />}
                        className={classes['upload-btn']}
                      >
                        {t('upload')}
                      </Button>
                    </Upload>
                  </Form.Item>
                  <Button
                    disabled={(status === 8) || (status === 9)|| (status === 11)}
                    type="primary"
                    onClick={fillHandler}
                  >
                    {t("fill")}
                  </Button>
                  <Button
                    disabled={(status === 8) || (status === 9)|| (status === 11)}
                    type="danger"
                    onClick={clearTable}
                  >
                    {t("сlear")}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>

          <Table data={tableData} loading={tableLoading} />

          <Space size='middle' className='btns-wrapper'>
            <Button
              type="danger"
              onClick={() => {
                history.goBack();
                Notification("warning", t("not-saved"));
              }}
            >
              {t("back")}
            </Button>
            <Button
              htmlType="submit"
              form="mainForm"
              type="primary"
              disabled={(status === 8) || (status === 9)|| (status === 11)}
            >
              {t("save")}
            </Button>
          </Space>
        </Spin>
      </Card>
    </Fade>
  );
};

export default UpdatePlasticCardSheetForMilitary;