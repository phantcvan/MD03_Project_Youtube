import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import { getVideos } from '../slices/videoSlice';
import { getAllChannels, setAllChannels, getCurrentUser, setCurrentUser } from '../slices/channelSlice';
import { getUser, setUser } from "../slices/userSlice";
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, timestamp } from "../firebase";
// import UploadVideo from '../components/UploadVideo';
import VideoComp from '../components/VideoComp';
import ReactPlayer from 'react-player';
import { handleNumber } from "../static/fn";
import axios from 'axios';
import UploadVideo from '../components/UploadVideo';
import { getNewVideo } from '../slices/videoSlice';



const Channel = ({ }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [isChoice, setIsChoice] = useState(1);
    const [open, setOpen] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const newVideo = useSelector(getNewVideo);
    // channel có channel_id=id
    const [channelNow, setChannelNow] = useState([]);
    const [videosBelongToChannel, setVideosBelongToChannel] = useState([]);
    const allChannels = useSelector(getAllChannels);
    const user = useSelector(getUser);
    // channel của user đang đăng nhập
    const currentUser = useSelector(getCurrentUser);
    const [videoCount, setVideoCount] = useState(0);
    const [videoHome, setVideoHome] = useState(null);
    const [uploadTime, setUploadTime] = useState(null);
    const [edited, setEdited] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [videosResponse, channelResponse, allChannelResponse] = await Promise.all([
                    axios.get(`http://localhost:8000/api/v1/videos/channel/${id}`),
                    axios.get(`http://localhost:8000/api/v1/channels/${id}`),
                    axios.get(`http://localhost:8000/api/v1/channels`),
                ]);
                setVideosBelongToChannel(videosResponse.data.videoBelongChannel);
                setChannelNow(channelResponse.data.findChannel);
                setVideoCount(videosResponse.data.videoBelongChannel.length);
                setVideoHome(videosResponse.data.videoBelongChannel.sort((a, b) => b.views - a.views)[0]);
                setUploadTime(new Date(videoHome.upload_date).toLocaleDateString('en-GB'));
                dispatch(setAllChannels(allChannelResponse.data.channels));
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        dispatch(setUser(user));
                        handleAddChannel(allChannelResponse.data.channels, user);
                    } else {
                        dispatch(setUser(null));
                    }

                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id, edited, newVideo]);

    useEffect(() => {
        if (user?.email === channelNow[0]?.email) {
            setCanEdit(true)
        }
    }, [channelNow])
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
    console.log('channelNow', channelNow[0]);

    const subscriber = 1;
    console.log("videosBelongToChannel", videosBelongToChannel);
    console.log(canEdit);

    return (
        <div className="pt-20 px-9 bg-yt-black min-h-screen h-[calc(100%-53px)] w-full text-yt-white">
            <div className='flex justify-between ml-32 mr-10 items-center'>
                <div className='flex items-center gap-8 flex-1'>
                    <div className='h-[128px] w-[128px] object-cover'>
                        <img src={channelNow[0]?.logoUrl} className='h-[128px] w-[128px] rounded-full' />
                    </div>
                    <div className='flex flex-col'>
                        <span className='font-medium text-xl my-1'>{channelNow[0]?.channel_name}</span>
                        <div className='flex gap-2'>
                            <span className='font-normal text-lg my-1'>@{channelNow[0]?.email.split("@")[0]}</span>
                            <span className='font-normal text-lg my-1'>{`${subscriber} ${subscriber > 1 ? 'subscribers' : 'subscriber'}`}</span>
                            <span className='font-normal text-lg my-1'>{`${videoCount} ${videoCount > 1 ? 'videos' : 'video'}`}</span>
                        </div>
                    </div>
                </div>
                <div className='flex basis-1/3 justify-end '>
                    {currentUser?.email !== channelNow[0]?.email
                        ? <button className='rounded-l-full rounded-r-full bg-yt-white text-yt-black px-3 py-2'>
                            Subscribe
                        </button>
                        : (videoCount > 0
                            ? <div className='flex gap-4 items-center'>
                                <button
                                    className='rounded-l-full rounded-r-full bg-yt-light-2 px-3 py-2'
                                    onClick={() => setOpen(true)}
                                >
                                    Upload video
                                </button>
                                <button
                                    className='rounded-l-full rounded-r-full bg-yt-light-2 px-3 py-2'
                                    onClick={() => setIsChoice(2)}
                                >
                                    Manager video
                                </button>
                            </div>
                            : <button
                                className='rounded-l-full rounded-r-full bg-yt-light-2 px-3 py-2 relative'
                                onClick={() => setOpen(true)}
                            >
                                Upload video
                            </button>

                        )}
                </div>
            </div>
            <div className='ml-32 mr-10 my-4 border-b-[1px] rounded-sm border-yt-gray'>
                <div className={`rounded-sm bg-yt-light inline-block cursor-pointer pt-1
                ${isChoice == 1 ? "bg-yt-light-2 border-yt-gray border-b-[3px]" : "pb-[3px]"}  `}
                    onClick={() => setIsChoice(1)}>
                    <span className='inline-block px-10'>HOME</span>
                </div>
                <div className={`rounded-sm bg-yt-light inline-block cursor-pointer pt-1
                ${isChoice == 2 ? "bg-yt-light-2 border-yt-gray border-b-[3px]" : "pb-[3px]"}  `}
                    onClick={() => setIsChoice(2)}>
                    <span className='inline-block px-10'>VIDEOS</span>
                </div>
            </div>

            {videoCount > 0
                ? isChoice == 2
                    ? <div className="ml-32 mr-10 pt-2 px-5 grid grid-cols-ch gap-x-5 gap-y-8 mt-6">
                        {videosBelongToChannel?.map((video, i) => (
                            <div className="flex max-w-[200px] h-[200px]">
                                <VideoComp
                                    video_id={video.video_id}
                                    {...video}
                                    key={video.video_id}
                                    allChannels={allChannels}
                                    h="120px"
                                    w="200px"
                                    canEdit={canEdit}
                                    setEdited={setEdited}
                                    setOpen={setOpen}
                                    user={user}
                                />
                            </div>
                        ))}
                    </div>
                    : <div className="ml-32 mr-10 pt-2 flex flex-col gap-x-5 gap-y-2 mt-6">
                        <div className='flex justify-between gap-5 w-full'>
                            <div className="flex justify-center items-center w-[500px] h-[280px]">
                                <ReactPlayer url={videoHome?.videoURL} controls playing={true}
                                    width="500px" height="280px"
                                />
                            </div>
                            <div className='flex flex-1 flex-col'>
                                <span className='my-1 font-medium text-justify'>{videoHome?.title}</span>
                                <span className='my-1'>{handleNumber(videoHome?.views)} views • {uploadTime}</span>
                                <span className='my-1 font-medium text-justify'>{videoHome?.description}</span>
                            </div>

                        </div>
                        <span className='font-medium mt-6 pt-2 border-yt-gray border-t-[1px]'>Videos</span>
                        <div className="grid grid-cols-ch gap-x-5 gap-y-8 mt-2 mb-4">
                            {videosBelongToChannel?.map((video, i) => (
                                <div className="flex max-w-[200px]">
                                    <VideoComp
                                        video_id={video.video_id}
                                        {...video}
                                        key={video.video_id}
                                        allChannels={allChannels}
                                        h="120px"
                                        max_w="200px"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                : <span className='mx-32'>This channel has not uploaded any videos yet. </span>
            }
            <div className='absolute top-[50%] left-[50%]'>
                {open && <UploadVideo setOpen={setOpen} user={user} />}
            </div>
        </div>

    )
}

export default Channel