import React, { Component } from "react";
import { Modal, Table, Input, Form, Select } from "antd";
import { withTranslation } from "react-i18next";

import { Notification } from '../../../../../helpers/notifications';
import classes from "./EmployeeMovement.module.css";
import HelperServices from "../../../../../services/Helper/helper.services";


const { Option } = Select;

class QualificationCategory extends Component {
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
    values.QualificationCategoryName = values.QualificationCategoryName ? values.QualificationCategoryName.trim() : "";
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

      HelperServices.GetAllSubCalculationKindList(
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
        Notification('error', err);
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
        title: t("Calculation Kind"),
        dataIndex: "Name",
        key: "Name",
        sorter: true,
      },
      {
        title: t("TaxItem"),
        dataIndex: "TaxItem",
        key: "TaxItem",
        sorter: true,
      },
      {
        title: t("TransName"),
        dataIndex: "TransName",
        key: "TransName",
        sorter: true,
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Modal
        visible={this.props.visible}
        title={t("QualificationCategory")}
        okText={t("select")}
        cancelText={t("cancel")}
        onOk={this.props.onCancel}
        onCancel={this.props.onCancel}
        width={1300}
        onClick={(record) => {
          this.props.getQualificationCategoryName(record.QualificationCategoryName);
        }}
      >
        <div className="table-top">
          <Form onFinish={this.onFinish} className={classes.FilterForm}>
            <div className="main-table-filter-elements">
              <Form.Item name="filterType">
                <Select
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                <Option value="Name">{t("Name")}</Option>
                <Option value="ID">{t("id")}</Option>
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
          showSorterTooltip={false}
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
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                this.props.getModalData(record);
                this.props.onCancel();
              },
              onClick: () => {
                this.props.getModalData(record);
                this.setState({ rowId: record.ID });
                this.props.onCancel();
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

export default withTranslation()(QualificationCategory);
