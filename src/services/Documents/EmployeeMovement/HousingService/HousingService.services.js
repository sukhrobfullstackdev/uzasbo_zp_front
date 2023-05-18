import ApiServices from "../../../api.services";

const baseUrl = "HousingService/";

const HousingServiceServices = {
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

  getTimeSheetTableData(id, pageNumber, pageLimit, sortColumn, orderType) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetTimeSheetTableData?ID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}`
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  deleteTableData(id) {
    return ApiServices.delete(`${baseUrl}DeleteTableRow?id=${id}`);
  },

  deleteTableRow(ids) {
    let idText = '';
    ids.forEach(item => {
      idText = idText + 'ids=' + item + '&';
    })

    return ApiServices.delete(`${baseUrl}DeleteTableRows?${idText}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  createTimeSheetMainData(data) {
    return ApiServices.post(`${baseUrl}CreateMainData`, data);
  },

  Accept(data) {
    return ApiServices.post(`${baseUrl}Accept`, data);
  },

  NotAccept(data) {
    return ApiServices.post(`${baseUrl}NotAccept`, data);
  },
};

export default HousingServiceServices;
