import ApiServices from "../../../api.services";

const baseUrl = "EmployeeEnrolment/";

const EmployeeEnrolmentServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}&Search=${filter.Search ? filter.Search : ''}&PosName=${filter.PosName ? filter.PosName : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status :''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&psList=${filterFormValues.psList ? filterFormValues.psList : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}`);
  },

  postDataFillTableData(data) {
    return ApiServices.post(`${baseUrl}FillEmployeeEnrolment`, data);
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  }, 

  postTableData(data) {
    return ApiServices.post(`${baseUrl}CalculateEmployeeEnrolmentSum?Calculate=true`, data);
  },
  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
};

export default EmployeeEnrolmentServices;
