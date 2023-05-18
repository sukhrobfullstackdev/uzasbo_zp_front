import React, { Component } from "react";
import { Modal, Table, Input, Form, Select, DatePicker, Button } from "antd";
import { withTranslation } from "react-i18next";
import moment from "moment";
import classes from "./CancelOrderOfScholarship.module.css";

import OrderOfScholarshipServices from "../../../../../services/Documents/StudentAccounting/OrderOfScholarship/OrderOfScholarship.services";

const { Option } = Select;

class Employee extends Component {
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
    values.PersonnelNumber = values.PersonnelNumber
      ? values.PersonnelNumber.trim()
      : "";
    values.FullName = values.FullName ? values.FullName.trim() : "";
    values.INN = values.INN ? values.INN.trim() : "";
    values.StartDate = values.StartDate ? values.StartDate : "";
    values.EndDate = values.EndDate ? values.EndDate : "";
    

    if (searchCode) {
      values[this.state.filterType] = searchCode ? searchCode.trim() : "";
    } else {
      values[this.state.filterType] = values.Search ? values.Search.trim() : "";
    }
    const date = {
      EndDate: values.EndDate ? values.EndDate.format("DD.MM.YYYY") : moment().add(30, "days").format("DD.MM.YYYY"),
      StartDate: values.StartDate ? values.StartDate.format("DD.MM.YYYY") : moment().subtract(30, "days").format("DD.MM.YYYY"),
    };

    values.DateOfBirth = values.DateOfBirth
      ? values.DateOfBirth.format("DD.MM.YYYY")
      : "";
    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder;
    

    OrderOfScholarshipServices.getListList(
      pageNumber,
      pageLimit,
      sortColumn,
      orderType,
      date,
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

  // onSelectChange = selectedRowKeys => {
  //   console.log('selectedRowKeys changed: ', selectedRowKeys);
  //   this.setState({ selectedRowKeys });
  // };

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
    // const { selectedRowKeys } = this.state;
    const columns = [
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        sorter: true,
         width: 120,
       
      },
     
      {
        title: t("Number"),
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
        width: 80
      },
      {
        title: t("BeginDate"),
        dataIndex: "BeginDate",
        key: "BeginDate",
        sorter: true,
        width: 100
      },
      {
        title: t("EndDate"),
        dataIndex: "EndDate",
        key: "EndDate",
        sorter: true,
        width: 100
      },
      
      {
        title: t("Acad-Start"),
        dataIndex: "AcademicYearStart",
        key: "AcademicYearStart",
        sorter: true,
        width: 100
      },
      {
        title: t("Acad -End"),
        dataIndex: "AcademicYearEnd",
        key: "AcademicYearEnd",
        sorter: true,
        width: 100
      },
      {
        title: t("Semester"),
        dataIndex: "Semester",
        key: "Semester",
        sorter: true,
        width: 100
      },
   
      {
        title: t("DivisionName"),
        dataIndex: "DivisionName",
        key: "DivisionName",
        sorter: true,
        width: 100
      },
   
      {
        title: t("StudyGroupName"),
        dataIndex: "StudyGroupName",
        key: "StudyGroupName",
        sorter: true,
        width: 100
      },
      {
        title: t("FacultyName"),
        dataIndex: "FacultyName",
        key: "FacultyName",
        sorter: true,
        width: 250
      },
      {
        title: t("StudyDirectionName"),
        dataIndex: "StudyDirectionName",
        key: "StudyDirectionName",
        sorter: true,
         width: 200,
      },
      {
        title: t("OrganizationsSettlement"),
        dataIndex: "OrganizationsSettlementAccountCode",
        key: "OrganizationsSettlementAccountCode",
        sorter: true,
        width: 120
      },
      {
        title: t("Status"),
        dataIndex: "Status",
        key: "Status",
         width: 100,
        sorter: true,
       
      },
      {
        title: t("ListOfPositionName"),
        dataIndex: "ListOfPositionName",
        key: "ListOfPositionName",
        sorter: true,
        width: 150
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
        width={1300}
        onClick={(record) => {
          this.props.getFullName(record.ID);
        }}
      >
        <div className="table-top">
          <Form onFinish={this.onFinish} className={classes.FilterForm}>
            <div className="main-table-filter-elements">
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
                <Button type="primary" htmlType="submit">
                  <i className="feather icon-refresh-ccw" />
                </Button>
              <Form.Item name="filterType">
                <Select
                  style={{ width: 180 }}
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                  <Option value="ID">{t("id")}</Option>
                  {/* <Option value="INN">{t("inn")}</Option> */}
                  <Option value="PersonnelNumber">
                    {t("personnelNumber")}
                  </Option>
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
           //rowClassName="table-row modal-table-row"
          rowClassName={this.setRowClassName}
          className="main-table"
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                this.props.getFullName(record);
                this.props.onCancel();
                // console.log(record.FullName)
              },
              // onClick: () => {
              //   this.props.getFullName(record.FullName, record.ID);
              //   this.setState({ rowId: record.ID });
              //   this.props.onCancel();
              //   console.log(record.FullName)
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

export default withTranslation()(Employee);
