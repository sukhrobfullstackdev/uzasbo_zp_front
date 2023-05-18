// import React, { Suspense, useEffect } from 'react';
// import { Route, Switch, Redirect } from 'react-router-dom';
// import {useSelector } from 'react-redux';

// import Navigation from './Navigation';
// import NavBar from './NavBar';
// import Breadcrumb from './Breadcrumb';
// import Loader from "../Loader";
// import NotFound from "../../views/NotFound/NotFound";
// import mainRoutes from "../../../routes/main-routes";
// import adminRoutes from "../../../routes/admin-routes";
// import cameralRoutes from "../../../routes/cameral-routes";
// import militaryRoutes from "../../../routes/military-routes";
// import centralRoutes from "../../../routes/central-routes";
// import studentMenuItems from "../../../routes/student-routes"
// import { collapseMenu } from '../../../store/navigation-slice';
// import './app.scss';
// import { useDispatch } from 'react-redux';

// const AdminLayout = (props) => {
//     const dispatch = useDispatch();
//     const navigation = useSelector((state) => state.navigation);

//     useEffect(() => {
//         if (props.windowWidth > 992 && props.windowWidth <= 1024 && navigation.layout !== 'horizontal') {
//             dispatch(collapseMenu())
//           }
//     }, [props.windowWidth, navigation.layout, dispatch])

//     let routeItems = mainRoutes;
//     if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('CentralAccountingParent')) {
//         routeItems = centralRoutes;
//     } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('OrderOfScholarshipView')) {
//         routeItems = studentMenuItems;
//     } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS')) {
//         routeItems = adminRoutes;
//     } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('CameralReport')) {
//         routeItems = cameralRoutes;
//     } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('MilitaryPlasticCardUpload')) {
//         routeItems = militaryRoutes;
//     }

//     const filteredRoutes = routeItems.filter(item => {
//         return (JSON.parse(localStorage.getItem('userInfo')).Roles.includes(item.role) === true);
//     });

//     const menu = filteredRoutes.map((route, index) => {
//         return (route.component) ? (
//             <Route
//                 key={index}
//                 path={route.path}
//                 exact={route.exact}
//                 name={route.name}
//                 render={props => (
//                     <route.component {...props} />
//                 )} />
//         ) : (null);
//     });

//     const mobileOutClickHandler = () => {
//         if (props.windowWidth < 992 && navigation.collapseMenu) {
//             dispatch(collapseMenu());
//         }
//     }

//     return (
//         <>
//             {/* <Fullscreen enabled={this.props.isFullScreen}> */}
//             <Navigation />
//             <NavBar />
//             <div className="pcoded-main-container" onClick={() => mobileOutClickHandler}>
//                 <div className="pcoded-wrapper">
//                     <div className="pcoded-content">
//                         <div className="pcoded-inner-content">
//                             <Breadcrumb />
//                             <div className="main-body">
//                                 <div className="page-wrapper">
//                                     <Suspense fallback={<Loader />}>
//                                         <Switch>
//                                             {menu}
//                                             <Redirect exact from="/" to={navigation.defaultPath} />
//                                             <Route><NotFound /></Route>
//                                         </Switch>
//                                     </Suspense>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {/* </Fullscreen> */}
//         </>
//     )
// }

// export default React.memo(AdminLayout)

import React, { Component, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
// import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';

import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';
import Loader from "../Loader";
import NotFound from "../../views/NotFound/NotFound";
import mainRoutes from "../../../routes/main-routes";
import adminRoutes from "../../../routes/admin-routes";
import cameralRoutes from "../../../routes/cameral-routes";
import militaryRoutes from "../../../routes/military-routes";
import centralRoutes from "../../../routes/central-routes";
import studentMenuItems from "../../../routes/student-routes"
// import * as actionTypes from "../../../store/actions";
import './app.scss';
import { collapseMenu } from '../../../store/navigation-slice';

class AdminLayout extends Component {

  // fullScreenExitHandler = () => {
  //   if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
  //     this.props.onFullScreenExit();
  //   }
  // };

  componentDidMount() {
    if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
      this.props.onComponentWillMount();
    }

    // window.addEventListener("storage", () => {
    //   // When storage changes removes storage data
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('userInfo');
    //   this.props.history.push("/auth");
    // }, { once: true });
  }

  // componentWillMount() {
  //   if (this.props.windowWidth > 992 && this.props.windowWidth <= 1024 && this.props.layout !== 'horizontal') {
  //     this.props.onComponentWillMount();
  //   }
  // }

  mobileOutClickHandler() {
    if (this.props.windowWidth < 992 && this.props.collapseMenu) {
      this.props.onComponentWillMount();
    }
  }

  render() {
    /* full screen exit call */
    // document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
    // document.addEventListener('webkitfullscreenchange', this.fullScreenExitHandler);
    // document.addEventListener('mozfullscreenchange', this.fullScreenExitHandler);
    // document.addEventListener('MSFullscreenChange', this.fullScreenExitHandler);

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

    // const menu = routes.map((route, index) => {
    //   return (route.component) ? (
    //     <Route
    //       key={index}
    //       path={route.path}
    //       exact={route.exact}
    //       name={route.name}
    //       render={props => (
    //         <route.component {...props} />
    //       )} />
    //   ) : (null);
    // });

    // console.log(menu);
    return (
      <>
        {/* <Fullscreen enabled={this.props.isFullScreen}> */}
        <Navigation />
        <NavBar />
        <div className="pcoded-main-container" onClick={() => this.mobileOutClickHandler}>
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <Breadcrumb />
                <div className="main-body">
                  <div className="page-wrapper">
                    <Suspense fallback={<Loader />}>
                      <Switch>
                        {menu}
                        <Redirect exact from="/" to={this.props.defaultPath} />
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
    );
  }
}

const mapStateToProps = state => {
  return {
    defaultPath: state.navigation.defaultPath,
    // isFullScreen: state.isFullScreen,
    collapseMenu: state.navigation.collapseMenu,
    configBlock: state.navigation.configBlock,
    layout: state.navigation.layout
    
  }
};

const mapDispatchToProps = dispatch => {
  return {
    // onFullScreenExit: () => dispatch({ type: actionTypes.FULL_SCREEN_EXIT }),
    onComponentWillMount: () => dispatch(collapseMenu())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(AdminLayout));