import { useState, useEffect } from 'react';
import { db } from "../../../database/firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { allchats } from "../../../database/currchat";
import "./filepage.css";

const Filepage = ({currnum}) => {
    const { chatid } = allchats();
    const [chats, setChats] = useState(null);
    const [allimg, setAllImg] = useState([]);
    const [currfile, setCurrFile] = useState([])
    const [fileorimg, setor] = useState(false)

    useEffect(() => {
        if (chatid) {
            const unSub = onSnapshot(doc(db, "chats", chatid), (val1) => {
                setChats(val1.data());
            }, err => {
                console.error("Error fetching chat data:", err);
            });

            return () => {
                unSub();
            };
        }
    }, [chatid]);

    useEffect(() => {
        if (chats?.messages) {
            const images = chats.messages
                .filter(item => item.img && !item.filename)
                .map(item => item.img);
            setAllImg(images);

            const files = chats.messages
                .filter(item => item.filename)
                .map(item => ({ filename: item.filename, url: item.img }));
            setCurrFile(files);
        }
    }, [chats]);

    return (
        <>
            {currnum === 1 ? (
            <div className='filepg-main'>
                <div className='filepgtitle'>IMAGES</div>
                <div className='pgimg'>
                    {allimg.map((img, index) => (
                        <div className='alllimg' key={index}>
                            <a href={img} target="_blank" rel="noopener noreferrer">
                                <img src={img} alt={`img-${index}`} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <div className='filepg-main'>
                <div className='filepgtitle'>FILES</div>
                <div className='pgimg'>
                    {currfile.map((file, index) => (
                        <div className="display" key={index}>
                            <div className="fileshow">
                                <i className="fa-solid fa-file"></i>
                                {file.filename}
                            </div>
                            <a className="downbut" href={file.url} target="_blank" rel="noopener noreferrer" download>
                                <div className="downdiv">
                                    <button className="downdiv"><i className="fa-solid fa-download downimgg"></i> Download</button>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )}

        </>
    );
}

export default Filepage;
