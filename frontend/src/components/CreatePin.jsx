import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { categories } from "../utils/data";
import { client } from "../client";
import Spinner from "./Spinner";

const CreatePin = ({ user }) => {
  
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageAssets, setImageAssets] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(null);

  const navigate = useNavigate();
  

  const uploadImage = (e) => {
   
    const selectedFile = e.target.files[0];
    if (
      selectedFile.type === "image/png" ||
      selectedFile.type === "image/svg" ||
      selectedFile.type === "image/jpeg" ||
      selectedFile.type === "image/gif" ||
      selectedFile.type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => {
        
          setImageAssets(document);
          setLoading(false);
        })
        .catch((err) => {
          console.log("image upload error", err);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const savePin=()=>{
    if (title && about && destination && imageAssets?._id && category){
      const doc = {
        _type :'pin',
        title,
        about,
        destination,
        image:{
          _type:'image',
          asset:{
            _type:'reference',
            _ref:imageAssets?._id
          }
        },
        userId:user._id,
        postedBy:{
          _type:'postedBy',
          _ref:user._id,
        },
        category,
      };

      
      client.create(doc)
      .then(()=>{
        navigate('/');
      });

    }else{
      setFields(true)

      setTimeout(() => {
        setFields(false)
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">
          please fill in the fields
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5">
        <div className="bg-secondaryColor p-3 flex flex-col">
          <div className=" flex justify-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420"
          
          >
            {loading && <Spinner />}
            {wrongImageType && <p>wrong image type</p>}
            {!imageAssets ? (
              <label
              
              htmlFor="">
                <div className="flex flex-col justify-center items-center">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    use high-quality JPG, SVG, PNG, GIF or TIFF less than 20 MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={(e)=> uploadImage(e)}
                  className="w-full h-10 mt-5"
                />
              </label>
            ) : (
              <div className="relative  h-full">
                <img
                  src={imageAssets?.url}
                  alt="uploaded-pic"
                  className="h-full w-full "
                />
                <button
                  type="button "
                  onClick={() => setImageAssets(null)}
                  className="absolute bottom-2 right-3 p-3 rounded-full bg-white  text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 w-full">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title here"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          {user && (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                alt="user-profile"
                className="w-10 h-10 rounded-full "
              />
              <p className="font-bold">{user.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />

          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destinaiton link"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col ">
              <div>
                <p className="mb-2 font-semibold text-lg sm:text-xl">Choose Pin Category</p>
                <select name="" 
                id=""
                className="outline-none w-4/5  border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                onChange={(e)=> setCategory(e.target.value) }
                >
                  <option value="other" className="bg-white">select category</option>
                  {categories.map((item)=>{
                    return (
                      <option
                      key={item.name}
                      value={item.name}
                      className="text-base border-0 outline-none capitalize "
                      >{item.name}</option>
                    )
                  })}
                </select>
              </div>

                <div className="flex justify-end items-end mt-5 ">
                  <button type="button"
                  onClick={savePin}
                  className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                  >Save pin</button>
                </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
