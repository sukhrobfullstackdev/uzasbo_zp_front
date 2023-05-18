import React, { Component } from "react";
import { Table, Input, Form, Select } from "antd";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import { Notification } from "../../../../../helpers/notifications";
import TPShiftServices from "../../../../../services/References/Template/TPShift/TPShift.services";
import Card from "../../../../components/MainCard";

const { Option } = Select;

class TPShift extends Component {
  state = {
    data: [],
    filterForm: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    filterType: ''
  };

  componentDidMount() {
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

    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder

    TPShiftServices.getList(pageNumber, pageLimit, sortColumn, orderType, search, filter, filterFormValues)
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
      });
  };

  search = (value) => {
    this.setState({ loading: true });
    const { pagination } = this.state;
    this.fetch({ pagination }, value, {});
  };

  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };

  // End Filter functions

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("ID"),
        dataIndex: "ID",
        key: "ID",
        sorter: true,

      },
      {
        title: t("Name"),
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        width: 400
      },

    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("TPShift")}>
        <Fade>
          <div className="table-top">
            <Form
              onFinish={this.onFinish}
              className='table-filter-form'
            >
              <div className="main-table-filter-elements">

                <Form.Item
                  name="filterType"
                  // label={t("Filter Type")}
                >
                  <Select
                    style={{ width: 180 }}
                    placeholder={t("Filter Type")}
                    onChange={this.filterTypeHandler}>
                    <Option value="">{t("Filter Type")}</Option>
                    <Option value="ID">{t('id')}</Option>
                    <Option value="Search">{t('Name')}</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  // label={t("search")}
                  name="Search"
                >
                  <Input.Search
                    className="table-search"
                    placeholder={t("search")}
                    enterButton
                    onSearch={this.search}
                  />
                </Form.Item>
              </div>
            </Form>
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
            rowKey={(record) => record.ID}
            rowClassName="table-row"
            className="main-table"
            scroll={{
              x: "max-content",
              y: '50vh'
            }}
          />
        </Fade>
      </Card>
    );
  }
}

export default withTranslation()(TPShift);
