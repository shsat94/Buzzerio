import React, { useContext } from 'react';
import '../styles/Home.css'
import { useNavigate } from 'react-router-dom';
import { disconnectSocket, initiateConnection } from '../services/socketService';
import { ApiCallContext } from '../context/apiCalls';
import { UseStateVariableContext } from '../context/useStateVariables';


const Home = () => {
  

  let navigate = useNavigate();
  const {createRoom}=useContext(ApiCallContext);
  const {seterrorflag}=useContext(UseStateVariableContext);



  const handleCreateRoomHandle = async(e) => {
    try {
      e.preventDefault();
      const response=createRoom();
      if (response.execution!==true){
        seterrorflag(500);
        return;
      }
      //yaha pe se shuru krna hai new context bna kr 
      

      useEffect(() => {
        initiateConnection();
        return () => {
          disconnectSocket();
        };
      }, []);
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
