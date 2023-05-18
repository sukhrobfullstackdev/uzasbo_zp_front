import ApiServices from "../../../api.services";

const baseUrl = "CameralSalaryCalculation/";
const baseUrlChapter = "Chapter/";

const CameralRequestReceivingCashServices = {
  getList(filterFormValues) {
    // console.log(filterFormValues);
    return ApiServices.get(
      `${baseUrl}GetCameralRequestReceivingCash?Date=${ filterFormValues.Year ? filterFormValues.Year:""}&OblastID=${filterFormValues.OblastID ? filterFormValues.OblastID : ""}&RegionID=${filterFormValues.RegionID ? filterFormValues.RegionID : ""}&ChapterID=${filterFormValues.ChapterID ? filterFormValues.ChapterID : ""}&OrgINN=${filterFormValues.OrgINN ? filterFormValues.OrgINN : ""}&OnlyDifference=${filterFormValues.OnlyDifference ? filterFormValues.OnlyDifference : ""}`
    );
  },

  print(filterFormValues) {
    // console.log(filterFormValues)
    return ApiServices.get(
      `${baseUrl}PrintCameralRequestReceivingCash?Date=${ filterFormValues.Year ? filterFormValues.Year:""}&OblastID=${filterFormValues.OblastID ? filterFormValues.OblastID : ""}&RegionID=${filterFormValues.RegionID ? filterFormValues.RegionID : ""}&ChapterID=${filterFormValues.ChapterID ? filterFormValues.ChapterID : ""}&OrgINN=${filterFormValues.OrgINN ? filterFormValues.OrgINN : ""}&OnlyDifference=${filterFormValues.OnlyDifference ? filterFormValues.OnlyDifference : ""}`,
      {responseType: "blob"}
    );
  },

  getChapterList() {
    return ApiServices.get(`${baseUrlChapter}GetAll`);
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

export default CameralRequestReceivingCashServices;
