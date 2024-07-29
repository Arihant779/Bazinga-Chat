import "./contacts.css";
import Chatlist from "./Chatlist/chatlist";
import { allUsers } from '../../../database/curruser';
import { db } from "../../../database/firebase";
import { collection, query, where, setDoc, getDocs, doc, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";
import { useState } from "react";

const Contacts = () => {
    const { curruser } = allUsers();
    const [user, setUser] = useState(null);
    const [find,setfind]=useState(true);
    const [searchValue, setSearchValue] = useState("");


    const newsearch = async (e) => {
        // console.log("hello")
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get("search2");
        
        try {
            const citiesRef = collection(db, "users");
            const q = query(citiesRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data());
                console.log("the user is",user);
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Error searching user:", err);
        }
    };

    const Addinguser=async()=>{
        console.log("hooo")
        const newRef = collection(db, "chats");
        const userref=collection(db, "userchats");

        try{
            const currref=doc(newRef)
           
            await setDoc(currref,{
                createdAt: serverTimestamp(),
                messages:[],
            })
            console.log("hiiii")
            await updateDoc(doc((userref),user.id),{
                chats:arrayUnion({
                    chatID:currref.id,
                    latestmess:"",
                    receiverid:curruser.id,
                    timemes:Date.now(),
                    isSeen:true,
                })
            })
            console.log("hssii")
            await updateDoc(doc((userref),curruser.id),{
                chats:arrayUnion({
                    chatID:currref.id,
                    latestmess:"",
                    receiverid:user.id,
                    timemes:Date.now(),
                    isSeen:true,
                })
            })

        }catch(err){
            console.log("some error")
        }finally{
            setUser(null);
        }
    }

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
    };


    return (
        <div className="contact-main">
            {find? (<><div className="chead">
                <div className="nname">{curruser?.username || "Uname"}</div>
                <div className="newgrp">
                    <button className="newgrpbut" onClick={() => { setfind(false); } }>
                        <i className="fa-regular fa-square-plus"></i>
                    </button>
                </div>
            </div><div className="search2">
                    <form className="searchbar" onSubmit={newsearch}>
                        <input type="text" placeholder="Search" name="search2" className="searching" value={searchValue} onChange={handleInputChange}/>
                        <button type="submit" className="searched">
                            <i className="fa fa-search searchbut"></i>
                        </button>
                    </form>
                    {/* {user && (
                        <div className="adduser">
                            <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
                            <span>{user.username}</span>
                            <button className="adding" onClick={Addinguser}>Add User</button>
                        </div>
                    )} */}
                </div><div className="allchats">
                    <Chatlist initials={searchValue} />
                </div></>):
                <>
                    <div className="addinguserlobby">
                        <div className="usertop">
                            <button  className="back" onClick={()=>{setfind(true), setUser(false)}} > <i class="fa-solid fa-arrow-left"></i></button>
                            <p>ADD NEW USER</p>
                        </div>
                        <div className="search2">
                            <form className="searchbar" onSubmit={newsearch}>
                                <input type="text" placeholder="Search" name="search2" className="searching" />
                                <button type="submit" className="searched">
                                    <i className="fa fa-search searchbut"></i>
                                </button>
                            </form>
                            {user && (
                                <div className="adduser">
                                    <img src={user.avatar || "./avatar.png"} alt="User Avatar" />
                                    <span>{user.username}</span>
                                    <button className="adding" onClick={Addinguser}>Add User</button>
                                </div>
                            )}
                        </div>
                    </div>
                </>}
        </div>
    );
}

export default Contacts;
