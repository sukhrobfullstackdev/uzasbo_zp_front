import React, { Component } from "react";
import { Table, Input, Button, Form } from "antd";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import { Fade } from "react-awesome-reveal";
import { Notification } from "../../../../../helpers/notifications";
import ExperienceContWorkService from "../../../../../services/References/Global/ExperienceContWork/ExperienceContWork.services";
import Card from "../../../../components/MainCard";


class ExperienceContWork extends Component {
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
        this.setState({ loading: true });
        let pageNumber = params.pagination.current,
            pageLimit = params.pagination.pageSize,
            sortColumn = params.sortField,
            orderType = params.sortOrder,
            search = searchCode ? searchCode : '';

        ExperienceContWorkService.getList(pageNumber, pageLimit, sortColumn, orderType, search)
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
        ExperienceContWorkService.delete(id)
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

    search = value => {
        this.setState({ loading: true });
        const { pagination } = this.state;
        this.fetch({ pagination }, value);
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
                title: t("name"),
                dataIndex: "Name",
                key: "Name",
                sorter: true,
            },

        ];

        const { data, pagination, loading } = this.state;

        return (
            <Card title={t("Experience ContWork")}>
                <Fade>
                    <div className="main-table-filter-elements" style={{ marginBottom: 20}}>
                        <Form.Item >
                            <Input.Search
                                className='table-search'
                                placeholder={t('search')}
                                enterButton
                                onSearch={this.search}
                            />
                        </Form.Item>
                        <Link to={`${this.props.match.path}/add`}>
                            <Button type="primary" disabled>
                                {t("add-new")}&nbsp;
                                <i className="fa fa-plus" aria-hidden="true" />
                            </Button>
                        </Link>
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
                        className='main-table'
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

export default withTranslation()(ExperienceContWork);
