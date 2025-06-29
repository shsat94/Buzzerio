import { useState, useEffect, useContext } from 'react';
import { Zap, Users, Check, X, Loader2 } from 'lucide-react';
import { useAlert } from '../contextApi/Alert';
import { useNavigate } from 'react-router-dom';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useLoading } from '../contextApi/Load';
import { useStateVariable } from '../contextApi/StateVariables';

export default function BuzzerHomepage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [isLoading, setIsLoadingIn] = useState(false);
    const [joinResult, setJoinResult] = useState(null);
    const [animateButtons, setAnimateButtons] = useState(false);
    const [particles, setParticles] = useState([]);
    const { PopAlert, closeAlert } = useAlert();
    const navigate = useNavigate();
    const { socket } = useContext(EnvVariableContext);
    const { setIsLoading } = useLoading();
    const { setNewRoom, setCpRoomId, cpName, setCpName } = useStateVariable();

    useEffect(() => {
        // Trigger button animations after component mounts
        setTimeout(() => setAnimateButtons(true), 300);

        // Generate floating particles
        const newParticles = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 20 + 10
        }));
        setParticles(newParticles);
    }, []);

    const isRoomIdValid = roomId.length === 10;

    const handleCreateRoom = async () => {
        setShowCreateModal(false);
        setIsLoading(true);
        setNewRoom(true);
        navigate("/host");

    };

    const handleJoinRoom = async () => {
        if (!isRoomIdValid) return;
        setIsLoading(true);
        setJoinResult(null);

        socket.emit("join-room", roomId, localStorage.getItem('token'));


    };

    useEffect(() => {


        socket.on("not-found", () => {
            setIsLoading(false);
            setJoinResult('error');
        });

        socket.on('room-joined', (roomid, memName) => {
            setShowJoinModal(false);
            setRoomId('');
            setJoinResult(null);
            setCpRoomId(roomid);
            setCpName(memName)
            navigate('/member');
        });
    }, [socket])

    const closeModals = () => {
        setShowCreateModal(false);
        setShowJoinModal(false);
        setRoomId('');
        setJoinResult(null);
        setIsLoadingIn(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-600/30 animate-pulse"></div>
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="absolute rounded-full bg-white/30 animate-bounce"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            animationDuration: `${particle.duration}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
                {/* Header with Mascot */}
                <div className={`text-center mb-12 transform transition-all duration-1000 ${animateButtons ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-pulse">
                        <Zap className="w-10 h-10 text-white animate-bounce" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                        Buzzer
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 font-medium">
                        Connect • Play • Buzz! 🎯
                    </p>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-md md:max-w-lg justify-center items-center">
                    {/* Create Room Button */}
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className={`group relative overflow-hidden bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-emerald-500/25 w-full md:w-64 ${animateButtons ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                            }`}
                        style={{ transitionDelay: '0.2s' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            <Users className="w-6 h-6 group-hover:animate-bounce" />
                            <span className="text-lg md:text-xl">Create Room</span>
                        </div>
                    </button>

                    {/* Join Room Button */}
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className={`group relative overflow-hidden bg-gradient-to-r from-violet-400 to-fuchsia-400 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-violet-500/25 w-full md:w-64 ${animateButtons ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
                            }`}
                        style={{ transitionDelay: '0.4s' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            <Zap className="w-6 h-6 group-hover:animate-spin" />
                            <span className="text-lg md:text-xl">Join Room</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Create Room Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Create New Room?</h3>
                            <p className="text-gray-600 mb-8">Are you ready to start a new buzzer session?</p>

                            <div className="flex gap-4">
                                <button
                                    onClick={closeModals}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateRoom}
                                    className="flex-1 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                                >
                                    Create!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Join Room Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform animate-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Join Room</h3>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter Room ID
                                </label>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                    placeholder="10 characters"
                                    maxLength={10}
                                    className={`w-full px-4 py-3 rounded-xl border-2 font-mono text-center text-lg tracking-wider transition-colors duration-200 ${roomId.length === 0
                                            ? 'border-gray-300 focus:border-violet-400'
                                            : isRoomIdValid
                                                ? 'border-green-400 focus:border-green-500'
                                                : 'border-red-400 focus:border-red-500'
                                        } focus:outline-none`}
                                />
                                <p className={`text-sm mt-2 transition-colors duration-200 ${roomId.length === 0
                                        ? 'text-gray-500'
                                        : isRoomIdValid
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}>
                                    {roomId.length === 0
                                        ? 'Room ID must be exactly 10 characters'
                                        : isRoomIdValid
                                            ? '✓ Valid room ID format'
                                            : `${roomId.length}/10 characters`}
                                </p>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                                    <span className="text-gray-600">Checking room...</span>
                                </div>
                            )}

                            {/* Join Result */}
                            {joinResult && (
                                <div className={`flex items-center justify-center gap-2 mb-4 p-3 rounded-xl ${joinResult === 'success'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {joinResult === 'success' ? (
                                        <>
                                            <Check className="w-5 h-5" />
                                            <span>Room found! Joining...</span>
                                        </>
                                    ) : (
                                        <>
                                            <X className="w-5 h-5" />
                                            <span>Room not found. Try again!</span>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4">
                                <button
                                    onClick={closeModals}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleJoinRoom}
                                    disabled={!isRoomIdValid || isLoading}
                                    className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform ${isRoomIdValid && !isLoading
                                            ? 'bg-gradient-to-r from-violet-400 to-fuchsia-400 hover:from-violet-500 hover:to-fuchsia-500 text-white hover:scale-105'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {isLoading ? 'Joining...' : 'Join Room'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}