import { useRef, useState } from "react";
import { Camera, Loader } from "lucide-react";
import { userAuthStore } from "../store/userAuthStore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout } =
    userAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const imgRef = useRef();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </div>
      <div className="parent-profile">
        <div className="parent-p">
          <div className="heading">
            <div className="image-container">
              <img
                src={selectedImg || authUser.profilePic}
                alt="User Profile Pic"
                className="logo-user"
              />
              <div
                className="logo-user overlapdiv"
                onClick={() => imgRef.current.click()}
              >
                <Camera className="camera" />
              </div>
              <input
                type="file"
                ref={imgRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                disabled={isUpdatingProfile}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
