import React, { useState } from 'react';
import logo from "../assets/yt-logo.png";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSearchParams } from 'react-router-dom';
import { setSearchQuery } from "../slices/videoSlice";
import { HiMagnifyingGlass } from "react-icons/hi2";

const NotFound = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch();

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
    return (
        <div className='bg-[#F1F1F1] min-h-screen flex flex-col justify-center items-center'>
            <div className='mb-3'>
                <img src={"http://localhost:8000/assets/notFound.png"} />
            </div>
            <span className='text-lg'>This page isn't available. Sorry about that.</span>
            <span className='text-lg mb-1'>Try searching for something else.</span>
            <div className='flex flex-row items-center gap-4'>
                <Link to="/">
                    <img src={logo} className='h-[90px]' />
                </Link>
                <div className="w-[90%] bg-yt-white flex border border-yt-gray items-center 
            justify-between rounded-3xl h-10">
                    <div className="rounded-l-3xl text-yt-white hover:border hover:border-[#1C62B9] h-10 w-[100%] flex items-center">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchKeyword}
                            onKeyDown={(e) => handleKeyDown(e)}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-full bg-yt-white h-6 ml-6 text-yt-black text-start focus:outline-none pl-4"
                        />
                    </div>
                    <button className="w-16 h-10 bg-yt-gray px-2 py-0.5 rounded-r-3xl border-l-2 border-yt-gray">
                        <HiMagnifyingGlass
                            size={22}
                            onClick={handleSearch}
                            className="text-yt-white inline-block text-center font-thin"
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound