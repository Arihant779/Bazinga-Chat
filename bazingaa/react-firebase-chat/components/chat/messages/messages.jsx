import "./messages.css";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect, useRef } from 'react';
import { db } from "../../../database/firebase";
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { allchats } from "../../../database/currchat";
import { allUsers } from "../../../database/curruser";
import { imgupl } from "../../../database/imgupload";
import { useReactMediaRecorder } from "react-media-recorder";

const Messages = () => {
    const [chat, setChat] = useState(null);
    const [emojitab, setEmojitab] = useState(false);
    const { chatid, user, senderblocked: initialSenderBlocked, receiverblocked, blockstate } = allchats();
    const { curruser } = allUsers();
    const [text, setText] = useState("");
    const [senderblocked, setSenderBlocked] = useState(initialSenderBlocked);
    const messagesEndRef = useRef(null);
    const [mic, setMic] = useState(false);
    const [micc, setMicc] = useState(false);
    const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

    const [img, setImg] = useState({
        file: null,
        url: "",
    });

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
        if (text === "" && img.file === null && mediaBlobUrl === null) return;
        let imgid = null;
        let filenam = null;
        let audioUrl = null;
        try {
            if (micc && mediaBlobUrl) {
                const audioBlob = await fetch(mediaBlobUrl).then(r => r.blob());
                audioUrl = await imgupl(audioBlob);
                setMicc(false);
                setText("");
            } else if (img.file) {
                imgid = await imgupl(img.file);
                if (img.name) {
                    filenam = img.name;
                }
                setText("");
            }

            await updateDoc(doc(db, "chats", chatid), {
                messages: arrayUnion({
                    senderid: curruser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgid && { img: imgid }),
                    ...(filenam && { filename: filenam }),
                    ...(audioUrl && { audio: audioUrl }),
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
            setImg({ file: null, url: "" });

        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const handleImg = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            const mimeType = file.type;
            let fileType;

            if (mimeType.startsWith('image/')) {
                fileType = null;
            } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/pdf' || mimeType.startsWith('audio/')) {
                fileType = file.name;
            } else {
                fileType = file.name;
            }

            setImg({
                file: file,
                url: URL.createObjectURL(file),
                name: fileType,
            });
        }
    };

    const micrecord = () => {
        if (mic) {
            stopRecording();
            setMicc(true);
        } else {
            startRecording();
        }
        setMic(!mic);
    };

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
                    <div className={message.senderid === curruser?.id ? "me" : "frnd"} key={message.createdAt || index}>
                        <img src="./avatar.png" className="avatarimg" alt="Friend's Avatar" style={{ display: message.senderid === curruser?.id ? "none" : "flex" }} />
                        <div className={message.senderid === curruser ? "msgme" : "msgfrnd"}>
                            {message.img && (
                                <>
                                    {(message.filename) ? (
                                        <>
                                            <div className="display">
                                                <div className="fileshow">
                                                    <i className="fa-solid fa-file"></i>
                                                    {message.filename}
                                                </div>
                                                <a className="downbut" href={message.img} target="_blank" rel="noopener noreferrer" download>
                                                    <div className="downdiv">
                                                        <button className="downdiv"><i className="fa-solid fa-download downimgg"></i> Download</button>
                                                    </div>
                                                </a>
                                            </div>
                                        </>
                                    )
                                        :
                                        <>
                                            <div className="display">
                                                <img src={message.img} alt="Message Attachment" />
                                                <a className="downbut" href={message.img} target="_blank" rel="noopener noreferrer" download>
                                                    <div className="downdiv">
                                                        <button className="downdiv"><i className="fa-solid fa-download downimgg"></i> Download</button>
                                                    </div>
                                                </a>
                                            </div>
                                        </>
                                    }
                                </>
                            )}
                            {message.audio && (
                                <div>
                                    <audio controls>
                                        <source src={message.audio} type="audio/mpeg" />
                                        {/* Your browser does not support the audio element. */}
                                    </audio>
                                </div>
                            )}
                            {message.text === "" ? null : <p>{message.text}</p>}
                        </div>
                    </div>
                )) : <p>No messages yet</p>}
                <div ref={messagesEndRef} />
                {senderblocked && <div>You are blocked</div>}
                {receiverblocked && <div>User is blocked by you</div>}
            </div>
            <div className="messagesfoot">
                <div className="footoptions">
                    <div className='emojistext'>
                        <EmojiPicker open={emojitab} onEmojiClick={emojitotext} />
                    </div>
                    <i className="fa-regular fa-face-smile" onClick={toggletab}></i>
                    <label htmlFor="file">
                        <i className="fa-solid fa-link"></i></label>
                    <input type="file" id="file" style={{ display: "none" }} onChange={handleImg} />
                    <button className="micbut" onClick={micrecord}><i className="fa-solid fa-microphone"></i></button>
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
