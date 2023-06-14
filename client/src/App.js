import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Channel from "./pages/Channel";
import Public from "./pages/Public";
import Liked from "./pages/Liked";
import Search from "./pages/Search";
import UploadVideo from "./components/UploadVideo";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentWidth } from "./slices/appSlice";

function App() {
  const [curWidth, setCurWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();

      // set Width khi resize
  const setWidth = (e) => {
    setCurWidth(e.target.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', setWidth)
    return () => {
      window.removeEventListener('resize', setWidth)
    }
  }, [])
  // truyền width cho các page
  useEffect(() => {
    dispatch(setCurrentWidth(curWidth))
  }, [curWidth])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Public />}>
            <Route path="" element={<Home />} />
            <Route path="/video/:id" element={<Video />} />
            <Route path="/channel/:id" element={<Channel />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/likedVideos" element={<Liked />} />
            <Route path="/search" element={<Search />} />

          </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
