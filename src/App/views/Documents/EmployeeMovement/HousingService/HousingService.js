import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Popconfirm } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import HousingServiceServices from "../../../../../services/Documents/EmployeeMovement/HousingService/HousingService.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
import { Notification } from '../../../../../helpers/notifications';

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class HousingService extends Component {
  filterForm = React.createRef();
  state = {
    data: [],
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
      this.setState({ orgSettleAcc: orgSettleAcc.data, statusList: stsList.data })
    } catch (err) {
      // console.log(err);
      Notification('err', err);
    }
  }

  componentDidMount() {
    this.fetchData();
    const { pagination } = this.state;
    this.fetch({ pagination }, {});
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

    if (filterFormValues.EndDate === null) {
      date.EndDate = '';
    }
    if (filterFormValues.StartDate === null) {
      date.StartDate = '';
    }

    HousingServiceServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
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
        Notification('err', err);
        // window.alert(err);
      });
  };

  search = (value) => {
    const filterValues = this.filterForm.current.getFieldsValue();
    this.setState({ loading: true });
    this.fetch({ pagination: defaultPagination }, filterValues);
  };

  deleteRowHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    HousingServiceServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => Notification('err', err));
  };

  acceptHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    let data = {};
    data.DocumentID = id;
    console.log(data);
    HousingServiceServices.Accept(data)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('accepted'));
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('err', err);
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    let data = {};
    data.DocumentID = id;
    HousingServiceServices.NotAccept(data)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('noAccepted'));
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('err', err);
        this.setState({ loading: false });
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

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        sorter: true,
      },
      {
        title: t("number"),
        dataIndex: "Number",
        key: "Number",
        sorter: true,
        width: 100
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("Month"),
        dataIndex: "Month",
        key: "Month",
        sorter: true,
      },
      {
        title: t("Status"),
        dataIndex: "Status",
        key: "Status",
        sorter: true,
      },
      {
        title: t("Sum"),
        dataIndex: "typName",
        key: "typName",
        sorter: true,
        width: 120
      },
      {
        title: t("SettleCode"),
        dataIndex: "SettleCode",
        key: "SettleCode",
        sorter: true,
        width: 150
      },
      {
        title: t("OrgFullName"),
        dataIndex: "OrgFullName",
        key: "OrgFullName",
        sorter: true,
        width: 150
      },
      {
        title: t("inn"),
        dataIndex: "INN",
        key: "INN",
        sorter: true,
        width: 100
      },
      {
        title: t("OblastName"),
        dataIndex: "OblastName",
        key: "OblastName",
        sorter: true,
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
      },
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        width: 100,
        render: (record) => {
          return (
            <Space size="middle">
              <Popconfirm
                title="Sure to send?"
                onConfirm={() => this.acceptHandler(record.ID)}
                okText={t("yes")}
                cancelText={t("cancel")}
              >
                <span>
                  <i className="far fa-check-circle action-icon" />
                </span>
              </Popconfirm>
              <Popconfirm
                title={t('decline')}
                onConfirm={() => this.declineHandler(record.ID)}
                okText={t("yes")}
                cancelText={t("cancel")}
              >
                <span>
                  <i className="far fa-times-circle action-icon" />
                </span>
              </Popconfirm>
              {/* <Link
                to={`${this.props.match.path}/edit/${record.ID}`}
              >
                <i
                  className='feather icon-edit action-icon'
                  aria-hidden="true"
                />
              </Link> */}
              <Popconfirm
                title={t('delete')}
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
      <Card title={t("HousingService")}>
        <Fade>
          <Form
            layout='vertical'
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
                label={t("Filter Type")}>
                <Select
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                  <Option value="ID">{t('id')}</Option>
                  <Option value="Number">{t('number')}</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t("search")}
                name="Search">
                <Input.Search
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
                name="SettleCode"
                label={t("SettleCode")}>
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

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <i className="feather icon-refresh-ccw" />
                </Button>
              </Form.Item>

              <Form.Item>
                <Link to={`${this.props.match.path}/add`}>
                  <Button type="primary">
                    {t("add-new")}&nbsp;
                    <i className="fa fa-plus" aria-hidden="true" />
                  </Button>
                </Link>
              </Form.Item>

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
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            scroll={{
              x: "max-content",
              y: '50vh'
            }}
            onRow={(record) => {
              return {
                // onDoubleClick: () => {
                //   this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
                // },
              };
            }}
          />
        </Fade>
      </Card>
    );
  }
}

export default withTranslation()(HousingService);
