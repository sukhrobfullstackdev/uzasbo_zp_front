import ApiServices from "../../../api.services";

const baseUrl = "FixingTransaction/";

const FixingTransactionServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Search=${filter.Search ? filter.Search : ''}`
    );
  },
  
  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  getSalaryCalculationTableData(id, pageNumber, pageLimit, sortColumn, orderType, filterFormValues = {}) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetSalaryCalculationTableData?ID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&PersonNumber=${filterFormValues.PersonNumber ? filterFormValues.PersonNumber : ''}&EmpFullName=${filterFormValues.EmpFullName ? filterFormValues.EmpFullName : ''}`
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  changeScholarship(id) {
    return ApiServices.get(`${baseUrl}ChangeIsScholarship?DocumentID=${id}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  calculate(data, calculate = false) {
    return ApiServices.post(`${baseUrl}Calculate?Calculate=${calculate}`, data);
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

  send(id) {
    return ApiServices.post(`${baseUrl}SendSalaryCalculation?ID=${id}`);
  },

  printType(id, key) {
    return ApiServices.get(`${baseUrl}Print?ID=${id}&text=${key}`,
    {responseType: "blob"}
    );
  },
};

export default FixingTransactionServices;
