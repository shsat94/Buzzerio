import React, { useContext } from 'react';
import '../styles/Home.css'
import { useNavigate } from 'react-router-dom';

import { useRoomActions } from '../controllers/room';
import { UseStateVariableContext } from '../context/useStateVariables';


const Home = () => {


  let navigate = useNavigate();

  const { seterrorflag } = useContext(UseStateVariableContext);
  const { createRoom } = useRoomActions();
 


  const handleCreateRoomHandle = async (e) => {
    e.preventDefault();
    try {
      createRoom();
      navigate("/host");
    } catch (error) { 
      seterrorflag(500);
    }
  };
  const handleJoinRoomHandle = async (e) => {
    try {
      e.preventDefault();
      navigate('/memberinfo');
    } catch (error) {
      seterrorflag(500);
    }
  }
  return (
    <>
      <div className="btn-container">


        <button onClick={handleCreateRoomHandle} className="btn">Create Room</button>

        <button onClick={handleJoinRoomHandle} className="btn">Join Room</button>
      </div>

    </>
  )
}

export default Home
