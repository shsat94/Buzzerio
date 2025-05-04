import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../styles/Member.css';
import { UseStateVariableContext } from '../context/useStateVariables';
import { EnvVariableContext } from '../context/envVariables';
import LeaderboardComponent from './LeaderboardComponent';
import { useNavigate } from 'react-router-dom';

const Member = () => {
    const { socket } = useContext(EnvVariableContext) || {};
    const { isdisable, ROOMID, NAME } = useContext(UseStateVariableContext);
    const [timeMappingList, setTimeMappingList] = useState([]);
    const navigate = useNavigate();

    const buzzerClick = (e) => {
        e.preventDefault();
        socket?.emit('clicked-time', ROOMID, NAME);
    };

    const handlePressInfo = useCallback((memname, time) => {
        setTimeMappingList((prevList) => {
            const newPosition = prevList.length + 1;
            const newList = [
                ...prevList,
                {
                    pos: newPosition,
                    name: memname,
                    clickedtime: time,
                    time: prevList.length === 0 ? 0 : time - prevList[0].clickedtime
                }
            ];
            socket.emit('update-host', newList);
            return newList;
        });
    }, [socket]);

    const handleResetLeaderboard = useCallback(() => {
        setTimeMappingList([]);
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.off("press-info").on("press-info", handlePressInfo);
        socket.off("reset-leaderboard").on("reset-leaderboard", handleResetLeaderboard);

        return () => {
            socket.off("press-info", handlePressInfo);
            socket.off("reset-leaderboard", handleResetLeaderboard);
        };
    }, [socket, handlePressInfo, handleResetLeaderboard]);

    const leaveRoom = () => {
        const decision=window.confirm("Are you want to leave?");
        if(decision){
            navigate("/");
            socket?.emit('leave-room',localStorage.getItem('token'), ROOMID);
        }
    };

    return (
        <div className="room-member-dashboard">
            <p style={{ color: "#9ef01a", fontSize: "3rem", textAlign: "center", marginTop: "1.5rem" }}>
                {NAME}
            </p>

            <div className="flex-container">
                <div className="buzzer-container">
                    <button onClick={buzzerClick} disabled={isdisable} className="buzzer-button">
                        <div className="buzzer-button-inner"></div>
                        <div className="buzzer-text">Buzz</div>
                    </button>
                </div>

                <div className="join-leaderboard">
                    <h2>Leaderboard</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Time (in sec)</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody className="join-leaderboard-body">
                            {timeMappingList.map((timemap, index) => (
                                <LeaderboardComponent key={index} timemap={timemap} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="btns">
                <button id="leave" className="reset" onClick={leaveRoom}>Leave Room</button>
            </div>
        </div>
    );
};

export default Member;
