import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Popconfirm, Tag, Tooltip } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import DistributionOfLessonHoursServices from "../../../../../../services/Documents/Personnel_accounting/TariffList/DistributionOfLessonHours/DistributionOfLessonHours.services";
import { Notification } from "../../../../../../helpers/notifications";
import HelperServices from "../../../../../../services/Helper/helper.services";
import Card from "../../../../../components/MainCard";
import ExpandedRow from "./ExpandedRow";

const { Option } = Select;
const defaultPagination = {
    current: 1,
    pageSize: 10,
}

class DistributionOfLessonHours extends Component {
    filterForm = React.createRef();

    state = {
        data: [],
        statusList: [],
        expandedTableData: [],
        filterData: {},
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
            this.setState({ statusList: stsList.data })
        } catch (err) {
            Notification('error', err);
        }
    }

    componentDidMount() {
        this.fetchData();
        const { pagination } = this.state;
        this.fetch({ pagination }, {});
    }

    handleTableChange = (pagination, filters, sorter) => {
        this.fetch({
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

        DistributionOfLessonHoursServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
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

    search = () => {
        const filterValues = this.filterForm.current.getFieldsValue();
        this.setState({ loading: true, filterData: filterValues });
        this.fetch({ pagination: defaultPagination }, filterValues);
    };

    deleteRowHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        DistributionOfLessonHoursServices.delete(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                this.setState({ loading: true });
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

    acceptHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        DistributionOfLessonHoursServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', this.props.t('accepted'));
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                Notification('error', err);
                this.setState({ loading: false });
            });
    };

    declineHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        DistributionOfLessonHoursServices.NotAccept(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', this.props.t('notAccepted'));
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                Notification('error', err);
                this.setState({ loading: false });
            });
    };

    onTableRow = (record) => {
        return {
            onDoubleClick: () => {
                this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
            },
        };
    }

    // onChange = (date) => {
    //   // this.setState({ startDate: date.target.value });
    //   this.filterForm.current.setFieldsValue({ StartDate: moment(date.target.value, 'DD.MM.YYYY') })
    // }

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
                title: t("Employee"),
                dataIndex: "Employee",
                key: "Employee",
                sorter: true,
            },
            {
                title: t("EnrolmentType"),
                dataIndex: "EnrolmentType",
                key: "EnrolmentType",
                sorter: true,
            },
            {
                title: t("Status"),
                dataIndex: "Status",
                key: "Status",
                sorter: true,
                render: (_, record) => {
                    if (record.StatusID === 2) {
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
                title: t("classGuidance"),
                dataIndex: "ClassGuidance",
                key: "ClassGuidance",
                sorter: true,
                width: 130
            },
            {
                title: t("TotalHours"),
                dataIndex: "TotalHours",
                key: "TotalHours",
                sorter: true,
                width: 100
            },
            {
                title: t("ChildrenCount"),
                dataIndex: "ChildrenCount",
                key: "ChildrenCount",
                sorter: true,
                width: 120
            },
            {
                title: t("classCount"),
                dataIndex: "ClassCount",
                key: "ClassCount",
                sorter: true,
                width: 130
            },
            {
                title: t("StartYear"),
                dataIndex: "StartYear",
                key: "StartYear",
                sorter: true,
                width: 120
            },
            {
                title: t("EndYear"),
                dataIndex: "EndYear",
                key: "EndYear",
                sorter: true,
                width: 120
            },
            {
                title: t("actions"),
                key: "action",
                align: "center",
                fixed: 'right',
                render: (record) => {
                    return (
                        <Space size="middle">
                            <Tooltip title={t('Accept')}>
                                <span onClick={() => this.acceptHandler(record.ID)}>
                                    <i className="far fa-check-circle action-icon" />
                                </span>
                            </Tooltip>
                            <Tooltip title={t('NotAccept')}>
                                <span onClick={() => this.declineHandler(record.ID)}>
                                    <i className="far fa-times-circle action-icon" />
                                </span>
                            </Tooltip>
                            <Tooltip title={t("Edit")}>
                                <Link to={`${this.props.match.path}/edit/${record.ID}`}>
                                    <i
                                        className='feather icon-edit action-icon'
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Tooltip>
                            <Tooltip title={t("Delete")}>
                                <Popconfirm
                                    title={t('delete')}
                                    onConfirm={() => this.deleteRowHandler(record.ID)}
                                    okText={t("yes")}
                                    cancelText={t("cancel")}
                                >
                                    <span>
                                        <i className="feather icon-trash-2 action-icon" aria-hidden="true" />
                                    </span>
                                </Popconfirm>
                            </Tooltip>
                        </Space>
                    );
                },
            },
        ];

        const { data, pagination, loading } = this.state;

        return (
            <Card title={t("DistributionOfLessonHours")}>
                <Fade>
                    <Form
                        layout='vertical'
                        ref={this.filterForm}
                        onFinish={this.onFinish}
                        className='table-filter-form'
                        initialValues={{
                            EndDate: moment().add(30, "days"),
                            StartDate: moment().subtract(30, "days"),
                        }}
                    >
                        <div className="main-table-filter-wrapper">
                            <Form.Item
                                name="filterType"
                                label={t("Filter Type")}>
                                <Select
                                    allowClear
                                    style={{ width: 180 }}
                                    placeholder={t("Filter Type")}
                                    onChange={this.filterTypeHandler}>
                                    <Option value="ID">{t('id')}</Option>
                                    <Option value="Number">{t('number')}</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={t("search")}
                                name="Search"
                            >
                                <Input.Search
                                    placeholder={t("search")}
                                    enterButton
                                    onSearch={this.search}
                                />
                            </Form.Item>

                            <Form.Item
                                name="StartDate"
                                label={t("startDate")}
                            >
                                <DatePicker
                                    format="DD.MM.YYYY"
                                    className="datepicker"
                                />
                            </Form.Item>

                            <Form.Item
                                name="EndDate"
                                label={t("endDate")}
                            >
                                <DatePicker format="DD.MM.YYYY" className="datepicker" />
                            </Form.Item>

                            <Form.Item
                                name="Status"
                                label={t("Status")}>
                                <Select
                                    allowClear
                                    placeholder={t("Status")}
                                    style={{ width: 200 }}
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }>
                                    {this.state.statusList.map(item => <Option key={item.ID}
                                        value={item.ID}>{item.DisplayName}</Option>)}
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    <i className="feather icon-refresh-ccw" />
                                </Button>
                            </Form.Item>

                            <Form.Item>
                                <Tooltip title={t("add-new")}>
                                    <Link to={`${this.props.match.path}/add`}>
                                        <Button type="primary">
                                            <i className="fa fa-plus" aria-hidden="true" />
                                        </Button>
                                    </Link>
                                </Tooltip>
                            </Form.Item>
                        </div>
                    </Form>
                </Fade>
                <Fade>
                    <Table
                        size="middle"
                        columns={columns}
                        bordered
                        dataSource={data}
                        showSorterTooltip={false}
                        loading={loading}
                        onChange={this.handleTableChange}
                        rowKey={(record) => record.ID}
                        rowClassName="table-row"
                        className="main-table"
                        onRow={(record) => this.onTableRow(record)}
                        expandable={{
                            expandedRowRender: (record, index, indent, expanded) => <ExpandedRow record={record} expanded={expanded} />,
                        }}
                        scroll={{
                            x: "max-content",
                            y: '60vh'
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

export default withTranslation()(DistributionOfLessonHours);
