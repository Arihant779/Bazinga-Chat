import "./messages.css";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect, useRef } from 'react';
import { db } from "../../../database/firebase";
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { allchats } from "../../../database/currchat";
import { allUsers } from "../../../database/curruser";
import { imgupl } from "../../../database/imgupload"

const Messages = () => {
    const [chat, setChat] = useState(null);
    const [emojitab, setEmojitab] = useState(false);
    const { chatid, user, senderblocked: initialSenderBlocked, receiverblocked, blockstate } = allchats();
    const { curruser } = allUsers();
    const [text, setText] = useState("");
    const [senderblocked, setSenderBlocked] = useState(initialSenderBlocked);
    const messagesEndRef = useRef(null);

    const [img, setimg] = useState({
        file: null,
        url: "",
    })
    const toggletab = () => {
        setEmojitab(prev => !prev); 
    };

    const emojitotext = e => {
        setText(prev => prev + e.emoji);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    useEffect(() => {
        if (chatid) {
            const unSub = onSnapshot(doc(db, "chats", chatid), (val1) => {
                console.log("Received chat data:", val1.data());
                setChat(val1.data());
            }, err => {
                console.error("Error fetching chat data:", err);
            });

            return () => {
                unSub();
            };
        }
    }, [chatid]);

    const send = async () => {
        console.log("Sending message...");
         console.log("sending img ",img)
        if (text === "" && img.file===null) return;
        let imgid = null;
        try {

            if (img.file) {
                imgid = await imgupl(img.file);
            }


            await updateDoc(doc(db, "chats", chatid), {
                messages: arrayUnion({
                    senderid: curruser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgid && { img: imgid }),
                })
            });

            const currentUserRef = doc(db, "userchats", curruser.id);
            const currentUserSnap = await getDoc(currentUserRef);

            if (currentUserSnap.exists()) {
                const userChatData = currentUserSnap.data();
                const chatIndex = userChatData.chats.findIndex(c => c.chatID === chatid);

                if (chatIndex !== -1) {
                    userChatData.chats[chatIndex] = {
                        ...userChatData.chats[chatIndex],
                        isSeen: true,
                        latestmess: text,
                        timemes: Date.now()
                    };
                    await updateDoc(currentUserRef, {
                        chats: userChatData.chats,
                    });
                } else {
                    console.log("Chat not found in userchats");
                }
            }

            
            const otherUserRef = doc(db, "userchats", user.id);
            const otherUserSnap = await getDoc(otherUserRef);

            if (otherUserSnap.exists()) {
                const otherUserChatData = otherUserSnap.data();
                const chatIndex = otherUserChatData.chats.findIndex(c => c.chatID === chatid);

                if (chatIndex !== -1) {
                    otherUserChatData.chats[chatIndex] = {
                        ...otherUserChatData.chats[chatIndex],
                        isSeen: false,
                        latestmess: text,
                        timemes: Date.now()
                    };
                    await updateDoc(otherUserRef, {
                        chats: otherUserChatData.chats,
                    });
                } else {
                    console.log("Chat not found in other user's chats");
                }
            }

            setText("");

        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setimg({
                file: null,
                url: ""
            })
        }
    };

    const handleimg = (e) => {
        if (e.target.files[0]) {
            setimg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            })
        }
        console.log("img is",img)
    }
     useEffect(() => {
        setSenderBlocked(initialSenderBlocked);
    }, [initialSenderBlocked]);

    return (
        <div className="messages-main">
            <div className="messages-head">
                <img src={user?.avatar || "./avatar.png"} alt="Avatar" />
                <div className="userinfo">
                    <span>{user?.username || "USER"}</span>
                    <p>description iwh fqhuie rqherqewfijqjf v</p>
                </div>
                <div className="calloptions">
                    <i className="fa-solid fa-phone"></i>
                    <i className="fa-solid fa-video"></i>
                </div>
            </div>
            <div className="messagesmid">
                {(chat?.messages?.length > 0) ? chat.messages.map((message, index) => (
                    <div className={message.senderid===curruser?.id?"me":"frnd"} key={message.createdAt || index}>
                        <img src="./avatar.png" className="avatarimg" alt="Friend's Avatar" style={{ display: message.senderid === curruser?.id ? "none" : "flex" }}/>
                        <div className={message.senderid===curruser?"msgme":"msgfrnd"}>
                            {message.img && <img src={message.img} alt="Message Attachment" />}
                            <p>{message.text}</p>
                        </div>
                    </div>
                )) : <p></p>}
                {img.url && <div className="me" >
                    <div className="msgme">
                        <img src={img.url}></img>
                    </div>
                </div>}
                <div ref={messagesEndRef} />
                {(senderblocked) && <div >You are blocked</div>}
                {(receiverblocked)&& <div>User is blocked by you</div>}
            </div>
            <div className="messagesfoot">
                <div className="footoptions">
                    <div className='emojistext'>
                        <EmojiPicker open={emojitab} onEmojiClick={emojitotext} />
                    </div>
                    <i className="fa-regular fa-face-smile" onClick={toggletab}></i>
                    <label htmlFor="file">
                        <i className="fa-solid fa-link"></i></label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleimg} />

                    <i className="fa-solid fa-microphone"></i>
                </div>
                <input className="textinput" type="text" value={text} disabled={receiverblocked || senderblocked} placeholder="Type your message" onChange={e => setText(e.target.value)} />
                <div className="sendbut">
                    <button onClick={send} disabled={receiverblocked || senderblocked}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Messages;











{/* <div className="frnd">
                    <img src="./avatar.png"></img>
                    <div className="msgfrnd">
                        <img src="./favicon.png"></img>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic labore modi doloremque eos blanditiis rem aspernatur voluptates sint aliquam, aliquid delectus repellendus quo a dolorum esse exercitationem omnis. Voluptatem, numquam!</p>
                        <span>5 min ago</span>
                    </div>
                </div> */}

{/* <div className="me"> */ }
{/* <img src="./avatar.png"></img> */ }
{/* <div className="msgme">
                        <img src="./favicon.png"></img>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic labore modi doloremque eos blanditiis rem aspernatur voluptates sint aliquam, aliquid delectus repellendus quo a dolorum esse exercitationem omnis. Voluptatem, numquam!</p>
                        <span>5 min ago</span>
                    </div> */}
{/* </div> */ }