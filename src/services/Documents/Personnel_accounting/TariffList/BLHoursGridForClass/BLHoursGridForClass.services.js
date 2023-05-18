//import ApiServices from "../../../api.services";
import ApiServices from "../../../../api.services";
const baseUrl = "BLHoursGridForClass/";

const BLHoursGridForClassServices = {

  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getAttachedClassTitleTableData(AttachedClassTitleTableID) {
    return ApiServices.get(`${baseUrl}GetAttachedClassTitleTableData?AttachedClassTitleTableID=${AttachedClassTitleTableID}`);
  },


  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },
  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`, id);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`, id);
  },

  printById(id) {
    return ApiServices.get(
      `${baseUrl}Print?id=${id}`,
      { responseType: "blob" }
    );
  },

  GetAttachedClassTitleTableData(id, pageNumber, pageLimit, sortColumn, orderType, filter = {}) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetTableData?ID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}&Search=${filter.Search ? filter.Search : ''}`
    );
  },

  
  FillBLHoursGridForClass(data) {
    return ApiServices.post(`${baseUrl}FillBLHoursGridForClass`, data);
  },
};

export default BLHoursGridForClassServices;
