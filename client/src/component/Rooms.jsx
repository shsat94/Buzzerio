import { useState, useEffect, useContext } from 'react';
import { X, Users, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import { useStateVariable } from '../contextApi/StateVariables';
import { useLoading } from '../contextApi/Load';

// Assuming you have a context for rooms and socket
const AvailableRooms = () => {
  // State for rooms data 
  const [rooms, setRooms] = useState([]); 
  const { setIsLoading } = useLoading();
  const [error, setError] = useState(null);
  const {cpRooms}=useStateVariable();
  
  // States for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  
  // States for actions in progress
  const [deletingRoom, setDeletingRoom] = useState(false);
  const [joiningRoom, setJoiningRoom] = useState(false);

  useEffect(() => {
    // Simulate fetching rooms
    setTimeout(() => {
      console.log(cpRooms);
        let upcommingRooms=[]
        cpRooms.forEach(room => {
            upcommingRooms.push({id:room.roomId,memberCount:room.members.length - 1})
        });
      setRooms(upcommingRooms);
      setIsLoading(false);
    }, 1000);
  }, [cpRooms]);

  // Handle join room confirmation
  const handleJoinRoom = () => {
    setJoiningRoom(true);
    
    try {
      console.log("Emitting socket event: host-rejoin-room", selectedRoomId);
      
      setTimeout(() => {
        setJoiningRoom(false);
        setShowJoinModal(false);
      }, 1000);
    } catch (err) {
      setError("Failed to join room");
      setJoiningRoom(false);
    }
  };

  // Handle delete room confirmation
  const handleDeleteRoom = async () => {
    setDeletingRoom(true);
    
    try {
      const apiKey = "your-api-key"; 
      const authToken = localStorage.getItem("token");
      
      // Make API call to delete room
      const response = await fetch(`/${apiKey}/host/deleteroom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken
        },
        body: JSON.stringify({ roomId: selectedRoomId })
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete room");
      }
      // Update room list by removing the deleted room
      setRooms(rooms.filter(room => room.id !== selectedRoomId));
      setShowDeleteModal(false);
    } catch (err) {
      setError(`Error deleting room: ${err.message}`);
    } finally {
      setDeletingRoom(false);
    }
  };

  // Show delete confirmation modal
  const openDeleteModal = (roomId) => {
    setSelectedRoomId(roomId);
    setShowDeleteModal(true);
  };

  // Show join confirmation modal
  const openJoinModal = (roomId) => {
    setSelectedRoomId(roomId);
    setShowJoinModal(true);
  };

  // Close all modals
  const closeModals = () => {
    setShowDeleteModal(false);
    setShowJoinModal(false);
    setSelectedRoomId(null);
  };

  return (
    <div className="min-h-screen  pt-20 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8 overflow-x-hidden ">
      <div className="relative w-full h-full">
        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-xl"></div>
        
        <div className="w-full overflow-y-auto pr-4 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {rooms.length === 0 ? (
            <div className="p-8 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-500 font-medium">No available rooms found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
              {rooms.map((room,index) => (
                <RoomCard 
                  key={index}
                  roomId={room.id}
                  memberCount={room.memberCount}
                  onJoin={() => openJoinModal(room.id)}
                  onDelete={() => openDeleteModal(room.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Delete Room Modal */}
        {showDeleteModal && (
          <Modal onClose={closeModals}>
            <div className="p-6 max-w-sm mx-auto bg-white rounded-lg">
              <h3 className="text-xl font-bold text-red-600 mb-4">Delete Room</h3>
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete room <span className="font-mono font-semibold">{selectedRoomId}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 font-medium"
                  onClick={closeModals}
                  disabled={deletingRoom}
                >
                  No, Cancel
                </button>
                <button
                  className="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-lg flex items-center shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                  onClick={handleDeleteRoom}
                  disabled={deletingRoom}
                >
                  {deletingRoom ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Join Room Modal */}
        {showJoinModal && (
          <Modal onClose={closeModals}>
            <div className="p-6 max-w-sm mx-auto bg-white rounded-lg">
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Rejoin Room</h3>
              <p className="mb-6 text-gray-700">
                Do you want to rejoin room <span className="font-mono font-semibold">{selectedRoomId}</span>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 font-medium"
                  onClick={closeModals}
                  disabled={joiningRoom}
                >
                  No, Cancel
                </button>
                <button
                  className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg flex items-center shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                  onClick={handleJoinRoom}
                  disabled={joiningRoom}
                >
                  {joiningRoom ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Yes, Join
                    </>
                  )}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

// Room Card Component
const RoomCard = ({ roomId, memberCount, onJoin, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-2">
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="font-mono font-medium text-gray-800 truncate" title={roomId}>
            {roomId}
          </h3>
          <div className="flex items-center text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            <span className="text-sm">{memberCount}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 flex justify-between">
        <button 
          onClick={onJoin}
          className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg flex items-center transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
        >
          <ArrowRight className="w-4 h-4 mr-1" />
          Rejoin Room
        </button>
        
        <button 
          onClick={onDelete}
          className="px-3 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg flex items-center transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete Room
        </button>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ children, onClose }) => {
  // Close on escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />
        
        {/* Modal content */}
        <div className="relative bg-white rounded-xl shadow-2xl transform transition-all duration-500 animate-[fade-in-down_0.5s_ease-out]">
          <button 
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-300"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

// Global styles for custom scrollbar
const GlobalStyles = () => (
  <style jsx global>{`
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(107, 114, 128, 0.3) transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
      background-color: transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(107, 114, 128, 0.3);
      border-radius: 4px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background-color: transparent;
    }
  `}</style>
);

export default AvailableRooms;