import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input, Form, Button, Select, InputNumber } from "antd";
import { Fade } from "react-awesome-reveal";
import { useDispatch, useSelector } from "react-redux";

import {
  getListStartAction,
  setListFilterType,
  setListFilter,
} from "./_redux/getListSlice";
import GetListTable from "./components/GetListTable";
import MainCard from "../../../../components/MainCard";

const { Option } = Select;

const LimitBySubCalculationKind = ({ match }) => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm();
  const dispatch = useDispatch();
  //   console.log(match, 'match');

  const tableList = useSelector((state) => state.LimitBySubCalcList);

  let tableData = tableList?.listSuccessData?.rows;
  let total = tableList.listSuccessData?.total;
  let pagination = tableList?.paginationData;
  let filter = tableList?.filterData;

  const [filterType, setFilterType] = useState(tableList?.filterType);

  const adminViewRole = JSON.parse(
    localStorage.getItem("userInfo")
  ).Roles.includes("LimitBySubCalculationKindManage");

  useEffect(() => {
    dispatch(
      getListStartAction({
        ...pagination,
        ...filter,
      })
    );
  }, [dispatch, pagination, filter]);

  const filterTypeHandler = (value) => {
    setFilterType(value);
  };

  const onFinish = (values) => {
    console.log(values);
    dispatch(
      setListFilterType({
        filterType: values?.filterType,
      })
    );
    dispatch(
      setListFilter({
        [values?.filterType]: values?.Search,
        OrgID: values.OrgID,
      })
    );
  };

  const onSearch = () => {
    console.log(filterForm.validateFields(), "1");
    filterForm.validateFields().then((values) => {
      onFinish(values);
    });
  };

  return (
    <MainCard title={t("LimitBySubCalculationKind")}>
      <Fade>
        <Form
          layout="vertical"
          form={filterForm}
          onFinish={onFinish}
          className="table-filter-form"
          initialValues={{
            ...filter,
            filterType: filterType,
          }}
        >
          <div className="main-table-filter-wrapper">
            <Form.Item name="filterType">
              <Select
                allowClear
                style={{ width: 180, marginBottom: 0 }}
                placeholder={t("Filter Type")}
                onChange={filterTypeHandler}
              >
                <Option value="ID">{t("id")}</Option>
                <Option value="Search">{t("name")}</Option>
              </Select>
            </Form.Item>

            <Form.Item name="Search">
              <Input.Search
                placeholder={t("search")}
                enterButton
                onSearch={onSearch}
              />
            </Form.Item>
            {adminViewRole && (
              <Form.Item name="OrgID">
                <InputNumber
                  placeholder={t("Organization")}
                  style={{ width: 180 }}
                ></InputNumber>
              </Form.Item>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Fade>
      <Fade>
        <GetListTable
          tableData={tableData}
          total={total}
          match={match}
          tableList={tableList}
        />
      </Fade>
    </MainCard>
  );
};

export default React.memo(LimitBySubCalculationKind);
