import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { getVideos, getNewVideo, setNewVideo } from '../slices/videoSlice';
import axios from 'axios';
import { getAllChannels } from '../slices/channelSlice';
import { useNavigate } from 'react-router-dom';
import upload1 from "../assets/upload-step1-rm.png";
import upload2 from "../assets/upload-step1-done.png";
import uploadGIF from "../assets/upload-2.gif";

const UploadVideo = ({ setOpen, user }) => {
  const dispatch = useDispatch();
  const [selectInput, setSelectInput] = useState(0);
  const [secondStep, setSecondStep] = useState(false);
  const [videoId, setVideoId] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [forKid, setForKid] = useState(false);
  const [countText, setCountText] = useState(0);
  const navigate = useNavigate()
  const [message, setMessage] = useState("");
  const videos = useSelector(getVideos);
  const newVideo = useSelector(getNewVideo);
  const allChannels = useSelector(getAllChannels);
  const [imageSrc, setImageSrc] = useState(uploadGIF);



  // tạo videoId ngẫu nhiên
  const generateRandomId = () => {
    const min = 1000000;
    const max = 9999999;
    let newId = Math.floor(Math.random() * (max - min + 1)) + min;
    // Kiểm tra xem newId đã tồn tại trong mảng videos hay chưa
    while (videos.some(video => video.video_id === newId)) {
      newId = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return newId;
  }

  // lấy dữ liệu ngày tháng năm của hôm nay
  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  // add video
  const handleInputChange = (event) => {
    const videoFileArr = event.target.files[0].name.split('.');
    const typeOfVideo = videoFileArr[videoFileArr.length - 1].toLowerCase();
    if (typeOfVideo === 'mp4' || typeOfVideo === 'avi' || typeOfVideo === 'mkv') {
      setSelectedVideo(event.target.files[0]);
      setMessage("");
      setSelectInput(3);

    } else {
      console.log(typeOfVideo);
      setMessage('Please select a video in MP4, AVI or MKV format.');
      setSelectedVideo(null);
    }
  };
  // gif chạy 1 lần
  useEffect(() => {
    const timeout = setTimeout(() => {
      setImageSrc(upload2);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [selectedVideo]);

  const handleAddVideo = async (e) => {
    const channelId = allChannels.find(channel => channel.email === user.email).channel_id;
    const currentDate = getCurrentDate();
    const video_id = generateRandomId();
    setVideoId(video_id)
    e.preventDefault();
    if (!selectedVideo) {
      setMessage("Please choose a video")
    } else {
      const formData = new FormData();
      formData.append("video", selectedVideo);
      formData.append("video_id", video_id);
      formData.append("channel_id", channelId);
      formData.append("upload_date", currentDate);
      formData.append("title", "draft");

      formData.append("views", 0);

      await axios.post('http://localhost:8000/api/v1/videos', formData)
        .then(res => {
          console.log(res.data);
          if (res.data.status === 200) {
            console.log('Thêm video thành công');
            setMessage("");
            setSecondStep(true);

          }
        })
        .catch(error => console.log(error))
    }
  }

  const handleAddTitle = (e) => {
    const inputTitle = e.target.value.replace(/\s+/g, '');
    console.log(inputTitle);
    if (inputTitle !== " ") {
      setTitle(e.target.value);
      setMessage("");
    }
  }
  // Khi người dùng đã chọn ảnh
  const handleImgChange = (event) => {
    const ImgFileArr = event.target.files[0].name.split('.');
    const typeOfImg = ImgFileArr[ImgFileArr.length - 1].toLowerCase();
    if (typeOfImg === 'png' || typeOfImg === 'jpg' || typeOfImg === 'jpeg' || typeOfImg === 'bmp') {
      setSelectedImg(event.target.files[0]);
      setMessage("");
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImgURL(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      console.log(typeOfImg);
      setMessage('Please select a image in PNG, JPG, JPEG or BMP format.');
      setSelectedImg(null);
    }
  };
  // Đếm số ký tự của mô tả
  const handleAddDes = (event) => {
    const value = event.target.value.replace(/\s+/g, ' ');
    if (value !== " ") {
      setCountText(event.target.value.length);
      setDescription(event.target.value);
      setMessage("");
    }
  }

  const handleAddTag = (e) => {
    let tagValue = e.target.value.replace(/\s+/g, '');
    if (tagValue) {
      setMessage("");
      setTag(e.target.value);
      setTags(e.target.value.split(",").map((item) => item.trim()).filter((item) => item !== ""))
      if (forKid && !tagValue.split(",").includes('kid')) {
        setTags([...tagValue.split(",").map((item) => item.trim()).filter((item) => item !== ""), 'kid']);
      } else if (!forKid && tags.includes('kid')) {
        const newTags = tags.filter((tag) => tag !== 'kid')
        setTags(newTags)
      }
    }
  }

  const handleUpdateTagForKid = () => {
    setForKid(true);
    if (!tags.includes('kid')) setTags([...tags, 'kid'])
  }
  const handleUpdateTagNotForKid = () => {
    setForKid(false);
    if (tags.includes('kid')) setTags(tags.filter((tag) => tag !== 'kid'))
  }
  // console.log("tags", tags);
  const handleUpdateDetail = async (e) => {
    e.preventDefault();
    if (!title || !description || !selectedImg || !tag) {
      setMessage("Please fill out all information")
    } else {
      const formData = new FormData();
      formData.append("video_id", videoId);
      formData.append("title", title.replace(/\s+/g, ''));
      formData.append("description", description.replace(/\s+/g, ''));
      formData.append("thumbnail", selectedImg);
      try {
        const [updateResponse, PostTagResponse] = await Promise.all([
          axios.put(`http://localhost:8000/api/v1/videos/${videoId}`, formData),
          axios.post(`http://localhost:8000/api/v1/tags`, {
            videoId: videoId,
            tags: tags
          })
        ])

        console.log(updateResponse.data);
        if (updateResponse.data.status === 200) {
          console.log('Update thông tin video thành công');
        }
        console.log(PostTagResponse.data);
        if (PostTagResponse.data.status === 200) {
          console.log('Thêm tag thành công');
          setMessage("");
          setSecondStep(true);
          setOpen(false);
        }
        if (PostTagResponse.data.status === 400 || updateResponse.data.status === 400) {
          setMessage("Error");
        }
        dispatch(setNewVideo(videoId))
        // navigate('/')

      } catch (error) {
        console.log(error)
      }
    }
  }
  console.log(selectedImg);

  return (
    <div className='w-[100%] h-[100%] absolute left-0 bg-overlay-40 flex items-center 
    justify-center z-20'>
      <div className='w-[100%] h-[100%] fixed left-0 bg-overlay-40 flex items-center 
    justify-center z-21'
        onClick={() => setOpen(false)}
      >
      </div>
      <div
        className='wrap_img w-[800px] h-[600px] bg-yt-light-2 text-yt-white px-5 pt-4 flex flex-col gap-5 
      fixed rounded-md z-25'
      >
        {!secondStep
          ? <>
            <div className='absolute top-5 right-5 cursor-pointer'
              onClick={() => setOpen(false)}>
              <AiOutlineClose />
            </div>
            <p className='text-center text-2xl font-semibold mt-2'>
              Upload a new Video
            </p>
            <div className='flex flex-col'>
              <div className='flex items-center w-full justify-center'>
                <div className={`w-36 h-36 flex items-center justify-center mt-3`}>
                  {/* <span className='rounded-full text-center'> */}
                  {/* <RiUploadCloud2Line size={50} /> */}
                  {selectedVideo
                    ? <img src={imageSrc} alt="" />
                    : <img src={upload1} alt="" />}
                  {/* </span> */}
                </div>
              </div>
              <p className='text-center mt-2 text-md'>
                Your videos will be private until you publish them.
              </p>
            </div>
            <div className='border-solid border-1 px-2 bg-transparent border-inherit flex flex-col items-center'>
              <form action="/api/v1/videos/upload" method="post" enctype="multipart/form-data"
                className='flex flex-col items-center' onSubmit={handleAddVideo}>
                <input type="file" name="video"
                  onChange={handleInputChange}
                  className='rounded-md m-2 border-solid border-1 p-4 bg-transparent text-md' />
                <button className={`py-2 px-20 rounded-sm text-yt-black font-medium my-6
                ${selectedVideo ? "bg-[#3EA6FF] cursor-pointer" : "bg-[#808080] cursor-default"}`}>
                  UPLOAD
                </button>
              </form>
            </div>
            <div>
              <p className='text-[13px] text-center my-1'>
                By submitting your videos to YouTube, you acknowledge that you agree to YouTube's
                <span className='text-[#1967D2]'> Terms of Service </span>
                and
                <span className='text-[#1967D2]'>  Community Guidelines</span>.
              </p>
              <p className='text-[13px] text-center'>
                Please be sure not to violate others' copyright or privacy rights.
                <span className='text-[#1967D2]'> Learn more </span>
              </p>
              {message
                && <div className='text-center'>
                  <p className='mt-6 bg-yt-gray w-fit m-auto p-2 rounded-sm'>{message}</p>
                </div>}
            </div>
          </>
          // bước 2
          : <div className='w-full'>
            {/* <VideoDetail setOpen={setOpen} videoId={videoId} setMessage={setMessage} /> */}
            <div className='absolute top-5 right-5 cursor-pointer'
              onClick={() => setOpen(false)}>
              <AiOutlineClose />
            </div>
            <p className='text-center text-2xl font-semibold mb-[6px]'>
              Video Details
            </p>
            <div className='border-solid border-1 px-2 bg-transparent border-inherit flex flex-col items-center'>
              <form
                //  action="/api/v1/videos/upload" method="put" enctype="multipart/form-data"
                className='flex flex-col items-start gap-[6px] w-full px-10' onSubmit={handleUpdateDetail}>
                <div className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full
                 ${selectInput === 1 ? 'border-[#3EA6FF]' : 'border-yt-gray'}
                `}>
                  <label className={`${selectInput === 1 && 'text-[#3EA6FF]'}`}>Title (required)</label>
                  <input type='text' name="title" required
                    className='bg-yt-light-2 text-yt-white outline-none w-full'
                    onChange={handleAddTitle}
                    onClick={() => setSelectInput(1)} />
                </div>
                <div className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full
                 ${selectInput === 2 ? 'border-[#3EA6FF]' : 'border-yt-gray'}
                `}>
                  <label className={`${selectInput === 2 && 'text-[#3EA6FF]'}`}>Description (required)</label>
                  <textarea rows={2} type='text' name="description" required
                    className='bg-yt-light-2 text-yt-white outline-none w-full'
                    onChange={handleAddDes} onClick={() => setSelectInput(2)} />
                  <span className='text-right'>{countText}/5000</span>
                </div>
                <div className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full
                 ${selectInput === 3 ? 'border-[#3EA6FF]' : 'border-yt-gray'}
                `}>
                  <label className={`${selectInput === 3 && 'text-[#3EA6FF]'} text-lg font-medium`}>
                    Thumbnail</label>
                  <div className='flex justify-start gap-3'>
                    <div className='flex flex-col'>
                      <span className='my-1'>Select or upload a picture that shows what's in your video.
                        A good thumbnail stands out and draws viewers' attention.</span>
                      <input type="file" name="thumbnail" required
                        // value={selectedImg}
                        className='bg-yt-light-2 text-yt-white outline-none w-full'
                        onChange={handleImgChange} />
                    </div>
                    {selectedImg && <img src={imgURL} alt="Selected Thumbnail"
                      className='w-32' />}
                  </div>
                </div>
                <div className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full
                 ${selectInput === 4 ? 'border-[#3EA6FF]' : 'border-yt-gray'}
                `}>
                  <label className={`${selectInput === 4 && 'text-[#3EA6FF]'}`}>Tag (required)</label>
                  <input type='text' name="tags" required
                    className='bg-yt-light-2 text-yt-white outline-none w-full'
                    onClick={() => setSelectInput(4)} onChange={handleAddTag} />
                </div>
                <span className='text-lg font-medium'>Audience</span>
                <div className='flex gap-10'>
                  <div className='flex gap-2 items-center'>
                    <input type="radio" value="kid" name='kidOption' className='w-4 h-4'
                      onChange={handleUpdateTagForKid} />
                    <label htmlFor="forKid">Yes, it's 'Made for Kids'</label>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <input type="radio" value="notForKid" name='kidOption' className='w-4 h-4'
                      onChange={handleUpdateTagNotForKid} />
                    <label htmlFor="forKid">No, it's not 'Made for Kids'</label>
                  </div>
                </div>

                <div className='flex justify-end w-full gap-2'>
                  <button className='py-2 bg-[#3EA6FF] px-5 rounded-sm text-yt-black font-medium mt-2'>
                    SAVE
                  </button>
                </div>
              </form>
            </div>
            <div>

              {message
                && <div className='text-center '>
                  <p className='mt-[-2] bg-yt-gray w-fit m-auto p-2 rounded-sm'>{message}</p>
                </div>}
            </div>
          </div>

        }
      </div>
    </div>
  )
}

export default UploadVideo