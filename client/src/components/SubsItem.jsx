import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { incrementView } from '../slices/videoSlice';
import { MdVerified } from "react-icons/md";
import { handleNumber } from "../static/fn";

const SubsItem = ({ channelInfo, channelVideo, dateSubs }) => {
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    // console.log("channelInfo", channelInfo);
    // console.log("channelVideos", channelVideos);
    // console.log("dateSubs", dateSubs);
    const views = handleNumber(channelVideo[0].views)

    const handleVideoClick = () => {
        dispatch(incrementView(channelVideo[0].video_id));
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const imageStyle = {
        transform: isHovered ? "scale(1.1)" : "none",
        transition: "transform 0.3s ease-in-out",
    };
    const dateConvert = new Date(channelVideo[0].upload_date);
    const uploadTime = dateConvert.toLocaleDateString('en-GB');
    return (
        <div className='flex flex-col gap-3 my-3 pb-5 border-b border-yt-light-2'>
            <div className='flex gap-3 flex-row my-2'>
                <Link to={`/channel/${channelInfo.channel_id}`}>
                    <div className=' h-9 w-9 rounded-full overflow-hidden'>
                        <img src={channelInfo.logoUrl} alt="" />
                    </div>
                </Link>
                <Link to={`/channel/${channelInfo.channel_id}`}>
                    <h3 className="text-yt-white text-lg mt-1 flex items-center">
                        {channelInfo.channel_name}
                        <span className="p-1 text-yt-gray">
                            <MdVerified />
                        </span>
                    </h3>
                </Link>
            </div>
            <div className='flex gap-4'>

                <Link to={`/video/${channelVideo[0].video_id}`} onClick={handleVideoClick}>
                    <div className={`overflow-hidden rounded-2xl w-[246px] h-[138px]`} >
                        <img
                            src={channelVideo[0].thumbnail}
                            alt=""
                            className={`w-[246px] h-[138px] object-cover z-10`}
                            style={imageStyle}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                    </div>
                </Link>

                <div className='flex flex-col'>
                    <Link to={`/video/${channelVideo[0].video_id}`} onClick={handleVideoClick}  className='mb-1'>
                        <span className='mb-1'>{channelVideo[0].title}</span>
                    </Link>
                    <Link to={`/channel/${channelInfo.channel_id}`} className='mb-2'>
                        <span className='text-yt-gray text-sm mb-2'>{channelInfo.channel_name} • {views} • {uploadTime}</span>
                    </Link>
                    <span className='text-yt-gray text-sm text-justify'>
                        {channelVideo[0].description?.length <= 150
                            ? channelVideo[0].description : `${channelVideo[0].description.substr(0, 150)}...`}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default SubsItem