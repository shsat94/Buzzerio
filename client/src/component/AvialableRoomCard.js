import React from 'react';
import '../styles/AvailableRoomCard.css';

const AvailableRoomCard = ({ roomId, totalMembers, onJoin, onClose }) => {
  return (
    <div className="available-room-card">
      <div className="room-details">
        <h2 className="room-id">Room ID: {roomId}</h2>
        <p className="members">Total Members: {totalMembers}</p>
      </div>
      <div className="btn-group">
        <button className="join-btn" onClick={() => onJoin(roomId)}>
          Join Room
        </button>
        <button className="close-btn" onClick={() => onClose(roomId)}>
          Close Room
        </button>
      </div>
    </div>
  );
};

export default AvailableRoomCard;
