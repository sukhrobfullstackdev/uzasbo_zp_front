import ApiServices from '../api.services';

const baseUrl = 'Account/';
const baseStatusUrl = 'Helper/';
const baseTariffUrl = 'TariffScale/';
const fileUrl = "FileDocument/";

const CommonServices = {
  deleteFile(id, tableId, docName) {
    return ApiServices.delete(`${fileUrl}DeleteFile?id=${id}&TableID=${tableId}&buketName=${docName}`);
  },

  downloadFile(id, tableId, docName) {
    console.log(id, tableId, docName)
    return ApiServices.get(`${fileUrl}DownloadFile?id=${id}&TableID=${tableId}&buketName=${docName}`, { responseType: 'blob' });
  },

  postLang(lang) {
    return ApiServices.post(`${baseUrl}SetUserLanguage`, lang);
  },

  getStatus() {
    return ApiServices.get(`${baseStatusUrl}GetStateList`)
  },
  getTariffScaleList() {
    return ApiServices.get(`${baseTariffUrl}GetAll`)
  },
  getOrganizationsSettlementAccountList() {
    return ApiServices.get(`${baseStatusUrl}GetOrganizationsSettlementAccountList`)
  },
  getOrganizationsSettlementTaxPayerList() {
    return ApiServices.get(`${baseStatusUrl}GetTaxPayersCodeList`)
  },
}

export default CommonServices;