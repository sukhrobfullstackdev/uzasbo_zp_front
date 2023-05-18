import React, { Component } from "react";
import { Table, Input, Button, Form, Select } from "antd";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import { Notification } from "../../../../../helpers/notifications";
import ScholarshipCategoryService from "../../../../../services/References/Global/ScholarshipCategory/ScholarshipCategory.services";
import Card from "../../../../components/MainCard";
import classes from "./ScholarshipCategory.module.css";

const { Option } = Select;

class ScholarshipCategory extends Component {
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

        ScholarshipCategoryService.getList(
            pageNumber,
            pageLimit,
            sortColumn,
            orderType,
            values,
            searchCode
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
                Notification('error', err);
            });
    };

    handleDelete = (id) => {
        const { pagination } = this.state;
        ScholarshipCategoryService.delete(id)
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

            },
            {
                title: t("CategoryName"),
                dataIndex: "CategoryName",
                key: "CategoryName",
                sorter: true,
            },
            {
                title: t("Price"),
                dataIndex: "Price",
                key: "Price",
                sorter: true,
                render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
            },
        ];

        const { data, pagination, loading } = this.state;

        return (
            <Card title={t("Scholarship Category")}>
                <Fade>
                    <Form className={classes.FilterWrapper}>
                        <div className="main-table-filter-elements">
                            <Form.Item>
                                <Select
                                    style={{ width: 180, marginBottom: 0 }}
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
                            <Form.Item>
                                <Link to={`${this.props.match.path}/add`}>
                                    <Button type="primary" disabled>
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Button>
                                </Link>
                            </Form.Item>
                        </div>
                    </Form>
                </Fade>
                <Fade>
                    <Table
                        columns={columns}
                        bordered
                        dataSource={data}
                        loading={loading}
                        onChange={this.handleTableChange}
                        rowKey={(record) => record.ID}
                        rowClassName="table-row"
                        className="main-table"
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

export default withTranslation()(ScholarshipCategory);
