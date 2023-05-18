import ApiServices from "../../../api.services";

const baseUrl = "SalaryCalculation/";
const helperUrl = 'Helper/';

const SalaryCalculationServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Number=${filter.Number ? filter.Number : ''}&Search=${filter.Search ? filter.Search : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status : ''}&DivisionID=${filterFormValues.DivisionID ? filterFormValues.DivisionID : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}&OrgID=${filterFormValues.OrgID ? filterFormValues.OrgID : ''}`
    );
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

  getAllSubCalculationKindList(pageNumber, pageLimit, sortColumn, orderType, search, filterType) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }
    return ApiServices.get(`${helperUrl}GetAllSubCalculationKindList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}${filterType ? `&${filterType}=` : ''}${search}`)
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
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
      { responseType: 'blob' }
    );
  },
  
  recalcMemOrder(id) {
    return ApiServices.post(`${baseUrl}ReCalcMemOrder?ID=${id}`);
  },  
  
  changeOutSum(id) {
    return ApiServices.get(`${baseUrl}ChangeOutSum?ID=${id}`);
  },
  
  // Change Status By Admin
  ChangeStatusByAdmin(values) {
    return ApiServices.get(`${baseUrl}ChangeStatusByAdmin?DocumentID=${values.DocumentID}&StatusID=${values.StatusID}`);
  },
};

export default SalaryCalculationServices;
