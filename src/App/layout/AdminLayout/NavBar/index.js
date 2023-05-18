import React from 'react';

import NavLeft from "./NavLeft";
import NavRight from "./NavRight";
import logo from '../../../../assets/images/uzasbo.png';
import { collapseMenu } from '../../../../store/navigation-slice';
import { useDispatch, useSelector } from 'react-redux';

const demo = '#!';

const NavBar = () => {
    const dispatch = useDispatch();
    const navigation = useSelector((state) => state.navigation);

    let headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg', navigation.headerBackColor];
    if (navigation.headerFixedLayout) {
        headerClass = [...headerClass, 'headerpos-fixed'];
    }

    let toggleClass = ['mobile-menu'];
    if (navigation.collapseMenu) {
        toggleClass = [...toggleClass, 'on'];
    }

    return (
        <>
            <header className={headerClass.join(' ')}>
                <div className="m-header">
                    <a className={toggleClass.join(' ')} id="mobile-collapse1" href={demo} onClick={() => dispatch(collapseMenu())}><span /></a>
                    <a href={demo} className="b-brand">
                        <img src={logo} alt="UzASBO" style={{ transition: 'opacity .5s ease-in-out' }} />
                    </a>
                </div>
                <a className="mobile-menu" id="mobile-header" href={demo}><i className="feather icon-more-horizontal" /></a>
                <div className="collapse navbar-collapse">
                    <NavLeft />
                    <NavRight rtlLayout={navigation.rtlLayout} />
                </div>
            </header>
        </>
    )
}

export default React.memo(NavBar)
