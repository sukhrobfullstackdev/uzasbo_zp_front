import React, { Component } from "react";
import { Table, Input, Form, Button, Select, Space, Popconfirm, Tag, Tooltip } from "antd";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import ClassTitleSendServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitleSend/ClassTitleSend.services";
// import HelperServices from "../../../../../../services/Helper/helper.services";
import ClassTitleServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitle.services";
import Card from "../../../../../components/MainCard";
import classes from "./ClassTitle.module.css";
import { Notification } from "../../../../../../helpers/notifications";
import ReceivedCancelModal from './ReceivedCancelModal.js';

// import ProtokolModal from "./ProtokolModal";

const { Option } = Select;

class ClassTitleSend extends Component {
  state = {
    data: [],
    filterForm: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    modal1visible: false,
    loading: false,
    filterType: '',
    print: false,
    tablePopup: {
      visible: false,
      x: 0,
      y: 0
    },
  };

  fetchData = async () => {
    try {
    } catch (err) {
      alert(err);
      console.log(err);

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
      EndDate: filterFormValues.EndDate ? filterFormValues.EndDate.format("DD.MM.YYYY") : moment().format("DD.MM.YYYY"),
      StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(10, "year").format("DD.MM.YYYY"),
    };

    ClassTitleSendServices.getSendList(pageNumber, pageLimit, sortColumn, orderType, search, date, filter, filterFormValues)
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
        window.alert(err);
      });
  };

  search = (value) => {
    this.setState({ loading: true });
    const { pagination } = this.state;
    this.fetch({ pagination }, value, {});
  };

  onFinish = (filterFormValues) => {
    this.setState({ loading: true, filterForm: filterFormValues });
    const { pagination } = this.state;
    this.fetch({ pagination }, null, filterFormValues);
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };
  
  ReceivedCancelModal = (record) => {
    this.setState({
      modal1visible: true,
      record
    });
  };

  handleRecievedCancel = () => {
    this.setState({ modal1visible: false });
  };

  acceptHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterForm } = this.state;
    ClassTitleServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, null, filterForm);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification("error", err);
        this.setState({ loading: false });
      });
  };

  printById = (id) => {
    this.setState({ loading: true });
    ClassTitleServices.printById(id)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "TariffList.xlsx");
        document.body.appendChild(link);
        link.click();
        this.setState({ loading: false });
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err)
        this.setState({ loading: false });
      })
      
  }

  printByYear = (record) => {
    this.setState({ loading: true });
    ClassTitleSendServices.printForm(record.StartYear)
      .then(response => {
        this.setState({ loading: false });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "TariffListYear.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => {
        // console.log(err);
        this.setState({ loading: false });
        Notification("error", err);
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
        // render: (_, record) => {
        //   if (record.StatusID === 2) {
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
      },
      {
        title: t("StartYear"),
        dataIndex: "StartYear",
        key: "StartYear",
        sorter: true,
        width: 100,
      },
      {
        title: t("EndYear"),
        dataIndex: "EndYear",
        key: "EndYear",
        sorter: true,
        width: 100,
      },
      {
        title: t("Organization"),
        dataIndex: "Organization",
        key: "Organization",
        sorter: true,
      },
      {
        title: t("BLHGType"),
        dataIndex: "BLHGType",
        key: "BLHGType",
        sorter: true,
      },
      {
        title: t("SpecializedSubjects"),
        dataIndex: "SpecializedSubjects",
        key: "SpecializedSubjects",
        sorter: true,
        width: 180,
      },
      {
        title: t("Tip"),
        dataIndex: "Tip",
        key: "Tip",
        sorter: true,
      },
      {
        title: t("Status"),
        dataIndex: "Status",
        key: "Status",
        sorter: true,
        width: 100,
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
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        width: 80,
        render: (record) => {
          return (
            <Space size="middle">
              <Tooltip title={t("printById")}>
              <span onClick={() => this.printById(record.ID)}>
                <i
                  className='feather icon-printer action-icon'
                  aria-hidden="true"
                />
              </span>
              </Tooltip>

              <Tooltip title={t("printByYear")}>
              <span onClick={() => this.printByYear(record)}>
                <i
                  className='feather icon-printer action-icon'
                  aria-hidden="true"
                />
              </span>
              </Tooltip>

              <Popconfirm
                title="Sure to send?"
                onConfirm={() => this.acceptHandler(record.ID)}
              >
                <span>
                  <i className="far fa-check-circle action-icon" />
                </span>
              </Popconfirm>

              <Tooltip title={t('Cancel')}>
                <span
                  className={classes.ModalOpener}
                  onClick={() => this.ReceivedCancelModal(record.ID)}
                >
                  <i className="far fa-times-circle action-icon" />
                </span>
              </Tooltip>
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading, modal1visible, record } = this.state;

    return (
      <Card title={t("ClassTitleSend")}>
        <Fade>
          <div className="main-table-filter-elements">
            <Form className={classes.FilterWrapper} onFinish={this.onFinish}>
              <Form.Item>
                <Select
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                  <Option>{t("Filter Type")}</Option>
                  <Option value="ID">{t("id")}</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Input.Search
                  className="table-search"
                  placeholder={t("search")}
                  enterButton
                  onSearch={this.search}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                <i className="feather icon-refresh-ccw" />
              </Button>
            </Form>

            <ReceivedCancelModal
              visible={modal1visible}
              id={record}
              onCancel={this.handleRecievedCancel}
            />

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
            onRow={(record) => this.onTableRow(record)}
            rowKey={(record) => record.ID}
            showSorterTooltip={false}
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
                // onContextMenu: event => {
                //   event.preventDefault()
                //   if (!this.state.popup.visible) {
                //     const that = this
                //     document.addEventListener(`click`, function onClickOutside() {
                //       that.setState({ popup: { visible: false } })
                //       document.removeEventListener(`click`, onClickOutside);
                //     });

                //     document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
                //       that.setState({ popup: { visible: false } })
                //       document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
                //     })
                //   }
                  // this.setState({
                  //   popup: {
                  //     record,
                  //     visible: true,
                  //     x: event.clientX,
                  //     y: event.clientY
                  //   }
                  // })
                // }
              };
            }}
          />
        </Fade>
        {/* <CSSTransition
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <ProtocolModal
            visible={protocolModalVisible}
            id={rowId}
            tableId={rowTableId}
            onCancel={this.closeProtocolModalHandler}
          />
        </CSSTransition> */}
        {/* <TableRightClick
          {...this.state.tablePopup}
          parentPath={this.props.match.path}
          openProtocolModal={this.openProtocolModalHandler}
          printRow={this.printRow}
          printForm={this.printForm}
          sendRow={this.showAcceptModal}
          accept={this.acceptHandler}
          notAccept={this.declineHandler}
          deleteRow={this.deleteRowHandler}
        /> */}
      </Card>
    );
  }
}

export default withTranslation()(ClassTitleSend);