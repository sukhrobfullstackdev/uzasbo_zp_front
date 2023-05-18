import ApiServices from "../../../api.services";

const baseUrl = "Department/";

const DepartmentServices = {
  // getList(payload) {
  //   return ApiServices.get(`${baseUrl}GetList`, {
  //     params: payload
  //   })
  // },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    console.log(id);
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  getAll() {
    return ApiServices.get(`${baseUrl}GetAll`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default DepartmentServices;