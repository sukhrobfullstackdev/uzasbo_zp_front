import ApiServices from "../../../api.services";

const baseUrl = "EmployeesProfit/";

const EmployeesProfitServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, search, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}&Search=${filter.FullName ? filter.FullName : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filter.Status ? filter.Status : ''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}&Search=${search ? search : ''}`
    );
  },
  postDataFillTableData(data){
    return ApiServices.post(`${baseUrl}FillEmployeesProfit`, data);
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },
  getTableData(id) {   
    return ApiServices.get(`${baseUrl}GetTableData?OwnerID=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
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

export default EmployeesProfitServices;
