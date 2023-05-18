import React, { useEffect, useState } from 'react'
import { Fade } from "react-awesome-reveal";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Button, DatePicker, Form, Input, Select, Tooltip } from 'antd';
import { Link } from "react-router-dom";
import moment from "moment";

import Card from "../../../../components/MainCard";
import HelperServices from '../../../../../services/Helper/helper.services';
import { getListStartAction, setListFilter, setListFilterType } from './_redux/TimeSheetEduSlice';
import TableTimeSheetEdu from './components/TableTimeSheetEdu';
import { Notification } from '../../../../../helpers/notifications';

const { Option } = Select;

const NewTimeSheetEdu = ({ match }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filterForm] = Form.useForm();
  const timeSheetEduList = useSelector((state) => state.timeSheetEduList);

  let tableData = timeSheetEduList.listSuccessData?.rows;
  let total = timeSheetEduList.listSuccessData?.total;
  let pagination = timeSheetEduList?.paginationData;
  let filter = timeSheetEduList?.filterData;

  useEffect(() => {
    dispatch(
      getListStartAction({
        ...pagination,
        ...filter,
      })
    );
  }, [dispatch, pagination, filter]);

  const [filterType, setFilterType] = useState(timeSheetEduList.filterType);

  const [statusList, setStatusList] = React.useState([]);
  const [departmentList, setDepartmentList] = React.useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const stsList = await HelperServices.getStatusList();
      const dpList = await HelperServices.getAllDepartmentList();
      setStatusList(stsList.data);
      setDepartmentList(dpList.data);
    };
    fetchData().catch(err => {
      Notification('error', err);
    });
  }, []);

  const getList = (values) => {
    dispatch(setListFilter({
      Status: values?.Status,
      DprName: values?.DprName,
      [values?.filterType]: values?.Search?.trim(),
      StartDate: values?.StartDate,
      EndDate: values?.EndDate,
    }));
  };

  const filterTypeHandler = (value) => {
    filterForm.setFieldsValue({ Search: null });
    setFilterType(value);
  };

  const onSearch = () => {
    filterForm.validateFields()
      .then(values => {
        values.StartDate = values.StartDate.format("DD.MM.YYYY");
        values.EndDate = values.EndDate.format("DD.MM.YYYY");
        dispatch(setListFilterType({
          filterType: filterType,
        }));
        getList(values);
      });
  };

  const onFinish = (values) => {
    values.StartDate = values.StartDate.format("DD.MM.YYYY");
    values.EndDate = values.EndDate.format("DD.MM.YYYY");
    dispatch(setListFilterType({
      filterType: values?.filterType,
    }));
    getList(values);
  };

  return (
    <Card title={t("TimeSheetEdu")}>
      <Fade>
        <Form
          layout='vertical'
          form={filterForm}
          onFinish={onFinish}
          className='table-filter-form'
          initialValues={{
            filterType: filterType,
            Search: filter[`${filterType}`],
            Status: filter.Status,
            DprName: filter.DprName,
            StartDate: moment(filter.StartDate, 'DD.MM.YYYY'),
            EndDate: moment(filter.EndDate, 'DD.MM.YYYY'),
          }}
        >
          <div className='main-table-filter-wrapper'>
            <Form.Item
              name="filterType"
              label={t("Filter Type")}
            >
              <Select
                allowClear
                style={{ width: 120 }}
                placeholder={t("Filter Type")}
                onChange={filterTypeHandler}
              >
                <Option value="ID">{t('id')}</Option>
                <Option value="Number">{t('number')}</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={t("search")}
              name="Search"
            >
              <Input.Search
                style={{ width: 150 }}
                placeholder={t("search")}
                enterButton
                onSearch={onSearch}
              />
            </Form.Item>

            <Form.Item
              name="StartDate"
              label={t("startDate")}
            >
              <DatePicker format="DD.MM.YYYY" className='datepicker' />
            </Form.Item>

            <Form.Item
              name="EndDate"
              label={t("endDate")}
            >
              <DatePicker format="DD.MM.YYYY" className='datepicker' />
            </Form.Item>

            <Form.Item
              name="Status"
              label={t("Status")}>
              <Select
                allowClear
                placeholder={t("Status")}
                style={{ width: 200 }}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item
              name="DprName"
              label={t("DprName")}
            >
              <Select
                allowClear
                showSearch
                placeholder={t("DprName")}
                style={{ width: 200 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>

            <Form.Item>
              <Tooltip title={t("add-new")}>
                <Button type="primary">
                  <Link to={`${match.path}/add`}>
                    <i className="fa fa-plus" aria-hidden="true" />
                  </Link>
                </Button>
              </Tooltip>
            </Form.Item>
          </div>
        </Form>
      </Fade>

      <Fade>
        <TableTimeSheetEdu tableData={tableData} total={total} match={match} />
      </Fade>
    </Card>
  )
}

export default NewTimeSheetEdu;