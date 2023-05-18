import React, { useCallback, useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input, Select, DatePicker } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Fade } from "react-awesome-reveal";
import moment from 'moment';

import Card from "../../../../components/MainCard";
import classes from "./Employee.module.scss";
import { getListStartAction, setListFilter, setListFilterType } from './_redux/ReportsOfStudentsSlice';
import HelperServices from '../../../../../services/Helper/helper.services';
import { Notification } from '../../../../../helpers/notifications';
import TableEmployees from './components/TableEmployees';
import ReportOfStudentsServices from "../../../../../services/Documents/StudentAccounting/ReportOfStudents/ReportOfStudents.services";

const { Option } = Select;

const ReportsOfStudents = ({ match }) => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm();

  const dispatch = useDispatch();
  const reportOfStudentsList = useSelector((state) => state.reportOfStudentsList);

  let tableData = reportOfStudentsList.listSuccessData?.rows;
  let total = reportOfStudentsList.listSuccessData?.total;
  let pagination = reportOfStudentsList?.paginationData;
  let filter = reportOfStudentsList?.filterData;

  const [divisionList, setDivisionIDList] = useState([]);
  const [facultyList, setFacultyIDList] = useState([]);
  const [GroupList, setGroupIDList] = useState([]);
  const [DepartmentList, setDepartmentIDList] = useState([]);
  const [CourseList, setCourseIDList] = useState([]);
  const [orgSettleAcc, setOrgSettleAcc] = useState([]);
  const [print, setPrint] = useState(false);

  const [division, setDivisionList] = useState(reportOfStudentsList.filterData.DivisionID);
  const [course, setCourseList] = useState(reportOfStudentsList.filterData.PositionID);
  const [filterType, setFilterType] = useState(reportOfStudentsList.filterType);
  const [filterValue, setFilterValue] = useState(reportOfStudentsList.filterData[`${filterType}`]);

  useEffect(() => {
    dispatch(
      getListStartAction({
        ...pagination,
        ...filter,
      })
    );
  }, [pagination, filter, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      const [divisionIdLs, courseIDLs, orgSettleAccLs] = await Promise.all([
        HelperServices.GetDivisionList(),
        HelperServices.getListOfPositionList(),
        HelperServices.getOrganizationsSettlementAccountList()
      ]);
      setDivisionIDList(divisionIdLs.data);
      setCourseIDList(courseIDLs.data);
      setOrgSettleAcc(orgSettleAccLs.data);
    }

    fetchData().catch(err => {
      Notification('error', err);
    });
  }, []);

  function filterTypeHandler(value) {
    setFilterType(value);
  };

  const GetDivisionID = (value) => {
    HelperServices.getFakultitetList(value)
      .then((response) => {
        setFacultyIDList(response.data);
      })
      .catch((err) => {
        Notification('error', err);
      });

    HelperServices.getDirectionList(value)
      .then((response) => {
        setGroupIDList(response.data);
      })
      .catch((err) => {
        Notification('error', err);
      });

    HelperServices.getGroupList(value)
      .then((response) => {
        setDepartmentIDList(response.data);
      })
      .catch((err) => {
        Notification('error', err);
      });


    setDivisionList(value);
    setCourseList(value);
  }

  const getList = useCallback((values) => {
    values.ActiveDate = values?.ActiveDate?.format('DD.MM.YYYY');
    dispatch(setListFilterType({
      filterType: values?.filterType,
    }));
    dispatch(setListFilter({
      DivisionID: values?.DivisionID,
      FacultyID: values?.FacultyID,
      GroupID: values?.GroupID,
      PositionID: values?.PositionID,
      DirectionID: values?.DirectionID,
      SettleCodeID: values?.SettleCodeID,
      ActiveDate: values?.ActiveDate,
      [filterType]: values?.search,
      IsVerification: values?.IsVerification,
      NoVerification: values?.NoVerification,
      HavePhoneNumber: values?.HavePhoneNumber,
      CheckHemis: values?.CheckHemis,
    }));
  }, [dispatch, filterType])

  const onSearch = (search) => {
    setFilterValue(search);
    filterForm.validateFields()
      .then(values => {
        getList(values)
      })
  };

  const onFinish = (values) => {
    getList(values)

    if (print) {
      ReportOfStudentsServices.printList({
        PageNumber: 1, PageLimit: 10,
        DivisionID: values?.division, [filterType]: values?.search,
        IsVerification: values?.IsVerification,
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "StudentReport.xlsx");
          document.body.appendChild(link);
          link.click();
        });
    }
  };

  const checkboxHandler = useCallback(() => {
    filterForm.validateFields()
      .then(values => {
        getList(values)
      })
  }, [filterForm, getList])

  return (
    <Card title={t("ReportsOfStudents")}>
      <Fade>
        <Form
          className={classes.FilterForm}
          onFinish={onFinish}
          form={filterForm}
          initialValues={{
            filterType: filterType,
            search: filterValue,
            division: division,
            course: course,
            ActiveDate: moment(),
          }}
        >
          <div className="main-table-filter-elements">
            <Form.Item
              name="filterType"
            // label={t("Filter Type")}
            >
              <Select
                allowClear
                style={{ width: 180 }}
                placeholder={t("Filter Type")}
                onChange={filterTypeHandler}
              >
                {/* <Option value="ID">{t('id')}</Option> */}
                <Option value="PersonalNumber">{t('personnelNumber')}</Option>
                <Option value="FullName">{t('fullname')}</Option>
                <Option value="PhoneNumber">{t('phone-num')}</Option>
                {/* <Option value="SettleCode">{t('SettleCode')}</Option> */}
              </Select>
            </Form.Item>

            <Form.Item
              // label={t("search")}
              name="search"
            >
              <Input.Search
                enterButton
                placeholder={t('search')}
                onSearch={onSearch}
                className={classes['input-search']}
              />
            </Form.Item>

            <Form.Item
              name="ActiveDate"
            // label={t("startDate")}
            >
              <DatePicker format="DD.MM.YYYY" />
            </Form.Item>

            <Form.Item name="DivisionID">
              <Select
                allowClear
                style={{ width: 120 }}
                placeholder={t("Division")}
                onSelect={GetDivisionID}
              >
                {divisionList.map((division) => (
                  <Option key={division.ID} value={division.ID}>
                    {division.ShortName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="FacultyID">
              <Select
                allowClear
                style={{ width: 120 }}
                placeholder={t("Faculty")}
              // onChange={GetDivisionID}
              >
                {facultyList?.map((faculty) => (
                  <Option key={faculty.ID} value={faculty.ID}>
                    {faculty.ShortName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="DirectionID">
              <Select
                allowClear
                style={{ width: 120 }}
                placeholder={t("Direction")}
              >
                {DepartmentList?.map((Department) => (
                  <Option key={Department.ID} value={Department.ID}>
                    {Department.ShortName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="GroupID">
              <Select
                allowClear
                style={{ width: 120 }}
                placeholder={t("Group")}
              >
                {GroupList?.map((Group) => (
                  <Option key={Group.ID} value={Group.ID}>
                    {Group.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="PositionID">
              <Select
                allowClear
                style={{ width: 120 }}
                placeholder={t("Course")}
              >
                {CourseList?.map((course) => (
                  <Option key={course.ID} value={course.ID}>
                    {course.Name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => setPrint(false)}
              >
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => setPrint(true)}
              >
                <i className="feather icon-printer" />
              </Button>
            </Form.Item>

            <Form.Item name="SettleCodeID">
              <Select
                allowClear
                style={{ width: 250 }}
                placeholder={t("SettleCode")}
              >
                {orgSettleAcc?.map((settleCode) => (
                  <Option key={settleCode.ID} value={settleCode.ID}>
                    {settleCode.Code}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="IsVerification"
              valuePropName="checked"
            >
              <Checkbox
                onChange={checkboxHandler}
              >
                {t("Show checked")}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name="NoVerification"
              valuePropName="checked"
            >
              <Checkbox
                onChange={checkboxHandler}
              >
                {t("IsNotChecked")}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name="HavePhoneNumber"
              valuePropName="checked"
            >
              <Checkbox
                onChange={checkboxHandler}
              >
                {t("HavePhoneNumber")}
              </Checkbox>
            </Form.Item>
            <Form.Item
              name="CheckHemis"
              valuePropName="checked"
            >
              <Checkbox
                onChange={checkboxHandler}
              >
                {t("checkedHemis")}
              </Checkbox>
            </Form.Item>
          </div>
        </Form>
      </Fade>
      <Fade>
        <TableEmployees tableData={tableData} total={total} match={match} />
      </Fade>
    </Card>
  )
}

export default ReportsOfStudents;