import React, { useState, useEffect } from 'react';
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Select, Input, Spin, Space } from "antd";

import Card from "../../../components/MainCard";
import UserErorApis from '../../../../services/Admin/UserError/UserErorApis';
import HelperServices from "../../../../services/Helper/helper.services";
import { Notification } from "../../../../helpers/notifications";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;
const { TextArea } = Input;

const UpdateUserError = (props) => {
  const { t } = useTranslation();
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const docId = props.match.params.id ? props.match.params.id : 0;

  const [loading, setLoading] = useState(true);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [formDt, statusLs] = await Promise.all([
        UserErorApis.getById(docId),
        HelperServices.getStateList(),
      ]);

      setStatusList(statusLs.data);
      mainForm.setFieldsValue({
        ...formDt.data,
      });
      setLoading(false);
    }

    fetchData().catch(err => {
      Notification('error', err);
      setLoading(false);
    });
  }, [docId, mainForm]);

  const onMainFormFinish = (values) => {
    setLoading(true);
    values.ID = docId;

    UserErorApis.update(values)
      .then((res) => {
        history.push(`/UserError`);
        Notification('success', docId === 0 ? t('success-msg') : t('edited'));
      })
      .catch((err) => {
        Notification('error', err);
        setLoading(false);
      });
  }

  return (
    <Fade>
      <Card title={t("userErrorList")}>
        <Spin spinning={loading} size='large'>
          <Form
            {...layout}
            id='mainForm'
            form={mainForm}
            onFinish={onMainFormFinish}
          >
            <Row gutter={[15, 0]}>
              <Col span={12} xl={3} lg={12}>
                <Form.Item
                  label={t("errorCode")}
                  name="Code"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <Input style={{ width: "100%" }} placeholder={t("errorCode")} />
                </Form.Item>
              </Col>
              <Col span={12} xl={3} lg={12}>
                <Form.Item
                  label={t("status")}
                  name="StateID"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder={t("status")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {statusList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} xl={18} lg={12}>
                <Form.Item
                  label={t("link")}
                  name="Link"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <TextArea rows={1} placeholder={t("errorNameUzb")} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[15, 0]}>
              <Col span={24} xl={12} lg={12}>
                <Form.Item
                  label={t("errorNameUzb")}
                  name="ErrorNameUzb"
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder={t("errorNameUzb")} />
                </Form.Item>
              </Col>
              <Col span={24} xl={12} lg={12}>
                <Form.Item
                  label={t("descriptionUzb")}
                  name="DescriptionUzb"
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder={t("descriptionUzb")} />
                </Form.Item>
              </Col>
              <Col span={24} xl={12} lg={12}>
                <Form.Item
                  label={t("errorNameRus")}
                  name="ErrorNameRus"
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder={t("errorNameRus")} />
                </Form.Item>
              </Col>
              <Col span={24} xl={12} lg={12}>
                <Form.Item
                  label={t("descriptionRus")}
                  name="DescriptionRus"
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <TextArea rows={4} placeholder={t("descriptionRus")} />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Space size='middle' className='btns-wrapper'>
            <Button
              type="danger"
              onClick={() => {
                history.goBack();
                Notification("warning", t("not-saved"));
              }}
            >
              {t("back")}
            </Button>
            <Button
              htmlType="submit"
              form="mainForm"
              type="primary"
            >
              {t("save")}
            </Button>
          </Space>
        </Spin>
      </Card>
    </Fade>
  );
};

export default UpdateUserError;