import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Popconfirm, Tooltip, Tag } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { Notification } from "../../../../../helpers/notifications";
import PayrollandChargeServices from "../../../../../services/Documents/Payroll/PayrollandCharge/PayrollandCharge.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import SubCalculationKindServices from "../../../../../services/References/Organizational/SubCalculationKind/SubCalculationKind.services";
import Card from "../../../../components/MainCard";
import Popup from "./Popup";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class PayrollandCharge extends Component {
  filterForm = React.createRef();

  state = {
    data: [],
    departmentList: [],
    orgSettleAcc: [],
    statusList: [],
    SubCalculation: [],
    filterData: [],
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

  fetchData = async () => {
    try {
      const orgSettleAcc = await HelperServices.getOrganizationsSettlementAccountList();
      const stsList = await HelperServices.getStatusList();
      const SubCalculation = await SubCalculationKindServices.getAll();
      const dpList = await HelperServices.getAllDepartmentList();
      this.setState({ orgSettleAcc: orgSettleAcc.data, statusList: stsList.data, departmentList: dpList.data, SubCalculation: SubCalculation.data })
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
      StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(10, "year").format("DD.MM.YYYY"),
    };

    PayrollandChargeServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
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
    const { pagination, filterData } = this.state;
    PayrollandChargeServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination },filterData);
        }
      })
      .catch((err) => Notification('error', err));
  };
  acceptHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    PayrollandChargeServices.Accept(id)
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
    PayrollandChargeServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('notAccepted'));
          this.fetch({ pagination },  filterData);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err)
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
        width: '6%'
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
        width: '8%'
      },


      {
        title: t("SubcName"),
        dataIndex: "SubcName",
        key: "SubcName",
        sorter: true,
        width: '14%'
      },
      {
        title: t("DivName"),
        dataIndex: "DivName",
        key: "DivName",
        sorter: true,
        width: '10%'
      },
      {
        title: t("DprName"),
        dataIndex: "DprName",
        key: "DprName",
        sorter: true,
        width: '10%'
      },
      {
        title: t("Status"),
        dataIndex: "Status",
        key: "Status",
        sorter: true,
        width: '10%',
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
        title: t("TotalSum"),
        dataIndex: "TotalSum",
        key: "TotalSum",
        sorter: true,
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        width: '10%'
      },
      {
        title: t("SettleCode"),
        dataIndex: "SettleCode",
        key: "SettleCode",
        sorter: true,
        width: '15%'
      },
      
      {

        title: t("Comment"),
        dataIndex: "Comment",
        key: "Comment",
        sorter: true,
        width: '10%',
        ellipsis: true,
       render: (_, record, text) =>{
         if(record.Comment.length >= 100){
           text=( record.Comment.minLength+'.....');
           return <p>{text}</p>
         }else{
           return record.Comment
         }
       }
      },

      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
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
      <Card title={t("PayrollandCharge")}>
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
                    placeholder={t("filterType")}
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
                    style={{ width: 270 }}
                    showSearch
                    allowClear
                    placeholder={t("SettleCode")}
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
                    style={{ width: 200 }}
                    showSearch
                    allowClear
                    placeholder={t("Status")}
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
                    style={{ width: 200 }}
                    showSearch
                    allowClear
                    placeholder={t("DprName")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {this.state.departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="SubCalculation"
                  label={t("SubcName")}>
                  <Select
                    placeholder={t("SubcName")}
                    style={{ width: 200 }}
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    <Option value="">{t("SubcName")}</Option>
                    {this.state.SubCalculation.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
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
            size="middle"
            rowClassName="table-row"
            className="main-table"
            columns={columns}
            dataSource={data}
            showSorterTooltip={false}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
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
          notAcceptRow={this.declineHandler} />
      </Card>
    );
  }
}

export default withTranslation()(PayrollandCharge);
