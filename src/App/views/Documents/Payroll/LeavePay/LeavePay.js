import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Popconfirm, Tooltip, Tag } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import LeavePayServices from "../../../../../services/Documents/Payroll/LeavePay/LeavePay.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
import TableRightClick from "./TableRightClick";
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class LeavePay extends Component {
  filterForm = React.createRef();
  state = {
    data: [],
    departmentList: [],
    orgSettleAcc: [],
    statusList: [],
    psList: [],
    filterData: {},
    pagination: {
      current: 0,
      pageSize: 10,
    },
    loading: false,
    filterType: '',
    tablePopup: {
      visible: false,
      x: 0,
      y: 0
    },
  };

  fetchData = async () => {
    try {
      const orgSettleAcc = await HelperServices.getOrganizationsSettlementAccountList();
      const stsList = await HelperServices.getStatusList();
      const dpList = await HelperServices.getAllDepartmentList();
      const psList = await HelperServices.GetListOfPositionList();
      this.setState({ orgSettleAcc: orgSettleAcc.data, statusList: stsList.data, departmentList: dpList.data, psList: psList.data });
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

    LeavePayServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
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

  search = () => {
    const filterValues = this.filterForm.current.getFieldsValue();
    this.setState({ loading: true, filterData: filterValues });
    this.fetch({ pagination: defaultPagination }, filterValues);
  };

  deleteRowHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    LeavePayServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        Notification('error', err)
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
    LeavePayServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        // console.log(err)
        this.setState({ loading: false });
        Notification('error', err);
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    LeavePayServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        // console.log(err)
        this.setState({ loading: false });
        Notification('error', err);
      });
  };

  printRow = (id) => {
    LeavePayServices.printRow(id)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "employee.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err);
      })
  }

  onTableRow = (record) => {
    return {
      onDoubleClick: () => {
        this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
      },
      onContextMenu: event => {
        event.preventDefault()
        if (!this.state.tablePopup.visible) {
          const that = this
          document.addEventListener(`click`, function onClickOutside() {
            that.setState({ tablePopup: { visible: false } })
            document.removeEventListener(`click`, onClickOutside);
          });

          document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
            that.setState({ tablePopup: { visible: false } })
            document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
          })
        }
        this.setState({
          tablePopup: {
            record,
            visible: true,
            x: event.clientX,
            y: event.clientY
          }
        })
      }
    };
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
        width: 110
      },
      {
        title: t("FullName"),
        dataIndex: "FullName",
        key: "FullName",
        sorter: true,
      },
      {
        title: t("Status"),
        dataIndex: "Status",
        key: "Status",
        sorter: true,
        render: (_, record) => {
          if (record.StatusID === 2) {
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
        title: t("SubcName"),
        dataIndex: "SubcName",
        key: "SubcName",
        sorter: true,
        // width: 100
      },
      {
        title: t("Sum"),
        dataIndex: "Sum",
        align: 'right',
        key: "Sum",
        sorter: true,
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
      },
      {
        title: t("DivName"),
        dataIndex: "DivName",
        key: "DivName",
        sorter: true,
        width: 150
      },
      {
        title: t("DprName"),
        dataIndex: "DprName",
        key: "DprName",
        sorter: true,
      },
      {
        title: t("SettleCode"),
        dataIndex: "SettleCode",
        key: "SettleCode",
        sorter: true,
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
        align: "center",
        fixed: 'right',
        width: 100,
        render: (record) => {
          return (
            <Space size="middle">
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
                  title="Sure to delete?"
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
      <Card title={t("LeavePay")}>
        <Fade>
          <div className="table-top">
            <Form
              ref={this.filterForm}
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
                  name="filterType"
                  label={t("Filter Type")}>
                  <Select
                    allowClear
                    style={{ width: 180 }}
                    placeholder={t("Filter Type")}
                    onChange={this.filterTypeHandler}>
                    <Option value="ID">{t('id')}</Option>
                    <Option value="PersonnelNumber">{t('personnelNumber')}</Option>
                    <Option value="Search">{t('FullName')}</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={t("search")}
                  name="Search"
                >
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
                  name="SettleCode"
                  label={t("SettleCode")}>
                  <Select
                    showSearch
                    allowClear
                    placeholder={t("SettleCode")}
                    style={{ width: 270 }}
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
                    allowClear
                    showSearch
                    placeholder={t("Status")}
                    style={{ width: 200 }}
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
                    allowClear
                    showSearch
                    placeholder={t("DprName")}
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {this.state.departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="psList"
                  label={t("psList")}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("psList")}
                    style={{ width: 200 }}
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
            bordered
            rowClassName="table-row"
            className="main-table"
            showSorterTooltip={false}
            columns={columns}
            dataSource={data}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
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
        <TableRightClick
          {...this.state.tablePopup}
          deleteRow={this.deleteRowHandler}
          accept={this.acceptHandler}
          notAccept={this.declineHandler}
          parentPath={this.props.match.path}
          printRow={this.printRow}
        />
      </Card>
    );
  }
}

export default withTranslation()(LeavePay);
