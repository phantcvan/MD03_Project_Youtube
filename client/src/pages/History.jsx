import React, { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";



const History = () => {


  return (
    <div className="py-12 px-9 bg-yt-black flex flex-row h-full w-full mt-10 gap-8">
      <div className="flex-1 ml-10">
        <p className="font-medium text-yt-white">Watch history</p>
        <div className="pt-3">
          {/* {videos.map((video, i) => {
            if (video.video_id != id) {
              return (
                <Link key={i} to={`/video/${video.video_id}`} onClick={handleVideoClick}>
                  <RecommendVideo {...video} />
                </Link>
              );
            }
          })} */}
        </div>
      </div>
      <div className="right basis-[40%] px-3 overflow-y-hidden">
        <span className="font-medium text-yt-white flex items-center gap-2">
          <BsTrash size={20} /> Clear all watch history
        </span>
      </div>

    </div>
  );
};

export default History;
