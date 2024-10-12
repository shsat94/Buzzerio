import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
    const [Pass, setPass] = useState('password');
    // const [samepassword,setsamepassword]=useState(false);
    const passwordVisibility = () => {
        if (Pass === 'password') {
            setPass('text');
        }
        else {
            setPass('password');
        }

    }


    return (
        <>
            <div className="container" style={{ marginTop: '3rem', maxWidth: '40rem', backgroundColor: '#000', padding: '2rem', borderRadius: '1rem', boxShadow: ' 1rem 1rem 2.6rem green', border: '2px solid white', color: 'white' }}>
                <form >
                    <div className="contain">
                        <div className="mb-3">
                            <label htmlFor="fname" className="form-label">Enter First Name</label>
                            <input type="name" className="form-control" id="fname" aria-describedby="emailHelp" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lname" className="form-label">Enter Last Name</label>
                            <input type="name" className="form-control" id="lname" aria-describedby="emailHelp" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} />
                        </div>
                    </div>
                    <div className="contain">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Enter Email</label>
                            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mobileno" className="form-label">Enter Mobile Number</label>
                            <input type="text" className="form-control" id="mobileno" aria-describedby="emailHelp" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} />
                        </div>
                    </div>
                    <div className="contain">
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Enter Password</label>
                            <input type='password' className="form-control" id="password" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                            <input type={`${Pass}`} className="form-control" id="cpassword" style={{ backgroundColor: 'black', border: '1px solid white', color: 'white' }} />
                            <input type="checkbox" onClick={passwordVisibility} style={{ marginTop: '0.4rem', }} /> <span className='mx-1'>Show Password</span>
                        </div>
                    </div>


                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button type="submit" className="btn" style={{ marginTop: '1rem', backgroundColor: '#90B494', boxShadow: '0 0 0.3rem black', color: 'black', borderRadius: '1rem', minWidth: '10rem', maxHeight: '2.5rem' }}>Signup</button>
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
