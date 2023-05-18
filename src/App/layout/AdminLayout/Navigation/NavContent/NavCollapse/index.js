import React from 'react';

import NavIcon from './../NavIcon';
import NavBadge from './../NavBadge';
import NavItem from "../NavItem";
import LoopNavCollapse from './index';
import { useTranslation } from 'react-i18next';
import { collapseToggle, navCollapseLeave } from '../../../../../../store/navigation-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const demo = '#!';

const NavCollapse = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useSelector((state) => state.navigation);

    useEffect(() => {
        const currentIndex = ((document.location.pathname).toString().split('/')).findIndex(id => id === props.collapse.id);
        if (currentIndex > -1) {
            props.onCollapseToggle(props.collapse.id, props.type);
        }
    }, [props])

    const { isOpen, isTrigger } = navigation;
    let navItems = '';
    if (props.collapse.children) {
        const collapses = props.collapse.children;

        navItems = Object.keys(collapses).map(item => {
            item = collapses[item];
            switch (item.type) {
                case 'collapse':
                    return <LoopNavCollapse key={item.id} collapse={item} type="sub" />;
                case 'item':
                    return <NavItem layout={navigation.layout} key={item.id} item={item} />;
                default:
                    return false;
            }
        });
    }

    let itemTitle = t(props.collapse.title);
    if (props.collapse.icon) {
        itemTitle = <span className="pcoded-mtext">{t(props.collapse.title)}</span>;
    }

    let navLinkClass = ['nav-link'];

    let navItemClass = ['nav-item', 'pcoded-hasmenu'];
    const openIndex = isOpen.findIndex(id => id === props.collapse.id);
    if (openIndex > -1) {
        navItemClass = [...navItemClass, 'active'];
        if (navigation.layout !== 'horizontal') {
            navLinkClass = [...navLinkClass, 'active'];
        }
    }

    const triggerIndex = isTrigger.findIndex(id => id === props.collapse.id);
    if (triggerIndex > -1) {
        navItemClass = [...navItemClass, 'pcoded-trigger'];
    }

    const currentIndex = ((document.location.pathname).toString().split('/')).findIndex(id => id === props.collapse.id);
    if (currentIndex > -1) {
        navItemClass = [...navItemClass, 'active'];
        if (navigation.layout !== 'horizontal') {
            navLinkClass = [...navLinkClass, 'active'];
        }
    }

    const subContent = (
        <>
            <a
                href={demo}
                className={navLinkClass.join(' ')}
                onClick={() => dispatch(collapseToggle({ menu: { id: props.collapse.id, type: props.type } }))}
            >
                <NavIcon items={props.collapse} />
                {itemTitle}
                <NavBadge layout={navigation.layout} items={props.collapse} />
            </a>
            <ul className="pcoded-submenu">
                {navItems}
            </ul>
        </>
    );
    let mainContent = '';
    if (navigation.layout === 'horizontal') {
        mainContent = (
            <li
                className={navItemClass.join(' ')}
                onMouseLeave={() => dispatch(navCollapseLeave({ menu: { id: props.collapse.id, type: props.type } }))}
                onMouseEnter={() => dispatch(collapseToggle({ menu: { id: props.collapse.id, type: props.type } }))}
            >
                {subContent}
            </li>
        );
    } else {
        mainContent = (
            <li className={navItemClass.join(' ')}>
                {subContent}
            </li>
        );
    }

    return (
        <>
            {mainContent}
        </>
    )
}

export default NavCollapse
