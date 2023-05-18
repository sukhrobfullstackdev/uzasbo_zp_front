import React, { useEffect, useState, useCallback } from "react";
import { Modal, Form, Radio, Space, Typography, Spin, Button, Input } from "antd";
import { useTranslation } from 'react-i18next';
import { Fade } from "react-awesome-reveal";

import { Notification } from "../../../../../../../helpers/notifications";
import classes from '../../Employee.module.scss';
import PlasticCard from '../PlasticCard';
import PayrollOfPlasticCardSheetServices from "../../../../../../../services/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/PayrollOfPlasticCardSheet.services";

const { Title, Text } = Typography;

const PlasticModal = ({ INPSCode, bankCode, bankParentCode, ...props }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(true);
  const [plasticCardsInfo, setPlasticCardsInfo] = useState([]);
  const [humoPlasticCardsInfo, setHumoPlasticCardsInfo] = useState([]);

  const fetchPlastics = useCallback(async (accCode = null) => {
    setLoading(true);
    try {
      const plasticCardsInf = await PayrollOfPlasticCardSheetServices.getPlasticCardInfo({
        PINFL: INPSCode,
        MFOCode: bankCode,
        SettlementeAccountCode: accCode
      });

      setPlasticCardsInfo(plasticCardsInf.data.uzcard);
      setHumoPlasticCardsInfo(plasticCardsInf.data.humo);
      setLoading(false);
    } catch (error) {
      Notification('error', error);
      setLoading(false);
    }

  }, [INPSCode, bankCode])

  useEffect(() => {
    fetchPlastics()
  }, [INPSCode, bankCode, fetchPlastics])

  const onSearch = (values) => {
    fetchPlastics(values.accCode)
  }

  const body = (
    <>
      {(+bankParentCode === 10 ||+bankParentCode === 11 || +bankParentCode === 12 || +bankParentCode === 3 || +bankParentCode === 5 || +bankParentCode === 16 || +bankParentCode === 15 || +bankParentCode === 14 || +bankParentCode === 17) &&
        <Form
          className='table-filter-form'
          onFinish={onSearch}
        >
          <div className="main-table-filter-elements">
            <Form.Item
              name="accCode"
              className={classes['center']}
              rules={[
                {
                  required: true,
                  message: t('inputValidData'),
                  pattern: /^[\d]{20,20}$/,
                },
              ]}
            >
              <Input
                size="large"
                maxLength={20}
                placeholder={t('searchByAccCode') + '(23106,,,23108)'}
                className={`${classes['input-search']}`}
                style={{ width: 370 }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
              >
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>
          </div>
        </Form>
      }
      <Form
        form={form}
        layout="vertical"
      >
        <Title level={5}>{t('UzCard')}</Title>
        {
          plasticCardsInfo.length === 0 ?
            <div style={{ textAlign: 'center' }}><Text type="danger">{t('plasticCardNotFound')}</Text></div> :
            <Form.Item
              name="account"
              className={classes['center']}
            // rules={[
            //   {
            //     required: true,
            //     message: t('pleaseSelect'),
            //   },
            // ]}
            >
              <Radio.Group>
                <Space>
                  {plasticCardsInfo.map(item => (
                    <Radio value={item.account} className={classes['radio']} key={item.account}>
                      <PlasticCard
                        name='uzcard'
                        fullName={item.fullName}
                        cardNumber={item.pan}
                      />
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>
        }
        <Title level={5}>{t('Humo')}</Title>
        {
          humoPlasticCardsInfo.length === 0 ?
            <div style={{ textAlign: 'center' }}><Text type="danger">{t('plasticCardNotFound')}</Text></div> :
            <Form.Item
              name="humoAccount"
              className={classes['center']}
            // rules={[
            //   {
            //     required: true,
            //     message: t('pleaseSelect'),
            //   },
            // ]}
            >
              <Radio.Group>
                <Space>
                  {humoPlasticCardsInfo.map(item => (
                    <Radio value={item.account} className={classes['radio']} key={item.account}>
                      <PlasticCard
                        name='humo'
                        fullName={item.fullName}
                        cardNumber={item.pan}
                      />
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>
        }
      </Form>

    </>)

  return (
    <Modal
      width={1000}
      maskClosable={false}
      title={t("plasticCardInfo")}
      visible={props.visible}
      cancelText={t('cancel')}
      okText={t('save')}
      onCancel={props.onCancel}
      onOk={() => {
        form.validateFields()
          .then(values => {
            props.onOk(values);
          })
          .catch(err => err);
      }}
    >
      <Spin spinning={loading}>
        <Fade>
          {body}
        </Fade>
      </Spin>
    </Modal >
  );
};

export default React.memo(PlasticModal);