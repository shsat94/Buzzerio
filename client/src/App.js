import Navbar from "./component/Navbar";
import Home from "./component/Home";
import Contactus from "./component/Contactus";
import Aboutus from "./component/Aboutus";
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  document.body.style.backgroundColor = 'black';
  return (
    <>
      <BrowserRouter>
        <Navbar />       
        <Routes>
          <Route exact path='/home' element={<Home/>}></Route>
          <Route exact path='/contactus' element={<Contactus/>}></Route>
          <Route exact path='/aboutus' element={<Aboutus/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
