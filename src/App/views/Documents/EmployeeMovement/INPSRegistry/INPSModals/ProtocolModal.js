import React, { Component } from "react";
import { Modal, Table, Form } from "antd";
import { withTranslation } from "react-i18next";

import classes from "../INPSRegistry.module.css";
// import HelperServices from "../../../../../../services/Helper/helper.services";

class EmployeeList extends Component {
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
    // if (searchCode) {
    //   values[this.state.filterType] = searchCode ? searchCode.trim() : "";
    // } else {
    //   values[this.state.filterType] = values.Search ? values.Search.trim() : "";
    // }
    // this.setState({ loading: true });
    // let pageNumber = params.pagination.current,
    //   pageLimit = params.pagination.pageSize,
    //   sortColumn = params.sortField,
    //   orderType = params.sortOrder;

    // HelperServices.getWorkingEmployeesNoParameterList(
    //   pageNumber,
    //   pageLimit,
    //   sortColumn,
    //   orderType,
    //   values,
    //   this.props.parentId
    // )
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

  onFinish = (filterFormValues) => {
    // console.log(filterFormValues);
    this.setState({ loading: true, filterData: filterFormValues });
    const { pagination } = this.state;
    this.fetch({ pagination }, filterFormValues);
  };

  onSelectChange = selectedRowKeys => {
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

  // setRowClassName = (record) => {
  //   return record.ID === this.state.rowId ? 'table-row clicked-row' : 'table-row';
  // }

  render() {
    // console.log(this.props.parentId)
    const { t } = this.props;
    const columns = [
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        sorter: true,
      },
      {
        title: t("Protocol"),
        dataIndex: "Protocol",
        key: "Protocol",
        sorter: true,
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
     

    ];
    // const empColumns = [
    //   {
    //     title: t("id"),
    //     dataIndex: "ID",
    //     key: "ID",
    //     sorter: true,
    //     width: 200
    //   },
    //   {
    //     title: t("FullName"),
    //     dataIndex: "FullName",
    //     key: "FullName",
    //     sorter: true,
    //   },
    //   {
    //     title: t("DateOfBirth"),
    //     dataIndex: "DateOfBirth",
    //     key: "DateOfBirth",
    //     sorter: true,
    //   },
    //   {
    //     title: t("PersonnelNumber"),
    //     dataIndex: "PersonnelNumber",
    //     key: "PersonnelNumber",
    //     sorter: true,
    //     width: 100
    //   },
    //   {
    //     title: t("INN"),
    //     dataIndex: "INN",
    //     key: "INN",
    //     sorter: true,
    //   }
    // ];

    const { data, pagination, loading } = this.state;

    return (
      <Modal
        visible={this.props.visible}
        title={t("Protocol")}
        okText={t("select")}
        cancelText={t("cancel")}
        onOk={this.props.onCancel}
        onCancel={this.props.onCancel}
        // width={1300}
      >
        <div className="table-top">
          <Form onFinish={this.onFinish} className={classes.FilterForm}>
            {/* <div className="main-table-filter-elements">
              <Form.Item name="filterType">
                <Select
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                  <Option value="FullName">{t("FullName")}</Option>
                </Select>
              </Form.Item>

              <Form.Item name="Search">
                <Input.Search
                  placeholder={t("search")}
                  enterButton
                  onSearch={this.search}
                />
              </Form.Item>
            </div> */}
          </Form>
        </div>

        <Table
          // columns={this.props.parentId === 63 ? empColumns : columns}
          bordered
          dataSource={data}
          columns={columns}
          pagination={{
            ...pagination,
            showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
          }}
          loading={loading}
          onChange={this.handleTableChange}
          rowKey={(record) => record.ID}
          rowClassName={this.setRowClassName}
          className="main-table"
          showSorterTooltip={false}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                this.props.getEmpData(record);
                this.props.onCancel();
              },
              onClick: () => {
                this.props.getEmpData(record);
                this.setState({ rowId: record.ID });
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

export default withTranslation()(EmployeeList);
