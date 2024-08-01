import Contacts from "./contacts/contacts";
import "./chat.css"
import Messages from "./messages/messages";
import Rightopt from "./rightopt/rightopt";
import {allUsers} from '../../database/curruser'
import {useEffect, useState} from 'react'
import ProfilePage from "./profile/ProfilePage";
import Filepage from "./filepage/filepage";
import { allchats } from "../../database/currchat";

const Chat = () => {
    const {curruser, userinfo}=allUsers()
    const [sett,setsett]=useState(true)
    const [flpg,setflpg]=useState(false)
    const [flpg2,setflpg2]=useState(false)
    const [num,setnum]=useState(0)
    const [pgfl,setpgfl]=useState(false)
    const { user } = allchats();

    useEffect(()=>{
        if(flpg && flpg2){
            setpgfl(true)
            setflpg2(false)
            setnum(1)
        }else if(flpg || flpg2){
            setpgfl(true)
            if(flpg)setnum(1)
            else setnum(0)
        }
        else{
            setpgfl(false)
        }
    },[flpg,flpg2])


    useEffect(()=>{
        setpgfl(false);
        setsett(false);
        setflpg(false)
        setflpg2(false)
    },[user])

    
    console.log(curruser)
    return (
        <div class="chat-bg">
            <Contacts/>
            {sett ? <ProfilePage /> : (pgfl ? <Filepage currnum={num}/> : <Messages/>)}
            <Rightopt setonclick={sett} fn={setsett} setpg={flpg} fn2={setflpg} setpg2={flpg2} fn3={setflpg2}/>
        </div>
        
    );
}

export default Chat;
