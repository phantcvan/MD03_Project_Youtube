import React, { useState } from "react";
import { SideBar, CategoryItems } from "../static/data";
import "../App.css";
import { Link } from "react-router-dom";
import { getAllChannels, getChannelsSub } from '../slices/channelSlice';
import { setUser, getUser } from "../slices/userSlice";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { AiFillChrome, AiFillHome } from "react-icons/ai";



const Sidebar = ({ setShowMenu }) => {
  const [active, setActive] = useState("Home");
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const allChannels = useSelector(getAllChannels);
  const channelsSub = useSelector(getChannelsSub);
  const sidebar = SideBar();
  // const channel_id = allChannels?.find((e, i) => e.email === user.email)?.channel_id;

  const handleLogin = async () => {
    const response = await signInWithPopup(auth, provider);
    dispatch(setUser(response.user));
  };
  return (
    <div className="yt-scrollbar scrollbar-hide overflow-scroll w-60 bg-yt-black h-[calc(100vh-53px)] 
    mt-14 fixed top-0 left-0 text-yt-white p-3 z-20">

      <div className="mb-4">
        {sidebar.SideBarItems.Top.map((item, index) => (
          <Link to={item.path} key={index}>
            <div
              className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black
               my-1 ${item.name === active ? "bg-yt-light-black" : "bg-yt-black"
                }`}
              onClick={() => setActive(item.name)}
            >
              <span className="mr-5 my-1">{item.icon}</span>
              <p className="p-2 text-sm font-medium">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
      {sidebar.SideBarItems.Middle.length > 0
        && <>
          <hr className="text-yt-light-black my-2" />
          <div className="mb-4">
            {sidebar.SideBarItems.Middle.map((item, index) => (
              <Link to={item.path} key={index}>
                <div
                  key={index}
                  className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black my-1 ${item.name === active ? "bg-yt-light-black" : "bg-yt-black"
                    }`}
                  onClick={() => setActive(item.name)}
                >
                  <span className="mr-5">{item.icon}</span>
                  <p className="p-2 text-sm font-medium">{item.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </>}
      {!user
        && <div className="px-3">
          <hr className="text-yt-light-black my-2" />
          <div className="mb-4 ">
            <span className="my-2 text-justify">Sign in to like videos, comment, and subscribe.</span>
            <div className="my-2 border border-yt-light-black w-fit rounded-xl">
              <button
                className=" text-[#37A6FF] py-2 px-4"
                onClick={handleLogin}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      }
      {user && sidebar.SideBarItems.Subscriptions.length > 0
        && <div>
          <hr className="text-yt-light-black my-2" />
          <h2 className="py-2 px-3">Subscriptions</h2>
          <div className="mb-4">
            {sidebar.SideBarItems.Subscriptions.map((item, index) => (
              <Link to={item.path} key={index}>
                <div
                  className={`h-10 flex justify-start px-3 rounded-xl items-center cursor-pointer hover:bg-yt-light-black
               my-1 ${item.name === active ? "bg-yt-light-black" : "bg-yt-black"} gap-4`}
                  onClick={() => setActive(item.name)}
                >
                  <div className="h-6 w-6 rounded-full overflow-hidden">
                    <img src={item.logoUrl} alt="" />
                  </div>
                  <p className="p-2 text-sm font-medium">{item.name}</p>
                </div>
              </Link>
            ))}

          </div>
        </div>}
      <hr className="text-yt-light-black" />
      <div className="flex flex-wrap">
        {CategoryItems.map((item, index) => {
          return (
            <div
              key={index}
              className={`h-8 flex flex-wrap justify-start px-1 rounded-xl items-center cursor-pointer hover:bg-yt-light-black`}
            >
              <p className="px-2 text-sm">{item}</p>
            </div>
          )
        }
        )}
      </div>
      <hr className="text-yt-light-black my-2" />
    </div>
  );
};

export default Sidebar;
