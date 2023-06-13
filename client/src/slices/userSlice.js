import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  showMenu:false,
  showLogIn:false,
};

export const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
    },
    setShowMenu: (state, action) => {
      state.showMenu = action.payload;
    },
    setShowLogIn: (state, action) => {
      state.showLogIn = action.payload;
    },
  },
});

export const { setUser, logout, setShowMenu, setShowLogIn } = userSlice.actions;

export const getUser = (state) => state.userInfo.user;
export const getShowMenu = (state) => state.userInfo.showMenu;
export const getShowLogIn = (state) => state.userInfo.showLogIn;

export default userSlice.reducer;
