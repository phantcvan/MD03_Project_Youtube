// videoSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videos: [],
  newVideo: "", //video_id
  tags: [],
  searchQuery: '',
  searchMessage: '',
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
    },
    setNewVideo: (state, action) => {
      state.newVideo = action.payload;
    },
    setAllTags: (state, action) => {
      state.tags = action.payload;
    },
    incrementView: (state, action) => {
      const videoId = action.payload;
      state.videos = state.videos.map((video) => {
        if (video.video_id === videoId) {
          return {
            ...video,
            views: video.views + 1,
          };
        }
        return video;
      });
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchMessage: (state, action) => {
      state.searchMessage = action.payload;
    },
  },
});

export const { setVideos, setNewVideo, incrementView, setSearchQuery, setSearchMessage,setAllTags } = videoSlice.actions;
export const getVideos = (state) => state.video.videos;
export const getNewVideo = (state) => state.video.newVideo;
export const getAllTags = (state) => state.video.tags;
export const getSearchQuery = (state) => state.video.searchQuery;
export const getSearchMessage = (state) => state.video.searchMessage;

export default videoSlice.reducer;