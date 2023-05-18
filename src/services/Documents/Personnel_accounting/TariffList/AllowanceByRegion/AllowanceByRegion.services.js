import ApiServices from "../../../../api.services";
const baseUrl = "AllowanceByRegion/";

const AllowanceByRegionServices = {
  getSendList(pageNumber, pageLimit, sortColumn, orderType, search, filter, filterFormValues) {
    console.log(filterFormValues);
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Search=${filter.Search ? filter.Search : ''}&Status=${filterFormValues.Status ? filterFormValues.Status : ''}&Search=${search ? search : ''}`
    );
  },

  getAll(data){
    return ApiServices.get(`${baseUrl}GetAll?StartYear=${data}&ClassNumber1${data}`);
  },
  // getAll(data){
  //   return ApiServices.get(`${baseUrl}GetAll`, data);
  // },

  printRow(id, tableId) {
    return ApiServices.get(
      `${baseUrl}Print?id=${id}&TableID=${tableId}`,
      {responseType: "blob"}
    );
  },

  printForm(data) {
    return ApiServices.get(
      `${baseUrl}PrintRegistery?StartYear=${data}`,
      {responseType: "blob"}
    );
  },

  GetWithStartYear(data) {
    return ApiServices.get(`${baseUrl}GetWithStartYear?id=${data}`);
  },

  printById(id) {
    return ApiServices.get(
      `${baseUrl}Print?ID=${id}`,
      {responseType: "blob"}
    );
  },

  archieveById(id) {
    return ApiServices.getForArchieve(
      `${baseUrl}Archieve?ID=${id}`
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

  Accept(id) {
    return ApiServices.post(`${baseUrl}AcceptReceived?id=${id}`);
  },

  Send(id) {
    return ApiServices.post(`${baseUrl}SendHeader?id=${id}`);
  },

  NotAccept(value) {
    return ApiServices.post(`${baseUrl}CancelReceived?id=${value.ID}`);
  },
};

export default AllowanceByRegionServices;
