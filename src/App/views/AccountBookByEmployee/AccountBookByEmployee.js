import React, { Component } from "react";
import { Table, Tag, Space, Input, Popconfirm, Button, Form, Select } from "antd";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";

import ListPositionServices from "../../../services/AccountBookByEmployee/AccountBookByEmployee.services";
import Card from "../../components/MainCard";
import classes from "./AccountBookByEmployee.module.scss";

const { Option } = Select;

class AccountBookByEmployee extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
      loading: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    const { pagination } = this.state;
    this.fetch({ pagination });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.fetch(
      {
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
      }
    );
  };

  fetch = (params = {}, searchCode) => {
    let values = {}
    values[this.state.filterType] = searchCode ? searchCode : "";
    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder;

    ListPositionServices.getList(pageNumber, pageLimit, sortColumn, orderType, values, searchCode)
      .then((data) => {
        if (this._isMounted) {
          this.setState({
            loading: false,
            data: data.data.rows,
            pagination: {
              ...params.pagination,
              total: data.data.total,
            },
          });
        }
      })
      .catch((err) => {
        window.alert(err);
      });
  };

  handleDelete = (id) => {
    const { pagination } = this.state;
    ListPositionServices.delete(id)
      .then((res) => {
        this.setState({ loading: true });
        this.fetch({ pagination });
      })
      .catch((err) => alert(err));
  };

  // Filter functions

  search = value => {
    this.setState({ loading: true });
    const { pagination } = this.state;
    this.fetch({ pagination }, value);
  }

  filterTypeHandler = type => {
    console.log(type)
    this.setState({ filterType: type })
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
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("SubAcc"),
        dataIndex: "SubAcc",
        key: "SubAcc",
        sorter: true,
      },
      {
        title: t("SettleCode"),
        dataIndex: "SettleCode",
        key: "SettleCode",
        sorter: true,
      },
      {
        title: t("EmployeeName"),
        dataIndex: "EmployeeName",
        key: "EmployeeName",
        sorter: true,
      },
      {
        title: t("FullName"),
        dataIndex: "FullName",
        key: "FullName",
        sorter: true,
      },
      {
        title: t("PersonnelNumber"),
        dataIndex: "PersonnelNumber",
        key: "PersonnelNumber",
        sorter: true,
      },
      {
        title: t("DivisionName"),
        dataIndex: "DivisionName",
        key: "DivisionName",
        sorter: true,
      },
      {
        title: t("Subcount2"),
        dataIndex: "Subcount2",
        key: "Subcount2",
        sorter: true,
      },
      {
        title: t("DebitAmount"),
        dataIndex: "DebitAmount",
        key: "DebitAmount",
        sorter: true,
      },
      {
        title: t("CreditAmount"),
        dataIndex: "CreditAmount",
        key: "CreditAmount",
        sorter: true,
      },
      {
        title: t("EndDebit"),
        dataIndex: "EndDebit",
        key: "EndDebit",
        sorter: true,
      },
      {
        title: t("EndCredit"),
        dataIndex: "EndCredit",
        key: "EndCredit",
        sorter: true,
      },
      // {
      //   title: t('status'),
      //   dataIndex: 'Status',
      //   key: 'Status',
      //   width: '12%',
      //   render: (status) => {
      //     if (status === "Актив") {
      //       return (<Tag color="#87d068" key={status}>{status}</Tag>)
      //     } else if (status === "Пассив") {
      //       return (<Tag color="#f50" key={status}>{status}</Tag>)
      //     }
      //   }
      // },
      {
        title: t('actions'),
        key: 'action',
        width: '8%',
        align: 'center',
        fixed: 'right',
        render: (record) => {
          return (
            <Space size="middle">
              <Link
                data-id={record.id}
                to={`${this.props.match.path}/edit/${record.ID}`}>
                <i className="feather icon-edit action-icon" aria-hidden="true"></i>
              </Link>
              {/* <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.ID)}>
                <span style={{ color: "#1890FF", cursor: 'pointer' }}><i className="feather icon-trash-2 action-icon" aria-hidden="true"></i></span>
              </Popconfirm> */}
            </Space>
          )
        },
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("Positions")}>
        <div className="table-top department-card">
          <Form className={classes.FilterWrapper}>
            <Form.Item>
              <Select
                style={{ width: 180 }}
                placeholder="Filter Type"
                onChange={this.filterTypeHandler}>
                <Option value="ID">ID</Option>
                <Option value="Code">Code</Option>
                <Option value="Name">Name</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Input.Search
                className='table-search'
                placeholder={t('search')}
                enterButton
                onSearch={this.search} />
            </Form.Item>
          </Form>

          <Link to={`${this.props.match.path}/add`}>
            <Button type="primary">
              {t("add-new")}&nbsp;
              <i className="fa fa-plus" aria-hidden="true" />
            </Button>
          </Link>
        </div>

        <Table
          columns={columns}
          bordered
          dataSource={data}
          loading={loading}
          onChange={this.handleTableChange}
          rowKey={(record) => record.ID}
          rowClassName="table-row"
          scroll={{
            x: "max-content",
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
            };
          }}
        />
      </Card>
    );
  }
}

export default withTranslation()(AccountBookByEmployee);
