import React, { Component } from "react";
import { Table, Form, Button, DatePicker} from "antd";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import { Notification } from '../../../../../helpers/notifications';
import AccountBookByEmployeeServices from "../../../../../services/Report/Turnover statement/AccountBookList/AccountBookByEmployee";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
//import Popup from "./Popup";

const defaultPagination = {
  current: 1,
  pageSize: 10,
}

class Report extends Component {
  filterForm = React.createRef();

  state = {
    data: [],
    departmentList: [],
    orgSettleAcc: [],
    psList: [],
    statusList: [],
    filterData: {},
    popup: {
      visible: false,
      x: 0,
      y: 0
    },
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false,
    filterType: ''
  };

  fetchData = async () => {
    try {
      const orgSettleAcc = await HelperServices.getOrganizationsSettlementAccountList();
      const stsList = await HelperServices.getStatusList();
      const dpList = await HelperServices.getAllDepartmentList();
      this.setState({ orgSettleAcc: orgSettleAcc.data, statusList: stsList.data, departmentList: dpList.data })
    } catch (err) {
      Notification('error', err);
      // console.log(err);
    }
  }

  componentDidMount() {
    this.fetchData();
    const { pagination } = this.state;
    this.fetch({ pagination }, {});
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
    );
  };

  fetch = (params = {}, filterFormValues) => {
    let filter = {};

    if (this.state.filterType) {
      filter[this.state.filterType] = filterFormValues.Search ? filterFormValues.Search : '';
    }

    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder

    const date = {
      EndDate: filterFormValues.EndDate ? filterFormValues.EndDate.format("DD.MM.YYYY") : moment().add(30, "days").format("DD.MM.YYYY"),
      StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(30, "days").format("DD.MM.YYYY"),
    };

    AccountBookByEmployeeServices.GetAccountBookByEmployee(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
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
  onFinish = (values) => {
    this.setState({ loading: true, filterData: values });
    this.fetch({ pagination: defaultPagination }, values);
  };
  filterTypeHandler = (type) => {
    this.setState({ filterType: type });
  };
  // End Filter functions
  render() {
    const { t } = this.props;
    const columns = [
     
      {
        title: t("SubAccCode"),
        dataIndex: "SubAccCode",
        key: "SubAccCode",
        sorter: true,
        width: 130
      },
      {
        title: t("OrganizationsSettlementAccountCode"),
        dataIndex: "OrganizationsSettlementAccountCode",
        key: "OrganizationsSettlementAccountCode",
        sorter: true,
        width: 130
      },
      {
        title: t("DivisionName"),
        dataIndex: "DivisionName",
        key: "DivisionName",
        sorter: true,
        width: 130
      },
      {
        title: t("DepartmentName"),
        dataIndex: "DepartmentName",
        key: "DepartmentName",
        sorter: true,
        width: 130
        
      },
      {
        title: t("EmployeeName"),
        dataIndex: "EmployeeName",
        key: "EmployeeName",
        sorter: true,
        width: 130
      },
      {
        title: t("BeginDebitAmount"),
        dataIndex: "BeginDebitAmount",
        key: "BeginDebitAmount",
        sorter: true,
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        width: 130
      },
      {
        title: t("BeginCreditAmount"),
        dataIndex: "BeginCreditAmount",
        key: "BeginCreditAmount",
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        sorter: true,
        width: 130
      },
      {
        title: t("DebitAmount"),
        dataIndex: "DebitAmount",
        key: "DebitAmount",
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        sorter: true,
        width: 130
      },
      {
        title: t("CreditAmount"),
        dataIndex: "CreditAmount",
        key: "CreditAmount",
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        sorter: true,
        width: 130
      },
      {
        title: t("EndDebitAmount"),
        dataIndex: "EndDebitAmount",
        key: "EndDebitAmount",
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        sorter: true,
        width: 130
      },
      {
        title: t("EndCreditAmount"),
        dataIndex: "EndCreditAmount",
        key: "EndCreditAmount",
        render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record),
        sorter: true,
        width: 130
      },
     
     
    ];

    const { data, pagination, loading } = this.state;

    return (
      <Card title={t("ReportAccountBook")}>
        <Fade>
          <div className="table-top">
            <Form
              ref={this.filterForm}
              onFinish={this.onFinish}
              className='table-filter-form'
              initialValues={{
                EndDate: moment().add(30, "days"),
                StartDate: moment().subtract(30, "days"),
              }}>
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

                {/* <Link to={`${this.props.match.path}/add`}>
                  <Button type="primary">
                    {t("add-new")}&nbsp;
                    <i className="fa fa-plus" aria-hidden="true" />
                  </Button>
                </Link> */}

              </div>

            </Form>
          </div>
        </Fade>
        <Fade>
          <Table
            bordered
            size="middle"
            rowClassName="table-row"
            className="main-table"
            columns={columns}
            dataSource={data}
            showSorterTooltip={false}
            loading={loading}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            scroll={{
              x: "max-content",
              y: '50vh'
            }}
            // onRow={(record) => {
            //   return {
            //     onDoubleClick: () => {
            //       this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
            //     },
            //     onContextMenu: event => {
            //       event.preventDefault()
            //       if (!this.state.popup.visible) {
            //         const that = this
            //         document.addEventListener(`click`, function onClickOutside() {
            //           that.setState({ popup: { visible: false } })
            //           document.removeEventListener(`click`, onClickOutside);
            //         });

            //         document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
            //           that.setState({ popup: { visible: false } })
            //           document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
            //         })
            //       }
            //       this.setState({
            //         popup: {
            //           record,
            //           visible: true,
            //           x: event.clientX,
            //           y: event.clientY
            //         }
            //       })
            //     }
            //   };
            // }}
          />
        </Fade>
      
      </Card>
    );
  }
}

export default withTranslation()(Report);
