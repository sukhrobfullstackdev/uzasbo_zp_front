import React, { Component } from "react";
import { Table, Input, Button, Space, Tooltip } from "antd";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import { CSSTransition } from "react-transition-group";

import { Notification } from "../../../../../helpers/notifications";
import BaseSalaryService from "../../../../../services/References/Global/BaseSalary/BaseSalary.services";
import Card from "../../../../components/MainCard";
import UpdateBaseSalaryModal from "./components/UpdateBaseSalaryModal";

class BaseSalary extends Component {
    adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
    state = {
        data: [],
        pagination: {
            current: 1,
            pageSize: 10,
        },
        loading: false,
        updateBaseSalaryModal: false,
        rowItem: null,
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
        this.setState({ loading: true });
        let pageNumber = params.pagination.current,
            pageLimit = params.pagination.pageSize,
            sortColumn = params.sortField,
            orderType = params.sortOrder,
            search = searchCode ? searchCode : "";

        BaseSalaryService.getList(
            pageNumber,
            pageLimit,
            sortColumn,
            orderType,
            search
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
        BaseSalaryService.delete(id)
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
                align: "center",
                sorter: (a, b) => a.code - b.code,

            },
            {
                title: t("Date"),
                dataIndex: "Date",
                key: "Date",
                align: "center",
                sorter: true,
            },
            {
                title: t("BaseSalary"),
                dataIndex: "BaseSalary",
                key: "BaseSalary",
                align: "center",
                sorter: true,
                render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
            },
            {
                title: t("ChangePercentage"),
                dataIndex: "ChangePercentage",
                key: "ChangePercentage",
                align: "center",
                width: "5%",
                sorter: true,
            },
            {
                title: t("NormativeAct"),
                dataIndex: "NormativeAct",
                key: "NormativeAct",
                sorter: true,
            },
            {
                title: t("actions"),
                key: "action",
                align: "center",
                fixed: "right",
                width: 80,
                render: (record) => {
                    return (
                        <Space size="middle">
                            {this.adminViewRole && (
                                <Tooltip title={t("Edit")}>
                                    <span onClick={() => {
                                        this.setState({ updateBaseSalaryModal: true, rowItem: record });
                                    }}>
                                        <i className='feather icon-edit action-icon' aria-hidden="true" />
                                    </span>
                                </Tooltip>
                            )}
                        </Space>
                    );
                },
            },
        ];

        const { data, pagination, loading } = this.state;

        return (
            <Card title={t("Base Salary")}>
                <Fade>
                    <div className="table-top">
                        <div className="main-table-filter-elements" style={{ marginBottom: 20 }}>
                            <Input.Search
                                className="table-search"
                                placeholder={t("search")}
                                enterButton
                                onSearch={this.search}
                            />
                            {this.adminViewRole && (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.setState({ updateBaseSalaryModal: true, rowItem: { ID: 0 } });
                                    }}
                                >
                                    {t("add-new")}&nbsp;
                                    <i className="fa fa-plus" aria-hidden="true" />
                                </Button>
                            )}
                        </div>
                    </div>
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
                        onRow={(record) => {
                            return {
                                onDoubleClick: () => {
                                    this.setState({ updateBaseSalaryModal: true, rowItem: record })
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
                <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={this.state.updateBaseSalaryModal}
                    timeout={300}
                >
                    <UpdateBaseSalaryModal
                        visible={this.state.updateBaseSalaryModal}
                        data={this.state.rowItem}
                        fetch={() => {
                            const { pagination } = this.state;
                            this.fetch({ pagination }, this.state.filterData);
                        }}
                        onCancel={() => {
                            this.setState({ updateBaseSalaryModal: false });
                        }}
                    />
                </CSSTransition>
            </Card>
        );
    }
}

export default withTranslation()(BaseSalary);
