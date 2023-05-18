import ApiServices from "../../../api.services";

const baseUrl = "IndexationOfSalary/";

const IndexationOfSalaryServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Number=${filter.Number ? filter.Number : ''}&Search=${filter.Search ? filter.Search : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status : ''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}`
    );
  },

  getTableData(id, pageNumber, pageLimit, sortColumn, orderType, filterValues = {}) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetTableData?DocumentID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&PersonNumber=${filterValues.PersonNumber ? filterValues.PersonNumber : ''}&EmpFullName=${filterValues.EmpFullName ? filterValues.EmpFullName : ''}`
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  deleteTableRow(ids) {
    let idText = '';
    ids.forEach(item => {
      idText = idText + 'IdList=' + item + '&';
    })

    return ApiServices.delete(`${baseUrl}DeleteTableRows?${idText}`);
  },

  clearTable(id) {
    return ApiServices.delete(`${baseUrl}DeleteTable?id=${id}`);
  },

  printRow(id) {
    return ApiServices.get(
      `${baseUrl}Print?id=${id}`,
      {responseType: "blob"}
    );
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  saveTableRow(data) {
    return ApiServices.post(`${baseUrl}SaveTableRow`, data);
  },

  fillTableData(data) {
    return ApiServices.post(`${baseUrl}FillIndexationOfSalary`, data);
  },

  calculate(id) {
    return ApiServices.post(`${baseUrl}Calculate?DocumentID=${id}`);
  },
  
  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
};

export default IndexationOfSalaryServices;
