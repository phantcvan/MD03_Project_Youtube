import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { getShowMenu, setShowMenu, getShowLogIn, setShowLogIn } from "../slices/appSlice";
import { getUser, setUser} from "../slices/userSlice";
import { getVideos } from "../slices/videoSlice";
import { Link } from "react-router-dom";
import RecommendVideo from "../components/RecommendVideo";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setAllChannels, getAllChannels } from '../slices/channelSlice';
import { Scrollbars } from 'react-custom-scrollbars-2';


const Liked = () => {
  const dispatch = useDispatch();
  const [videoLiked, setVideoLiked] = useState([]);
  const [finalVideo, setFinalVideo] = useState([]);
  const [actions, setActions] = useState([]);
  const user = useSelector(getUser);
  const allVideos = useSelector(getVideos);
  const allChannels = useSelector(getAllChannels);
  const showMenu = useSelector(getShowMenu);
  const showLogIn = useSelector(getShowLogIn);
  const fetchData = async () => {
    try {
      const [actionResponse, videosResponse, channelsResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/v1/actions`),
        axios.get('http://localhost:8000/api/v1/videos'),
        axios.get('http://localhost:8000/api/v1/channels'),

      ]);
      const videos = videosResponse?.data.videos.filter((video) => {
        return actionResponse?.data.actions.some(
          (action) => action.email === user?.email && action.action === 1 && action.video_id === video.video_id
        );
      });
      setActions(actionResponse?.data.actions);
      setVideoLiked(videos);
      if (videos.length > 0) {
        setFinalVideo(videos[videos.length - 1]);
      }
      dispatch(setShowMenu(false));
      dispatch(setShowLogIn(false));

      onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(setUser(user));
          handleAddChannel(channelsResponse.data.channels, user);
        } else {
          dispatch(setUser(null));
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  console.log(videoLiked);

  useEffect(() => {
    fetchData();
    if (user != null) {
      fetchData();
    }
  }, []);
  function generateRandomChannelId() {
    const randomId = Math.floor(Math.random() * 10000000).toString().padStart(7, "0");
    return randomId;
  }
  const handleAddChannel = async (channels, user) => {
    try {
      const findChannelIndex = channels.findIndex((e, i) => e.email == user.email);
      if (findChannelIndex !== -1) {
        const newChannel_id = generateRandomChannelId();
        while (allChannels.some(channel => channel.channel_id === newChannel_id)) {
          newChannel_id = generateRandomChannelId();
        }
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const newChannel = {
          channel_id: newChannel_id,
          email: user?.email,
          logoUrl: user?.photoURL,
          channel_name: user?.displayName,
          joinDate: formattedDate,
          thumbnailM: null,
        };

        await axios.post('http://localhost:8000/api/v1/channels', newChannel);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const background = {
    background: '#7A2B2B',
    background: '-moz-linear-gradient(top, #7A2B2B 0%, #392121 50%, #0F0F0F 100%)',
    background: '-webkit-linear-gradient(top, #7A2B2B 0%, #392121 50%, #0F0F0F 100%)',
    background: 'linear-gradient(to bottom, #7A2B2B 0%, #392121 50%, #0F0F0F 100%)',
  };

  return (
    <div className="w-full min-h-screen h-[calc(100%-53px)] pt-20 bg-yt-black pl-20 flex flex-row gap-6">
      {videoLiked.length > 0
        ? <>
          <div className="basis-[40%] ml-10 rounded-lg p-3 overflow-hidden" style={background}>
            <Link to={`/video/${finalVideo?.video_id}`}>
              <ReactPlayer url={finalVideo?.videoURL} controls
                width="450px" height="253px" />
            </Link>
            <p className="font-bold text-2xl text-yt-white my-4">Liked Videos</p>
            <p className=" text-yt-white mt-4">{user?.displayName}</p>
            <span className=" text-yt-gray my-2">
              {videoLiked?.length} videos
            </span>

          </div>
          <div className="flex-1 flex">

            <Scrollbars style={{ width: '100%', overflow: "hidden" }}>
              <div className="pt-3 ">
                {videoLiked?.map((video, i) => {
                  if (video?.video_id !== finalVideo?.video_id) {
                    return (
                      <Link key={i} to={`/video/${video.video_id}`}>
                        <RecommendVideo {...video} allChannels={allChannels} id={video?.video_id} />
                      </Link>
                    );
                  }
                })}
              </div>
            </Scrollbars>
          </div>
        </>
        : <span className='text-center text-2xl mt-16 text-yt-white'> You have not liked any video</span>}
    </div >
  );
};

export default Liked;
