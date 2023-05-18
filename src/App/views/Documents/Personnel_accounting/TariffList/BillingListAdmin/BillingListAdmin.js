import React, { Component } from "react";
import { Table, Input, Form, Tooltip, Button, Select, Space, Popconfirm, Tag } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import BillingListAdminServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/BillingListAdmin/BillingListAdmin.services";
import Card from "../../../../../components/MainCard";
import classes from "./BillingList.module.css";
import { Notification } from "../../../../../../helpers/notifications";
import Popup from "./Popup";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class BillingListAdmin extends Component {
  filterForm = React.createRef();
  state = {
    data: [],
    filterData: {},
    popup: {
      visible: false,
      x: 0,
      y: 0
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    filterType: ''
  };

  // fetchData = async () => {
  //   try {

  //   } catch (err) {
  //     alert(err);
  //     console.log(err);
  //   }
  // }

  componentDidMount() {
    // this.fetchData();
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

    BillingListAdminServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
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
    this.setState({ loading: true });
    this.fetch({ pagination: defaultPagination }, filterValues);
  };

  deleteRowHandler = (id) => {
    this.setState({ loading: true });
    BillingListAdminServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => Notification('error', err));
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };

  // End Filter functions

  acceptHandler = (id) => {
    this.setState({ loading: true });
    BillingListAdminServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
          Notification('success', this.props.t('accepted'));
        }
      })
      .catch((err) => {
        Notification('error', err)
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    BillingListAdminServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
          Notification('success', this.props.t('notAccepted'))
        }
      })
      .catch((err) => {
        Notification('error', err);
        this.setState({ loading: false });
      });
  };

  sendHandler = (id) => {
    this.setState({ loading: true });
    BillingListAdminServices.Send(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        Notification('error', err);
        this.setState({ loading: false });
      });
  };

  ProtocolHandler = (id) => {
    this.setState({ loading: true });
    BillingListAdminServices.Protocol(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        Notification('error', err)
        this.setState({ loading: false });
      });
  };

  printHandler = (id) => {
    this.setState({ loading: true });
    BillingListAdminServices.printById(id)
      .then(res => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "billingList.xlsx");
          document.body.appendChild(link);
          link.click();

          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
        }
      })
      .catch(err => {
        Notification('error', err);
        this.setState({ loading: false });
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
        width: 120
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
        width: 150
      },
      {
        title: t("Number"),
        dataIndex: "Number",
        key: "Number",
        sorter: true,
        width: 150
      },
      {
        title: t("Year"),
        dataIndex: "Year",
        key: "Year",
        sorter: true,
        width: 150
      },
      {
        title: t("Status"),
        dataIndex: "Status",
        key: "Status",
        sorter: true,
        width: 150,
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
        title: t("TotalSum"),
        dataIndex: "TotalSum",
        key: "TotalSum",
        sorter: true,
        width: 150,
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
      },
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        width: 120,
        render: (record) => {
          return (
            <Space size="middle">
              <Tooltip title={t("Send")}>
                <span onClick={() => this.sendHandler(record.ID)}>
                  <i className="far fa-share-square action-icon"></i>
                </span>
              </Tooltip>
              <Tooltip title={t("Print")}>
                <span onClick={() => this.printHandler(record.ID)}>
                  <i className='feather icon-printer action-icon' aria-hidden="true" />
                </span>
              </Tooltip>
              <Tooltip title={t("Protocol")}>
                <span onClick={() => this.protocolHandler(record.ID)}>
                  <i className="far fa-comment action-icon" />
                </span>
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
              <Tooltip title={t("Edit")}>
                <Link to={`${this.props.match.path}/edit/${record.ID}`}>
                  <i className='feather icon-edit action-icon' aria-hidden="true" />
                </Link>
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
      }
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("BillingListAdmin")}>
        <Fade>
          <div className="table-top department-card">
            <Form
              ref={this.filterForm}
              className={classes.FilterWrapper}
            >
              <Form.Item
                name="FilterType"
                label={t("filterType")}
              >
                <Select
                  allowClear
                  showSearch
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                  <Option value="ID">{t("id")}</Option>
                  <Option value="Year">{t("year")}</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={t("search")}
                name="Search"
              >
                <Input.Search
                  enterButton
                  className="table-search"
                  placeholder={t("search")}
                  onSearch={this.search}
                />
              </Form.Item>
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
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
                },
                onContextMenu: event => {
                  event.preventDefault()
                  if (!this.state.popup.visible) {
                    const that = this
                    document.addEventListener(`click`, function onClickOutside() {
                      that.setState({ popup: { visible: false } })
                      document.removeEventListener(`click`, onClickOutside);
                    });

                    document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
                      that.setState({ popup: { visible: false } })
                      document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
                    })
                  }
                  this.setState({
                    popup: {
                      record,
                      visible: true,
                      x: event.clientX,
                      y: event.clientY
                    }
                  })
                }
              };
            }}
          />
        </Fade>
        <Popup
          {...this.state.popup}
          deleteRow={this.deleteRowHandler}
          acceptRow={this.acceptHandler}
          notAcceptRow={this.declineHandler}
        />
      </Card>
    );
  }
}

export default withTranslation()(BillingListAdmin);
