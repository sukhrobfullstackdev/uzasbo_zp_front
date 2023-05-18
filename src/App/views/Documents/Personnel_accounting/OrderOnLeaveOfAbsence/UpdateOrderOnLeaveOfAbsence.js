import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, DatePicker, Select, Input, Spin, Upload, Space } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { UserOutlined, UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { appendArray } from "../../../../../helpers/helpers";

import MainCard from "../../../../components/MainCard";
import classes from "./OrderOnLeaveOfAbsence.module.css";
import { Notification } from "../../../../../helpers/notifications";
import OrderOnLeaveOfAbsenceModal from "./OrderOnLeaveOfAbsenceModal.js";
import HelperServices from "../../../../../services/Helper/helper.services";
import CommonServices from "../../../../../services/common/common.services";
import OrderOnLeaveOfAbsenceServices from "../../../../../services/Documents/Personnel_accounting/OrderOnLeaveOfAbsence/OrderOnLeaveOfAbsence.servies";

const layout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

//main function
const UpdateOrderOnLeaveOfAbsence = (props) => {
  const [loader, setLoader] = useState(true);
  // const [OrderOnLeaveOfAbsenceData, setOrderOnLeaveOfAbsenceData] = useState([]);
  const [employeeModalTableVisible, setEmployeeTableVisible] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const { size } = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const docId = props.match.params.id ? props.match.params.id : 0;
  const [filelist, setFileList] = useState([]);
  const [tableId, setTableId] = useState(null);

  const { TextArea } = Input;
  const { Option } = Select;
  const { t } = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      try {
        const OrderOnLeaveOfAbsence = await OrderOnLeaveOfAbsenceServices.getById(docId);
        const divisionLs = await HelperServices.GetDivisionList();
        //const departmentLs = await HelperServices.getAllDepartmentList();
        setEmployeeId(OrderOnLeaveOfAbsence.data.EmployeeID)
        setDivisionList(divisionLs.data);
        setTableId(OrderOnLeaveOfAbsence.data.TableID);
        setLoader(false);
        divisionChangeHandler(OrderOnLeaveOfAbsence.data.DivisionID)
        form.setFieldsValue({
          ...OrderOnLeaveOfAbsence.data,
          Date: moment(OrderOnLeaveOfAbsence.data.Date, 'DD.MM.YYYY'),
          BeginDate: moment(OrderOnLeaveOfAbsence.data.BeginDate, 'DD.MM.YYYY'),
          EndDate: moment(OrderOnLeaveOfAbsence.data.EndDate, 'DD.MM.YYYY'),
          EmployeeID: OrderOnLeaveOfAbsence.data.ID === 0 ? null : OrderOnLeaveOfAbsence.data.EmployeeID,
        })
      } catch (err) {
        // console.log(err);
        Notification('error', err);
      }
    }
    fetchData();
  }, [docId, form]);
  //useffect end

  //onfinish
  const onFinish = (filterFormValues) => {
    console.log(filterFormValues)
    filterFormValues.ID = docId;
    filterFormValues.EmployeeID = employeeId;
    filterFormValues.Date = filterFormValues.Date.format('DD.MM.YYYY');
    filterFormValues.BeginDate = filterFormValues.BeginDate.format('DD.MM.YYYY');
    filterFormValues.EndDate = filterFormValues.EndDate.format('DD.MM.YYYY');

    const formData = new FormData();
        filelist.forEach(file => {
          formData.append('file', file);
        });

        for (const key in filterFormValues) {
          if (key === 'file' || key === 'Tables') {
            continue;
          }
          formData.append(key, filterFormValues[key]);
        }

        appendArray(formData, filterFormValues.Tables, 'Tables');

    OrderOnLeaveOfAbsenceServices.postData(formData)
      .then((res) => {
        if (res.status === 200) {
          history.push("/OrderOnLeaveOfAbsence");
          Notification("success", t("success-msg"));
        }
      })
      .catch((err) => {
        // console.log(err);
        Notification('error', err);
      });
  };
  //onfinish end

  const onFinishFailed = (errorInfo) => {
    // console.log(errorInfo);
  };

  const getFullName = (name, id) => {
    setEmployeeId(id);
    form.setFieldsValue({ FullName: name, EmployeeID: id });
  };

  const divisionChangeHandler = divisionId => {
    HelperServices.getDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err => Notification('error', err));
  }

  // File 
  const uploadProps = {
    maxCount: 1,
    onRemove: file => {
      setFileList(prevState => {
        const index = prevState.indexOf(file);
        const newFileList = prevState.slice();
        newFileList.splice(index, 1);
        return newFileList;
      });
    },
    beforeUpload: file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      setFileList(prevState => ([...prevState, file]));
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        Notification('error', t('fileSizeAlert'));
      }
      return false;
    },
    filelist,
  };

  const normFile = (e) => {
    // console.log('Upload event:', e);

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const deleteFileHandler = () => {
    setLoader(true);
    CommonServices.deleteFile(docId, tableId, 'orderonleaveofabsence')
      .then(res => {
        if (res.status === 200) {
          Notification('success', t('deleteded'));
          setLoader(false);
        }
      })
      .catch(err => {
        Notification('error', err);
        setLoader(false);
      })
  }

  const donwloadFileHandler = () => {
    setLoader(true);
    CommonServices.downloadFile(docId, tableId, 'orderonleaveofabsence')
      .then(res => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "orderonleaveofabsence.pdf");
          document.body.appendChild(link);
          link.click();
          setLoader(false);
        }
      })
      .catch(err => {
        setLoader(false);
        Notification('error', t('fileNotFound'));
      })
  }
  // End File 

  //main
  return (
    <Fade>
      <MainCard title={t("OrderOnLeaveOfAbsence")}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className={classes.FilterForm}
            form={form}

          >
            <Row gutter={[16, 16]}>
              <Col xl={2} lg={12}>
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
              </Col>
              <Col xl={8} lg={12}>
                <div className={classes.OrderOnLeaveOfAbsenceModal}>
                  {employeeModalTableVisible && (
                    <OrderOnLeaveOfAbsenceModal
                      visible={employeeModalTableVisible}
                      onCancel={() => setEmployeeTableVisible(false)}
                      getFullName={getFullName}
                    />
                  )}
                  <Form.Item
                    label={t('employee')}
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

                  <Form.Item
                    label={t("EnrolmentDocumentID")}
                    name="EmployeeID"

                    rules={[
                      {
                        required: true,
                        message: t("inputValidData")
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
                </div>
              </Col>
              <Col xl={4} lg={12}>
                <Form.Item
                  label={t("division")}
                  name="DivisionID"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("division")}
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
              <Col xl={4} lg={12}>
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
                  // onChange={divisionChangeHandler}
                  >
                    {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={2} lg={12}>
                <Form.Item
                  label={t("StartPeriod")}
                  name="BeginDate"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xl={2} lg={12}>
                <Form.Item
                  label={t("EndPeriod")}
                  name="EndDate"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect"),
                    },
                  ]}
                >
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xl={24} lg={24}>
                <Form.Item
                  label={t("Comment")}
                  name="Comment"
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}
                >
                  <TextArea rows={2} />
                </Form.Item>
              </Col>

              <Col xl={3} lg={12}>
                <Form.Item
                  name="file"
                  label={t('upload')}
                  // valuePropName="fileList"
                  getValueFromEvent={normFile}
                // rules={[
                //   {
                //     required: true,
                //     message: t("pleaseSelect"),
                //   },
                // ]}
                >
                  <Space>
                    <Upload
                      {...uploadProps}
                      openFileDialogOnClick
                      accept='.pdf'
                    >
                      <Button icon={<UploadOutlined />}>{t('clickUpload')}</Button>
                    </Upload>
                    { docId !== 0 &&
                      <>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={donwloadFileHandler}
                        >
                          &nbsp;{t('download')}
                        </Button>
                        <Button
                          type="danger"
                          icon={<i className="feather icon-trash-2" aria-hidden="true" />}
                          onClick={deleteFileHandler}
                        >
                          &nbsp;{t('Delete')}
                        </Button>
                      </>
                    }
                  </Space>
                </Form.Item>
              </Col>

              <Col xl={24} lg={24}>
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

//main function end

export default UpdateOrderOnLeaveOfAbsence;
