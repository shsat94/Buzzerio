import React from 'react'

const LeaderboardComponent = (props) => {


  return (
    <>
      <tr style={{color:"white"}} >
        <th>{props.timemap.name}</th>
        <th>+{props.timemap.time}</th>
        <th>{props.timemap.pos}</th>
      </tr>
    </>
  )
}

export default LeaderboardComponent