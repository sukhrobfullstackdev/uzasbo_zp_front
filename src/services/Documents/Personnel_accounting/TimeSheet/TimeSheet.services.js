import ApiServices from "../../../api.services";

const baseUrl = "TimeSheet/";

const TimeSheetServices = {
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

  getTimeSheetTableData(id, pageNumber, pageLimit, sortColumn, orderType, filterValues = {}) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetTimeSheetTableData?ID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&PersonNumber=${filterValues.PersonNumber ? filterValues.PersonNumber : ''}&EmpFullName=${filterValues.EmpFullName ? filterValues.EmpFullName : ''}`
    );
  },

  printById(id) {
    return ApiServices.get(`${baseUrl}Print?DocumentID=${id}`, { responseType: "blob" })
  },

  printMF(payload) {
    return ApiServices.get(`${baseUrl}PrintMF`, { responseType: "blob", params: payload })
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

    return ApiServices.delete(`${baseUrl}DeleteTimeSheetTableRows?${idText}`);
  },

  clearTable(id) {
    return ApiServices.delete(`${baseUrl}DeleteTimeSheetTable?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postData(data) {
    console.log(data);
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  saveTableRow(data) {
    return ApiServices.post(`${baseUrl}SaveTimeSheetTableRow`, data);
  },

  createTimeSheetMainData(data) {
    return ApiServices.post(`${baseUrl}CreateTimeSheetMainData`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },

  printTimeSheetByDate(payload) {
    return ApiServices.get(`${baseUrl}PrintByDate`, { responseType: "blob", params: payload });
  },
};

export default TimeSheetServices;
