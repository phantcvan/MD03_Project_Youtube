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

function App() {
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
