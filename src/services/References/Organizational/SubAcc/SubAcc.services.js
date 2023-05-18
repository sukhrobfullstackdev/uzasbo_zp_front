import ApiServices from "../../../api.services";

const baseUrl = "SubAcc/";

const SubAccServices = {
  getList(offset, limit, sort, order, search) {
    if (sort && order) {
      if (order === "ascend") {
        order = "asc";
      } else if (order === "descend") {
        order = "desc";
      }
      return ApiServices.get(
        `${baseUrl}GetList?SortColumn=${sort}&OrderType=${order}&PageNumber=${offset}&PageLimit=${limit}&Search=${search}`
      );
    }
    return ApiServices.get(
      `${baseUrl}GetList?PageNumber=${offset}&PageLimit=${limit}&Search=${search}`
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  getAll() {
    return ApiServices.get(`${baseUrl}GetAllList`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default SubAccServices;
