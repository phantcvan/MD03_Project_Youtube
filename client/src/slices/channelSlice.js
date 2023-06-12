import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [],
  currentUser: null,
  channelsSub: []
};


const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setAllChannels: (state, action) => {
      state.channels = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setChannelsSub: (state, action) => {
      state.channelsSub = action.payload;
    },
  },
});

export const { setAllChannels, setCurrentUser, setChannelsSub } = channelsSlice.actions;

export const getAllChannels = (state) => state.channels.channels;
export const getCurrentUser = (state) => state.channels.currentUser;
export const getChannelsSub = (state) => state.channels.channelsSub;

export default channelsSlice.reducer;