import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Form, Row, Col, DatePicker, InputNumber, Select, Input, Button, Table, Switch } from 'antd';
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

import HelperServices from "../../../../../../services/Helper/helper.services";
import classes from "./ClassTitle.module.css";
import MainCard from "../../../../../components/MainCard";
import classLetters from "../../../../../../helpers/classLetters"
import shifts from "../../../../../../helpers/shifts"
import { Notification } from "../../../../../../helpers/notifications";
import ClassTitleServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitle.services";
import EditableCell from "./EditableCell";
import ClassTableHeader from "./ClassTableHeader";

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

// let editing = false;

const UpdateClassTitleList = (props) => {
  const { t } = useTranslation();
  const [mainForm] = Form.useForm();
  const history = useHistory();
  const [classTableForm] = Form.useForm();
  const docId = props.match.params.id ? props.match.params.id : 0;

  const [blhgTypeList, setBlhgTypeList] = useState([]);
  const [specializedSubjectsList, setSpecializedSubjectsList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [classLanguageList, setClassLanguageList] = useState([]);
  const [editingKey, setEditingKey] = useState("");
  const [classTableData, setClassTableData] = useState([]);
  const [classTableRowId, setClassTableRowId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      const [classTitleLs, blhgLsType, specializedSubjectsLt, classLs, classLanguageLs] = await Promise.all([
        ClassTitleServices.getById(docId),
        HelperServices.getBLHGTypeList(),
        HelperServices.getSpecializedSubjectsList(),
        HelperServices.getClassNumberList(),
        HelperServices.getClassLanguageList()
      ]);
      setClassTableData(classTitleLs.data.Tables);
      setBlhgTypeList(blhgLsType.data);
      setSpecializedSubjectsList(specializedSubjectsLt.data);
      // console.log(specializedSubjectsLt.data)
      setClassList(classLs.data);
      setClassLanguageList(classLanguageLs.data)
      setLoading(false);
      mainForm.setFieldsValue({
        ...classTitleLs.data,
        Date: moment(classTitleLs.data.Date, 'DD.MM.YYYY')
      })
    }
    fetchData().catch(err => {
      // console.log(err);
      Notification('error', err);
    });
  }, [docId, mainForm])



  const classTableColumns = [
    {
      // title: t("ClassNumberName"),
      dataIndex: "ClassNumberID",
      // key: "ClassNumberName",
      sorter: true,
      width: 180,
      editable: true,
      render: (value) => {
        const classLs = classList.find(item => item.ID === value);
        return classLs ? classLs.NameUzb : '';
      }

    },
    {
      // title: t("Name"),
      dataIndex: "name",
      // key: "Name",
      sorter: true,
      editable: true,
      render: (value) => { 
        // console.log(value)
        const classLettersLs = classLetters.find(item => item.value === value);
        console.log(classLettersLs);
        return classLettersLs ? classLettersLs.name : '';
      }
    },
    {
      // title: t("ChildrenCount"),
      dataIndex: "ChildrenCount",
      key: "ChildrenCount",
      sorter: true,
      editable: true,
    },
    {
      // title: t("FemaleCount"),
      dataIndex: "FemaleCount",
      key: "FemaleCount",
      sorter: true,
      editable: true,
    },
    {
      // title: t("TeachingAtHomeCount"),
      dataIndex: "TeachingAtHomeCount",
      key: "TeachingAtHomeCount",
      sorter: true,
      editable: true,
    },
    {
      // title: t("ClassLanguageName"),
      dataIndex: "ClassLanguageID",
      // key: "ClassLanguageName",
      sorter: true,
      editable: true,
      render: (value) => {
        const classLanguageLs = classLanguageList.find(item => item.ID === value);
        return classLanguageLs ? classLanguageLs.Name : '';
      }
    },
    {
      // title: t("ShiftName"),
      dataIndex: "ShiftName",
      // key: "ShiftName",
      sorter: true,
      editable: true,
      render: (value) => {
        const shiftsLs = shifts.find(item => item.name === value);
        return shiftsLs ? shiftsLs.name : '';
      }
    },
    {
      // title: t("IsSpecialized"),
      dataIndex: "IsSpecialized",
      sorter: true,
      render: (value) => (< Switch defaultChecked={value} disabled/>),
      width: 130
    },
    {
      // title: t("SubjectName"),
      dataIndex: "SpecializedSubjectsID",
      sorter: true,
      render: (value) => {
        // console.log(value);
        const specializedSubjectsLt = specializedSubjectsList.find(item => item.ID === value);
        // console.log(specializedSubjectsLt);
        return specializedSubjectsLt ? specializedSubjectsLt.Name : '';
      }
    }
  ]

  // const filteredColumns = classTableColumns.filter(item => item !== undefined);

  const mergedClassColumns = classTableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        title: col.title,
        dataIndex: col.dataIndex,
        editing: isEditing(record),
        classList: classList,
        classLetters: classLetters,
        classLanguageList: classLanguageList,
        shifts: shifts,
        save:save
      }),
      onHeaderRow: (record) => ({
        record,
        classList: classList,
        specializedSubjectsList: specializedSubjectsList,
      }),
      onRow: (record) => ({
        record,
        classList: classList,
        specializedSubjectsList: specializedSubjectsList,
      }),
      onHeaderCell: (record) => ({
        record,
        classList: classList,
        specializedSubjectsList: specializedSubjectsList,
      }),
    };
  });

  const addClassTableDataHandler = useCallback((values) => {
    console.log(values);
    setClassTableData((prevState) => [values, ...prevState]);
  }, [])

  const save = async (key) => {
    try {
      const row = await classTableForm.validateFields();
      const newData = [...classTableData];
      const index = newData.findIndex((item) => key === item.ID);

      if (index > -1) {
        const item = newData[index];
        item.Status = 2;
        newData.splice(index, 1, { ...item, ...row });
        setClassTableData(newData);
        // classTableForm.resetFields();
        setEditingKey("");
        // editing = false;
      } else {
        newData.push(row);
        setClassTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      // console.log("Validate Failed:", errInfo);
      // alert(errInfo);
      setEditingKey("");
    }
  };

  const saveAllHandler = () => {
    // setLoader(true);
    mainForm.validateFields()
      .then(values => {
        values.ID = docId;
        values.Date = values.Date.format('DD.MM.YYYY');
        values.Tables = classTableData;
        ClassTitleServices.postData(values)
          .then(res => {
            if (res.status === 200) {
              Notification("success", t("saved"));
              // setLoader(false);
              history.push('/ClassTitle');
            }
          })
          .catch(err => {
            // console.log(err);
            // setLoader(false);
            Notification('error', err);
          })
      })
  }

  const isEditing = (record) => record.ID === editingKey;

  const edit = (record) => {
    // editing = true;
    classTableForm.setFieldsValue({
      ...record,
    });
    setEditingKey(record.ID);
  };


  const setRowClassName = (record) => {
    return record.ID === classTableRowId ? 'editable-row table-row clicked-row' : 'editable-row table-row';
  }

  const onClassTableRow = (record) => {
    if (editingKey === '') {
      return {
        onDoubleClick: () => {
          edit(record);
          let ignoreClickOnMeElement = document.querySelector('.clicked-row');
          document.addEventListener('click', function clickHandler(event) {
            let isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
            if (!isClickInsideElement) {
              save(record.ID);
              document.removeEventListener('click', clickHandler);
            }
          });
        },
        onClick: () => {
          setClassTableRowId(record.ID);
        },
      };
    }
  }

  // End Class Table functions

  return (
    <Fade>
      <MainCard title={t('ClassTitleSend')}>
        <Spin spinning={loading} size='large'>
          <Form
            {...layout}
            form={mainForm}
            id='mainForm'
          // onFinish={fillTableHandler}
          // onFinishFailed={fillTableHandlerFailed}
          >
            <Row gutter={[16, 16]}>
              <Col xl={3}>
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
                  <DatePicker placeholder={t("date")} format='DD.MM.YYYY' style={{ width: '100%' }} disabled />
                </Form.Item>
              </Col>
              <Col xl={2}>
                <Form.Item
                  label={t("StartYear")}
                  name="StartYear"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <InputNumber placeholder={t("StartYear")} style={{ width: '100%' }} disabled/>
                </Form.Item>
              </Col>
              <Col xl={2}>
                <Form.Item
                  label={t("EndYear")}
                  name="EndYear"
                  rules={[
                    {
                      required: true,
                      message: t("inputValidData")
                    },
                  ]}
                >
                  <InputNumber placeholder={t("EndYear")} style={{ width: '100%' }} disabled/>
                </Form.Item>
              </Col>

              <Col xl={4}>
                <Form.Item
                  label={t("BLHGListType")}
                  name="BLHGTypeID"
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
                    placeholder={t("BLHGListType")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    disabled
                  >
                    {blhgTypeList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={4}>
                <Form.Item
                  label={t("SpecializedSubjects")}
                  name="SpecializedSubjectsID"
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("SpecializedSubjects")}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    disabled
                  >
                    {specializedSubjectsList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>
              </Col>

              <Col xl={5}>
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
                  <TextArea placeholder={t("Comment")} rows={1} disabled />
                </Form.Item>
              </Col>

              <Col xl={2}>
                <Form.Item
                  label={t('IsTown')}
                  name='IsTown'
                  valuePropName='checked'
                >
                  <Switch checkedChildren={<CheckOutlined  />}
                    unCheckedChildren={<CloseOutlined />} disabled> </Switch>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Form
            form={classTableForm}
            // onFinish={addClassTableDataHandler}
            component={false}
          >
            <Table
              bordered
              size='middle'
              rowClassName={setRowClassName}
              className="main-table"
              rowKey={(record) => record.ID}
              columns={mergedClassColumns}
              // dataSource={[initial, {...classTableData}]}
              dataSource={classTableData}
              onRow={(record) => onClassTableRow(record)}
              scroll={{
                x: "max-content",
                // y: '100vh'
              }}
              components={{
                header: {
                  row: () => <ClassTableHeader
                    classList={classList}
                    blhgTypeList={blhgTypeList}
                    classLanguageList={classLanguageList}
                     specializedSubjectsList={specializedSubjectsList}
                    classLetters={classLetters}
                    shifts={shifts}
                    addData={addClassTableDataHandler}
                  />
                },
                body: {
                  cell: EditableCell
                }
              }}
            />
          </Form>

          <div className={classes.buttons} style={{ margin: 0 }}>
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
              onClick={saveAllHandler}
              type="primary"
            >
              {t("save")}
            </Button>
          </div>

        </Spin>
      </MainCard>
    </Fade>
  );
};

export default UpdateClassTitleList;