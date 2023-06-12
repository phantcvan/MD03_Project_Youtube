import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channels: [],
  currentUser: null,
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
  },
});

export const { setAllChannels, setCurrentUser } = channelsSlice.actions;

export const getAllChannels = (state) => state.channels.channels;
export const getCurrentUser = (state) => state.channels.currentUser;

export default channelsSlice.reducer;