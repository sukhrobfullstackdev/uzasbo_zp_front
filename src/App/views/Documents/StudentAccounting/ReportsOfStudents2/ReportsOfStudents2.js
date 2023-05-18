// import React, { Component } from "react";
// import { Table, Input, Form, Button, Select, Space } from "antd";
// import { withTranslation } from "react-i18next";
// import { Fade } from "react-awesome-reveal";
// import moment from "moment";
// import classes from "./ReportsOfStudents.module.css";
// import ReportOfStudentsServices from "../../../../../services/Documents/StudentAccounting/ReportOfStudents/ReportOfStudents.services";
// import HelperServices from "../../../../../services/Helper/helper.services";
// import Card from "../../../../components/MainCard";
// // import Popup from "./Popup";
// import { Notification } from "../../../../../helpers/notifications";

// const { Option } = Select;
// const defaultPagination = {
//   current: 1,
//   pageSize: 10,
// }

// class ReportOfStudents extends Component {
//   // filterForm = React.createRef();
//   state = {
//     data: [],
//     divisionList: [],
//     facultyList: [],
//     psList: [],
//     statusList: [],
//     filterData: {},
//     pagination: {
//       current: 1,
//       pageSize: 10,
//     },
//     loading: false,
//     filterType: ''
//   };

//   fetchData = async () => {
//     try {
//       const divisionLs = await HelperServices.GetDivisionList();
//       const stsList = await HelperServices.getStatusList();
//       this.setState({  statusList: stsList.data, divisionList: divisionLs.data })
//     } catch (err) {
//       Notification('error', err);
//       // console.log(err);
//     }
//   }

//   componentDidMount() {
//     this.fetchData();
//     const { pagination } = this.state;
//     this.fetch({ pagination }, {});
//   }

//   handleTableChange = (pagination, filters, sorter) => {
//     this.fetch(
//       {
//         sortField: sorter.field,
//         sortOrder: sorter.order,
//         pagination,
//         ...filters,
//       },
//       this.state.filterData,
//     );
//   };

//   fetch = (params = {},  filterFormValues) => {
//     let filter = {};
//     if (this.state.filterType) {
//       filter[this.state.filterType] = filterFormValues.Search ? filterFormValues.Search : '';
//     }
//     this.setState({ loading: true });
//     let pageNumber = params.pagination.current,
//       pageLimit = params.pagination.pageSize,
//       sortColumn = params.sortField,
//       orderType = params.sortOrder

//     const date = {
//       EndDate: filterFormValues.EndDate ? filterFormValues.EndDate.format("DD.MM.YYYY") : moment().add(30, "days").format("DD.MM.YYYY"),
//       StartDate: filterFormValues.StartDate ? filterFormValues.StartDate.format("DD.MM.YYYY") : moment().subtract(30, "days").format("DD.MM.YYYY"),
//     };
//       ReportOfStudentsServices.getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues)
//       .then((data) => {
//         this.setState({
//           loading: false,
//           data: data.data.rows,
//           pagination: {
//             ...params.pagination,
//             total: data.data.total,
//           },
//         });
//       })
//       .catch((err) => {
//         // window.alert(err);
//         Notification('error', err);
//       });
//   }; 

//    divisionChangeHandler = (divisionId) => {
//   // console.log(divisionId);
//    const facultyList = HelperServices.getFakultitetList(divisionId)
//     .then(res => {
//       this.getFakultitetList(res.data);

//     })
//     .catch(err => Notification('error', err))
//   }

//   search = () => {
//     const filterValues = this.filterForm.current.getFieldsValue();
//     this.setState({ loading: true });
//     this.fetch({ pagination: defaultPagination }, filterValues);
//   };

//   onFinish = (values) => {
//     this.setState({ loading: true, filterData: values });
//     this.fetch({ pagination: defaultPagination }, values);
//   };

//   filterTypeHandler = (type) => {
//     this.setState({ filterType: type });
//   };

//   // End Filter functions

//   render() {
//     const { t } = this.props;
//     const columns = [
      
//       {
//         title: t("PersonnelNumber"),
//         dataIndex: "PersonnelNumber",
//         key: "PersonnelNumber",
//         sorter: true,
//         width: 100
//       },
//       {
//         title: t("Course"),
//         dataIndex: "Course",
//         key: "Course",
//         sorter: true,
//         // width: 80
//       },
//       {
//         title: t("BeginDate"),
//         dataIndex: "BeginDate",
//         key: "BeginDate",
//         sorter: true,
//         width: 100
//       },
//       {
//         title: t("EndDate"),
//         dataIndex: "EndDate",
//         key: "EndDate",
//         sorter: true,
//         width: 100
//       },
      
//       {
//         title: t("IsChacked"),
//         dataIndex: "IsChacked",
//         key: "IsChacked",
//         // sorter: true,
//         // width: 100
//       },
//       {
//         title: t("EmployeePhoneNumber"),
//         dataIndex: "EmployeePhoneNumber",
//         key: "EmployeePhoneNumber",
//         sorter: true,
//         // width: 100
//       },
//       {
//         title: t("EmployeePINFL"),
//         dataIndex: "EmployeePINFL",
//         key: "EmployeePINFL",
//         sorter: true,
//         width: 100
//       },
   
//       {
//         title: t("DateOfBirth"),
//         dataIndex: "DateOfBirth",
//         key: "DateOfBirth",
//         sorter: true,
//         // width: 100
//       },
     
//       {
//         title: t("actions"),
//         key: "action",
//         align: "center",
//         fixed: 'right',
//          width: 200,
//         render: (record) => {
//           return (
//             <Space size="middle">
//               {/* <Tooltip title={t("Accept")}>
//                 <span onClick={() => this.acceptHandler(record.ID)}>
//                   <i className="far fa-check-circle action-icon" />
//                 </span>

//               </Tooltip>

//                */}
             
//             </Space>
//           );
//         },
//       },
//     ];

//     const { data, pagination, loading } = this.state;

//     return (
//       <Card title={t("ReportsOfStudents")}>
//         <Fade>
//           <div className="table-top">
//             <Form
//               layout='vertical'
//             // ref={this.filterForm}
//               onFinish={this.onFinish}
//               className='table-filter-form'
//               initialValues={{
//                 EndDate: moment().add(30, "days"),
//                 StartDate: moment().subtract(30, "days"),
//               }}>
//               <div className="main-table-filter-elements">

//                 <Form.Item
//                   name={t("filterType")}
//                   label={t("filterType")}>
//                   <Select
//                     allowClear
//                     style={{ width: 150 }}
//                     placeholder={t("filterType")}
//                     onChange={this.filterTypeHandler}>
//                     <Option value="ID">{t('id')}</Option>
//                     <Option value="PersonnelNumber">{t('personnelNumber')}</Option>
                 
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   label={t("search")}
//                   name="Search">

//                   <Input.Search
//                     className="table-search"
//                     placeholder={t("search")}
//                     enterButton
//                     onSearch={this.search}
//                   />
//                 </Form.Item>

//                 <Form.Item
//                   name="DivisionID"
//                   label={t("DprName")}>
//                   <Select
//                     allowClear
//                     showSearch
//                     placeholder={t("DprName")}
//                     style={{ width: 240 }}
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                     }
//                     onChange={this.divisionChangeHandler}
//                     >
//                     {this.state.divisionList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   name="FacultyName"
//                   label={t("FacultyName")}>
//                   <Select
//                     allowClear
//                     showSearch
//                     placeholder={t("FacultyName")}
//                     style={{ width: 240 }}
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                     }>
//                     {this.state.facultyList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
//                   </Select>
//                 </Form.Item>

//                 {/* <Form.Item
//                   name="Status"
//                   label={t("Status")}>
//                   <Select
//                     allowClear
//                     showSearch
//                     placeholder={t("Status")}
//                     style={{ width: 180 }}
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                     }>
//                     {this.state.statusList.map(item => <Option key={item.ID} value={item.ID}>{item.DisplayName}</Option>)}
//                   </Select>
//                 </Form.Item> */}

//                 {/* <Form.Item
//                   name="DprName"
//                   label={t("DprName")}>
//                   <Select
//                     allowClear
//                     showSearch
//                     placeholder={t("DprName")}
//                     style={{ width: 180 }}
//                     optionFilterProp="children"
//                     filterOption={(input, option) =>
//                       option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
//                     }>
//                     {this.state.departmentList.map(item => <Option key={item.ID} value={item.ID}>{item.ShortName}</Option>)}
//                   </Select>
//                 </Form.Item> */}
//                 <div className={classes.Button_two}>
//                 <Button type="primary" htmlType="submit">
//                   <i className="feather icon-refresh-ccw" />
//                 </Button>

//                 </div>
//               </div>
//             </Form>
//           </div>
//         </Fade>
//         <Fade>
//           <Table
//             bordered            
//             size="middle"
//             rowClassName="table-row"
//             className="main-table"
//             columns={columns}
//             dataSource={data}
//             loading={loading}
//             showSorterTooltip={false}
//             onChange={this.handleTableChange}
//             rowKey={(record) => record.ID}
//             pagination={{
//               ...pagination,
//               showTotal: (total, range) => `${range[0]} - ${range[1]} / ${total}`,
//             }}
//             scroll={{
//               x: "max-content",
//               y: '50vh'
//             }}
//             onRow={(record) => {
//               return {
//                 onDoubleClick: () => {
//                   this.props.history.push(`${this.props.match.path}/edit/${record.ID}`);
//                 },
//                 onContextMenu: event => {
//                   event.preventDefault()
//                   if (!this.state.popup.visible) {
//                     const that = this
//                     document.addEventListener(`click`, function onClickOutside() {
//                       that.setState({ popup: { visible: false } })
//                       document.removeEventListener(`click`, onClickOutside);
//                     });

//                     document.querySelector('.ant-table-body').addEventListener(`scroll`, function onClickOutside() {
//                       that.setState({ popup: { visible: false } })
//                       document.querySelector('.ant-table-body').removeEventListener(`scroll`, onClickOutside);
//                     })
//                   }
//                   // this.setState({
//                   //   popup: {
//                   //     record,
//                   //     visible: true,
//                   //     x: event.clientX,
//                   //     y: event.clientY
//                   //   }
//                   // })
//                 }
//               };
//             }}
//           />

//         </Fade>
//         {/* <Popup
//           {...this.state.popup}
//           deleteRow={this.deleteRowHandler}
//           acceptRow={this.acceptHandler}
//           notAcceptRow={this.declineHandler} /> */}
//       </Card>
//     );
//   }
// }

// export default withTranslation()(ReportOfStudents);
