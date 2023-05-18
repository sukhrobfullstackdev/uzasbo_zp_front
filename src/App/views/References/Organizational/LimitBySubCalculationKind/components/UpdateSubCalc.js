import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, InputNumber, Spin, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import MainCard from "../../../../../components/MainCard";
import { Notification } from "../../../../../../helpers/notifications";
import classes from "../LimitBySubCalculationKind.module.css";
import LimitBySubCalculationKindService from "../../../../../../services/References/Organizational/LimitBySubCalculationKind/LimitBySubCalculationKind.services";
import { useDispatch, useSelector } from "react-redux";
import { getDataStart } from "../_redux/getListSlice";
import HelperServices from "../../../../../../services/Helper/helper.services";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { Option } = Select;

const UpdateSubCalc = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [operList, setOperList] = useState([]);
  const [periodList, setPeriodList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [loader, setLoader] = useState(false);
  const ID = props.match.params.id;
  // const tableList = useSelector((state) => state.LimitBySubCalcList);
  // let tableData = tableList?.listSuccessById?.rows;
  // console.log(tableData);

  //   console.log(
  //     JSON.parse(localStorage.getItem("userInfo")).Roles.includes("ChangeUserEDS")
  //   );

  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         const data = await LimitBySubCalculationKindService.getList(ID);
  //         console.log(data, 'data');
  //         setLimitData(data?.data);
  //       } catch (err) {
  //         Notification("error", err);
  //       }
  //     }
  //     fetchData();
  //   }, [ID]);

  useEffect(() => {
    LimitBySubCalculationKindService.getById(ID).then((data) => {
      setDataList(data?.data)
    });
  }, [ID]);

  useEffect(() => {
    HelperServices.getLimitOperList()
      .then((oper) => {
        setOperList(oper?.data);
      })
      .catch((err) => {
        Notification("error", err);
      });
    HelperServices.getLimitPeriodList()
      .then((period) => {
        setPeriodList(period?.data);
      })
      .catch((err) => {
        Notification("error", err);
      });
    HelperServices.getLimitTypeList()
      .then((type) => {
        setTypeList(type?.data);
      })
      .catch((err) => {
        Notification("error", err);
      });
  }, []);

  useEffect(() => {
    if (dataList) {
      form.setFieldsValue(dataList);
    }
  }, [dataList]);

  const onFinish = (values) => {
    values.ID = props.match.params.id;

    LimitBySubCalculationKindService.postData(values)
      .then((res) => {
        if (res.status === 200) {
          history.push("/limitBySubCalculationKind");
          Notification("success", t("edited"));
        }
      })
      .catch((err) => {
        Notification("error", err);
      });
  };

  return (
    <div>
      <Fade bottom>
        <MainCard title={t("Edit LimitBySubCalculationKind")}>
          <Spin spinning={loader} size="large">
            <Form
              {...layout}
              onFinish={onFinish}
              className={classes.FilterForm}
              form={form}
              //   initialValues={tableList?.listSuccessData?.rows}
            >
              <Row gutter={[16, 16]}>
                <Col xl={6} lg={8}>
                  <Form.Item
                    label={t("LimitType")}
                    name="LimitTypeID"
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("LimitType")}
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {typeList?.map((item) => (
                        <Option key={item.ID} value={item.ID}>
                          {t(item.DisplayName)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={6} lg={8}>
                  <Form.Item
                    label={t("LimitOperType")}
                    name="LimitOperTypeID"
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("LimitOperType")}
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {operList?.map((item) => (
                        <Option key={item.ID} value={item.ID}>
                          {t(item.DisplayName)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={6} lg={8}>
                  <Form.Item
                    label={t("LimitPeriod")}
                    name="LimitPeriodTypeID"
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}
                  >
                    <Select
                      placeholder={t("LimitPeriod")}
                      allowClear
                      getPopupContainer={(trigger) => trigger.parentNode}
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {periodList?.map((period) => (
                        <Option key={period.ID} value={period.ID}>
                          {t(period.DisplayName)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xl={5} lg={7}>
                  <Form.Item
                    label={t("LimitValue")}
                    name="LimitValue"
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder={t("LimitValue")}
                    />
                  </Form.Item>
                </Col>
                <Col xl={12} lg={24}>
                  <div
                    className={classes.Buttons}
                    style={{ marginTop: "38px" }}
                  >
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
    </div>
  );
};

export default UpdateSubCalc;
