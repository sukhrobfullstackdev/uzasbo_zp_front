import ApiServices from "../../../api.services";

const baseUrl = "Shift/";

const ShiftServices = {
  getList(offset, limit, sort, order, search) {
    if (sort && order) {
      if (order === "ascend") {
        order = "asc";
      } else if (order === "descend") {
        order = "desc";
      }
      return ApiServices.get(
        `${baseUrl}GetList?SortColumn=${sort}&OrderType=${order}&PageNumber=${offset}&PageLimit=${limit}&ID=${search}`
      );
    }
    return ApiServices.get(
      `${baseUrl}GetList?PageNumber=${offset}&PageLimit=${limit}&ID=${search}`
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

export default ShiftServices;
