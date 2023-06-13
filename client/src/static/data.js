import { AiFillHome, AiOutlinePlaySquare, AiOutlineClockCircle } from "react-icons/ai";
import { MdOutlineSubscriptions } from "react-icons/md";
import { SiYoutubemusic, SiYoutubegaming } from "react-icons/si";
import { MdVideoLibrary } from "react-icons/md";
import { VscHistory } from "react-icons/vsc";
import { BiLike } from "react-icons/bi";
import { BsNewspaper } from "react-icons/bs";
import { HiOutlineFire } from "react-icons/hi";
import { IoMusicalNoteOutline } from "react-icons/io5";
import { CiTrophy } from "react-icons/ci";
import { getAllChannels, setAllChannels, getChannelsSub, setChannelsSub } from '../slices/channelSlice';
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../slices/userSlice";
import axios from "axios";
import { useEffect } from "react";


export const SideBar = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  console.log("user", user);
  const allChannels = useSelector(getAllChannels);
  const channelsSub = useSelector(getChannelsSub);

  let channel_id = "";
  if (user && allChannels) {
    channel_id = allChannels?.find(channel => channel.email === user.email)?.channel_id;
  }
  const fetchData = async () => {
    try {
      const [channelsResponse, subscribesResponse] = await Promise.all([
        axios.get('http://localhost:8000/api/v1/channels'),
        axios.get(`http://localhost:8000/api/v1/subscribes/all/${user?.email}`),

      ]);
      dispatch(setAllChannels(channelsResponse.data.channels));
      const subscribedChannels = channelsResponse.data.channels.filter(channel => {
        return subscribesResponse.data.subscribes.some(subscribe => subscribe.channel_id === channel.channel_id);
      });
      dispatch(setChannelsSub(subscribedChannels));

    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, []);

  let SideBarItems = {
    Top: [
      { icon: <AiFillHome size={21} />, name: "Home", path: '' },
    ],
    Middle: [],
    Explore: [
      { icon: <HiOutlineFire size={21} />, name: "Trending", path: '' },
      { icon: <IoMusicalNoteOutline size={21} />, name: "Music", path: '' },
      { icon: <SiYoutubegaming size={21} />, name: "Gaming", path: '' },
      { icon: <BsNewspaper size={21} />, name: "News", path: '' },
      { icon: <CiTrophy size={23} />, name: "Sports", path: '' },
    ],
  };

  if (user !== null) {
    SideBarItems = {
      Top: [
        { icon: <AiFillHome size={21} />, name: "Home", path: '' },
        { icon: <MdOutlineSubscriptions size={21} />, name: "Subscriptions", path: '/subscription' },
      ],
      Middle: [
        // { icon: <MdVideoLibrary size={21} />, name: "Library", path: ''  },
        // { icon: <VscHistory size={21} />, name: "History", path: '/history'  },
        { icon: <AiOutlinePlaySquare size={21} />, name: "Your videos", path: `/channel/${channel_id}` },
        { icon: <BiLike size={21} />, name: "Liked videos", path: '/likedVideos' },
      ],
      Explore: [
        { icon: <HiOutlineFire size={21} />, name: "Trending", path: '' },
        { icon: <IoMusicalNoteOutline size={21} />, name: "Music", path: '' },
        { icon: <SiYoutubegaming size={21} />, name: "Gaming", path: '' },
        { icon: <BsNewspaper size={21} />, name: "News", path: '' },
        { icon: <CiTrophy size={23} />, name: "Sports", path: '' },
      ],
      Subscriptions: channelsSub.map(channel => ({
        logoUrl: channel.logoUrl,
        name: channel.channel_name.length <= 15 ? channel.channel_name : `${channel.channel_name.substr(0, 15)}...`,
        path: `/channel/${channel.channel_id}`,
      })),
    }
  }
  return {
    SideBarItems,
  };
};


export const CategoryItems = [
  "About",
  "Press",
  "Copyright",
  "Contact us",
  "Creators",
  "Advertise",
  "Developers",
  "Terms",
  "Privacy",
  "Policy & Safefy",
  "How YouTube works",
  "Test new features",
];
