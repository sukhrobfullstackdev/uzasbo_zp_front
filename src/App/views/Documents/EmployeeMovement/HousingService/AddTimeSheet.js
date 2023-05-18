import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, Table } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";;
import moment from 'moment';

import Card from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import TimeSheetServices from "../../../../../services/Documents/Payroll/TimeSheet/TimeSheet.services";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { Option } = Select;

const AddTimeSheet = () => {
  const [timeSheet, setTimeSheet] = useState([]);
  const [timeSheetTypeList, setTimeSheetTypeList] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [orgSettleAccList, setOrgSettleAccList] = useState([]);
  const [loader, setLoader] = useState(true);

  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timeSht = await TimeSheetServices.getById(0);
        const timeShtLs = await HelperServices.GetTimeSheetTypeList();
        const divisionLs = await HelperServices.GetDivisionList();
        const orgSettleAccLs = await HelperServices.getOrganizationsSettlementAccountList();
        setTimeSheet(timeSht.data);
        setTimeSheetTypeList(timeShtLs.data);
        setDivisionList(divisionLs.data);
        setOrgSettleAccList(orgSettleAccLs.data);
        setLoader(false);
      } catch (err) {
        // console.log(err);
      }
    }

    fetchData();

  }, []);

  const onFinish = (values) => {
    values.ID = 0;
    values.Date = values.Date.format("DD.MM.YYYY");
    setLoader(true);
    TimeSheetServices.createTimeSheetMainData(values)
      .then((res) => {
        if (res.status === 200) {
          history.push(`/TimeSheet/edit/${res.data}`);
        }
      })
      .catch((err) => {
        setLoader(false);
        // console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };

  const divisionChangeHandler = divisionId => {
    HelperServices.getAllDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err => Notification('error', err));
  }

  if (loader) {
    return (
      <div className="spin-wrapper">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Fade bottom>
      <Card title={t("AddTimeSheet")}>
        <Form
          {...layout}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // className={classes.FilterForm}
          form={form}
          initialValues={{
            ...timeSheet,
            Date: moment(timeSheet.Date, 'DD.MM.YYYY'),
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("number")}
                name="Number"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData")
                  },
                ]}
              >
                <Input placeholder={t("number")} />
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("date")}
                name="Date"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("TimeSheetType")}
                name="TimeSheetTypeID"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Select
                  placeholder={t("TimeSheetType")}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
                  {timeSheetTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("DivisionName")}
                name="divisionID"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Select
                  placeholder={t("DivisionName")}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={divisionChangeHandler}
                  >
                  {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("DepartmentName")}
                name="DepartmentID"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Select
                  placeholder={t("DepartmentName")}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={divisionChangeHandler}>
                  {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={12}>
              <Form.Item
                label={t("OrganizationsSettlementAccountName")}
                name="OrganizationsSettlementAccountID"
                rules={[
                  {
                    required: true,
                    message: t("inputValidData"),
                  },
                ]}
              >
                <Select
                  placeholder={t("OrganizationsSettlementAccountName")}
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={divisionChangeHandler}>
                  {orgSettleAccList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                </Select>
              </Form.Item>

            </Col>
            <Col xl={8} lg={12}>
              <div>
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
      </Card>
    </Fade>
  );
};

export default AddTimeSheet;