import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ videoUrl }) => {
    return (
        <div>
            <ReactPlayer url={videoUrl} controls />
        </div>
    )
}

export default VideoPlayer