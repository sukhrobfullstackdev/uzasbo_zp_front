import React, { Component } from "react";
import { Table, Input, Form, Tag, Select, Space, Popconfirm } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { Notification } from "../../../../../helpers/notifications";
import TPSubCalculationKindServices from "../../../../../services/References/Template/TPSubCalculationKind/TPSubCalculationKind.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";

const { Option } = Select;

class TPSubCalculationKind extends Component {
  state = {
    data: [],
    departmentList: [],
    orgSettleAcc: [],
    statusList: [],
    filterForm: {},
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    filterType: ''
  };

  fetchData = async () => {
    try {
      const stsList = await HelperServices.getStatusList();
      this.setState({ statusList: stsList.data})
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

    TPSubCalculationKindServices.getList(pageNumber, pageLimit, sortColumn, orderType, search, date, filter, filterFormValues)
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
      });;
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
        title: t("Vish"),
        dataIndex: "Vish",
        key: "Vish",
        sorter: true,
        
      },    
      {
        title: t("DpName"),
        dataIndex: "DpName",
        key: "DpName",
        sorter: true,
     
      },    
      {
        title: t("SubCalcName"),
        dataIndex: "SubCalcName",
        key: "SubCalcName",
        sorter: true,
     
      },
      {
        title: t("NormativeAct"),
        dataIndex: "NormativeAct",
        key: "NormativeAct",
        sorter: true,
        width: 150
     
      }, 
      {
        title: t("ShortNameUzb"),
        dataIndex: "ShortNameUzb",
        key: "ShortNameUzb",
        sorter: true,
        width: 150
     
      }, {
        title: t("ShortNameRus"),
        dataIndex: "ShortNameRus",
        key: "ShortNameRus",
        sorter: true,
        width: 150
     
      },
      {
        title: t('Status'),
        dataIndex: 'Status',
        key: 'Status',
        width: '12%',
        render: (status) => {
          if (status === "Актив") {
            return (<Tag color="#87d068" key={status}>{status}</Tag>)
          } else if (status === "Пассив") {
            return (<Tag color="#f50" key={status}>{status}</Tag>)
          }
        }
      },
      
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: 'right',
        render: (record) => {
          return (
            <Space size="middle">
              <Link
                to={`${this.props.match.path}/edit/${record.ID}`}
              >
                <i
                  className='feather icon-edit action-icon'
                  aria-hidden="true"
                />
              </Link>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.deleteRowHandler(record.ID)}
              >
                <span>
                  <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                </span>
              </Popconfirm>
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("TPSubCalculationKind")}>
        <Fade>
          <div className="table-top">
            <Form
              onFinish={this.onFinish}
              // layout='vertical'
              className='table-filter-form'
              initialValues={{
                EndDate: moment(),
                StartDate: moment().subtract(10, "year"),
              }}
            >
              <div className="main-table-filter-elements">

                <Form.Item
                  name="filterType"
                  label="Filter type">
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
                  label="Search"
                  name="Search">
                  <Input.Search
                    className="table-search"
                    placeholder={t("search")}
                    enterButton
                    onSearch={this.search}
                  />
                </Form.Item>


              </div>
              <div className='form-bottom'>
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

export default withTranslation()(TPSubCalculationKind);
