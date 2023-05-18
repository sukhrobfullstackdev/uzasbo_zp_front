import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Popconfirm, Tag } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import PensionFundRegistryServices from "../../../../../services/Documents/ElectronicReports/PensionFundRegistry/PensionFundRegistry.services";
import Card from "../../../../components/MainCard";
import HelperServices from "../../../../../services/Helper/helper.services";
import classes from "./PensionFundRegistry.module.css";
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;

class PensionFundRegistry extends Component {
  state = {
    data: [],
    filterData: {},
    filterStatus: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination }, this.state.filterData);

    HelperServices.getStatusList()
      .then((response) => {
        this.setState({ filterStatus: response.data });
      })
      .catch((err) => {
        Notification('error', err)
        // console.log(err);
      });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch(
      {
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
      },
      this.state.filterData
    );
  };
  fetch = (params = {}, searchCode, filterFormValues) => {
    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder,
      search = searchCode ? searchCode : "";

    const date = {
      EndDate: filterFormValues
        ? filterFormValues.EndDate.format("DD.MM.YYYY")
        : moment().add(30, "days").format("DD.MM.YYYY"),
      StartDate: filterFormValues
        ? filterFormValues.StartDate.format("DD.MM.YYYY")
        : moment().subtract(30, "days").format("DD.MM.YYYY"),
    };


    PensionFundRegistryServices.getList(
      pageNumber,
      pageLimit,
      sortColumn,
      orderType,
      search,
      date,
      filterFormValues
    )
      .then((data) => {
        this.setState({
          loading: false,
          data: data.data.rows,
          pagination: {
            ...params.pagination,
            total: data.data.total,
          },
        });
      })
      .catch((err) => {
        // window.alert(err);
        Notification('error', err);
      });
  };

  search = (value) => {
    this.setState({ loading: true });
    const { pagination } = this.state;
    this.fetch({ pagination }, value);
  };

  onFinish = (filterFormValues) => {
    this.setState({ filterData: filterFormValues });
    // console.log(values);
    filterFormValues.Status = filterFormValues.Status
      ? filterFormValues.Status
      : "";

    this.setState({ loading: true });
    const { pagination } = this.state;
    this.fetch({ pagination }, null, filterFormValues);
  };

  // End Filter functions

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        sorter: (a, b) => a.code - b.code,
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("OldCode"),
        dataIndex: "OldCode",
        key: "OldCode",
        sorter: true,
      },
      {
        title: t("NewCode"),
        dataIndex: "NewCode",
        key: "NewCode",
        sorter: true,
      },
      {
        title: t("status"),
        dataIndex: "Status",
        key: "Status",
        sorter: true,
        render: (_, record) => {
          if (record.StatusID === 2 || record.StatusID === 8) {
            return (
              <Tag color='#87d068'>
                {record.Status}
              </Tag>
            );
          }
          return (
            <Tag color='#f50'>
              {record.Status}
            </Tag>
          );
        }
      },
      {
        title: t("Comment"),
        dataIndex: "Comment",
        key: "Comment",
        sorter: true,
      },
      {
        title: t("actions"),
        key: "action",
        width: "10%",
        align: "center",
        render: (record) => {
          return (
            <Space size="middle">
              <Link
                data-id={record.id}
                to={`${this.props.match.path}/edit/${record.ID}`}
              >
                <i
                  className="feather icon-edit action-icon"
                  aria-hidden="true"
                ></i>
              </Link>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.ID)}
                okText={t("yes")}
                cancelText={t("cancel")}
              >
                <span style={{ color: "#1890FF", cursor: "pointer" }}>
                  <i
                    className="feather icon-trash-2 action-icon"
                    aria-hidden="true"
                  ></i>
                </span>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("PensionFundRegistry")}>
        <Fade>
          <div className="table-top">
            <Form
              onFinish={this.onFinish}
              className={classes.FilterForm}
              initialValues={{
                EndDate: moment().add(30, "days"),
                StartDate: moment().subtract(-30, "days"),
              }}
            >
              <div className="main-table-filter-elements">
                <Form.Item name="Search">
                  <Input.Search
                    className="table-search"
                    placeholder={t("search")}
                    enterButton
                    onSearch={this.search}
                  />
                </Form.Item>
                <Form.Item name="Status">
                  <Select style={{ width: 120 }} placeholder={t("status")}>

                    {/* <Option value="Status">{t("example")}</Option> */}
                    {this.state.filterStatus.map((filterStatusType) => (
                      <Option
                        key={filterStatusType.ID}
                        value={filterStatusType.ID}
                      >
                        {filterStatusType.DisplayName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="StartDate">
                  <DatePicker format="DD.MM.YYYY" />
                </Form.Item>
                <Form.Item name="EndDate">
                  <DatePicker format="DD.MM.YYYY" />
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => this.setState({ print: false })}
                >
                  <i className="feather icon-refresh-ccw" />
                </Button>
                <Link to={`${this.props.match.path}/add`}>
                  <Button type="primary" disabled>
                    {t("add-new")}&nbsp;
                    <i className="fa fa-plus" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </Form>

          </div>
        </Fade>
        <Fade>
          <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
            rowClassName="table-row"
            className="main-table"
            showSorterTooltip={false}
            scroll={{
              x: "max-content",
            }}
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
          />
        </Fade>
      </Card>
    );
  }
}

export default withTranslation()(PensionFundRegistry);
