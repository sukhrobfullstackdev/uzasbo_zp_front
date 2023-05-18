import React, { Component } from "react";
import { Modal, Table, Input, Form, Select, Space } from "antd";
import { withTranslation } from "react-i18next";

// import SalaryCalculationServices from "../../../../../services/Documents/EmployeeMovement/SalaryCalculation/SalaryCalculation.services";

const { Option } = Select;

class SubCountDb1Modal extends Component {
  state = {
    data: [],
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    filterParam: '',
    filterType: '',
  };

  componentDidMount() {
    const { pagination, filterParam } = this.state;
    this.fetch({ pagination }, filterParam);
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
      },
      this.state.filterParam
    );
  };

  fetch = (params = {}, search) => {
    // this.setState({ loading: true });
    // let pageNumber = params.pagination.current,
    //   pageLimit = params.pagination.pageSize,
    //   sortColumn = params.sortField,
    //   orderType = params.sortOrder,
    //   filterType = this.state.filterType;

    // SalaryCalculationServices.getAllSubCalculationKindList(pageNumber, pageLimit, sortColumn, orderType, search, filterType)
    //   .then((data) => {
    //     this.setState({
    //       loading: false,
    //       data: data.data.rows,
    //       pagination: {
    //         ...params.pagination,
    //         total: data.data.total,
    //       },
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  search = (value) => {
    const { pagination } = this.state;
    this.setState({ loading: true, filterParam: value });
    this.fetch({ pagination }, value);
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };

  setRowClassName = (record) => {
    return record.ID === this.state.rowId ? 'table-row clicked-row' : 'table-row';
  }

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        sorter: (a, b) => a.code - b.code,
      },
      {
        title: t("Name"),
        dataIndex: "Name",
        key: "Name",
        sorter: true,
      },
      {
        title: t("TransName"),
        dataIndex: "TransName",
        key: "TransName",
        sorter: true,
      },
      {
        title: t("TaxItem"),
        dataIndex: "TaxItem",
        key: "TaxItem",
        sorter: true,
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Modal
        visible={this.props.visible}
        title={t("Employee")}
        okText={t("select")}
        cancelText={t("cancel")}
        onOk={this.props.onCancel}
        onCancel={this.props.onCancel}
        width={1200}
        onClick={(record) => {
          this.props.getFullName(record.FullName);
        }}
      >
        <div className="table-top">
          <Form>
            <Space size='middle'>
              <Form.Item name="filterType">
                <Select
                  allowClear
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                  <Option value="ID">{t("id")}</Option>
                  <Option value="Name">{t("Name")}</Option>
                </Select>
              </Form.Item>

              <Form.Item name="Search">
                <Input.Search
                  enterButton
                  placeholder={t("search")}
                  onSearch={this.search}
                />
              </Form.Item>
            </Space>
          </Form>
        </div>

        <Table
          bordered
          className="main-table"
          columns={columns}
          dataSource={data}
          loading={loading}
          onChange={this.handleTableChange}
          rowKey={(record) => record.ID}
          rowClassName={this.setRowClassName}
          scroll={{
            x: "max-content",
            y: "50vh",
          }}
          pagination={{
            ...pagination,
            showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
          }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                this.props.getModalData(record.Name, record.ID);
                this.props.onCancel();
              },
              onClick: () => {
                this.props.getModalData(record.Name, record.ID);
                this.setState({ rowId: record.ID });
              },
            };
          }}
        />
      </Modal>
    );
  }
}

export default withTranslation()(SubCountDb1Modal);
