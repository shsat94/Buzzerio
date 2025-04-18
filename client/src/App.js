import { BrowserRouter, Route, Routes } from "react-router-dom";


import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Contactus from "./component/Contactus";
import Aboutus from "./component/Aboutus";
import Host from "./component/Host";
import Login from "./component/Login";
import Signup from "./component/Signup";
import AvialableRooms from "./component/AvialableRooms";
import Profile from "./component/Profile";
import Member from "./component/Member";
import MemberInfo from "./component/MemberInfo";

import ServerErrorPage from "./errorpages/ServerErrorPage";
import { useContext } from "react";
import { UseStateVariableContext } from "./context/useStateVariables";




function App() {
  const context = useContext(UseStateVariableContext);
  document.body.style.backgroundColor = 'black';
  if (context.errorflag === 500) {
    return (
      <>
        <ServerErrorPage />
      </>
    );
  }
  else {
    return (
      <>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home />}></Route>
            <Route exact path='/contactus' element={<Contactus />}></Route>
            <Route exact path='/aboutus' element={<Aboutus />}></Route>
            <Route exact path='/host' element={<Host />}></Route>
            <Route exact path='/login' element={<Login />}></Route>
            <Route exact path='/signup' element={<Signup />}></Route>
            <Route exact path='/avialableroom' element={<AvialableRooms />}></Route>
            <Route exact path='/profile' element={<Profile/>}></Route>
            <Route exact path='/memberinfo' element={<MemberInfo/>}></Route>
            <Route exact path='/member' element={<Member/>}></Route>
          </Routes>
        </BrowserRouter>
      </>
    );
  }

}

export default App;
