import React, { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Select, Form, Button } from 'antd';
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";

import { getListStartAction, setListFilter, setListFilterType } from './_redux/usersSlice';
import TableUsers from './components/TableUsers';
import Card from "../../../../components/MainCard";

const { Option } = Select;

const Users = ({ match }) => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.userList);

  const [filterType, setFilterType] = useState(userList.filterType || 'UserName');
  const filterValue = userList.filterData[`${filterType}`];

  let tableData = userList.listSuccessData?.rows;
  let total = userList.listSuccessData?.total;
  let pagination = userList?.paginationData;
  let filter = userList?.filterData;

  useEffect(() => {
    dispatch(
      getListStartAction({
        ...pagination,
        ...filter,
      })
    );
  }, [pagination, filter, dispatch]);

  function filterTypeHandler(value) {
    setFilterType(value);
  }

  const onFilterFinish = useCallback((values) => {
    dispatch(setListFilterType({
      filterType: values?.filterType,
    }));
    dispatch(setListFilter({
      INN: values?.INN?.trim(),
      OrganizationID: values?.OrganizationID?.trim(),
      [values?.filterType]: values?.Search?.trim(),
    }));
  }, [dispatch])

  const onSearch = useCallback(() => {
    filterForm.validateFields()
      .then(values => {
        onFilterFinish(values);
      })
  }, [filterForm, onFilterFinish])

  return (
    <Card title={t("User")}>
      <Fade>
        <Form
          layout='vertical'
          form={filterForm}
          onFinish={onFilterFinish}
          className='table-filter-form'
          initialValues={{
            ...filter,
            filterType: filterType,
            search: filterValue,
          }}
        >
          <div className="main-table-filter-wrapper">
            <Form.Item
              name="OrganizationID"
              label={t("OrganizationID")}
            >
              <Input placeholder={t("OrganizationID")} style={{ width: 120 }} />
            </Form.Item>

            <Form.Item
              name="INN"
              label={t("INN")}
            >
              <Input placeholder={t("INN")} style={{ width: 120 }} />
            </Form.Item>

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
                {/* <Option value="INN">{t('OrgINN')}</Option> */}
                <Option value="UserName">{t('username')}</Option>
                <Option value="FIO">{t('fullname')}</Option>
                <Option value="OrganizationName">{t('OrganizationName')}</Option>
                {/* <Option value="OrganizationID">{t('OrganizationID')}</Option> */}
              </Select>
            </Form.Item>

            <Form.Item
              label={t("search")}
              name="Search"
            >
              <Input.Search
                enterButton
                placeholder={t("search")}
                onSearch={onSearch}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Fade >
      <Fade>
        <TableUsers tableData={tableData} total={total} match={match} />
      </Fade>
    </Card >
  )
}

export default Users;