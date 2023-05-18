import ApiServices from "../../../api.services";

const baseUrl = "PayrollandCharge/";

const PayrollandChargeServices = {
  getList(pageNumber, pageLimit, sortColumn, orderType, date, filter, filterFormValues) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }

    return ApiServices.get(
      `${baseUrl}GetList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&Number=${filter.Number ? filter.Number : ''}&Search=${filter.Search ? filter.Search : ''}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&Status=${filterFormValues.Status ? filterFormValues.Status : ''}&DprName=${filterFormValues.DprName ? filterFormValues.DprName : ''}&SubCalculation=${filterFormValues.SubCalculation ? filterFormValues.SubCalculation : ''}&StartDate=${date.StartDate}&EndDate=${date.EndDate}`
    );
  },
  
  getTableData(id) {    
    return ApiServices.get(`${baseUrl}GetTableData?OwnerID=${id}`
    );
  },

  // Calculation 
  postCalculatePayrollCharges(id, IsByTimeSheet, TimeSheetStartDate, TimeSheetEndDate){
    return ApiServices.post(`${baseUrl}CalculatePayrollCharges?DocumentID=${id}&IsByTimeSheet=${IsByTimeSheet}&TimeSheetStartDate=${TimeSheetStartDate}&TimeSheetEndDate=${TimeSheetEndDate}`)
  },

    //Fill 
  postDataFillTableData(data, allData) {
      return ApiServices.post(`${baseUrl}FillPayrollandChargeTable?Sum=${data.Sum}&Percentage=${data.Percentage}&Day=${data.Day}&Hour=${data.Hour}&IsMainWork=${data.IsMainWork}&IsInternal=${data.IsInternal}&IsExternal=${data.IsExternal}&IsCombination=${data.IsCombination}&ByAllSource=${data.ByAllSource}&Male=${data.Male}&Female=${data.Female}`, allData);
   },
  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
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
    return ApiServices.delete(`${baseUrl}DeleteTableRows?${TableIDs}`);
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
  NotAccept(id) {
    return ApiServices.post(`${baseUrl}NotAccept?id=${id}`);
  },
};

export default PayrollandChargeServices;
