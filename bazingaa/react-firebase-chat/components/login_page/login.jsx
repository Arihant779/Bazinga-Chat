import React from 'react';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css"
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../database/firebase';
import {allUsers} from '../../database/curruser'

const Login = () => {
  const user=false;
  const {curruser, userinfo}=allUsers()
  const[wait,setwait]=useState(true);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/chat'); 
  };
  const handleregister=()=>{
    navigate('/register');
  }
  useEffect(()=>{
    const unSub=onAuthStateChanged(auth,(user)=>{
      console.log(user);
      if(user!=null)userinfo(user.uid);
    })
    return() =>{
      unSub()
    };

  },[curruser])
  console.log(curruser)

  if(curruser!=null && wait){
    handleLogin();
  }

  const[curr,setcurr]=useState(false)
    const verifylog = async (e) => {
        setwait(false);
        setcurr(true);
        e.preventDefault();
        const val = new FormData(e.target)
        const { email2, pass } = Object.fromEntries(val)

        try {
            const res = await signInWithEmailAndPassword(auth, email2, pass);
            setwait(true);
        } catch (err) {
            console.log(err)
        } finally{
            setcurr(false);
        }
    };


  return (
    <>
    <div className='loginpage'>
      <div className="nav1">
        <div className="nav2">
          <div>
            <a href="about.html">
              <i className="fa-solid fa-paw" id="pawss1"></i>
            </a>
          </div>
          <div className="search">
            <form action="">
              <input type="text" placeholder="Search" name="search" />
              <button type="submit">
                <i className="fa fa-search"></i>
              </button>
            </form>
          </div>
          <div className="bazingalogo">
            <img src="Images/Bazinga.jpg" height="50px" alt="Bazinga Logo" />
          </div>
          <div className="options">
            <div className="colap">
              <a href="https://www.youtube.com/watch?v=ejGx2ac08lg">
                <button className="bns"><b>Home</b></button>
              </a>
            </div>
            <div className="colap">
              <a href="https://www.youtube.com/watch?v=ejGx2ac08lg">
                <button className="bns"><b>About Us</b></button>
              </a>
            </div>
            <div className="colap">
              <a href="https://www.youtube.com/watch?v=ejGx2ac08lg">
                <button className="bns"><b>Contact Us</b></button>
              </a>
            </div>
            <div className="colap2">
              <div id="prevent">
                <button
                  className="lists"
                  onClick={() => {
                    // Implement the show_hide function or use state to toggle visibility
                    console.log('Toggle dropdown');
                  }}
                >
                  <i className="fa-solid fa-list droplist"></i>
                </button>
                <div id="dropdown-content">
                  <a href="#">Home</a>
                  <a href="#">About Us</a>
                  <a href="#">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main_body">
        <div className="girl_img">
          {/* <img src="Images/Screenshot 2024-07-16 013626.png" height="650px" alt="Girl" /> */}
        </div>
        <div className="boy_img">
          {/* <img src="Images/Screenshot 2024-07-16 013604.png" height="650px" alt="Boy" /> */}
        </div>
        <div className="login_left">
          <h1>Login to BAZINGA</h1>
          <div className="loginp">
          <form className="loginp3" onSubmit={verifylog}>
            <input
              type="text"
              placeholder="Enter Email"
              name="email2"
              required
              className="unames"
            />
            <input
              type="password"
              placeholder="Enter Password"
              name="pass"
              required
              className="passs"
            />
            <button
              type="submit"
              className="submiting"
              // onClick={handleLogin}
            >
              Login
            </button>
            </form>

            <div className="register">
              Or<br/><br/>
              New User?
              <br/>
              Click here to Register<br/><br/>
              <button
              type="Register"
              className="registering"
              onClick={handleregister}
              >Register
            </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Login;
