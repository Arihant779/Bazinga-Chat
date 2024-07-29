import { create } from 'zustand'
import {db} from "./firebase.js"
import {doc ,getDoc} from "firebase/firestore"

export const allUsers = create((set) => ({
  curruser:null,
  userinfo: async(uid) =>{
    if(!uid)return set({curruser:null});
    try{
      const databs=doc(db, "users" ,uid);
      const dataval=await getDoc(databs)
      if(dataval.exists()){
        set({curruser:dataval.data()});
      }
      else{
        set({curruser:null});
      }
    }catch(err){
      return set({curruser:null});
    }
  }
}))

