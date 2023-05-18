import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import MainCard from "../../../../components/MainCard";
import classes from "./ListOfPosition.module.css";
import { Notification, } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import CommonServices from "../../../../../services/common/common.services";
import ListPositionServices from "../../../../../services/References/Organizational/ListOfPosition/ListPosition.services";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { Option } = Select;

//main function
const UpdateListOfPosition = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [status, setStatus] = useState([]);
  const [listOfPositionCategoryList, setlistOfPositionCategoryList] = useState([]);
  //const [listOfPositionList, setlistOfPositionList] = useState([]);
  const [tariffScaleList, setTariffScaleList] = useState([]);
  const [experienceContWorkList, setExperienceContWorkList] = useState([]);
  // const [divisionData, setDivisionData] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const division = await ListPositionServices.getById(props.match.params.id ? props.match.params.id : 0);
        const status = await HelperServices.getStateList();
        const listOfPositionCategoryLs = await HelperServices.getListOfPositionCategoryList();
        //const listOfPositionLs = await HelperServices.getListOfPositionList();
        const tariffScaleLs = await CommonServices.getTariffScaleList();
        const experienceContWorkLs = await HelperServices.getExperienceContWorkList();
        // const divisionList = await HelperServices.GetDivisionList();
        setlistOfPositionCategoryList(listOfPositionCategoryLs.data);
       // setlistOfPositionList(listOfPositionLs.data);
        setTariffScaleList(tariffScaleLs.data);
        setExperienceContWorkList(experienceContWorkLs.data);
        // setDivisionData(division.data);
        setStatus(status.data);
        // setDivision(divisionList.data);
        form.setFieldsValue(division.data);
        setLoader(false);
      } catch (err) {
        Notification('error', err);
        // console.log(err);
      }
    }
    fetchData();
  }, [props.match.params.id, form]);

  const onFinish = (values) => {
    setLoader(true);
    values.ID = props.match.params.id;
    ListPositionServices.postData(values)
      .then((res) => {
        if (res.status === 200) {
          setLoader(true);
          history.push("/listOfPosition");
          Notification("success", t("success-msg"));
        }
      })
      .catch((err) => {
        // console.log(err);
        setLoader(true);
        Notification('error', err);
      });
  };

  return (
    <Fade>
      <MainCard title={t("Add Position")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            onFinish={onFinish}
            className={classes.FilterForm}
            form={form}
          >
            <Row gutter={[16, 16]}>
              <Col xl={8} lg={12}>
                <Form.Item
                  label={t("Code")}
                  name="Code"
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <Input placeholder={t("Code")} />
                </Form.Item>
                <Form.Item
                  label={t("Position Category")}
                  name="CategoryID"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("Select Qualification")}
                    allowClear
                    // getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listOfPositionCategoryList.map((listOfPositionCategory) => (
                      <Option
                        key={listOfPositionCategory.ID}
                        value={listOfPositionCategory.ID}
                      >
                        {listOfPositionCategory.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {/* <Form.Item
                  label={t("Position List")}
                  name="StaffListPositionID"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("Select Position")}
                    allowClear
                    // getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {listOfPositionList.map((listOfPositionList) => (
                      <Option
                        key={listOfPositionList.ID}
                        value={listOfPositionList.ID}
                      >
                        {listOfPositionList.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item> */}

                <Form.Item
                  label={t("Status")}
                  name="StateID"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("Select Status")}
                    allowClear
                    // getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {status.map((status) => (
                      <Option key={status.ID} value={status.ID}>
                        {status.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={8} lg={12}>
                <Form.Item
                  label={t("shortname")}
                  name={"ShortName"}
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <Input placeholder={t("shortname")} />
                </Form.Item>

                <Form.Item
                  label={t("Tariff Scale")}
                  name="TariffScaleID"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("Tariff Scale")}
                    allowClear
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {tariffScaleList.map((tariffScaleList) => (
                      <Option key={tariffScaleList.ID} value={tariffScaleList.ID}>
                        {tariffScaleList.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

              </Col>
              <Col xl={8} lg={12}>
                <Form.Item
                  label={t("name")}
                  name="Name"
                  rules={[
                    {
                      required: true,
                      message: t('inputValidData'),
                    },
                  ]}
                >
                  <Input placeholder={t("name")} />
                </Form.Item>

                <Form.Item
                  label={t("ExperienceContWorkList")}
                  name="ExperienceContWorkID"
                  rules={[
                    {
                      required: true,
                      message: t('pleaseSelect'),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("ExperienceContWorkList")}
                    allowClear
                    // getPopupContainer={(trigger) => trigger.parentNode}
                    showSearch
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {experienceContWorkList.map((experienceContWorkList) => (
                      <Option
                        key={experienceContWorkList.ID}
                        value={experienceContWorkList.ID}
                      >
                        {experienceContWorkList.Name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <div className={classes.Buttons}>
                  <Button
                    type="danger"
                    onClick={() => {
                      history.goBack();
                      Notification("warning", t("not-saved"));
                    }}
                  >
                    {t("back")}
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {t("save")}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </MainCard>
    </Fade>
  );
};

export default UpdateListOfPosition;