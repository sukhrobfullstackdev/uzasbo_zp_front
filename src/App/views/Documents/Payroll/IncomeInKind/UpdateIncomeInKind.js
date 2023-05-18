import React, { useState, useEffect} from "react";
import { Row, Col, Form, Button, DatePicker,  InputNumber,Input, Spin, } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";

import MainCard from "../../../../components/MainCard";
import classes from "./IncomeInKind.module.css";
import { Notification } from "../../../../../helpers/notifications";
import EmployeeEnrolmentModal from "./EmployeeEnrolmentModal.js";
import EmployeesProfitServices from "../../../../../services/Documents/Payroll/IncomeInKind/IncomeInKind";

//import EdittableCell from "./EdittableCell";
import { CSSTransition } from 'react-transition-group';

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};
const { TextArea } = Input;

//main function
const UpdateEmployeesProfit = (props) => {
  const [loader, setLoader] = useState(true);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
 // const [employeeEnrQualicationModal, setEmployeeEnrQualicationModal] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [qualificationCategoryId, setQualificationCategoryId] = useState(null);


  // const [currentDocId, setCurrentDocId] = useState(props.match.params.id ? props.match.params.id : 0)
  const docId = props.match.params.id ? props.match.params.id : 0;

  // table date
  const { size } = useState([]);
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      try {
        const EmployeeEnrolment = await EmployeesProfitServices.getById(docId);         
        setEmployeeId(EmployeeEnrolment.data.EmployeeID)
        setQualificationCategoryId(EmployeeEnrolment.data.QualificationCategoryID)
        console.log(EmployeeEnrolment.data)
        setLoader(false);
        form.setFieldsValue({
          ...EmployeeEnrolment.data,
          Date: moment(EmployeeEnrolment.data.Date, 'DD.MM.YYYY'),
        })
      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [docId, form]);


  const saveAllHandler = () => {
    form.validateFields()
    .then((values) => {
    values.EmployeeID = employeeId;
    values.QualificationCategoryID = qualificationCategoryId;
    values.ID =  docId;
    setLoader(true);
    EmployeesProfitServices.postData(values)
      .then(res => {
        history.push('/IncomeInKind');
        Notification("success", t("saved"));
        setLoader(false);
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err);
        setLoader(false);
      })
    })
  }

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };
  const onReset = () => {
    form.setFieldsValue({ FullName: null });
  };

  const getFullName = (name, id) => {
    setEmployeeId(id);
    form.setFieldsValue({ FullName: name, EmployeeID: id });
  };
  //main
  return (
    <Fade >
      <MainCard title={t("IncomeInKind")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
           // onFinish={saveAllHandler}
            onFinishFailed={onFinishFailed}
            className={classes.FilterForm}
            form={form}
          >
            <Row gutter={[16, 16]}>
              <Col xl={6} lg={8}>
                <div className={classes.InputsWrapper}>
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
                  <Form.Item
                    label={t("Date")}
                    name="Date"
                    rules={[
                      {
                        required: true,
                        message: t("pleaseSelect"),
                      },
                    ]}
                  >
                    <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                  </Form.Item>
                  </div>
                    </Col>
                  <Col xl={4} lg={8}>
                 
                  <Form.Item
                    label={t("IncomeAmount")}
                    name="IncomeAmount"
                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
                      },
                    ]}
                  >
                     <InputNumber
                      style={{width: '100%'}}
                      decimalSeparator=','
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                    />
                  </Form.Item>
               
               
              </Col>

              <Col xl={6} lg={8}>
                <div className={classes.EmployeeEnrolmentModal}>
                <CSSTransition
                mountOnEnter
                unmountOnExit
                in={employeeModalTableVisible}
                timeout={300}  >
                    <EmployeeEnrolmentModal
                      visible={employeeModalTableVisible}
                      onCancel={() => setEmployeeTableVisible(false)}
                      getFullName={getFullName}
                    />
                  </CSSTransition>
                  <Form.Item
                    label={t("Employee")}
                    name="FullName"
                    style={{ width: "100%" }}
                    rules={[
                      {
                        required: true,
                        message: t("Please input valid"),
                      },
                    ]}
                  >
                    <Input disabled
                      style={{ color: 'black' }} />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      setEmployeeTableVisible(true);
                    }}
                    shape="circle"
                    style={{ marginTop: 38 }}
                    icon={<UserOutlined />}
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
              <Col xl={18} lg={6}>
                  <Form.Item
                    label={t("Comment")}
                    name="Comment"
                    // rules={[
                    //   {
                    //     required: true,
                    //     message: t("Please input valid"),
                    //   },
                    // ]}
                    >
                    <TextArea rows={2} />
                  </Form.Item>
                </Col>
              <Col xl={24} lg={24}>
                <div className={classes.Buttons}>
                  <Button
                    type="danger"
                    onClick={() => {
                      history.goBack();
                      Notification("warning", t("not-saved"));
                    }}>
                    {t("back")}
                  </Button>
                  <Button
                    onClick={saveAllHandler}
                    // onDoubleClick={onFinish}
                    type="primary"
                  >
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
export default UpdateEmployeesProfit;
