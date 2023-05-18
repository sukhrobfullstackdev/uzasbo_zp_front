import ApiServices from "../../../api.services";

const baseUrl = "TimeSheetEdu/";

const TimeSheetEduServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}&Search=${filter.Search ? filter.Search : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status : ''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}`
    );
  },

  getTimeSheetEduTableData(id, pageNumber, pageLimit, sortColumn, orderType, filterValues = {}) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetTimeSheetEduTableData?ID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&PersonNumber=${filterValues.PersonNumber ? filterValues.PersonNumber : ''}&EmpFullName=${filterValues.EmpFullName ? filterValues.EmpFullName.trim() : ''}`
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  deleteTableRow(ids) {
    let idText = '';
    ids.forEach(item => {
      idText = idText + 'ids=' + item + '&';
    })

    return ApiServices.delete(`${baseUrl}DeleteTimeSheetEduTableRows?${idText}`);
  },

  clearTable(id) {
    return ApiServices.delete(`${baseUrl}DeleteTimeSheetEduTable?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  saveTableRow(data) {
    return ApiServices.post(`${baseUrl}SaveTimeSheetEduTableRow`, data);
  },

  createTimeSheetEduMainData(data) {
    return ApiServices.post(`${baseUrl}CreateTimeSheetEduMainData`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
};

export default TimeSheetEduServices;
