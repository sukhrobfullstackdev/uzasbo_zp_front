import React from 'react';
import { Row, Col, Form, Input, Button } from "antd";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { openSuccessNotification, openWarningNotification } from '../../../helpers/notifications';
import classes from './Users.module.css';
import Card from "../../components/MainCard";
import UserServices from '../../../services/user/user.services';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const ChangePwd = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onFinish = (values) => {
    UserServices.changePwd(values)
      .then(res => {
        if (res.status === 200) {
          openSuccessNotification('success', t('edited'));
          props.history.push('/');
        }
      })
      .catch(err => {
        // alert(err.response.data.error)
        console.log(err);
      })
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    alert('Failed:', errorInfo);
  };

  return (
    <Card title={t('change-pwd')}>
      <Form
        {...layout}
        form={form}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[16, 16]} justify='center'>
          <Col xl={8} lg={12}>
            <Form.Item
              label={t('current-pwd')}
              name="oldpassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your oldpassword!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label={t('new-pwd')}
              name="newpassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your newpassword!',
                  pattern: /(?=.*[@$!%*#?&+])[A-Za-z\d@$!%*#?&+]{6,}$/,
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label={t('confirm-password')}
              name="confirmedpassword"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please confirm your confirmedpassword!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newpassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item className={classes.BtnWrapper} style={{ textAlign: 'center' }}>
              <Link to='/admin/users' style={{ marginRight: '15px' }}>
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
  );

}

export default ChangePwd;