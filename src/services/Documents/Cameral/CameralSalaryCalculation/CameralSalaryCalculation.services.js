import ApiServices from "../../../api.services";

const baseUrl = "CameralSalaryCalculation/";

const CameralSalaryCalculationServices = {
  getList(filterFormValues) {
    // console.log(filterFormValues);
    return ApiServices.get(
      `${baseUrl}GetCameralSalaryCalculation?Date=${ filterFormValues.Year ? filterFormValues.Year:""}&Month=${filterFormValues.Month ? filterFormValues.Month : ""}&OblastID=${filterFormValues.OblastID ? filterFormValues.OblastID : ""}&RegionID=${filterFormValues.RegionID ? filterFormValues.RegionID : ""}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&OrgINN=${filterFormValues.OrgINN ? filterFormValues.OrgINN : ''}&OrganizationSettlementAccount=${filterFormValues.OrganizationSettlementAccount ? filterFormValues.OrganizationSettlementAccount : ''}`
    );
  },

  print(filterFormValues) {
    // console.log(filterFormValues)
    return ApiServices.get(
      `${baseUrl}PrintCameralSalaryCalculation?Date=${ filterFormValues.Year ? filterFormValues.Year:""}&Month=${filterFormValues.Month ? filterFormValues.Month : ""}&OblastID=${filterFormValues.OblastID ? filterFormValues.OblastID : ""}&RegionID=${filterFormValues.RegionID ? filterFormValues.RegionID : ""}&SettleCode=${filterFormValues.SettleCode ? filterFormValues.SettleCode : ''}&OrgINN=${filterFormValues.OrgINN ? filterFormValues.OrgINN : ''}&OrganizationSettlementAccount=${filterFormValues.OrganizationSettlementAccount ? filterFormValues.OrganizationSettlementAccount : ''}`,
      {responseType: "blob"}
    );
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`);
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`);
  },

  calculate(data) {
    return ApiServices.post(`${baseUrl}Calculate`, data);
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

export default CameralSalaryCalculationServices;
