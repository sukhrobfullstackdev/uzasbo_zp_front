import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Popconfirm, Tag, Tooltip } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import RecalcOfLeaveServices from "../../../../../services/Documents/Payroll/RecalcOfLeave/RecalcOfLeave.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;

class RecalcOfLeave extends Component {

  state = {
    data: [],
    departmentList: [],
    orgSettleAcc: [],
    statusList: [],
    psList: [],
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
      const psList = await HelperServices.GetListOfPositionList();
      this.setState({ orgSettleAcc: orgSettleAcc.data, statusList: stsList.data, departmentList: dpList.data, psList: psList.data })
      console.log(psList.data)
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

    RecalcOfLeaveServices.getList(pageNumber, pageLimit, sortColumn, orderType, search, date, filter, filterFormValues)
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
    RecalcOfLeaveServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, null, filterForm);
        }
      })
      .catch((err) => console.log(err));
  };

  acceptHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    RecalcOfLeaveServices.Accept(id)
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
    RecalcOfLeaveServices.NotAccept(id)
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
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,

      },
      {
        title: t("BeginDate"),
        dataIndex: "BeginDate",
        key: "BeginDate",
        sorter: true,
        width: 110
      },
      {
        title: t("endDate"),
        dataIndex: "EndDate",
        key: "EndDate",
        sorter: true,
        width: 100
      },
      {
        title: t("personnelNumber"),
        dataIndex: "PersonnelNumber",
        key: "PersonnelNumber",
        sorter: true,
        width: 120
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
        title: t("FullName"),
        dataIndex: "FullName",
        key: "FullName",
        sorter: true,
      },

      {
        title: t("SubcName"),
        dataIndex: "SubcName",
        key: "SubcName",
        sorter: true,
        width: 130
      },
      {
        title: t("Sum"),
        dataIndex: "Sum",
        key: "Sum",
        sorter: true,
        width: 100
      },
      {
        title: t("DivName"),
        dataIndex: "DivName",
        key: "DivName",
        sorter: true,
        width: 130
      },
      {
        title: t("DepName"),
        dataIndex: "DepName",
        key: "DepName",
        sorter: true,
        width: 130
      },
      {
        title: t("TabName"),
        dataIndex: "TabName",
        key: "TabName",
        sorter: true,
        width: 130
      },

      {
        title: t("Comment"),
        dataIndex: "Comment",
        key: "Comment",
        sorter: true,
        width: 130
      },

      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        render: (record) => {
          return (
            <Space size="middle">
              <Link
                to={`${this.props.match.path}/edit/${record.ID}`}
              >
                <i
                  className='feather icon-edit action-icon'
                  aria-hidden="true"
                />
              </Link>
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
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.deleteRowHandler(record.ID)}
                okText={t("yes")}
                cancelText={t("cancel")}
              >
                <span>
                  <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                </span>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("RecalcOfLeave")}>
        <Fade>
          <div className="table-top">
            <Form
              onFinish={this.onFinish}
              // layout='vertical'
              className='table-filter-form'
              initialValues={{
                EndDate: moment(),
                StartDate: moment().subtract(30, "days"),
              }}
            >
              <div className="main-table-filter-elements">

                <Form.Item
                  name="filterType"
                  label={t("Filter Type")}>
                  <Select
                    style={{ width: 180 }}
                    placeholder={t("Filter Type")}
                    onChange={this.filterTypeHandler}>
                    <Option value="ID">{t('id')}</Option>
                    <Option value="PersonnelNumber">{t('PersonnelNumber')}</Option>
                    <Option value="Search">{t('FullName')}</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={t("search")}
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
                  label={t("startDate")}>
                  <DatePicker format="DD.MM.YYYY" />
                </Form.Item>

                <Form.Item
                  name="EndDate"
                  label={t("endDate")}>
                  <DatePicker format="DD.MM.YYYY" />
                </Form.Item>

                <Form.Item
                  name="Status"
                  label={t("Status")}>
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
                  label={t("DprName")}>
                  <Select
                    placeholder={t("DprName")}
                    style={{ width: 200 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {this.state.departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="psList"
                  label={t("psList")}>
                  <Select
                    placeholder={t("psList")}
                    style={{ width: 200 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {this.state.psList.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
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
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
            rowClassName="table-row"
            className="main-table"
            scroll={{
              x: "max-content",
              y: '50vh'
            }}
          />
        </Fade>
      </Card>
    );
  }
}

export default withTranslation()(RecalcOfLeave);
