// import React, { Component } from "react";
// import { Table, Tag, Input, Form, Select, Button } from "antd";
// import { withTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
// import { Fade } from "react-awesome-reveal";
// import { Notification } from "../../../../../helpers/notifications";
// import CalculationKindServices from "../../../../../services/References/Global/CalculationKind/CalculationKind.services";
// import Card from "../../../../components/MainCard";
// import classes from "./CalculationKind.module.css";

// const { Option } = Select;

// class CalculationKind extends Component {
//    state = {
//       data: [],
//       pagination: {
//         current: 1,
//         pageSize: 10,
//       },
//       loading: false,
//     };


//   componentDidMount() {
//     const { pagination } = this.state;
//     this.fetch({ pagination }, this.state.filterData);
//   }

//   handleTableChange = (pagination, filters, sorter) => {
//     this.fetch(
//       {
//         sortField: sorter.field,
//         sortOrder: sorter.order,
//         pagination,
//         ...filters,
//       },
//       this.state.filterData
//     );
//   };

//   fetch = (params = {}, searchCode) => {
//     let values = {};
//     values[this.state.filterType] = searchCode ? searchCode : "";
//     this.setState({ loading: true });
//     let pageNumber = params.pagination.current,
//       pageLimit = params.pagination.pageSize,
//       sortColumn = params.sortField,
//       orderType = params.sortOrder;

//     CalculationKindServices.getList(
//       pageNumber,
//       pageLimit,
//       sortColumn,
//       orderType,
//       values,
//       searchCode
//     )
//       .then((data) => {
//           this.setState({
//             loading: false,
//             data: data.data.rows,
//             pagination: {
//               ...params.pagination,
//               total: data.data.total,
//             },
//           });
//       })
//       .catch((err) => {
//         Notification('error', err);
//       });
//   };

//   handleDelete = (id) => {
//     const { pagination } = this.state;
//     CalculationKindServices.delete(id)
//       .then((data) => {
//         this.setState({ loading: true });
//         this.fetch({ pagination });
//       })
//       .catch((err) => Notification('error', err));
//   };

//   // Filter functions

//   search = (value) => {
//     this.setState({ loading: true });
//     const { pagination } = this.state;
//     this.fetch({ pagination }, value);
//   };

//   filterTypeHandler = (type) => {
//     this.setState({ filterType: type });
//   };

//   // End Filter functions

//   render() {
//     const { t } = this.props;
//     const columns = [
//       {
//         title: t("id"),
//         dataIndex: "ID",
//         key: "ID",
//         sorter: (a, b) => a.code - b.code,
        
//       },
//       {
//         title: t("name"),
//         dataIndex: "Name",
//         key: "Name",
//         sorter: true,
//       },
//       {
//         title: t("CalculationType"),
//         dataIndex: "CalculationType",
//         key: "CalculationType",
//         sorter: true,
//       },
//       {
//         title: t("CalculationMethod"),
//         dataIndex: "CalculationMethod",
//         key: "CalculationMethod",
//         sorter: true,
//       },
//       {
//         title: t("Formula"),
//         dataIndex: "Formula",
//         key: "Formula",
//         sorter: true,
//       },
//       {
//         title: t("NormativeAct"),
//         dataIndex: "NormativeAct",
//         key: "NormativeAct",
//         sorter: true,
//       },
//       {
//         title: t("InheritPercentage"),
//         dataIndex: "InheritPercentage",
//         key: "InheritPercentage",
//         sorter: true,
//         render: (record) => {
//           if (record) {
//             return t("yes");
//           } else {
//             return t("no");
//           }
//         },
//       },
//       {
//         title: t("AllowEditChild"),
//         dataIndex: "AllowEditChild",
//         key: "AllowEditChild",
//         sorter: true,
//         render: (record) => {
//           if (record) {
//             return t("yes");
//           } else {
//             return t("no");
//           }
//         },
//       },
//       {
//         title: t("Status"),
//         dataIndex: "State",
//         key: "State",
//         width: "12%",
//         render: (status) => {
//           if (status === "Актив") {
//             return (
//               <Tag color="#87d068" key={status}>
//                 {status}
//               </Tag>
//             );
//           } else if (status === "Пассив") {
//             return (
//               <Tag color="#f50" key={status}>
//                 {status}
//               </Tag>
//             );
//           }
//         },
//       },
//     ];

//     const { data, pagination, loading } = this.state;

//     return (
//       <Card title={t("Calculation Kind")}>
//         <Fade>
//           <div className="table-top">
//             <Form onFinish={this.onFinish} className={classes.FilterForm}>
//               <div className="main-table-filter-elements">
//                 <Form.Item name="filterType">
//                   <Select
//                     style={{ width: 180 }}
//                     placeholder={t("Filter Type")}
//                     onChange={this.filterTypeHandler}
//                     allowClear
//                   >
//                     <Option value="ID">{t("id")}</Option>
//                     <Option value="Search">{t("name")}</Option>
//                   </Select>
//                 </Form.Item>

//                 <Form.Item name="Search">
//                   <Input.Search
//                     placeholder={t("search")}
//                     enterButton
//                     onSearch={this.search}
//                   />
//                 </Form.Item>
//               </div>
//             </Form>

//             <Link to={`${this.props.match.path}/add`}>
//               <Button type="primary" disabled>
//                 {t("add-new")}&nbsp;
//                 <i className="fa fa-plus" aria-hidden="true" />
//               </Button>
//             </Link>
//           </div>
//         </Fade>
//         <Fade>
//           <Table
//             columns={columns}
//             bordered
//             dataSource={data}
//             loading={loading}
//             onChange={this.handleTableChange}
//             rowKey={(record) => record.ID}
//             rowClassName="table-row"
//             className="main-table"
//             scroll={{
//               x: "max-content",
//             }}
//             pagination={{
//               ...pagination,
//               showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
//             }}
//           />
//         </Fade>
//       </Card>
//     );
//   }
// }

// export default withTranslation()(CalculationKind);
