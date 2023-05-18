import React, { Component } from "react";
import { Modal, Table,  Form, Tag, Select, Input } from "antd";
import { withTranslation } from "react-i18next";

import classes from "./PreferentialOrg.module.css";
import OrganizationServices from "../../../../../services/Documents/Admin/Organization/Organization.services";
import { Notification } from "../../../../../helpers/notifications";
const { Option } = Select;
class Organization extends Component {
  filterForm = React.createRef();
  state = {
    data: [],
    filterData: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    sortedInfo: null,
    filteredInfo: null,
    filterType: "",
  };

  componentDidMount() {
    const { pagination } = this.state;
    this.fetch({ pagination }, this.state.filterData);
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch(
      {
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
      },
      this.state.filterData
    );
  };

  fetch = (params = {}, values, searchCode) => { 
    values.ID = values.ID ? values.ID.trim() : "";
    values.INN = values.INN ? values.INN.trim() : "";

    if (searchCode) {
      values[this.state.filterType] = searchCode ? searchCode.trim() : "";
    } else {
      values[this.state.filterType] = values.Search ? values.Search.trim() : "";
    }
    values.DateOfBirth = values.DateOfBirth
      ? values.DateOfBirth.format("DD.MM.YYYY")
      : "";

    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder;

      OrganizationServices.getList(
      pageNumber,
      pageLimit,
      sortColumn,
      orderType,
      values
    )
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
        Notification('error', err)
        // window.alert(err);
      });
  };

  onFinish = (filterFormValues) => {
    this.setState({ loading: true });

    this.setState({ filterData: filterFormValues });
    const { pagination } = this.state;
    this.fetch({ pagination }, filterFormValues);
  };

  onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };


  setRowClassName = (record) => {
    return record.ID === this.state.rowId ? 'table-row clicked-row' : 'table-row';
  }
  search = (value) => {
   
    this.setState({ loading: true });
    const { pagination } = this.state;
    this.fetch({ pagination }, {}, value);
  
    
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };

  setRowClassName = (record) => {
    return record.ID === this.state.rowId ? 'table-row clicked-row' : 'table-row';
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
          title: t("OrgFullName"),
          dataIndex: "OrgFullName",
          key: "OrgFullName",
          sorter: true,
          width: 110,
          render: record => <div className="ellipsis-2">{record}</div>
      },
      {
          title: t("OrgINN"),
          dataIndex: "OrgINN",
          key: "OrgINN",
          sorter: true,
      },
      {
          title: t("OrgType"),
          dataIndex: "OrgType",
          key: "OrgType",
          sorter: true,
          width: 120
      },
      {
          title: t("RegName"),
          dataIndex: "RegName",
          key: "RegName",
          sorter: true,
          width: 120
      },
      {
          title: t("StateID"),
          dataIndex: "StateID",
          key: "StateID",
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
          title: t("OblName"),
          dataIndex: "OblName",
          key: "OblName",
          sorter: true,
          width: 100
      },
      {
          title: t("HeaderFromBalance"),
          dataIndex: "HeaderFromBalance",
          key: "HeaderFromBalance",
          sorter: true,
          render: record => <div className="ellipsis-2">{record}</div>
      },
  ];

    const { data, pagination, loading } = this.state;

    return (
      <Modal
        visible={this.props.visible}
        title={t("Organization")}
        okText={t("select")}
        cancelText={t("cancel")}
        onOk={this.props.onCancel}
        onCancel={this.props.onCancel}
        width={1300}
        onClick={(record) => {
          this.props.getOrganizationName(record.OrgFullName);
        }}
      >
        <div className="table-top">
          <Form
            ref={this.filterForm}
          onFinish={this.onFinish}
           className={classes.FilterForm}>
            <div className="main-table-filter-elements">
              <Form.Item name="filterType">
                <Select
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                 <Option value="ID">{t("id")}</Option>
                  <Option value="INN"> {t("INN")} </Option>
                </Select>
              </Form.Item>

              <Form.Item name="Search">
                <Input.Search
                  placeholder={t("search")}
                  enterButton
                  onSearch={this.search}
                />
              </Form.Item>
            </div>
          </Form>
        </div>

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
          // rowClassName="table-row modal-table-row"
          rowClassName={this.setRowClassName}
          showSorterTooltip={false}
          className="main-table"
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                this.props.getOrganizationName(record.OrgFullName, record.ID);
                this.props.onCancel();
              },
              // onClick: () => {
              //   this.props.getHeaderStaffListOrganizationName(record.OrgFullName, record.ID);
              //   this.setState({ rowId: record.ID });
              //    this.props.onCancel();
              // },
            };
          }}
          scroll={{
            x: "max-content",
            y: "50vh",
          }}
        />
      </Modal>
    );
  }
}

export default withTranslation()(Organization);
