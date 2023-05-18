import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Form, Button, Select, Spin, Table, Space, Popconfirm } from 'antd';
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import BankServices from '../../../../services/Banks/bank.services';
import { openSuccessNotification, openWarningNotification } from '../../../../helpers/notifications';
import OrganizationServices from '../../../../services/Organization/organization.services';
import CommonServices from '../../../../services/common/common.services';
import classes from './Organization.module.css';
import ModalForm from "./ModalForm";
import TableModalForm from "./TableModalForm";
// import Card from "../../../components/MainCard";

const { Search } = Input;
const { Option } = Select;

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: { 
    span: 24,
  },
};

const AddOrganization = (props) => {
  const [oblasts, setOblasts] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [regions, setRegions] = useState([])
  const [banks, setBanks] = useState([])
  const [tableData, setTableData] = useState([])
  const [loader, setLoader] = useState(false)
  const [status, setStatus] = useState([])
  // for modal
  const [visible, setVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [code, setCode] = useState(null);
  // End for modal
  const [form] = Form.useForm();
  // const [tableForm] = Form.useForm();
  const { t } = useTranslation();
  const columns = [
    {
      title: t('code'),
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: t('accountname'),
      dataIndex: 'accountname',
      key: 'accountname',
    },
    {
      title: t('Bank'),
      dataIndex: 'bankname',
      key: 'bankname',
    },
    {
      title: t('status'),
      dataIndex: 'stateid',
      key: 'stateid',
      render: (record) => {
        if (record === '1' || record === 1) {
          return (<span style={{ color: '#52c41a' }}>{t('active')}</span>)
        } else if (record === '2' || record === 2) {
          return (<span style={{ color: '#cf1322' }}>{t('passive')}</span>)
        }
      }
    },
    {
      title: t('actions'),
      key: 'action',
      width: '10%',
      align: 'center',
      render: (record) => {
        return (
          <Space size="middle">
            <span
              onClick={() => {
                setVisible(true);
                setCode(record.code)
              }}
              style={{ cursor: 'pointer', color: '#1890ff' }}
            >
              <i className="fa fa-edit edit-icon" />
            </span>
            <Popconfirm
              title={'delete'}
              onConfirm={() => {
                InnerTableDeleteHandler(record.code)
                openWarningNotification('warning', 'deleted')
              }}
              okText={'yes'}
              cancelText={'cancel'}>
              <span style={{ color: '#1890ff', cursor: 'pointer' }}>
                <i className="feather icon-trash-2" /></span>
            </Popconfirm>
          </Space>
        )
      },
    },
  ];
  useEffect(() => {
      OrganizationServices.getOblastList()
      .then(response => {
        setOblasts(response.data)
      })
      .catch(err => {
        alert(err)
        console.log(err);
      })
    CommonServices.getStatus()
      .then(response => {
        setStatus(response.data);
        console.log(response.data);
      })
      .catch(err => {
        alert(err)
        console.log(err);
      })
    BankServices.getAllBanks()
      .then(response => {
        setBanks(response.data)
      })
      .catch(err => {
        alert(err)
        console.log(err);
      })
  }, []);
  
  const handleCreate = (values) => {
    setTableData(values);
    setVisible(false);
  };
  
  const handleTableCreate = (values) => {
    setTableData([...tableData, values])
    setTableVisible(false);
    openSuccessNotification('success', 'success-msg')
  };
  
  function handleOblast(id) {
    OrganizationServices.getRegionList(id)
      .then(response => {
        setRegions(response.data)
      })
  }
  
  const onSearch = inn => {
    setLoader(true)
    OrganizationServices.getByInn(inn)
      .then(response => {
        console.log(response.data.FullName);
        form.setFieldsValue({
          ZipCode: response.data.ZipCode,
          OblastID: response.data.OblastID,
          OKED: response.data.OKED,
          Shortname: response.data.Shortname,
          Adress: response.data.Adress,
          RegionID: response.data.RegionID,
          Director: response.data.Director,
          FullName: response.data.FullName,
          ContactInfo: response.data.ContactInfo,
          StateID: response.data.StateID.toString(),
          Accounter: response.data.Accounter,
          ID: response.data.ID,
          Cashier: response.data.Cashier,
          VatCode: response.data.VatCode,
        });
        handleOblast(response.data.OblastID)
        setLoader(false)
      })
      .catch(err => {
        alert(`Invalid inn: ${err}`)
      })
  }

  const onFinish = (values) => {
    values.id = 0;
    values.isbudged = false;
    values.Branches = [];
    values.Accounts = [...tableData, ...filteredData];
    console.log(values);
    OrganizationServices.postEdits(values)
      .then(response => {
        const { history } = props
        history.push('/organization')
        openSuccessNotification('success', 'Edited')
      })
      .catch(err => alert(err))
  };
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  // Table

  const InnerTableDeleteHandler = (code) => {
    tableData.forEach(item => {
      if (item.code === code) {
        item.Status = 3
      }
    })
    const filteredFrontData = tableData.filter(item => {
      return (item.Status !== 3)
    })
    const filteredApiData = tableData.filter(item => {
      return (item.Status === 3)
    })
    setFilteredData([...filteredData, ...filteredApiData])
    setTableData(filteredFrontData)
  }
  // End Table

  return (
    <div>
      {loader ?
        <div className="spin-wrapper">
          <Spin />
        </div> :
        <>
          <Card className="strpied-tabled-with-hover">
            <Card.Header>
              <Card.Title as='h5'>{t('Organization Add')}</Card.Title>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              <ModalForm
                visible={visible}
                onCancel={() => setVisible(false)}
                onCreate={handleCreate}
                tableData={tableData}
                clicked={code}
                contractorid={props.match.params.id}
                banks={banks}
                state={status}
                edit
              />
              <TableModalForm
                visible={tableVisible}
                onCancel={() => setTableVisible(false)}
                onCreate={handleTableCreate}
                tableData={tableData}
                contractorid={props.match.params.id}
                banks={banks}
                state={status}
              />
              <div className={classes.OrganizationEdit}>
                <Form
                  {...layout}
                  form={form}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  className={classes.Form}
                  id="mainForm">
                  <Row gutter={[16, 16]}>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t('inn')}
                        name={t("inn")}
                        rules={[
                          {
                            required: true,
                            pattern: /^[\d]{9,9}$/,
                            message: t('Please input valid your inn!'),
                          },
                        ]}>
                        <Search
                          placeholder="Inn"
                          onSearch={onSearch}
                          enterButton
                          className={classes.Search}
                          type='number' />
                      </Form.Item>
                      <Form.Item
                        label={t('zip code')}
                        name={t("zip code")}
                        rules={[
                          {
                            required: true,
                            message: t('Please input your vatcode!'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label={t('region')}
                        name={t("OblastID")}
                        rules={[
                          {
                            required: true,
                            message: t('OblastID is required')
                          },
                        ]}>
                        <Select
                          placeholder={t("Select Oblast")}
                          allowClear
                          getPopupContainer={trigger => trigger.parentNode}
                          onChange={handleOblast}
                          > 
                          {oblasts.map(
                            oblast => <Option value={oblast.id} key={oblast.id}>{oblast.name}</Option>)
                          }
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label={t('oked')}
                        name={t("OKED")}
                        rules={[
                          {
                            required: true,
                            message: t('Please input your username!'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label={t('VatCode')}
                        name="VatCode"
                        rules={[
                          {
                            required: true,
                            message: t('Please input your username!'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t('shortname')}
                        name="ShortName"
                        rules={[
                          {
                            required: true,
                            message: t('Please input your username!'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label={t('address')}
                        name="Adress"
                        rules={[
                          {
                            required: true,
                            message: t('Please input your username!'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label={t('district')}
                        name={t("RegionID")}
                        rules={[
                          {
                            required: true,
                            message: t('RegionID is required')
                          },
                        ]}>
                        <Select
                          placeholder={t("Select District")}
                          allowClear
                          getPopupContainer={trigger => trigger.parentNode}>
                          {regions.map(region => <Option value={region.id} key={region.id}>{region.name}</Option>)}
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label={t('director')}
                        name="Director"
                        rules={[
                          {
                            required: true,
                            message: t('Please input Director name'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label={t('Cashier')}
                        name="Cashier"
                        rules={[
                          {
                            required: true,
                            message: t('Please input your accounter!'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t('fullname')}
                        name="FullName"
                        rules={[
                          {
                            required: true,
                            message: t('Please input your username!'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label={t('contacts')}
                        name="ContactInfo"
                        rules={[
                          {
                            required: true,
                            message: t('Please input your contacts!'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label={t('status')}
                        name={t("StateID")}
                        rules={[
                          {
                            required: true,
                            message: t('StateID is required')
                          },
                        ]}>
                        <Select
                          placeholder={t("Select State")}
                          allowClear
                          getPopupContainer={trigger => trigger.parentNode}                  >
                          {status.map(
                            state => <Option value={state.id} key={state.id}>{state.name}</Option>)
                          }
                        </Select>
                      </Form.Item>
                      <Form.Item
                        label={t('accounter')}
                        name="Accounter"
                        rules={[
                          {
                            required: true,
                            message: t('Please input your accounter!'),
                          },
                        ]}>
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div className={classes.OrganizationEdit}>
                <div className={classes.ButtonWrapper}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setTableVisible(true)
                    }}>
                    {t('add-new')} +
                </Button>
                </div>
                <Table
                  columns={columns}
                  dataSource={[...tableData]}
                  rowKey={record => record.code}
                  pagination={false}
                  loading={loader}
                  bordered
                  className='accounts-table'
                />
                <Col xl={24} lg={12}>
                  <Form.Item>
                    <div className={classes.Buttons}>
                      <Link to='/organization'>
                        <Button
                          type="danger"
                          onClick={() => openWarningNotification('warning', t('not-saved'))}
                        >
                          {t('back')}
                        </Button>
                      </Link>
                      <Button
                        type="primary"
                        htmlType="submit"
                        form="mainForm"
                      >
                        {t('save')}
                      </Button>
                    </div>
                  </Form.Item>
                </Col>
              </div>
            </Card.Body>
          </Card>
        </>
      }
    </div>
  );
}

export default AddOrganization;