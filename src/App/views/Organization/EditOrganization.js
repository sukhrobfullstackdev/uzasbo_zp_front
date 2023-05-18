import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Form, Button, Select, Spin, Table, Space, Popconfirm, Tag, Modal } from 'antd';
import { Link } from "react-router-dom";
// import { Card } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

import BankServices from '../../../../services/Banks/bank.services';
import CommonServices from '../../../../services/common/common.services';
import { openSuccessNotification, openWarningNotification } from '../../../../helpers/notifications';
import OrganizationServices from '../../../../services/Organization/organization.services';
import classes from './Organization.module.css';
import ModalForm from "./ModalForm";
import TableModalForm from "./TableModalForm";
import { InfoCircleOutlined } from '@ant-design/icons';

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

const EditOrganization = (props) => {
  const [oblasts, setOblasts] = useState([])
  const [organization, setOrganization] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [regions, setRegions] = useState([])
  const [status, setStatus] = useState([])
  const [banks, setBanks] = useState([])
  const [tableData, setTableData] = useState([])
  const [loader, setLoader] = useState(true)
  // for modal
  const [visible, setVisible] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [code, setCode] = useState(null);
  // End for modal
  const [form] = Form.useForm();
  // const [tableForm] = Form.useForm();
  const { t } = useTranslation();
  //History modal
  // const [modal1Visible, setModal1Visible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // const showModal = () => {
  //   setIsModalVisible(true);
  // };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
      render: (stateid) => {
        if (stateid === 1) {
          return (<Tag color="#87d068" key={stateid}> {t('active')}</Tag>)
        } else if (stateid === 2) {
          return (<Tag color="#f50" key={stateid}>{t('passive')}</Tag>)
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
              <i className="feather icon-edit" />
            </span>
            <Popconfirm
              title={'delete'}
              onConfirm={() => {
                InnerTableDeleteHandler(record.code);
                openWarningNotification('warning', 'Deleted');
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
    async function fetchData() {
      try {
        let oblast = await OrganizationServices.getOblastList();
        let status = await CommonServices.getStatus();
        let banks = await BankServices.getAllBanks();
        let organization = await OrganizationServices.getById(props.match.params.id);
        setOblasts(oblast.data);
        setStatus(status.data);
        setBanks(banks.data);
        setOrganization(organization.data);
        setTableData(organization.data.Accounts);
        setInitialRegions(organization.data.OblastID);
        setLoader(false);
      } catch (err) {
        alert(err);
        console.log(err);
      }
    }

    fetchData();
  }, [props.match.params.id]);

  const setInitialRegions = (id) => {
    OrganizationServices.getRegionList(id)
      .then(response => {
        setRegions(response.data)
      })
      .catch(err => {
        alert(err)
        console.log(err);
      })
  }

  // Functions for modal

  const handleCreate = (values) => {
    setTableData(values);
    setVisible(false);
  };
  const handleTableCreate = (values) => {
    console.log('hi');
    setTableData([...tableData, values]);
    setTableVisible(false);
    openSuccessNotification('success', 'success-msg');
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
          StateID: response.data.StateID,
          Accounter: response.data.Accounter,
        });
        handleOblast(response.data.OblastID)
        setLoader(false)
      })
      .catch(err => {
        alert(`Invalid inn: ${err}`)
      })
  }

  const onFinish = (values) => {
    values.id = props.match.params.id;
    values.isbudged = false;
    values.Branches = [];
    values.Accounts = [...tableData, ...filteredData];
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


  // history button 


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
              {/* <HistoryModal
                onClick={() => setModal1Visible(false)}
              /> */}
              <div className={classes.OrganizationEdit}>
                <Form
                  {...layout}
                  form={form}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  className={classes.Form}
                  initialValues={{
                    Inn: organization.INN,
                    ZipCode: organization.ZipCode,
                    OblastID: organization.OblastID,
                    OKED: organization.OKED,
                    ShortName: organization.ShortName,
                    Adress: organization.Adress,
                    RegionID: organization.RegionID,
                    Director: organization.Director,
                    FullName: organization.FullName,
                    ContactInfo: organization.ContactInfo,
                    StateID: organization.StateID,
                    Accounter: organization.Accounter
                  }}
                  id="mainForm">
                  <Row gutter={[16, 16]}>
                    <Col xl={8} lg={12}>
                      <Form.Item
                        label={t('inn')}
                        name='Inn'
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
                          type='number'
                        />
                      </Form.Item>

                      <Form.Item
                        label={t('zip code')}
                        name='ZipCode'
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
                          onChange={handleOblast}>
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
                        ]}
                      >
                        <div className={classes.short_name}>
                          <Input />
                          <Button className={classes.short_name_button} type="primary"
                            onClick={() => setIsModalVisible(true)} icon={<InfoCircleOutlined />}
                          />
                          <Modal title={t("history")} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                            <p>Some contents...</p>
                          </Modal>
                        </div>
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

export default EditOrganization;