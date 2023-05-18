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
const AppointQualCategory = React.lazy(() => import('../App/views/References/Organizational/AppointQualCategory/AppointQualCategory'));
//organizational const end

//global const
const Bank = React.lazy(() => import('../App/views/References/Global/Bank/Bank'));
const ItemOfExpense = React.lazy(() => import('../App/views/References/Global/ItemOfExpense/ItemOfExpense'));
const AllowedTransaction = React.lazy(() => import('../App/views/References/Global/AllowedTransaction/AllowedTransaction'));
const CalculationKind = React.lazy(() => import('../App/views/References/Global/CalculationKind/CalculationKind'));
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
const TaxRelief = React.lazy(() => import('../App/views/References/Global/TaxRelief/TaxRelief'));

const Employee = React.lazy(() => import('../App/views/References/Organizational/Employee/Employees'));
const UpdateEmployee = React.lazy(() => import('../App/views/References/Organizational/Employee/UpdateEmployee'));

const SubCalculationKind = React.lazy(() => import('../App/views/References/Organizational/SubCalculationKind/SubCalculationKind'));
//global const end

// Template references
const TPHoliday = React.lazy(() => import('../App/views/References/Template/TPHoliday/TPHoliday'));
const TPShift = React.lazy(() => import('../App/views/References/Template/TPShift/TPShift'));
const TPWorkSchedule = React.lazy(() => import('../App/views/References/Template/TPWorkSchedule/TPWorkSchedule'));
const TPTaxesAndCharges = React.lazy(() => import('../App/views/References/Template/TPTaxesAndCharges/TPTaxesAndCharges'));
const TPSalaryTransaction = React.lazy(() => import('../App/views/References/Template/TPSalaryTransaction/TPSalaryTransaction'));
const TPSubCalculationKind = React.lazy(() => import('../App/views/References/Template/TPSubCalculationKind/TPSubCalculationKind'));
const TPBasicSubCalculationKind = React.lazy(() => import('../App/views/References/Template/TPBasicSubCalculationKind/TPBasicSubCalculationKind'));
const TPListOfPosition = React.lazy(() => import('../App/views/References/Template/TPListOfPosition/TPListOfPosition'));
const TPListOfPositionCategory = React.lazy(() => import('../App/views/References/Template/TPListOfPositionCategory/TPListOfPositionCategory'));
const TPLimitBySubCalculationKind = React.lazy(() => import('../App/views/References/Template/TPLimitBySubCalculationKind/TPLimitBySubCalculationKind'));
// End Template references


//References const end

//Documents const
//Student Enrolment

//Report Students
const ReportsOfStudents = React.lazy(() => import('../App/views/Documents/StudentAccounting/ReportsOfStudents/ReportsOfStudents'));
//Report Students end

//OrderOfScholarship
const OrderOfScholarship = React.lazy(() => import('../App/views/Documents/StudentAccounting/OrderOfScholarship/OrderOfScholarship'));
const UpdateOrderOfScholarship = React.lazy(() => import('../App/views/Documents/StudentAccounting/OrderOfScholarship/UpdateOrderOfScholarship'));

//CancelOrderOfScholarship
const CancelOrderOfScholarship = React.lazy(() => import('../App/views/Documents/StudentAccounting/CancelOrderOfScholarship/CancelOrderOfScholarship'));
const UpdateCancelOrderOfScholarship = React.lazy(() => import('../App/views/Documents/StudentAccounting/CancelOrderOfScholarship/UpdateCancelOrderOfScholarship'));

//ContractOfScholarship
const ContractOfScholarship = React.lazy(() => import('../App/views/Documents/StudentAccounting/ContractOfScholarship/ContractOfScholarship'));
const UpdateContractOfScholarship = React.lazy(() => import('../App/views/Documents/StudentAccounting/ContractOfScholarship/UpdateContractOfScholarship.js'));
//ContractOfScholarship
const ScholarshipCharge = React.lazy(() => import('../App/views/Documents/StudentAccounting/ScholarshipCharge/ScholarshipCharge'));
const UpdateScholarshipCharge = React.lazy(() => import('../App/views/Documents/StudentAccounting/ScholarshipCharge/UpdateScholarshipCharge.js'));
//RequestRecievingCash
const RequestReceivingCash = React.lazy(() => import('../App/views/Documents/EmployeeMovement/RequestReceivingCash/RequestReceivingCash'));
const UpdateRequestReceivingCash = React.lazy(() => import('../App/views/Documents/EmployeeMovement/RequestReceivingCash/UpdateRequestReceivingCash'));
//End Student

const routes = [
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

  { path: '/subCalculationKind', exact: true, name: 'SubCalculationKind', component: SubCalculationKind, role: 'SubCalculationKindView' },
  { path: '/division', exact: true, name: 'Division', component: Division, role: 'DivisionView' },
  { path: '/division/add', exact: true, name: 'AddDivision', component: UpdateDivision, role: 'DivisionInsert' },
  { path: '/division/edit/:id', exact: true, name: 'EditDivision', component: UpdateDivision, role: 'DivisionEdit' },
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
  { path: '/position', exact: true, name: 'Position', component: Position, role: 'ListOfPositionView' },
  { path: '/AllPositions', exact: true, name: 'AllPositions', component: AllPositions, role: 'AllPositionAdd' },
  { path: '/subDepartment', exact: true, name: 'SubDepartment', component: SubDepartment, role: 'SubDepartmentView' },
  { path: '/subDepartment/add', exact: true, name: 'AddSubDepartment', component: UpdateSubDepartment, role: 'SubDepartmentInsert' },
  { path: '/subDepartment/edit/:id', exact: true, name: 'EditSubDepartment', component: UpdateSubDepartment, role: 'SubDepartmentEdit' },
  { path: '/sector', exact: true, name: 'Sector', component: Sector, role: 'SectorView' },
  { path: '/sector/add', exact: true, name: 'AddSector', component: UpdateSector, role: 'SectorInsert' },
  { path: '/sector/edit/:id', exact: true, name: 'EditSector', component: UpdateSector, role: 'SectorEdit' },
  { path: '/basicSubCalculationKind', exact: true, name: 'BasicSubCalculationKind', component: BasicSubCalculationKind, role: 'BasicSubCalculationKindView' },
  { path: '/shift', exact: true, name: 'Shift', component: Shift, role: 'ShiftView' },
  { path: '/constantValue', exact: true, name: 'ConstantValue', component: ConstantValue, role: 'ConstantValueView' },
  { path: '/PositionOwner', exact: true, name: 'PositionOwner', component: PositionOwner, role: 'PositionOwnerAdd' },
  { path: '/subAcc', exact: true, name: 'SubAcc', component: SubAcc, role: 'SubAccView' },
  { path: '/organizationsSettlementAccount', exact: true, name: 'OrganizationsSettlementAccount', component: OrganizationsSettlementAccount, role: 'OrganizationsSettlementAccountView' },
  { path: '/workSchedule', exact: true, name: 'WorkSchedule', component: WorkSchedule, role: 'WorkScheduleView' },
  { path: '/AppointQualCategory', exact: true, name: 'AppointQualCategory', component: AppointQualCategory, role: 'ChangeUserEDS' },
  //organizational path end

  //global path
  { path: '/Bank', exact: true, name: 'Bank', component: Bank, role: 'BankView' },
  { path: '/ItemOfExpense', exact: true, name: 'ItemOfExpense', component: ItemOfExpense, role: 'ItemOfExpenseView' },
  { path: '/allowedTransaction', exact: true, name: 'AllowedTransaction', component: AllowedTransaction, role: 'AllowedTransactionView' },
  { path: '/calculationKind', exact: true, name: 'CalculationKind', component: CalculationKind, role: 'CalculationKindView' },
  { path: '/minimalSalary', exact: true, name: 'MinimalSalary', component: MinimalSalary, role: 'MinimalSalaryView' },
  { path: '/TariffScale', exact: true, name: 'TariffScale', component: TariffScale, role: 'TariffScaleView' },
  { path: '/qualificationCategory', exact: true, name: 'QualificationCategory', component: QualificationCategory, role: 'QualificationCategoryView' },
  { path: '/Subjects', exact: true, name: 'Subjects', component: Subjects, role: 'SubjectsView' },
  { path: '/baseSalary', exact: true, name: 'BaseSalary', component: BaseSalary, role: 'MinimalSalaryView' },
  { path: '/baseSalary/edit/:id', exact: true, name: 'EditBaseSalary', component: EditBaseSalary },
  { path: '/experienceContWork', exact: true, name: 'ExperienceContWork', component: ExperienceContWork, role: 'ExperienceContWorkView' },
  { path: '/scholarshipCategory', exact: true, name: 'ScholarshipCategory', component: ScholarshipCategory, role: 'ScholarshipCategoryView' },
  { path: '/positionQualificationAmount', exact: true, name: 'PositionQualificationAmount', component: PositionQualificationAmount, role: 'MinimalSalaryView' },
  { path: '/TaxRelief', exact: true, name: 'TaxRelief', component: TaxRelief, role: 'MinimalSalaryView' },
  //global path end

  // Template references
  { path: '/TPHoliday', exact: true, name: 'TPHoliday', component: TPHoliday, role: 'TPHolidayView' },
  { path: '/TPShift', exact: true, name: 'TPShift', component: TPShift, role: 'TPShiftView' },
  { path: '/TPWorkSchedule', exact: true, name: 'TPWorkSchedule', component: TPWorkSchedule, role: 'TPWorkScheduleView' },
  { path: '/TPTaxesAndCharges', exact: true, name: 'TPTaxesAndCharges', component: TPTaxesAndCharges, role: 'TPTaxesAndChargesView' },
  { path: '/TPSalaryTransaction', exact: true, name: 'TPSalaryTransaction', component: TPSalaryTransaction, role: 'TPSalaryTransactionView' },
  { path: '/TPSubCalculationKind', exact: true, name: 'TPSubCalculationKind', component: TPSubCalculationKind, role: 'TPSubCalculationKindView' },
  { path: '/TPBasicSubCalculationKind', exact: true, name: 'TPBasicSubCalculationKind', component: TPBasicSubCalculationKind, role: 'TPBasicSubCalculationKindView' },
  { path: '/TPListOfPosition', exact: true, name: 'TPListOfPosition', component: TPListOfPosition, role: 'TPListOfPositionView' },
  { path: '/TPListOfPositionCategory', exact: true, name: 'TPListOfPositionCategory', component: TPListOfPositionCategory, role: 'TPListOfPositionCategoryView' },
  { path: '/TPLimitBySubCalculationKind', exact: true, name: 'TPLimitBySubCalculationKind', component: TPLimitBySubCalculationKind, role: 'TPLimitBySubCalculationKindView' },
  // End Template references

  //Reference path end

  //Documents path

  //Report Students
  { path: '/ReportsOfStudents', exact: true, name: 'ReportsOfStudents', component: ReportsOfStudents, role: 'OrderOfScholarshipView' },
  //Report Students end

  //OrderOfScholarship 
  { path: '/OrderOfScholarship', exact: true, name: 'OrderOfScholarship', component: OrderOfScholarship, role: 'OrderOfScholarshipView' },
  { path: '/OrderOfScholarship/add', exact: true, name: 'AddOrderOfScholarship', component: UpdateOrderOfScholarship, role: 'OrderOfScholarshipInsert' },
  { path: '/OrderOfScholarship/edit/:id', exact: true, name: 'EditOrderOfScholarship', component: UpdateOrderOfScholarship, role: 'OrderOfScholarshipEdit' },

  //OrderOfScholarship 
  { path: '/CancelOrderOfScholarship', exact: true, name: 'CancelOrderOfScholarship', component: CancelOrderOfScholarship, role: 'CancelOrderOfScholarshipView' },
  { path: '/CancelOrderOfScholarship/add', exact: true, name: 'AddCancelOrderOfScholarship', component: UpdateCancelOrderOfScholarship, role: 'CancelOrderOfScholarshipInsert' },
  { path: '/CancelOrderOfScholarship/edit/:id', exact: true, name: 'EditCancelOrderOfScholarship', component: UpdateCancelOrderOfScholarship, role: 'CancelOrderOfScholarshipEdit' },

  //ContractOfScholarship 
  { path: '/ContractOfScholarship', exact: true, name: 'ContractOfScholarship', component: ContractOfScholarship, role: 'ContractOfScholarshipView' },
  { path: '/ContractOfScholarship/add', exact: true, name: 'AddContractOfScholarship', component: UpdateContractOfScholarship, role: 'ContractOfScholarshipInsert' },
  { path: '/ContractOfScholarship/edit/:id', exact: true, name: 'EditContractOfScholarship', component: UpdateContractOfScholarship, role: 'ContractOfScholarshipEdit' },

  //ContractOfScholarship 
  { path: '/ScholarshipCharge', exact: true, name: 'ScholarshipCharge', component: ScholarshipCharge, role: 'ScholarshipChargeView' },
  { path: '/ScholarshipCharge/add', exact: true, name: 'AddScholarshipCharge', component: UpdateScholarshipCharge, role: 'ScholarshipChargeInsert' },
  { path: '/ScholarshipCharge/edit/:id', exact: true, name: 'EditScholarshipCharge', component: UpdateScholarshipCharge, role: 'ScholarshipChargeEdit' },
  //RequestRecievingCash
  { path: '/RequestReceivingCash', exact: true, name: 'RequestReceivingCash', component: RequestReceivingCash, role: 'RequestReceivingCashView' },
  { path: '/RequestReceivingCash/add', exact: true, name: 'AddRequestReceivingCash', component: UpdateRequestReceivingCash, role: 'RequestReceivingCashInsert' },
  { path: '/RequestReceivingCash/edit/:id', exact: true, name: 'EditRequestReceivingCash', component: UpdateRequestReceivingCash, role: 'RequestReceivingCashEdit' },
  //End Student Account

  //Documents path end
]

export default routes;