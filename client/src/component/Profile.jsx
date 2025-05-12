import { useState, useRef } from "react";
import { User, Upload, Camera, LogOut, X } from "lucide-react";

export default function ProfilePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const fileInputRef = useRef(null);
  
  // User data (would come from your app's state or context in a real app)
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    roomsLeft: 3
  };

  const togglePopup = () => setIsOpen(!isOpen);
  
  const openPhotoModal = () => {
    setIsPhotoModalOpen(true);
  };
  
  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };
  
  const handleUploadClick = (type) => {
    if (type === "gallery") {
      fileInputRef.current.click();
    } else {
      // In a real app, you would access the device camera here
      console.log("Access camera");
    }
    setIsUploadModalOpen(false);
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you would handle the file upload to server
      // Here we're just creating a local URL for demonstration
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setProfileImage(imageUrl);
    }
  };
  
  const confirmLogout = () => {
    setIsLogoutModalOpen(true);
  };
  
  const handleLogout = () => {
    // Handle the logout operation here
    console.log("Logging out...");
    setIsLogoutModalOpen(false);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      {/* Profile Button */}
      <button 
        onClick={togglePopup}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <User size={24} className="text-purple-600" />
      </button>
      
      {/* Background Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={togglePopup}
        />
      )}
      
      {/* Profile Popup */}
      <div 
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl z-50 transition-all duration-500 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="relative flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <button 
              onClick={togglePopup}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div 
                className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-500 cursor-pointer mb-2"
                onClick={openPhotoModal}
              >
                <img 
                  src={profileImage} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={openUploadModal}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-colors"
              >
                <Upload size={16} className="text-white" />
              </button>
            </div>
          </div>
          
          {/* User Info */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <User size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-800">{userData.name}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-gray-800">{userData.email}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rooms Left</p>
                <p className="font-semibold text-gray-800">{userData.roomsLeft}</p>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <button 
            onClick={confirmLogout}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Enlarged Photo Modal */}
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 transition-opacity duration-300 ${
          isPhotoModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsPhotoModalOpen(false)}
      >
        <div className="bg-white rounded-xl overflow-hidden max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
          <div className="relative">
            <img src={profileImage} alt="Profile" className="w-full h-auto" />
            <button 
              className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-colors"
              onClick={() => setIsPhotoModalOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">Profile Photo</h3>
            <p className="text-gray-500 text-sm">{userData.name}</p>
          </div>
        </div>
      </div>
      
      {/* Upload Modal */}
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 transition-opacity duration-300 ${
          isUploadModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsUploadModalOpen(false)}
      >
        <div className="bg-white rounded-xl overflow-hidden w-full max-w-xs mx-4" onClick={e => e.stopPropagation()}>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-center mb-4">Change Profile Photo</h3>
            <div className="space-y-2">
              <button 
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg flex items-center justify-center gap-2"
                onClick={() => handleUploadClick("camera")}
              >
                <Camera size={18} />
                <span>Take Photo</span>
              </button>
              <button 
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg flex items-center justify-center gap-2"
                onClick={() => handleUploadClick("gallery")}
              >
                <Upload size={18} />
                <span>Choose from Gallery</span>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            <button 
              className="w-full mt-4 py-2 text-gray-500 font-medium"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      <div 
        className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 transition-opacity duration-300 ${
          isLogoutModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsLogoutModalOpen(false)}
      >
        <div 
          className="bg-white rounded-xl p-6 w-full max-w-xs mx-4 transition-transform duration-300 transform scale-100"
          onClick={e => e.stopPropagation()}
          style={{
            animation: isLogoutModalOpen ? 'bounceIn 0.5s' : 'none'
          }}
        >
          <h3 className="text-lg font-semibold text-center">Logout Confirmation</h3>
          <p className="text-gray-500 text-center mt-2 mb-6">Are you sure you want to logout?</p>
          <div className="flex gap-4">
            <button 
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              onClick={() => setIsLogoutModalOpen(false)}
            >
              No
            </button>
            <button 
              className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-colors"
              onClick={handleLogout}
            >
              Yes
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}