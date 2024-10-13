import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Signup.css';
import { EnvVariableContext } from '../context/envVariables';
import { UseStateVariableContext } from '../context/useStateVariables';

const Signup = () => {
    const [Pass, setPass] = useState('password');
    const [checkDetailFlag,setCheckDetailFlag]=useState(false);
    const [credentials, setCreadentials] = useState({ fname: '', lname: '', email: '', mobileno: '', password: '', cpassword: '' });
    const { apiKey, host } = useContext(EnvVariableContext);
    const {seterrorflag}=useContext(UseStateVariableContext);
    const navigate=useNavigate();
    const passwordVisibility = () => {
        if (Pass === 'password') {
            setPass('text');
        }
        else {
            setPass('password');
        }

    };
    
    const checkDetails=()=>{
        if(credentials.mobileno.length===10 && credentials.fname!=='' && credentials.email!=='' && credentials.password!=='' && credentials.cpassword!==''){
            setCheckDetailFlag(true);
        }
        else{
            setCheckDetailFlag(false);
        }
    };
    const onChange = (e) => {
        setCreadentials({ ...credentials, [e.target.name]: e.target.value });
        checkDetails();
    };
    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if(credentials.password!==credentials.cpassword){
                return alert('password and confirm password should be same');
            }
            if(!checkDetailFlag){
                return alert('Credentails should be according to format');
            }
            
            const name = credentials.fname + ' ' + credentials.lname;
            const res = await fetch(`${host}/${apiKey}/authentication/signup`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ name: name, email: credentials.email, mobileNo: credentials.mobileno, password: credentials.password })
            });
            const response = await res.json();
            if(response.userisPresent){
                seterrorflag(200);
                alert('User is already present');
                return;
            }
            if(response.execution){
                localStorage.setItem('token',response.authenticationToken);
                seterrorflag(200);
                navigate('/');
            }
            else {
                seterrorflag(500);
            }

        } catch (error) {
            seterrorflag(500);
        }
    }


    return (
        <>
            <div className="container" style={{ marginTop: '3rem', maxWidth: '40rem', backgroundColor: '#000', padding: '2rem', borderRadius: '1rem', boxShadow: ' 1rem 1rem 2.6rem green', border: '2px solid white', color: 'white' }}>
                <form >
                    <div className="contain">
                        <div className="mb-3">
                            <label htmlFor="fname" className="form-label">Enter First Name</label>
                            <input type="name" className="form-control" id="fname" aria-describedby="emailHelp" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} name='fname' onChange={onChange} value={credentials.fname}  required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lname" className="form-label">Enter Last Name</label>
                            <input type="name" className="form-control" id="lname" aria-describedby="emailHelp" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} name='lname' onChange={onChange} value={credentials.lname} required />
                        </div>
                    </div>
                    <div className="contain">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Enter Email</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} name='email' onChange={onChange} value={credentials.email}  required/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mobileno" className="form-label">Enter Mobile Number</label>
                            <input type="text" className="form-control" id="mobileno" aria-describedby="emailHelp" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} name='mobileno' onChange={onChange} value={credentials.mobileno} required />
                        </div>
                    </div>
                    <div className="contain">
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Enter Password</label>
                            <input type='password' className="form-control" id="password" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} name='password' onChange={onChange} value={credentials.password} required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                            <input type={`${Pass}`} className="form-control" id="cpassword" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} name='cpassword' onChange={onChange} value={credentials.cpassword} required />
                            <input type="checkbox" onClick={passwordVisibility} style={{ marginTop: '0.4rem', }} /> <span className='mx-1'>Show Password</span>
                        </div>
                    </div>


                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" className="btn" style={{ marginTop: '1rem', backgroundColor: '#90B494', boxShadow: '0 0 0.3rem black', color: 'black', borderRadius: '1rem', minWidth: '10rem', maxHeight: '2.5rem' }} onClick={handleSubmit}>Signup</button>
                    </div>
                    <div className="my-2 form-label" style={{ textAlign: 'center' }}>
                        Already have an account?<Link to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Signup
