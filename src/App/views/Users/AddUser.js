import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, Select } from "antd";
import { useTranslation } from 'react-i18next';
import { Link, Prompt } from 'react-router-dom';

import UserServices from '../../../../services/user/user.services';
import CommonServices from '../../../../services/common/common.services';

import Card from "../../../components/MainCard";
import { openSuccessNotification, openWarningNotification } from '../../../../helpers/notifications';
import classes from './Users.module.css';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const AddUser = (props) => {
  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [status, setStatus] = useState([]);
  const [isEntering, setIsEntering] = useState(false);
  const { t } = useTranslation();
  const { Option } = Select;

  useEffect(() => {
    UserServices.getRoleList()
      .then(response => {
        setRoles(response.data);
      })
      CommonServices.getStatus()
      .then(response => {
        setStatus(response.data);
      })
      .catch(err => {
        alert(err)
        console.log(err);
      })

    UserServices.getOrgList()
      .then(response => {
        setOrganizations(response.data);
      })
  }, [])

  // useEffect(() => {
  //   UserServices.getRoleList()
  //     .then(response => {
  //       setRoles(response.data);
  //     })
  //   UserServices.getOrgList()
  //     .then(response => {
  //       setOrganizations(response.data);
  //     })
  //     UserServices.getStateList()
  //       .then(response => {
  //         setStatus(response.data);
  //         console.log(response.data);
  //       })
  // }, [])

  const formFocusedHandler = () => {
    setIsEntering(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onFinish = (values) => {
    setIsEntering(false);
    values.id = 0;
    values.StateID = parseInt(values.StateID)
    
    UserServices.postUser(values)
      .then(response => {
        openSuccessNotification('success', t('success-msg'))
        const { history } = props
        history.push('/users')
      })
      .catch(err => {
        alert(err.response.data.error)
        console.log(err.response.data.error);
      })
  };

  return (
    <>
      <Prompt
        when={isEntering}
        message="Are you sure you want to leave?"
      />
      <Card title={t('add-user')}>
        <Form
          {...layout}
          name="user"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onFocus={formFocusedHandler}
        >
          <Row gutter={[16, 16]}>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t('username')}
                name="username"
                rules={[
                  {
                    required: true,
                    message: t('Please input valid'),
                  },
                ]}
              >
                <Input placeholder={t('username')} />
              </Form.Item>
              <Form.Item
                label={t('password')}
                name="password"
                rules={[
                  {
                    required: true,
                    message: t('Please input valid'),
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder={t('password')} />
              </Form.Item>
              <Form.Item
                label={t('roles')}
                name="roles"
                rules={[
                  {
                    required: true,
                    message: t('Please input valid'),
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder={t('choose')}
                  getPopupContainer={trigger => trigger.parentNode}
                >
                  {roles.map(role =>
                    <Option key={role.id} value={role.shortname}>{role.shortname}</Option>
                  )}
                </Select>
              </Form.Item>
            </Col>

            <Col xl={8} lg={12}>
              <Form.Item
                label={t('accountname')}
                name="displayName"
                rules={[
                  {
                    required: true,
                    message: t('Please input valid'),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={t('confirm-password')}
                name="passwordConfirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label={t('phone-num')}
                name="mobileNumber"
                rules={[
                  {
                    required: true,
                    pattern: /^[\d]{12,12}$/,
                    message: t('Please input valid'),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xl={8} lg={12}>
              <Form.Item
                label={t('organization')}
                name="organizationID"
                rules={[
                  {
                    required: true,
                    message:t('Please input valid'),
                  },
                ]}
              >
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                  placeholder={t('choose')}>
                  {organizations.map(
                    item => <Option key={item.id} value={item.id}>{item.shortname}</Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item
                label={t('mail')}
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
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
              <div className={classes.BtnWrapper}>
                <Link to='/users' style={{ marginRight: '15px' }}>
                  <Button
                    type="danger"
                    onClick={() => openWarningNotification('warning', t('not-saved'))}
                  >
                    {t('back')}
                  </Button>
                </Link>
                <Button type="primary" htmlType="submit" >
                  {t('save')}
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </>

  );
}

export default AddUser;