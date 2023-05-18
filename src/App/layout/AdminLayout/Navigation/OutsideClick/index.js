
import React from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { collapseMenu } from '../../../../../store/navigation-slice';

const OutsideClick = (props) => {
    const dispatch = useDispatch();
    const navigation = useSelector((state) => state.navigation);
    const windowWidth = window.innerWidth

    let wrapperRef = useRef(null);

    /**
     * close menu if clicked on outside of element 
     */
    const handleOutsideClick = useCallback((event) => {
        if (wrapperRef && !wrapperRef.current.contains(event.target)) {
            if (windowWidth < 992 && navigation.collapseMenu) {
                return dispatch(collapseMenu())
            }
        }
    }, [windowWidth, navigation.collapseMenu, dispatch])
    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [handleOutsideClick])

    return (
        <div className="nav-outside" ref={wrapperRef}>{props.children}</div>
    )
}

export default OutsideClick