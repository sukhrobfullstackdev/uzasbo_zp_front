// import React, { Component } from "react";
// import { Table, Input, Form, Button, Space, Tooltip } from "antd";
// import { withTranslation } from "react-i18next";
// // import { Link } from "react-router-dom";
// import { Fade } from "react-awesome-reveal";
// import { Notification } from "../../../../../helpers/notifications";
// import MinimalSalaryServices from "../../../../../services/References/Global/MinimalSalary/MinimalSalary.services";
// import Card from "../../../../components/MainCard";
// import classes from "./MinimalSalary.module.css";
// import { CSSTransition } from "react-transition-group";
// import UpdateMinimalSalaryModal from "./components/UpdateMinimalSalaryModal";

// class MinimalSalary extends Component {
//     adminViewRole = JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS');
//     state = {
//         data: [],
//         pagination: {
//             current: 1,
//             pageSize: 10,
//         },
//         loading: false,
//         updateMinSalaryModal: false,
//         rowItem: null,
//     };

//     componentDidMount() {
//         const { pagination } = this.state;
//         this.fetch({ pagination }, this.state.filterData);
//     }

//     handleTableChange = (pagination, filters, sorter) => {
//         this.fetch(
//             {
//                 sortField: sorter.field,
//                 sortOrder: sorter.order,
//                 pagination,
//                 ...filters,
//             },
//             this.state.filterData
//         );
//     };
//     fetch = (params = {}, searchCode) => {
//         this.setState({ loading: true });
//         let pageNumber = params.pagination.current,
//             pageLimit = params.pagination.pageSize,
//             sortColumn = params.sortField,
//             orderType = params.sortOrder,
//             search = searchCode ? searchCode : "";

//         MinimalSalaryServices.getList(
//             pageNumber,
//             pageLimit,
//             sortColumn,
//             orderType,
//             search
//         )
//             .then((data) => {
//                 this.setState({
//                     loading: false,
//                     data: data.data.rows,
//                     pagination: {
//                         ...params.pagination,
//                         total: data.data.total,
//                     },
//                 });
//             })
//             .catch((err) => {
//                 Notification('error', err);
//             });
//     };

//     handleDelete = (id) => {
//         const { pagination } = this.state;
//         MinimalSalaryServices.delete(id)
//             .then((data) => {
//                 this.setState({ loading: true });
//                 this.fetch({ pagination });
//             })
//             .catch((err) => Notification('error', err));
//     };

//     search = (value) => {
//         this.setState({ loading: true });
//         const { pagination } = this.state;
//         this.fetch({ pagination }, value);
//     };

//     filterTypeHandler = (type) => {
//         this.setState({ filterType: type });
//     };
//     // End Filter functions

//     render() {
//         const { t } = this.props;
//         const columns = [
//             {
//                 title: t("id"),
//                 dataIndex: "ID",
//                 key: "ID",
//                 sorter: (a, b) => a.code - b.code,

//             },
//             {
//                 title: t("Date"),
//                 dataIndex: "Date",
//                 key: "Date",
//                 sorter: true,
//             },
//             {
//                 title: t("MinimalSalary"),
//                 dataIndex: "MinimalSalary",
//                 key: "MinimalSalary",
//                 sorter: true,
//                 render: record => new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(record)
//             },
//             {
//                 title: t("ChangePercentage"),
//                 dataIndex: "ChangePercentage",
//                 key: "ChangePercentage",
//                 sorter: true,
//             },
//             {
//                 title: t("NormativeAct"),
//                 dataIndex: "NormativeAct",
//                 key: "NormativeAct",
//                 sorter: true,
//             },
//             {
//                 title: t("actions"),
//                 key: "action",
//                 align: "center",
//                 fixed: "right",
//                 width: 80,
//                 render: (record) => {
//                     return (
//                         <Space size="middle">
//                             {this.adminViewRole && (
//                                 <Tooltip title={t("Edit")}>
//                                     <span onClick={() => {
//                                         this.setState({ updateMinSalaryModal: true, rowItem: record });
//                                     }}>
//                                         <i className='feather icon-edit action-icon' aria-hidden="true" />
//                                     </span>
//                                 </Tooltip>
//                             )}
//                         </Space>
//                     );
//                 },
//             },
//         ];

//         const { data, pagination, loading } = this.state;

//         return (
//             <Card title={t("Minimal Salary")}>
//                 <Fade>
//                     <Form onFinish={this.onFinish} className={classes.FilterForm}>
//                         <div className="main-table-filter-elements">
//                             <Form.Item name="Search">
//                                 <Input.Search
//                                     placeholder={t("search")}
//                                     enterButton
//                                     onSearch={this.search}
//                                 />
//                             </Form.Item>
//                             {this.adminViewRole && (
//                                 <Form.Item>
//                                     <Button
//                                         type="primary"
//                                         onClick={() => {
//                                             this.setState({ updateMinSalaryModal: true, rowItem: { ID: 0 } });
//                                         }}
//                                     >
//                                         {t("add-new")}&nbsp;
//                                         <i className="fa fa-plus" aria-hidden="true" />
//                                     </Button>
//                                 </Form.Item>
//                             )}
//                         </div>
//                     </Form>
//                 </Fade>
//                 <Fade>
//                     <Table
//                         columns={columns}
//                         bordered
//                         dataSource={data}
//                         loading={loading}
//                         onChange={this.handleTableChange}
//                         rowKey={(record) => record.ID}
//                         rowClassName="table-row"
//                         className="main-table"
//                         scroll={{
//                             x: "max-content",
//                         }}
//                         pagination={{
//                             ...pagination,
//                             showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
//                         }}
//                         onRow={(record) => {
//                             return {
//                                 onDoubleClick: () => {
//                                     this.setState({ updateMinSalaryModal: true, rowItem: record })
//                                 },
//                             };
//                         }}
//                     />

//                 </Fade>
//                 <CSSTransition
//                     mountOnEnter
//                     unmountOnExit
//                     in={this.state.updateMinSalaryModal}
//                     timeout={300}
//                 >
//                     <UpdateMinimalSalaryModal
//                         visible={this.state.updateMinSalaryModal}
//                         data={this.state.rowItem}
//                         fetch={() => {
//                             const { pagination } = this.state;
//                             this.fetch({ pagination }, this.state.filterData);
//                         }}
//                         onCancel={() => {
//                             this.setState({ updateMinSalaryModal: false });
//                         }}
//                     />
//                 </CSSTransition>
//             </Card>
//         );
//     }
// }

// export default withTranslation()(MinimalSalary);
