import React, { memo } from 'react';
import { MdVerified } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllChannels, getCurrentChannel } from '../slices/channelSlice';
import { Link } from "react-router-dom";
import { handleNumber } from "../static/fn";
import { getAllTags, getVideos } from '../slices/videoSlice';


const RecommendVideo = ({ thumbnail, title, views, upload_date, channel_id, allChannels, id }) => {
  const dateConvert = new Date(upload_date);
  const uploadTime = dateConvert.toLocaleDateString('en-GB');
  const dispatch = useDispatch();
  const allTags = useSelector(getAllTags);
  const videos = useSelector(getVideos);

  // const allChannels = useSelector(getAllChannels);
  const channelIndex = allChannels.findIndex((e, i) => e.channel_id == channel_id)
  const channelName = allChannels[channelIndex]?.channel_name;
  const channelLogo = allChannels[channelIndex]?.logoUrl;




  return (
    <div className="text-yt-white flex cursor-pointer w-full gap-4">
      <div className="basis-[40%] my-2 rounded-xl ">
        <img
          src={thumbnail}
          alt=""
          className="w-[100%] h-[100%] object-contain rounded-xl "
        />
      </div>
      <div className="pl-2 flex-1">
        <h2 className="text-sm font-medium">
          {title.length <= 60 ? title : `${title.substr(0, 60)}...`}
        </h2>
        <Link to={`/channel/${channel_id}`}>
          <div className="flex my-2 gap-2 items-center">
            <img src={channelLogo} alt="" className="h-6 w-6 rounded-full" />
            <span className="text-xs text-yt-gray flex items-center">
              {channelName}
              <span className="p-1">
                <MdVerified />
              </span>
            </span>
          </div>
        </Link>
        <div className="flex ml-8">
          <span className="text-xs text-yt-gray pr-1">{`${handleNumber(Number(views))}`} views</span>
          <span className="text-xs text-yt-gray pr-1"> • {uploadTime}</span>
        </div>
      </div>
    </div>
  );
};

export default memo(RecommendVideo);
