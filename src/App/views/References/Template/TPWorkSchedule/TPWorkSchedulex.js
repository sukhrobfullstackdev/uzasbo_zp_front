import React, { Component } from "react";
import { Table, Input, Form, Select, Space, Button, Tooltip } from "antd";
import { withTranslation } from "react-i18next";

import { Fade } from "react-awesome-reveal";
import moment from "moment";
import { Notification } from "../../../../../helpers/notifications";
import TPWorkScheduleServices from "../../../../../services/References/Template/TPWorkSchedule/TPWorkSchedule.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
import { CSSTransition } from "react-transition-group";
import UpdateTPWorkScheduleModal from "./UpdateTPWorkScheduleModal";

const { Option } = Select;

class TPWorkSchedule extends Component {
    adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
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
        updateModal: false,
        rowItem: null,
        loading: false,
        filterType: ''
    };

    fetchData = async () => {
        try {
            const stsList = await HelperServices.getStatusList();
            this.setState({ statusList: stsList.data })
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

        TPWorkScheduleServices.getList(pageNumber, pageLimit, sortColumn, orderType, search, date, filter, filterFormValues)
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
                title: t("WorkScheduleKind"),
                dataIndex: "WorkScheduleKind",
                key: "WorkScheduleKind",
                sorter: true,
            },
            {
                title: t("Name"),
                dataIndex: "Name",
                key: "Name",
                sorter: true,
                width: 200
            },
            {
                title: t("BeginDayHours"),
                dataIndex: "BeginDayHours",
                key: "BeginDayHours",
                sorter: true,
            },
            {
                title: t("BeginEveningHours"),
                dataIndex: "BeginEveningHours",
                key: "BeginEveningHours",
                sorter: true,
            },
            {
                title: t("BeginNightHours"),
                dataIndex: "BeginNightHours",
                key: "BeginNightHours",
                sorter: true,
            },
            {
                title: t("FirstDayOff"),
                dataIndex: "FirstDayOff",
                key: "FirstDayOff",
                sorter: true,
            },
            {
                title: t("actions"),
                key: "action",
                align: "center",
                fixed: 'right',
                width: 100,
                render: (record) => {
                    return (
                        <Space size="middle">
                            {this.adminViewRole && (
                                <>
                                    <Tooltip title={t("Edit")}>
                                        <span onClick={() => {
                                            this.setState({ updateModal: true, rowItem: { ID: record.ID } });
                                        }}>
                                            <i className='feather icon-edit action-icon' aria-hidden="true" />
                                        </span>
                                    </Tooltip>
                                </>
                            )}
                        </Space>
                    );
                },
            },
        ];

        const { data, pagination, loading } = this.state;

        return (
            <Card title={t("TPWorkSchedule")}>
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

                                {this.adminViewRole && (
                                    <Button
                                        type="primary" disabled
                                        onClick={() => {
                                            this.setState({ updateModal: true, rowItem: { ID: 0 } });
                                        }}
                                    >
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Button>
                                )}

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
                        onRow={(record) => {
                            return {
                                onDoubleClick: () => {
                                    this.setState({ updateModal: true, rowItem: { ID: record.ID } });
                                },
                            };
                        }}
                    />
                </Fade>

                <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={this.state.updateModal}
                    timeout={300}
                >
                    <UpdateTPWorkScheduleModal
                        visible={this.state.updateModal}
                        data={this.state.rowItem}
                        fetch={() => {
                            const { pagination, filterForm } = this.state;
                            this.fetch({ pagination }, filterForm, {});
                        }}
                        onCancel={() => {
                            this.setState({ updateModal: false });
                        }}
                    />
                </CSSTransition>
            </Card>
        );
    }
}

export default withTranslation()(TPWorkSchedule);
