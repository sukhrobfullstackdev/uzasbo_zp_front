import React, {useState, useEffect }from "react";
import { Modal, Form, DatePicker, Switch, Col } from "antd";
import { useTranslation } from 'react-i18next';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
// import moment from 'moment';

import classes from './PayrollandCharge.module.css';

const EducationModal = (props) => {

  const [dateVisible, setDateVisible] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  
  useEffect(() => {
    form.setFieldsValue({
      IsByTimeSheet: false, 
    })
    setDateVisible(true);
  }, [form]);

  const disableSwitchHandler= (value) => {
    console.log(value);
    if(value === true){
      setDateVisible(false);
    }else{
      setDateVisible(true);
    }
  };


  return (
    <Modal
      visible={props.visible}
      title={t('Calculation')}
      cancelText={t('cancel')}
      okText={t('save')}
      onCancel={props.onCancel}
      forceRender
      onOk={() => {
        form
          .validateFields()
          .then((values) => {  
            if (values.TimeSheetStartDate===undefined )  {
              values.TimeSheetStartDate = null;
              values.TimeSheetEndDate = null;
            } else if(values.TimeSheetStartDate !==undefined ){
              values.TimeSheetStartDate = values.TimeSheetStartDate.format("DD.MM.YYYY");
              values.TimeSheetEndDate = values.TimeSheetEndDate.format("DD.MM.YYYY");
            }
            props.onCreate(values);
            props.onCancel();
           
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
        <Col xl={6} lg={8}>
          <Form.Item 
          label={t('IsByTimeSheet')}
          name='IsByTimeSheet'
          valuePropName='checked'
          >
          <Switch
           onChange={disableSwitchHandler}
           checkedChildren={<CheckOutlined />}
           unCheckedChildren={<CloseOutlined />} > 
          </Switch>
          </Form.Item>
          </Col>
         
        <div className={classes.InputsWrapper}>         
          <Form.Item 
            label={t('TimeSheetStartDate')}
            name="TimeSheetStartDate"
            // rules={[
            //   {
            //     required: true,
            //     message: t("Please select"),
            //   },
            // ]}
            >
            <DatePicker
              format="DD.MM.YYYY"
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode} disabled={dateVisible}/>
          </Form.Item>
          <Form.Item
            label={t('TimeSheetEndDate')}
            name="TimeSheetEndDate"
            // rules={[
            //   {
            //     required: true,
            //     message: t("Please select"),
            //   },
            // ]}
            >
            <DatePicker
              format="DD.MM.YYYY"
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode} disabled={dateVisible}/>
          </Form.Item>
              
        </div>
       
      </Form>
    </Modal>
  );
};

export default React.memo(EducationModal);