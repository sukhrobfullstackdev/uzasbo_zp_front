import React, { Component } from "react";
import { Table, Input, Form, Button, Select, Space, Popconfirm, Tag, Tooltip, Modal, DatePicker } from "antd";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import BillingListSendServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/BillingListSend/BillingListSend.services";
// import HelperServices from "../../../../../../services/Helper/helper.services";
import BillingListServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/BillingList/BillingList.services";
import Card from "../../../../../components/MainCard";
import classes from "./BillingListSend.module.css";
import { Notification } from "../../../../../../helpers/notifications";
// import { FileZipOutlined  } from '@ant-design/icons';
import TableRightClick from "./TableRightClick";
import { Link } from "react-router-dom";

// import ProtokolModal from "./ProtokolModal";

const { Option } = Select;
const defaultPagination = {
    current: 1,
    pageSize: 10,
}

class BillingListSend extends Component {
    eImzoForm = React.createRef();
    filterForm = React.createRef();
    BillingListArchieve = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('BillingListArchieve');

    state = {
        data: [],
        filterForm: {},
        pagination: {
            current: 1,
            pageSize: 10,
        },
        modal1visible: false,
        loading: false,
        filterType: '',
        print: false,
        tablePopup: {
            visible: false,
            x: 0,
            y: 0
        },
    };

    fetchData = async () => {
        try {
        } catch (err) {
            alert(err);
            console.log(err);

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
            {},
            this.state.filterForm,
        );
    };

    fetch = (params = {}, searchCode, filterFormValues) => {
        let filter = {};
        let search;

        if (this.state.filterType) {
            filter[this.state.filterType] = filterFormValues?.Search ? filterFormValues?.Search : searchCode;
        } else {
            search = filterFormValues?.Search ? filterFormValues?.Search : searchCode;
        }

        this.setState({ loading: true });
        let pageNumber = params.pagination.current,
            pageLimit = params.pagination.pageSize,
            sortColumn = params.sortField,
            orderType = params.sortOrder

        const date = {
            Year: filterFormValues?.Year ? filterFormValues?.Year.format("YYYY") : moment().add({ year: 1 }).format("YYYY"),
        };
        this.setState({ filterForm: filterFormValues });

        BillingListSendServices.getSendList(pageNumber, pageLimit, sortColumn, orderType, search, date, filter, filterFormValues)
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
                window.alert(err);
            });
    };

    search = (value) => {
        const filterValues = this.filterForm.current.getFieldsValue();
        this.setState({ loading: true });
        this.fetch({ pagination: defaultPagination }, value, filterValues);
    };

    onFinish = (filterFormValues) => {
        this.setState({ loading: true, filterForm: filterFormValues });
        const { pagination } = this.state;
        this.fetch({ pagination: defaultPagination }, null, filterFormValues);
    };

    filterTypeHandler = (type) => {
        this.setState({ filterType: type });
    };

    handleRecievedCancel = () => {
        this.setState({ modal1visible: false });
    };

    acceptHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterForm } = this.state;
        BillingListServices.AcceptHeader(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, null, filterForm);
                }
            })
            .catch((err) => {
                // console.log(err)
                Notification("error", err);
                this.setState({ loading: false });
            });
    };

    declineHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        BillingListServices.CancelHeader(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', this.props.t('notAccepted'))
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                //console.log(err)
                Notification('error', err)
                this.setState({ loading: false });
            });
    };

    printById = (id) => {
        this.setState({ loading: true });
        BillingListServices.printById(id)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "TariffList.xlsx");
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

    handleArchieve = (id) => {
        this.setState({ loading: true });
        const { pagination, filterForm } = this.state;
        BillingListServices.Archived(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, null, filterForm);
                    Notification('success', this.props.t('edited'))
                }
            })
            .catch((err) => {
                //console.log(err)
                Notification('error', err)
                this.setState({ loading: false });
            });
    };

    sendHeader = (id) => {
        this.setState({ loading: true });
        const { pagination, filterForm } = this.state;
        BillingListServices.sendHeader(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, null, filterForm);
                }
            })
            .catch((err) => {
                // console.log(err)
                Notification("error", err);
                this.setState({ loading: false });
            });
    };

    onTableRow = (record) => {
        return {
            onDoubleClick: () => {
                this.props.history.push(`${this.props.match.path}/view/${record.ID}`);
            },
            onContextMenu: event => {
                event.preventDefault()
                if (!this.state.tablePopup.visible) {
                    const that = this
                    document.addEventListener(`click`, function onClickOutside() {
                        that.setState({ tablePopup: { visible: false } })
                        document.removeEventListener(`click`, onClickOutside);
                    });

                    document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
                        that.setState({ tablePopup: { visible: false } })
                        document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
                    })
                }
                this.setState({
                    tablePopup: {
                        record,
                        visible: true,
                        x: event.clientX,
                        y: event.clientY
                    }
                })
            }
        };
    }

    render() {
        const { t } = this.props;
        const columns = [
            {
                title: t("id"),
                dataIndex: "ID",
                key: "ID",
                sorter: true,
            },
            {
                title: t("Date"),
                dataIndex: "Date",
                key: "Date",
                sorter: true,
            },
            {
                title: t("Number"),
                dataIndex: "Number",
                key: "Number",
                sorter: true,
                width: 80,
            },
            {
                title: t("Year"),
                dataIndex: "Year",
                key: "Year",
                sorter: true,
                width: 100,
            },
            {
                title: t("OrganizationName"),
                dataIndex: "OrganizationName",
                key: "OrganizationName",
                sorter: true,
            },
            {
                title: t("INN"),
                dataIndex: "INN",
                key: "INN",
                sorter: true,
            },
            {
                title: t("Comment"),
                dataIndex: "Comment",
                key: "Comment",
                sorter: true,
                render: record => <div className="ellipsis-2">{record}</div>,
                width: 180,
            },
            {
                title: t("TotalSum"),
                dataIndex: "TotalSum",
                key: "TotalSum",
                sorter: true,
                render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
            },
            {
                title: t("Status"),
                dataIndex: "Status",
                key: "Status",
                sorter: true,
                width: 100,
                render: (_, record) => {
                    if (record.StatusID === 9) {
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
                title: t("actions"),
                key: "action",
                align: "center",
                fixed: 'right',
                width: 80,
                render: (record) => {
                    return (
                        <Space size="middle">
                            <Tooltip title={t("Send")}>
                                <span onClick={() => this.sendHeader(record.ID)}>
                                    <i className="far fa-share-square action-icon"></i>
                                </span>
                            </Tooltip>
                            <Tooltip title={t("printById")}>
                                <span onClick={() => this.printById(record.ID)}>
                                    <i
                                        className='feather icon-printer action-icon'
                                        aria-hidden="true"
                                    />
                                </span>
                            </Tooltip>
                            <Tooltip title={t("view")}>
                                <Link to={`${this.props.match.path}/view/${record.ID}`}>
                                    <i className='feather icon-eye action-icon' />
                                </Link>
                            </Tooltip>
                            <Popconfirm
                                title="Sure to send?"
                                onConfirm={() => this.acceptHandler(record.ID)}
                            >
                                <span>
                                    <i className="far fa-check-circle action-icon" />
                                </span>
                            </Popconfirm>

                            {this.BillingListArchieve && (
                                <Tooltip title={t("archive")}>
                                    <span onClick={() => this.handleArchieve(record.ID)}>
                                        <i className="far fa-file-archive action-icon" />
                                    </span>
                                </Tooltip>
                            )}

                            <Tooltip title={t("NotAccept")}>
                                <span onClick={() => this.declineHandler(record.ID)}>
                                    <i className="far fa-times-circle action-icon" />
                                </span>
                            </Tooltip>
                        </Space>
                    );
                },
            },
        ];

        const { data, pagination, loading, record } = this.state;

        return (
            <Card title={t("BillingListSend")}>
                <Fade>
                    <div className="main-table-filter-elements">
                        <Form
                            className={classes.FilterWrapper}
                            onFinish={this.onFinish}
                            ref={this.filterForm}
                            initialValues={{
                                Year: moment().add({ year: 1 })
                            }}
                        >
                            <Form.Item
                                name="Year"
                            // label={t("StartYear")}
                            >
                                <DatePicker format="YYYY" picker="year" />
                            </Form.Item>
                            <Form.Item>
                                <Select
                                    style={{ width: 180 }}
                                    placeholder={t("Filter Type")}
                                    onChange={this.filterTypeHandler}
                                >
                                    <Option>{t("Filter Type")}</Option>
                                    <Option value="ID">{t("id")}</Option>
                                    <Option value="Name">{t("OrgName")}</Option>
                                    <Option value="INN">{t("INN")}</Option>
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
                            <Button type="primary" htmlType="submit">
                                <i className="feather icon-refresh-ccw" />
                            </Button>
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
                        onRow={(record) => this.onTableRow(record)}
                        rowKey={(record) => record.ID}
                        showSorterTooltip={false}
                        rowClassName="table-row"
                        className="main-table"
                        scroll={{
                            x: "max-content",
                            y: '50vh'
                        }}
                    />
                </Fade>
                {/* <CSSTransition
          mountOnEnter
          unmountOnExit
          timeout={300}
        >
          <ProtocolModal
            visible={protocolModalVisible}
            id={rowId}
            tableId={rowTableId}
            onCancel={this.closeProtocolModalHandler}
          />
        </CSSTransition> */}
                <TableRightClick
                    {...this.state.tablePopup}
                    zip={this.handleArchieve}
                    send={this.SendHeader}

                />
            </Card>
        );
    }
}

export default withTranslation()(BillingListSend);