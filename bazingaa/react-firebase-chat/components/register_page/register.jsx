import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./register.css";
// import {auth} from "./database/firebase.js"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../database/firebase';
import { doc, setDoc } from "firebase/firestore";
import {allUsers} from '../../database/curruser'

const Register = () => {
    const navigate = useNavigate();
    const {curruser, userinfo}=allUsers()

    const NewRegister = () => {
        navigate('/chat');
    };
    
    const[curr,setcurr]=useState(false)
    const verifyreg = async (e) => {
        setcurr(true);
        e.preventDefault();
        const val = new FormData(e.target)
        const { username, email, password1 } = Object.fromEntries(val)

        try {
            // file="../../Images/avatar.png"
            // const upload_img=await imgupl(file)
            const res = await createUserWithEmailAndPassword(auth, email, password1);
            await setDoc(doc(db, "users", res.user.uid), {
                username:username,
                email:email,
                id:res.user.uid,
                blocked:[],
                profilepic:""
            });
            await setDoc(doc(db, "userchats", res.user.uid), {
                chatmes:[]
            });
            NewRegister();
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
                        <a href="http://localhost:5173">
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
                    <h1>Register to BAZINGA</h1>
                    {/* <div className="loginp2"> */}
                    <form onSubmit={verifyreg} className='loginp2'>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            name="username"
                            required
                            className="unames2"
                        />
                        <input
                            type="text"
                            placeholder="Enter EmailID"
                            name="email"
                            required
                            className="umail"
                        />
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password1"
                            required
                            className="passs2"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            required
                            className="passs2"
                        />
                        <button
                            type="submit"
                            className="Registerr"
                        //   onClick={NewRegister}
                            disabled={curr}
                        >
                            Register
                        </button>
                    </form>
                    {/* </div> */}
                </div>
            </div>
            </div>
            
        </>
    );
};

export default Register;
