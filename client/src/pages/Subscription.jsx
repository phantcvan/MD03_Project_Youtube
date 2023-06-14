import React, { useEffect, useState } from 'react';
import { getUser, setUser} from "../slices/userSlice";
import { getShowMenu, setShowMenu } from "../slices/appSlice";
import { useDispatch, useSelector } from 'react-redux';
import { getAllChannels, setChannelsSub, getChannelsSub } from '../slices/channelSlice';
import axios from 'axios';
import SubsItem from '../components/SubsItem';
import { setVideos, getVideos, } from '../slices/videoSlice';
import { IoLogoBuffer } from "react-icons/io";



const Subscription = ({ }) => {
    const dispatch = useDispatch()
    const user = useSelector(getUser);
    const channelsSub = useSelector(getChannelsSub);
    const allChannels = useSelector(getAllChannels);
    const [subscribes, setSubscribes] = useState([]);
    const allVideos = useSelector(getVideos);
    const showMenu = useSelector(getShowMenu);

    const fetchData = async () => {
        try {
            const [subscribesResponse, videosResponse] = await Promise.all([
                axios.get(`http://localhost:8000/api/v1/subscribes/all/${user?.email}`),
                axios.get('http://localhost:8000/api/v1/videos'),

            ]);
            setSubscribes(subscribesResponse.data.subscribes);
            const subscribedChannels = allChannels.filter(channel => {
                return subscribesResponse.data.subscribes.some(subscribe => subscribe.channel_id === channel.channel_id);
            });
            dispatch(setChannelsSub(subscribedChannels));
            dispatch(setVideos(videosResponse.data.videos));
            dispatch(setShowMenu(false));
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, []);
    console.log(subscribes);
    return (
        <div className="w-full min-h-screen h-[calc(100%-53px)] pt-20 bg-yt-black px-20 scrollbar-hide text-yt-white"  >

            {!user
                ? <div className='flex flex-col justify-between items-center m-auto gap-4 mt-5'>
                    <span className=''> <IoLogoBuffer size={100} /></span>
                    <span className='text-2xl'>Don’t miss new videos</span>
                    <span>Sign in to see updates from your favorite YouTube channels</span>
                </div>
                : subscribes.length > 0
                    ? subscribes.map(subscribe => {
                        const channelInfo = allChannels.find(channel => channel.channel_id === subscribe.channel_id);
                        const channelVideo = allVideos.filter(video => video.channel_id === subscribe.channel_id)
                            .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date));;
                        console.log("channelVideos", channelVideo);
                        return (
                            <SubsItem
                                key={subscribe.id}
                                channelInfo={channelInfo}
                                channelVideo={channelVideo}
                                dateSubs={subscribe.dateSubs}
                            />
                        );
                    })
                    : <div className='m-auto flex flex-col'>
                        <span className='text-center text-2xl mt-16'>
                            You have not subscribed to any channel.
                        </span>
                    </div>
            }

        </div>
    )
}

export default Subscription