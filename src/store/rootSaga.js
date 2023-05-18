import { all, call } from "redux-saga/effects";

//References
//Organizational 
import { subjectsInBLGHTSagas } from "../App/views/References/Organizational/SubjectInBLGHT/_redux/SubjectInBLGHTSaga";
import { DivisionListSagas } from "../App/views/References/Organizational/Division/_redux/DivisionSaga";
import { DepartmentListSagas } from "../App/views/References/Organizational/Department/_redux/DepartmentSaga";
import { SubDepartmentListSagas } from "../App/views/References/Organizational/SubDepartment/_redux/SubDepartmentSaga";
import { SectorListSagas } from "../App/views/References/Organizational/Sector/_redux/SectorListSagas";
import { PosCatListSagas } from "../App/views/References/Organizational/ListOfPositionCategory/_redux/PosCatListSaga";
import { PosListSagas } from "../App/views/References/Organizational/ListOfPosition/_redux/PosListSaga";
import { TaxesAndChargesListSagas } from "../App/views/References/Organizational/TaxesAndCharges/_redux/TaxesAndChargesListSaga";
import { HolidayListSagas } from "../App/views/References/Organizational/Holiday/_redux/HolidaySaga";
import { WorkScheduleListSagas } from "../App/views/References/Organizational/WorkSchedule/_redux/WorkScheduleSaga";
import { ConstantValueSagas } from "../App/views/References/Organizational/ConstantValue/_redux/ConstantValueSagas";
import { SalTranSagas } from "../App/views/References/Organizational/SalaryTransaction/_redux/SalTranSaga";
import { LimitBySubCalcSagas } from "../App/views/References/Organizational/LimitBySubCalculationKind/_redux/LimitBySubCalcSaga";
import { BasicSubCalculationKindSagas } from "../App/views/References/Organizational/BasicSubCalculationKind/_redux/BasicSubCalculationSaga";
import { ShiftSagas } from "../App/views/References/Organizational/Shift/_redux/ShiftSaga";
import { SubAccSagas } from "../App/views/References/Organizational/SubAcc/_redux/SubAccSaga";
import { OrgSettAccSagas } from "../App/views/References/Organizational/OrganizationsSettlementAccount/_redux/OrgSettAccSaga";
//Organizational end

//Global
import { BankSagas } from "../App/views/References/Global/Bank/_redux/getListSaga";
import { AllowedTransactionSagas } from "../App/views/References/Global/AllowedTransaction/_redux/getListSaga";
import { MinSalSagas } from "../App/views/References/Global/MinimalSalary/_redux/getListSaga";
import { TariffScaleSagas } from "../App/views/References/Global/TariffScale/_redux/getListSaga";
import { QualificCatSagas } from "../App/views/References/Global/QualificationCategory/_redux/getListSaga";
import { BaseSagas } from "../App/views/References/Global/BaseSalary/_redux/getListSaga";
import { ExperienceContWorkSagas } from "../App/views/References/Global/ExperienceContWork/_redux/getListSaga";
import { ScholarCatListSagas } from "../App/views/References/Global/ScholarshipCategory/_redux/getListSaga";
import { PositionSagas } from "../App/views/References/Global/Position/_redux/getListSaga";
import { PosQualcAmountSagas } from "../App/views/References/Global/PositionQualificationAmount/_redux/getListSaga"
//Global end

//References end
//all sagas
import { userListSagas } from "../App/views/Documents/Admin/User/_redux/userListSaga";
import { salaryCalcSagas } from "../App/views/Documents/EmployeeMovement/SalaryCalculation/_redux/salaryCalcSaga";
import { PlasticCardSheetForMilitarySagas } from "../App/views/Military/PlasticCardSheetForMilitary/_redux/PlasticCardSheetForMilitarySaga";
import { basicEduPlanSagas } from "../App/views/References/Organizational/BasicEducationalPlan/_redux/basicEduPlanSaga";
import { organizationListSagas } from "../App/views/Documents/Admin/Organization/_redux/organizationListSaga";
import { rolesListSagas } from "../App/views/Documents/Admin/Roles/_redux/rolesListSaga";
import { changeDocStatusSagas } from "../App/views/Documents/Admin/ChangeDocStatus/_redux/changeDocStatusSaga";
import { employeeListSagas } from "../App/views/References/Organizational/Employee/_redux/EmployeeSaga";
import { timeSheetListSagas } from "../App/views/Documents/Personnel_accounting/TimeSheet/_redux/TimeSheetSaga";
import { timeSheetEduListSagas } from "../App/views/Documents/Personnel_accounting/TimeSheetEdu/_redux/TimeSheetEduSaga";
import { personnelDepartmentListSagas } from "../App/views/Report/PersonnelDepartment/_redux/personnelDepartmentSaga";
import { PHDListSagas } from "../App/views/Report/PHD/_redux/getListSaga";
import { prefOrgsListSagas } from "../App/views/Documents/Admin/PreferentialOrganization/_redux/prefOrgsListSaga";
import { appointQualCategorySagas } from "../App/views/References/Organizational/AppointQualCategory/_redux/getListSaga";
import { UserErrorSagas } from "../App/views/Admin/UserError/_redux/UserErrorSaga";
import { subCalcKindSagas } from "../App/views/References/Organizational/SubCalculationKind/_redux/getListSaga";
import { positionOwnerSagas } from "../App/views/References/Organizational/PositionOwner/_redux/getListSaga";

import { calcKindSagas } from "../App/views/References/Global/CalculationKind/_redux/getListSaga";
import { itemOfExpenseSagas } from "../App/views/References/Global/ItemOfExpense/_redux/getListSaga";
import { allPositionsSagas } from "../App/views/References/Global/AllPositions/_redux/getListSaga";
import { taxReliefSagas } from "../App/views/References/Global/TaxRelief/_redux/getListSaga";

// Documents
import { payrollOfPlasticCardSheetSagas } from '../App/views/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/_redux/payrollOfPlasticCardSheetSagas'
import { sickListSagas } from "../App/views/Documents/Payroll/SickList/_redux/getListSaga";
import { requestSickListSagas } from "../App/views/Documents/Payroll/RequestSickList/_redux/getListSaga";
import { classRegisteryTitleSagas } from "../App/views/Documents/Personnel_accounting/TariffList/ClassRegisteryTitle/_redux/getListSaga";
import { bLHoursGridForClassSagas } from "../App/views/Documents/Personnel_accounting/TariffList/BLHoursGridForClass/_redux/getListSaga";
import { bLHoursGridSagas } from "../App/views/Documents/Personnel_accounting/TariffList/BLHoursGrid/_redux/getListSaga";
import { distributionOfLessonHoursSagas } from "../App/views/Documents/Personnel_accounting/TariffList/DistributionOfLessonHours/_redux/getListSaga";
import { billingListSagas } from "../App/views/Documents/Personnel_accounting/TariffList/BillingList/_redux/getListSaga";
import { classTitleSagas } from "../App/views/Documents/Personnel_accounting/TariffList/ClassTitle/_redux/getListSaga";
import { staffListAdminSagas } from "../App/views/Documents/Personnel_accounting/StaffingTable/StaffListAdmin/_redux/getListSaga";
import { indexByOblastSagas } from "../App/views/Documents/Personnel_accounting/StaffingTable/IndexByOblast/_redux/getListSaga";
// Documents end
// Templates
import { TPSubCalcKindSagas } from "../App/views/References/Template/TPSubCalculationKind/_redux/getListSaga";
import { TPListOfPosCategorySagas } from "../App/views/References/Template/TPListOfPositionCategory/_redux/getListSaga";
import { TPListOfPosSagas } from "../App/views/References/Template/TPListOfPosition/_redux/getListSaga";
import { TPBasicSubCalcKindSagas } from "../App/views/References/Template/TPBasicSubCalculationKind/_redux/getListSaga";
import { TPWorkScheduleSagas } from "../App/views/References/Template/TPWorkSchedule/_redux/getListSaga";
import { TPSalaryTransactionSagas } from "../App/views/References/Template/TPSalaryTransaction/_redux/getListSaga";
import { TPLimitBySubCalculationKindSagas } from "../App/views/References/Template/TPLimitBySubCalculationKind/_redux/getListSaga";
import { TPTaxesAndChargesSagas } from "../App/views/References/Template/TPTaxesAndCharges/_redux/getListSaga";
// Templates end
//Reports
import { memorialOrder5Sagas } from "../App/views/Report/MemorialOrder5/_redux/getListSaga";
import { incomeCardSagas } from "../App/views/Report/AccountingSalary/IncomeCard/_redux/getListSaga";
//Express info
import { employeeCardListSagas } from "../App/views/ExpressInfo/EmployeeCard/_redux/getListSaga";
import { staffPositionAmountSagas } from "../App/views/References/Global/StaffPositionAmount/_redux/getListSaga";

import { reportOfStudentSagas } from "../App/views/Documents/StudentAccounting/ReportsOfStudents/_redux/ReportsOfStudentsSaga";

export default function* rootSaga() {
  yield all([
    //References
    //Organizational
    call(subjectsInBLGHTSagas),
    call(DivisionListSagas),
    call(DepartmentListSagas),
    call(SubDepartmentListSagas),
    call(SectorListSagas),
    call(PosCatListSagas),
    call(PosListSagas),
    call(TaxesAndChargesListSagas),
    call(HolidayListSagas),
    call(WorkScheduleListSagas),
    call(ConstantValueSagas),
    call(SalTranSagas),
    call(LimitBySubCalcSagas),
    call(BasicSubCalculationKindSagas),
    call(ShiftSagas),
    call(SubAccSagas),
    call(OrgSettAccSagas),
    //Organizational end

    //Global
    call(staffPositionAmountSagas),
    call(BankSagas),
    call(AllowedTransactionSagas),
    call(MinSalSagas),
    call(TariffScaleSagas),
    call(QualificCatSagas),
    call(BaseSagas),
    call(ExperienceContWorkSagas),
    call(ScholarCatListSagas),
    call(PositionSagas),
    call(PosQualcAmountSagas),
    //Global end
    
    //References end
    call(salaryCalcSagas),
    call(PlasticCardSheetForMilitarySagas),
    call(basicEduPlanSagas),
    call(userListSagas),
    call(organizationListSagas),
    call(rolesListSagas),
    call(changeDocStatusSagas),
    call(employeeListSagas),
    call(timeSheetListSagas),
    call(timeSheetEduListSagas),
    call(personnelDepartmentListSagas),
    call(PHDListSagas),
    call(prefOrgsListSagas),
    call(appointQualCategorySagas),
    call(UserErrorSagas),
    call(subCalcKindSagas),
    call(positionOwnerSagas),
    // Documents
    call(payrollOfPlasticCardSheetSagas),
    call(sickListSagas),
    call(requestSickListSagas),
    call(classRegisteryTitleSagas),
    call(bLHoursGridForClassSagas),
    call(bLHoursGridSagas),
    call(distributionOfLessonHoursSagas),
    call(billingListSagas),
    call(classTitleSagas),
    call(staffListAdminSagas),
    call(indexByOblastSagas),
    // Documents end
    // Templates
    call(TPWorkScheduleSagas),
    call(TPTaxesAndChargesSagas),
    call(TPSalaryTransactionSagas),
    call(TPSubCalcKindSagas),
    call(TPBasicSubCalcKindSagas),
    call(TPLimitBySubCalculationKindSagas),
    call(TPListOfPosSagas),
    call(TPListOfPosCategorySagas),
    // Templates end
    call(calcKindSagas),
    call(itemOfExpenseSagas),
    call(allPositionsSagas),
    call(taxReliefSagas),
    //Reports
    call(memorialOrder5Sagas),
    call(incomeCardSagas),
    //Express info
    call(employeeCardListSagas),

    call(reportOfStudentSagas),
  ]);
}