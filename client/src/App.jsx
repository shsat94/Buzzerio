import Navbar from "./component/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signup from './component/Signup/Signup';
import OtpVerification from './component/OtpVerification';
import NameAndPassword from './component/Signup/NameAndPassword';
import Login from './component/Login';
import AvailableRooms from "./component/Rooms";
import BuzzerHomepage from "./component/Home";
import HostLeaderboard from "./component/Host";
import BuzzerMemberPage from "./component/Member";
import LandingPage from "./component/LandingPage";
import ForgotPassword from "./component/ForgotPassword";
import SetNewPassword from "./component/PasswordReset";


function App() {
  return (
    <>
    
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<LandingPage/>}></Route>
          <Route exact path='/signup' element={<Signup />}></Route>
          <Route exact path='/home' element={<BuzzerHomepage/>}></Route>
          <Route exact path='/verifyotp' element={<OtpVerification />}></Route>
          <Route exact path='/name' element={<NameAndPassword />}></Route>
          <Route exact path='/login' element={<Login />}></Route>
          <Route exact path='/rooms' element={<AvailableRooms />}></Route>
          <Route exact path='/host' element={<HostLeaderboard />}></Route>
          <Route exact path='/member' element={<BuzzerMemberPage />}></Route>
          <Route exact path='/forgotpassword' element={<ForgotPassword />}></Route>
          <Route exact path='/resetpassword' element={<SetNewPassword />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
