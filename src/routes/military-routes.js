import React from 'react';

const Dashboard = React.lazy(() => import('../App/views/MainPage/index'));
const PlasticCardSheetForMilitary = React.lazy(() => import('../App/views/Military/PlasticCardSheetForMilitary/PlasticCardSheetForMilitary'));
const UpdatePlasticCardSheetForMilitary = React.lazy(() => import('../App/views/Military/PlasticCardSheetForMilitary/UpdatePlasticCardSheetForMilitary'));

const routes = [
  { path: '/dashboard/default', exact: true, name: 'Default', component: Dashboard, role: 'DashboardView' },
  { path: '/PlasticCardSheetForMilitary', exact: true, name: 'PlasticCardSheetForMilitary', component: PlasticCardSheetForMilitary, role: 'MilitaryPlasticCardUpload' },
  { path: '/PlasticCardSheetForMilitary/add', exact: true, name: 'PlasticCardSheetForMilitary', component: UpdatePlasticCardSheetForMilitary, role: 'MilitaryPlasticCardUpload' },
  { path: '/PlasticCardSheetForMilitary/edit/:id', exact: true, name: 'PlasticCardSheetForMilitary', component: UpdatePlasticCardSheetForMilitary, role: 'MilitaryPlasticCardUpload' },
]


export default routes;