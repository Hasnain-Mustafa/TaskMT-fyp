import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePicture } from "../features/auth/authActions";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebaseConfig";
import { motion } from "framer-motion";
import { framerButtonVariants } from "../components/framer";
import { FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

const UpdateProfilePicture = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [photoURL, setPhotoURL] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false); // State to track form submission
  const dispatch = useDispatch();

  // Function to handle image file upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the uploaded file
    if (!file) return;

    // Create a storage reference
    const fileRef = ref(storage, `profileImages/${file.name}`);

    try {
      // Upload file to Firebase Storage
      const snapshot = await uploadBytes(fileRef, file);

      // Get download URL of uploaded file
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update photoURL state with the download URL
      setPhotoURL(downloadURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    const res = dispatch(updatePicture({ email: userInfo.email, photoURL }));
    res.then((result) => {
      if (result && result.meta.requestStatus) {
        if (result.meta.requestStatus === "rejected") {
          toast.error(result.payload);
        } else if (result.meta.requestStatus === "fulfilled") {
          toast.success("Profile Updated!");
        }
      }
    });
  };

  return (
    <div className="mt-28 max-w-72 ml-20 md:mx-auto bg-white relative p-4">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-4">
        {/* Display current profile picture or placeholder icon */}
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile Picture"
            className="rounded-full w-24 h-24 mb-2 object-contain"
          />
        ) : (
          <FaUser className="rounded-full w-24 h-24 mb-2 object-contain" />
        )}
        {/* File input for image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden" // Hide the file input
          id="image-upload"
        />
        {/* Button to trigger file input */}
        <motion.label
          {...framerButtonVariants}
          htmlFor="image-upload"
          className="rounded-full text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-Hover h-8 px-3 py-2 w-22 text-center"
        >
          Upload Image
        </motion.label>
      </div>
      <div>
        <motion.button
          {...framerButtonVariants}
          type="button"
          onClick={handleSubmit}
          className="rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-Hover h-10 px-4 py-2 w-full"
        >
          Update Profile
        </motion.button>
      </div>
    </div>
  );
};

export default UpdateProfilePicture;
