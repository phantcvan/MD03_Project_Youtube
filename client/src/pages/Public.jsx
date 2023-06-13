import React, { useDebugValue, useState } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getShowMenu, setShowMenu } from '../slices/userSlice';
import { useDispatch, useSelector } from "react-redux";
import { Scrollbars } from 'react-custom-scrollbars-2';

const Public = () => {
    const showMenu = useSelector(getShowMenu);
    const dispatch = useDispatch();
    // const currentUser = useSelector(getCurrentUser);

    const toggleShowMenu = () => {
        dispatch(setShowMenu(!showMenu));
    };

    return (
        <div className=''>
            <Navbar setShowMenu={toggleShowMenu} />
            <div className='flex flex-auto relative'>
                {showMenu && <Sidebar />}
                {/* <Scrollbars autoHide style={{ width: '100%', height: '100%', overflow: "hidden" }}> */}
                    <Outlet />
                {/* </Scrollbars> */}
            </div>
        </div>
    )
}

export default Public