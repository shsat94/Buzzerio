import React, { useState, useEffect, useContext, useRef } from 'react';
import { Menu, User, X, Upload, Camera, LogOut } from 'lucide-react';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useAlert } from '../contextApi/Alert';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStateVariable } from '../contextApi/StateVariables';
import { useLoading } from '../contextApi/Load';
import { getUserDetails } from '../controller/AuthenticationController';

const Navbar = () => {
  const { apiKey, host } = useContext(EnvVariableContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cpSetRooms } = useStateVariable();
  const { PopAlert, closeAlert } = useAlert();
  const location = useLocation(); // Using React Router's useLocation
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  // Profile popup states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const fileInputRef = useRef(null);

  // User data states - Initialize with empty values
  const [userDataName, setUserDataName] = useState("");
  const [userDataEmail, setUserDataEmail] = useState("");
  const [userDataLoading, setUserDataLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(token !== null);
  }, [localStorage.getItem('token')]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleProfileClick = async (e) => {
    if (e) e.preventDefault();
    
    try {
      ('Profile clicked, fetching user data...');
      setUserDataLoading(true);
      
      // Check if we have the required context values
      if (!host || !apiKey) {
        console.error('Missing host or apiKey');
        PopAlert('error', "Configuration error", () => {}, "OK");
        return;
      }

      // Fetch user data
      const dataOfUser = await getUserDetails(host, apiKey);
      ('User data received:', dataOfUser);
      
      // Check if we got valid data
      if (dataOfUser && dataOfUser.name && dataOfUser.email) {
        setUserDataName(dataOfUser.name);
        setUserDataEmail(dataOfUser.email);
        ('User data set:', { name: dataOfUser.name, email: dataOfUser.email });
        
        // Open modal after data is loaded
        setIsProfileOpen(true);
      } else {
        console.error('Invalid user data received:', dataOfUser);
        PopAlert('error', "Failed to load user details", () => {}, "OK");
      }
      
    } catch (error) {
      console.error('Error fetching user details:', error);
      PopAlert('error', "Failed to load user details", () => {}, "OK");
    } finally {
      setUserDataLoading(false);
    }
  };

  const action = () => {
    navigate('/login');
  };

  const handleAvailableRoom = async () => {
    if (localStorage.getItem('token') == null) {
      closeAlert();
      PopAlert('warning', "You have to login to proceed", action, "Login");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${host}/${apiKey}/host/getallrooms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
      });

      const response = await res.json();
      if (response.execution) {
        await cpSetRooms(response.room);
        navigate('/rooms');
      } else {
        PopAlert('error', "Failed to load rooms", () => { }, "OK");
      }
    } catch (error) {
      PopAlert('error', "An error occurred", () => { }, "OK");
    }
  };

  // Profile popup functions
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
      ("Access camera");
    }
    setIsUploadModalOpen(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setProfileImage(imageUrl);
    }
  };

  const confirmLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsLogoutModalOpen(false);
    setIsProfileOpen(false);
    // Clear user data on logout
    setUserDataName("");
    setUserDataEmail("");
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Link
                to="/"
                className="text-xl font-bold text-sky-600 hover:text-sky-700 transition-colors duration-300"
              >
                Buzzerio
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/home"
                className={`text-gray-600 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${location.pathname === '/home' ? 'text-sky-600 border-b-2 border-sky-600' : ''
                  }`}
                onClick={(e) => {
                  if (localStorage.getItem('token') == null) {
                    e.preventDefault();
                    closeAlert();
                    PopAlert('warning', "You have to login to proceed", action, "Login");
                    navigate('/login'); 
                  } else {
                    closeMenu();
                  }
                }}
              >
                HOME
              </Link>

              <Link
                to="/rooms"
                className={`text-gray-600 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${location.pathname === '/rooms' ? 'text-sky-600 border-b-2 border-sky-600' : ''
                  }`}
                onClick={() => {
                  handleAvailableRoom();
                  closeMenu();
                }}
              >
                ROOMS
              </Link>
              <Link
                to="/contact"
                className={`text-gray-600 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${location.pathname === '/contact' ? 'text-sky-600 border-b-2 border-sky-600' : ''
                  }`}
                onClick={closeMenu}
              >
                CONTACT US
              </Link>
              <Link
                to="/about"
                className={`text-gray-600 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${location.pathname === '/about' ? 'text-sky-600 border-b-2 border-sky-600' : ''
                  }`}
                onClick={closeMenu}
              >
                ABOUT US
              </Link>
            </div>

            <div className="hidden md:flex items-center">
              {isLoggedIn ? (
                <button
                  onClick={handleProfileClick}
                  disabled={userDataLoading}
                  className="flex items-center text-gray-700 hover:text-sky-600 transition-colors duration-300 disabled:opacity-50"
                >
                  <User className="h-6 w-6 hover:scale-110 transition-transform duration-300" />
                  {userDataLoading && <span className="ml-2 text-xs">Loading...</span>}
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={handleLogin}
                  className="bg-sky-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-sky-700 transform hover:scale-105 transition-all duration-300"
                >
                  LOGIN
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-sky-600 hover:bg-gray-100 focus:outline-none transition-colors duration-300"
              >
                {isOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link
              to="/home"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/home'
                ? 'text-sky-600 bg-sky-50'
                : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                } transition-colors duration-300`}
              onClick={(e) => {
                if (localStorage.getItem('token') == null) {
                  e.preventDefault();
                  closeAlert();
                  PopAlert('warning', "You have to login to proceed", action, "Login");
                  return;
                }
                closeMenu();
              }}
            >
              HOME
            </Link>
            <Link
              to="/rooms"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/rooms'
                ? 'text-sky-600 bg-sky-50'
                : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                } transition-colors duration-300`}
              onClick={() => {
                handleAvailableRoom();
                closeMenu();
              }}
            >
              ROOMS
            </Link>
            <Link
              to="/contact"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/contact'
                ? 'text-sky-600 bg-sky-50'
                : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                } transition-colors duration-300`}
              onClick={closeMenu}
            >
              CONTACT US
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/about'
                ? 'text-sky-600 bg-sky-50'
                : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                } transition-colors duration-300`}
              onClick={closeMenu}
            >
              ABOUT US
            </Link>

            <div className="pt-4 pb-3 border-t border-gray-200">
              {isLoggedIn ? (
                <Link
                  to="#"
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-sky-600 hover:bg-gray-50 transition-colors duration-300"
                  onClick={() => {
                    handleProfileClick();
                    closeMenu();
                  }}
                >
                  <User className="mr-3 h-6 w-6" />
                  My Profile
                  {userDataLoading && <span className="ml-2 text-xs">Loading...</span>}
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-sky-600 text-white hover:bg-sky-700 transition-colors duration-300"
                  onClick={() => {
                    handleLogin();
                    closeMenu();
                  }}
                >
                  LOGIN
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Profile Popup Components */}

      {/* Background Overlay */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Profile Popup */}
      <div
        className={`fixed top-20 right-4 md:right-8 w-full max-w-sm bg-white rounded-2xl shadow-2xl z-50 transition-all duration-500 ${isProfileOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="relative flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
            <button
              onClick={() => setIsProfileOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div
                className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-sky-500 cursor-pointer mb-2"
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
                className="absolute bottom-0 right-0 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center shadow-md hover:bg-sky-600 transition-colors"
              >
                <Upload size={16} className="text-white" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center p-3 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mr-3">
                <User size={20} className="text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-semibold text-gray-800">
                  {userDataLoading ? "Loading..." : (userDataName || "No name available")}
                </p>
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
                <p className="font-semibold text-gray-800">
                  {userDataLoading ? "Loading..." : (userDataEmail || "No email available")}
                </p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rooms Left</p>
                <p className="font-semibold text-gray-800">3</p>
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
        className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 transition-opacity duration-300 ${isPhotoModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
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
            <p className="text-gray-500 text-sm">{userDataName || "User"}</p>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 transition-opacity duration-300 ${isUploadModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
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
                className="w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-lg flex items-center justify-center gap-2"
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
        className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75 transition-opacity duration-300 ${isLogoutModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
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
    </>
  );
};

export default Navbar;