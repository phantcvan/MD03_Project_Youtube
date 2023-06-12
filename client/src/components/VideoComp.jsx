import React, { useState } from "react";
import { MdVerified } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import { incrementView } from '../slices/videoSlice';
import { useDispatch, useSelector } from "react-redux";
import { handleNumber } from "../static/fn";
import axios from "axios";
import VideoDetail from "./VideoDetail";

// import { setChannels, setCurrentUser, getChannels, getCurrentUser } from '../slices/channelSlice';


const VideoComp = ({ video_id, channel_id, upload_date, views, title, thumbnail, allChannels, h, w,
  channelDisplay, canEdit, setEdited, setOpen,user }) => {
  // console.log(h)
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const channelIndex = allChannels?.findIndex((e, i) => e.channel_id == channel_id)
  const channelName = allChannels[channelIndex]?.channel_name;
  const channelLogo = allChannels[channelIndex]?.logoUrl;

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

  const dateConvert = new Date(upload_date);
  const uploadTime = dateConvert.toLocaleDateString('en-GB');
  // Khi click thì tăng view
  const handleVideoClick = () => {
    dispatch(incrementView(video_id));
  };
  // sửa video
  // const handleEditVideo = (video_id) => {
  //   setEdited(pre=>!pre)
  // }

  // Xoá video
  const handleDeleteVideo = (video_id) => {
    axios.delete(`http://localhost:8000/api/v1/videos/${video_id}`)
      .then(response => {
        setEdited(pre => !pre)
        console.log('Video đã được xoá thành công!');
      })
      .catch(error => {
        // Xử lý lỗi
        console.error('Đã có lỗi xảy ra khi xoá video:', error);
      });
  }
  return (
    <div className={`flex flex-col cursor-pointer mt-2 object-cover w-[${w}]`}>
      <Link to={`/video/${video_id}`} onClick={handleVideoClick}>
        <div className={`overflow-hidden rounded-2xl`} style={{ height: h }}>
          <img
            src={thumbnail}
            alt=""
            className={`w-[${w}] h-[${h}] object-cover z-10`}
            style={imageStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          // onError={handleGifLoadError}
          />
        </div>
      </Link>
      <div className="flex mt-3">
        {channelDisplay
          &&
          <Link to={`/channel/${channel_id}`}>
            <div className="flex h-9 w-9 rounded-full overflow-hidden">
              <img src={channelLogo} alt="" className="w-full h-full  object-cover" />
            </div>
          </Link>
        }
        <div className="ml-2 flex">
          <div>
            <Link to={`/video/${video_id}`}>
              <h2 className="font-medium text-yt-white text-sm mt-0 mb-0 items-center">
                {title?.length <= 50 ? title : `${title.substr(0, 50)}...`}
              </h2>
            </Link>
            {channelDisplay
              &&
              <Link to={`/channel/${channel_id}`}>
                <h3 className="text-yt-gray text-xs mt-1 flex items-center">
                  {channelName}
                  <span className="p-1">
                    <MdVerified />
                  </span>
                </h3>
              </Link>
            }
            <p className="text-yt-gray m-0 font-medium text-xs">
              {`${handleNumber(Number(views))}`} Views • {uploadTime}
            </p>
          </div>
          {canEdit &&
            <div className="relative">
              <span className="hover:rounded-full hover:bg-yt-light-2 p-2 w-8 h-8 flex items-center "
                onClick={() => setOpenMenu(pre => !pre)}>
                <BsThreeDotsVertical size={18} />
              </span>
              {openMenu &&
                <div className="bg-yt-light-2 p-2 rounded-md text-yt-gray flex flex-col absolute top-0 left-[38px] w-[120px]">
                  <span className="hover:text-yt-white" onClick={() => { setEdit(true) }}>
                    Edit video
                  </span>
                  <span className="hover:text-yt-white" onClick={() => handleDeleteVideo(video_id)}>
                    Delete video
                  </span>
                </div>}
            </div>}
          {edit && <VideoDetail  setEdit={setEdit} setOpen={setOpen} videoId={video_id} user={user}  />}
        </div>
      </div>
    </div>
  );
};

export default VideoComp;
