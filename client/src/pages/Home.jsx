import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { CategoryItems } from "../static/data";
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
  setChannelsSub} from '../slices/channelSlice';


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

  const fetchData = async () => {
    try {
      const [allTagsResponse, tagsResponse, videosResponse, channelsResponse, subscribesResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/v1/tags'),
        axios.get('http://localhost:8000/api/v1/videos/list_tags'),
        axios.get('http://localhost:8000/api/v1/videos'),
        axios.get('http://localhost:8000/api/v1/channels'),
        axios.get(`http://localhost:8000/api/v1/subscribes/all/${user?.email}`),
      ]);

      const tagsWithAll = tagsResponse.data.tags;
      tagsWithAll.unshift({ tag: 'All' });
      setTags(tagsWithAll);
      const subscribedChannels = allChannels.filter(channel => {
        return subscribesResponse.data.subscribes.some(subscribe => subscribe.channel_id === channel.channel_id);
    });
    dispatch(setChannelsSub(subscribedChannels));
      dispatch(setAllTags(allTagsResponse.data.tags));
      dispatch(setVideos(videosResponse.data.videos))
      // setChannels(channelsResponse.data.channels);
      dispatch(setAllChannels(channelsResponse.data.channels))

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
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [newVideo]);


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
      <div className="w-full min-h-screen h-[calc(100%-53px)] pt-20 bg-yt-black pl-20 scrollbar-hide"  >
        <div className="flex flex-row px-3 overflow-x-scroll relative scrollbar-hide mb-3">
          {tags?.map((item, i) => (
            <span
              className={`font-medium text-sm py-2 px-4 mr-3 cursor-pointer rounded-lg w-fit
            ${isChoice == item.tag ? "text-yt-black bg-yt-white" : "text-yt-white bg-yt-light hover:bg-yt-light-1 "}`}
              key={i}
              onClick={() => setIsChoice(item.tag)}
            >
              {item.tag}
            </span>
          ))}
        </div>

        <div className="pt-2 px-5 grid grid-cols-yt gap-x-5 gap-y-8 my-5 ">
          {videosTag?.map((video, i) => (
            <div className="w-[360px]" key={i}>
              <VideoComp
                video_id={video.video_id}
                channel_id={video.channel_id}
                upload_date={video.upload_date}
                views={video.views}
                title={video.title}
                thumbnail={video.thumbnail}
                allChannels={allChannels}
                h="202px"
                w="360px"
                channelDisplay
              />
            </div>
          ))}
        </div>



      </div>
    </>
  );
};

export default Home;
