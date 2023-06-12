import React, { useEffect, useState } from 'react';
import { getUser, setUser } from "../slices/userSlice";
import { useDispatch, useSelector } from 'react-redux';
import { getAllChannels, setChannelsSub, getChannelsSub } from '../slices/channelSlice';
import axios from 'axios';
import SubsItem from '../components/SubsItem';
import { setVideos, getVideos, } from '../slices/videoSlice';



const Subscription = ({ }) => {
    const dispatch = useDispatch()
    const user = useSelector(getUser);
    const channelsSub = useSelector(getChannelsSub);
    const allChannels = useSelector(getAllChannels);
    const [subscribes, setSubscribes] = useState([]);
    const allVideos = useSelector(getVideos);

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
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    console.log(subscribes);
    return (
        <div className="w-full min-h-screen h-[calc(100%-53px)] pt-20 bg-yt-black px-20 scrollbar-hide text-yt-white"  >
            {subscribes.map(subscribe => {
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
            })}
        </div>
    )
}

export default Subscription