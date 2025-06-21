import { useContext, useEffect, useState } from 'react';
import { User, Gamepad2, X } from 'lucide-react';
import { useSearchRoomId } from '../contextApi/Roomid';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useAlert } from '../contextApi/Alert';
import { useNavigate } from 'react-router-dom';
import { signupGuest } from '../controller/AuthenticationController';
import { useLoading } from '../contextApi/Load';
import { useStateVariable } from '../contextApi/StateVariables';

const JoinRoomPopup = ({ isOpen = true }) => {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const { searchRoomid } = useSearchRoomId();
    const { socket,host, apiKey } = useContext(EnvVariableContext);
    const { PopAlert, closeAlert } = useAlert();
    const navigate = useNavigate();
    const { setIsLoading } = useLoading();
    const {  setCpRoomId, setCpName } = useStateVariable();
    const onClose = () => {
        navigate('/');
    }

    // Validation functions
    const validateName = (value) => {
        if (value.length === 0) return '';
        if (value.length < 3) return 'Name must be at least 3 characters';
        return '';
    };

    // Handle input changes with live validation
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setNameError(validateName(value));
    };


    // Check if form is valid
    const isFormValid = name.length >= 3;

    const joinRoom = (gameRoomId) => {
        // setIsLoading(true);
        socket.emit("join-room", gameRoomId, localStorage.getItem('token'));
    };

    useEffect(() => {
    
    
            socket.on("not-found", () => {
                setIsLoading(false);
            });
    
            socket.on('room-joined', (roomid, memName) => {
                console.log("joined");
                setCpRoomId(roomid);
                setCpName(memName)
                navigate('/member');
            });
        }, [socket])

    const handleJoinClick = async() => {
        if (isFormValid) {
            if (await signupGuest(name, host, apiKey)) {
                await joinRoom(searchRoomid);
                console.log("set");
            }
            else {
                closeAlert();
                PopAlert('error', 'Error in joining room.', () => { });
            }
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 bg-opacity-95 flex items-center justify-center z-50 backdrop-blur-sm transition-all duration-300"
            onClick={handleBackdropClick}
            style={{
                backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)
        `
            }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 hover:scale-[1.02]">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 rounded-t-2xl text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                    >
                        <X size={20} />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-white bg-opacity-20 rounded-full">
                            <Gamepad2 size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Join Game Room</h2>
                            <p className="text-purple-100 text-sm">Enter your details to connect</p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">
                            Player Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                placeholder="Enter your name"
                                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${name.length === 0
                                        ? 'border-gray-300 focus:border-purple-500'
                                        : nameError
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-green-500 focus:border-green-600'
                                    } bg-gray-50 focus:bg-white`}
                            />
                        </div>
                        {nameError && (
                            <p className="text-red-500 text-xs mt-1 animate-pulse">{nameError}</p>
                        )}
                    </div>

                    {/* Join Button */}
                    <button
                        onClick={handleJoinClick}
                        disabled={!isFormValid}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all duration-300 transform ${isFormValid
                                ? 'bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 hover:from-green-600 hover:via-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl cursor-pointer'
                                : 'bg-gray-400 cursor-not-allowed opacity-60'
                            }`}
                    >
                        {isFormValid ? '🎮 Join Room' : 'Complete Form to Join'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JoinRoomPopup;