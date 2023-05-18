import React from 'react';

const Signin = React.lazy(() => import('../App/views/Authentication/SignIn/SignIn'));

const route = [
  { path: '/auth', exact: true, name: 'Signin', component: Signin },
];

export default route;