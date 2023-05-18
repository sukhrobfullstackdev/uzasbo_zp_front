import ApiServices from "../api.services";

const baseUrl = "PlasticCardSheetForMilitary/";

const PlasticCardSheetForMilitaryServices = {
  delete(id) {
    return ApiServices.delete(`${baseUrl}DeleteDocument?DocumentID=${id}`);
  },

  deleteTable(id) {
    return ApiServices.delete(`${baseUrl}DeleteTable?DocumentID=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?DocumentID=${id}`);
  },

  getTable(id) {
    return ApiServices.get(`${baseUrl}GetTable?DocumentID=${id}`);
  },

  update(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  fill(data) {
    return ApiServices.post(`${baseUrl}FillTable`, data, {
      "headers": {
        "content-type": 'multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s'
      }
    });
  },

  getTableData(id) {
    return ApiServices.get(`${baseUrl}GetTable?DocumentID=${id}`);
  },

  getHash(id) {
    return ApiServices.get(`${baseUrl}GetSendHash?DocumentID=${id}`);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
  
  postSignedData(data) {
    return ApiServices.post(`${baseUrl}SendSigned`, data);
  },

  //   printType(id, key) {
  //     return ApiServices.get(`${baseUrl}Print?ID=${id}&text=${key}`,
  //       { responseType: 'blob' }
  //     );
  //   },
};

export default PlasticCardSheetForMilitaryServices;
