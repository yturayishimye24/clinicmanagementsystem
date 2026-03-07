import { useContext, createContext,useEffect,useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase.js";

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [authLoading,setAuthLoading] = useState(true);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  const logOut = () => {
    signOut(auth);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setAuthLoading(false);
    });

    return () => {
      unsubscribe();
    }
  },[]);
  

  return (
    <FirebaseContext.Provider value={{ googleSignIn, logOut,authLoading, user }}>
      {children}
    </FirebaseContext.Provider>
  );

};

export const useFirebase = () => {
  return useContext(FirebaseContext);
};
