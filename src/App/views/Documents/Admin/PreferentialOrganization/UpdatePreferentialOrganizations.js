import React, { useState, useEffect } from 'react';
import { Fade } from "react-awesome-reveal";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Row, Col, Form, Button, Select, Input, Spin, Space } from "antd";

import Card from "../../../../components/MainCard";
import PreferentialOrganizationServices from "../../../../../services/Documents/Admin/PreferentialOrganization/PreferentialOrganization.services";
import { Notification } from "../../../../../helpers/notifications";
import OrganizationModal from "./OrganizationModal";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';
import classes from "./PreferentialOrg.module.css";
import HelperServices from "../../../../../services/Helper/helper.services";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const { Option } = Select;

const UpdatePreferentialOrganization = (props) => {
  const [loader, setLoader] = useState(true);
  const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);

  const [docId, setDocId] = useState(props.match.params.id ? props.match.params.id : 0);

  const { t } = useTranslation();
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const { size } = useState([]);
  const [status, setStatus] = useState([]);
  const [BenefitType, setBenefitType] = useState([]);
  const [orgId, setOrganizationId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const [prefOrgs, status, BenefitType] = await Promise.all([
        PreferentialOrganizationServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.getStateList(),
        HelperServices.GetBenefitTypeList()

      ]);
      // if (props.match.params.id ? props.match.params.id : 0) {
        setStatus(status.data);
        setBenefitType(BenefitType.data);
        
      // }

      mainForm.setFieldsValue({
        ...prefOrgs.data,
        
      });
      setLoader(false);
    }

    fetchData().catch(err => {
      Notification('error', err);
      setLoader(false);
    });
  }, [props.match.params.id, mainForm]);

  const onMainFormFinish = (values) => {
    values.ID = docId;
    values.OrganizationID = orgId ? orgId : docId
    // values.SubCalculationKindID = subCalcId ? subCalcId : salaryCalc.SubCalculationKindID;
    // values.Date = values.Date.format("DD.MM.YYYY");
    setLoader(true);
    PreferentialOrganizationServices.update(values)
      .then((res) => {
        if (res.status === 200) {
          setLoader(false);
          history.push(`/PreferentialOrganizations`);
          Notification('success', t('success-msg'));
        }
      })
      .catch((err) => {
        Notification('error', err);
        setLoader(false);
      });
  }

  const getOrganizationName = (name, id) => {
    setOrganizationId(id);
    mainForm.setFieldsValue({ OrganizationName: name });
  };

  const onReset = () => {
    mainForm.setFieldsValue({ OrganizationName: null });
  };

  // let fillBtnVisible = true;
  // if (salaryCalc.StatusID === 2 || salaryCalc.StatusID === 6 || salaryCalc.StatusID === 8 || salaryCalc.StatusID === 12) {
  //   fillBtnVisible = false;
  // }

  return (
    <Fade>
      <Card title={t("PreferentialOrganization")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id="mainForm"
            onFinish={onMainFormFinish}
          >
            <Row gutter={[15, 0]}>
              <Col xl={7} lg={12}>
                <div className={classes.EmployeeEnrolmentModal}>
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={employeeEnrQualicationModal}
                    timeout={300}
                  >
                    <OrganizationModal
                      visible={employeeEnrQualicationModal}
                      onCancel={() => setEmployeeEnrQualicationModal(false)}
                      getOrganizationName={getOrganizationName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("OrganizationName")}
                    name="OrganizationName"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        // required: true,
                        message: t("Please input valid"),
                      },
                    ]}>
                    <Input disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      setEmployeeEnrQualicationModal(true);
                    }}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<SearchOutlined />}
                    size={size}
                  />
                  <Button
                    type="primary"
                    onClick={onReset}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<DeleteOutlined />}
                    size={size}
                  />
                </div>
              </Col>

              <Col xl={5} lg={12}>
                <Form.Item
                  label={t("BenefitTypeList")}
                  name="BenefitTypeID"
                  rules={[
                    {
                      required: true,
                      message: t("Please select status"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("Select BenefitType")}
                    allowClear
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {BenefitType.map((BenefitType) => (
                      <Option key={BenefitType.ID} value={BenefitType.ID}>
                        {BenefitType.Shortname}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("OblastName")}
                  name="OblastName"
                >
                  <Input style={{ width: "100%" }} placeholder={t("OblastName")} disabled/>
                </Form.Item>
              </Col>

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("RegionName")}
                  name="RegionName"
                >
                  <Input style={{ width: "100%" }} placeholder={t("RegionName")} disabled/>
                </Form.Item>
              </Col>

              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("status")}
                  name="StateID"
                  rules={[
                    {
                      required: true,
                      message: t("Please select status"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("Select Status")}
                    allowClear
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {status.map((status) => (
                      <Option key={status.ID} value={status.ID}>
                        {status.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

            </Row>
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
          </Form>

        </Spin>
      </Card>
    </Fade>
  );
};

export default UpdatePreferentialOrganization;