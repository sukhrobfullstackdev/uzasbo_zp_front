import React from 'react';

//Nav
const ChangePwd = React.lazy(() => import('../App/views/Users/ChangePwd'));
//Nav end

//dashboard const
const Dashboard = React.lazy(() => import('../App/views/MainPage/index'));
//dashboard const end

//References const
//organizational const
const Division = React.lazy(() => import('../App/views/References/Organizational/Division/Division'));
const UpdateDivision = React.lazy(() => import('../App/views/References/Organizational/Division/UpdateDivision'));
const Department = React.lazy(() => import('../App/views/References/Organizational/Department/Department'));
const UpdateDepartment = React.lazy(() => import('../App/views/References/Organizational/Department/UpdateDepartment'));
//
const Faculty = React.lazy(() => import('../App/views/References/Organizational/Faculty/Faculty'));
const UpdateFaculty = React.lazy(() => import('../App/views/References/Organizational/Faculty/UpdateFaculty'));

const Direction = React.lazy(() => import('../App/views/References/Organizational/Direction/Direction'));
const UpdateDirection = React.lazy(() => import('../App/views/References/Organizational/Direction/UpdateDirection'));

const Group = React.lazy(() => import('../App/views/References/Organizational/Group/Group'));
const UpdateGroup = React.lazy(() => import('../App/views/References/Organizational/Group/UpdateGroup'));
//
const ListOfPositionCategory = React.lazy(() => import('../App/views/References/Organizational/ListOfPositionCategory/ListOfPositionCategory'));
const UpdateListOfPositionCategory = React.lazy(() => import('../App/views/References/Organizational/ListOfPositionCategory/UpdateListOfPositionCategory'));
const ListOfPosition = React.lazy(() => import('../App/views/References/Organizational/ListOfPosition/ListOfPosition'));
const UpdateListOfPosition = React.lazy(() => import('../App/views/References/Organizational/ListOfPosition/UpdateListOfPosition'));
const TaxesAndCharges = React.lazy(() => import('../App/views/References/Organizational/TaxesAndCharges/TaxesAndCharges'));
const SalaryTransaction = React.lazy(() => import('../App/views/References/Organizational/SalaryTransaction/SalaryTransaction'));
//const AddSalaryTransaction = React.lazy(() => import('../App/views/References/Organizational/SalaryTransaction/AddSalaryTransaction'));
const EditSalaryTransaction = React.lazy(() => import('../App/views/References/Organizational/SalaryTransaction/EditSalaryTransaction'));
const Holiday = React.lazy(() => import('../App/views/References/Organizational/Holiday/Holiday'));
const LimitBySubCalculationKind = React.lazy(() => import('../App/views/References/Organizational/LimitBySubCalculationKind/LimitBySubCalculationKind'));
const UpdateSubCalc = React.lazy(() => import('../App/views/References/Organizational/LimitBySubCalculationKind/components/UpdateSubCalc'));
const SubDepartment = React.lazy(() => import('../App/views/References/Organizational/SubDepartment/SubDepartment'));
const UpdateSubDepartment = React.lazy(() => import('../App/views/References/Organizational/SubDepartment/UpdateSubDepartment'));
const Sector = React.lazy(() => import('../App/views/References/Organizational/Sector/Sector'));
const UpdateSector = React.lazy(() => import('../App/views/References/Organizational/Sector/UpdateSector'));
const BasicSubCalculationKind = React.lazy(() => import('../App/views/References/Organizational/BasicSubCalculationKind/BasicSubCalculationKind'));
const Shift = React.lazy(() => import('../App/views/References/Organizational/Shift/Shift'));
const ConstantValue = React.lazy(() => import('../App/views/References/Organizational/ConstantValue/ConstantValue'));
const PositionOwner = React.lazy(() => import('../App/views/References/Organizational/PositionOwner/PositionOwner'));
const SubAcc = React.lazy(() => import('../App/views/References/Organizational/SubAcc/SubAcc'));
const OrganizationsSettlementAccount = React.lazy(() => import('../App/views/References/Organizational/OrganizationsSettlementAccount/OrganizationsSettlementAccount'));
const WorkSchedule = React.lazy(() => import('../App/views/References/Organizational/WorkSchedule/WorkSchedule'));
const BasicEducationalPlan = React.lazy(() => import('../App/views/References/Organizational/BasicEducationalPlan/BasicEducationalPlan'));
const UpdateBasicEducationalPlan = React.lazy(() => import('../App/views/References/Organizational/BasicEducationalPlan/UpdateBasicEducationalPlan'));
const AppointQualCategory = React.lazy(() => import('../App/views/References/Organizational/AppointQualCategory/AppointQualCategory'));
const SubjectInBLGHT = React.lazy(() => import('../App/views/References/Organizational/SubjectInBLGHT/SubjectInBLGHT'));
const UpdateSubjectInBLGHT = React.lazy(() => import('../App/views/References/Organizational/SubjectInBLGHT/UpdateSubjectsInBLGHT'));
//organizational const end

//global const
const Bank = React.lazy(() => import('../App/views/References/Global/Bank/Bank'));
const ItemOfExpense = React.lazy(() => import('../App/views/References/Global/ItemOfExpense/ItemOfExpense'));
const AllowedTransaction = React.lazy(() => import('../App/views/References/Global/AllowedTransaction/AllowedTransaction'));
const CalculationKind = React.lazy(() => import('../App/views/References/Global/CalculationKind/CalculationKind'));
const UpdateCalculationKind = React.lazy(() => import('../App/views/References/Global/CalculationKind/UpdateCalculationKind'));
const MinimalSalary = React.lazy(() => import('../App/views/References/Global/MinimalSalary/MinimalSalary'));
const TariffScale = React.lazy(() => import('../App/views/References/Global/TariffScale/TariffScale'));
const QualificationCategory = React.lazy(() => import('../App/views/References/Global/QualificationCategory/QualificationCategory'));
const Subjects = React.lazy(() => import('../App/views/References/Global/Subjects/Subjects'));
const Position = React.lazy(() => import('../App/views/References/Global/Position/Position'));
const AllPositions = React.lazy(() => import('../App/views/References/Global/AllPositions/AllPositions'));
const BaseSalary = React.lazy(() => import('../App/views/References/Global/BaseSalary/BaseSalary'));
const EditBaseSalary = React.lazy(() => import('../App/views/References/Global/BaseSalary/EditBaseSalary'));
const ExperienceContWork = React.lazy(() => import('../App/views/References/Global/ExperienceContWork/ExperienceContWork'));
const ScholarshipCategory = React.lazy(() => import('../App/views/References/Global/ScholarshipCategory/ScholarshipCategory'));
const PositionQualificationAmount = React.lazy(() => import('../App/views/References/Global/PositionQualificationAmount/PositionQualificationAmount'));
const StaffPositionAmount = React.lazy(() => import('../App/views/References/Global/StaffPositionAmount/StaffPositionAmount'));
const TaxRelief = React.lazy(() => import('../App/views/References/Global/TaxRelief/TaxRelief'));

const Employee = React.lazy(() => import('../App/views/References/Organizational/Employee/Employees'));
const UpdateEmployee = React.lazy(() => import('../App/views/References/Organizational/Employee/UpdateEmployee'));

const SubCalculationKind = React.lazy(() => import('../App/views/References/Organizational/SubCalculationKind/SubCalculationKind'));
const UpdateSubCalculationKind = React.lazy(() => import('../App/views/References/Organizational/SubCalculationKind/UpdateSubCalculationKind'));
//global const end

// Template references
const TPHoliday = React.lazy(() => import('../App/views/References/Template/TPHoliday/TPHoliday'));
const TPShift = React.lazy(() => import('../App/views/References/Template/TPShift/TPShift'));
const TPWorkSchedule = React.lazy(() => import('../App/views/References/Template/TPWorkSchedule/TPWorkSchedule'));
const TPTaxesAndCharges = React.lazy(() => import('../App/views/References/Template/TPTaxesAndCharges/TPTaxesAndCharges'));
const TPSalaryTransaction = React.lazy(() => import('../App/views/References/Template/TPSalaryTransaction/TPSalaryTransaction'));
const TPSubCalculationKind = React.lazy(() => import('../App/views/References/Template/TPSubCalculationKind/TPSubCalculationKind'));
const TPUpdateSubCalculationKind = React.lazy(() => import('../App/views/References/Template/TPSubCalculationKind/TPUpdateSubCalculationKind'));
const TPBasicSubCalculationKind = React.lazy(() => import('../App/views/References/Template/TPBasicSubCalculationKind/TPBasicSubCalculationKind'));
const TPListOfPosition = React.lazy(() => import('../App/views/References/Template/TPListOfPosition/TPListOfPosition'));
const TPListOfPositionCategory = React.lazy(() => import('../App/views/References/Template/TPListOfPositionCategory/TPListOfPositionCategory'));
const TPLimitBySubCalculationKind = React.lazy(() => import('../App/views/References/Template/TPLimitBySubCalculationKind/TPLimitBySubCalculationKind'));
// End Template references


//References const end

//Documents const
const PensionFundRegistry = React.lazy(() => import('../App/views/Documents/ElectronicReports/PensionFundRegistry/PensionFundRegistry'));
const IncomeTaxRegistry = React.lazy(() => import('../App/views/Documents/ElectronicReports/IncomeTaxRegistry/IncomeTaxRegistry'));
const IncomeTaxRegistrySend = React.lazy(() => import('../App/views/Documents/ElectronicReports/IncomeTaxRegistrySend/IncomeTaxRegistrySend'));
const EmployeeState = React.lazy(() => import('../App/views/Documents/Payroll/EmployeeState/EmployeeState'));
const AddEmployeeState = React.lazy(() => import('../App/views/Documents/Payroll/EmployeeState/AddEmployeeState'));
const EditEmployeeState = React.lazy(() => import('../App/views/Documents/Payroll/EmployeeState/EditEmployeeState'));

const ChangeSettlementAccount = React.lazy(() => import('../App/views/Documents/Payroll/ChangeSettlementAccount/ChangeSettlementAccount'));
const AddChangeSettlementAccount = React.lazy(() => import('../App/views/Documents/Payroll/ChangeSettlementAccount/AddChangeSettlementAccount'));
const TimeSheet = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TimeSheet/TimeSheet'));
const AddTimeSheet = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TimeSheet/UpdateTimeSheet'));
const EditTimeSheet = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TimeSheet/UpdateTimeSheet'));

const EmployeeEnrolment = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeEnrolment/EmployeeEnrolment'));
//const EditEmployeeEnrolment = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeEnrolment/EditEmployeeEnrolment'));
const UpdateEmployeeEnrolment = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeEnrolment/UpdateEmployeeEnrolment'));

const EmployeeMovement = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeMovement/EmployeeMovement'));
// const EditEmployeeMovement = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeMovement/EditEmployeeMovement'));
const UpdateEmployeeMovement = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeMovement/UpdateEmployeeMovement'));


const EmployeeTempEnrolment = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeTempEnrolment/EmployeeTempEnrolment'));
//const EditEmployeeTempEnrolment = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeTempEnrolment/EditEmployeeTempEnrolment'));
const UpdateEmployeeTempEnrolment = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeTempEnrolment/UpdateEmployeeTempEnrolment'));

const EmployeeTrainingEnrolment = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeTrainingEnrolment/EmployeeTrainingEnrolment'));

//const EditEmployeeTrainingEnrolment = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeTrainingEnrolment/EditEmployeeTrainingEnrolment'));
const UpdateEmployeeTrainingEnrolment = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeTrainingEnrolment/UpdateEmployeeTrainingEnrolment'));
const EmployeeDismissal = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeDismissal/EmployeeDismissal'));
const UpdateEmployeeDismissal = React.lazy(() => import('../App/views/Documents/Personnel_accounting/EmployeeDismissal/UpdateEmployeeDismissal'));
const OrderOnLeaveOfAbsence = React.lazy(() => import('../App/views/Documents/Personnel_accounting/OrderOnLeaveOfAbsence/OrderOnLeaveOfAbsence'));
const UpdateOrderOnLeaveOfAbsence = React.lazy(() => import('../App/views/Documents/Personnel_accounting/OrderOnLeaveOfAbsence/UpdateOrderOnLeaveOfAbsence'));

const ReviewOfEmployeeLeave = React.lazy(() => import('../App/views/Documents/Personnel_accounting/ReviewOfEmployeeLeave/ReviewOfEmployeeLeave'));
const UpdateReviewOfEmployeeLeave = React.lazy(() => import('../App/views/Documents/Personnel_accounting/ReviewOfEmployeeLeave/UpdateReviewOfEmployeeLeave'));
const TimeSheetEdu = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TimeSheetEdu/TimeSheetEdu'));
const UpdateTimeSheetEdu = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TimeSheetEdu/UpdateTimeSheetEdu'));

//Document/StaffList
const StaffList = React.lazy(() => import('../App/views/Documents/Personnel_accounting/StaffingTable/StaffList/StaffList'));
const UpdateStaffList = React.lazy(() => import('../App/views/Documents/Personnel_accounting/StaffingTable/StaffList/UpdateStaffList'));

//Document/TariffList
// ClassTitle
const ClassTitle = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitleNew'));
const UpdateClassTitle = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/ClassTitle/UpdateClassTitle.js'));
const ViewClassTitle = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/ClassTitle/ViewClassTitle'));// ClassTitle
// ClassRegisteryTitle
const ClassRegisteryTitle = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/ClassRegisteryTitle/ClassRegisteryTitle'));

//BillingList
const BillingList = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BillingList/BillingListNew'));
const UpdateBillingList = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BillingList/UpdateBillingList.js'));

const BLHoursGridForClass = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BLHoursGridForClass/BLHoursGridForClassNew'));
const UpdateBLHoursGridForClass = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BLHoursGridForClass/UpdateBLHoursGridForClass'));
const BLHoursGrid = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BLHoursGrid/BLHoursGridNew'));
const UpdateBLHoursGrid = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BLHoursGrid/UpdateBLHoursGrid'));

const DistributionOfLessonHours = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/DistributionOfLessonHours/DistributionOfLessonHoursNew'));
const UpdateDistributionOfLessonHours = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/DistributionOfLessonHours/UpdateDistributionOfLessonHours'));

//pay roll
const PayrollandCharge = React.lazy(() => import('../App/views/Documents/Payroll/PayrollandCharge/PayrollandCharge'));
const UpdatePayrollandCharge = React.lazy(() => import('../App/views/Documents/Payroll/PayrollandCharge/UpdatePayrollandCharge'));

//StopPlannedCalculation
const StopPlannedCalculation = React.lazy(() => import('../App/views/Documents/Payroll/StopPlannedCalculation/StopPlannedCalculation'));
const UpdateStopPlannedCalculation = React.lazy(() => import('../App/views/Documents/Payroll/StopPlannedCalculation/UpdateStopPlannedCalculation'));

//PlannedCalculation
const PlannedCalculation = React.lazy(() => import('../App/views/Documents/Payroll/PlannedCalculation/PlannedCalculation'));
const UpdatePlannedCalculation = React.lazy(() => import('../App/views/Documents/Payroll/PlannedCalculation/UpdatePlannedCalculation'));

const OrderToSendBusTrip = React.lazy(() => import('../App/views/Documents/Personnel_accounting/OrderToSendBusTrip/OrderToSendBusTrip'));
const UpdateOrderToSendBusTrip = React.lazy(() => import('../App/views/Documents/Personnel_accounting/OrderToSendBusTrip/UpdateOrderToSendBusTrip'));

//IncomeInKind
const IncomeInKind = React.lazy(() => import('../App/views/Documents/Payroll/IncomeInKind/IncomeInKind'));
const UpdateIncomeInKind = React.lazy(() => import('../App/views/Documents/Payroll/IncomeInKind/UpdateIncomeInKind'));

const RecalcOfSalary = React.lazy(() => import('../App/views/Documents/Payroll/RecalcOfSalary/RecalcOfSalary'));
const UpdateRecalcOfSalary = React.lazy(() => import('../App/views/Documents/Payroll/RecalcOfSalary/UpdateRecalcOfSalary'));

const IndexationOfSalary = React.lazy(() => import('../App/views/Documents/Payroll/IndexationOfSalary/IndexationOfSalary'));
// const UpdateIndexationOfSalary = React.lazy(() => import('../App/views/Documents/Payroll/IndexationOfSalary/UpdateIndexationOfSalary'));

//CalculationSalary
const CheckDocs = React.lazy(() => import('../App/views/Documents/EmployeeMovement/CheckDocs/CheckDocs'));
const RequestReceivingCash = React.lazy(() => import('../App/views/Documents/EmployeeMovement/RequestReceivingCash/RequestReceivingCash'));
const UpdateRequestReceivingCash = React.lazy(() => import('../App/views/Documents/EmployeeMovement/RequestReceivingCash/UpdateRequestReceivingCash'));
const PayrollOfPlasticCardSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/PayrollOfPlasticCardSheet'));
// const PayrollOfPlasticCardSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/OldPayrollOfPlasticCardSheet'));
// const AddPayrollOfPlasticCardSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/AddPayrollOfPlasticCardSheet'));
const UpdatePayrollOfPlasticCardSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/UpdatePayrollOfPlasticCardSheet'));

// const SalaryCalculation = React.lazy(() => import('../App/views/Documents/EmployeeMovement/SalaryCalculation/SalaryCalculation'));
const SalaryCalculation = React.lazy(() => import('../App/views/Documents/EmployeeMovement/SalaryCalculation/SalaryCalculation'));
// const AddSalaryCalculation = React.lazy(() => import('../App/views/Documents/EmployeeMovement/SalaryCalculation/AddSalaryCalculation'));
// const EditSalaryCalculation = React.lazy(() => import('../App/views/Documents/EmployeeMovement/SalaryCalculation/EditSalaryCalculation'));
const UpdateSalaryCalculation = React.lazy(() => import('../App/views/Documents/EmployeeMovement/SalaryCalculation/UpdateSalaryCalculation'));

const PayrollSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollSheet/PayrollSheet'));
const UpdatePayrollSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollSheet/UpdatePayrollSheet'));
const INPSRegistry = React.lazy(() => import('../App/views/Documents/EmployeeMovement/INPSRegistry/INPSRegistry'));
const UpdateINPSRegistry = React.lazy(() => import('../App/views/Documents/EmployeeMovement/INPSRegistry/UpdateINPSRegistry'));
const HousingService = React.lazy(() => import('../App/views/Documents/EmployeeMovement/HousingService/HousingService'));
// const EmployeesProfit = React.lazy(() => import('../App/views/Documents/Payroll/EmployeesProfit/EmployeesProfit'));

const SickList = React.lazy(() => import('../App/views/Documents/Payroll/SickList/SickList'));
const UpdateSickList = React.lazy(() => import('../App/views/Documents/Payroll/SickList/UpdateSickList'));
const RequestSickList = React.lazy(() => import('../App/views/Documents/Payroll/RequestSickList/RequestSickList'));
const UpdateRequestSickList = React.lazy(() => import('../App/views/Documents/Payroll/RequestSickList/UpdateRequestSickList'));

const LeavePay = React.lazy(() => import('../App/views/Documents/Payroll/LeavePay/LeavePay'));
const UpdateLeavePay = React.lazy(() => import('../App/views/Documents/Payroll/LeavePay/UpdateLeavePay'));
const RecalcOfLeave = React.lazy(() => import('../App/views/Documents/Payroll/RecalcOfLeave/RecalcOfLeave'));
const EditChangeSettlementAccount = React.lazy(() => import('../App/views/Documents/Payroll/ChangeSettlementAccount/EditChangeSettlementAccount'));

// End CalculationSalary

//Documents const end
//EmployeesProfitView
const EmployeesProfit = React.lazy(() => import('../App/views/Documents/Enteringbalances/EmployeesProfit/EmployeesProfit'));
const UpdateEmployeesProfit = React.lazy(() => import('../App/views/Documents/Enteringbalances/EmployeesProfit/UpdateEmployeesProfit'));
//others const

// Fixing final transaction
const FixingTransactions = React.lazy(() => import('../App/views/Documents/FixingFinalTransactions/FixingTransactions/FixingTransactions'));
const UpdateFixingTransactions = React.lazy(() => import('../App/views/Documents/FixingFinalTransactions/FixingTransactions/UpdateFixingTransactions'));
// Fixing final transaction end

//Ochot
const AccountBookList = React.lazy(() => import('../App/views/Report/Turnover statement/AccountBookList/AccountBookByEmployee'));
const AccountBookByEmployee = React.lazy(() => import('../App/views/Report/Accounting of debtors and creditors/AccountBookByEmployee/AccountBookList'));
const PersonnelDepartment = React.lazy(() => import('../App/views/Report/PersonnelDepartment/PersonnelDepartment'));
const PHD = React.lazy(() => import('../App/views/Report/PHD/PHD'));
const MemorialOrder5 = React.lazy(() => import('../App/views/Report/MemorialOrder5/MemorialOrder5'));
const IncomeCard = React.lazy(() => import('../App/views/Report/AccountingSalary/IncomeCard/IncomeCard'));

//Express Info
const EmployeeCard = React.lazy(() => import('../App/views/ExpressInfo/EmployeeCard/EmployeeCard'));

//Adminstrator
const Organization = React.lazy(() => import('../App/views/Documents/Admin/Organization/Organizations'));
const UpdateOrganization = React.lazy(() => import('../App/views/Documents/Admin/Organization/UpdateOrganization.js'));

const User = React.lazy(() => import('../App/views/Documents/Admin/User/Users'));
const Roles = React.lazy(() => import('../App/views/Documents/Admin/Roles/Roles'));
const ChangeDocumentStatus = React.lazy(() => import('../App/views/Documents/Admin/ChangeDocStatus/ChangeDocStatus'));
const UserError = React.lazy(() => import('../App/views/Admin/UserError/UserError'));
const UpdateUserError = React.lazy(() => import('../App/views/Admin/UserError/UpdateUserError'));
const GetPlasticCardInfo = React.lazy(() => import('../App/views/Admin/GetPlasticCardInfo/GetPlasticCardInfo'));

//Adminstrator end

// const PreferentialOrganization = React.lazy(() => import('../App/views/Documents/Admin/PreferentialOrganization/PreferentialOrganization'));
const PreferentialOrganizations = React.lazy(() => import('../App/views/Documents/Admin/PreferentialOrganization/PreferentialOrganizations'));
const UpdatePreferentialOrganizations = React.lazy(() => import('../App/views/Documents/Admin/PreferentialOrganization/UpdatePreferentialOrganizations'));

const Faq = React.lazy(() => import('../App/views/Faq/Faq'));
//others const end

const routes = [
  { path: '/faq', exact: true, name: 'faq', component: Faq, role: 'DashboardView' },
  //Nav
  { path: '/change-pwd', exact: true, name: 'Change password', component: ChangePwd },
  //Nav end
  //dashboard
  { path: '/dashboard/default', exact: true, name: 'Default', component: Dashboard, role: 'DashboardView' },
  //dashbord end
  //Reference path
  //Organizational path
  { path: '/employee', exact: true, name: 'Employee', component: Employee, role: 'EmployeeView' },
  { path: '/employee/add', exact: true, name: 'AddEmployee', component: UpdateEmployee, role: 'EmployeeInsertNew' },
  { path: '/employee/edit/:id', exact: true, name: 'EditEmployee', component: UpdateEmployee, role: 'EmployeeEditNew' },

  // { path: '/employee/add', exact: true, name: 'AddEmployee', component: AddEmployee, role: 'EmployeeInsertNew' },
  // { path: '/employee/edit/:id', exact: true, name: 'EditEmployee', component: EditEmployee, role: 'EmployeeEditNew' },

  { path: '/subCalculationKind', exact: true, name: 'SubCalculationKind', component: SubCalculationKind, role: 'SubCalculationKindView' },
  { path: '/subCalculationKind/add', exact: true, name: 'AddSubCalculationKind', component: UpdateSubCalculationKind, role: 'SubCalculationKindInsert' },
  { path: '/subCalculationKind/edit/:id', exact: true, name: 'EditSubCalculationKind', component: UpdateSubCalculationKind, role: 'SubCalculationKindEdit' },
  { path: '/division', exact: true, name: 'Division', component: Division, role: 'DivisionView' },
  { path: '/division/add', exact: true, name: 'AddDivision', component: UpdateDivision, role: 'DivisionInsert' },
  { path: '/division/edit/:id', exact: true, name: 'EditDivision', component: UpdateDivision, role: 'DivisionEdit' },
  { path: '/department', exact: true, name: 'Department', component: Department, role: 'DepartmentView' },
  { path: '/department/add', exact: true, name: 'AddDepartment', component: UpdateDepartment, role: 'DepartmentInsert' },
  { path: '/department/edit/:id', exact: true, name: 'EditDepartment', component: UpdateDepartment, role: 'DepartmentEdit' },
  ///
  { path: '/Faculty', exact: true, name: 'Faculty', component: Faculty, role: 'OrderOfScholarshipView' },
  { path: '/Faculty/add', exact: true, name: 'AddFaculty', component: UpdateFaculty, role: 'OrderOfScholarshipInsert' },
  { path: '/Faculty/edit/:id', exact: true, name: 'EditFaculty', component: UpdateFaculty, role: 'OrderOfScholarshipEdit' },

  { path: '/Direction', exact: true, name: 'Direction', component: Direction, role: 'OrderOfScholarshipView' },
  { path: '/Direction/add', exact: true, name: 'AddDirection', component: UpdateDirection, role: 'OrderOfScholarshipInsert' },
  { path: '/Direction/edit/:id', exact: true, name: 'EditDirection', component: UpdateDirection, role: 'OrderOfScholarshipEdit' },

  { path: '/Group', exact: true, name: 'Group', component: Group, role: 'OrderOfScholarshipView' },
  { path: '/Group/add', exact: true, name: 'AddGroup', component: UpdateGroup, role: 'OrderOfScholarshipInsert' },
  { path: '/Group/edit/:id', exact: true, name: 'EditGroup', component: UpdateGroup, role: 'OrderOfScholarshipEdit' },
  ///
  { path: '/listOfPositionCategory', exact: true, name: 'ListOfPositionCategory', component: ListOfPositionCategory, role: 'ListOfPositionCategoryView' },
  { path: '/listOfPositionCategory/add', exact: true, name: 'AddListOfPositionCategory', component: UpdateListOfPositionCategory, role: 'ListOfPositionCategoryInsert' },
  { path: '/listOfPositionCategory/edit/:id', exact: true, name: 'EditListOfPositionCategory', component: UpdateListOfPositionCategory, role: 'ListOfPositionCategoryEdit' },
  { path: '/listOfPosition', exact: true, name: 'ListOfPosition', component: ListOfPosition, role: 'ListOfPositionView' },
  { path: '/listOfPosition/add', exact: true, name: 'AddListOfPosition', component: UpdateListOfPosition, role: 'ListOfPositionInsert' },
  { path: '/listOfPosition/edit/:id', exact: true, name: 'EditListOfPosition', component: UpdateListOfPosition, role: 'ListOfPositionEdit' },
  { path: '/taxesAndCharges', exact: true, name: 'TaxesAndCharges', component: TaxesAndCharges, role: 'TaxesAndChargesView' },
  { path: '/salaryTransaction', exact: true, name: 'SalaryTransaction', component: SalaryTransaction, role: 'SalaryTransactionView' },

  // { path: '/salaryTransaction/add', exact: true, name: 'AddSalaryTransaction', component: AddSalaryTransaction },
  { path: '/salaryTransaction/edit/:id', exact: true, name: 'EditSalaryTransaction', component: EditSalaryTransaction, role: 'SalaryTransactionEdit' },
  { path: '/holiday', exact: true, name: 'Holiday', component: Holiday, role: "HolidayView" },
  { path: '/limitBySubCalculationKind', exact: true, name: 'LimitBySubCalculationKind', component: LimitBySubCalculationKind, role: 'LimitBySubCalculationKindView' },
  { path: "/limitBySubCalculationKind/edit/:id", exact: true, name: "UpdateSubCalc", component: UpdateSubCalc, role: "LimitBySubCalculationKindManage",},
  { path: '/position', exact: true, name: 'Position', component: Position, role: 'ListOfPositionView' },
  { path: '/AllPositions', exact: true, name: 'AllPositions', component: AllPositions, role: 'AllPositionAdd' },
  { path: '/subDepartment', exact: true, name: 'SubDepartment', component: SubDepartment, role: 'SubDepartmentView' },
  { path: '/subDepartment/add', exact: true, name: 'AddSubDepartment', component: UpdateSubDepartment, role: 'SubDepartmentInsert' },
  { path: '/subDepartment/edit/:id', exact: true, name: 'EditSubDepartment', component: UpdateSubDepartment, role: 'SubDepartmentEdit' },
  { path: '/sector', exact: true, name: 'Sector', component: Sector, role: 'SectorView' },
  { path: '/sector/add', exact: true, name: 'AddSector', component: UpdateSector, role: 'SectorEdit' },
  { path: '/sector/edit/:id', exact: true, name: 'EditSector', component: UpdateSector, role: 'SectorEdit' },
  { path: '/basicSubCalculationKind', exact: true, name: 'BasicSubCalculationKind', component: BasicSubCalculationKind, role: 'BasicSubCalculationKindView' },
  { path: '/shift', exact: true, name: 'Shift', component: Shift, role: 'ShiftView' },
  { path: '/constantValue', exact: true, name: 'ConstantValue', component: ConstantValue, role: 'ConstantValueView' },
  { path: '/PositionOwner', exact: true, name: 'PositionOwner', component: PositionOwner, role: 'PositionOwnerAdd' },
  { path: '/subAcc', exact: true, name: 'SubAcc', component: SubAcc, role: 'SubAccView' },
  { path: '/organizationsSettlementAccount', exact: true, name: 'OrganizationsSettlementAccount', component: OrganizationsSettlementAccount, role: 'OrganizationsSettlementAccountView' },
  { path: '/workSchedule', exact: true, name: 'WorkSchedule', component: WorkSchedule, role: 'WorkScheduleView' },
  { path: '/BasicEducationalPlan', exact: true, name: 'BasicEducationalPlan', component: BasicEducationalPlan, role: 'WorkScheduleView' },
  { path: '/BasicEducationalPlan/add', exact: true, name: 'AddBasicEducationalPlan', component: UpdateBasicEducationalPlan, role: 'WorkScheduleView' },
  { path: '/BasicEducationalPlan/edit/:id', exact: true, name: 'EditBasicEducationalPlan', component: UpdateBasicEducationalPlan, role: 'WorkScheduleView' },
  { path: '/AppointQualCategory', exact: true, name: 'AppointQualCategory', component: AppointQualCategory, role: 'ChangeUserEDS' },
  { path: '/SubjectsInBLHGT', exact: true, name: 'SubjectInBLGHT', component: SubjectInBLGHT, role: 'SubjectsInBLHGTView' },
  { path: '/SubjectsInBLHGT/add', exact: true, name: 'AddSubjectInBLGHT', component: UpdateSubjectInBLGHT, role: 'SubjectsInBLHGTInsert' },
  { path: '/SubjectsInBLHGT/edit/:id', exact: true, name: 'EditSubjectInBLGHT', component: UpdateSubjectInBLGHT, role: 'SubjectsInBLHGTEdit' },
  //organizational path end

  //global path
  { path: '/Bank', exact: true, name: 'Bank', component: Bank, role: 'BankView' },
  { path: '/ItemOfExpense', exact: true, name: 'ItemOfExpense', component: ItemOfExpense, role: 'ItemOfExpenseView' },
  { path: '/allowedTransaction', exact: true, name: 'AllowedTransaction', component: AllowedTransaction, role: 'AllowedTransactionView' },
  { path: '/calculationKind', exact: true, name: 'CalculationKind', component: CalculationKind, role: 'CalculationKindView' },
  { path: '/calculationKind/add', exact: true, name: 'AddCalculationKind', component: UpdateCalculationKind, role: 'CalculationKindInsert' },
  { path: '/calculationKind/edit/:id', exact: true, name: 'EditCalculationKind', component: UpdateCalculationKind, role: 'CalculationKindEdit' },
  { path: '/minimalSalary', exact: true, name: 'MinimalSalary', component: MinimalSalary, role: 'MinimalSalaryView' },
  { path: '/TariffScale', exact: true, name: 'TariffScale', component: TariffScale, role: 'TariffScaleView' },
  { path: '/qualificationCategory', exact: true, name: 'QualificationCategory', component: QualificationCategory, role: 'QualificationCategoryView' },
  { path: '/Subjects', exact: true, name: 'Subjects', component: Subjects, role: 'SubjectsView' },
  { path: '/baseSalary', exact: true, name: 'BaseSalary', component: BaseSalary, role: 'MinimalSalaryView' },
  { path: '/baseSalary/edit/:id', exact: true, name: 'EditBaseSalary', component: EditBaseSalary },
  { path: '/experienceContWork', exact: true, name: 'ExperienceContWork', component: ExperienceContWork, role: 'ExperienceContWorkView' },
  { path: '/scholarshipCategory', exact: true, name: 'ScholarshipCategory', component: ScholarshipCategory, role: 'ScholarshipCategoryView' },
  { path: '/positionQualificationAmount', exact: true, name: 'PositionQualificationAmount', component: PositionQualificationAmount, role: 'MinimalSalaryView' },
  { path: '/StaffPositionAmount', exact: true, name: 'StaffPositionAmount', component: StaffPositionAmount, role: 'StaffListView' },
  { path: '/TaxRelief', exact: true, name: 'TaxRelief', component: TaxRelief, role: 'MinimalSalaryView' },
  //global path end

  // Template references
  { path: '/TPHoliday', exact: true, name: 'TPHoliday', component: TPHoliday, role: 'TPHolidayView' },
  { path: '/TPShift', exact: true, name: 'TPShift', component: TPShift, role: 'TPShiftView' },
  { path: '/TPWorkSchedule', exact: true, name: 'TPWorkSchedule', component: TPWorkSchedule, role: 'TPWorkScheduleView' },
  { path: '/TPTaxesAndCharges', exact: true, name: 'TPTaxesAndCharges', component: TPTaxesAndCharges, role: 'TPTaxesAndChargesView' },
  { path: '/TPSalaryTransaction', exact: true, name: 'TPSalaryTransaction', component: TPSalaryTransaction, role: 'TPSalaryTransactionView' },
  { path: '/TPSubCalculationKind', exact: true, name: 'TPSubCalculationKind', component: TPSubCalculationKind, role: 'TPSubCalculationKindView' },
  { path: '/TPSubCalculationKind/add', exact: true, name: 'AddTPSubCalculationKind', component: TPUpdateSubCalculationKind, role: 'TPSubCalculationKindInsert' },
  { path: '/TPSubCalculationKind/edit/:id', exact: true, name: 'EditTPSubCalculationKind', component: TPUpdateSubCalculationKind, role: 'TPSubCalculationKindEdit' },
  { path: '/TPBasicSubCalculationKind', exact: true, name: 'TPBasicSubCalculationKind', component: TPBasicSubCalculationKind, role: 'TPBasicSubCalculationKindView' },
  { path: '/TPListOfPosition', exact: true, name: 'TPListOfPosition', component: TPListOfPosition, role: 'TPListOfPositionView' },
  { path: '/TPListOfPositionCategory', exact: true, name: 'TPListOfPositionCategory', component: TPListOfPositionCategory, role: 'TPListOfPositionCategoryView' },
  { path: '/TPLimitBySubCalculationKind', exact: true, name: 'TPLimitBySubCalculationKind', component: TPLimitBySubCalculationKind, role: 'TPLimitBySubCalculationKindView' },
  // End Template references

  //Reference path end

  //Documents path
  { path: '/PensionFundRegistry', exact: true, name: 'PensionFundRegistry', component: PensionFundRegistry, role: 'PensionFundRegistryView' },
  { path: '/IncomeTaxRegistry', exact: true, name: 'IncomeTaxRegistry', component: IncomeTaxRegistry, role: 'IncomeTaxRegistryView' },
  { path: '/IncomeTaxRegistrySend', exact: true, name: 'IncomeTaxRegistrySend', component: IncomeTaxRegistrySend, role: 'IncomeTaxRegistrySendView' },
  { path: '/EmployeeState', exact: true, name: 'EmployeeState', component: EmployeeState, role: 'EmployeeStateView' },
  { path: '/EmployeeState/add', exact: true, name: 'AddEmployeeState', component: AddEmployeeState, role: 'EmployeeStateInsert' },
  { path: '/EmployeeState/edit/:id', exact: true, name: 'EditEmployeeState', component: EditEmployeeState, role: 'EmployeeStateEdit' },
  { path: '/TimeSheet', exact: true, name: 'TimeSheet', component: TimeSheet, role: 'TimeSheetView' },
  { path: '/TimeSheet/add', exact: true, name: 'AddTimeSheet', component: AddTimeSheet, role: 'TimeSheetInsert' },
  { path: '/TimeSheet/edit/:id', exact: true, name: 'EditTimeSheet', component: EditTimeSheet, role: 'TimeSheetEdit' },

  { path: '/EmployeeEnrolment', exact: true, name: 'EmployeeEnrolment', component: EmployeeEnrolment, role: 'EmployeeEnrolmentView' },
  { path: '/EmployeeEnrolment/add', exact: true, name: 'AddEmployeeEnrolment', component: UpdateEmployeeEnrolment, role: 'EmployeeEnrolmentInsert' },
  { path: '/EmployeeEnrolment/edit/:id', exact: true, name: 'EditEmployeeEnrolment', component: UpdateEmployeeEnrolment, role: 'EmployeeEnrolmentEdit' },

  { path: '/EmployeeMovement', exact: true, name: 'EmployeeMovement', component: EmployeeMovement, role: 'EmployeeMovementView' },
  { path: '/EmployeeMovement/add', exact: true, name: 'AddEmployeeMovement', component: UpdateEmployeeMovement, role: 'EmployeeMovementInsert' },
  { path: '/EmployeeMovement/edit/:id', exact: true, name: 'EditEmployeeMovement', component: UpdateEmployeeMovement, role: 'EmployeeMovementEdit' },

  { path: '/EmployeeTempEnrolment', exact: true, name: 'EmployeeTempEnrolment', component: EmployeeTempEnrolment, role: 'EmployeeTempEnrolmentView' },
  { path: '/EmployeeTempEnrolment/add', exact: true, name: 'AddEmployeeTempEnrolment', component: UpdateEmployeeTempEnrolment, role: 'EmployeeTempEnrolmentInsert' },
  { path: '/EmployeeTempEnrolment/edit/:id', exact: true, name: 'EditEmployeeTempEnrolment', component: UpdateEmployeeTempEnrolment, role: 'EmployeeTempEnrolmentEdit' },

  { path: '/EmployeeTrainingEnrolment', exact: true, name: 'EmployeeTrainingEnrolment', component: EmployeeTrainingEnrolment, role: 'EmployeeTrainingEnrolmentView' },
  { path: '/EmployeeTrainingEnrolment/add', exact: true, name: 'AddEmployeeTrainingEnrolment', component: UpdateEmployeeTrainingEnrolment, role: 'EmployeeTrainingEnrolmentInsert' },
  { path: '/EmployeeTrainingEnrolment/edit/:id', exact: true, name: 'EditEmployeeTrainingEnrolment', component: UpdateEmployeeTrainingEnrolment, role: 'EmployeeTrainingEnrolmentEdit' },

  { path: '/OrderToSendBusTrip', exact: true, name: 'OrderToSendBusTrip', component: OrderToSendBusTrip, role: 'OrderToSendBusTripView' },
  { path: '/OrderToSendBusTrip/add', exact: true, name: 'OrderToSendBusTrip', component: UpdateOrderToSendBusTrip, role: 'OrderToSendBusTripInsert' },
  { path: '/OrderToSendBusTrip/edit/:id', exact: true, name: 'OrderToSendBusTrip', component: UpdateOrderToSendBusTrip, role: 'OrderToSendBusTripEdit' },

  { path: '/EmployeeDismissal', exact: true, name: 'EmployeeDismissal', component: EmployeeDismissal, role: 'EmployeeDismissalView' },
  { path: '/EmployeeDismissal/add', exact: true, name: 'AddEmployeeDismissal', component: UpdateEmployeeDismissal, role: 'EmployeeDismissalInsert' },
  { path: '/EmployeeDismissal/edit/:id', exact: true, name: 'EditEmployeeDismissal', component: UpdateEmployeeDismissal, role: 'EmployeeDismissalEdit' },
  { path: '/OrderOnLeaveOfAbsence', exact: true, name: 'OrderOnLeaveOfAbsence', component: OrderOnLeaveOfAbsence, role: 'OrderOnLeaveOfAbsenceView' },
  { path: '/OrderOnLeaveOfAbsence/add', exact: true, name: 'AddOrderOnLeaveOfAbsence', component: UpdateOrderOnLeaveOfAbsence, role: 'OrderOnLeaveOfAbsenceInsert' },
  { path: '/OrderOnLeaveOfAbsence/edit/:id', exact: true, name: 'EditOrderOnLeaveOfAbsence', component: UpdateOrderOnLeaveOfAbsence, role: 'OrderOnLeaveOfAbsenceEdit' },

  { path: '/ReviewOfEmployeeLeave', exact: true, name: 'ReviewOfEmployeeLeave', component: ReviewOfEmployeeLeave, role: 'ReviewOfEmployeeLeaveView' },
  { path: '/ReviewOfEmployeeLeave/add', exact: true, name: 'AddReviewOfEmployeeLeave', component: UpdateReviewOfEmployeeLeave, role: 'ReviewOfEmployeeLeaveInsert' },
  { path: '/ReviewOfEmployeeLeave/edit/:id', exact: true, name: 'EditReviewOfEmployeeLeave', component: UpdateReviewOfEmployeeLeave, role: 'ReviewOfEmployeeLeaveEdit' },
  { path: '/TimeSheetEdu', exact: true, name: 'TimeSheetEdu', component: TimeSheetEdu, role: 'TimeSheetEduView' },
  { path: '/TimeSheetEdu/add', exact: true, name: 'AddTimeSheetEdu', component: UpdateTimeSheetEdu, role: 'TimeSheetEduInsert' },
  { path: '/TimeSheetEdu/edit/:id', exact: true, name: 'EditTimeSheetEdu', component: UpdateTimeSheetEdu, role: 'TimeSheetEduEdit' },

  //Document/StaffList
  { path: '/StaffList', exact: true, name: 'StaffList', component: StaffList, role: 'StaffListView' },
  { path: '/StaffList/add', exact: true, name: 'AddStaffList', component: UpdateStaffList, role: 'StaffListEdit' },
  { path: '/StaffList/edit/:id', exact: true, name: 'EditStaffList', component: UpdateStaffList, role: 'StaffListEdit' },
  //Document/TariffList
  // ClassTitle
  { path: '/ClassTitle', exact: true, name: 'ClassTitle', component: ClassTitle, role: 'ClassTitleView' },
  // { path: '/ClassTitle/add', exact: true, name: 'UpdateClassTitle', component: UpdateClassTitle, role: 'ClassTitleInsert' },
  // { path: '/ClassTitle/edit/:id', exact: true, name: 'UpdateClassTitle', component: UpdateClassTitle, role: 'ClassTitleEdit' },
  { path: '/ClassTitle/view/:id', exact: true, name: 'ViewClassTitle', component: ViewClassTitle, role: 'ClassTitleView' },

  // ClassRegisteryTitle
  // { path: '/ClassRegisteryTitle', exact: true, name: 'ClassRegisteryTitle', component: ClassRegisteryTitle, role: 'ClassRegistryTitleView' },

  { path: '/BillingList', exact: true, name: 'BillingList', component: BillingList, role: 'BillingListView ' },
  { path: '/BillingList/add', exact: true, name: 'UpdateBillingList', component: UpdateBillingList, role: 'BillingListInsert' },
  { path: '/BillingList/edit/:id', exact: true, name: 'UpdateBillingList', component: UpdateBillingList, role: 'BillingListEdit' },

  { path: '/BLHoursGridForClass', exact: true, name: 'BLHoursGridForClass', component: BLHoursGridForClass, role: 'BLHoursGridForClassView' },
  { path: '/BLHoursGridForClass/add', exact: true, name: 'AddBLHoursGridForClass', component: UpdateBLHoursGridForClass, role: 'BLHoursGridForClassInsert' },
  { path: '/BLHoursGridForClass/edit/:id', exact: true, name: 'EditBLHoursGridForClass', component: UpdateBLHoursGridForClass, role: 'BLHoursGridForClassEdit' },
  { path: '/BLHoursGrid', exact: true, name: 'BLHoursGrid', component: BLHoursGrid, role: 'BLHoursGridView' },
  { path: '/BLHoursGrid/add', exact: true, name: 'AddBLHoursGrid', component: UpdateBLHoursGrid, role: 'BLHoursGridInsert' },
  { path: '/BLHoursGrid/edit/:id', exact: true, name: 'EditBLHoursGrid', component: UpdateBLHoursGrid, role: 'BLHoursGridEdit' },

  { path: '/DistributionOfLessonHours', exact: true, name: 'DistributionOfLessonHours', component: DistributionOfLessonHours, role: 'DistributionOfLessonHoursView' },
  { path: '/DistributionOfLessonHours/add', exact: true, name: 'AddDistributionOfLessonHours', component: UpdateDistributionOfLessonHours, role: 'DistributionOfLessonHoursView' },
  { path: '/DistributionOfLessonHours/edit/:id', exact: true, name: 'EditDistributionOfLessonHours', component: UpdateDistributionOfLessonHours, role: 'DistributionOfLessonHoursView' },

  // pay roll
  { path: '/PayrollandCharge', exact: true, name: 'PayrollandCharge', component: PayrollandCharge, role: 'PayrollandChargeView' },
  { path: '/PayrollandCharge/add', exact: true, name: 'AddPayrollandCharge', component: UpdatePayrollandCharge, role: 'PayrollandChargeInsert' },
  { path: '/PayrollandCharge/edit/:id', exact: true, name: 'EditPayrollandCharge', component: UpdatePayrollandCharge, role: 'PayrollandChargeEdit' },

  { path: '/RecalcOfSalary', exact: true, name: 'RecalcOfSalary', component: RecalcOfSalary, role: 'RecalcOfSalaryView' },
  { path: '/RecalcOfSalary/add', exact: true, name: 'AddRecalcOfSalary', component: UpdateRecalcOfSalary, role: 'RecalcOfSalaryInsert' },
  { path: '/RecalcOfSalary/edit/:id', exact: true, name: 'EditRecalcOfSalary', component: UpdateRecalcOfSalary, role: 'RecalcOfSalaryEdit' },

  { path: '/IndexationOfSalary', exact: true, name: 'IndexationOfSalary', component: IndexationOfSalary, role: 'IndexationOfSalaryView' },
  // { path: '/IndexationOfSalary/add', exact: true, name: 'AddIndexationOfSalary', component: UpdateIndexationOfSalary, role: 'IndexationOfSalaryInsert' },
  // { path: '/IndexationOfSalary/edit/:id', exact: true, name: 'EditIndexationOfSalary', component: UpdateIndexationOfSalary, role: 'IndexationOfSalaryEdit' },

  //PlannedCalculation
  { path: '/PlannedCalculation', exact: true, name: 'PlannedCalculation', component: PlannedCalculation, role: 'PlannedCalculationView' },
  { path: '/PlannedCalculation/add', exact: true, name: 'AddPlannedCalculation', component: UpdatePlannedCalculation, role: 'PlannedCalculationInsert' },
  { path: '/PlannedCalculation/edit/:id', exact: true, name: 'EditPlannedCalculation', component: UpdatePlannedCalculation, role: 'PlannedCalculationEdit' },

  //StopPlannedCalculation

  { path: '/StopPlannedCalculation', exact: true, name: 'StopPlannedCalculation', component: StopPlannedCalculation, role: 'StopPlannedCalculationView' },
  { path: '/StopPlannedCalculation/add', exact: true, name: 'AddStopPlannedCalculation', component: UpdateStopPlannedCalculation, role: 'StopPlannedCalculationInsert' },
  { path: '/StopPlannedCalculation/edit/:id', exact: true, name: 'EditStopPlannedCalculation', component: UpdateStopPlannedCalculation, role: 'StopPlannedCalculationEdit' },

  // incomeInKind
  { path: '/IncomeInKind', exact: true, name: 'IncomeInKind', component: IncomeInKind, role: 'IncomeInKindView' },
  { path: '/IncomeInKind/add', exact: true, name: 'AddIncomeInKind', component: UpdateIncomeInKind, role: 'IncomeInKindInsert' },
  { path: '/IncomeInKind/edit/:id', exact: true, name: 'EditIncomeInKind', component: UpdateIncomeInKind, role: 'IncomeInKindEdit' },


  { path: '/SickList', exact: true, name: 'SickList', component: SickList, role: 'SickListNewView' },
  { path: '/SickList/add', exact: true, name: 'AddSickList', component: UpdateSickList, role: 'SickListNewInsert' },
  { path: '/SickList/edit/:id', exact: true, name: 'EditSickList', component: UpdateSickList, role: 'SickListNewEdit' },
  { path: '/MaternityLeaveRequest', exact: true, name: 'RequestSickList', component: RequestSickList, role: 'MaternityLeaveRequestView' },
  { path: '/MaternityLeaveRequest/add', exact: true, name: 'AddSickList', component: UpdateRequestSickList, role: 'MaternityLeaveRequestInsert' },
  { path: '/MaternityLeaveRequest/edit/:id', exact: true, name: 'EditSickList', component: UpdateRequestSickList, role: 'MaternityLeaveRequestEdit' },

  //{ path: '/StopPlannedCalculation', exact: true, name: 'StopPlannedCalculation', component: StopPlannedCalculation, role: 'StopPlannedCalculationView' },

  { path: '/LeavePay', exact: true, name: 'LeavePay', component: LeavePay, role: 'LeavePayView' },
  { path: '/LeavePay/add', exact: true, name: 'AddLeavePay', component: UpdateLeavePay, role: 'LeavePayInsert' },
  { path: '/LeavePay/edit/:id', exact: true, name: 'EditLeavePay', component: UpdateLeavePay, role: 'LeavePayEdit' },

  { path: '/RecalcOfLeave', exact: true, name: 'RecalcOfLeave', component: RecalcOfLeave, role: 'RecalcOfLeaveView' },

  //CalculationSalary
  { path: '/check-docs', exact: true, name: 'checkDocs', component: CheckDocs, role: 'SalaryCalculationView' },
  { path: '/RequestReceivingCash', exact: true, name: 'RequestReceivingCash', component: RequestReceivingCash, role: 'RequestReceivingCashView' },
  { path: '/RequestReceivingCash/add', exact: true, name: 'AddRequestReceivingCash', component: UpdateRequestReceivingCash, role: 'RequestReceivingCashInsert' },
  { path: '/RequestReceivingCash/edit/:id', exact: true, name: 'EditRequestReceivingCash', component: UpdateRequestReceivingCash, role: 'RequestReceivingCashEdit' },
  { path: '/PayrollOfPlasticCardSheet', exact: true, name: 'PayrollOfPlasticCardSheet', component: PayrollOfPlasticCardSheet, role: 'PayrollOfPlasticCardSheetView' },
  { path: '/PayrollOfPlasticCardSheet/add', exact: true, name: 'AddPayrollOfPlasticCardSheet', component: UpdatePayrollOfPlasticCardSheet, role: 'PayrollOfPlasticCardSheetInsert' },
  { path: '/PayrollOfPlasticCardSheet/edit/:id', exact: true, name: 'EditPayrollOfPlasticCardSheet', component: UpdatePayrollOfPlasticCardSheet, role: 'PayrollOfPlasticCardSheetEdit' },
  { path: '/SalaryCalculation', exact: true, name: 'SalaryCalculation', component: SalaryCalculation, role: 'SalaryCalculationView' },
  { path: '/SalaryCalculation/add', exact: true, name: 'AddSalaryCalculation', component: UpdateSalaryCalculation, role: 'SalaryCalculationInsert' },
  { path: '/SalaryCalculation/edit/:id', exact: true, name: 'EditSalaryCalculation', component: UpdateSalaryCalculation, role: 'SalaryCalculationEdit' },

  //Entering balances
  { path: '/EmployeesProfit', exact: true, name: 'EmployeesProfit', component: EmployeesProfit, role: 'EmployeesProfitView' },
  { path: '/EmployeesProfit/add', exact: true, name: 'AddEmployeesProfit', component: UpdateEmployeesProfit, role: 'EmployeesProfitInsert' },
  { path: '/EmployeesProfit/edit/:id', exact: true, name: 'EditEmployeesProfit', component: UpdateEmployeesProfit, role: 'EmployeesProfitEdit' },

  { path: '/PayrollSheet', exact: true, name: 'PayrollSheet', component: PayrollSheet, role: 'PayrollSheetView' },
  { path: '/PayrollSheet/add', exact: true, name: 'AddPayrollSheet', component: UpdatePayrollSheet, role: 'PayrollSheetInsert' },
  { path: '/PayrollSheet/edit/:id', exact: true, name: 'EditPayrollSheet', component: UpdatePayrollSheet, role: 'PayrollSheetEdit' },
  { path: '/INPSRegistry', exact: true, name: 'INPSRegistry', component: INPSRegistry, role: 'INPSRegistryView' },
  { path: '/INPSRegistry/add', exact: true, name: 'AddINPSRegistry', component: UpdateINPSRegistry, role: 'INPSRegistryInsert' },
  { path: '/INPSRegistry/edit/:id', exact: true, name: 'EditINPSRegistry', component: UpdateINPSRegistry, role: 'INPSRegistryEdit' },
  { path: '/HousingService', exact: true, name: 'HousingService', component: HousingService, role: 'HousingServiceView' },

  { path: '/ChangeSettlementAccount', exact: true, name: 'ChangeSettlementAccount', component: ChangeSettlementAccount, role: 'ChangeSettlementAccountView' },
  { path: '/ChangeSettlementAccount/add', exact: true, name: 'AddChangeSettlementAccount', component: AddChangeSettlementAccount, role: 'ChangeSettlementAccountInsert' },
  { path: '/ChangeSettlementAccount/edit/:id', exact: true, name: 'EditChangeSettlementAccount', component: EditChangeSettlementAccount, role: 'ChangeSettlementAccountEdit' },

  // Fixing final transactions
  { path: '/FixingTransactions', exact: true, name: 'FixingTransactions', component: FixingTransactions, role: 'FixingTransactionView' },
  { path: '/FixingTransactions/add', exact: true, name: 'AddFixingTransactions', component: UpdateFixingTransactions, role: 'FixingTransactionInsert' },
  { path: '/FixingTransactions/edit/:id', exact: true, name: 'EditFixingTransactions', component: UpdateFixingTransactions, role: 'FixingTransactionEdit' },
  // Fixing final transactions end
  //Documents path end


  //Ochot 
  { path: '/AccountBookList', exact: true, name: 'AccountBookList', component: AccountBookList, role: 'EmployeeView' },
  { path: '/AccountBookByEmployee', exact: true, name: 'AccountBookByEmployee', component: AccountBookByEmployee, role: 'EmployeeView' },
  { path: '/PersonnelDepartment', exact: true, name: 'PersonnelDepartment', component: PersonnelDepartment, role: 'SalaryCalculationInsert' },
  { path: '/PHD', exact: true, name: 'PHD', component: PHD, role: 'EmployeeView' },
  { path: '/MemorialOrder5', exact: true, name: 'MemorialOrder5', component: MemorialOrder5, role: 'EmployeeView' },
  { path: '/IncomeCard', exact: true, name: 'IncomeCard', component: IncomeCard, role: 'EmployeeView' },

  //Express Info
  { path: '/EmployeeCard', exact: true, name: 'EmployeeCard', component: EmployeeCard, role: 'EmployeeView' },

  //Adminstrator

  { path: '/Organization', exact: true, name: 'Organization', component: Organization, role: 'OrganizationView' },
  { path: '/Organization/edit/:id', exact: true, name: 'EditOrganization', component: UpdateOrganization, role: 'OrganizationView' },

  { path: '/Roles', exact: true, name: 'Roles', component: Roles, role: 'RoleView' },
  { path: '/ChangeDocumentStatus', exact: true, name: 'ChangeDocumentStatus', component: ChangeDocumentStatus, role: 'ChangeDocumentStatusView' },

  { path: '/ControlUsers', exact: true, name: 'User', component: User, role: 'UserView' },
  { path: '/PreferentialOrganizations', exact: true, name: 'PreferentialOrganizations', component: PreferentialOrganizations, role: 'PreferentialOrganizationInsert' },
  { path: '/PreferentialOrganizations/add', exact: true, name: 'AddPreferentialOrganizations', component: UpdatePreferentialOrganizations, role: 'PreferentialOrganizationInsert' },
  { path: '/PreferentialOrganizations/edit/:id', exact: true, name: 'EditPreferentialOrganizations', component: UpdatePreferentialOrganizations, role: 'PreferentialOrganizationInsert' },

  { path: '/UserError', exact: true, name: 'UserError', component: UserError, role: 'ChangeUserEDS' },
  { path: '/UserError/add', exact: true, name: 'UpdateUserError', component: UpdateUserError, role: 'ChangeUserEDS' },
  { path: '/UserError/edit/:id', exact: true, name: 'UpdateUserError', component: UpdateUserError, role: 'ChangeUserEDS' },

  { path: '/GetPlasticCardInfo', exact: true, name: 'GetPlasticCardInfo', component: GetPlasticCardInfo, role: 'ChangeUserEDS' },
  //Adminstrator end
]

export default routes;
