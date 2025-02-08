import React from 'react';
import '../styles/Host.css';


const Host = () => {

  
 


  return (
    <>
      <div className="room-creator-dashboard">
        <h1 className="host">HOST DASHBOARD</h1>
        <div className="details">
        <p style={{ color: '#9ef01a', fontSize: '1.5rem' }} id="hostN">Room Name = <strong> r98g</strong></p>
        <p style={{ color: '#9ef01a', fontSize: '1.5rem' }} id="roomI">RoomId = <strong> r98g</strong></p>
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
                {/* data */}
              </tbody>
            </table>
          </div>
          <div className="memberlist">
            <p style={{ color: '#9ef01a' }}>Name</p>
          </div>
        </div>

      </div>
    </>
  )
}

export default Host
