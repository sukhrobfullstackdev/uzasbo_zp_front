import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Popconfirm, Tag } from "antd";
// import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import EmployeeStateServices from "../../../../../services/Documents/Payroll/EmployeeState/EmployeeState.services";
import Card from "../../../../components/MainCard";
import HelperServices from "../../../../../services/Helper/helper.services";
import classes from "./EmployeeState.module.css";
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class EmployeeState extends Component {
  filterForm = React.createRef();
  state = {
    data: [],
    filterStatus: [],
    divisionList: [],
    filterType: "",
    filterData: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
  };

  fetchAdditionalData = async () => {
    try {
      const stsList = await HelperServices.getStatusList();
      this.setState({ filterStatus: stsList.data })
    } catch (err) {
      // console.log(err);
      Notification('error', err);
    }
  }

  componentDidMount() {
    this.fetchAdditionalData();
    const { pagination } = this.state;
    this.fetch({ pagination },  {});
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch(
      {
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
      },
    this.state.filterData,
    );
  };

  fetch = (params = {}, filterFormValues) => {
    let filter = {};

    if (this.state.filterType) {
      filter[this.state.filterType] = filterFormValues.Search
        ? filterFormValues.Search
        : '';
    }

    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder;

    const date = {
      EndDate: filterFormValues.EndDate
        ? filterFormValues.EndDate.format("DD.MM.YYYY")
        : moment().add(30, "days").format("DD.MM.YYYY"),
      StartDate: filterFormValues.StartDate
        ? filterFormValues.StartDate.format("DD.MM.YYYY")
        : moment().subtract(30, "day").format("DD.MM.YYYY"),
    };

    EmployeeStateServices.getList(
      pageNumber,
      pageLimit,
      sortColumn,
      orderType,
      date,
      filter,
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
        // console.log(err);
        Notification('error', err);
      });
  };

  onFinish = (values) => {
    this.setState({ loading: true, filterData: values });
    this.fetch({ pagination: defaultPagination }, values);
  };

  handleDelete = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    EmployeeStateServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => Notification('error', err));
  };

  search = () => {
    const filterValues = this.filterForm.current.getFieldsValue();
    this.setState({ loading: true });
    this.fetch({ pagination: defaultPagination }, filterValues);
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        sorter: true
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("endDate"),
        dataIndex: "EndDate",
        key: "EndDate",
        sorter: true,
      },
      {
        title: t("personnelNumber"),
        dataIndex: "PersonnelNumber",
        key: "PersonnelNumber",
        sorter: true,
        width: 150,
      },
      {
        title: t("status"),
        dataIndex: "DisplayName",
        key: "DisplayName",
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
        title: t("FullName"),
        dataIndex: "FullName",
        key: "FullName",
        sorter: true,
      },
      {
        title: t("TPCName"),
        dataIndex: "TPCName",
        key: "TPCName",
        sorter: true,
        width: 400,
      },
      {
        title: t("TPCProof"),
        dataIndex: "TPCProof",
        key: "TPCProof",
        sorter: true,
        width: 400,
      },
      {
        title: t("Comment"),
        dataIndex: "Comment",
        key: "Comment",
        width: 400,
        sorter: true,
      },
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: "right",
        render: (record) => {
          // const isAccepted = this.state.isAccepted;
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
      <Card title={t("Employee State")}>
        <Fade>
          <div className="table-top">
            <Form
              ref={this.filterForm}
              onFinish={this.onFinish}
              className={classes.FilterForm}
              initialValues={{
                EndDate: moment().add(30, "days"),
                StartDate: moment().subtract(30, "days"),
              }}
            >
              <div className="main-table-filter-elements">
                <Form.Item>
                  <Select
                    style={{ width: 180 }}
                    placeholder={t("Filter Type")}
                    onChange={this.filterTypeHandler}
                  >
                
                    <Option value="ID">{t("id")}</Option>
                    <Option value="PersonnelNumber">{t("TableID")}</Option>
                    <Option value="Search">{t("FullName")}</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="Search">
                  <Input.Search
                    className="table-search"
                    placeholder={t("search")}
                    enterButton
                    onSearch={this.search}
                  />
                </Form.Item>

                <Form.Item name="Status">
                  <Select style={{ width: 200 }} placeholder={t("status")}>
                
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
                >
                  <i className="feather icon-refresh-ccw" />
                </Button>
              </div>
            </Form>

            <Link to={`${this.props.match.path}/add`}>
              <Button type="primary">
                {t("add-new")}&nbsp;
                <i className="fa fa-plus" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Fade>
        <Fade>
          <Table
            bordered
            rowClassName="table-row"
            className="main-table"
            showSorterTooltip={false}
            columns={columns}
            dataSource={data}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            scroll={{ 
              x: "max-content",
              y: "50vh",
            }}
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  this.props.history.push(
                    `${this.props.match.path}/edit/${record.ID}`
                  );
                },
              };
            }}
          />
        </Fade>
      </Card>
    );
  }
}

export default withTranslation()(EmployeeState);
