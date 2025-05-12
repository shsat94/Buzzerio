import Navbar from "./component/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from './component/Signup/Signup';
import OtpVerification from './component/OtpVerification';
import NameAndPassword from './component/Signup/NameAndPassword';
import Login from './component/Login';
import AvailableRooms from "./component/Rooms";


function App() {


  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/signup' element={<Signup />}></Route>
          <Route exact path='/verifyotp' element={<OtpVerification />}></Route>
          <Route exact path='/name' element={<NameAndPassword />}></Route>
          <Route exact path='/login' element={<Login />}></Route>
          <Route exact path='/rooms' element={<AvailableRooms />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
