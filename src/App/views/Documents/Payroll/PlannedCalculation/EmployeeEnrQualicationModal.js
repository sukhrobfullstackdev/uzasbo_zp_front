import React, { useEffect } from "react";
import { Modal, Form, Switch, Col, InputNumber } from "antd";
import { useTranslation } from 'react-i18next';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
// import moment from 'moment';

import classes from './PlannedCalculation.module.css';

const EducationModal = (props) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    form.setFieldsValue({
      IsMainWork: true,
      IsInternal: false,
      IsExternal: true,
      IsCombination: false,
      ByAllSource: true,
      Male: true,
      Female: true,
      Sum: 0,
      Percentage: 0,
      Day: 0,
      Hour: 0
    })
  }, [form]);

  const inputBlurHandler = (e) => {
    if (e.target.value === '' && e.target.id === 'Sum') {
      form.setFieldsValue({ Sum: 0 });
    } else if (e.target.value === '' && e.target.id === 'Percentage') {
      form.setFieldsValue({ Percentage: 0 });
    }
  }

  return (
    <Modal
      visible={props.visible}
      title={t('registration')}
      okText={t('save')}
      cancelText={t('cancel')}
      onCancel={props.onCancel}
      forceRender
      width={600}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            props.onCreate(values);
            props.onCancel();
            // console.log(values);
             form.resetFields();
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        layout="vertical"
        form={form}
      >
        <div className={classes.InputsWrapper}>
          <Form.Item
            label={t('Summa')}
            name='Sum'
          
          >
            <InputNumber
              min={-9999999827968}
              max={999999986991104}
              placeholder={t('Summa')}
              style={{ width: 230 }}
              decimalSeparator=','
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              onBlur={inputBlurHandler}
            />
          </Form.Item>
          <Form.Item
            label={t('Percentage')}
            name='Percentage'
          
          >
            <InputNumber
              placeholder={t('Percentage')}
              onBlur={inputBlurHandler}
            />
           

          </Form.Item>
          <Form.Item
            label={t('Days')}
            name='Day'
        
          >
            <InputNumber placeholder={t('Days')} min={0} />
          </Form.Item>

          <Form.Item
            label={t('hours')}
            name="Hour"
          
          >
            <InputNumber placeholder={t('Days')} min={0} />
          </Form.Item>
        </div>
        <Col xl={12} lg={8}>
          <Form.Item
            label={t('ByAllSources')}
            name='ByAllSource'
            valuePropName='checked'
          >
            <Switch checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}> </Switch>
              </Form.Item>
        </Col>

        <Col xl={24} lg={24} >
        <h5>{t('EnrolType')}</h5>
          <div className={classes.InputsWrapper}>
            <Form.Item
              label={t('MainWork')}
              name='IsMainWork'
              valuePropName='checked'
              style={{ display: 'flex' }}
            >
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
              >
              </Switch>
            </Form.Item>
            <Form.Item
              label={t('Internal')}
              name='IsInternal'
              valuePropName='checked'
            >
              <Switch checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}> </Switch>
            </Form.Item>
            <Form.Item
              label={t('External')}
              name='IsExternal'
              valuePropName='checked'
            >
              <Switch checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}> </Switch>
            </Form.Item>
            <Form.Item
              label={t('IsCombination')}
              name='IsCombination'
              valuePropName='checked'
            >
              <Switch checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}> </Switch>
            </Form.Item>

          </div>
        </Col>

        <Col xl={24} lg={24}>
        <h5>{t('gender')}</h5>
          <div className={classes.InputsWrapper}>            
            <Form.Item
              label={t('Male')}
              name='Male'
              valuePropName='checked'
            >
              <Switch checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}> </Switch>
            </Form.Item>
            <Form.Item
              label={t('Female')}
              name='Female'
              valuePropName='checked'
            >
              <Switch checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}> </Switch>
            </Form.Item>
          </div>
        </Col>

      </Form>
    </Modal>
  );
};

export default React.memo(EducationModal);
