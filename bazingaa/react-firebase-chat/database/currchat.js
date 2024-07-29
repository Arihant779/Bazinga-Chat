import { create } from 'zustand';
import { db } from "./firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { allUsers } from './curruser.js';

export const allchats = create((set, get) => ({
  chatid: null,
  user: null,
  senderblocked: false,
  receiverblocked: false,
  chatinfo: async (chatid, user) => {
    const currentuser = allUsers.getState().curruser;
    if (!currentuser || !user) return;

    if (user.blocked.includes(currentuser.id)) {
      set({
        chatid,
        user: null,
        senderblocked: true,
        receiverblocked: false,
      });
    } else if (currentuser.blocked.includes(user.id)) {
      set({
        chatid,
        user,
        senderblocked: false,
        receiverblocked: true,
      });
    } else {
      set({
        chatid,
        user,
        senderblocked: false,
        receiverblocked: false,
      });
    }
  },
  blockstate: () => {
    set((state) => ({
      ...state,
      receiverblocked: !state.receiverblocked,
    }));
  }
}));
