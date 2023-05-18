import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";

import Card from "../../../../components/MainCard";
import classes from "./Sector.module.css";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import SectorServices from "../../../../../services/References/Organizational/Sector/Sector.services";

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
const UpdateSector = (props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [status, setStatus] = useState([]);
  // const [subList, setSubList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [department, setDepartment] = useState([]);
//   const [subDepartment, setSubDepartment] = useState([]);
  const [sectorEdit, setSectorEdit] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const sectorEdit = await SectorServices.getById(props.match.params.id ? props.match.params.id : 0)
        const divisionLs = await HelperServices.getAllDepartmentList();
        const status = await HelperServices.getStateList();
        // const subDepartment = await HelperServices.getAllSubDepartementList();
        setSectorEdit(sectorEdit.data)
        setDepartment(divisionLs.data);
        // setSubDepartment(subDepartment.data);
        setStatus(status.data);
        setLoader(false);
      } catch (err) {
        Notification(err);
        // console.log(err);
      }
    }
    fetchData();
  }, [props.match.params.id]);

  const onFinish = (values) => {
    setLoader(true);
    values.ID = props.match.params.id;
    SectorServices.update(values)
      .then((res) => {
        if (res.status === 200) {
          setLoader(false);
          Notification("success", t("success-msg"));
          history.push("/sector");
        }
      })
      .catch((err) => {
        setLoader(false);
        Notification("error", err);
      });
  };

  //loader
  if (loader) {
    return (
      <div className="spin-wrapper">
        <Spin size='large' />
      </div>
    );
  }
  //loader end

  //main
  return (
    <Fade bottom>
      <Card title={t("Sector")}>
        <Form
          {...layout}
          onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          className={classes.FilterForm}
          form={form}
          initialValues={sectorEdit}
        >
          <Row gutter={[16, 16]}>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("Code")}
                name="Code"
                rules={[
                  {
                    required: true,
                    pattern: /^[\d]*$/,
                    message: t("inputValidData"),
                  },
                ]}>
                <Input placeholder={t("Code")} />
              </Form.Item>

              {/* <Form.Item label={t("SubDepartment")} name="SubDepartmentID">
                <Select
                  placeholder={t("Select SubDepartment")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  }
                >
                  {subDepartment.map((subDepartment) => (
                    <Option key={subDepartment.ID} value={subDepartment.ID}>
                      {subDepartment.NameRus}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item label={t("NameUzb")} name={"NameUzb"}>
                <Input placeholder={t("NameUzb")} />
              </Form.Item>
              <Form.Item
                label={t("Status")}
                name="StateID"
                rules={[
                  {
                    required: true,
                    message: t("Please select status"),
                  },
                ]}
              >
                <Select
                  placeholder={t("Select State")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                >
                  {status.map((status) => (
                    <Option value={status.ID} key={status.ID}>
                      {status.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item label={t("NameRus")} name="NameRus">
                <Input placeholder={t("NameRus")} />
              </Form.Item>
              <Form.Item label={t("Department")} name="DepartmentID">
                <Select
                  placeholder={t("Select Department")}
                  allowClear
                  getPopupContainer={(trigger) => trigger.parentNode}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  }
                >
                  {department.map((division) => (
                    <Option key={division.ID} value={division.ID}>
                      {division.ShortName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <div className={classes.SwitchWrapper}>
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
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    </Fade>
  );
  //main end
};

//main function end

export default UpdateSector;
