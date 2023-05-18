import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Tooltip,Tag } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import FixingTransactionServices from "../../../../../services/Documents/FixingFinalTransactions/FixingTransaction/FixingTransaction.services";
// import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
// import classes from "./SalaryCalculation.module.css";
import TableContextMenu from "./TableContextMenu";
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class FixingTransaction extends Component {
  filterForm = React.createRef();

  state = {
    data: [],
    filterData: {},
    loading: false,
    filterType: '',
    pagination: {
      current: 1,
      pageSize: 10,
    },
    tableContextMenu: {
      visible: false,
      x: 0,
      y: 0
    },
  };

  componentDidMount() {
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
      filter[this.state.filterType] = filterFormValues.Search ? filterFormValues.Search.trim() : '';
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

    FixingTransactionServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter)
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
        this.setState({ loading: false });
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
    FixingTransactionServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
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
    FixingTransactionServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          Notification('success', this.props.t('accepted'));
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        Notification('error', err);
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    FixingTransactionServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          const { pagination, filterData } = this.state;
          Notification('success', this.props.t('notAccepted'));
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        Notification('error', err);
        this.setState({ loading: false });
      });
  };

  onTableRow = record => {
    return {
      onDoubleClick: () => {
        this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
      },
      onContextMenu: event => {
        event.preventDefault()
        if (!this.state.tableContextMenu.visible) {
          const that = this
          document.addEventListener(`click`, function onClickOutside() {
            that.setState({ tableContextMenu: { visible: false } })
            document.removeEventListener(`click`, onClickOutside);
          });

          document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
            that.setState({ tableContextMenu: { visible: false } })
            document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
          })
        }
        this.setState({
          tableContextMenu: {
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
          if (record.StatusID === 2 || record.StatusID === 8) {
            return record.ID;
          }
          return <span style={{ color: 'red' }}>{record.ID}</span>
        }
      },
      {
        title: t("number"),
        dataIndex: "Number",
        key: "Number",
        sorter: true,
        width: 110
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
        width: 100
      },
      {
        title: t("Sum"),
        dataIndex: "Sum",
        key: "Sum",
        sorter: true,
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
      },
      {
        title: t("drCode"),
        dataIndex: "DrCode",
        key: "DrCode",
        sorter: true,
        width: 100
      },
      {
        title: t("crCode"),
        dataIndex: "CrCode",
        key: "CrCode",
        sorter: true,
        width: 100
      },
      {
        title: t("Status"),
        dataIndex: "TreasStatus",
        key: "TreasStatus",
        sorter: true,
        render: (_, record) => {
          if (record.StatusID === 2 || record.StatusID === 9) {
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
        dataIndex: "FixingDetail",
        key: "FixingDetail",
        sorter: true,
        width: 150,
        render: record => <div className="ellipsis-2">{record}</div>
      },
      {
        title: t("subCountDb1Name"),
        dataIndex: "SubCountDb1Name",
        key: "SubCountDb1Name",
        sorter: true,
        width: 150
      },
      {
        title: t("subCountDb2Name"),
        dataIndex: "SubCountDb2Name",
        key: "SubCountDb2Name",
        sorter: true,
        width: 150
      },
      {
        title: t("subCountCr1Name"),
        dataIndex: "SubCountCr1Name",
        key: "SubCountDb1Name",
        sorter: true,
        width: 150
      },
      {
        title: t("subCountCr2Name"),
        dataIndex: "SubCountCr2Name",
        key: "SubCountDb2Name",
        sorter: true,
        width: 150
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
              {/* <Tooltip title={t('Accept')}>
                <span onClick={() => this.acceptHandler(record.ID)}>
                  <i className="far fa-check-circle action-icon" />
                </span>
              </Tooltip>
              <Tooltip title={t('NotAccept')}>
                <span onClick={() => this.declineHandler(record.ID)}>
                  <i className="far fa-times-circle action-icon" />
                </span>
              </Tooltip> */}
              <Tooltip title={t('Edit')}>
                <Link to={`${this.props.match.path}/edit/${record.ID}`}>
                  <i className='feather icon-edit action-icon' aria-hidden="true" />
                </Link>
              </Tooltip>
              {/* <Tooltip title={t('Delete')}>
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
              </Tooltip> */}
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("fixingTransactions")}>
        <Fade>
          <div className="table-top">
            <Form
              ref={this.filterForm}
              onFinish={this.onFinish}
              className='table-filter-form'
              layout='vertical'
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
                    onChange={this.filterTypeHandler}
                  >
                    <Option value="ID">{t('id')}</Option>
                    <Option value="Search">{t('Наименование')}</Option>
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
                  label={t("startDate")}>
                  <DatePicker format="DD.MM.YYYY" />
                </Form.Item>

                <Form.Item
                  name="EndDate"
                  label={t("endDate")}>
                  <DatePicker format="DD.MM.YYYY" />
                </Form.Item>

                <Button type="primary" htmlType="submit" className="main-table-filter-element">
                  <i className="feather icon-refresh-ccw" />
                </Button>

                <Button type="primary" className="main-table-filter-element">
                  <Link to={`${this.props.match.path}/add`}>
                    {t("add-new")}&nbsp;
                    <i className="fa fa-plus" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </Form>
          </div>
        </Fade>
        <Fade>
          <Table
            bordered
            size="middle"
            rowClassName="table-row"
            className="main-table"
            columns={columns}
            dataSource={data}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
            showSorterTooltip={false}
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            scroll={{
              x: "max-content",
              y: '50vh'
            }}
            onRow={(record) => this.onTableRow(record)}
          />
        </Fade>
        <TableContextMenu
          {...this.state.tableContextMenu}
          deleteRow={this.deleteRowHandler}
          accept={this.acceptHandler}
          notAccept={this.declineHandler}
          parentPath={this.props.match.path}
        />
      </Card>
    );
  }
}

export default withTranslation()(FixingTransaction);
