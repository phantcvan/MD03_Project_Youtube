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
import { getAllChannels} from '../slices/channelSlice';
import { useSelector } from "react-redux";
import { getUser} from "../slices/userSlice";


export const SideBar =()=> {
  const user = useSelector(getUser);
  const allChannels = useSelector(getAllChannels);
  let channel_id=""
  if (user && allChannels) {
    channel_id=allChannels?.find(channel => channel.email === user.email)?.channel_id;
  }
  let SideBarItems ={
    Top: [
      { icon: <AiFillHome size={21} />, name: "Home", path: '' },
      // { icon: <SiYoutubemusic size={21} />, name: "Shorts", path: ''  },
      { icon: <MdOutlineSubscriptions size={21} />, name: "Subscriptions", path: ''  },
    ],
    Middle: [
      // { icon: <MdVideoLibrary size={21} />, name: "Library", path: ''  },
      { icon: <VscHistory size={21} />, name: "History", path: '/history'  },
      { icon: <AiOutlinePlaySquare size={21} />, name: "Your videos", path: `/channel/${channel_id}` },
      // { icon: <AiOutlineClockCircle size={21} />, name: "Watch later" },
      { icon: <BiLike size={21} />, name: "Liked videos", path: ''  },
    ],
    Explore: [
      { icon: <HiOutlineFire size={21} />, name: "Trending", path: ''  },
      { icon: <IoMusicalNoteOutline size={21} />, name: "Music", path: ''  },
      { icon: <SiYoutubegaming size={21} />, name: "Gaming", path: ''  },
      { icon: <BsNewspaper size={21} />, name: "News", path: ''  },
      { icon: <CiTrophy size={23} />, name: "Sports", path: ''  },
    ],
  }
  if (!user) {
    SideBarItems ={
      Top: [
        { icon: <AiFillHome size={21} />, name: "Home", path: '' },
        // { icon: <MdOutlineSubscriptions size={21} />, name: "Subscriptions", path: ''  },
      ],
      Middle: [],
      Explore: [
        { icon: <HiOutlineFire size={21} />, name: "Trending", path: ''  },
        { icon: <IoMusicalNoteOutline size={21} />, name: "Music", path: ''  },
        { icon: <SiYoutubegaming size={21} />, name: "Gaming", path: ''  },
        { icon: <BsNewspaper size={21} />, name: "News", path: ''  },
        { icon: <CiTrophy size={23} />, name: "Sports", path: ''  },
      ],
    };
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
