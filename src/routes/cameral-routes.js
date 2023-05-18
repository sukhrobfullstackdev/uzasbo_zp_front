import React from 'react';
//Nav
const ChangePwd = React.lazy(() => import('../App/views/Users/ChangePwd'));
//Nav end

//dashboard const
const Dashboard = React.lazy(() => import('../App/views/MainPage/index'));
//dashboard const end

//End Student

const CameralMaternityLeave = React.lazy(() => import('../App/views/Documents/Cameral/CameralMaternityLeave/CameralMaternityLeave'));
const CameralSalaryCalculation = React.lazy(() => import('../App/views/Documents/Cameral/CameralSalaryCalculation/CameralSalaryCalculation'));
const CameralRequestReceivingCash = React.lazy(() => import('../App/views/Documents/Cameral/CameralRequestReceivingCash/CameralRequestReceivingCash'));
const CameralPayroll = React.lazy(() => import('../App/views/Documents/Cameral/CameralPayroll/CameralPayroll'));

const BillingList = React.lazy(() => import('../App/views/Documents/Cameral/BillingList/BillingList'));

const routes = [
  //Nav
  { path: '/change-pwd', exact: true, name: 'Change password', component: ChangePwd },
  //Nav end
  //dashboard
  { path: '/dashboard/default', exact: true, name: 'Default', component: Dashboard, role: 'CameralReport' },
  //dashbord en

  //Reference path end

  //Documents path
  //Student Account 
  { path: '/CameralMaternityLeave', exact: true, name: 'CameralMaternityLeave', component: CameralMaternityLeave, role: 'CameralReport' },
  { path: '/CameralSalaryCalculation', exact: true, name: 'CameralSalaryCalculation', component: CameralSalaryCalculation, role: 'CameralReport' },
  { path: '/CameralRequestReceivingCash', exact: true, name: 'CameralRequestReceivingCash', component: CameralRequestReceivingCash, role: 'CameralReport' },
  { path: '/CameralPayroll', exact: true, name: 'CameralPayroll', component: CameralPayroll, role: 'CameralReport' },

  { path: '/BillingList', exact: true, name: 'BillingList', component: BillingList, role: 'CameralReport' },
]

export default routes;