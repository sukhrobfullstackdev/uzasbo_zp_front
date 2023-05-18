import ApiServices from "../../../api.services";

const baseUrl = "OrganizationsSettlementAccount/";

const OrganizationsSettlementAccountServices = {
  GetList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, { params: payload });
  },
  
  GetAll(payload) {
    return ApiServices.get(`${baseUrl}GetAll`);
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

export default OrganizationsSettlementAccountServices;
