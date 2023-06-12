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
import { getVideos, getSearchQuery, getAllTags } from '../slices/videoSlice';
import { setCurrentUser, getAllChannels, getCurrentUser } from '../slices/channelSlice';


const Search = ({ }) => {
  // const [videosTag, setVideosTag] = useState([]);
  const [videosSearch, setVideosSearch] = useState([]);
  // const [allTags, setAllTags] = useState([]);
  const [message, setMessage] = useState("");
  // const [allChannels, setAllChannels] = useState([]);
  const [userNow, setUserNow] = useState([]);
  const [isChoice, setIsChoice] = useState('All');
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const allTags = useSelector(getAllTags);
  const allVideos = useSelector(getVideos);
  const searchQuery = useSelector(getSearchQuery);
  const allChannels = useSelector(getAllChannels);
  const currentUser= useSelector(getCurrentUser);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
        handleAddChannel(allChannels, user);
      } else {
        dispatch(setUser(null));
      }
    })
  }, [user]);

  const handleAddChannel = async (channels, user) => {
    try {
      const findChannelIndex = channels.findIndex((e, i) => e.email == user.email);
      if (findChannelIndex !== -1) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const newChannel = {
          email: user?.email,
          logoUrl: user?.photoURL,
          channel_name: user?.displayName,
          joinDate: formattedDate,
          thumbnailM: null,
        };

        await axios.post('http://localhost:8000/api/v1/channels', newChannel);
        setUserNow(newChannel);
        dispatch(setCurrentUser(newChannel))

      } else {
        setUserNow(channels[findChannelIndex]);
        dispatch(setCurrentUser(channels[findChannelIndex]))
      }
    } catch (error) {
      console.error(error);
    }
  };

  function checkMatchingTag(videoId, searchQuery) {
    const matchingTags = allTags.filter((tag) =>
      tag.video_id === videoId &&
      tag.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchingTags.length > 0;
  }

  useEffect(() => {
    setMessage("");
    const result = allVideos.filter((video) => {
      const hasMatchingTitle = video.title.toLowerCase().includes(searchQuery.toLowerCase());
      const hasMatchingTag = checkMatchingTag(video.video_id, searchQuery);
      return hasMatchingTitle || hasMatchingTag;
    })
      .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));
    setVideosSearch(result);
    // setVideosTag([]);
    if (result.length === 0) setMessage(`There are no videos that include "${searchQuery}"`)
  }, [searchQuery])


  return (
    <>
      <div className="w-full min-h-screen h-[calc(100%-53px)] pt-20 bg-yt-black pl-20">
        {/* nếu tìm kiếm mà ko có kết quả phù hợp */}
        {message
          ? <span className="text-yt-white font-medium text-lg mt-6 pt-4 ">{message}</span>
          : <>
            {videosSearch.length !== 0 && (
              <div className="pt-4 px-5 grid grid-cols-yt gap-x-5 gap-y-8">
                {videosSearch?.map((video, i) => (
                  <VideoComp
                    video_id={video.video_id}
                    {...video}
                    key={video.video_id}
                    allChannels={allChannels}
                    h="202px"
                    w="360px"
                  />
                ))}
              </div>
            )}

          </>}

      </div>
    </>
  );
};

export default Search;
