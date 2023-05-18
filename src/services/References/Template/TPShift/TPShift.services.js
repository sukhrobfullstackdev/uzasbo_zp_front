import ApiServices from "../../../api.services";

const baseUrl = "TPShift/";

const TPShiftServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, search, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}
      &PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}
      &Search=${filter.Search ? filter.Search : ''}&Date=${filter.Date ? filter.Date : ''}`
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default TPShiftServices;
