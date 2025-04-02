import React, { useContext, useEffect, useState, useCallback } from 'react';
import '../styles/Member.css';
import { UseStateVariableContext } from '../context/useStateVariables';
import { EnvVariableContext } from '../context/envVariables';
import LeaderboardComponent from './LeaderboardComponent';

const Member = () => {
    const { socket } = useContext(EnvVariableContext) || {};
    const { isdisable, ROOMID, NAME ,timeMappingList, setTimeMappingList} = useContext(UseStateVariableContext);
    

    const buzzerClick = (e) => {
        e.preventDefault();
        socket?.emit('clicked-time', ROOMID, NAME);
    };

    const handlePressInfo = useCallback((memname, time) => {

        socket.emit('update-host',timeMappingList);
        setTimeMappingList((prevList) => {
            const newPosition = prevList.length + 1; 
            return [...prevList, { pos: newPosition, name: memname,clickedtime:time, time: prevList.length === 0 ? 0 : time - prevList[0].clickedtime }];
        });

    }, []);

    useEffect(() => {

        socket.off("press-info").on("press-info", handlePressInfo);

        return () => {
            socket.off("press-info");
        };
    }, [socket, handlePressInfo]);

    return (
        <div className="room-member-dashboard">
            <p style={{ color: "#9ef01a", fontSize: "3rem", textAlign: "center", marginTop: "1.5rem" }} id="join-name"></p>

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
                <button id="leave" className="reset">Leave Room</button>
            </div>
        </div>
    );
};

export default Member;
