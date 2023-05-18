import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Form, Button, DatePicker, Select, InputNumber, Tooltip } from "antd";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation, Link } from "react-router-dom";

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from './components/GetListTable';
import Card from "../../../../components/MainCard";
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from "../../../../../services/Helper/helper.services";

const { Option } = Select;

const SalaryCalculation = () => {
  const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
  // only for super admin linked via UserID
  const superAdminViewRole = JSON.parse(localStorage.getItem('userInfo')).UserID === 22412;
  const OrganizationTypeID = JSON.parse(localStorage.getItem('userInfo')).OrgTypeID === 19;

  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.salaryCalcGetList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];

  const [filterType, setFilterType] = useState(tableList?.filterType);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    const getFilterParamData = async () => {
      const [stsList] = await Promise.all([
        HelperServices.getStatusList(),
      ]);
      setStatusList(stsList.data);
    }
    getFilterParamData().catch(err => Notification('error', err))
  }, []);

  useEffect(() => {
    dispatch(
      getListStartAction({
        ...tablePagination,
        ...tableFilterData,
      })
    );
  }, [dispatch, tablePagination, tableFilterData]);

  const filterTypeHandler = (value) => {
    setFilterType(value);
  }

  const onFinish = (values) => {
    values.StartDate = values.StartDate.format("DD.MM.YYYY");
    values.EndDate = values.EndDate.format("DD.MM.YYYY");
    dispatch(setListFilterType({
      filterType: values?.filterType,
    }));
    dispatch(setListFilter({
      Status: values?.Status,
      OrgID: values?.OrgID,
      [values?.filterType]: values?.Search,
      StartDate: values?.StartDate,
      EndDate: values?.EndDate,
    }));
  };

  const onSearch = () => {
    filterForm.validateFields()
      .then(values => {
        onFinish(values);
      })
  };

  return (
    <Card title={t("SalaryCalculation")}>
      <Fade>
        <Form
          layout='vertical'
          form={filterForm}
          onFinish={onFinish}
          className='table-filter-form'
          initialValues={{
            ...tableFilterData,
            filterType: filterType,
            Search: filterSearchVal,
            StartDate: moment(tableFilterData.StartDate, 'DD.MM.YYYY'),
            EndDate: moment(tableFilterData.EndDate, 'DD.MM.YYYY'),
          }}
        >
          <div className="main-table-filter-wrapper">
            <Form.Item
              name="filterType"
              label={t("Filter Type")}
            >
              <Select
                allowClear
                style={{ width: 180 }}
                placeholder={t("Filter Type")}
                onChange={filterTypeHandler}
              >
                <Option value="ID">{t('id')}</Option>
                <Option value="Number">{t('Наименование')}</Option>
              </Select>
            </Form.Item>

            {adminViewRole &&
              <Form.Item
                label={t("orgId")}
                name="OrgID"
                rules={[
                  {
                    required: true,
                    message: t('inputValidData'),
                  },
                ]}
              >
                <InputNumber
                  placeholder={t("orgId")}
                />
              </Form.Item>
            }

            <Form.Item
              label={t("search")}
              name="Search"
            >
              <Input.Search
                placeholder={t("search")}
                enterButton
                onSearch={onSearch}
              />
            </Form.Item>

            <Form.Item
              name="StartDate"
              label={t("startDate")}
            >
              <DatePicker
                format="DD.MM.YYYY"
                className='datepicker'
                placeholder={t("startDate")}
              />
            </Form.Item>

            <Form.Item
              name="EndDate"
              label={t("endDate")}
            >
              <DatePicker
                format="DD.MM.YYYY"
                className='datepicker'
                placeholder={t("endDate")}
              />
            </Form.Item>

            <Form.Item
              name="Status"
              label={t("Status")}
            >
              <Select
                allowClear
                showSearch
                placeholder={t("Status")}
                style={{ width: 200 }}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>

            <Form.Item>
              <Tooltip title={t("add-new")}>
                <Button type="primary" disabled>
                  <Link to={`${location.pathname}/add`}>
                    <i className="fa fa-plus" aria-hidden="true" />
                  </Link>
                </Button>
              </Tooltip>
            </Form.Item>
          </div>
        </Form>
      </Fade>
      <Fade>
        <GetListTable adminViewRole={adminViewRole} superAdminViewRole={superAdminViewRole} OrganizationTypeID={OrganizationTypeID} />
      </Fade>
    </Card >
  )
}

export default SalaryCalculation;