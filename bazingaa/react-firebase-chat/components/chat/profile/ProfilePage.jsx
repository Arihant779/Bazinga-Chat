import React, { useState } from 'react';
import "./ProfilePage.css";
import { allUsers } from "../../../database/curruser";
import { db } from '../../../database/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ProfilePage = () => {
  const { curruser } = allUsers();
  const [edit, setEdit] = useState(false);
  const [newUsername, setNewUsername] = useState(curruser.username);

  const changeProfile = async () => {
    try {
      await updateDoc(doc(db, "users", curruser.id), {
        username: newUsername
      });
      console.log("Profile updated successfully!");
      setEdit(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  return (
    <div className='profile-main'>
      <div className='profilepics'>
        <img className='profilepicture' src="../../../Images/avatar.png" alt="Profile" />
        <i className="fa-solid fa-pen"></i>
      </div>
      <div className='Username'>
        Username: 
        {edit ? (
          <input
            className='userinput'
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        ) : (
          curruser.username
        )}
        {edit && <button className="save" onClick={changeProfile}>Save</button>}
        <button className='editing' onClick={() => setEdit(!edit)}>
          <i className="fa-solid fa-pen"></i>
        </button>
        
      </div>
      <div className="Description">
        <div className='Description_title'>
          Description
          <button className='editing'><i className="fa-solid fa-pen"></i></button>
        </div>
        <div className='Description_user'>It is what it seems to be</div>
      </div>
    </div>
  );
}

export default ProfilePage;
