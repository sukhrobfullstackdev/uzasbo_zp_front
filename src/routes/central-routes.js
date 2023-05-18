import React from 'react';

//dashboard 
const Dashboard = React.lazy(() => import('../App/views/MainPage/index'));
//dashboard 

//Documents
// const PayrollOfPlasticCardSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/PayrollOfPlasticCardSheet'));
const PayrollOfPlasticCardSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/PayrollOfPlasticCardSheet'));
const UpdatePayrollOfPlasticCardSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollOfPlasticCardSheet/UpdatePayrollOfPlasticCardSheet'));

const INPSRegistry = React.lazy(() => import('../App/views/Documents/EmployeeMovement/INPSRegistry/INPSRegistry'));
const UpdateINPSRegistry = React.lazy(() => import('../App/views/Documents/EmployeeMovement/INPSRegistry/UpdateINPSRegistry'));

const PayrollSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollSheet/PayrollSheet'));
const UpdatePayrollSheet = React.lazy(() => import('../App/views/Documents/EmployeeMovement/PayrollSheet/UpdatePayrollSheet'));

const RequestReceivingCash = React.lazy(() => import('../App/views/Documents/EmployeeMovement/RequestReceivingCash/RequestReceivingCash'));
const UpdateRequestReceivingCash = React.lazy(() => import('../App/views/Documents/EmployeeMovement/RequestReceivingCash/UpdateRequestReceivingCash'));

const AllowanceByRegion = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/AllowanceByRegion/AllowanceByRegion'));

const ClassTitleSend = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/ClassTitleSend/ClassTitleSend'));
const UpdateClassTitle = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/ClassTitleSend/UpdateClassTitle.js'));

//Document/StaffList
const StaffListSend = React.lazy(() => import('../App/views/Documents/Personnel_accounting/StaffingTable/StaffListSend/StaffListSend'));
const StaffListReceived = React.lazy(() => import('../App/views/Documents/Personnel_accounting/StaffingTable/StaffListReceived/StaffListReceived'));
const IndexStaffListRegistery = React.lazy(() => import('../App/views/Documents/Personnel_accounting/StaffingTable/IndexStaffListRegistery/IndexStaffListRegistery'));
const UpdateStaffListRegistery = React.lazy(() => import('../App/views/Documents/Personnel_accounting/StaffingTable/IndexStaffListRegistery/UpdateStaffListRegistery'));

// ClassTitle
const ClassTitle = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/ClassTitle/ClassTitleNew'));
const ViewClassTitle = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/ClassTitle/ViewClassTitle'));// ClassTitle

const BillingListSend = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BillingListSend/BillingListSend'));
const ViewBillingListSend = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BillingListSend/ViewBillingListSend'));
const BillingListReceived = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BillingListReceived/BillingListReceived'));
const IncomeTaxRegistrySend = React.lazy(() => import('../App/views/Documents/ElectronicReports/IncomeTaxRegistrySend/IncomeTaxRegistrySend'));

const BillingListAdmin = React.lazy(() => import('../App/views/Documents/Personnel_accounting/TariffList/BillingListAdmin/BillingListAdmin'));

const routes = [
  //dashboard
  { path: '/dashboard/default', exact: true, name: 'Default', component: Dashboard, role: 'DashboardView' },
  //dashbord end

  //Documents path
  { path: '/PayrollOfPlasticCardSheet', exact: true, name: 'PayrollOfPlasticCardSheet', component: PayrollOfPlasticCardSheet, role: 'PayrollOfPlasticCardSheetView' },
  { path: '/PayrollOfPlasticCardSheet/add', exact: true, name: 'AddPayrollOfPlasticCardSheet', component: UpdatePayrollOfPlasticCardSheet, role: 'PayrollOfPlasticCardSheetInsert' },
  { path: '/PayrollOfPlasticCardSheet/edit/:id', exact: true, name: 'EditPayrollOfPlasticCardSheet', component: UpdatePayrollOfPlasticCardSheet, role: 'PayrollOfPlasticCardSheetEdit' },

  { path: '/INPSRegistry', exact: true, name: 'INPSRegistry', component: INPSRegistry, role: 'INPSRegistryView' },
  { path: '/INPSRegistry/add', exact: true, name: 'AddINPSRegistry', component: UpdateINPSRegistry, role: 'INPSRegistryInsert' },
  { path: '/INPSRegistry/edit/:id', exact: true, name: 'EditINPSRegistry', component: UpdateINPSRegistry, role: 'INPSRegistryEdit' },

  { path: '/PayrollSheet', exact: true, name: 'PayrollSheet', component: PayrollSheet, role: 'PayrollSheetView' },
  { path: '/PayrollSheet/add', exact: true, name: 'AddPayrollSheet', component: UpdatePayrollSheet, role: 'PayrollSheetInsert' },
  { path: '/PayrollSheet/edit/:id', exact: true, name: 'EditPayrollSheet', component: UpdatePayrollSheet, role: 'PayrollSheetEdit' },

  { path: '/RequestReceivingCash', exact: true, name: 'RequestReceivingCash', component: RequestReceivingCash, role: 'RequestReceivingCashView' },
  { path: '/RequestReceivingCash/add', exact: true, name: 'AddRequestReceivingCash', component: UpdateRequestReceivingCash, role: 'RequestReceivingCashInsert' },
  { path: '/RequestReceivingCash/edit/:id', exact: true, name: 'EditRequestReceivingCash', component: UpdateRequestReceivingCash, role: 'RequestReceivingCashEdit' },

  { path: '/AllowanceByRegion', exact: true, name: 'AllowanceByRegion', component: AllowanceByRegion, role: 'CentralAccountingParent' },

  { path: '/ClassTitleSend', exact: true, name: 'ClassTitleSend', component: ClassTitleSend, role: 'CentralAccountingParent' },
  { path: '/ClassTitleSend/add', exact: true, name: 'UpdateClassTitle', component: UpdateClassTitle, role: 'CentralAccountingParent' },
  { path: '/ClassTitleSend/edit/:id', exact: true, name: 'UpdateClassTitle', component: UpdateClassTitle, role: 'CentralAccountingParent' },

  // ClassTitle
  { path: '/ClassTitle', exact: true, name: 'ClassTitle', component: ClassTitle, role: 'ClassTitleView' },
  // { path: '/ClassTitle/add', exact: true, name: 'UpdateClassTitle', component: UpdateClassTitle, role: 'ClassTitleInsert' },
  // { path: '/ClassTitle/edit/:id', exact: true, name: 'UpdateClassTitle', component: UpdateClassTitle, role: 'ClassTitleEdit' },
  { path: '/ClassTitle/view/:id', exact: true, name: 'ViewClassTitle', component: ViewClassTitle, role: 'ClassTitleView' },

  //Document/StaffList
  { path: '/StaffListSend', exact: true, name: 'StaffList', component: StaffListSend, role: 'StaffListSend' },
  { path: '/StaffListReceived', exact: true, name: 'StaffListReceived', component: StaffListReceived, role: 'StaffListReceived' },
  { path: '/IndexStaffListRegistery', exact: true, name: 'IndexStaffListRegistery', component: IndexStaffListRegistery, role: 'StaffListRegisteryView' },
  { path: '/IndexStaffListRegistery/add', exact: true, name: 'UpdateStaffListRegistery', component: UpdateStaffListRegistery, role: 'StaffListRegisteryEdit' },
  { path: '/IndexStaffListRegistery/edit/:id', exact: true, name: 'UpdateStaffListRegistery', component: UpdateStaffListRegistery, role: 'StaffListRegisteryEdit' },

  { path: '/BillingListSend', exact: true, name: 'BillingListSend', component: BillingListSend, role: 'CentralAccountingParent' },
  { path: '/BillingListSend/view/:id', exact: true, name: 'ViewBillingListSend', component: ViewBillingListSend, role: 'CentralAccountingParent' },
  { path: '/BillingListReceived', exact: true, name: 'BillingListReceived', component: BillingListReceived, role: 'CentralAccountingParent' },
  { path: '/IncomeTaxRegistrySend', exact: true, name: 'IncomeTaxRegistrySend', component: IncomeTaxRegistrySend, role: 'IncomeTaxRegistrySendView' },

  { path: '/BillingListAdmin', exact: true, name: 'BillingListAdmin', component: BillingListAdmin, role: 'CentralAccountingParent' },

  //End Documents path
]

export default routes;

