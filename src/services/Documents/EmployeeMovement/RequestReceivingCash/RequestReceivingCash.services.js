import ApiServices from "../../../api.services";

const baseUrl = "RequestReceivingCash/";

const RequestReceivingCashServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Number=${filter.Number ? filter.Number : ''}&Search=${filter.Search ? filter.Search : ''}&Type=${filterFormValues.Type ? filterFormValues.Type : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status : ''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}&OrgID=${filterFormValues.OrgID ? filterFormValues.OrgID : ''}`
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  deleteTableData(id) {
    return ApiServices.delete(`${baseUrl}DeleteTimeSheetTableRow?id=${id}`);
  },

  deleteCashDocTableRow(id) {
    return ApiServices.delete(`${baseUrl}DeleteRequestReceivingCashDocsRow?DocID=${id}`);
  },

  deleteMultipleTableRow(ids) {
    let idText = '';
    ids.forEach(item => {
      idText = idText + 'ids=' + item + '&';
    })
    // console.log(`${baseUrl}DeleteTimeSheetTableRows?${idText}`);
    return ApiServices.delete(`${baseUrl}DeleteTimeSheetTableRows?${idText}`);
  },

  getUpdatedCashDocsTable(id) {
    return ApiServices.get(`${baseUrl}GetRequestReceivingCashDocsTables?ID=${id}`);
  },

  getCashDocsTable(id) {
    return ApiServices.get(`${baseUrl}FillRequestReceivingCashDocs?ID=${id}`);
  },

  fillMainTable(id) {
    return ApiServices.get(`${baseUrl}FillRequestReceivingCashTables?ID=${id}`);
  },

  getData(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  getHash(id) {
    return ApiServices.get(`${baseUrl}GetSendHash?id=${id}`);
  },

  changeDate(values) {
    return ApiServices.get(`${baseUrl}ChangeDate?DocumentID=${values.ID}&Date=${values.Date}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  postSignedData(data) {
    return ApiServices.post(`${baseUrl}SendSigned`, data);
  },

  createTimeSheetMainData(data) {
    return ApiServices.post(`${baseUrl}CreateTimeSheetMainData`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?ID=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?ID=${id}`);
  },

  // Change Status By Admin
  ChangeStatusByAdmin(values) {
    return ApiServices.get(`${baseUrl}ChangeStatusByAdmin?DocumentID=${values.DocumentID}&StatusID=${values.StatusID}`);
  },

  printType(id, type) {
    return ApiServices.get(
      `${baseUrl}PrintRequestReceivingCash?DocumentID=${id}&PrintType=${type}`,
      { responseType: 'blob' }
    );
  },
  sendToUzasbo2(id) {
    return ApiServices.get(
      `${baseUrl}PostUZASBO2`, {
      params: { id }
    });
  },
};

export default RequestReceivingCashServices;
