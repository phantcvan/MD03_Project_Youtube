import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addDoc, collection, doc, onSnapshot, query } from "firebase/firestore";
import { auth, db, timestamp } from "../firebase";
// import { HiDotsHorizontal, HiDownload } from "react-icons/hi";
import { MdOutlineSort } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser, getShowMenu, setShowMenu, getShowLogIn, setShowLogIn } from "../slices/userSlice";
import { onAuthStateChanged } from "firebase/auth";
import Comment from "../components/Comment";
import { CategoryItems } from "../static/data";
import RecommendVideo from "../components/RecommendVideo";
import axios from "axios";
import ReactPlayer from 'react-player';
import { getAllTags, getVideos, getSearchQuery, incrementView } from '../slices/videoSlice';
import { setCurrentUser, getAllChannels, getCurrentUser } from '../slices/channelSlice';
import VideoInfo from "../components/VideoInfo";



const Video = ({ }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [allChannels, setAllChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("All");
  const [allTags, setAllTags] = useState([]);
  const [countLike, setCountLike] = useState(0);
  const [countDislike, setCountDislike] = useState(0);
  const [userAction, setUserAction] = useState(-1);
  const [open, setOpen] = useState(false);
  const [existCmt, setExistCmt] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [subscribes, setSubscribes] = useState([]);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const showMenu = useSelector(getShowMenu);
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const showLogIn=useSelector(getShowLogIn);
    const currentUser = useSelector(getCurrentUser);
  // const videos = useSelector(getVideos);
  const searchQuery = useSelector(getSearchQuery);
  // const allTags = useSelector(getAllTags);

  const fetchData = async () => {
    try {
      const [allTagsResponse, tagsResponse, videosResponse, channelsResponse, commentsResponse,
      ] = await Promise.all([
        axios.get('http://localhost:8000/api/v1/tags'),
        axios.get('http://localhost:8000/api/v1/videos/list_tags'),
        axios.get('http://localhost:8000/api/v1/videos'),
        axios.get('http://localhost:8000/api/v1/channels'),
        axios.get(`http://localhost:8000/api/v1/comments/${id}`),
      ]);

      const tagsWithAll = tagsResponse.data.tags;
      tagsWithAll.unshift({ tag: 'All' });
      setTags(tagsWithAll);
      setAllTags(allTagsResponse.data.tags);
      setVideos(videosResponse.data.videos);
      setAllChannels(channelsResponse.data.channels);
      setComments(commentsResponse.data.findCmt);
      dispatch(setShowMenu(false));
      dispatch(setShowLogIn(false));

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // Sau 1s thì đóng snackbar
  useEffect(() => {
    const timeout = setTimeout(() => {
      setOpen(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [open])

  const videoTag = allTags?.find(tag => tag.video_id == id)?.tag;
  const videoTags = allTags?.filter(tag => tag.video_id == id);
  const tagFound = videoTags.some((video) => video.tag === "kid");

  // console.log("tag", videoTags);
  const videoSuggest = videos.filter(video => {
    return allTags.some(tag => tag.video_id === video.video_id && tag.tag === videoTag);
  });

  const videoRemain = videos.filter(video => {
    return !allTags.some(tag => tag.video_id === video.video_id && tag.tag === videoTag);
  });

  let combinedVideos = videoSuggest.concat(videoRemain);

  const videosBelongTag = videos.filter(video => {
    return allTags.some(tag => tag.video_id === video.video_id && tag.tag === currentTag);
  });
  if (currentTag !== "All") {
    combinedVideos = videosBelongTag;
  }

  const updateView = async (view) => {
    try {
      const updatedViews = view + 1;
      const response = await axios.put(`http://localhost:8000/api/v1/videos/views/${id}`, { views: updatedViews });
      setData(prevData => ({
        ...prevData,
        views: updatedViews
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // Khi click thì tăng view
  const handleVideoClick = () => {
    dispatch(incrementView(id));
  };

  // console.log("all", allChannels);
  const fetchDataChangeId = async () => {
    try {
      const [videoResponse, commentsResponse, actionsResponse, subscribesResponse] = await Promise.all([
        axios.get(`http://localhost:8000/api/v1/videos/${id}`),
        axios.get(`http://localhost:8000/api/v1/comments/${id}`),
        axios.get(`http://localhost:8000/api/v1/actions/${id}`),
        axios.get(`http://localhost:8000/api/v1/subscribes`),
      ]);
      setData(videoResponse.data.findVideo[0]);
      setComments(commentsResponse.data.findCmt);
      updateView(videoResponse.data.findVideo[0].views);
      setSubscribes(subscribesResponse.data.subscribes);
      setIsSubscribe(subscribesResponse.data.subscribes.some(item => item.channel_id === videoResponse.data.findVideo[0].channel_id &&
        item.email === user.email))
      setCountLike(actionsResponse.data.actions.filter(action => action.action === 1).length);
      setCountDislike(actionsResponse.data.actions.filter(action => action.action === 0).length);
      setUserAction(actionsResponse.data.actions.find(action => action.email === user.email).action)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataChangeId();
  }, [id]);
  // console.log(isSubscribe);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
        handleAddChannel(user);
      } else {
        dispatch(setUser(null));
      }
    });
  }, [user])

  function generateRandomChannelId() {
    const randomId = Math.floor(Math.random() * 10000000).toString().padStart(7, "0");
    return randomId;
  }
  const handleAddChannel = async (user) => {
    try {
      const findChannelIndex = allChannels?.findIndex((e, i) => e.email === user.email);
      if (findChannelIndex === -1) {
        const newChannel_id = generateRandomChannelId();
        while (allChannels?.some(channel => channel.channel_id === newChannel_id)) {
          newChannel_id = generateRandomChannelId();
        }
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        const newChannel = {
          channel_id: newChannel_id,
          email: user.email,
          logoUrl: user.photoURL,
          channel_name: user.displayName,
          joinDate: formattedDate,
          thumbnailM: null,
        };

        const response = await axios.post('http://localhost:8000/api/v1/channels', newChannel);
        // setChannelNow(newChannel);
        dispatch(setCurrentUser(newChannel));
      } else {
        // setChannelNow(channels[findChannelIndex]);
        dispatch(setCurrentUser(allChannels[findChannelIndex]));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Tăng - giảm like khi click
  const handleLikeClick = async () => {
    try {
      if (userAction === -1) {
        const newAction = {
          email: user.email,
          video_id: id,
          action: 1,
        }
        await axios.post(`http://localhost:8000/api/v1/actions`, newAction)
        setCountLike(countLike + 1);
        setUserAction(1);
      } else if (userAction === 1) {
        await axios.delete(`http://localhost:8000/api/v1/actions/${id}`, { data: { email: user.email } })
        setCountLike(countLike - 1);
        setUserAction(-1);
      } else {
        await axios.put(`http://localhost:8000/api/v1/actions/${id}`, { email: user.email, action: 1 })
        setCountLike(countLike + 1);
        setCountDislike(countDislike - 1);
        setUserAction(1);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // Tăng - giảm dislike khi click
  const handleDislikeClick = async () => {
    try {
      if (userAction === -1) {
        const newAction = {
          email: user.email,
          video_id: id,
          action: 0,
        }
        await axios.post(`http://localhost:8000/api/v1/actions`, newAction)
        setCountDislike(countDislike + 1);
        setUserAction(0);
      } else if (userAction === 0) {
        await axios.delete(`http://localhost:8000/api/v1/actions/${id}`, { data: { email: user.email } })
        setCountDislike(countDislike - 1);
        setUserAction(-1);
      } else {
        await axios.put(`http://localhost:8000/api/v1/actions/${id}`, { email: user.email, action: 0 })
        setCountLike(countLike - 1);
        setCountDislike(countDislike + 1);
        setUserAction(0);

      }
    } catch (error) {
      console.error(error);
    }
  };
  // console.log("countLike", countLike, "countDislike", countDislike, "userAction", userAction);

  const channelNow = allChannels?.filter((channel) => channel.channel_id == data?.channel_id);
  const videoUrl = data?.videoURL;
  const channel_id = data?.channel_id;
  // console.log(channelNow);
  const channelLogo = channelNow[0]?.logoUrl;
  const channelName = channelNow[0]?.channel_name;
  const channelEmail = channelNow[0]?.email;
  // console.log("user email",user?.email);
  // if (channelEmail === user?.email) {
  //   setCheckEmail(true);
  // }
  const dateConvert = new Date(data?.upload_date);
  const uploadTime = dateConvert.toLocaleDateString('en-GB');


  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  // Add comment
  const handleInputChange = (e) => {
    const { value } = e.target;
    setComment(value);
    setExistCmt(value.trim().length > 0);
  };

  const addComment = async (e) => {
    e.preventDefault();
    const currentDate = getCurrentDate();
    if (!comment) {
      setExistCmt(false);
    } else {
      const newComment = {
        email: user.email,
        video_id: id,
        content: comment,
        cmt_date: currentDate
      }

      await axios.post('http://localhost:8000/api/v1/comments', newComment)
        .then(res => {
          if (res.data.status === 200) {
            console.log('Thêm comment thành công');
            setComment("");
            fetchData();
          }
        })
        .catch(error => console.log(error))
    }
  }

  const handleAddSubscribe = async () => {
    const currentDate = getCurrentDate();

    let request;
    let successMessage;

    if (!isSubscribe) {
      request = axios.post('http://localhost:8000/api/v1/subscribes', {
        email: user?.email,
        channel_id: channel_id,
        dateSubs: currentDate
      });
      successMessage = 'Thêm subscribe thành công';
    } else {
      console.log(channel_id);
      request = axios.delete(`http://localhost:8000/api/v1/subscribes/${channel_id}`, {
        data: { email: user?.email }
      });
      successMessage = 'Delete subscribe thành công';
    }

    try {
      const response = await request;
      if (response.data.status === 200) {
        console.log(successMessage);
        fetchDataChangeId();
      }
    } catch (error) {
      // Xử lý lỗi một cách phù hợp
      console.error(error);
    }
  };


  return (
    <div className="py-12 px-9 bg-yt-black relative flex flex-row min-h-screen h-[calc(100%-53px)] w-[100%] mt-10 gap-8">
      <div className="flex-1 w-[640px]"  >
        <div className="flex justify-center items-center flex-1">
          <ReactPlayer url={videoUrl} controls playing={true}
            width="640px" height="360px" />
        </div>
        <h2 className="text-yt-white font-semibold mt-5 mb-3 text-lg">
          {data?.title}
        </h2>

        <div className="flex w-[100%]">
          <VideoInfo
            id={id} channel_id={channel_id} channelLogo={channelLogo} channelName={channelName}
            setOpen={setOpen} countLike={countLike} countDislike={countDislike} userAction={userAction}
            onLikeClick={handleLikeClick} onDislikeClick={handleDislikeClick}
            channelEmail={channelEmail} userEmail={user?.email} isSubscribe={isSubscribe}
            handleAddSubscribe={handleAddSubscribe}
          />
        </div>
        <div className="bg-yt-light-black mt-4 rounded-2xl text-sm p-3 text-yt-white">
          <div className="flex">
            <p className="font-medium pr-3 my-2">
              {data?.views.toLocaleString()}
              <span className="pl-1 text-xs">Views</span>
            </p>
            <p className="font-medium pr-3 my-2">{uploadTime}</p>
          </div>
          <span className="text-center font-medium">{data?.description}</span>
        </div>
        <div className="text-yt-white mt-5">
          {tagFound
            ? <div className="text-center mt-2">
              <span>Comments are turned off. </span>
              <span className="text-[#1967D2]">Learn more</span>
            </div>
            :
            <>
              <div className="flex items-center">
                <h1>{comments.length} Comments</h1>
              </div>

              {user && (
                <form onSubmit={addComment} className="flex w-full pt-4 items-start">
                  <img
                    src={user?.photoURL}
                    alt="profile"
                    className="rounded-full mr-3 h-12 w-12"
                  />
                  <input
                    value={comment}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Add a comment..."
                    className="bg-[transparent] border-b border-b-yt-light-black outline-none text-sm p-1 w-full"
                  />
                  <button className={`ml-1 p-2 rounded-r-full rounded-l-full
                  ${existCmt ? "text-yt-black bg-[#3EA6FF] hover:bg-[#65B8FF] cursor-pointer" : "text-yt-gray bg-yt-light-2"}`}
                    disabled={!existCmt}
                  >
                    Comment
                  </button>
                </form>
              )}
              <div className="mt-4 mb-6">
                {comments.map((item, i) => (
                  <Comment key={i} {...item} />
                ))}
              </div>
            </>}
        </div>
      </div>
      <div className="right basis-[40%] px-3 overflow-y-hidden">
        <div>
          <div className="flex flex-row px-2 overflow-x-scroll scrollbar-hide">
            {tags.map((item, i) => (
              <h2
                className={`text-yt-white font-normal text-sm py-1 px-4 bg-yt-light mr-3 cursor-pointer rounded-lg 
                ${currentTag === item.tag ? "bg-yt-gray" : "hover:bg-yt-light-1"}`}
                key={i}
                onClick={() => setCurrentTag(item.tag)}
              >
                {item.tag}
              </h2>
            ))}
          </div>
        </div>
        <div className="pt-3">
          {combinedVideos.map((video, i) => {
            if (video.video_id != id) {
              return (
                <Link key={i} to={`/video/${video.video_id}`} onClick={handleVideoClick}>
                  <RecommendVideo {...video} allChannels={allChannels} id={id} />
                </Link>
              );
            }
          })}
        </div>
      </div>
      {open
        && <div className='w-[100%] h-[100%] bg-overlay-40 flex items-center 
                justify-center z-30 absolute top-0 bottom-0 left-0 right-0' >
          <div
            className='w-fit h-[60px] bg-[#F1F1F1] text-yt-light-2 p-5 fixed bottom-3 rounded-md'
          >
            <span>Link copied to clipboard</span>
          </div>
        </div>
      }
    </div>
  );
};

export default Video;
