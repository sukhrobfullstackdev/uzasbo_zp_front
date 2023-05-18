import ApiServices from "../../../api.services";

const baseUrl = "PayrollSheet/";
const baseEmpluyeeUrl = "Employee/"
//const baseHelperUrl = "Helper/"

const PayrollSheetServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrgID=${filterFormValues.OrgID ? filterFormValues.OrgID : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Number=${filter.Number ? filter.Number : ''}&Search=${filter.Search ? filter.Search : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status : ''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}`
    );
  },

  getPayrollTableData(id, pageNumber, pageLimit, sortColumn, orderType, filter = {}) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetTableData?ID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}&Search=${filter.Search ? filter.Search : ''}`
    );
  },
  
  getModalList(pageNumber, pageLimit, sortColumn, orderType, filter, filterFormValues, ParentID) {
    if (ParentID === 18 || 19) {
      return ApiServices.get(`${baseEmpluyeeUrl}GetWorkingEmployeesNoParameterList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&FullName=${filter.FullName ? filter.FullName : ''}`);
    } else if (ParentID === 63) {
      return ApiServices.get(
        `${baseEmpluyeeUrl}GetList?ID=${filterFormValues.ID}&PersonnelNumber=${filterFormValues.PersonnelNumber}&FullName=${filterFormValues.FullName}&INN=${filterFormValues.INN}&DateOfBirth=${filterFormValues.DateOfBirth}&EmployeeTypeID=${filterFormValues.EmpType}&SortColumn=${sortColumn}&OrderType=${orderType}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&INPSCode=${filterFormValues.INPSCode ? filterFormValues.INPSCode : ''}&PlasticCardNumber=${filterFormValues.PlasticCardNumber ? filterFormValues.PlasticCardNumber : ''}`
      );
    }
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  deleteTableData(id) {
    return ApiServices.delete(`${baseUrl}DeleteTimeSheetTableRow?id=${id}`);
    
  },

  deleteTableRow(ids) {
    let idText = '';
    ids.forEach(item => {
      idText = idText + 'ids=' + item + '&';
    })

    return ApiServices.delete(`${baseUrl}DeleteRows?${idText}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  CalculateSum(id) {
    return ApiServices.get(`${baseUrl}CalculateSum?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  addEmployeeTable(data) {
    return ApiServices.post(`${baseUrl}Add?`, data);
  },

  getPayrollTable(data) {
    return ApiServices.post(`${baseUrl}AddEmployeeTable?EmployeeID=${data.EmployeeID}&OwnerID=${data.OwnerID}&InSum=${data.InSum}`);
  },

  saveTableRow(data) {
    return ApiServices.post(`${baseUrl}SaveTableRow`, data);
  },

  clearTable(id) {
    return ApiServices.delete(`${baseUrl}DeleteTable?id=${id}`);
  },

  CreatePayrollSheetMainData(data) {
    return ApiServices.post(`${baseUrl}CreatePayrollSheetMainData`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },

  send(id) {
    return ApiServices.post(`${baseUrl}SendSigned?ID=${id}`);
  },

  UpdateDocumentFIOAndNumber(id){
    return ApiServices.post(`${baseUrl}UpdateDocumentFIOAndNumber?id=${id}`);
  },

  ChangeSubAcc(values) {
    return ApiServices.post(`${baseUrl}ChangeSubAcc?ID=${values.ID}&SubAccDbID=${values.SubAccDbID}`);
  },

  changeDate(values) {
    return ApiServices.get(`${baseUrl}ChangeDate?DocumentID=${values.ID}&Date=${values.Date}`);
  },
  // Change Status By Admin
  ChangeStatusByAdmin(values) {
    return ApiServices.get(`${baseUrl}ChangeStatusByAdmin?DocumentID=${values.DocumentID}&StatusID=${values.StatusID}`);
  },
};

export default PayrollSheetServices;
