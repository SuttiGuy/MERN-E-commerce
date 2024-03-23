import { useContext, createContext, useState, useEffect } from "react";
import app from "../firebase/firebase.config";
export const AuthContext = createContext();
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import useAxiosPublic from "../hook/useAxiosPublic";

const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const axiosPublic = useAxiosPublic();
  const [user, setUser] = useState(null);
  const [reload, setReload] = useState(false);

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = () => {
    return signOut(auth);
  };

  const updateUserProfile = ({ name, photoURL }) => {
    console.log(photoURL);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const authInfo = {
    user,
    setUser,
    login,
    logout,
    updateUserProfile,
    createUser,
    signUpWithGoogle,
    reload,
    setReload,
  };
  //check if user is Logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userInfo = {email:currentUser.email};
        axiosPublic.post("/jwt", userInfo).then((response)=>{
          if(response.data.token){
            localStorage.setItem("access_token",response.data.token);
          }
        })
      }else{
        localStorage.removeItem("access_token")
      }
    });
    return () => {
      return unsubscribe();
    };
  }, [auth]);

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
