import React from 'react';
import '../styles/Host.css';

const HostLeaderboardComponent = (props) => {
    console.log(props.timemap);
    return (
        <>
            <tr style={{color:"white"}} className="head">
                <th style={{ width: '30%' }}>{props.timemap.name}</th>
                <th style={{ width: '40%' }}>+{props.timemap.time}</th>
                <th>{props.timemap.pos}</th>
            </tr>
        </>
    )
}

export default HostLeaderboardComponent