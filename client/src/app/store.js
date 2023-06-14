import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appReducer from "../slices/appSlice";
import userReducer from "../slices/userSlice";
import videoReducer from "../slices/videoSlice";
import channelsReducer from '../slices/channelSlice';

const reducer = combineReducers({
  app: appReducer,
  userInfo: userReducer,
  video: videoReducer,
  channels: channelsReducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
