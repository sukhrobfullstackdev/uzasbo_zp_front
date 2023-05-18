import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import NavIcon from "./../NavIcon";
import NavBadge from "./../NavBadge";
import { collapseMenu, navContentLeave } from '../../../../../../store/navigation-slice';

const NavItem = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useSelector((state) => state.navigation);
    const windowWidth = window.innerWidth

    let mainContent = '';
    let itemTitle = t(props.item.title);

    if (JSON.parse(localStorage.getItem('userInfo')).Roles.includes(props.item.role)) {
        if (props.item.icon) {
            itemTitle = <span className="pcoded-mtext">{t(props.item.title)}</span>;
        }

        let itemTarget = '';
        if (props.item.target) {
            itemTarget = '_blank';
        }

        let subContent;
        if (props.item.external) {
            subContent = (
                <a href={props.item.url} target='_blank' rel='noopener noreferrer'>
                    <NavIcon items={props.item} />
                    {itemTitle}
                    <NavBadge layout={navigation.layout} items={props.item} />
                </a>
            );
        } else {
            subContent = (
                <>
                    <NavLink
                        to={props.item.url}
                        className="nav-link"
                        exact={true}
                        target={itemTarget}>
                        <NavIcon items={props.item} />
                        {itemTitle}
                        <NavBadge layout={props.layout} items={props.item} />
                    </NavLink>
                </>
            );
        }

        if (props.layout === 'horizontal') {
            mainContent = (
                <li onClick={() => dispatch(navContentLeave())}>{subContent}</li>
            );
        } else {
            if (windowWidth < 992) {
                mainContent = (
                    <li className={props.item.classes} onClick={() => dispatch(collapseMenu())}>{subContent}</li>
                );
            } else {
                mainContent = (
                    <li className={props.item.classes}>{subContent}</li>
                );
            }
        }
    }

    return (
        <>
            {mainContent}
        </>
    )
}

export default NavItem