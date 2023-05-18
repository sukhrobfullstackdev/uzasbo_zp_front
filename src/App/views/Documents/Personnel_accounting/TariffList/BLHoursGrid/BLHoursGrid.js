import React, { Component } from "react";
import { Table, Form, Button, Space, Popconfirm, Tooltip, Tag, Select, Input } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import Popup from "./Popup";

import BLHoursGridServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/BLHoursGrid/BLHoursGrid.services";
import HelperServices from "../../../../../../services/Helper/helper.services";
import { Notification } from "../../.././../../../helpers/notifications";
import Card from "../../../../../components/MainCard";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class BLHoursGrid extends Component {
  filterForm = React.createRef();
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
    popup: {
      visible: false,
      x: 0,
      y: 0
    },
    loading: false,
    filterType: ''
  };

  // fetchData = async () => {
  //   try {
  //     const orgSettleAcc = await HelperServices.getOrganizationsSettlementAccountList();
  //     const stsList = await HelperServices.getStatusList();
  //     const dpList = await HelperServices.getAllDepartmentList();
  //     this.setState({ orgSettleAcc: orgSettleAcc.data, statusList: stsList.data, departmentList: dpList.data })
  //   } catch (err) {
  //     Notification('error', err);
  //     // console.log(err);
  //   }
  // }

  componentDidMount() {
   // this.fetchData();
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
      EndDate: filterFormValues.EndDate ? filterFormValues.EndDate.format("DD.MM.YYYY") : moment().format("DD.MM.YYYY"),
      StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(10, "year").format("DD.MM.YYYY"),
    };

    BLHoursGridServices.getList(pageNumber, pageLimit, sortColumn, orderType,  date, filter, filterFormValues)
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
        // console.log(err);
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
    const { pagination, filterData } = this.state;
    BLHoursGridServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination },  filterData);
        }
      })
      .catch((err) => Notification('error', err));
  };

  onFinish = (values) => {
    if (this.state.print) {
      values.ID = values.ID ? values.ID.trim() : "";
      values.Number = values.Number ? values.Number.trim() : "";
      values.Date = values.Date ? values.Date.trim() : "";
      values.StartYear = values.StartYear ? values.StartYear.trim() : "";
      values.EndYear = values.EndYear ? values.EndYear.trim() : "";
      values.TotalHours = values.TotalHours ? values.TotalHours.trim() : "";
      values.Comment = values.Comment ? values.Comment.trim() : "";
      values[this.state.filterType] = values.Search ? values.Search.trim() : "";

      BLHoursGridServices.print(values).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "employee.xlsx");
        document.body.appendChild(link);
        link.click();
        this.setState({
          loading: false,
        });
      });
    } else {
      this.setState({ loading: true, filterData: values });
      this.fetch({ pagination: defaultPagination }, values);
    }

  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };

  acceptHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    let data = {};
    data.DocumentID = id;
    BLHoursGridServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('accepted'));
          this.fetch({ pagination },  filterData);
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
    let data = {};
    data.DocumentID = id;
    BLHoursGridServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('notAccepted'));
          this.fetch({ pagination },  filterData);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err);
        this.setState({ loading: false });
      });
  };

  printById = (id) => {
    BLHoursGridServices.printById(id)
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
        Notification('error', err)
      })
  }

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
        title: t("number"),
        dataIndex: "Number",
        key: "Number",
        sorter: true,
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
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
        // width: 100
      },
      {
        title: t("StartYear"),
        dataIndex: "StartYear",
        key: "StartYear",
        sorter: true,
        // width: 100
      },
      {
        title: t("EndYear"),
        dataIndex: "EndYear",
        key: "EndYear",
        sorter: true,
        // width: 100
      },
      
      {
        title: t("TotalHours"),
        dataIndex: "TotalHours",
        key: "TotalHours",
        sorter: true,
        // width: 100
      },
      {
        title: t("Comment"),
        dataIndex: "Comment",
        key: "Comment",
        sorter: true,
        // width: 100
      },
      
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        render: (record) => {
          return (
            <Space size="middle">

              <span onClick={() => this.printById(record.ID)}>
                <i
                  className='feather icon-printer action-icon'
                  aria-hidden="true"
                />
              </span>

              <Tooltip title={t("Accept")} onClick={() => this.acceptHandler(record.ID)}>
                <span>
                  <i className="far fa-check-circle action-icon" />

                </span>
              </Tooltip>

              <Tooltip title={t("NotAccept")} onClick={() => this.declineHandler(record.ID)}>
                <span>
                  <i className="far fa-times-circle action-icon" />
                </span>
              </Tooltip>

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
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.deleteRowHandler(record.ID)}
                okText={t("yes")}
                cancelText={t("cancel")}
              >
                <Tooltip title={t("Delete")}>
                  <span>
                    <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                  </span>
                </Tooltip>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("BLHoursGrid")}>
        <Fade>
          <div className="table-top">
            <Form
              onFinish={this.onFinish}
              // layout='vertical'
              className='table-filter-form'
              initialValues={{
                EndDate: moment(),
                StartDate: moment().subtract(10, "year"),
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
                    <Option value="Number">{t('number')}</Option>
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
                {/* <Button type="primary" htmlType="submit">
                  <i className="feather icon-refresh-ccw" />
                </Button> */}
                <Link to={`${this.props.match.path}/add`}>
                  <Button type="primary" >
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
            // rowClassName="table-row"
            className="main-table"
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
            scroll={{
              x: "max-content",
               y: '50vh'
            }}
          />
        </Fade>
        <Popup
          {...this.state.popup}
          deleteRow={this.deleteRowHandler}
          acceptRow={this.acceptHandler}
          notAcceptRow={this.declineHandler} />
      </Card>
    );
  }
}

export default withTranslation()(BLHoursGrid);
