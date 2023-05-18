import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import NavLogo from './NavLogo';
import NavContent from './NavContent';
import OutsideClick from './OutsideClick';
import mainNavigation from '../../../../menu-items/main-menu-items';
import adminNavigation from '../../../../menu-items/admin-menu-items';
import cameralNavigation from '../../../../menu-items/cameral-menu-items';
import militaryNavigation from '../../../../menu-items/military-menu-items';
import centralNavigation from '../../../../menu-items/central-menu-items';
import StudentNavigation from '../../../../menu-items/student-menu-items';
import { changeLayout, collapseMenu } from '../../../../store/navigation-slice';
import { useEffect } from 'react';
import { useCallback } from 'react';

const Navigation = () => {
    const dispatch = useDispatch();
    const navigation = useSelector((state) => state.navigation);
    const windowWidth = window.innerWidth

    const onChangeLayout = useCallback((layout) => dispatch(changeLayout(layout)), [dispatch])

    const resize = useCallback(() => {
        const contentWidth = document.getElementById('root').clientWidth;

        if (navigation.layout === 'horizontal' && contentWidth < 992) {
            onChangeLayout('vertical')
        }
    }, [navigation.layout, onChangeLayout])

    useEffect(() => {
        resize();
        window.addEventListener('resize', resize)
        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [resize])

    let navClass = [
        'pcoded-navbar',
    ];

    let navigationMenu = mainNavigation.items;
    if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('CentralAccountingParent')) {
        navigationMenu = centralNavigation.items;
    } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('OrderOfScholarshipView')) {
        navigationMenu = StudentNavigation.items;
    } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('ChangeUserEDS')) {
        navigationMenu = adminNavigation.items;
    } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('CameralReport')) {
        navigationMenu = cameralNavigation.items;
    } else if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes('MilitaryPlasticCardUpload')) {
        navigationMenu = militaryNavigation.items;
    }

    if (navigation.preLayout !== null && navigation.preLayout !== '' && navigation.preLayout !== 'layout-6' && navigation.preLayout !== 'layout-8') {
        navClass = [...navClass, navigation.preLayout];
    } else {
        navClass = [
            ...navClass,
            navigation.layoutType,
            navigation.navBackColor,
            navigation.navBrandColor,
            'drp-icon-' + navigation.navDropdownIcon,
            'menu-item-icon-' + navigation.navListIcon,
            navigation.navActiveListColor,
            navigation.navListTitleColor,
        ];

        if (navigation.layout === 'horizontal') {
            navClass = [...navClass, 'theme-horizontal'];
        }

        if (navigation.navBackImage) {
            navClass = [...navClass, navigation.navBackImage];
        }

        if (navigation.navIconColor) {
            navClass = [...navClass, 'icon-colored'];
        }

        if (!navigation.navFixedLayout) {
            navClass = [...navClass, 'menupos-static'];
        }

        if (navigation.navListTitleHide) {
            navClass = [...navClass, 'caption-hide'];
        }
    }

    if (windowWidth < 992 && navigation.collapseMenu) {
        navClass = [...navClass, 'mob-open'];
    } else if (navigation.collapseMenu) {
        navClass = [...navClass, 'navbar-collapsed'];
    }

    if (navigation.preLayout === 'layout-6') {
        document.body.classList.add('layout-6');
        document.body.style.backgroundImage = navigation.layout6Background;
        document.body.style.backgroundSize = navigation.layout6BackSize;
    }

    if (navigation.preLayout === 'layout-8') {
        document.body.classList.add('layout-8');
    }

    // if (navigation.layoutType === 'dark') {
    //   document.body.classList.add('datta-dark');
    // } else {
    //   document.body.classList.remove('datta-dark');
    // }

    if (navigation.rtlLayout) {
        document.body.classList.add('datta-rtl');
    } else {
        document.body.classList.remove('datta-rtl');
    }

    if (navigation.boxLayout) {
        document.body.classList.add('container');
        document.body.classList.add('box-layout');
    } else {
        document.body.classList.remove('container');
        document.body.classList.remove('box-layout');
    }

    let navContent = (
        <div className="navbar-wrapper">
            <NavLogo collapseMenu={navigation.collapseMenu} windowWidth={windowWidth} onToggleNavigation={() => dispatch(collapseMenu())} />
            <NavContent navigation={navigationMenu} />
        </div>
    );
    if (windowWidth < 992) {
        navContent = (
            <OutsideClick>
                <div className="navbar-wrapper">
                    <NavLogo collapseMenu={navigation.collapseMenu} windowWidth={windowWidth} onToggleNavigation={() => dispatch(collapseMenu())} />
                    <NavContent navigation={navigationMenu} />
                </div>
            </OutsideClick>
        );
    }

    return (
        <>
            <nav className={navClass.join(' ')}>
                {navContent}
            </nav>
        </>
    );
}

export default React.memo(Navigation)