import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getCurrentUser } from '../slices/channelSlice';
import { useSelector } from "react-redux";

const Public = () => {
    const [showMenu, setShowMenu] = useState(false);
    // const currentUser = useSelector(getCurrentUser);

    const toggleShowMenu = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className=''>
            <Navbar setShowMenu={toggleShowMenu} />
            <div className='flex flex-auto relative'>
                {showMenu && <Sidebar />}
                    <Outlet />
            </div>
        </div>
    )
}

export default Public