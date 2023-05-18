import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Form, Button, Switch, Checkbox, Spin, Select, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { openSuccessNotification, openWarningNotification } from '../../../../helpers/notifications';
import RoleServices from '../../../../services/role/role.services';
import CommonServices from '../../../../services/common/common.services';
import Card from "../../../components/MainCard";
import classes from './Roles.module.css';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const AddRole = (props) => {
  const [modules, setModules] = useState([]);
  const [isDefault, setDefault] = useState(false);
  const [loader, setLoader] = useState(true);
  const [status, setStatus] = useState([]);
  const [form] = Form.useForm();
  const { Option } = Select;
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      try {
        let moduleList = await RoleServices.getModuleList();
        let status = await CommonServices.getStatus();
        setModules(moduleList.data);
        setStatus(status.data);
        setLoader(false);
      } catch (err) {
        alert(err);
        console.log(err);
      }
    }
    fetchData();
    // await RoleServices.getModuleList()
    //   .then(response => {
    //     setModules(response.data)
    //     setLoader(false)
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     alert(err)
    //   })

    // await RoleServices.getStateList()
    //   .then(response => {
    //     setStatus(response.data);
    //   })
    //   .catch(err => {
    //     alert(err)
    //     console.log(err);
    //   })

    // setLoader(false);
  }, [])

  const onFinish = (values) => {
    values.ID = 0;
    values.StateID = Number(values.StateID)
    RoleServices.postRole(values)
      .then(response => {
        const { history } = props;
        history.push('/roles');
        openSuccessNotification('success', t('success-msg'));
      })
      .catch(err => {
        alert(err.response.data.error)
        console.log(err.response.data.error);
      })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  let checkbox = <Form.Item name="ModuleIDList">
    <Checkbox.Group style={{ width: '100%' }}>
      {modules.map(item => {
        return (
          <div key={item.objectname} className={classes.CheckboxWrapper}>
            <Divider orientation="left" plain className={classes.Divider}>
              {item.objectname}
            </Divider>
            <Row>
              {
                item.modulelist.map(item => (
                  <Col span={8} key={item.id}>
                    <Checkbox
                      value={item.id}
                      style={{
                        lineHeight: '32px',
                      }}
                    >
                      {item.name}
                    </Checkbox>
                  </Col>
                ))
              }
            </Row>
          </div>
        )
      })}
    </Checkbox.Group>
  </Form.Item>;

  if (isDefault) {
    checkbox = null;
  }

  return (
    <>
      {loader ?
        <div className="spin-wrapper">
          <Spin />
        </div> :
        <Card title='Add role'>
          <Form
            {...layout}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{
              'IsDefault': isDefault,
              'IsAdmin': false
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xl={6}>
                <Form.Item
                  label={t('shortname')}
                  name="ShortName"
                  rules={[
                    {
                      required: true,
                      message:t('Please input valid'),
                    },
                  ]}>
                  <Input placeholder={t('shortname')} />
                </Form.Item>
              </Col>
              <Col xl={6}>
                <Form.Item
                  label={t('fullname')}
                  name="FullName"
                  rules={[
                    {
                      required: true,
                      message: t('Please input valid'),
                    },
                  ]}>
                  <Input placeholder={t('fullname')} />
                </Form.Item>
              </Col>
              <Col xl={6} className={classes.Switches}>
                <Form.Item
                  name="IsDefault"
                  label="IsDefault"
                  valuePropName="checked">
                  <Switch onChange={() => setDefault(!isDefault)} />
                </Form.Item>
                <Form.Item
                  name="IsAdmin"
                  label="IsAdmin"
                  valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col xl={6}>
                <Form.Item
                  label={'Status'}
                  name="StateID"
                  rules={[
                    {
                      required: true,
                    },
                  ]}>
                  <Select
                    placeholder="Select State"

                    getPopupContainer={trigger => trigger.parentNode}                  >
                    {status.map(
                      state => <Option value={state.id} key={state.id}>{state.name}</Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={24}>
                {checkbox}
              </Col>
              <Col xl={24}>
                <Form.Item className='btns'>
                  <Link to='/roles'>
                    <Button
                      type="danger"
                      onClick={() => openWarningNotification('warning', t('not-saved'))}
                    >
                      {t('back')}
                    </Button>
                  </Link>
                  <Button type="primary" htmlType="submit">
                    {t('save')}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      }
    </>
  );
}

export default AddRole;