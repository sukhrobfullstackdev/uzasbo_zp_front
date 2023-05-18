import ApiServices from "../../../api.services";

const baseUrl = "PreferentialOrganization/";

const PreferentialOrganizationServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, filter) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&INN=${filter.INN ? filter.INN : ''}&Search=${filter.Search ? filter.Search : ''}`
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  calculate(data) {
    return ApiServices.post(`${baseUrl}Calculate`, data); 
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
};

export default PreferentialOrganizationServices;
