import "./chatlist.css";
import { allUsers } from '../../../../database/curruser';
import { useEffect, useState } from "react";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../database/firebase";
import { allchats } from "../../../../database/currchat";

const Chatlist = ({ initials }) => {
    const [chatname, setChatname] = useState([]);
    const { curruser } = allUsers();
    const { chatinfo } = allchats();
    const [localChats, setLocalChats] = useState([]);

    useEffect(() => {
        if (!curruser?.id) return;

        const unsub = onSnapshot(doc(db, "userchats", curruser.id), async (docSnapshot) => {
            const data = docSnapshot.data();
            if (!data) return;

            const items = data.chats || [];
            try {
                const prom = items.map(async (item) => {
                    const newdocRef = doc(db, "users", item.receiverid);
                    const newdocSnap = await getDoc(newdocRef);
                    const preuser = newdocSnap.exists() ? newdocSnap.data() : null;
                    return { ...item, preuser };
                });

                const temp = await Promise.all(prom);
                const filteredChats = temp.filter((item) => 
                    item.preuser && item.preuser.username && 
                    item.preuser.username.toLowerCase().startsWith(initials.toLowerCase())
                );

                setChatname(filteredChats.sort((a, b) => b.timemes - a.timemes));
                setLocalChats(filteredChats);
            } catch (err) {
                console.error("Error fetching chat names:", err);
            }
        });

        return () => {
            unsub();
        }
    }, [curruser?.id, initials]);

    const handlechat = async (chat) => {
        console.log("hiiipo");

        const updatedChats = localChats.map(c => 
            c.chatID === chat.chatID ? { ...c, isSeen: true } : c
        );
        setLocalChats(updatedChats);

        const currentUserRef = doc(db, "userchats", curruser.id);
        const currentUserSnap = await getDoc(currentUserRef);

        if (currentUserSnap.exists()) {
            const userChatData = currentUserSnap.data();
            const chatIndex = userChatData.chats.findIndex(c => c.chatID === chat.chatID);

            if (chatIndex !== -1) {
                userChatData.chats[chatIndex] = {
                    ...userChatData.chats[chatIndex],
                    isSeen: true,
                };
                await updateDoc(currentUserRef, {
                    chats: userChatData.chats,
                });
            } else {
                console.log("Chat not found in userchats");
            }
        }

        chatinfo(chat.chatID, chat.preuser);
    };

    return (
        <div className="allnewchats">
            {localChats.map((chat) => (
                <div
                    className="items"
                    key={chat.chatID}
                    onClick={() => handlechat(chat)}
                    style={{ backgroundColor: chat.isSeen ? "transparent" : "rgba(157, 242, 242,0.4)" }}
                >
                    <img src={chat.preuser?.avatar || "./avatar.png"} alt="User Avatar" />
                    <div className="contactx">
                        <span>{chat.preuser?.username || "Unknown User"}</span>
                        <p>{chat.latestmess}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Chatlist;
