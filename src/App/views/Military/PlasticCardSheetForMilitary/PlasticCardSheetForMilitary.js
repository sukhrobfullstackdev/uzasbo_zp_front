import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Form, Button, DatePicker, Select, Spin, Tooltip } from "antd";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation, Link } from "react-router-dom";
import { DownloadOutlined } from '@ant-design/icons';

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from './components/GetListTable';
import Card from "../../../components/MainCard";
import { Notification } from '../../../../helpers/notifications';
import HelperServices from "../../../../services/Helper/helper.services";
import template from '../../../../assets/files/military-template.xlsx'

const { Option } = Select;

const PlasticCardSheetForMilitary = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.plasticCardSheetForMilitaryGetList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const mainLoader = tableList?.mainLoader;
  const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];

  const [filterType, setFilterType] = useState(tableList?.filterType);
  const [statusList, setStatusList] = useState([]);
  const [orgSettleAccList, setOrganizationsSettlementAccountList] = useState([]);

  useEffect(() => {
    const getFilterParamData = async () => {
      const [stsList, orgSettleAcc] = await Promise.all([
        HelperServices.getStatusList(),
        HelperServices.getOrganizationsSettlementAccountList()
      ]);
      setStatusList(stsList.data);
      setOrganizationsSettlementAccountList(orgSettleAcc.data);
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
    <Spin size='large' spinning={mainLoader}>
      <Card title={t("PlasticCardSheetForMilitary")}>
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
                  <Option value="Number">{t('Number')}</Option>
                  <Option value="OrgID">{t('orgId')}</Option>
                  <Option value="OrgINN">{t('OrgINN')}</Option>
                  <Option value="BankCode">{t('BankCode')}</Option>
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

              <Form.Item
                name="SettleCode"
                label={t("SettleCode")}
              >
                <Select
                  allowClear
                  showSearch
                  placeholder={t("SettleCode")}
                  style={{ width: 230 }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {orgSettleAccList.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                </Select>
              </Form.Item>

              <Form.Item>
                <Tooltip title={t('plasticSheet')}>
                  <a href={template} download={t('plasticSheet')} >
                    <Button type="primary">
                      <DownloadOutlined />
                    </Button>
                  </a>
                </Tooltip>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <i className="feather icon-refresh-ccw" />
                </Button>
              </Form.Item>

              <Form.Item>
                <Tooltip title={t("add-new")}>
                  <Button type="primary">
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
          <GetListTable />
        </Fade>
      </Card>
    </Spin>
  )
}

export default PlasticCardSheetForMilitary;