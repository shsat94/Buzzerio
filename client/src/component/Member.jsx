import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { 
  Zap, 
  Trophy, 
  LogOut, 
  Crown, 
  Medal, 
  Timer,
  Users,
  Wifi,
  WifiOff,
  X,
  CheckCircle
} from 'lucide-react';
import { useLoading } from '../contextApi/Load';
import { useStateVariable } from '../contextApi/StateVariables';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useAlert } from '../contextApi/Alert';
import { useNavigate } from 'react-router-dom';
import { checkIsGuest, deleteGuestUser } from '../controller/MemberController';

const BuzzerMemberPage = () => {
  const [roomId, setRoomId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [buzzerClicked, setBuzzerClicked] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [connected, setConnected] = useState(true);
  const [clickTime, setClickTime] = useState(null);
  const [ripples, setRipples] = useState([]);
  const buzzerRef = useRef(null);
  const audioRef = useRef(null);
  const { setIsLoading } = useLoading();
  const { cpRoomId, setCpRoomId, cpName, setCpName } = useStateVariable();
  const { socket ,host, apiKey } = useContext(EnvVariableContext);
  const { PopAlert, closeAlert } = useAlert();
  const navigate=useNavigate();

  // Set loading to false on mount
  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // Set room ID and member name from context
  useEffect(() => {
    setRoomId(cpRoomId);
    setMemberName(cpName);
  }, [cpRoomId, cpName]);

  // Socket connection monitoring
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial connection state
    setConnected(socket.connected);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [socket]);

  // Handle socket events
  useEffect(() => {
    if (!socket) return;

    const handlePressInfo = (memname, time) => {
      ('Received press-info:', memname, time);
      setLeaderboard((prevList) => {
        const newPosition = prevList.length + 1;
        const newEntry = {
          pos: newPosition,
          name: memname,
          clickedtime: time,
          time: prevList.length === 0 ? 0 : time - prevList[0].clickedtime,
          isMe: memname === memberName
        };
        const newList = [...prevList, newEntry];
        
        // Emit update to host
        socket.emit('update-host', newList);
        return newList;
      });
    };

    const handleResetLeaderboard = () => {
      ('Received reset-leaderboard event');
      setBuzzerClicked(false);
      setLeaderboard([]);
      setClickTime(null);
      setRipples([]);
    };

    // Listen for socket events
    socket.on("press-info", handlePressInfo);
    socket.on("reset-leaderboard", handleResetLeaderboard);

    // Cleanup function
    return () => {
      socket.off("press-info", handlePressInfo);
      socket.off("reset-leaderboard", handleResetLeaderboard);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;


    const handleResetLeaderboard = () => {
      ('Received reset-leaderboard event');
      setBuzzerClicked(false);
      setLeaderboard([]);
      setClickTime(null);
      setRipples([]);
    };

    socket.on("reset-leaderboard", handleResetLeaderboard);

    // Cleanup function
    return () => {
      socket.off("reset-leaderboard", handleResetLeaderboard);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const action=()=>{
      navigate('/home');
    }


    const handleClosedRoom = () => {
      closeAlert();
      PopAlert('error', "This room has been closed.", action, "Go to homepage");
      navigate('/home');
    };

    socket.on("room-deleted", handleClosedRoom);

    // Cleanup function
    return () => {
      socket.off("room-deleted", handleClosedRoom);
    };
  }, [socket]);

  // Handle buzzer click
  const handleBuzzerClick = (e) => {
    if (buzzerClicked || !connected || !socket) return;

    const rect = buzzerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create ripple effect
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    // Get current timestamp for click time
    const currentTime = Date.now();
    setClickTime(currentTime);
    setBuzzerClicked(true);

    // Emit socket event
    ('Emitting clicked-time:', roomId, memberName);
    socket.emit('clicked-time', roomId, memberName);
    
    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  // Handle leave room
  const handleLeaveRoom = async() => {

    if(await checkIsGuest(host,apiKey)){
      await deleteGuestUser(host,apiKey);
      localStorage.removeItem('token');
      socket.emit('leave-room',localStorage.getItem('token'), roomId);
      navigate('/');
      return;
    }
      socket.emit('leave-room',localStorage.getItem('token'), roomId);
      
    setShowLeaveModal(false);
    // Navigate away or handle leaving
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

  const getPositionColor = (position) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default: return 'bg-gradient-to-r from-indigo-400 to-indigo-600';
    }
  };

  const formatTime = (time) => {
    if (typeof time === 'number') {
      return time > 1000 ? `${(time / 1000).toFixed(3)}s` : `+${time}ms`;
    }
    return `${time}ms`;
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-5 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-yellow-300 opacity-5 rounded-full animate-bounce" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-green-300 opacity-5 rounded-full animate-ping" style={{ animationDuration: '6s' }}></div>
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white opacity-20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Buzzer Challenge</h1>
                <p className="text-gray-600">
                  Welcome, <span className="font-semibold text-purple-600">
                    {memberName || 'Loading...'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {connected ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-red-600'}`}>
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <div className="bg-gray-100 rounded-xl px-4 py-2">
                <span className="text-sm font-medium text-gray-600">Room:</span>
                <span className="font-mono font-bold text-purple-600 ml-2">
                  {roomId || 'Loading...'}
                </span>
              </div>
              
              <button
                onClick={() => setShowLeaveModal(true)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                Leave
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Buzzer Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Ready to Buzz?</h2>
              
              {/* Buzzer Button */}
              <div className="relative flex justify-center mb-8">
                <div
                  ref={buzzerRef}
                  onClick={handleBuzzerClick}
                  className={`relative w-64 h-64 rounded-full cursor-pointer transition-all duration-500 ${
                    buzzerClicked 
                      ? 'bg-gray-300 opacity-50 scale-95' 
                      : connected
                        ? 'bg-gradient-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 shadow-2xl hover:shadow-red-500/25 hover:scale-105'
                        : 'bg-gray-400 opacity-50 cursor-not-allowed'
                  } flex items-center justify-center overflow-hidden`}
                  style={{
                    boxShadow: !buzzerClicked && connected ? '0 0 50px rgba(239, 68, 68, 0.3)' : 'none',
                    animation: !buzzerClicked && connected ? 'pulse 2s infinite' : 'none'
                  }}
                >
                  {/* Ripple Effects */}
                  {ripples.map(ripple => (
                    <div
                      key={ripple.id}
                      className="absolute bg-white/30 rounded-full pointer-events-none"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '20px',
                        height: '20px',
                        transform: 'translate(-50%, -50%)',
                        animation: 'ripple 0.6s ease-out'
                      }}
                    />
                  ))}
                  
                  {/* Button Content */}
                  <div className="flex flex-col items-center">
                    {buzzerClicked ? (
                      <CheckCircle className="w-16 h-16 text-green-600 mb-2" />
                    ) : (
                      <Zap className="w-16 h-16 text-white mb-2" />
                    )}
                    <span className={`text-2xl font-bold ${buzzerClicked ? 'text-green-600' : 'text-white'}`}>
                      {buzzerClicked ? 'BUZZED!' : 'BUZZ'}
                    </span>
                    {clickTime && (
                      <span className="text-sm text-green-600 font-medium mt-1">
                        {new Date(clickTime).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  
                  {!buzzerClicked && connected && (
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
                  )}
                </div>
              </div>
              
              {/* Status Messages */}
              <div className="text-center">
                {!connected && (
                  <p className="text-red-600 font-medium mb-4">
                    Connection lost. Reconnecting...
                  </p>
                )}
                {buzzerClicked ? (
                  <p className="text-green-600 font-medium">
                    Great! You've buzzed in. Wait for the host to reset for the next round.
                  </p>
                ) : (
                  <p className="text-gray-600">
                    Be the first to press the buzzer when ready!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-bold text-gray-800">Leaderboard</h3>
              </div>
              
              <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
                <div className="space-y-3">
                  {leaderboard.length === 0 ? (
                    <div className="text-center py-8">
                      <Timer className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No entries yet...</p>
                    </div>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <div
                        key={entry.clickedtime || index}
                        className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-500 ${
                          entry.isMe || entry.name === memberName
                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        style={{
                          transform: 'translateY(0px)',
                          opacity: 1,
                          animation: `slideInUp 0.5s ease ${index * 0.1}s both`
                        }}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPositionColor(entry.pos || index + 1)}`}>
                          {getPositionIcon(entry.pos || index + 1)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold truncate ${
                            entry.isMe || entry.name === memberName ? 'text-purple-800' : 'text-gray-800'
                          }`}>
                            {entry.name}
                            {(entry.isMe || entry.name === memberName) && (
                              <span className="text-purple-600 ml-1">(You)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatTime(entry.time)}
                          </div>
                        </div>
                        
                        {(entry.isMe || entry.name === memberName) && (
                          <div className="flex items-center gap-1 text-purple-600">
                            <Zap className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Room Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            style={{ animation: 'modalSlideIn 0.3s ease' }}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Leave Room?</h3>
              <p className="text-gray-600">Are you sure you want to leave this buzzer room?</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveRoom}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-xl transition-colors font-medium"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes ripple {
          to {
            transform: translate(-50%, -50%) scale(20);
            opacity: 0;
          }
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0px);
            opacity: 1;
          }
        }
        
        @keyframes modalSlideIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 50px rgba(239, 68, 68, 0.3);
          }
          50% {
            box-shadow: 0 0 80px rgba(239, 68, 68, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

export default BuzzerMemberPage;