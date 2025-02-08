import React, { useContext } from 'react';
import '../styles/Home.css'
import { useNavigate } from 'react-router-dom';

import { useRoomActions } from '../controllers/room';
import { UseStateVariableContext } from '../context/useStateVariables';


const Home = () => {
  

  let navigate = useNavigate();
 
  const {seterrorflag}=useContext(UseStateVariableContext);
  const { createRoom } = useRoomActions();



  const handleCreateRoomHandle = async(e) => {
    try {
      e.preventDefault();
      const response=createRoom();
      if (response.execution!==true){
        seterrorflag(500);
        return;
      }
      //yaha pe se shuru krna hai new context bna kr 
      

      
      navigate('/host');
    } catch (error) {

    }
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
