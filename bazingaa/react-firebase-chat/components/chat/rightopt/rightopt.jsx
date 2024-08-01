import React from 'react';
import "./rightopt.css";
import Settings from './settings/settings.jsx';
import { auth, db } from "../../../database/firebase.js";
import { useNavigate } from 'react-router-dom'; 
import { allUsers } from '../../../database/curruser.js';
import { allchats } from '../../../database/currchat.js';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

const Rightopt = ({setonclick,fn,setpg,fn2,setpg2,fn3}) => {

    const {chatid,user,senderblocked,receiverblocked,blockstate }=allchats()
    const {curruser}=allUsers()
    const navigate = useNavigate(); // Initialize navigate

    const handleLogout = () => {
        auth.signOut()
            .then(() => {
                navigate('/'); 
            })
            .catch((error) => {
                console.error("Error signing out: ", error);
            });
    };

    const handleban=async()=>{
        const ref1=doc(db, "users" ,curruser.id)
        try{
            await updateDoc(ref1,{
                blocked:receiverblocked? arrayRemove(user.id):  arrayUnion(user.id),
            })
            console.log("blocking" ,user)
            blockstate();
        }catch(err){
            console.log(err)
        }
    }

    const handlesettings=()=>{
        fn(!setonclick)
    }
    const handleimgpg=()=>{
        fn2(!setpg)
    }

    const handlefile=()=>{
        fn3(!setpg2)
    }

    return (
        <div className="mainlay">
            <button className="blockusr" onClick={handleban}><i className="fa-solid fa-ban"></i></button>
            <button className="imgusr" onClick={handleimgpg}><i className="fa-solid fa-image"></i></button>
            <button className="linkusr"><i className="fa-solid fa-link"></i></button>
            <button className="fileusr" onClick={handlefile}><i className="fa-regular fa-file"></i></button>
            <button className="settings" onClick={handlesettings}><i className="fa-solid fa-gear"></i></button>
            <button className="profile" onClick={handleLogout}><i className="fa-solid fa-user"></i></button>
        </div>
    );
}

export default Rightopt;
