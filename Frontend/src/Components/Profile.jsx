import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setProfile(response.data);
        setEditableProfile(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setEditableProfile({
      ...editableProfile,
      [e.target.id]: e.target.value,
    });
  };
  
  const handleSave = async () => {
    try {
      await axios.put( "http://127.0.0.1:8000/api/profile/",editableProfile,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setProfile(editableProfile);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex h-screen bg-black items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          My Profile
        </h1>
        <form>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              value={editableProfile?.username}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              value={editableProfile.email}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-gray-700 font-medium mb-2"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              value={editableProfile.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300 mb-4"
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button>
          <button
            type="button"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-300"
            onClick={() => {
                navigate("/dashboard");
  
            }}
          >
            Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
