import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Form, Button, Select, Tooltip } from "antd";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import GetListTable from './components/GetListTable';
import Card from "../../../components/MainCard";

const { Option } = Select;

const UserError = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.userErrorList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const filterSearchVal = tableList.filterData[`${tableList?.filterType}`];

  const [filterType, setFilterType] = useState(tableList?.filterType);

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
    dispatch(setListFilterType({
      filterType: values?.filterType,
    }));
    dispatch(setListFilter({
      [values?.filterType]: values?.Search.trim(),
    }));
  };

  const onSearch = () => {
    filterForm.validateFields()
      .then(values => {
        onFinish(values);
      })
  };

  return (
    <Card title={t("userErrorList")}>
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
          }}
        >
          <div className="main-table-filter-wrapper">
            <Form.Item
              name="filterType"
              label={t("Filter Type")}
            >
              <Select
                allowClear
                style={{ width: 180, marginBottom: 0 }}
                placeholder={t("Filter Type")}
                onChange={filterTypeHandler}
              >
                <Option value="ID">{t('id')}</Option>
                <Option value="Search">{t('name')}</Option>
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
  )
}

export default UserError;