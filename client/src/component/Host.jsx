import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Copy,
  Share2,
  Users,
  RotateCcw,
  X,
  Check,
  MessageCircle,
  Mail,
  Link,
  Crown,
  Trophy,
  Medal,
  Zap
} from 'lucide-react';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useLoading } from '../contextApi/Load';
import { useNavigate } from 'react-router-dom';
import { useStateVariable } from '../contextApi/StateVariables';

const HostLeaderboard = () => {
  const [roomId, setRoomId] = useState("");
  const [hostName, setHostName] = useState("hi");
  const [leaderboard, setLeaderboard] = useState([]);
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showReloadConfirm, setShowReloadConfirm] = useState(false);
  const [showMiniMode, setShowMiniMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const leaderboardRef = useRef(null);
  const animationRef = useRef(null);
  const { socket } = useContext(EnvVariableContext);
  const { setIsLoading } = useLoading();
  const navigate = useNavigate();
  const { newRoom, rejoinRoomId } = useStateVariable();




  useEffect(() => {
    if (newRoom) {
      socket.emit("create-room", localStorage.getItem("token"));
      ("srfrrafa");
    }
    else {
      (rejoinRoomId);
      socket.emit("host-rejoin-room", rejoinRoomId);
    }
  }, []);


  useEffect(() => {
    if (!socket) return;
    const handleRoomInfo = (hostname, roomid) => {
      ('Received from socket:', hostname, roomid);
      setHostName(hostname);
      setRoomId(roomid);
    };

    socket.on('creator-room-info', handleRoomInfo);


    socket.on("update-host-leader", (timemaplist) => {
      setLeaderboard(timemaplist);
    });
    socket.on("member-details", (allmembers) => {
      (allmembers);
      ("gg");
      allmembers != null ? setMembers(allmembers) : setMembers([]);
    });
  }, [socket]);

  // Handle tab visibility
  useEffect(() => {
    setIsLoading(false);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowMiniMode(true);
      } else {
        setShowMiniMode(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle page reload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      setShowReloadConfirm(true);
      return e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://buzzerio-pw44.onrender.com/?popup=true&roomid=${roomId}`);
      setCopied(true);
      showToast('Link to join is copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showToast('Failed to copy room ID', 'error');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleShare = (platform) => {
    const shareText = `Join my Buzzer room: Click on Link : \n`;
    const shareUrl = `https://buzzerio-pw44.onrender.com/?popup=true&roomid=${roomId}`;
    // const shareUrl = `http://localhost:5173/?popup=true&roomid=${roomId}`;
    const fullMessage = `${shareText} ${shareUrl}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(fullMessage)}`);
      // case 'email':
      //   window.open(`mailto:?subject=Join my Buzzer room&body=${encodeURIComponent(shareText)}`);
      //   break;
      case 'copy':
        copyToClipboard();
        break;
    }
    setShowShareMenu(false);
  };

  const resetLeaderboard = () => {
    setLeaderboard([]);
    socket.emit("reset-leaderboard", roomId);
    showToast('Leaderboard reset successfully!', 'success');
  };

  const closeRoom = () => {
    socket.emit('close-room', roomId);
    showToast('Room closed successfully!', 'success');
    setShowCloseConfirm(false);
    navigate('/home');
  };

  const getPositionIcon = (position) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-indigo-600">#{position}</span>;
    }
  };

  const getRowAnimation = (index) => ({
    opacity: 1,
    transform: 'translateY(0px)',
    transition: `all 0.5s ease ${index * 0.1}s`
  });

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 -right-8 w-96 h-96 bg-yellow-300 opacity-10 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-300 opacity-10 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Buzzer Host Dashboard</h1>
                <p className="text-gray-600">Host: <span className="font-semibold text-purple-600">{hostName}</span></p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
                <span className="text-sm font-medium text-gray-600">Room ID:</span>
                <span className="font-mono font-bold text-purple-600">{roomId}</span>
                <button
                  onClick={copyToClipboard}
                  className="ml-2 p-1 hover:bg-gray-200 rounded-lg transition-colors relative group"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {copied ? 'Copied!' : 'Copy'}
                  </div>
                </button>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>

                {showShareMenu && (
                  <div className="absolute top-12 right-0 bg-white rounded-xl shadow-lg border p-2 min-w-48 z-20">
                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      WhatsApp
                    </button>
                    <button
                      onClick={() => handleShare('email')}
                      className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Mail className="w-4 h-4 text-blue-500" />
                      Email
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Link className="w-4 h-4 text-purple-500" />
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="xl:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  Leaderboard
                </h2>
                <button
                  onClick={resetLeaderboard}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Position</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-700">Time (ms)</th>
                    </tr>
                  </thead>
                  <tbody ref={leaderboardRef}>
                    {leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-8 text-gray-500">
                          Waiting for participants to buzz in...
                        </td>
                      </tr>
                    ) : (
                      leaderboard.map((entry, index) => (
                        <tr
                          key={entry.pos}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          style={getRowAnimation(index)}
                        >
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              {getPositionIcon(entry.pos)}
                            </div>
                          </td>
                          <td className="py-4 px-2 font-medium text-gray-800">{entry.name}</td>
                          <td className="py-4 px-2">
                            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-mono">
                              +{entry.time}ms
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Members */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Members ({members.length - 1 < 0 ? 0 : members.length - 1})
                </h3>
                <button
                  onClick={() => setShowMembers(!showMembers)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors"
                >
                  {showMembers ? 'Hide' : 'Show'} Members
                </button>
              </div>

              <div className={`transition-all duration-500 overflow-hidden ${showMembers ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {members.slice(1).map((member, index) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      style={{
                        transform: showMembers ? 'translateX(0)' : 'translateX(-20px)',
                        opacity: showMembers ? 1 : 0,
                        transition: `all 0.5s ease ${index * 0.1}s`
                      }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.memberName[0]}
                      </div>
                      <span className="font-medium text-gray-700">{member.memberName}</span>
                      {leaderboard.some(entry => entry.name === member.memberName) && (
                        <div className="ml-auto">
                          <Zap className="w-4 h-4 text-yellow-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Close Room */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Room Controls</h3>
              <button
                onClick={() => setShowCloseConfirm(true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl transition-colors font-semibold"
              >
                Close Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Picture-in-Picture Mode */}
      {showMiniMode && (
        <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 z-50 border">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-gray-800">Room: {roomId}</div>
              <div className="text-xs text-gray-500">Host: {hostName}</div>
            </div>
            <button
              onClick={() => setShowMiniMode(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Close Room Confirmation */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Close Room</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to close the room? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCloseConfirm(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-xl transition-colors"
              >
                No
              </button>
              <button
                onClick={closeRoom}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl transition-colors"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-xl shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default HostLeaderboard;