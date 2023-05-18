import ApiServices from "../../../api.services";

const baseUrl = "Position/";

const PositionServices = {

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },
  
  getAll(settlAccId) {
    return ApiServices.get(`${baseUrl}GetAll?SettlementAccountID=${settlAccId}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
};

export default PositionServices;
