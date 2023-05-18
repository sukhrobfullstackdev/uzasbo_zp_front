import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Tag, Tooltip } from "antd";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import IndexationOfSalaryServices from "../../../../../services/Documents/Payroll/IndexationOfSalary/IndexationOfSalary.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class IndexationOfSalary extends Component {
  // FixingTransactionAdminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('FixingTransactionAdmin');
  filterForm = React.createRef();

  state = {
    data: [],
    departmentList: [],
    orgSettleAcc: [],
    statusList: [],
    filterData: {},
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
    this.fetch({ pagination }, {});
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
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
      filter[this.state.filterType] = filterFormValues.Search ? filterFormValues.Search : '';
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

    IndexationOfSalaryServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
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

  search = () => {
    const filterValues = this.filterForm.current.getFieldsValue();
    this.setState({ loading: true, filterData: filterValues });
    this.fetch({ pagination: defaultPagination }, filterValues);
  };

  deleteRowHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    IndexationOfSalaryServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        this.setState({ loading: true });
        Notification('error', err);
      });
  };

  onFinish = (values) => {
    this.setState({ loading: true, filterData: values });
    this.fetch({ pagination: defaultPagination }, values);
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };

  // End Filter functions

  acceptHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    IndexationOfSalaryServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('accepted'));
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err);
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    IndexationOfSalaryServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('notAccepted'));
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err);
        this.setState({ loading: false });
      });
  };

  onTableRow = (record) => {
    return {
      onDoubleClick: () => {
        this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
      }
    };
  }

  printRow = (id) => {
    this.setState({ loading: true });
    IndexationOfSalaryServices.printRow(id)
      .then(res => {
        if (res.status === 200) {
          this.setState({ loading: false });
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "StaffList.xlsx");
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch(err => {
        // console.log(err);
        this.setState({ loading: false });
        Notification("error", err);
      })
  }

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
        title: t("number"),
        dataIndex: "Number",
        key: "Number",
        width: 100,
        sorter: true,
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("DivName"),
        dataIndex: "DivName",
        key: "DivName",
        sorter: true,
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
        title: t("Comment"),
        dataIndex: "Comment",
        key: "Comment",
        sorter: true,
      },
      // JSON.parse(localStorage.getItem('userInfo')).Roles.includes('FixingTransactionAdmin') ?
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        width: 110,
        render: (record) => {
          if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('FixingTransactionAcceptByAdmin')) {
            return (
              <Tooltip title={t('Accept')}>
                <span onClick={() => this.acceptHandler(record.ID)}>
                  <i className="far fa-check-circle action-icon" />
                </span>
              </Tooltip>
            );
          }

        },
      }
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("IndexationOfSalary")}>
        <Fade>
          <Form
            layout="vertical"
            ref={this.filterForm}
            onFinish={this.onFinish}
            className='table-filter-form'
            initialValues={{
              EndDate: moment().add(30, "days"),
              StartDate: moment().subtract(30, "days"),
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
                  onChange={this.filterTypeHandler}>
                  <Option value="ID">{t('id')}</Option>
                  <Option value="Number">{t('number')}</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t("search")}
                name="Search"
              >
                <Input.Search
                  placeholder={t("search")}
                  enterButton
                  onSearch={this.search}
                />
              </Form.Item>

              <Form.Item
                name="StartDate"
                label={t("startDate")}
              >
                <DatePicker format="DD.MM.YYYY" className="datepicker" />
              </Form.Item>

              <Form.Item
                name="EndDate"
                label={t("endDate")}
              >
                <DatePicker format="DD.MM.YYYY" className="datepicker" />
              </Form.Item>

              <Form.Item
                name="Status"
                label={t("Status")}
              >
                <Select
                  allowClear
                  placeholder={t("Status")}
                  style={{ width: 200 }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                </Select>
              </Form.Item>

              <Form.Item
                name="DprName"
                label={t("DprName")}
              >
                <Select
                  allowClear
                  placeholder={t("DprName")}
                  style={{ width: 200 }}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <i className="feather icon-refresh-ccw" />
                </Button>
              </Form.Item>
              {/* <Link to={`${this.props.match.path}/add`}>
                  <Button type="primary">
                    {t("add-new")}&nbsp;
                    <i className="fa fa-plus" aria-hidden="true" />
                  </Button>
                </Link> */}
            </div>
          </Form>
        </Fade>
        <Fade>
          <Table
            bordered
            size="middle"
            columns={columns}
            dataSource={data}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
            rowClassName="table-row"
            className="main-table"
            showSorterTooltip={false}
            onRow={(record) => this.onTableRow(record)}
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

export default withTranslation()(IndexationOfSalary);
