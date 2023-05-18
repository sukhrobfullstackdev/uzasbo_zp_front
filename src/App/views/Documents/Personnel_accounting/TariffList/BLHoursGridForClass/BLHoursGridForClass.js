import React, { Component } from "react";
import { Table, Input, Form, Button, Select, Space, Popconfirm, Tooltip , Tag} from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import BLHoursGridForClassServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/BLHoursGridForClass/BLHoursGridForClass.services";
import HelperServices from "../../../../../../services/Helper/helper.services";
import Card from "../../../../../components/MainCard";
import { Notification } from "../../../../../../helpers/notifications";
// import TableRightClick from "./TableRightClick";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class BLHoursGridForClass extends Component {
  state = {
    data: [],
    ClassNumberList: [],
    ClassLangNameList: [],
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
      const ClassLangNameLs = await HelperServices.getClassLanguageList();
      const stsList = await HelperServices.getStatusList();
      const ClassNumberList = await HelperServices.getClassNumberList();
      this.setState({ ClassLangNameList: ClassLangNameLs.data, statusList: stsList.data, ClassNumberList: ClassNumberList.data })
    } catch (err) {
      alert(err);
      console.log(err);
    }
  }

  componentDidMount() {
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

  fetch = (params = {},  filterFormValues) => {
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

    BLHoursGridForClassServices.getList(pageNumber, pageLimit, sortColumn, orderType,  date, filter, filterFormValues)
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

  search = (value) => {
    const filterValues = this.filterForm.current.getFieldsValue();
    this.setState({ loading: true });
    this.fetch({ pagination: defaultPagination }, filterValues);
  };

  deleteRowHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    BLHoursGridForClassServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination },  filterData);
        }
      })
      .catch((err) => Notification('error', err));
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
    BLHoursGridForClassServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, null, filterData);
        }
      })
      .catch((err) => {
        console.log(err)
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    BLHoursGridForClassServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, null, filterData);
        }
      })
      .catch((err) => {
        console.log(err)
        this.setState({ loading: false });
      });
  };


  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        width:80,
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
        width: 100
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("StartYear"),
        dataIndex: "StartYear",
        key: "StartYear",
        sorter: true,
        width: 100
      },
      {
        title: t("EndYear"),
        dataIndex: "EndYear",
        key: "EndYear",
        sorter: true,
        width: 100
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
        title: t("Comment"),
        dataIndex: "Comment",
        key: "Comment",
        sorter: true,
      },
      {
        title: t("ClassLangName"),
        dataIndex: "ClassLangName",
        key: "ClassLangName",
        sorter: true,
        width: 150
      },
      {
        title: t("IsSpecialized"),
        dataIndex: "IsSpecialized",
        key: "IsSpecialized",
        sorter: true,
        width: 150
      },
      {
        title: t("BLHGType"),
        dataIndex: "BLHGType",
        key: "BLHGType",
        sorter: true,

      },
      {
        title: t("ClassName"),
        dataIndex: "ClassName",
        key: "ClassName",
        sorter: true,
        width: 150
      },
      {
        title: t("AttachedClassName"),
        dataIndex: "AttachedClassName",
        key: "AttachedClassName",
        sorter: true,
        width: 180
      },
      
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        render: (record) => {
          return (
            <Space size="middle">
              
              <Popconfirm
                
                onClick={() => this.acceptHandler(record.ID)}
              >
                <Tooltip title={t("Accept")}>
                <span>
                  <i className="far fa-check-circle action-icon" />
                </span>
                </Tooltip>
              </Popconfirm>
              <Popconfirm
                onClick={() => this.declineHandler(record.ID)}
              >
                <Tooltip title={t("NotAccept")}>
                <span>
                  <i className="far fa-times-circle action-icon" />
                </span>
                </Tooltip>
              </Popconfirm>
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
                title={t('delete')}
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
      <Card title={t("BLHoursGridForClass")}>
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
                    {/* <Option value="Number">{t('number')}</Option> */}
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
                  name="Number"
                  label={t("number")}>
                  <Select
                    allowClear
                    placeholder={t("number")}
                    style={{ width: 250 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>

                    {this.state.ClassNumberList.map(item => <Option key={item.NameUzb} value={item.NameUzb}>{item.NameUzb}</Option>)}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="ClassLangName"
                  label={t("ClassLangName")}>
                  <Select
                    allowClear
                    placeholder={t("ClassLangName")}
                    style={{ width: 270 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    
                    {this.state.ClassLangNameList.map(item => <Option key={item.Name} value={item.Name}>{item.Name}</Option>)}
                  </Select>
                </Form.Item>

                <Button type="primary" htmlType="submit">
                  <i className="feather icon-refresh-ccw" />
                </Button>
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
            rowClassName="table-row"
            className="main-table"
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
        {/* <TableRightClick
          {...this.state.popup}
          deleteRow={this.deleteRowHandler}
          accept={this.acceptHandler}
          notAccept={this.declineHandler}
          parentPath={this.props.match.path}
        /> */}
      </Card>
    );
  }
}

export default withTranslation()(BLHoursGridForClass);
