import ApiServices from "../../../api.services";

const baseUrl = "PensionFundRegistry/";

const PensionFundRegistryServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, search, date, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${
        orderType ? orderType : ""
      }&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${search}&StartDate=${
        date.StartDate
      }&EndDate=${date.EndDate}&Status=${filterFormValues ? filterFormValues.Status : ""}`
    );
  },

  printById(id) {
    return ApiServices.get(`${baseUrl}Print?ID=${id}`,
    {responseType: "blob"}
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
  accept(id){
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },
  notAccept(id){
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  }
};

export default PensionFundRegistryServices;
