import ApiServices from "../../../api.services";

const baseUrl = "ScholarshipCharge/";

const ScholarshipChargeServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType,  date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}&Search=${filter.Search ? filter.Search : ''}&PosName=${filter.PosName ? filter.PosName : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status :''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&psList=${filterFormValues.psList ? filterFormValues.psList : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}`);

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
  postDataFillTableData(data) {
    return ApiServices.post(`${baseUrl}FillScholarshipCharge`, data);
  },
  postDataCalTableData(allTableData) {
    return ApiServices.post(`${baseUrl}CalculateScholarshipChargeSum?Calculate=true`, allTableData);
  },
  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`);
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
  clearTable(OwnerID) {
    return ApiServices.delete(`${baseUrl}DeleteTable?OwnerID=${OwnerID}`);
  },
  //select delete   
  deleteTableRow(ids) {
    let TableIDs = '';
    ids.forEach(item => {
      TableIDs = TableIDs + 'TableIDs=' + item + '&';
    })
    return ApiServices.delete(`${baseUrl}DeleteTableRows?${TableIDs}`, ids);
  },
};

export default ScholarshipChargeServices;
