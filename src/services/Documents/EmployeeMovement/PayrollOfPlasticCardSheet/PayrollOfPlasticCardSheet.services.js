import ApiServices from "../../../api.services";

const baseUrl = "PayrollOfPlasticCardSheet/";
const baseEmpluyeeUrl = "Employee/"
//const baseHelperUrl = "Helper/"

const PayrollOfPlasticCardSheetServices = {
  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    });
  },

  oldGetList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Number=${filter.Number ? filter.Number : ''}&Search=${filter.Search ? filter.Search : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status : ''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}&OrgID=${filterFormValues.OrgID ? filterFormValues.OrgID : ''}`
    );
  },

  getPlasticCardTableData(id, pageNumber, pageLimit, sortColumn, orderType, filter = {}) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetTableData?ID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}&Search=${filter.Search ? filter.Search : ''}`
    );
  },

  getModalList(pageNumber, pageLimit, sortColumn, orderType, filter, filterFormValues, ParentID) {
    if (ParentID === 18 || 19) {
      return ApiServices.get(`${baseEmpluyeeUrl}GetWorkingEmployeesNoParameterList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&FullName=${filter.FullName ? filter.FullName : ''}`);
    } else if (ParentID === 63) {
      return ApiServices.get(
        `${baseEmpluyeeUrl}GetList?ID=${filterFormValues.ID}&PersonnelNumber=${filterFormValues.PersonnelNumber}&FullName=${filterFormValues.FullName}&INN=${filterFormValues.INN}&DateOfBirth=${filterFormValues.DateOfBirth}&EmployeeTypeID=${filterFormValues.EmpType}&SortColumn=${sortColumn}&OrderType=${orderType}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&INPSCode=${filterFormValues.INPSCode ? filterFormValues.INPSCode : ''}&PlasticCardNumber=${filterFormValues.PlasticCardNumber ? filterFormValues.PlasticCardNumber : ''}`
      );
    }
  },

  getPlasticCardInfo(payload) {
    return ApiServices.get(`${baseUrl}GetPlasticCardInfo`, {
      params: payload
    });
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  deleteTableData(id) {
    return ApiServices.delete(`${baseUrl}DeleteTimeSheetTableRow?id=${id}`);
  },

  deleteTableRow(ids) {
    let idText = '';
    ids.forEach(item => {
      idText = idText + 'ids=' + item + '&';
    })

    return ApiServices.delete(`${baseUrl}DeleteRows?${idText}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  getHash(docId, paymentOrderId) {
    return ApiServices.get(`${baseUrl}GetSendHash?DocumentID=${docId}&PaymentOrderID=${paymentOrderId}`);
  },

  changeDate(values) {
    return ApiServices.get(`${baseUrl}ChangeDate?DocumentID=${values.ID}&Date=${values.Date}`);
  },

  // change Month
  changeMonth(values) {
    return ApiServices.get(`${baseUrl}ChangeMonth?DocumentID=${values.ID}&Date=${values.Date}`);
  },

  CalculateSum(id) {
    return ApiServices.get(`${baseUrl}CalculateSum?id=${id}`);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  postSignedData(data) {
    return ApiServices.post(`${baseUrl}SendSigned`, data);
  },

  addEmployeeTable(data) {
    return ApiServices.post(`${baseUrl}Add`, data);
  },

  getPlasticTable(data) {
    return ApiServices.post(`${baseUrl}AddEmployeeTable?EmployeeID=${data.EmployeeID}&OwnerID=${data.OwnerID}&PayrollSum=${data.PayrollSum}&PlasticCardType=${data.PlasticCardType}&PlasticCardBankID=${data.PlasticCardBankID}`);
  },

  saveTableRow(data) {
    return ApiServices.post(`${baseUrl}SaveTableRow`, data);
  },

  clearTable(id) {
    return ApiServices.delete(`${baseUrl}DeleteTable?id=${id}`);
  },


  CreatePayrollOfPlasticCardSheetMainData(data) {
    return ApiServices.post(`${baseUrl}CreatePayrollOfPlasticCardSheetMainData`, data);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },

  send(id) {
    return ApiServices.post(`${baseUrl}SendSigned?ID=${id}`);
  },

  UpdateDocumentFIOAndNumber(id, PlasticCardType) {
    return ApiServices.post(`${baseUrl}UpdateDocumentFIOAndNumber?DocumentID=${id}&TableID=${205}&PlasticCardType=${PlasticCardType}`);
  },

  ChangeSubAcc(values) {
    return ApiServices.post(`${baseUrl}ChangeSubAcc?ID=${values.ID}&SubAccDbID=${values.SubAccDbID}`);
  },
  // Change Status By Admin
  ChangeStatusByAdmin(values) {
    return ApiServices.get(`${baseUrl}ChangeStatusByAdmin?DocumentID=${values.DocumentID}&StatusID=${values.StatusID}`);
  },
  getPaymentOrderInfo(payload) {
    return ApiServices.get(`${baseUrl}GetPaymentOrderInfo`, {
      params: payload
    });
  },
  printById(id) {
    return ApiServices.get(`${baseUrl}GetPayrollOfPlasticCardSheetPrint?DocumentID=${id}`, { responseType: "blob" })
  },
  PostUZASBO2(id) {
    return ApiServices.get(`${baseUrl}PostUZASBO2?id=${id}`);
  },
};

export default PayrollOfPlasticCardSheetServices;
