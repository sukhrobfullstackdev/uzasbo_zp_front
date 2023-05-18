import React, { Component } from "react";
import { Table, Input, Form, Button, DatePicker, Select, Space, Popconfirm, Tooltip, Tag, InputNumber } from "antd";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import moment from "moment";

import PayrollSheetServices from "../../../../../services/Documents/EmployeeMovement/PayrollSheet/PayrollSheet.services";
import HelperServices from "../../../../../services/Helper/helper.services";
import Card from "../../../../components/MainCard";
import ChangeSubAccModal from './PayrollModals/ChangeSubAccModal';
// import classes from "./PayrollSheet.module.css";
import TableRightClick from "./TableRightClick";
import { Notification } from "../../../../../helpers/notifications";
import { CSSTransition } from "react-transition-group";
import ChangeDateModal from "../../../commonComponents/ChangeDateModal";
import ChangeStatusModal from "../PayrollOfPlasticCardSheet/components/Modals/ChangeStatusModal";

const { Option } = Select;
const defaultPagination = {
    current: 1,
    pageSize: 10,
}


class PayrollSheet extends Component {
    adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');

    // only for super admin linked via UserID
    superAdminViewRole = JSON.parse(localStorage.getItem('userInfo')).UserID === 22412;

    filterForm = React.createRef();
    state = {
        data: [],
        orgSettleAcc: [],
        statusList: [],
        filterData: {},
        loading: false,
        changeSubAccModal: false,
        changeFioAndNumberModal: false,
        changeDateModalVisible: false,
        changeStatusModalVisible: false,
        filterType: '',
        id: null,
        subName: '',
        pagination: {
            current: 1,
            pageSize: 10,
        },
        popup: {
            visible: false,
            x: 0,
            y: 0
        },
    };

    fetchData = async () => {
        try {
            const orgSettleAcc = await HelperServices.getOrganizationsSettlementAccountList();
            const stsList = await HelperServices.getStatusList();
            this.setState({ orgSettleAcc: orgSettleAcc.data, statusList: stsList.data })
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

        this.fetch({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            ...filters,
        },
            this.state.filterData,
        );
    };

    ChangeSubAccModal = (id, subName) => {
        this.setState({
            changeSubAccModal: true,
            id: id,
            subName: subName
        });
    };

    handleChangeSubAccCancel = () => {
        // console.log('cancel')
        this.setState({ changeSubAccModal: false });
    };

    handleChangeFioAndNumberCancel = () => {
        // console.log('cancel')
        this.setState({ changeFioAndNumberModal: false });
    };

    handleOnCreate = (values) => {
        this.setState({ changeSubAccModal: false, loading: true });
        PayrollSheetServices.ChangeSubAcc(values)
            .then(res => {
                const { pagination } = this.state;
                this.fetch({ pagination }, null, values);
            })
            .catch(err => Notification('error', err))
    };

    fetch = (params = {}, filterFormValues) => {
        let filter = {};
        console.log(filterFormValues);

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

        if (filterFormValues.EndDate === null) {
            date.EndDate = '';
        }
        if (filterFormValues.StartDate === null) {
            date.StartDate = '';
        }

        PayrollSheetServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
            // console.log(data)
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

    search = () => {
        const filterValues = this.filterForm.current.getFieldsValue();
        this.setState({ loading: true });
        this.fetch({ pagination: defaultPagination }, filterValues);
    };

    deleteRowHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        PayrollSheetServices.delete(id)
            .then((res) => {
                if (res.status === 200) {
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => Notification('error', err));
    };

    acceptHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        let data = {};
        data.DocumentID = id;
        PayrollSheetServices.Accept(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', this.props.t('accepted'));
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                // console.log(err)
                Notification('error', err);
                this.setState({ loading: false });
            });
    };

    declineHandler = (id) => {
        this.setState({ loading: true });
        const { pagination, filterData } = this.state;
        let data = {};
        data.DocumentID = id;
        PayrollSheetServices.NotAccept(id)
            .then((res) => {
                if (res.status === 200) {
                    Notification('success', this.props.t('notAccepted'));
                    this.fetch({ pagination }, filterData);
                }
            })
            .catch((err) => {
                // console.log(err)
                Notification('error', err);
                this.setState({ loading: false });
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

    // change date modal
    openChangeDateModalHandler = (id) => {
        this.setState({ changeDateModalVisible: true, rowId: id });
    }

    closeChangeDateModalHandler = (values) => {
        values.ID = this.state.rowId;
        this.setState({ changeDateModalVisible: false });
        if (values.Date) {
            PayrollSheetServices.changeDate(values)
                .then(res => {
                    if (res.status === 200) {
                        Notification('success', this.props.t('edited'));
                        const { pagination, filterData } = this.state;
                        this.fetch({ pagination }, filterData);
                    }
                })
                .catch((err) => {
                    Notification('error', err);
                    this.setState({ loading: false });
                });
        }
    }
    // change date modal

    // change status modal
    openChangeStatusModalHandler = (values) => {
        this.setState({ changeStatusModalVisible: true, rowId: values.id, statusID: values.status });
    }

    closeChangeStatusModalHandler = (values) => {
        this.setState({ changeStatusModalVisible: false });
    }

    closeChangeStatusModalOkHandler = (values) => {
        const filterValues = this.filterForm.current.getFieldsValue();
        this.setState({ changeStatusModalVisible: false });
        const { pagination } = this.state;
        setTimeout(() => {
            this.fetch({ pagination }, filterValues);
        }, 50);
    }
    // change status modal

    render() {
        const { t } = this.props;
        const columns = [
            {
                title: t("id"),
                dataIndex: "ID",
                key: "ID",
                sorter: true,
                render: (_, record) => {
                    if (record.StatusID === 2) {
                        return record.ID;
                    } else {
                        return <span style={{ color: 'red' }}>{record.ID}</span>
                    }
                }
            },
            {
                title: t("personnelNumber"),
                dataIndex: "Number",
                key: "Number",
                sorter: true,
                width: 100
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
                sorter: true,
                width: 120
            },
            {
                title: t("Sum"),
                dataIndex: "Sum",
                key: "Sum",
                sorter: true,
                width: 120,
                render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
            },
            {
                title: t("DivName"),
                dataIndex: "DivName",
                key: "DivName",
                sorter: true,
                width: 120
            },
            {
                title: t("DprName"),
                dataIndex: "DprName",
                key: "DprName",
                sorter: true,
                width: 120
            },
            {
                title: t("Status"),
                dataIndex: "Status",
                key: "Status",
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
                title: t("SubcName"),
                dataIndex: "SubcName",
                key: "SubcName",
                sorter: true,
            },
            {
                title: t("SubName"),
                dataIndex: "SubName",
                key: "SubName",
                sorter: true,
                width: 160
            },
            {
                title: t("SettleCode"),
                dataIndex: "SettleCode",
                key: "SettleCode",
                sorter: true,
                width: 150
            },
            {
                title: t("Comment"),
                dataIndex: "Comment",
                key: "Comment",
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
                            {this.superAdminViewRole &&
                                <Tooltip title={t('changeStatus')}>
                                    <span onClick={() => this.openChangeStatusModalHandler({
                                        id: record.ID,
                                        status: record.StatusID,
                                    })}>
                                        <i className="feather icon-check-square action-icon"></i>
                                    </span>
                                </Tooltip>
                            }
                            {this.adminViewRole &&
                                <Tooltip title={t('changeDate')}>
                                    <span onClick={() => this.openChangeDateModalHandler(record.ID)}>
                                        <i className="far fa-clock action-icon"></i>
                                    </span>
                                </Tooltip>
                            }
                            {/* <Tooltip title={t('accept')}>
                                <span onClick={() => this.acceptHandler(record.ID)}>
                                <i className="far fa-check-circle action-icon" />
                                </span>
                            </Tooltip>
                            <Popconfirm
                                title={t('decline')}
                                onConfirm={() => this.declineHandler(record.ID)}
                                okText={t("yes")}
                                cancelText={t("cancel")}
                            >
                                <Tooltip title={t('notAccept')}>
                                <span>
                                    <i className="far fa-times-circle action-icon" />
                                </span>
                                </Tooltip>
                            </Popconfirm> */}
                            {/* <Tooltip title={t('changeSubAcc')}>
                                <span
                                className={classes.ModalOpener}
                                // to={`${this.props.match.path}/edit/${record.ID}`}
                                onClick={() => this.ChangeSubAccModal(record.ID, record.SubName)}
                                >
                                <i
                                    className='feather icon-repeat action-icon'
                                    aria-hidden="true"
                                />
                                </span>
                            </Tooltip> */}
                            <Tooltip title={t('Edit')}>
                                <Link
                                    to={`${this.props.match.path}/edit/${record.ID}`}
                                >
                                    <i
                                        className='feather icon-edit action-icon'
                                        aria-hidden="true"
                                    />
                                </Link>
                            </Tooltip>
                            <Tooltip title={t('Delete')}>
                                <Popconfirm
                                    title="Sure to delete?"
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

        const { data, pagination, loading, changeSubAccModal, id, subName, changeDateModalVisible, changeStatusModalVisible, rowId, statusID, } = this.state;

        return (
            <Card title={t("PayrollSheet")}>
                <Fade>
                    <div className="table-top">
                        <Form
                            ref={this.filterForm}
                            onFinish={this.onFinish}
                            layout='vertical'
                            className='table-filter-form'
                            initialValues={{
                                EndDate: moment().add(30, "days"),
                                StartDate: moment().subtract(30, "days"),
                            }}
                        >
                            <div className="main-table-filter-elements">
                                <Form.Item
                                    name="filterType"
                                    label={t("Filter Type")}>
                                    <Select
                                        allowClear
                                        style={{ width: 180 }}
                                        placeholder={t("Filter Type")}
                                        onChange={this.filterTypeHandler}
                                    >
                                        <Option value="ID">{t('id')}</Option>
                                        <Option value="Number">{t('number')}</Option>
                                    </Select>
                                </Form.Item>

                                {this.adminViewRole &&
                                    <Form.Item
                                        label={t("orgId")}
                                        name="OrgID"
                                        rules={[
                                            {
                                                required: false,
                                                message: t('inputValidData'),
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder={t("orgId")}
                                        />
                                    </Form.Item>
                                }

                                <Form.Item
                                    label={t("search")}
                                    name="Search">
                                    <Input.Search
                                        className="table-search"
                                        placeholder={t("search")}
                                        enterButton
                                        onSearch={this.search}
                                    />
                                </Form.Item>

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

                                <Form.Item
                                    name="SettleCode"
                                    label={t("SettleCode")}>
                                    <Select
                                        allowClear
                                        placeholder={t("SettleCode")}
                                        style={{ width: 270 }}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }>
                                        {this.state.orgSettleAcc.map(item => <Option key={item.ID} value={item.ID}>{item.Code}</Option>)}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="Status"
                                    label={t("status")}>
                                    <Select
                                        allowClear
                                        placeholder={t("Status")}
                                        style={{ width: 200 }}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {this.state.statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
                                    </Select>
                                </Form.Item>
                                <Button type="primary" htmlType="submit" style={{ marginTop: 30 }}>
                                    <i className="feather icon-refresh-ccw" />
                                </Button>
                                {changeSubAccModal &&
                                    <ChangeSubAccModal
                                        id={id}
                                        subName={subName}
                                        visible={changeSubAccModal}
                                        onCancel={this.handleChangeSubAccCancel}
                                        onCreate={this.handleOnCreate}
                                    />
                                }

                                <Link to={`${this.props.match.path}/add`}>
                                    <Button type="primary" style={{ marginTop: 30 }} disabled>
                                        {t("add-new")}&nbsp;
                                        <i className="fa fa-plus" aria-hidden="true" />
                                    </Button>
                                </Link>
                            </div>
                        </Form>
                    </div>
                </Fade>
                <Fade>
                    <Table
                        bordered
                        size="middle"
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        onChange={this.handleTableChange}
                        rowKey={(record) => record.ID}
                        rowClassName="table-row"
                        className="main-table"
                        showSorterTooltip={false}
                        pagination={{
                            ...pagination,
                            showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
                        }}
                        scroll={{
                            x: "max-content",
                            y: '50vh'
                        }}
                        onRow={(record) => {
                            return {
                                onDoubleClick: () => {
                                    this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
                                },
                                onContextMenu: event => {
                                    event.preventDefault()
                                    if (!this.state.popup.visible) {
                                        const that = this
                                        document.addEventListener(`click`, function onClickOutside() {
                                            that.setState({ popup: { visible: false } })
                                            document.removeEventListener(`click`, onClickOutside);
                                        });

                                        document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
                                            that.setState({ popup: { visible: false } })
                                            document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
                                        })
                                    }
                                    this.setState({
                                        popup: {
                                            record,
                                            visible: true,
                                            x: event.clientX,
                                            y: event.clientY
                                        }
                                    })
                                }
                            };
                        }}
                    />
                </Fade>
                <TableRightClick
                    {...this.state.popup}
                    deleteRow={this.deleteRowHandler}
                    accept={this.acceptHandler}
                    notAccept={this.declineHandler}
                    parentPath={this.props.match.path}
                />

                <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={changeDateModalVisible}
                    timeout={300}
                >
                    <ChangeDateModal
                        visible={changeDateModalVisible}
                        id={rowId}
                        onCancel={this.closeChangeDateModalHandler}
                    />
                </CSSTransition>

                {/* change status modal added here */}
                <CSSTransition
                    mountOnEnter
                    unmountOnExit
                    in={changeStatusModalVisible}
                    timeout={300}
                >
                    <ChangeStatusModal
                        visible={changeStatusModalVisible}
                        id={rowId}
                        statusID={statusID}
                        onCancel={this.closeChangeStatusModalHandler}
                        onOk={this.closeChangeStatusModalOkHandler}
                    />
                </CSSTransition>
            </Card>
        );
    }
}

export default withTranslation()(PayrollSheet);
