import React from 'react'
import { useState } from 'react'
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';

import NavGroup from './NavGroup';
import { navContentLeave } from '../../../../../store/navigation-slice';

const demo = '#!';

const NavContent = (props) => {
    const dispatch = useDispatch();
    const navigation = useSelector((state) => state.navigation);

    const [state, setState] = useState({
        scrollWidth: 0,
        prevDisable: true,
        nextDisable: false
    })

    const scrollPrevHandler = () => {
        const wrapperWidth = document.getElementById('sidenav-wrapper').clientWidth;
        let scrollWidth = state.scrollWidth - wrapperWidth;
        if (scrollWidth < 0) {
            setState({ scrollWidth: 0, prevDisable: true, nextDisable: false })
        } else {
            setState({ scrollWidth: scrollWidth, prevDisable: false })
        }
    };

    const scrollNextHandler = () => {
        const wrapperWidth = document.getElementById('sidenav-wrapper').clientWidth;
        const contentWidth = document.getElementById('sidenav-horizontal').clientWidth;

        let scrollWidth = state.scrollWidth + (wrapperWidth - 80);
        if (scrollWidth > (contentWidth - wrapperWidth)) {
            scrollWidth = contentWidth - wrapperWidth + 80;
            setState({ scrollWidth: scrollWidth, prevDisable: false, nextDisable: true })
        } else {
            setState({ scrollWidth: scrollWidth, prevDisable: false })
        }
    };

    const navItems = props.navigation.map(item => {
        switch (item.type) {
            case 'group':
                return <NavGroup layout={navigation.layout} key={item.id} group={item} />;
            default:
                return false;
        }
    });

    let mainContent = '';
    if (navigation.layout === 'horizontal') {
        let prevClass = ['sidenav-horizontal-prev'];
        if (state.prevDisable) {
            prevClass = [...prevClass, 'disabled'];
        }
        let nextClass = ['sidenav-horizontal-next'];
        if (state.nextDisable) {
            nextClass = [...nextClass, 'disabled'];
        }

        mainContent = (
            <div className="navbar-content sidenav-horizontal" id="layout-sidenav">
                <a href={demo} className={prevClass.join(' ')} onClick={scrollPrevHandler}><span /></a>
                <div id="sidenav-wrapper" className="sidenav-horizontal-wrapper">
                    <ul id="sidenav-horizontal" className="nav pcoded-inner-navbar sidenav-inner" onMouseLeave={() => dispatch(navContentLeave)} style={{ marginLeft: '-' + state.scrollWidth + 'px' }}>
                        {navItems}
                    </ul>
                </div>
                <a href={demo} className={nextClass.join(' ')} onClick={scrollNextHandler}><span /></a>
            </div>
        );
    } else {
        mainContent = (
            <div className="navbar-content datta-scroll">
                <PerfectScrollbar>
                    <ul className="nav pcoded-inner-navbar">
                        {navItems}
                    </ul>
                </PerfectScrollbar>
            </div>
        );
    }

    return (
        <>
            {mainContent}
        </>
    )
}

export default NavContent