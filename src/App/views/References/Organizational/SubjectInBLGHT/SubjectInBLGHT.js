import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Input, Form, Button, DatePicker, Select, Spin, Tooltip } from "antd";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useLocation, Link } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';

import { getListStartAction, setListFilterType, setListFilter } from './_redux/getListSlice';
import TableData from './components/TableData';
import Card from "../../../../components/MainCard";
import { Notification } from '../../../../../helpers/notifications';
import HelperServices from "../../../../../services/Helper/helper.services";

const { Option } = Select;

const SubjectInBLGHT = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  const tableList = useSelector((state) => state.subjectsInBLGHTList);
  const tablePagination = tableList?.paginationData;
  const tableFilterData = tableList?.filterData;
  const mainLoader = tableList?.mainLoader;
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

  // const filterTypeHandler = (value) => {
  //   setFilterType(value);
  // }

  const onFinish = (values) => {
    values.StartDate = values.StartDate.format("DD.MM.YYYY");
    values.EndDate = values.EndDate.format("DD.MM.YYYY");
    dispatch(setListFilterType({
      filterType: values?.filterType,
    }));
    dispatch(setListFilter({
      ...values,
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
      <Card title={t("SubjectsInBLHGT")}>
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
                <Tooltip title={t('refresh')}>
                  <Button type="primary" htmlType="submit">
                    <i className="feather icon-refresh-ccw" />
                  </Button>
                </Tooltip>
              </Form.Item>

              <Form.Item>
                <Tooltip title={t("add-new")}>
                  <Button type="primary">
                    <Link to={`${location.pathname}/add`}>
                      {/* {t("add-new")}&nbsp; */}
                      <i className="fa fa-plus" aria-hidden="true" />
                    </Link>
                  </Button>
                </Tooltip>
              </Form.Item>
            </div>
          </Form>
        </Fade>
        <Fade>
          <TableData />
        </Fade>
      </Card>
    </Spin>
  )
}

export default SubjectInBLGHT;