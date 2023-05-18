import ApiServices from "../../../../api.services";
const baseUrl = "StaffList/";

const StaffListServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, search, filterFormValues, date) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Search=${search ? search : ''}`
    );
  },

  getStaffListAdmin(payload) {
    return ApiServices.get(`${baseUrl}GetStaffListAdmin`, {
      params: payload
    })
  },

  getListOblast(payload) {
    return ApiServices.get(`${baseUrl}GetListOblast`, {
      params: payload
    })
  },

  getSentList(pageNumber, pageLimit, sortColumn, orderType, search, date, filter, filterFormValues) {;
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetSentList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter?.ID ? filter?.ID : ''}&Search=${filter?.Name ? filter?.Name : ''}&INN=${filter?.INN ? filter?.INN : ''}&SettlementAccount=${filter?.SettlementAccount ? filter?.SettlementAccount : ''}&Year=${date?.Year ? date?.Year : ''}`
    );
  },

  getReceivedList(pageNumber, pageLimit, sortColumn, orderType, search, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetReceivedList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Search=${search ? search : ''}`
    );
  },

  getListRegistery(pageNumber, pageLimit, sortColumn, orderType, search, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetListRegistery?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Search=${search ? search : ''}`
    );
  },

  getSentRegisteryList(pageNumber, pageLimit, sortColumn, orderType, search, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetSentRegisteryList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Search=${search ? search : ''}`
    );
  },

  getReceivedRegisteryList(pageNumber, pageLimit, sortColumn, orderType, search, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetReceivedRegisteryList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Search=${search ? search : ''}`
    );
  },

  printRow(id, tableId) {
    return ApiServices.get(`${baseUrl}PrintStaffList?id=${id}&TableID=${tableId}`,
      { responseType: "blob" }
    );
  },


  PrintStaffList2(id, tableId) {
    return ApiServices.get(`${baseUrl}PrintStaffList2?id=${id}&TableID=${tableId}`,
      { responseType: "blob" }
    );
  },

  printForm(id) {
    return ApiServices.get(`${baseUrl}Print?id=${id}`,
      { responseType: "blob" }
    );
  },

  Print1(payload) {
    return ApiServices.get(`${baseUrl}Print1?OblastID=${payload.OblastID}&RegionID=${payload.RegionID}&AllOrganizations=${payload.AllOrganizations === true ? 'true' : 'false'}&FunctionalItem=${payload.FunctionalItem}&Year=${payload.Year}&StatusID=${payload.StatusID}`,
      { responseType: "blob" }
    );
  },

  Print2(id) {
    return ApiServices.get(`${baseUrl}Print2?id=${id}`,
      { responseType: "blob" }
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  DeleteRegistery(id) {
    return ApiServices.delete(`${baseUrl}DeleteRegistery?id=${id}`);
  },

  getById(id, orgSettleAccId, staffLsTypeId, isClone) {
    if (orgSettleAccId && staffLsTypeId) {
      return ApiServices.get(`${baseUrl}Get?id=${id}&OrganizationsSettlementAccountID=${orgSettleAccId}&StaffListTypeID=${staffLsTypeId}`);
    } else {
      return ApiServices.get(`${baseUrl}Get?id=${id}&IsClone=${isClone}`);
    }
  },

  getRegistery(id,) {
    return ApiServices.get(`${baseUrl}GetRegistery?id=${id}`);
  },

  // E-imzo apis
  getHash(id) {
    return ApiServices.get(`${baseUrl}GetSendHash?ID=${id}`);
  },

  postSignedData(data) {
    return ApiServices.post(`${baseUrl}SendSigned`, data);
  },

  SendSignedStaffListRegistery(data) {
    return ApiServices.post(`${baseUrl}SendSignedStaffListRegistery`, data);
  },
  // End E-imzo apis

  FillStaffList(data) {
    return ApiServices.post(`${baseUrl}FillStaffList`, data);
  },

  GetStaffListRegisteryFilTables(payload) {
    return ApiServices.get(`${baseUrl}GetStaffListRegisteryFilTables`, { params: payload });
  },


  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  UpdateRegistery(data) {
    return ApiServices.post(`${baseUrl}UpdateRegistery`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  AcceptStaffListRegistery(id) {
    return ApiServices.post(`${baseUrl}AcceptStaffListRegistery?id=${id}`);
  },

  ApproveStaffList(id) {
    return ApiServices.post(`${baseUrl}ApproveStaffList?id=${id}`);
  },

  RegisterStaffList(id) {
    return ApiServices.post(`${baseUrl}RegisterStaffList?id=${id}`);
  },

  ReceivedRegistery(id, tableId) {
    return ApiServices.post(`${baseUrl}ReceivedRegistery?id=${id}&TableID=${tableId}`);
  },

  Received(id, tableId) {
    return ApiServices.post(`${baseUrl}Received?id=${id}&TableID=${tableId}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}Cancel?id=${id}`);
  },

  CancelStaffListRegistery(id, description) {
    return ApiServices.post(`${baseUrl}CancelStaffListRegistery?id=${id}&Description=${description}`);
  },

  CancelReceived(id, description) {
    return ApiServices.post(`${baseUrl}CancelReceived?id=${id}&Description=${description}`);
  },

  CancelReceivedRegistery(id, description, tableId) {
    return ApiServices.post(`${baseUrl}CancelReceivedRegistery?id=${id}&Description=${description}&TableID=${tableId}`);
  },

  SendHashStaffListRegistery(id) {
    return ApiServices.post(`${baseUrl}SendHashStaffListRegistery?ID=${id}`);
  },
};

export default StaffListServices;
