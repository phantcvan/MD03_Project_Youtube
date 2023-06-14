import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { CategoryItems } from "../static/data";
import { getShowMenu, setShowMenu, getShowLogIn, setShowLogIn, getCurrentWidth } from "../slices/appSlice";
import { getUser, setUser } from "../slices/userSlice";
import { collection, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom";
import VideoComp from "../components/VideoComp";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setVideos, getVideos, setAllTags, getAllTags, getNewVideo } from '../slices/videoSlice';
import {
  setAllChannels, getAllChannels, setCurrentUser, getCurrentUser, getChannelsSub,
  setChannelsSub
} from '../slices/channelSlice';
import { Scrollbars } from 'react-custom-scrollbars-2';


const Home = ({ }) => {
  const [videosTag, setVideosTag] = useState([]);
  const [tags, setTags] = useState([]);
  const [message, setMessage] = useState("");
  const [isChoice, setIsChoice] = useState('All');
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const allVideos = useSelector(getVideos);
  const newVideo = useSelector(getNewVideo);
  const allTags = useSelector(getAllTags);
  const allChannels = useSelector(getAllChannels);
  const currentUser = useSelector(getCurrentUser);
  const channelsSub = useSelector(getChannelsSub);
  const showMenu = useSelector(getShowMenu);
  const showLogIn = useSelector(getShowLogIn);
  const curWid = useSelector(getCurrentWidth);

  console.log(curWid);

  // Khi không có user
  const fetchData = async () => {
    try {
      const [allTagsResponse, tagsResponse, videosResponse, channelsResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/v1/tags'),
        axios.get('http://localhost:8000/api/v1/videos/list_tags'),
        axios.get('http://localhost:8000/api/v1/videos'),
        axios.get('http://localhost:8000/api/v1/channels'),
      ]);

      const tagsWithAll = tagsResponse.data.tags;
      tagsWithAll.unshift({ tag: 'All' });
      setTags(tagsWithAll);
      dispatch(setAllTags(allTagsResponse.data.tags));
      dispatch(setVideos(videosResponse.data.videos));
      dispatch(setAllChannels(channelsResponse.data.channels));
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
  // khi có user
  const fetchDataSubs = async () => {
    try {
      const [subscribesResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/v1/subscribes/all/${user?.email}`),
      ]);
      const subscribedChannels = allChannels.filter(channel => {
        return subscribesResponse.data.subscribes.some(subscribe => subscribe.channel_id === channel.channel_id);
      });
      dispatch(setChannelsSub(subscribedChannels));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    if (user != null) {
      fetchDataSubs();
    }
  }, []);
  useEffect(() => {
    fetchData();
    if (user != null) {
      fetchDataSubs();
    }
  }, [newVideo, user]);


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

        dispatch(setCurrentUser(newChannel))
        await axios.post('http://localhost:8000/api/v1/channels', newChannel);

      } else {
        dispatch(setCurrentUser(channels[findChannelIndex]))
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log("curUser",currentUser);
  // lọc video theo tag
  const loadVideoBelongTag = (videos, tags, isChoice) => {
    const result = videos.filter((video) => {
      const hasMatchingTag = tags.some((tag) =>
        tag.video_id === video.video_id && tag.tag.toLowerCase() === isChoice.toLowerCase()
      );
      return hasMatchingTag;
    });

    return result;
  }

  useEffect(() => {
    if (isChoice === 'All') {
      setVideosTag(allVideos);
    } else {
      setVideosTag(loadVideoBelongTag(allVideos, allTags, isChoice));
    }
  }, [isChoice, allVideos]);

  return (
    <>
      <div className={`w-full min-h-screen h-[calc(100%-53px)] bg-yt-black 
      ${curWid <= 480 ? "pt-16 pl-6" : curWid <= 1024 ? "pt-16 pl-12" : "pt-20 pl-20"}`}  >
        <div className="flex flex-row px-3 overflow-x-scroll relative scrollbar-hide mb-3">
          {tags?.map((item, i) => (
            <span
              className={`font-medium ${curWid <= 480 ? "text-xs py-1" : "text-sm py-2"} px-4 mr-3 cursor-pointer rounded-lg w-fit
            ${isChoice == item.tag ? "text-yt-black bg-yt-white" : "text-yt-white bg-yt-light hover:bg-yt-light-1 "}`}
              key={i}
              onClick={() => setIsChoice(item.tag)}
            >
              {item.tag}
            </span>
          ))}
        </div>
        {/* <Scrollbars style={{ width: '100%', overflow: "hidden" }}> */}
        <div className={`flex flex-wrap pt-2 
          ${curWid <= 480 ? "gap-x-3 gap-y-3 my-3 px-3" : curWid <= 1024
            ? "gap-x-4 gap-y-4 my-4 px-4" : "gap-x-5 gap-y-5 my-5 px-5"}`}>
          {videosTag?.map((video, i) => (
            <div className={`${curWid <= 480 ? "w-[150px]" : curWid <= 1024 ? "w-[230px]" : "w-[360px]"}`} key={i}>
              <VideoComp
                video_id={video.video_id}
                channel_id={video.channel_id}
                upload_date={video.upload_date}
                views={video.views}
                videoURL={video.videoURL}
                title={video.title}
                thumbnail={video.thumbnail}
                allChannels={allChannels}
                h={`${curWid <= 480 ? "84px" : curWid <= 1024 ? "129px" : "202px"}`}
                w={`${curWid <= 480 ? "150px" : curWid <= 1024 ? "230px" : "360px"}`}
                channelDisplay
              />
            </div>
          ))}
        </div>
        {/* </Scrollbars> */}


      </div>
    </>
  );
};

export default Home;
