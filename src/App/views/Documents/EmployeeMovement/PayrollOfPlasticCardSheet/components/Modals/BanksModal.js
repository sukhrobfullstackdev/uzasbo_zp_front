import React, { Component } from "react";
import { Modal, Table, Input, Form } from "antd";
import { withTranslation } from "react-i18next";

import classes from "../../PayrollOfPlasticCardSheet.module.css";
import HelperServices from "../../../../../../../services/Helper/helper.services";
import { Notification } from "../../../../../../../helpers/notifications";


class Banks extends Component {
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

  fetch = (params = {}, searchCode) => {
    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder,
      search = searchCode ? searchCode : "";

    HelperServices.getBankList(
      pageNumber,
      pageLimit,
      sortColumn,
      orderType,
      search
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
        Notification('error', err);
      });
  };

  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

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

  search = (value) => {
    this.setState({ loading: true });
    const { pagination } = this.state;
    this.fetch({ pagination }, value);
  };

  // End Filter functions

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
        title: t("Code"),
        dataIndex: "Code",
        key: "Code",
        sorter: true,
      },
      {
        title: t("Name"),
        dataIndex: "Name",
        key: "Name",
        sorter: true,
      },

    ];

    const { data, pagination, loading } = this.state;

    return (
      <Modal
        visible={this.props.visible}
        title={t("Banks")}
        okText={t("select")}
        cancelText={t("cancel")}
        onOk={this.props.onCancel}
        onCancel={this.props.onCancel}
        width={1300}
        onClick={(record) => {
          this.props.getFullName(record.Code, record.ID);
        }}
      >
        <div className="table-top">
          <Form className={classes.FilterForm}>
            <div className="main-table-filter-elements">
              <Form.Item name="search">
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
          className="main-table"
          showSorterTooltip={false}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                this.props.getFullName(record.Code, record.ID);
                this.props.onCancel();
                // console.log(record)
              },
              onClick: () => {
                this.props.getFullName(record.Code, record.ID);
                this.setState({ rowId: record.ID });
                // this.props.onCancel();
                // console.log(record)
              },
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

export default withTranslation()(Banks);
