import { combineReducers } from "redux";

//References
//Orgabizational reference
import subjectLnBLGHTReducer from "../App/views/References/Organizational/SubjectInBLGHT/_redux/getListSlice";
import DivisionListReducer from "../App/views/References/Organizational/Division/_redux/DivisionSlice";
import DepartmentListReducer from "../App/views/References/Organizational/Department/_redux/getListSlice";
import SubDepartmentListReducer from "../App/views/References/Organizational/SubDepartment/_redux/getListSlice";
import SectorListReducer from "../App/views/References/Organizational/Sector/_redux/getListSlice";
import PostCatListReducer from "../App/views/References/Organizational/ListOfPositionCategory/_redux/getListSlice";
import PosListReducer from "../App/views/References/Organizational/ListOfPosition/_redux/getListSlice";
import TaxesAndChargesListReducer from "../App/views/References/Organizational/TaxesAndCharges/_redux/getListSlice";
import HolidayListReducer from "../App/views/References/Organizational/Holiday/_redux/getListSlice";
import WorkScheduleListReducer from "../App/views/References/Organizational/WorkSchedule/_redux/getListSlice";
import ConstantValueListReducer from "../App/views/References/Organizational/ConstantValue/_redux/getListSlice";
import SalTranListReducer from "../App/views/References/Organizational/SalaryTransaction/_redux/getListSlice";
import LimitBySubCalcReducer from "../App/views/References/Organizational/LimitBySubCalculationKind/_redux/getListSlice";
import BasicSubCalculationKindReducer from "../App/views/References/Organizational/BasicSubCalculationKind/_redux/getListSlice";
import ShiftReducer from "../App/views/References/Organizational/Shift/_redux/getListSlice";
import SubAccReducer from "../App/views/References/Organizational/SubAcc/_redux/getListSlice";
import OrgSettAccReducer from "../App/views/References/Organizational/OrganizationsSettlementAccount/_redux/getListSlice";
//Orgabizational reference

//Global reference
import BanksReducer from "../App/views/References/Global/Bank/_redux/getListSlice";
import AllowedTransactionReducer from "../App/views/References/Global/AllowedTransaction/_redux/getListSlice"
import MinSalReducer from "../App/views/References/Global/MinimalSalary/_redux/getListSlice";
import TariffScaleReducer from "../App/views/References/Global/TariffScale/_redux/getListSlice";
import QualificatCatReducer from "../App/views/References/Global/QualificationCategory/_redux/getListSlice";
import BaseReducer from "../App/views/References/Global/BaseSalary/_redux/getListSlice";
import ExperienceContWorkReducer from "../App/views/References/Global/ExperienceContWork/_redux/getListSlice";
import ScholarCatReducer from "../App/views/References/Global/ScholarshipCategory/_redux/getListSlice";
import PositionReducer from "../App/views/References/Global/Position/_redux/getListSlice";
import PosQualcAmountReducer from "../App/views/References/Global/PositionQualificationAmount/_redux/getListSlice"
//Global reference end

//References end

import navigationReducer from "./navigation-slice";
import userListReducer from "../App/views/Documents/Admin/User/_redux/usersSlice";
import salaryCalcGetListReducer from "../App/views/Documents/EmployeeMovement/SalaryCalculation/_redux/getListSlice";
import PlasticCardSheetForMilitaryReducer from "../App/views/Military/PlasticCardSheetForMilitary/_redux/getListSlice";
import basicEduPlanGetListReducer from "../App/views/References/Organizational/BasicEducationalPlan/_redux/getListSlice";
import organizationListReducer from "../App/views/Documents/Admin/Organization/_redux/organizationsSlice";
import rolesListReducer from "../App/views/Documents/Admin/Roles/_redux/rolesSlice";
import changeDocSatusReducer from "../App/views/Documents/Admin/ChangeDocStatus/_redux/changeDocStatusSlice";
import employeeListReducer from "../App/views/References/Organizational/Employee/_redux/EmployeeSlice";
import timeSheetListReducer from "../App/views/Documents/Personnel_accounting/TimeSheet/_redux/TimeSheetSlice";
import timeSheetEduListReducer from "../App/views/Documents/Personnel_accounting/TimeSheetEdu/_redux/TimeSheetEduSlice";
import personnelDepartmentListReducer from "../App/views/Report/PersonnelDepartment/_redux/personnelDepartmentSlice";
import PHDReducer from "../App/views/Report/PHD/_redux/getListSlice";
// Documents
import payrollOfPlasticCardSheetReducer from "../App/views/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/_redux/getListSlice";
import reportsOfStudentsListReducer from "../App/views/Documents/StudentAccounting/ReportsOfStudents/_redux/ReportsOfStudentsSlice";
import sickListReducer from "../App/views/Documents/Payroll/SickList/_redux/getListSlice";
import requestSickListReducer from "../App/views/Documents/Payroll/RequestSickList/_redux/getListSlice";
import classRegisteryTitleReducer from "../App/views/Documents/Personnel_accounting/TariffList/ClassRegisteryTitle/_redux/getListSlice";
import bLHoursGridForClassReducer from "../App/views/Documents/Personnel_accounting/TariffList/BLHoursGridForClass/_redux/getListSlice";
import bLHoursGridReducer from "../App/views/Documents/Personnel_accounting/TariffList/BLHoursGrid/_redux/getListSlice";
import distributionOfLessonHoursReducer from "../App/views/Documents/Personnel_accounting/TariffList/DistributionOfLessonHours/_redux/getListSlice";
import billingListReducer from "../App/views/Documents/Personnel_accounting/TariffList/BillingList/_redux/getListSlice";
import classTitleReducer from "../App/views/Documents/Personnel_accounting/TariffList/ClassTitle/_redux/getListSlice";
import staffListAdminReducer from "../App/views/Documents/Personnel_accounting/StaffingTable/StaffListAdmin/_redux/getListSlice";
// Documents end
import prefOrgsListReducer from "../App/views/Documents/Admin/PreferentialOrganization/_redux/prefOrgsSlice";
import appointQualCategoryReducer from "../App/views/References/Organizational/AppointQualCategory/_redux/getListSlice";
import UserErorReducer from "../App/views/Admin/UserError/_redux/getListSlice";
import subalcKindReducer from "../App/views/References/Organizational/SubCalculationKind/_redux/getListSlice";
import positionOwnerReducer from "../App/views/References/Organizational/PositionOwner/_redux/getListSlice";

import calcKindReducer from "../App/views/References/Global/CalculationKind/_redux/getListSlice";
import itemOfExpenseReducer from "../App/views/References/Global/ItemOfExpense/_redux/getListSlice";
import allPositionsReducer from "../App/views/References/Global/AllPositions/_redux/getListSlice";
import taxReliefReducer from "../App/views/References/Global/TaxRelief/_redux/getListSlice";
// Templates
import TPSubcalcKindReducer from "../App/views/References/Template/TPSubCalculationKind/_redux/getListSlice";
import TPListOfPosCategoryReducer from "../App/views/References/Template/TPListOfPositionCategory/_redux/getListSlice";
import TPListOfPosReducer from "../App/views/References/Template/TPListOfPosition/_redux/getListSlice";
import TPBasicSubcalcKindReducer from "../App/views/References/Template/TPBasicSubCalculationKind/_redux/getListSlice";
import TPWorkScheduleReducer from "../App/views/References/Template/TPWorkSchedule/_redux/getListSlice";
import TPSalaryTransactionReducer from "../App/views/References/Template/TPSalaryTransaction/_redux/getListSlice";
import TPLimitBySubCalculationKindReducer from "../App/views/References/Template/TPLimitBySubCalculationKind/_redux/getListSlice";
import TPTaxesAndChargesReducer from "../App/views/References/Template/TPTaxesAndCharges/_redux/getListSlice";
// Templates end
//Reports
import memorialOrder5Reducer from "../App/views/Report/MemorialOrder5/_redux/getListSlice";
import incomeCardReducer from "../App/views/Report/AccountingSalary/IncomeCard/_redux/getListSlice";
//Express info
import employeeCardListReducer from "../App/views/ExpressInfo/EmployeeCard/_redux/getListSlice";
import staffPositionAmountReducer from "../App/views/References/Global/StaffPositionAmount/_redux/getListSlice";
import indexByOblastReducer from "../App/views/Documents/Personnel_accounting/StaffingTable/IndexByOblast/_redux/getListSlice";

export const rootReducer = combineReducers({
  //References
  //Organizational References
  subjectsInBLGHTList: subjectLnBLGHTReducer,
  DivisionList: DivisionListReducer,
  DepartmentList: DepartmentListReducer,
  SubDepartmentList: SubDepartmentListReducer,
  SectorList: SectorListReducer,
  PostCatList: PostCatListReducer,
  PosList: PosListReducer,
  TaxesAndChargesList: TaxesAndChargesListReducer,
  HolidayList: HolidayListReducer,
  WorkScheduleList: WorkScheduleListReducer,
  ConstantValueList: ConstantValueListReducer,
  SalTransList: SalTranListReducer,
  LimitBySubCalcList: LimitBySubCalcReducer,
  BasicSubCalculationKindList: BasicSubCalculationKindReducer,
  ShiftList: ShiftReducer,
  SubAccList: SubAccReducer,
  OrgSettAccList: OrgSettAccReducer,
  //Organizational References end
  //Global
  staffPositionAmountList: staffPositionAmountReducer,
  banksList: BanksReducer,
  allowedTransactionList: AllowedTransactionReducer,
  minSalList: MinSalReducer,
  TariffScaleList: TariffScaleReducer,
  QualificationCategoryList:QualificatCatReducer,
  BaseSalaryList: BaseReducer,
  ExperienceContWorkList: ExperienceContWorkReducer,
  ScholarCatList: ScholarCatReducer,
  PositionList: PositionReducer,
  PosQualcAmountList: PosQualcAmountReducer,
  //Global end
  //References end
  navigation: navigationReducer,
  userList: userListReducer,
  salaryCalcGetList: salaryCalcGetListReducer,
  plasticCardSheetForMilitaryGetList: PlasticCardSheetForMilitaryReducer,
  basicEduPlanGetList: basicEduPlanGetListReducer,
  organizationList: organizationListReducer,
  rolesList: rolesListReducer,
  changeDocSatus: changeDocSatusReducer,
  employeeList: employeeListReducer,
  timeSheetList: timeSheetListReducer,
  timeSheetEduList: timeSheetEduListReducer,
  personnelDepartmentList: personnelDepartmentListReducer,
  PHDList: PHDReducer,
  prefOrgsList: prefOrgsListReducer,
  appointQualCategoryList: appointQualCategoryReducer,
  userErrorList: UserErorReducer,
  subalcKindList: subalcKindReducer,
  positionOwnerList: positionOwnerReducer,
  // Documents
  payrollOfPlasticCardSheetList: payrollOfPlasticCardSheetReducer,
  sickList: sickListReducer,
  requestSickList: requestSickListReducer,
  classRegisteryTitleList: classRegisteryTitleReducer,
  bLHoursGridForClassList: bLHoursGridForClassReducer,
  bLHoursGridList: bLHoursGridReducer,
  distributionOfLessonHoursList: distributionOfLessonHoursReducer,
  billingList: billingListReducer,
  classTitle: classTitleReducer,
  staffListAdmin: staffListAdminReducer,
  indexByOblastReducerList: indexByOblastReducer,
  // Documents end
  // Templates
  tpWorkScheduleList: TPWorkScheduleReducer,
  tpTaxesAndChargesList: TPTaxesAndChargesReducer,
  tpSalaryTransactionList: TPSalaryTransactionReducer,
  tpSubcalcKindList: TPSubcalcKindReducer,
  tpBasicSubcalcKindList: TPBasicSubcalcKindReducer,
  tpLimitBySubCalcKindList: TPLimitBySubCalculationKindReducer,
  tpListOfPosList: TPListOfPosReducer,
  tpListOfPosCategoryList: TPListOfPosCategoryReducer,
  // Templates end
  calcKindList: calcKindReducer,
  itemOfExpenseList: itemOfExpenseReducer,
  allPositionsList: allPositionsReducer,
  taxReliefList: taxReliefReducer,
  //Reports
  memorialOrder5List: memorialOrder5Reducer,
  incomeCardList: incomeCardReducer,
  //Express info
  employeeCardList: employeeCardListReducer,
  reportOfStudentsList: reportsOfStudentsListReducer,
});