import React, { useState, useEffect } from "react";
import { Input, Form, Button, DatePicker, Select, Tooltip, InputNumber, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
// import { ExclamationCircleOutlined } from "@ant-design/icons";

import HelperServices from "../../../../../services/Helper/helper.services";
import '../../../../../helpers/prototypeFunctions';
import { Notification } from "../../../../../helpers/notifications";
import Card from "../../../../components/MainCard";
import { setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from "./components/GetListTable";

const { Option } = Select;

const PayrollOfPlasticCardSheet = () => {
  const adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
  const TotalRequestReceivingCash = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('TotalRequestReceivingCash');
  // only for super admin linked via UserID
  // const superAdminViewRole = JSON.parse(localStorage.getItem('userInfo')).UserID === 22412;

  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.payrollOfPlasticCardSheetList);
  // const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];
  const mainLoader = tableList?.mainLoader;

  const [filterType, setFilterType] = useState(tableList?.filterType);
  const [statusList, setStatusList] = useState([]);
  const [orgSettleAccList, setOrgSettleAccList] = useState([]);

  useEffect(() => {
    const getFilterParamData = async () => {
      const [stsList, orgSettleAccLs] = await Promise.all([
        HelperServices.getStatusList(),
        HelperServices.getOrganizationsSettlementAccountList(),
      ]);
      setStatusList(stsList.data);
      setOrgSettleAccList(orgSettleAccLs.data);
    }
    getFilterParamData().catch(err => Notification('error', err))
  }, []);

  // console.log('render');

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
      StartDate: values?.StartDate,
      EndDate: values?.EndDate,
      [values?.filterType]: values?.Search?.trim(),
      Status: values?.Status,
      OrgID: values?.OrgID,
      SettleCode: values?.SettleCode,
    }));
  };

  const onSearch = () => {
    filterForm.validateFields()
      .then(values => {
        onFinish(values);
      })
  };

  return (
    <Spin size='large' spinning={mainLoader}>
      <Card title={t("PayrollOfPlasticCardSheet")}>
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

              {adminViewRole &&
                <Form.Item
                  label={t("orgId")}
                  name="OrgID"
                >
                  <InputNumber placeholder={t("orgId")} />
                </Form.Item>
              }

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
                name="SettleCode"
                label={t("SettleCode")}
              >
                <Select
                  placeholder={t("SettleCode")}
                  style={{ width: 230 }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {orgSettleAccList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                </Select>
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
              {/* {TotalRequestReceivingCash &&
                <Form.Item>
                  <Tooltip title={t("add-new")}>
                    <Button type="primary">
                      <Link to={`${location.pathname}/add`}>
                        <i className="fa fa-plus" aria-hidden="true" />
                      </Link>
                    </Button>
                  </Tooltip>
                </Form.Item>
              } */}
            </div>
          </Form>
        </Fade>
        <Fade>
          <GetListTable />
        </Fade>
      </Card>
    </Spin>
  )
}

export default PayrollOfPlasticCardSheet;