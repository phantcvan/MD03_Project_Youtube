import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import Channel from "./pages/Channel";
import Public from "./pages/Public";
import History from "./pages/History";
import Search from "./pages/Search";
import UploadVideo from "./components/UploadVideo";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Public />}>
            <Route path="" element={<Home />} />
            <Route path="/video/:id" element={<Video />} />
            <Route path="/channel/:id" element={<Channel />} />
            <Route path="/history" element={<History />} />
            <Route path="/search" element={<Search />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
