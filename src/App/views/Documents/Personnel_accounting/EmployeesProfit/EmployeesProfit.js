import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Tooltip, Popconfirm, Tag } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import EmployeesProfitServices from "../../../../../services/Documents/Payroll/EmployeesProfit/EmployeesProfit.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;

class EmployeesProfit extends Component {
  state = {
    data: [],
    departmentList: [],
    orgSettleAcc: [],
    statusList: [],
    filterForm: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    filterType: ''
  };

  fetchData = async () => {
    try {
      const orgSettleAcc = await HelperServices.getOrganizationsSettlementAccountList();
      const stsList = await HelperServices.getStatusList();
      const dpList = await HelperServices.getAllDepartmentList();
      this.setState({ orgSettleAcc: orgSettleAcc.data, statusList: stsList.data, departmentList: dpList.data })
    } catch (err) {
      Notification('error', err);
      // console.log(err);
    }
  }

  componentDidMount() {
    this.fetchData();
    const { pagination } = this.state;
    this.fetch({ pagination }, null, {});
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
      {}
    );
  };

  fetch = (params = {}, searchCode, filterFormValues) => {
    let filter = {};
    let search;

    if (this.state.filterType) {
      filter[this.state.filterType] = filterFormValues.Search ? filterFormValues.Search : searchCode;
    } else {
      search = filterFormValues.Search ? filterFormValues.Search : searchCode;
    }

    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder

    const date = {
      EndDate: filterFormValues.EndDate ? filterFormValues.EndDate.format("DD.MM.YYYY") : moment().add(30, "days").format("DD.MM.YYYY"),
      StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(30, "days").format("DD.MM.YYYY"),
    };

    EmployeesProfitServices.getList(pageNumber, pageLimit, sortColumn, orderType, search, date, filter, filterFormValues)
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
    this.fetch({ pagination }, value, {});
  };

  deleteRowHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterForm } = this.state;
    EmployeesProfitServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, null, filterForm);
        }
      })
      .catch((err) => Notification('error', err));
  };

  acceptHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    EmployeesProfitServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('accepted'));
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        //console.log(err)
        Notification('error', err)
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    EmployeesProfitServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('notAccepted'))
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        //console.log(err)
        Notification('error', err)
        this.setState({ loading: false });
      });
  };

  onFinish = (values) => {
    this.setState({ loading: true, filterForm: values });
    const { pagination } = this.state;
    this.fetch({ pagination }, null, values);
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };

  // End Filter functions

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        sorter: true,
        render: (_, record) => {
          if (record.StatusID === 2) {
            return record.ID;
          } else {
            return <span style={{ color: 'red' }}>{record.ID}</span>
          }
        }
      },
      {
        title: t("Personnelnumber"),
        dataIndex: "PersonnelNumber",
        key: "PersonnelNumber",
        sorter: true,
        width: 100
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
        width: 100
      },
      {
        title: t("FullName"),
        dataIndex: "FullName",
        key: "FullName",
        sorter: true,
        width: 100
      },

      {
        title: t("Status"),
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
        title: t("DateOfCreated"),
        dataIndex: "DateOfCreated",
        key: "DateOfCreated",
        sorter: true,
      },
      {
        title: t("DateOfModified"),
        dataIndex: "DateOfModified",
        key: "DateOfModified",
        sorter: true,
        width: 100
      },

      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        render: (record) => {
          return (
            <Space size="middle">
              <Tooltip title={t("Edit")}>

                <Link
                  to={`${this.props.match.path}/edit/${record.ID}`}
                >
                  <i
                    className='feather icon-edit action-icon'
                    aria-hidden="true"
                  />
                </Link>
              </Tooltip>

              <Tooltip title={t("Accept")}>
                <span onClick={() => this.acceptHandler(record.ID)}>
                  <i className="far fa-check-circle action-icon" />
                </span>
              </Tooltip>

              <Tooltip title={t("NotAccept")}>
                <span onClick={() => this.declineHandler(record.ID)}>
                  <i className="far fa-times-circle action-icon" />
                </span>
              </Tooltip>

              <Tooltip title={t("Delete")}>
                <Popconfirm
                  title={t("delete")}
                  onConfirm={() => this.deleteRowHandler(record.ID)}
                  okText={t("yes")}
                  cancelText={t("cancel")}
                >
                  <span>
                    <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                  </span>
                </Popconfirm>
              </Tooltip>
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("EmployeesProfit")}>
        <Fade>
          <div className="table-top">
            <Form
              onFinish={this.onFinish}
              // layout='vertical'
              className='table-filter-form'
              initialValues={{
                EndDate: moment().add(30, "days"),
                StartDate: moment().subtract(30, "days"),
              }}
            >
              <div className="main-table-filter-elements">
                <Form.Item
                  name={t("Filter Type")}
                  label={t("Filter Type")}>
                  <Select
                    style={{ width: 180 }}
                    placeholder={t("Filter Type")}
                    onChange={this.filterTypeHandler}>
                    <Option value="ID">{t('id')}</Option>
                    <Option value="PersonnelNumber">{t('PersonnelNumber')}</Option>
                    <Option value="Search">{t('FullName')}</Option>
                    <Option value="Search">{t('DprName')}</Option>
                    <Option value="Search">{t('PosName')}</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Search"
                  name="Search">
                  <Input.Search
                    className="table-search"
                    placeholder={t("search")}
                    enterButton
                    onSearch={this.search}
                  />
                </Form.Item>
                <Form.Item
                  name="StartDate"
                  label="StartDate">
                  <DatePicker format="DD.MM.YYYY" />
                </Form.Item>
                <Form.Item
                  name="EndDate"
                  label="EndDate">
                  <DatePicker format="DD.MM.YYYY" />
                </Form.Item>
              </div>
              <div className='form-bottom'>
                <Form.Item
                  name="SettleCode"
                  label="SettleCode">
                  <Select
                    placeholder={t("SettleCode")}
                    style={{ width: 270 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {this.state.orgSettleAcc.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="Status"
                  label="Status">
                  <Select
                    placeholder={t("Status")}
                    style={{ width: 200 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {this.state.statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="DprName"
                  label="DprName">
                  <Select
                    placeholder={t("DprName")}
                    style={{ width: 200 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    <Option value="">{t("DprName")}</Option>
                    {this.state.departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  <i className="feather icon-refresh-ccw" />
                </Button>
                <Link to={`${this.props.match.path}/add`}>
                  <Button type="primary">
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
            columns={columns}
            bordered
            dataSource={data}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
            rowClassName="table-row"
            className="main-table"
            scroll={{
              x: "max-content",
              y: '50vh'
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

export default withTranslation()(EmployeesProfit);
