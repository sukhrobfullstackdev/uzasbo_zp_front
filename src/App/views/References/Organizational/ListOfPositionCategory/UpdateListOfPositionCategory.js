import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import MainCard from "../../../../components/MainCard";
import classes from "./ListOfPositionCategory.module.css";
import {  Notification} from "../../../../../helpers/notifications";
// import HelperServices from "../../../../../services/Helper/helper.services";
import ListPositionCategoryServices from "../../../../../services/References/Organizational/ListOfPositionCategory/ListPositionCategory.services";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
// const { Option } = Select;

//main function
const UpdateListOfPositionCategory = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [divisionData, setDivisionData] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const division = await ListPositionCategoryServices.getById(props.match.params.id ? props.match.params.id : 0);
        // const status = await HelperServices.getStatusList();
        setDivisionData(division.data);
        // setStatus(status.data);
        setLoader(false);
      } catch (err) {
        alert(err);
        Notification(err);
      }
    }
    fetchData();
  }, [props.match.params.id]);
  //useffect end

  //onfinish
  const onFinish = (values) => {
    values.ID = props.match.params.id;
    ListPositionCategoryServices.update(values)
      .then((res) => {
        if (res.status === 200) {
          history.push("/listOfPositionCategory");
          Notification("success", t("success-msg"));
        }
      })
      .catch((err) => {
        Notification(err);
      });
  };
  //onfinish end

  //useeffect

  //main
  return (
    <Fade bottom>
      <MainCard title={t("Edit Position Category")}>
      <Spin spinning={loader} size='large'>
        <Form
          {...layout}
          onFinish={onFinish}
          className={classes.FilterForm}
          form={form}
          initialValues={divisionData}
        >
          <Row gutter={[16, 16]}>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("name")}
                name="Name"
                rules={[
                  {
                    required: true,
                    message: t("Please input valid")
                  },
                ]}
              >
                <Input placeholder={t("name")} />
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
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
  //main end
};

//main function end

export default UpdateListOfPositionCategory;