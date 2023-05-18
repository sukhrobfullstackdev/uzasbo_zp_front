import ApiServices from "../../../api.services";

const baseUrl = "IncomeTaxRegistry/";

const IncomeTaxRegistryServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filterFormValues.ID ? filterFormValues.ID : ''}&Year=${filterFormValues.Year ? filterFormValues.Year : ''}`
    );
  },

  getSentList(pageNumber, pageLimit, sortColumn, orderType, date, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetSentList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filterFormValues.ID ? filterFormValues.ID : ''}&Year=${filterFormValues.Year ? filterFormValues.Year : ''}&OrganizationName=${filterFormValues.OrganizationName ? filterFormValues.OrganizationName : ''}&OrganizationINN=${filterFormValues.OrganizationINN ? filterFormValues.OrganizationINN : ''}&FinanceYear=${filterFormValues.FinanceYear ? filterFormValues.FinanceYear : ''}`
    );
  },
  // getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
  //   if (orderType === "ascend") {
  //     orderType = "asc";
  //   } else if (orderType === "descend") {
  //     orderType = "desc";
  //   }

  //   return ApiServices.get(
  //     `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ""}&Search=${filter.Search ? filter.Search : ""}&StartDate=${date.StartDate}&EndDate=${date.EndDate}`
  //   );
  // },

  print(filterFormValues) {
    return ApiServices.get(
      `${baseUrl}Print?ID=${filterFormValues.ID}&FinanceYear=${filterFormValues.FinanceYear}&Month=${filterFormValues.Month}&Date=${filterFormValues.Date}&Director=${filterFormValues.Director}&Accounter=${filterFormValues.Accounter}&Name=${filterFormValues.Name}`,
      { responseType: 'blob' }
    );
  },

  printById(id) {
    return ApiServices.get(
      `${baseUrl}PrintIncomeTaxRegistry?ID=${id}`,
      { responseType: 'blob' }
    );
  },
  printById2(id) {
    return ApiServices.get(
      `${baseUrl}PrintIncomeTaxRegistryDiv?ID=${id}`,
      { responseType: 'blob' }
    );
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

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  Send(id) {
    return ApiServices.get(`${baseUrl}IncomeTaxSend?id=${id}`);
  },

  Received(id) {
    return ApiServices.get(`${baseUrl}IncomeTaxReceived?id=${id}`);
  },

  NotReceived(id) {
    return ApiServices.get(`${baseUrl}IncomeTaxNotReceived?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}Cancel?id=${id}`);
  },
};

export default IncomeTaxRegistryServices;
