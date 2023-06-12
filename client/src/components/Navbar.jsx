import React, { useState } from "react";
import { MdMic } from "react-icons/md";
import { HiOutlineBars3, HiMagnifyingGlass } from "react-icons/hi2";
import { BiVideoPlus } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { FaRegBell } from "react-icons/fa";
import logo from "../assets/yt-logo-white.png";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { setUser, getUser, logout } from "../slices/userSlice";
import { setSearchQuery } from "../slices/videoSlice";
import UploadVideo from "./UploadVideo";
import { createSearchParams } from 'react-router-dom';
import { getAllChannels, getCurrentUser} from '../slices/channelSlice';

const Navbar = ({ setShowMenu }) => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const allChannels = useSelector(getAllChannels);
  const currentUser = useSelector(getCurrentUser);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Search
  const handleSearch = () => {
    dispatch(setSearchQuery(searchKeyword));
    navigate({
      pathname: `/search`,
      search: createSearchParams({
        q: searchKeyword
      }).toString()
    })
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  // login
  const handleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    dispatch(setUser(response.user));
  };

  const handleLogout = async () => {
    dispatch(logout());
    setIsDropdownOpen(false)
    await signOut(auth);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const channel_id = allChannels?.find(channel => channel.email === user?.email)?.channel_id;
  // const handleYourChannelClick = () => {
  //   // Thực hiện chuyển hướng đến trang @username
  //   window.location.href = `/channel/${channelId}`;
  // };

  return (
    <>
      <div className="bg-yt-black fixed w-full z-10 pb-2">
        <div className="h-14 flex items-center pl-4 pr-5 justify-between ">
          <div className="flex justify-between items-center">
            <div
              className="text-yt-white p-2 w-10 text-2xl text-center hover:bg-yt-light-black rounded-full 
        cursor-pointer"
              onClick={() => setShowMenu(pre => !pre)}>
              <HiOutlineBars3 />
            </div>
            <div className="py-5 w-32 pr-3">
              <Link to="/">
                <img src={logo} alt="" className="object-contain" />
              </Link>
            </div>
          </div>

          <div className="h-10 flex flex-row items-center">
            <div className="w-[593px] bg-yt-black flex border border-yt-light-black items-center rounded-3xl h-10">
              <input
                type="text"
                placeholder="Search"
                value={searchKeyword}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-yt-black h-6 ml-6 text-yt-white text-start focus:outline-none pl-4"
              />
              <button className="w-16 h-10 bg-yt-light-black px-2 py-0.5 rounded-r-3xl border-l-2 border-yt-light-black">
                <HiMagnifyingGlass
                  size={22}
                  onClick={handleSearch}
                  className="text-yt-white inline-block text-center font-thin"
                />
              </button>
            </div>
            {/* <div className="text-yt-white bg-yt-light w-10 h-10 items-center flex justify-center rounded-full ml-4 hover:bg-yt-light-black cursor-pointer">
              <MdMic className="text-center " size={23} />
            </div> */}
          </div>
          <div className="flex items-center justify-center">
            <div className="flex flex-row items-center">
              {user &&
                <div className="mr-2 p-2 w-10 hover:bg-yt-light-black rounded-full cursor-pointer">
                  <BiVideoPlus size={25} className="text-yt-white text-center" onClick={() => setOpen(true)} />
                </div>
              }
              {/* {user &&
                <div className="mx-3 p-2 w-10 hover:bg-yt-light-black rounded-full cursor-pointer">
                  <FaRegBell size={20} className="text-center text-yt-white" />
                </div>
              } */}
              <div className="mx-3 items-center cursor-pointer">
                {!user ? (
                  <button
                    className="bg-yt-red py-1 px-4 text-yt-white rounded-md"
                    onClick={handleLogin}
                  >
                    Sign In
                  </button>
                ) : (
                  <div>
                    <img
                      src={user?.photoURL}
                      alt={user?.displayName}
                      onClick={handleDropdownToggle}
                      className="object-contain rounded-full cursor-pointer w-10 h-10"
                    />
                    {isDropdownOpen && (
                      <div className="dropdown absolute mt-2 bg-[#282828] rounded-md shadow-lg right-[10px]">
                        <ul className="py-1">
                          <Link to={`/channel/${channel_id}`}>
                            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-yt-white"
                            onClick={()=>setIsDropdownOpen(false)}>
                              <span className="flex items-center gap-2"><BsPersonCircle size={20} /> Your Channel</span>
                            </li>
                          </Link>
                          <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-yt-white"
                            onClick={handleLogout}>
                            <span className="flex items-center gap-2"><RiLogoutCircleRLine size={20} /> Log out</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="flex flex-row px-3 overflow-x-scroll relative scrollbar-hide mx-32">
          {CategoryItems.map((item, i) => (
            <h2
              className="text-yt-white font-normal text-sm py-2 px-4 break-keep whitespace-nowrap bg-yt-light mr-3 cursor-pointer rounded-lg hover:bg-yt-light-1"
              key={i}
            >
              {item}
            </h2>
          ))}
        </div> */}

      </div>
      {open && <UploadVideo setOpen={setOpen} user={user}/>}
    </>
  );
};

export default Navbar;
