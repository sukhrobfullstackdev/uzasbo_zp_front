import ApiServices from "../../api.services";

const baseUrl = "UserError/";

const UserErorApis = {
  getList: (payload) => ApiServices.get(`${baseUrl}GetList`, {
    params: payload
  }),

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default UserErorApis;
