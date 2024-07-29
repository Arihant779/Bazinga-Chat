import Contacts from "./contacts/contacts";
import "./chat.css"
import Messages from "./messages/messages";
import Rightopt from "./rightopt/rightopt";
import {allUsers} from '../../database/curruser'
import {useState} from 'react'
import ProfilePage from "./profile/ProfilePage";

const Chat = () => {
    const {curruser, userinfo}=allUsers()
    const [sett,setsett]=useState(false)
    
    console.log(curruser)
    return (
        <div class="chat-bg">
            <Contacts/>
            {sett?<Messages/>:<ProfilePage/>}
            <Rightopt setonclick={sett} fn={setsett}/>
        </div>
        
    );
}

export default Chat;
