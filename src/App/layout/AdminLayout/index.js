import React, { Suspense, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Navigation from './Navigation';
import NavBar from './NavBar';
// import Breadcrumb from './Breadcrumb';
import Loader from "../Loader";
import NotFound from "../../views/NotFound/NotFound";
import mainRoutes from "../../../routes/main-routes";
import adminRoutes from "../../../routes/admin-routes";
import cameralRoutes from "../../../routes/cameral-routes";
import militaryRoutes from "../../../routes/military-routes";
import centralRoutes from "../../../routes/central-routes";
import studentMenuItems from "../../../routes/student-routes"
import { collapseMenu } from '../../../store/navigation-slice';
import './app.scss';
import { useDispatch } from 'react-redux';

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigation = useSelector((state) => state.navigation);
    const innerWidth = window.innerWidth

    useEffect(() => {
        if (innerWidth > 992 && innerWidth <= 1024 && navigation.layout !== 'horizontal') {
            dispatch(collapseMenu())
        }
    }, [innerWidth, navigation.layout, dispatch])

    let routeItems = mainRoutes;
    if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('CentralAccountingParent')) {
        routeItems = centralRoutes;
    } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('OrderOfScholarshipView')) {
        routeItems = studentMenuItems;
    } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS')) {
        routeItems = adminRoutes;
    } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('CameralReport')) {
        routeItems = cameralRoutes;
    } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('MilitaryPlasticCardUpload')) {
        routeItems = militaryRoutes;
    }

    const filteredRoutes = routeItems.filter(item => {
        return (JSON.parse(localStorage.getItem('userInfo')).Roles.includes(item.role) === true);
    });

    const menu = filteredRoutes.map((route, index) => {
        return (route.component) ? (
            <Route
                key={index}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                    <route.component {...props} />
                )} />
        ) : (null);
    });

    const mobileOutClickHandler = () => {
        if (innerWidth < 992 && navigation.collapseMenu) {
            dispatch(collapseMenu());
        }
    }

    return (
        <>
            {/* <Fullscreen enabled={navigation.isFullScreen}> */}
            <Navigation />
            <NavBar />
            <div className="pcoded-main-container" onClick={() => mobileOutClickHandler}>
                <div className="pcoded-wrapper">
                    <div className="pcoded-content">
                        <div className="pcoded-inner-content">
                            {/* <Breadcrumb /> */}
                            <div className="main-body">
                                <div className="page-wrapper">
                                    <Suspense fallback={<Loader />}>
                                        <Switch>
                                            {menu}
                                            <Redirect exact from="/" to={navigation.defaultPath} />
                                            <Route><NotFound /></Route>
                                        </Switch>
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* </Fullscreen> */}
        </>
    )
}

export default React.memo(AdminLayout)