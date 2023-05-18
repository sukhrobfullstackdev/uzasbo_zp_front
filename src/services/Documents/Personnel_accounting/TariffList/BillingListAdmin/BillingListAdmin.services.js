//import ApiServices from "../../../api.services";
import ApiServices from '../../../../api.services'
const baseUrl = 'BillingList/'

const BillingListAdminServices = {
  getList(
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
      `${baseUrl}GetBillingListAdmin?SortColumn=${sortColumn ? sortColumn : ''}&OrderType=${
        orderType ? orderType : ''
      }&Year=${
        filter.Year ? filter.Year : ''
      }&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${
        filterFormValues.ID ? filterFormValues.ID : ''
      }&Search=${filter.Search ? filter.Search : ''}&INN=${
        filterFormValues.INN ? filterFormValues.INN : ''
      }&Status=${
        filterFormValues.Status ? filterFormValues.Status : ''
      }&StartDate=${date.StartDate}&EndDate=${date.EndDate}`,
    )
  },

  printById(id) {
    return ApiServices.get(`${baseUrl}Print?ID=${id}`,
    {responseType: "blob"}
    )
  },

  delete(id) {
    return ApiServices.delete(`${baseUrl}Delete?id=${id}`)
  },

  getById(id) {
    return ApiServices.get(`${baseUrl}Get?id=${id}`)
  },

  // postData(data) {
  //   return ApiServices.post(`${baseUrl}Update`, data)
  // },

  // Send(id) {
  //   return ApiServices.post(`${baseUrl}Send?id=${id}`)
  // },

  // Accept(id) {
  //   return ApiServices.post(`${baseUrl}Accept?id=${id}`)
  // },

  // NotAccept(id) {
  //   return ApiServices.post(`${baseUrl}NotAccept?id=${id}`)
  // },
}

export default BillingListAdminServices
