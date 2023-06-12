import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from "react-icons/ai";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { getNewVideo, setNewVideo } from '../slices/videoSlice';
import axios from 'axios';
// import { getAllChannels } from '../slices/channelSlice';

import { useNavigate } from 'react-router-dom';


const VideoDetail = ({ setOpen, user, videoId, setEdit }) => {
    const dispatch = useDispatch();
    const [selectInput, setSelectInput] = useState(0);
    // const [secondStep, setSecondStep] = useState(false);
    // const [selectedVideo, setSelectedVideo] = useState(null);
    const [title, setTitle] = useState("");
    const [imgUrl, setImgUrl] = useState(null);
    const [selectedImg, setSelectedImg] = useState(null);
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState(""); //chuỗi tag để update
    const [tags, setTags] = useState([]); //mảng tags
    // const [tagsEdit, setTagsEdit] = useState([]);
    const [forKid, setForKid] = useState(false);
    const [countText, setCountText] = useState(0);
    const navigate = useNavigate()
    const [message, setMessage] = useState("");
    const newVideo = useSelector(getNewVideo);
    // const allChannels = useSelector(getAllChannels);


    // tải về dữ liệu về video
    const loadDataVideo = async () => {
        try {
          const [tagsResponse, videoResponse] = await Promise.all([
            axios.get(`http://localhost:8000/api/v1/tags/${videoId}`),
            axios.get(`http://localhost:8000/api/v1/videos/${videoId}`),
          ]);
          setTags(tagsResponse.data.tags);
        //   setTagsEdit(tagsResponse.data.tags);
          setTag(tagsResponse.data.tags.map((tag) => tag.tag).join(", "));
          setTitle(videoResponse.data.findVideo[0].title);
          setDescription(videoResponse.data.findVideo[0].description);
          setImgUrl(videoResponse.data.findVideo[0].thumbnail);
          setCountText(videoResponse.data.findVideo[0].description.length);
          setForKid(tagsResponse.data.tags.some((tag) => tag.tag === "kid"));
      
          const file = await convertImageUrlToFile(videoResponse.data.findVideo[0].thumbnail);
          setSelectedImg(file);
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        loadDataVideo()
    }, [])
    console.log("img file", selectedImg);
    // Đổi ảnh từ link -> file
    const convertImageUrlToFile = async (imageUrl) => {
        try {
            const response = await axios.get(imageUrl, { responseType: "blob" });
            const file = new File([response.data], "image.jpg", { type: "image/jpg" });
            console.log("Chuyển đổi thành công:", file);
            return file;
        } catch (error) {
            console.error("Lỗi chuyển đổi:", error);
            return null;
        }
    };

    // Khi người dùng đã chọn ảnh
    const handleImgChange = (event) => {
        setSelectedImg(event.target.files[0]);
        setMessage("")
    };
    // Đếm số ký tự của mô tả
    const handleAddDes = (event) => {
        const value = event.target.value;
        setCountText(value.length);
        setDescription(value);
    }
    // thêm tag
    const handleAddTag = (e) => {
        let value = e.target.value;
        setTag(value);
        setTags(value.split(",").map((item) => item.trim()).filter((item) => item !== ""))
        if (forKid && !value.split(",").includes('kid')) {
            setTags([...value.split(",").map((item) => item.trim()).filter((item) => item !== ""), 'kid']);
        } else if (!forKid && tags.includes('kid')) {
            const newTags = tags.filter((tag) => tag !== 'kid')
            setTags(newTags)
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
console.log("tags",tags);
// console.log("tagsEdit",tagsEdit);
    const deleteTags = async (videoId) => {
        try {
            await axios.delete(`http://localhost:8000/api/v1/tags/${videoId}`);
            console.log('Tags deleted successfully.');
        } catch (error) {
            console.error('Error deleting tags:', error);
        }
    };

    const handleUpdateDetail = async (e) => {
        e.preventDefault();
        if (!title || !description || !selectedImg || !tag) {
            setMessage("Please fill out all information")
        } else {
            try {
                await deleteTags(videoId);

                const formData = new FormData();
                formData.append("video_id", videoId);
                formData.append("title", title);
                formData.append("description", description);
                formData.append("thumbnail", selectedImg);

                const updateResponse = await axios.put(`http://localhost:8000/api/v1/videos/${videoId}`, formData);

                if (updateResponse.data.status === 200) {
                    console.log('Update thông tin video thành công');
                }

                const postTagResponse = await axios.post(`http://localhost:8000/api/v1/tags`, {
                    videoId: videoId,
                    tags: tags
                });

                console.log(postTagResponse.data);

                if (postTagResponse.data.status === 200) {
                    console.log('Update tag thành công');
                    setMessage("");
                    // setSecondStep(true);
                    setEdit(false);
                }

                if (postTagResponse.data.status === 400 || updateResponse.data.status === 400) {
                    setMessage("Error");
                }
                dispatch(setNewVideo(videoId))
            } catch (error) {
                console.log(error)
            }
        }
    }


    return (
        <div className='w-[100%] h-[100%] scrollbar-hide overflow-y-scroll  absolute top-0 left-0 bg-overlay-40 flex flex-col items-center 
        justify-center z-20'>
            <div
                className='wrap_img w-[800px] h-[600px] bg-yt-light-2 text-yt-white p-5 flex flex-col gap-5 
      fixed rounded-md z-25'
            >
                <div className='absolute top-5 right-5 cursor-pointer'
                    onClick={() => setEdit(false)}>
                    <AiOutlineClose />
                </div>
                <p className='text-center text-2xl font-semibold mb-2'>
                    Edit Video Details
                </p>
                <div className='border-solid border-1 px-2 bg-transparent border-inherit flex flex-col items-center'>
                    <form
                        //  action="/api/v1/videos/upload" method="put" enctype="multipart/form-data"
                        className='flex flex-col items-start gap-2 w-full px-10' onSubmit={handleUpdateDetail}>
                        <div className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full
                 ${selectInput === 1 ? 'border-[#3EA6FF]' : 'border-yt-gray'}
                `}>
                            <label className={`${selectInput === 1 && 'text-[#3EA6FF]'}`}>Title (required)</label>
                            <input type='text' name="title" required
                                value={title}
                                className='bg-yt-light-2 text-yt-white outline-none w-full'
                                onChange={(e) => setTitle(e.target.value)}
                                onClick={() => setSelectInput(1)} />
                        </div>
                        <div className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full
                 ${selectInput === 2 ? 'border-[#3EA6FF]' : 'border-yt-gray'}
                `}>
                            <label className={`${selectInput === 2 && 'text-[#3EA6FF]'}`}>Description (required)</label>
                            <textarea rows={2} type='text' name="description" required
                                value={description}
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
                                    <input type="file" name="thumbnail"
                                        className='bg-yt-light-2 text-yt-white outline-none w-full'
                                        onChange={handleImgChange} />
                                </div>
                                {imgUrl && <img src={imgUrl} alt="Selected Thumbnail"
                                    className='w-32' />}
                            </div>
                        </div>
                        <div className={`bg-yt-light-2 flex flex-col text-yt-gray border rounded-sm py-1 px-2 w-full
                 ${selectInput === 4 ? 'border-[#3EA6FF]' : 'border-yt-gray'}
                `}>
                            <label className={`${selectInput === 4 && 'text-[#3EA6FF]'}`}>Tag (required)</label>
                            <input type='text' name="tags" required
                                value={tag}
                                className='bg-yt-light-2 text-yt-white outline-none w-full'
                                onClick={() => setSelectInput(4)} onChange={handleAddTag} />
                        </div>
                        <span className='text-lg font-medium'>Audience</span>
                        {forKid
                            ? <div className='flex gap-10'>
                                <div className='flex gap-2 items-center'>
                                    <input type="radio" value="kid" name='kidOption' className='w-4 h-4'
                                        onChange={handleUpdateTagForKid} checked />
                                    <label htmlFor="forKid">Yes, it's 'Made for Kids'</label>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <input type="radio" value="notForKid" name='kidOption' className='w-4 h-4'
                                        onChange={handleUpdateTagNotForKid} />
                                    <label htmlFor="forKid">No, it's not 'Made for Kids'</label>
                                </div>
                            </div>
                            : <div className='flex gap-10'>
                                <div className='flex gap-2 items-center'>
                                    <input type="radio" value="kid" name='kidOption' className='w-4 h-4'
                                        onChange={handleUpdateTagForKid} />
                                    <label htmlFor="forKid">Yes, it's 'Made for Kids'</label>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <input type="radio" value="notForKid" name='kidOption' className='w-4 h-4'
                                        onChange={handleUpdateTagNotForKid} checked />
                                    <label htmlFor="forKid">No, it's not 'Made for Kids'</label>
                                </div>
                            </div>}


                        <div className='flex justify-end w-full gap-2'>
                            <button className='py-2 bg-[#3EA6FF] px-5 rounded-sm text-yt-black font-medium my-3'>
                                SAVE
                            </button>
                        </div>
                    </form>
                </div>
                <div>

                    {message
                        && <div className='text-center '>
                            <p className='mt-10 bg-yt-gray w-fit m-auto p-2 rounded-sm'>{message}</p>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default VideoDetail;