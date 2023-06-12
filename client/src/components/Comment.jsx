import React, { memo } from "react";
import { BiLike, BiDislike } from "react-icons/bi";

const Comment = ({ email, cmt_date, logoUrl, content }) => {
  const dateConvert = new Date(cmt_date);
  const uploadTime = dateConvert.toLocaleDateString('en-GB');
  const channelName=email.split("@")[0];
  return (
    <div className="flex flex-row my-4 items-center">
      <img src={logoUrl} alt="profile" className="w-12 h-12 rounded-full mr-3" />
      <div>
        <div className="flex items-center my-2">
          <p className="text-sm font-medium pr-2">@{channelName}</p>
          <p className="text-xs text-yt-gray">
            {uploadTime}
          </p>
        </div>
        <p className="text-base pt-1">{content}</p>
        {/* <div className="flex py-3 justify-between w-36">
          <div className="flex">
            <BiLike size={24} className="cursor-pointer" />
            <p className="text-sm px-2 text-yt-gray">24</p>
          </div>
          <BiDislike size={23} className="cursor-pointer" />
          <p className="text-sm">Reply</p>
        </div> */}
      </div>
    </div>
  );
};

export default memo(Comment);
