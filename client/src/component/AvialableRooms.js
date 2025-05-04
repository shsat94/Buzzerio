import React, { useContext } from 'react'
import AvialableRoomCard from './AvialableRoomCard'
import { UseStateVariableContext } from '../context/useStateVariables';
import { useNavigate } from 'react-router-dom';
import { EnvVariableContext } from '../context/envVariables';

const AvialableRooms = () => {
  const { rooms, seterrorflag,setRooms } = useContext(UseStateVariableContext);
  const { socket, apiKey, host } = useContext(EnvVariableContext) || {};

  const navigate = useNavigate();
  const handleJoin = (roomId) => {
    socket.emit("host-rejoin-room", roomId);
    navigate('/host');
  }
  const handleClose = async (roomId) => {
    try {
      const res = await fetch(`${host}/${apiKey}/host/deleteroom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({ roomId: roomId })
      });
      const response = await res.json();
      if (response.execution) {
        setRooms(response.room)
      }
      else {
        seterrorflag(500);
      }

    } catch (error) {
      seterrorflag(500);
    }
  }

  return (
    <>
      <div style={{ padding: '1rem', background: '#111827' }}>
        {rooms.map((room, index) => {
          return <AvialableRoomCard key={index} roomId={room.roomId} totalMembers={room.members.length - 1} onJoin={handleJoin} onClose={handleClose} />
        })}

      </div>
    </>
  )
}

export default AvialableRooms