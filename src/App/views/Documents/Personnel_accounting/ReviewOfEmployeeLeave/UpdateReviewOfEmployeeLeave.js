import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Select, Input, Spin, DatePicker, Space, InputNumber, Switch, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';
import { CSSTransition } from 'react-transition-group';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { appendArray } from "../../../../../helpers/helpers";

import MainCard from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";
import HelperServices from "../../../../../services/Helper/helper.services";
import CommonServices from "../../../../../services/common/common.services";
import ReviewOfEmployeeLeaveServices from "../../../../../services/Documents/Personnel_accounting/ReviewOfEmployeeLeave/ReviewOfEmployeeLeave.servies";
import EmployeeModal from "../../../commonComponents/EmployeeModal";
import LeavePayModal from "./LeavePayModal";

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

const UpdateReviewOfEmployeeLeave = (props) => {
  const [divisionList, setDivisionList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [divisionId, setDivisionId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [employeeModalVisible, setEmployeeModalVisible] = useState(false);
  const [leavePayModalVisible, setLeavePayModalVisible] = useState(false);
  const [disabledActions, setDisabledActions] = useState(false);
  const [loader, setLoader] = useState(true);
  const [filelist, setFileList] = useState([]);
  const [tableId, setTableId] = useState(null);

  const { t } = useTranslation();
  const history = useHistory();
  const [mainForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;

  useEffect(() => {
    const fetchData = async () => {
      const [reviewOfEmpLeaveData, divisionLs] = await Promise.all([
        ReviewOfEmployeeLeaveServices.getById(props.match.params.id ? props.match.params.id : 0),
        HelperServices.GetDivisionList()
      ]);

      if (props.match.params.id) {
        const departmentLs = await HelperServices.getDepartmentList(reviewOfEmpLeaveData.data.DivisionID);
        setDepartmentList(departmentLs.data);
        setEmployeeId(reviewOfEmpLeaveData.data.EmployeeID);
      }
      setDisabledActions(reviewOfEmpLeaveData.data.StatusID === 2 ? true : false);
      setDivisionList(divisionLs.data);
      setTableId(reviewOfEmpLeaveData.data.TableID);
      setLoader(false);
      mainForm.setFieldsValue({
        ...reviewOfEmpLeaveData.data,
        Date: moment(reviewOfEmpLeaveData.data.Date, 'DD.MM.YYYY'),
        EnrolmentDocumentID: null,
        DivisionID: null,
        DepartmentID: null,
        EnrolmentTypeID: null,
        LeavePayID: null
      })
    }
    fetchData().catch(err => {
      // console.log(err);
      Notification('error', err)
    });
  }, [props.match.params.id, mainForm]);

  const divisionChangeHandler = divisionId => {
    mainForm.setFieldsValue({ EmployeeFullName: null });
    setDivisionId(divisionId);
    setEmployeeId(null);
    HelperServices.getAllDepartmentList(divisionId)
      .then(res => {
        setDepartmentList(res.data);
      })
      .catch(err => Notification('error', err))
  }

  const departmentChangeHandler = id => {
    mainForm.setFieldsValue({ EmployeeFullName: null });
    setEmployeeId(null);
    setDepartmentId(id);
  }

  const submitFormHandler = (values) => {
    setLoader(true);
    values.ID = +docId;
    values.EmployeeID = employeeId;
    values.Date = values.Date.format('DD.MM.YYYY');

    const formData = new FormData();
        filelist.forEach(file => {
          formData.append('file', file);
        });

        for (const key in values) {
          if (key === 'file' || key === 'Tables') {
            continue;
          }
          formData.append(key, values[key]);
        }

        appendArray(formData, values.Tables, 'Tables');

    ReviewOfEmployeeLeaveServices.postData(formData)
      .then(res => {
        if (res.status === 200) {
          Notification("success", t("saved"));
          setLoader(false);
          history.push('/ReviewOfEmployeeLeave');
        }
      })
      .catch(err => {
        // console.log(err);
        setLoader(false);
        Notification("error", err);
      })
  };

  // Employee modal Functions
  const closeEmployeeModalHandler = () => {
    setEmployeeModalVisible(false);
  }

  const getModalData = (name, id, enrolmentDocumentId) => {
    setEmployeeId(id);
    mainForm.setFieldsValue({ FullName: name, EnrolmentDocumentID: enrolmentDocumentId });
  };
  // Employee modal Functions

  // LeavePay modal Functions
  const closeLeavePayModalHandler = () => {
    setLeavePayModalVisible(false);
  }

  const getLeavePayModalData = (id) => {
    mainForm.setFieldsValue({ LeavePayID: id });
  };
  // LeavePay modal Functions

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
      CommonServices.deleteFile(docId, tableId, 'reviewofemployeeleave')
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
      CommonServices.downloadFile(docId, tableId, 'reviewofemployeeleave')
        .then(res => {
          if (res.status === 200) {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "reviewofemployeeleave.pdf");
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

  return (
    <Fade>
      <MainCard title={t('ReviewOfEmployeeLeave')}>
        <Spin spinning={loader} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id='mainForm'
            scrollToFirstError
            onFinish={submitFormHandler}
          >
            <Row gutter={[16, 16]} align="top">
              <Col xl={3} lg={6}>
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
                  <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xl={4} lg={6}>
                <Form.Item
                  label={t("Division")}
                  name="DivisionID"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect")
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("Division")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    onChange={divisionChangeHandler}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={4} lg={6}>
                <Form.Item
                  label={t("Department")}
                  name="DepartmentID"
                  rules={[
                    {
                      required: true,
                      message: t("pleaseSelect")
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("Department")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    onChange={departmentChangeHandler}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col xl={5} lg={6}>
                <Space
                  align='start'
                  className='modal-input'
                >
                  <Form.Item
                    label={t('Employee')}
                    name="FullName"
                    style={{ width: '100%' }}
                    rules={[
                      {
                        required: true,
                        message: t('inputValidData'),
                      },
                    ]}
                  >
                    <Input
                      disabled
                      className='disabled-input'
                      placeholder={t('Employee')}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    disabled={disabledActions}
                    onClick={() => {
                      setEmployeeModalVisible(true);
                    }}
                    icon={<i className='feather icon-user' aria-hidden="true" />}
                  />
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={employeeModalVisible}
                    timeout={300}
                  >
                    <EmployeeModal
                      visible={employeeModalVisible}
                      onCancel={closeEmployeeModalHandler}
                      getModalData={getModalData}
                      divisionId={divisionId}
                      departmentId={departmentId}
                    />
                  </CSSTransition>
                </Space>
              </Col>
              <Col xl={3} lg={6}>
                <Form.Item
                  label={t("EnrolmentDocumentID")}
                  name="EnrolmentDocumentID"
                >
                  <InputNumber
                    disabled
                    style={{ width: '100%' }}
                    className='disabled-input'
                    placeholder={t("EnrolmentDocumentID")}
                  />
                </Form.Item>
              </Col>
              <Col xl={5} lg={6}>
                <Space
                  align='start'
                  className='modal-input'
                >
                  <Form.Item
                    label={t('document')}
                    name="LeavePayID"
                    style={{ width: '100%' }}
                    rules={[
                      {
                        required: true,
                        message: t('inputValidData'),
                      },
                    ]}
                  >
                    <Input
                      disabled
                      className='disabled-input'
                      placeholder={t('document')}
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    disabled={disabledActions}
                    onClick={() => {
                      setLeavePayModalVisible(true);
                    }}
                    icon={<i className="far fa-file-alt"></i>}
                  />
                  <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={leavePayModalVisible}
                    timeout={300}
                  >
                    <LeavePayModal
                      visible={leavePayModalVisible}
                      onCancel={closeLeavePayModalHandler}
                      getModalData={getLeavePayModalData}
                    />
                  </CSSTransition>
                </Space>
              </Col>

              <Col xl={3} lg={6}>
                <Form.Item
                  label={t("IsLeavePayDoc")}
                  name="IsLeavePayDoc"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col xl={14} lg={12}>
                <Form.Item
                  label={t("Comment")}
                  name="Comment"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <TextArea placeholder={t("Comment")} rows={2} />
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
                    {docId !== 0 &&
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
            </Row>
            <Space size='middle' className='btns-wrapper'>
              <Button
                type="danger"
                onClick={() => {
                  Notification("warning", t("not-saved"));
                  history.goBack();
                }}
              >
                {t("back")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                disabled={disabledActions}
              >
                {t("save")}
              </Button>
            </Space>
          </Form>
        </Spin>
      </MainCard>
    </Fade>
  );
};

export default UpdateReviewOfEmployeeLeave;
