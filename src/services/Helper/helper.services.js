import ApiServices from "../api.services";

const baseUrl = "Helper/";
//const baseEmpluyeeUrl = "Employee/"
// const subUrl = 'SubDepartment/  '

const HelperServices = {
  getEmployeeTypeList() {
    return ApiServices.get(`${baseUrl}GetEmployeeTypeList`);
  },
  getLimitOperList() {
    return ApiServices.get(`${baseUrl}GetLimitOperList`);
  }, 
   getLimitPeriodList() {
    return ApiServices.get(`${baseUrl}GetLimitPeriodList`);
  }, 
   getLimitTypeList() {
    return ApiServices.get(`${baseUrl}GetLimitList`);
  },

  getGenderList() {
    return ApiServices.get(`${baseUrl}GetGenderList`);
  },

  getRegionList() {
    return ApiServices.get(`${baseUrl}GetOblastList`);
  },

  getDistrictList(id) {
    return ApiServices.get(`${baseUrl}GetRegionList?OblastID=${id}`);
  },

  getBankList(
    pageNumber = "",
    pageLimit = "",
    sortColumn,
    orderType,
    search = ""
  ) {
    if (orderType === "ascend") {
      orderType = "asc";
    } else if (orderType === "descend") {
      orderType = "desc";
    }
    return ApiServices.get(
      `${baseUrl}GetBankCodeList?SortColumn=${
        sortColumn ? sortColumn : ""
      }&OrderType=${
        orderType ? orderType : ""
      }&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Search=${search}`
    );
  },

  // getWorkingEmployeesNoParameterList(pageNumber, pageLimit, sortColumn, orderType, filter, parentId) {
  //   if (orderType === "ascend") {
  //     orderType = "asc";
  //   } else if (orderType === "descend") {
  //     orderType = "desc";
  //   }

  //   if (parentId === 63) {
  //     return ApiServices.get(
  //       `${baseEmpluyeeUrl}GetList?`
  //     );
  //   }

  //   return ApiServices.get(`${baseUrl}GetWorkingEmployeesNoParameterList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&ID=${filter.ID ? filter.ID : ''}&FullName=${filter.FullName ? filter.FullName : ''}&PersonnelNumber=${filter.PersonnelNumber ? filter.PersonnelNumber : ''}`);
  // },

  getStateList() {
    return ApiServices.get(`${baseUrl}GetStateList`);
  },
  GetBenefitTypeList() {
    return ApiServices.get(`${baseUrl}GetBenefitTypeList`);
  },
  getOblastList() {
    return ApiServices.get(`${baseUrl}GetOblastList?lang=&CountryID=0`);
  },
  getStatusList() {
    return ApiServices.get(`${baseUrl}GetStatusList`);
  },
  // GetDivisionList
  GetDivisionList() {
    return ApiServices.get(`${baseUrl}GetDivisionList`);
  },
  GetPayrollList() {
    return ApiServices.get(`${baseUrl}GetPayrollSubCalculationList`);
  },
  getListOfPositionCategoryList() {
    return ApiServices.get(`${baseUrl}GetListOfPositionCategoryList`);
  },
  getPayrollSubAccList() {
    return ApiServices.get(`${baseUrl}GetPayrollSubAccList`);
  },
  getExperienceContWorkList() {
    return ApiServices.get(`${baseUrl}GetExperienceContWorkList`);
  },
  getListOfPositionList() {
    return ApiServices.get(`${baseUrl}GetListOfPositionList`);
  },

  getItemOfExpensesList(parentId) {
    return ApiServices.get(
      `${baseUrl}GetItemOfExpensesList?${
        parentId ? "ParentID=" + parentId : ""
      }`
    );
  },
  GetItemOfExpensesList(parentId) {
    return ApiServices.get(`${baseUrl}GetItemOfExpensesList?ParentID=0`);
  },
  getAllSubCalculationKindList(payload) {
    return ApiServices.get(`${baseUrl}GetAllSubCalculationKindList`, {
      params: payload,
    });
  },
  GetTaxItemList() {
    return ApiServices.get(`${baseUrl}GetTaxItemList`);
  },
  getDepartmentList(divisionId) {
    return ApiServices.get(
      `${baseUrl}GetDepartmentList?DivisionID=${divisionId}`
    );
  },

  getFakultitetList(divisionId) {
    return ApiServices.get(
      `${baseUrl}GetDepartmentForScholarship?TypeID=1&DivisionID=${divisionId}`
    );
  },
  getGroupList(divisionId) {
    return ApiServices.get(
      `${baseUrl}GetDepartmentForScholarship?TypeID=2&DivisionID=${divisionId}`
    );
  },
  getDirectionList(divisionId) {
    return ApiServices.get(
      `${baseUrl}GetDepartmentForScholarship?TypeID=3&DivisionID=${divisionId}`
    );
  },
  getAllDepartmentList() {
    return ApiServices.get(`${baseUrl}GetAllDepartmentList?`);
  },

  //SalaryTransation AddModal
  getOrganizationsSettlementAccountList() {
    return ApiServices.get(`${baseUrl}GetOrganizationsSettlementAccountList`);
  },
  getStaffListType() {
    return ApiServices.get(`${baseUrl}GetStaffListTypeList`);
  },
  getAllowedTransactionList(payload) {
    return ApiServices.get(`${baseUrl}GetAllowedTransactionList`, {
      params: payload,
    });
  },
  GetSubAccDbCrList(AccDbID) {
    return ApiServices.get(`${baseUrl}GetSubAccDbCrList?Accid=${AccDbID}`);
  },
  getSubAccDbCrList(AccCrID) {
    return ApiServices.get(`${baseUrl}GetSubAccDbCrList?Accid=${AccCrID}`);
  },
  GetSubAcc60List() {
    return ApiServices.get(`${baseUrl}GetSubAccList?Accid=${60}`);
  },

  getSubAccList(id) {
    return ApiServices.get(`${baseUrl}GetSubAccList?Accid=${id}`);
  },

  getAllSubCount(ID) {
    return ApiServices.get(`${baseUrl}GetAllSubCount?AccID=${ID}`);
  },

  getClassLanguageList(id) {
    return ApiServices.get(`${baseUrl}GetClassLanguageList`);
  },
  getTaxesAndChargesAll(id) {
    return ApiServices.get(`${baseUrl}GetTaxesAndChargesAll?SubAccDbIDt=${id}`);
  },

  getAllSubDepartementList() {
    return ApiServices.get(`${baseUrl}GetAllSubDepartementList`);
  },
  GetTimeSheetTypeList() {
    return ApiServices.get(`${baseUrl}GetTimeSheetTypeList`);
  },

  getClassNumberList() {
    return ApiServices.get(`${baseUrl}GetClassNumberList`);
  },
  // getSubAcc60List() {
  //   return ApiServices.get(`${baseUrl}GetSubAccList?AccID=60`)
  // },

  // getStatusList(id) {
  //   return ApiServices.get(`${baseUrl}GetStatusList`)
  // },
  GetListOfPositionList() {
    return ApiServices.get(`${baseUrl}GetListOfPositionList`);
  },

  getRequestReceivingCashList() {
    return ApiServices.get(`${baseUrl}GetRequestReceivingCashList`);
  },

  GetEnrolmentTypeList() {
    return ApiServices.get(`${baseUrl}GetEnrolmentTypeList`);
  },

  GetWorkScheduleList() {
    return ApiServices.get(`${baseUrl}GetWorkScheduleList`);
  },

  GetRoundingTypeList() {
    return ApiServices.get(`${baseUrl}GetRoundingTypeList?forenrolment=true`);
  },

  getRoundingTypeList(forenrolment = false) {
    return ApiServices.get(
      `${baseUrl}GetRoundingTypeList?forenrolment=${forenrolment}`
    );
  },

  getRoundingTypeListForEnrolment(forenrolment) {
    return ApiServices.get(
      `${baseUrl}GetRoundingTypeList?forenrolment=${
        forenrolment ? forenrolment : "true"
      }`
    );
  },

  GetMinimalSalary(date) {
    return ApiServices.get(`${baseUrl}GetMinimalSalary?OnDate=${date}`);
  },

  GetTariffScaleTableList(TariffScaleID) {
    return ApiServices.get(
      `${baseUrl}GetTariffScaleTableList?TariffScaleID=${TariffScaleID}`
    );
  },

  GetAllSubCalculationKindList(
    pageNumber,
    pageLimit,
    sortColumn,
    orderType,
    filter
  ) {
    return ApiServices.get(
      `${baseUrl}GetAllSubCalculationKindList?SortColumn=${
        sortColumn ? sortColumn : ""
      }&OrderType=${
        orderType ? orderType : ""
      }&PageNumber=${pageNumber}&PageLimit=${pageLimit}&Name=${
        filter.Name ? filter.Name : ""
      }&ID=${filter.ID ? filter.ID : ""}`
    );
  },

  // GetWorkingEmployeesNoParameterList(pageNumber, pageLimit, sortColumn, orderType, divisionId = '', departmentId = '', filterType, filterValue) {
  //   if (orderType === "ascend") {
  //     orderType = "asc";
  //   } else if (orderType === "descend") {
  //     orderType = "desc";
  //   }

  //   return ApiServices.get(`${baseUrl}GetWorkingEmployeesNoParameterList?SortColumn=${sortColumn ? sortColumn : ""}&OrderType=${orderType ? orderType : ""}&PageNumber=${pageNumber}&PageLimit=${pageLimit}&DivisionID=${divisionId}&DepartmentID=${departmentId}${filterType ? '&' + filterType + '=' + filterValue : ''}`);
  // },

  getReqRecCashTypeList() {
    return ApiServices.get(`${baseUrl}GetReqRecCashTypeList`);
  },

  getOrgSignList(signNumber) {
    return ApiServices.get(`${baseUrl}GetOrgSignList?SignNumber=${signNumber}`);
  },

  getDismissalReason() {
    return ApiServices.get(`${baseUrl}GetReasonOfDismissalList`);
  },

  getLeaveCalcType() {
    return ApiServices.get(`${baseUrl}GetLeaveCalcType`);
  },

  GetStaffListFileLog(id, tableId = "279") {
    return ApiServices.get(
      `${baseUrl}GetStaffListFileLog?id=${id}&TableID=${tableId}`
    );
  },

  GetFileLog(id, tableId = 231) {
    return ApiServices.get(`${baseUrl}GetFileLog?id=${id}&TableID=${tableId}`);
  },

  getStaffListGroupList() {
    return ApiServices.get(`${baseUrl}GetStaffListGroupList`);
  },

  getBLHGTypeList() {
    return ApiServices.get(`${baseUrl}GetBLHGTypeList`);
  },

  getAttachedClassTitleTableData(id) {
    return ApiServices.get(
      `${baseUrl}GetAttachedClassTitleTableData?AttachedClassTitleTableID=${id}`
    );
  },

  getSpecializedSubjectsList() {
    return ApiServices.get(`${baseUrl}GetSpecializedSubjectsList`);
  },

  GetPositionQualificationList() {
    return ApiServices.get(
      `${baseUrl}GetPositionQualificationList?ForBillingList=false`
    );
  },

  GetPositionPeriodicityList() {
    return ApiServices.get(`${baseUrl}GetPositionPeriodicityList`);
  },

  GetPositionSalaryTypeList() {
    return ApiServices.get(`${baseUrl}GetPositionSalaryTypeList`);
  },

  // GetFileLogForPayrollOfPlasticCardSheet(id) {
  //   return ApiServices.get(`${baseUrl}GetFileLogForPayrollOfPlasticCardSheet?DocumentID=${id}`)
  // },

  PhoneNumberCleaner(id) {
    return ApiServices.post(`${baseUrl}PhoneNumberCleaner?EmployeeID=${id}`);
  },

  GetCalculationKindList() {
    return ApiServices.get(`${baseUrl}GetCalculationKindList`);
  },

  GetAllCalculationType() {
    return ApiServices.get(`${baseUrl}GetAllCalculationType`);
  },

  GetAllCalculationMethod() {
    return ApiServices.get(`${baseUrl}GetAllCalculationMethod`);
  },

  GetDocumentChangeLog(params) {
    return ApiServices.get(`${baseUrl}GetDocumentChangeLog`, {
      params: params,
    });
  },

  GetFileLogForPayrollOfPlasticCardSheet(params) {
    return ApiServices.get(`${baseUrl}GetFileLogForPayrollOfPlasticCardSheet`, {
      params: params,
    });
  },

  GetFileLogForPayrollOfPlasticCardSheetForMilitary(params) {
    return ApiServices.get(
      `${baseUrl}GetFileLogForPayrollOfPlasticCardSheetForMilitary`,
      { params: params }
    );
  },

  GetAllOrganizationType() {
    return ApiServices.get(`${baseUrl}GetAllOrganizationType`);
  },

  getOrganizationTypeList() {
    return ApiServices.get(`${baseUrl}GetOrganizationTypeList`);
  },

  getFunctionalItemOfExpenseList() {
    return ApiServices.get(`${baseUrl}GetFunctionalItemOfExpenseList`);
  },

  getChapterToPositionOwnerList() {
    return ApiServices.get(`${baseUrl}GetChapterToPositionOwnerList`);
  },

  getPositionCategoryList() {
    return ApiServices.get(`${baseUrl}GetPositionCategoryList`);
  },

  GetDiplomaSpecialityList(payload) {
    return ApiServices.get(`${baseUrl}GetDiplomaSpecialityList`, {
      params: payload,
    });
  },

  GetCertForeignLangTypeList(payload) {
    return ApiServices.get(`${baseUrl}GetCertForeignLangTypeList`, {
      params: payload,
    });
  },
  GetCategorygroupList(payload) {
    return ApiServices.get(`${baseUrl}GetCategorygroupList`, {
      params: payload,
    });
  },
  GetSubspecialtyList(payload) {
    return ApiServices.get(`${baseUrl}GetSubspecialtyList`, {
      params: payload,
    });
  },
  GetOrganizationFunctionalItem(payload) {
    return ApiServices.get(`${baseUrl}GetOrganizationFunctionalItem`, {
      params: payload,
    });
  },
};

export default HelperServices;
