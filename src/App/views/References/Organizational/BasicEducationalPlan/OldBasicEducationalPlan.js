import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Modal, Tag, Tooltip, InputNumber, Spin } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import BasicEducationalPlanServices from "../../../../../services/References/Organizational/BasicEducationalPlan/BasicEducationalPlan.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
import TableRightClick from "./TableRightClick";
import '../../../../../helpers/prototypeFunctions';
import { Notification } from "../../../../../helpers/notifications";

const { Option } = Select;
const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class BasicEducationalPlan extends Component {
  state = {
    data: [],
    BLHGType: [],
    statusList: [],
    filterData: {},
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
    mainLoader: false,
    filterType: '',
    id: null,
    subName: '',
  };

  fetchData = async () => {
    try {
      const BLHGType = await HelperServices.getBLHGTypeList();
      this.setState({ BLHGType: BLHGType.data })
    } catch (err) {
      Notification('error', err);
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

    if (filterFormValues.EndDate === null) {
      date.EndDate = '';
    }
    if (filterFormValues.StartDate === null) {
      date.StartDate = '';
    }

    BasicEducationalPlanServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
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
    BasicEducationalPlanServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => Notification('error', err));
  };

  acceptHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    let data = {};
    data.DocumentID = id;
    BasicEducationalPlanServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('accepted'));
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
        Notification('error', err)
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterData } = this.state;
    let data = {};
    data.DocumentID = id;
    BasicEducationalPlanServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('notAccepted'));
          this.fetch({ pagination }, filterData);
        }
      })
      .catch((err) => {
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
        // render: (_, record) => {
        //   if (record.StatusID === 2 || record.StatusID === 11) {
        //     return record.ID;
        //   } else {
        //     return <span style={{ color: 'red' }}>{record.ID}</span>
        //   }
        // }
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
        // width: 160
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
        // width: 120
      },
      {
        title: t("TotalHours"),
        dataIndex: "TotalHours",
        key: "TotalHours",
        sorter: true,
        // width: 120,
        // render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
      },
      {
        title: t("BLHGType"),
        dataIndex: "BLHGType",
        key: "BLHGType",
        sorter: true,
        width: 150,
        render: record => <div className="ellipsis-2">{record}</div>
      },
      {
        title: t("TeachingAtHome"),
        dataIndex: "TeachingAtHome",
        key: "TeachingAtHome",
        sorter: true,
      },
      {
        title: t("Comment"),
        dataIndex: "Comment",
        key: "Comment",
        sorter: true,
        width:150,
        render: record => <div className="ellipsis-2">{record}</div>

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
      // {
      //   title: t("actions"),
      //   key: "action",
      //   align: "center",
      //   fixed: 'right',
      //   width: 80,
      //   render: (record) => {
      //     return (
      //       <Space size="middle">
      //         {/* {this.adminViewRole &&
      //           <Tooltip title={t('changeDate')}>
      //             <span onClick={() => this.openChangeDateModalHandler(record.ID)}>
      //               <i className="far fa-clock action-icon"></i>
      //             </span>
      //           </Tooltip>
      //         } */}
      //         {this.docSendRole &&
      //           <Tooltip title={t("send")}>
      //             <span onClick={() => this.showAcceptModal(record.ID, record.PaymentOrderID)}>
      //               <i className="far fa-paper-plane action-icon" />
      //             </span>
      //           </Tooltip>
      //         }
      //         {/* {this.docSendRole1 &&
      //           <Tooltip title={t("protocol")}>
      //             <span onClick={() => this.openProtocolModalHandler(record.ID)}>
      //               <i className="far fa-comment action-icon" />
      //             </span>
      //           </Tooltip>
      //         } */}
      //         {this.updateDocFioAndNumRole &&
      //           <Tooltip title={t('changeFioAndNumber')}>
      //             <span onClick={() => this.changeFioAndNumber(record.ID)}>
      //               <i className="feather icon-repeat action-icon" />
      //             </span>
      //           </Tooltip>
      //         }

      //         {/* <Tooltip title={t('accept')}>
      //           <span onClick={() => this.acceptHandler(record.ID)} >
      //             <i className="far fa-check-circle action-icon" />
      //           </span>
      //         </Tooltip> */}

      //         {/* <Popconfirm
      //           title={t('decline')}
      //           onConfirm={() => this.declineHandler(record.ID)}
      //           okText={t("yes")}
      //           cancelText={t("cancel")}
      //         >
      //           <Tooltip title={t('notAccept')}>
      //             <span>
      //               <i className="far fa-times-circle action-icon" />
      //             </span>
      //           </Tooltip>
      //         </Popconfirm> */}

      //         {/* <Tooltip title={t('delete')}>
      //           <Popconfirm
      //             title="Sure to delete?"
      //             onConfirm={() => this.deleteRowHandler(record.ID)}
      //             okText={t("yes")}
      //             cancelText={t("cancel")}
      //           >
      //             <span>
      //               <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
      //             </span>
      //           </Popconfirm>
      //         </Tooltip> */}
      //       </Space>
      //     );
      //   },
      // },
    ];

    const { data, pagination, loading} = this.state;

    return (
      <Spin size='large' spinning={this.state.mainLoader}>
        <Card title={t("BasicEducationalPlan")}>
          <Fade>
            <Form
              ref={this.filterForm}
              onFinish={this.onFinish}
              layout='vertical'
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
                    style={{ width: 180 }}
                    placeholder={t("Filter Type")}
                    onChange={this.filterTypeHandler}>
                    <Option value="ID">{t('id')}</Option>
                    <Option value="Search">{t('Name')}</Option>
                  </Select>
                </Form.Item>

                {this.adminViewRole &&
                  <Form.Item
                    label={t("orgId")}
                    name="OrgID"
                  >
                    <InputNumber placeholder={t("orgId")} />
                  </Form.Item>
                }

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
                  name="BLHGTypeID"
                  label={t("BLHGTypeID")}
                >
                  <Select
                    placeholder={t("BLHGTypeID")}
                    style={{ width: 270 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {this.state.BLHGType.map(item => <Option key={item.ID} value={item.ID}>{item.Name}</Option>)}
                  </Select>
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
          </Fade>
          <Fade>
            <Table
              bordered
              size="middle"
              columns={columns}
              dataSource={data}
              showSorterTooltip={false}
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
          <TableRightClick
            {...this.state.popup}
            deleteRow={this.deleteRowHandler}
            accept={this.acceptHandler}
            notAccept={this.declineHandler}
            parentPath={this.props.match.path}
            showAcceptModal={this.showAcceptModal}
          />
        </Card>
      </Spin>
    );
  }
}

export default withTranslation()(BasicEducationalPlan);
