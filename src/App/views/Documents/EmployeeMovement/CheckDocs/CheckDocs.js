import React, { useState } from 'react';
import { Form, Button, Select, Space, InputNumber, Card, Spin, Row, Col } from "antd";
import { useTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';

import { Notification } from "../../../../../helpers/notifications";
import MainCard from "../../../../components/MainCard";
import months from '../../../../../helpers/months';
import CheckDocsServices from "../../../../../services/Documents/EmployeeMovement/CheckDocs/CheckDocs.services";

const { Option } = Select;
const currentDate = moment();
const month = currentDate.format('MM');
const year = currentDate.format('YYYY');

const CheckDocs = () => {
  let inUzbek = false;
  let lang = localStorage.getItem('i18nextLng');
  if (lang === 'uzLat' || lang === 'uzCyrl') {
    inUzbek = true;
  }
  const { t } = useTranslation();

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   CheckDocsServices.getDocs(month, year, inUzbek)
  //     .then(res => {
  //       if (res.status === 200) {
  //         setDocs(res.data);
  //         setLoading(false);
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       setLoading(false);
  //       Notification('error', err);
  //     })
  // }, [lang]);

  const onFinish = (values) => {
    setLoading(true);
    CheckDocsServices.getDocs(values.Month, values.Year, inUzbek)
      .then(res => {
        if (res.status === 200) {
          setDocs(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        // console.log(err);
        setLoading(false);
        Notification('error', err);
      })
  };

  const docsNode = docs.map((item, index) => (
    <Col xl={12} key={index}>
      <Card
        hoverable
        title={item.Name}
        size='small'
        className='check-docs-card'
      >
        {item.Body.map((bodyItem, index) => <p key={index}>{bodyItem.Info}</p>)}
      </Card>
    </Col>
  ))

  return (
    <MainCard title={t("CheckDocs")}>
      <Fade>
        <Form
          onFinish={onFinish}
          className='table-filter-form'
          initialValues={{
            Month: month,
            Year: year
          }}
        >
          <Space
            size='middle'
            align='start'
          >
            <Form.Item
              label={t("Month")}
              name="Month"
            >
              <Select
                allowClear
                showSearch
                placeholder={t("Month")}
                style={{ width: 170 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {months.map(item => <Option key={item.id} value={item.id}>{t(item.name)}</Option>)}
              </Select>
            </Form.Item>
            <Form.Item
              label={t('Year')}
              name='Year'
            >
              <InputNumber placeholder={t('Year')} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>
          </Space>
        </Form>
        <Spin spinning={loading} size='large'>
          <Row gutter={[16, 16]} align="top">
            {docsNode}
          </Row>
        </Spin>
      </Fade>
    </MainCard>
  );
};

export default CheckDocs;