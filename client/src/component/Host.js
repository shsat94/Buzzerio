import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../styles/Host.css';
import { EnvVariableContext } from '../context/envVariables';
import { useNavigate } from 'react-router-dom';
import HostLeaderboardComponent from './HostLeaderboardComponent';


const Host = () => {
  const { socket } = useContext(EnvVariableContext) || {};
  const [hostName, setHostName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [memberlist, setMemberlist] = useState([]);
  const [timeList, setlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;
    const handleRoomInfo = (hostname, roomid) => {

      setHostName(hostname);
      setRoomId(roomid);
    };
    const handleBeforeUnload = (event) => {
      event.preventDefault();

    };
    const handleAfterUnload = (event) => {
      event.preventDefault();
      navigate('/');
    };


    socket.on('update-host-leader',(timemaplist)=>{
      setlist(timemaplist);
    })

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("load", handleAfterUnload);
    socket.on("member-details", (allmembers) => {
      setMemberlist(allmembers);
    })
    socket.on("creator-room-info", handleRoomInfo);
  }, [socket, navigate]);

  return (
    <>
      <div className="room-creator-dashboard">
        <h1 className="host">HOST DASHBOARD</h1>
        <div className="details">
          <p style={{ color: '#9ef01a', fontSize: '1.5rem' }} id="hostN">Host Name = <strong> {hostName}</strong></p>
          <p style={{ color: '#9ef01a', fontSize: '1.5rem' }} id="roomI">RoomId = <strong> {roomId}</strong></p>
        </div>
        <div className="dashboard">
          <div className="leaderboard">
            <table className="player" style={{ width: '100%' }}>
              <thead>
                <tr className="head">
                  <th style={{ width: '30%' }}>Name</th>
                  <th style={{ width: '40%' }}>Time(in millisec)</th>
                  <th>Position</th>
                </tr>

              </thead>
              <tbody className="player-data">
                {timeList.map((timemap, index) => (
                  <HostLeaderboardComponent key={index} timemap={timemap} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="memberlist">
            <p style={{ color: '#9ef01a' }}>Name</p>
            {memberlist.map((members, index) => {
              return <p key={index} style={{ color: '#9ef01a' }}>{members}</p>
            })}
          </div>
        </div>

      </div>
    </>
  )
}

export default Host
