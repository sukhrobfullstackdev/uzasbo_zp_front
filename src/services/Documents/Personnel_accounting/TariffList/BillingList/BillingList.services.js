//import ApiServices from "../../../api.services";
import ApiServices from '../../../../api.services'
const baseUrl = 'BillingList/'
const baseUrl2 = 'CameralSalaryCalculation/'

const BillingListServices = {

  getList(payload) {
    return ApiServices.get(`${baseUrl}GetList`, {
      params: payload
    })
  },

  getListCameral(
    pageNumber,
    pageLimit,
    sortColumn,
    orderType,
    date,
    filter,
    filterFormValues,
  ) {
    if (orderType === 'ascend') {
      orderType = 'asc'
    } else if (orderType === 'descend') {
      orderType = 'desc'
    }

    return ApiServices.get(
      `${baseUrl2}GetCameralBillingList?SortColumn=${sortColumn ? sortColumn : ''
      }&OrderType=${orderType ? orderType : ''}&Year=${filter.Year ? filter.Year : ''
      }&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filterFormValues.ID ? filterFormValues.ID : ''
      }&Search=${filter.Search ? filter.Search : ''}&INN=${filterFormValues.INN ? filterFormValues.INN : ''
      }&Status=${filterFormValues.Status ? filterFormValues.Status : ''
      }&StartDate=${date.StartDate}&EndDate=${date.EndDate}`,
    )
  },

  printById(id) {
    return ApiServices.get(`${baseUrl}Print?ID=${id}`,
      { responseType: "blob" }
    )
  },

  Print1(payload) {
    return ApiServices.get(`${baseUrl}Print1`,
      { params: payload, responseType: "blob" }
    )
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`)
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`)
  },

  postData(data) {
    return ApiServices.post(`${baseUrl}Update`, data)
  },

  postDataFillTableData(data) {
    return ApiServices.post(`${baseUrl}FillBillingList`, data)
  },

  Send(id) {
    return ApiServices.post(`${baseUrl}Send?ID=${id}`)
  },

  sendHeader(id) {
    return ApiServices.post(`${baseUrl}SendHeader?ID=${id}`)
  },

  Accept(id) {
    return ApiServices.post(`${baseUrl}Accept?id=${id}`)
  },

  AcceptHeader(id) {
    return ApiServices.post(`${baseUrl}AcceptHeader?ID=${id}`)
  },

  AcceptReceived(id) {
    return ApiServices.post(`${baseUrl}AcceptReceived?ID=${id}`)
  },

  NotAccept(id) {
    return ApiServices.post(`${baseUrl}Cancel?id=${id}`)
  },

  Archived(id) {
    return ApiServices.post(`${baseUrl}Archived?id=${id}`)
  },

  CancelHeader(id) {
    return ApiServices.post(`${baseUrl}CancelHeader?ID=${id}`)
  },

  CancelReceived(id) {
    return ApiServices.post(`${baseUrl}CancelReceived?ID=${id}`)
  },
}

export default BillingListServices
