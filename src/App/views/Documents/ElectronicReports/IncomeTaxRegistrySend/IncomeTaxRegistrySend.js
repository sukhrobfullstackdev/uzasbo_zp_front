import React, { Component } from "react";
import { Table, Input, Form, Button, Select, Space, Dropdown, Menu, Tag, InputNumber } from "antd";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import moment from 'moment';

import IncomeTaxRegistryServices from "../../../../../services/Documents/ElectronicReports/IncomeTaxRegistry/IncomeTaxRegistry.services";
import Card from "../../../../components/MainCard";
import HelperServices from "../../../../../services/Helper/helper.services";
import classes from "./IncomeTaxRegistry.module.css";
import { Notification } from "../../../../../helpers/notifications";
import AddIncomeTaxRegistryModal from './AddIncomeTaxRegistryModal.js';
import EditIncomeTaxRegistryModal from './EditIncomeTaxRegistryModal';
import months from '../../../../../helpers/months';

const { Option } = Select;
class IncomeTaxRegistry extends Component {
  state = {
    data: [],
    filterStatus: [],
    filterType: "",
    filterForm: {},
    modal1visible: false,
    modal2visible: false,
    recordId: null,
    pagination: {
      current: 1,
      pageSize: 10,
    },
    loading: false
  };

  fetchAdditionalData = async () => {
    try {
      const stsList = await HelperServices.getStatusList();
      this.setState({ filterStatus: stsList.data })
    } catch (err) {
      // console.log(err);
      Notification('error', err);
    }
  }

  AddModal = () => {
    this.setState({
      modal1visible: true,
    });
  };

  EditModal = (id) => {
    this.setState({
      modal2visible: true,
      recordId: id
    });
  };

  handleAddCancel = () => {
    this.setState({ modal1visible: false });
    const { pagination } = this.state;
    this.fetch({ pagination }, null, {});
  };
  handleEditCancel = () => {
    this.setState({ modal2visible: false });
    const { pagination } = this.state;
    this.fetch({ pagination }, null, {});
  };

  componentDidMount() {
    this.fetchAdditionalData();
    const { pagination } = this.state;
    this.fetch({ pagination }, null, {});
  }

  handleTableChange = (pagination, filters, sorter) => {
    const { filterForm } = this.state;
    this.fetch(
      {
        sortField: sorter.field,
        sortOrder: sorter.order,
        pagination,
        ...filters,
      },
      {},
      filterForm
    );
  };

  fetch = (params = {}, searchCode, filterFormValues) => {
    let filter = {};

    if (this.state.filterType) {
      filter[this.state.filterType] = filterFormValues.Search
        ? filterFormValues.Search
        : searchCode;
    }

    this.setState({ loading: true });
    let pageNumber = params.pagination.current,
      pageLimit = params.pagination.pageSize,
      sortColumn = params.sortField,
      orderType = params.sortOrder;

    IncomeTaxRegistryServices.getSentList(
      pageNumber,
      pageLimit,
      sortColumn,
      orderType,
      filter,
      filterFormValues
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
      });
  };

  onFinish = (filterFormValues) => {
    if (this.state.print) {
      filterFormValues.ID = filterFormValues.ID ? filterFormValues.ID.trim() : "";
      filterFormValues.FinanceYear = filterFormValues.FinanceYear ? filterFormValues.FinanceYear.trim() : "";
      filterFormValues.Month = filterFormValues.Month ? filterFormValues.Month.trim() : "";
      filterFormValues.Date = filterFormValues.Date ? filterFormValues.Date.trim() : "";
      filterFormValues.Director = filterFormValues.Director ? filterFormValues.Director.trim() : "";
      filterFormValues.Accounter = filterFormValues.Accounter ? filterFormValues.Accounter.trim() : "";
      filterFormValues.Name = filterFormValues.Name ? filterFormValues.Name.trim() : "";
      filterFormValues[this.state.filterType] = filterFormValues.Search ? filterFormValues.Search.trim() : "";

      IncomeTaxRegistryServices.print(filterFormValues).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "income&Tax.xlsx");
        document.body.appendChild(link);
        link.click();
        this.setState({
          loading: false,
        });
      });
    } else {
      this.setState({ loading: true, filterForm: filterFormValues });
      const { pagination } = this.state;
      this.fetch({ pagination }, null, filterFormValues);
    }
  };

  handleDelete = (id) => {
    console.log(id);
    this.setState({ loading: true });
    const { pagination, filterForm } = this.state;
    IncomeTaxRegistryServices.delete(id)
      .then((res) => {
        if (res.status === 200) {
          this.fetch({ pagination }, null, filterForm);
        }
      })
      .catch((err) => Notification('error', err));
  };

  acceptHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterForm } = this.state;
    IncomeTaxRegistryServices.Accept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('accepted'));
          this.fetch({ pagination }, null, filterForm);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err)
        this.setState({ loading: false });
      });
  };

  declineHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterForm } = this.state;
    IncomeTaxRegistryServices.NotAccept(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('notAccepted'));
          this.fetch({ pagination }, null, filterForm);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err)
        this.setState({ loading: false });
      });
  };

  receivedHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterForm } = this.state;
    IncomeTaxRegistryServices.Received(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('received'));
          this.fetch({ pagination }, null, filterForm);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err)
        this.setState({ loading: false });
      });
  };

  notReceivedHandler = (id) => {
    this.setState({ loading: true });
    const { pagination, filterForm } = this.state;
    IncomeTaxRegistryServices.NotReceived(id)
      .then((res) => {
        if (res.status === 200) {
          Notification('success', this.props.t('notReceived'));
          this.fetch({ pagination }, null, filterForm);
        }
      })
      .catch((err) => {
        // console.log(err)
        Notification('error', err)
        this.setState({ loading: false });
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

  printById = (id) => {
    this.setState({ loading: true });
    IncomeTaxRegistryServices.printById(id)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "income&Tax.xlsx");
        document.body.appendChild(link);
        link.click();
        this.setState({ loading: false });
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err)
        this.setState({ loading: false });
      })

  }

  printById2 = (id) => {
    this.setState({ loading: true });
    IncomeTaxRegistryServices.printById2(id)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "income&Tax.xlsx");
        document.body.appendChild(link);
        link.click();
        this.setState({ loading: false });
      })
      .catch(err => {
        // console.log(err);
        Notification('error', err)
        this.setState({ loading: false });
      })

  }

  handlePrint = () => {
    // setConfirmLoading(true);
    // filterForm.validateFields()
    //     .then(values => {
    //         values.Year = values.Year.format("YYYY");
    //         IncomeTaxRegistryServices.Print1(values)
    //             .then((res) => {
    //                 if (res.status === 200) {
    //                     console.log(new Blob([res.data]))
    //                     const url = window.URL.createObjectURL(new Blob([res.data]));
    //                     const link = document.createElement("a");
    //                     link.href = url;
    //                     link.setAttribute("download", "Print1.xlsx");
    //                     document.body.appendChild(link);
    //                     link.click();

    //                     setConfirmLoading(false);
    //                 }
    //             }).catch((err) => {
    //                 Notification('error', err);
    //                 setConfirmLoading(false);
    //             })
    //     })
    }

  render() {
    const { t } = this.props;
    const columns = [
      {
        title: t("id"),
        dataIndex: "ID",
        key: "ID",
        render: (_, record) => {
          if (record.StatusID === 2) {
            return record.ID;
          } else {
            return <span style={{ color: 'red' }}>{record.ID}</span>
          }
        },
        sorter: true
      },
      {
        title: t("FinanceYear"),
        dataIndex: "FinanceYear",
        key: "FinanceYear",
        width: 150,
        sorter: true,
      },
      {
        title: t("OrganizationName"),
        dataIndex: "OrganizationName",
        key: "OrganizationName",
        width: 150,
        sorter: true,
      },
      {
        title: t("OrganizationINN"),
        dataIndex: "OrganizationINN",
        key: "OrganizationINN",
        width: 150,
        sorter: true,
      },
      {
        title: t("Date"),
        dataIndex: "Date",
        key: "Date",
        sorter: true,
      },
      {
        title: t("Month"),
        dataIndex: "Month",
        key: "Month",
        width: 150,
        sorter: true,
      },
      {
        title: t("director"),
        dataIndex: "Director",
        key: "Director",
        sorter: true,
      },
      {
        title: t("status"),
        dataIndex: "Status",
        key: "Status",
        width: 160,
        sorter: true,
        render: (_, record) => {
          if (record.StatusID === 2 || record.StatusID === 8) {
            return (
              <Tag color='#87d068'>
                {record.Status}
              </Tag>
            );
          }
          return (
            <Tag color='#f50'>
              {record.Status}
            </Tag>
          );
        }
      },
      {
        title: t("accounter"),
        dataIndex: "Accounter",
        key: "Accounter",
        sorter: true,
      },

      {
        title: t("name"),
        dataIndex: "Name",
        key: "Name",
        sorter: true,
        width: 200,
        render: record => <div className="ellipsis-2">{record}</div>
      },
      {
        title: t("DateOfModified"),
        dataIndex: "DateOfModified",
        key: "DateOfModified",
        sorter: true,
        width: 160,
      },
      {
        title: t("actions"),
        key: "action",
        align: "center",
        fixed: "right",
        width: 100,
        render: (record) => {
          return (
            <Space size="middle">
              <Dropdown
                overlay={<Menu items={[
                  // {
                  //   key: 'Edit',
                  //   label: (
                  //     <span
                  //       data-id={record.id}
                  //       className={classes.ModalOpener}
                  //       onClick={() => this.EditModal(record.ID)}
                  //     >
                  //       <i className="feather icon-edit action-icon" aria-hidden="true" />&nbsp;
                  //       {t("Edit")}
                  //     </span>
                  //   ),
                  // },
                  // {
                  //   key: 'accept',
                  //   label: (
                  //     <span onClick={() => this.acceptHandler(record.ID)}>
                  //       <i className="far fa-check-circle action-icon" />&nbsp;
                  //       {t("Accept")}
                  //     </span>
                  //   ),
                  // },
                  // {
                  //   key: 'notAccept',
                  //   label: (
                  //     <span onClick={() => this.declineHandler(record.ID)}>
                  //       <i className="far fa-check-circle action-icon" />&nbsp;
                  //       {t("NotAccept")}
                  //     </span>
                  //   ),
                  // },
                  {
                    key: 'receive',
                    label: (
                      <span onClick={() => this.receivedHandler(record.ID)}>
                        <i className="far fa-check-circle action-icon" />&nbsp;
                        {t("receive")}
                      </span>
                    ),
                  },
                  {
                    key: 'notReceive',
                    label: (
                      <span onClick={() => this.notReceivedHandler(record.ID)}>
                        <i className="far fa-times-circle action-icon" />&nbsp;
                        {t("notReceive")}
                      </span>
                    ),
                  },
                  {
                    key: 'Print',
                    label: (
                      <span onClick={() => this.printById(record.ID)}>
                        <i className="feather icon-printer action-icon" aria-hidden="true" />&nbsp;
                        {t("Print")}
                      </span>
                    ),
                  },
                  {
                    key: 'Print2',
                    label: (
                      <span onClick={() => this.printById2(record.ID)}>
                        <i className="feather icon-printer action-icon" aria-hidden="true" />&nbsp;
                        {t("Print2")}
                      </span>
                    ),
                  },
                  // {
                  //   key: 'delete',
                  //   label: (
                  //     <span onClick={() => this.handleDelete(record.ID)}>
                  //       <i className="feather icon-trash-2 action-icon" aria-hidden="true" />&nbsp;
                  //       {t("Delete")}
                  //     </span>
                  //   ),
                  // },
                ]} />}
              >
                <i className='feather icon-list action-icon' aria-hidden="true" />
              </Dropdown>
            </Space>
          );
        },
      },
    ];

    const { data, pagination, loading, modal1visible, modal2visible } = this.state;

    return (
      <Card title={t("IncomeTaxRegistrySend")}>
        <Fade>
          <div className="table-top">
            <Form
              onFinish={this.onFinish}
              className={classes.FilterForm}
              initialValues={{
                FinanceYear: moment().year()
              }}
            >
              <div className="main-table-filter-elements">
                {/* <Form.Item>
                  <Select
                    allowClear
                    style={{ width: 180 }}
                    placeholder={t("Filter Type")}
                    onChange={this.filterTypeHandler}
                  >
                    <Option value="ID">{t("id")}</Option>
                    <Option value="Search">{t("StartYear")}</Option>
                  </Select>
                </Form.Item> */}
                <Form.Item label={t("OrganizationName")} name="OrganizationName">
                  <Input placeholder={t("OrganizationName")}/>
                </Form.Item>
                <Form.Item label={t("OrganizationINN")} name="OrganizationINN">
                  <InputNumber placeholder={t("OrganizationINN")}/>
                </Form.Item>
                <Form.Item
                  label={t("Month")}
                  name="Month"
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    placeholder={t("Month")}
                    style={{ width: 170 }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {months.map(item => <Option key={item.id} value={item.id}>{t(item.name)}</Option>)}
                  </Select>
                </Form.Item>
                <Form.Item 
                  label={t("FinanceYear")}
                  name="FinanceYear"
                  rules={[
                    {
                      required: true,
                      message: t("Please input valid"),
                    },
                  ]}
                 >
                  <InputNumber placeholder={t("FinanceYear")} className={classes['year-input']} />
                </Form.Item>

                {/* <Form.Item name="Search">
                  <Input.Search
                    className="table-search"
                    placeholder={t("search")}
                    enterButton
                    onSearch={this.search}
                  />
                </Form.Item> */}
                <Button
                  type="primary"
                  htmlType="submit"
                >
                  <i className="feather icon-refresh-ccw" />
                </Button>
                <Button
                    type="primary"
                    // loading={confirmLoading}
                    onClick={this.handlePrint}
                    className="main-table-filter-element"
                >
                    <i className="feather icon-printer" />
                </Button>

                <Button
                  className={classes.ModalOpener}
                  type="primary"
                  onClick={this.AddModal}>
                  <i className="fa fa-plus" aria-hidden="true" />
                </Button>

              </div>
            </Form>

            <AddIncomeTaxRegistryModal
              visible={modal1visible}
              onCancel={this.handleAddCancel}
            />
            {modal2visible && <EditIncomeTaxRegistryModal
              visible={modal2visible}
              onCancel={this.handleEditCancel}
              id={this.state.recordId}
              data={this.state.data}
            />}
          </div>
        </Fade>

        <Fade>
          <Table
            size="middle"
            columns={columns}
            bordered
            dataSource={data}
            loading={loading}
            pagination={{
              ...pagination,
              showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
            }}
            onChange={this.handleTableChange}
            rowKey={(record) => record.ID}
            rowClassName="table-row"
            className="main-table"
            showSorterTooltip={false}
            scroll={{
              x: "max-content",
              y: "50vh",
            }}
          />
        </Fade>
      </Card>
    );
  }
}

export default withTranslation()(IncomeTaxRegistry);
