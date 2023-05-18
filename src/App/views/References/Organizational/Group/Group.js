import React, { Component } from "react";
import { Table, Tag, Tooltip, Input, Button, Form, Select } from "antd";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import { Notification } from "../../../../../helpers/notifications";
import DepartmentServices from "../../../../../services/References/Organizational/Department/department.services";
import Card from "../../../../components/MainCard";
import classes from "./Department.module.css";
//import { data } from "jquery";

const { Option } = Select;

class Group extends Component {
    state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
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
    let values = {};
    values[this.state.filterType] = searchCode ? searchCode : "";
    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder;

    DepartmentServices.getList(
      pageNumber,
      pageLimit,
      sortColumn,
      orderType,
      values,
      searchCode
    )
    // .data.forEach(data => {
    //   data = data.data.rows.TypeID===3
    // })
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
  
  handleDelete = (id) => {
    const { pagination } = this.state;
    DepartmentServices.delete(id)
      .then((data) => {
        this.setState({ loading: true });
        this.fetch({ pagination });
      })
      .catch((err) => Notification('error', err));
  };

  onFinish = (values) => {
    this.setState({ loading: true });
  };

  // Filter functions

  search = (value) => {
    this.setState({ loading: true });
    const { pagination } = this.state;
    this.fetch({ pagination }, value);
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
        sorter: (a, b) => a.code - b.code,
        // render: (_, record) => {
        //   if (record.StatusID === 2) {
        //     return record.ID;
        //   } else {
        //     return <span style={{ color: 'red' }}>{record.ID}</span>
        //   }
        // }
      },
      {
        title: t("shortname"),
        dataIndex: "ShortName",
        key: "ShortName",
        sorter: true,
      },
      {
        title: t("name"),
        dataIndex: "Name",
        key: "Name",
        sorter: true,
      },
      {
        title: t("ParentName1"),
        dataIndex: "ParentName1",
        key: "ParentName1",
        sorter: true,
      },
      {
        title: t("status"),
        dataIndex: "State",
        key: "State",
        width: "12%",
        render: (status) => {
          if (status === "Актив") {
            return (
              <Tag color="#87d068" key={status}>
                {status}
              </Tag>
            );
          } else if (status === "Пассив") {
            return (
              <Tag color="#f50" key={status}>
                {status}
              </Tag>
            );
          }
        },
      },
      {
        title: t("division"),
        dataIndex: "Division",
        key: "Division",
        sorter: true,
      },
      {
        title: t("ForState"),
        dataIndex: "ForStaffList",
        key: "ForStaffList",
        sorter: true,
      },
      {
        title: t("actions"),
        key: "action",
        width: "10%",
        align: "center",
        fixed: "right",
        render: (record) => {
          return (
            <Tooltip title={t("Edit")}>
            <Link
              to={`${this.props.match.path}/edit/${record.ID}`}>
              <i
                className='feather icon-edit action-icon'
                aria-hidden="true"
              />
            </Link>
          </Tooltip>
          );
        },
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("Group")}>
        <Fade>
          <div className="table-top department-card">
            <Form className={classes.FilterWrapper}>
              <Form.Item>
                <Select
                  style={{ width: 180 }}
                  allowClear
                  placeholder={t("Filter Type")}
                  onChange={this.filterTypeHandler}
                >
                  <Option value="ID">{t("id")}</Option>
                  <Option value="Search">{t("name")}</Option>
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
            </Form>

            <Link to={`${this.props.match.path}/add`}>
              <Button type="primary">
                {t("add-new")}&nbsp;
                <i className="fa fa-plus" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Fade>
        <Fade>
          <Table
            columns={columns}
            bordered
            dataSource={data}
            loading={loading}
            showSorterTooltip={false}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
            rowClassName="table-row"
            className="main-table"
            onRow={(record) => {
              return {
                onDoubleClick: () => {
                  this.props.history.push(
                    `${this.props.match.path}/edit/${record.ID}`
                  );
                },
              };
            }}
            scroll={{
              x: "max-content",
            }}
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
          />
          
        </Fade>
      </Card>
    );
  }
}

export default withTranslation()(Group);
