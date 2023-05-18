import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Input, Button, Select, Spin } from "antd";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import UserServices from '../../../../services/user/user.services';
import CommonServices from '../../../../services/common/common.services';
import { openSuccessNotification, openWarningNotification } from '../../../../helpers/notifications';
import Card from "../../../components/MainCard";
import classes from './Users.module.css';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const EditUser = (props) => {
  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loader, setLoader] = useState(true)
  const [status, setStatus] = useState([])
  const [userData, setUserData] = useState([])
  const { t } = useTranslation();
  const { Option } = Select;
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      try {
        let org = await UserServices.getOrgList();
        let status = await CommonServices.getStatus();
        let userData = await UserServices.getUser(props.match.params.id);
        let roles = await UserServices.getRoleList();
        setOrganizations(org.data);
        setStatus(status.data);
        setUserData(userData.data)
        setRoles(roles.data)
        setLoader(false);
      } catch (err) {
        alert(err);
        console.log(err);
      }
    }
    fetchData();

    // UserServices.getStateList()
    //   .then(response => {
    //     setStatus(response.data);
    //     console.log(response.data);
    //   })
    //   .catch(err => {
    //     alert(err)
    //     console.log(err);
    //   })

    // UserServices.getOrgList()
    //   .then(response => {
    //     setOrganizations(response.data)
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     alert(err)
    //   })

    // UserServices.getUser(props.match.params.id)
    //   .then(response => {
    //     form.setFieldsValue({
    //       username: response.data.Username,
    //       password: response.data.Password,
    //       roles: response.data.Roles,
    //       displayName: response.data.DisplayName,
    //       passwordConfirm: response.data.PasswordConfirm,
    //       mobileNumber: response.data.MobileNumber,
    //       organizationID: response.data.OrganizationID,
    //       email: response.data.Email,
    //       StateID: response.data.StateID,
    //     });
    //     setLoader(false)
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     alert(err)
    //   })
  }, [props.match.params.id]);

  const onFinish = (values) => {
    values.id = props.match.params.id;
    values.password = values.password ? values.password : delete values.password;
    values.passwordConfirm = values.passwordConfirm ? values.passwordConfirm : delete values.passwordConfirm;
    UserServices.postUser(values)
      .then(response => {
        openSuccessNotification('success', t('edited'));
        const { history } = props;
        history.push('/users');
      })
      .catch(err => {
        alert(err.response.data.error);
        console.log(err.response.data.error);
      })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    alert('Failed:', errorInfo);
  };

  let user = <div className="spin-wrapper"><Spin /></div>
  if (!loader) {
    user = <Card title={t('add-user')}>
      <Form
        {...layout}
        form={form}
        name="user"
        initialValues={{
          remember: true,
          username: userData.Username,
          password: userData.Password,
          roles: userData.Roles,
          displayName: userData.DisplayName,
          passwordConfirm: userData.PasswordConfirm,
          mobileNumber: userData.MobileNumber,
          organizationID: userData.OrganizationID,
          email: userData.Email,
          StateID: userData.StateID
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[16, 16]}>
          <Col xl={8} lg={12}>
            <Form.Item
              label={t('username')}
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('password')}
              name="password"
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label={t('roles')}
              name="roles"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Please select"
                getPopupContainer={trigger => trigger.parentNode}
              >
                {roles.map(role => <Option key={role.id} value={role.shortname}>{role.shortname}</Option>)}
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
                  message: 'Please input your displayName!',
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
                // {
                //   required: true,
                //   message: 'Please confirm your password!',
                // },
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
                  message: 'Please enter valid mobile number!',
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
                  message: 'Please enter valid Organization!',
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
              <Input type='email' />
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
            <Form.Item className={classes.BtnWrapper}>
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
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  }

  return (
    <div>
      {user}
    </div>
  );
}


export default EditUser;