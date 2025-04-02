import React, { useContext, useEffect, useState } from 'react';
import '../styles/MemberInfo.css';
import { EnvVariableContext } from '../context/envVariables';
import { UseStateVariableContext } from '../context/useStateVariables';
import { useNavigate } from 'react-router-dom';

const MemberInfo = () => {
  const navigate = useNavigate();
  const { socket } = useContext(EnvVariableContext) || {};
  const { setROOMID,setNAME } = useContext(UseStateVariableContext) || {};
  const [roomID, setRoomID] = useState("");

  const onChange = (e) => {
    setRoomID(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!socket) {

      return;
    }
    socket.emit("join-room", roomID, localStorage.getItem('token'));
  };



  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();

    };
    const handleAfterUnload = (event) => {
      event.preventDefault();
      navigate('/');
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("load", handleAfterUnload);


    const throwAlert = () => {
      alert("Invalid room");
    };


    if (!socket) return;
    socket.on("not-found", throwAlert);
    socket.on('room-joined', (roomid,memName) => {
      setROOMID(roomid);
      setNAME(memName)
      navigate('/member');
    });
  }, [socket, navigate, setROOMID,setNAME]);

  return (
    <>
      <div className="joinroom">
        <div className="room">
          <label className="label" htmlFor="roomid">Enter the roomId</label>
          <input
            required
            type="text"
            className="input"
            name="roomID"
            id="roomid"
            onChange={onChange}
            value={roomID}
          />
          <div className="btn-fix">
            <button type="submit" id="submit-join-room" onClick={handleSubmit} className="submit">
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberInfo;
