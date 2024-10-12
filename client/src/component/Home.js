import React from 'react';
import '../styles/Home.css'
import { useNavigate } from 'react-router-dom';

const Home = () => {

  let navigate=useNavigate();
  const handleCreateRoomHandle=(e)=>{
    e.preventDefault();
    navigate('/host');
  }
  return (
    <>
    <div className="btn-container">

      
        <button onClick={handleCreateRoomHandle} className="btn">Create Room</button>
     
        <button className="btn">Join Room</button>
      </div>
    
    </>
  )
}

export default Home
