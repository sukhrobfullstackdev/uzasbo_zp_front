import ApiServices from "../../../api.services";

const baseUrl = "INPSRegistry/";
const baseEmpluyeeUrl = "Employee/"
const baseHelperUrl = "Helper/"

const INPSRegistryServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrgID=${filterFormValues?.OrgID ? filterFormValues?.OrgID : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter?.ID ? filter?.ID : ''}&Number=${filter?.Number ? filter?.Number : ''}&Search=${filter?.Search ? filter?.Search : ''}&OrgINN=${filter?.OrgINN ? filter?.OrgINN : ''}&SettleCode=${filterFormValues?.SettleCode ? filterFormValues?.SettleCode : ''}&Status=${filterFormValues?.Status ? filterFormValues?.Status : ''}&DprName=${filterFormValues?.DprName ? filterFormValues?.DprName : ''}&StartDate=${date?.StartDate}&EndDate=${date?.EndDate}`
    );
  },

  getInpsTableData(id, pageNumber, pageLimit, sortColumn, orderType, filter = {}) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetTableData?ID=${id}&SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Search=${filter.Search ? filter.Search : ''}`
    );
  },

  getModalList(pageNumber, pageLimit, sortColumn, orderType, filter, filterFormValues, ParentID) {
    if (ParentID === 18 || 19) {
      return ApiServices.get(`${baseHelperUrl}GetWorkingEmployeesNoParameterList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&FullName=${filter.FullName ? filter.FullName : ''}`);
    } else if (ParentID === 63) {
      return ApiServices.get(
        `${baseEmpluyeeUrl}GetList?ID=${filterFormValues.ID}&PersonnelNumber=${filterFormValues.PersonnelNumber}&FullName=${filterFormValues.FullName}&INN=${filterFormValues.INN}&DateOfBirth=${filterFormValues.DateOfBirth}&EmployeeTypeID=${filterFormValues.EmpType}&SortColumn=${sortColumn}&OrderType=${orderType}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&INPSCode=${filterFormValues.INPSCode ? filterFormValues.INPSCode : ''}&PlasticCardNumber=${filterFormValues.PlasticCardNumber ? filterFormValues.PlasticCardNumber : ''}`
      );
    }
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  deleteTableData(id) {
    return ApiServices.delete(`${baseUrl}DeleteTableRow?id=${id}`);
  },

  deleteTableRow(ids) {
    let idText = '';
    ids.forEach(item => {
      idText = idText + 'ids=' + item + '&';
    })

    return ApiServices.delete(`${baseUrl}DeleteRows?${idText}`);
  },

  clearTable(id) {
    return ApiServices.delete(`${baseUrl}DeleteTable?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  saveTableRow(data) {
    return ApiServices.post(`${baseUrl}SaveTableRow`, data);
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data);
  },

  getHash(id) {
    return ApiServices.get(`${baseUrl}GetSendHash?id=${id}`);
  },


  addEmployeeTable(data) {
    return ApiServices.post(`${baseUrl}Add`, data);
  },

  getPlasticTable(data) {
    return ApiServices.post(`${baseUrl}AddEmployeeTable?EmployeeID=${data.EmployeeID}&OwnerID=${data.OwnerID}&InSum=${data.InSum}`);
  },


  FillINPSRegistryTable(id) {
    return ApiServices.post(`${baseUrl}FillINPSRegistryTable?id=${id}`, id);
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  Cancel(id) {
    return ApiServices.post(`${baseUrl}Cancel?id=${id}`);
  },

  // E-imzo
  postSignedData(data) {
    return ApiServices.post(`${baseUrl}SendSigned`, data);
  },

  // getHash(id) {
  //   return ApiServices.get(`${baseUrl}GetSendHash?id=${id}`);
  // },
  // E-imzo end

  // ChangeSubAcc(values) {
  //   return ApiServices.post(`${baseUrl}ChangeSubAcc?ID=${values.ID}&SubAccDbID=${values.SubAccDbID}`);
  // },

  // Change Status By Admin
  ChangeStatusByAdmin(values) {
    return ApiServices.get(`${baseUrl}ChangeStatusByAdmin?DocumentID=${values.DocumentID}&StatusID=${values.StatusID}`);
  },
  PostUZASBO2(id) {
    return ApiServices.get(`${baseUrl}PostUZASBO2?id=${id}`);
  },
};

export default INPSRegistryServices;
