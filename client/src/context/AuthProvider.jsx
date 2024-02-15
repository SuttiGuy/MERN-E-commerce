import { useContext, createContext, useState } from "react";
import app from "../firebase/firebase.config";
export const AuthContext = createContext();
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";

const AuthProvider = ({ children }) => {
  
    const auth = getAuth(app);
  const [user, setUser] = useState(null);

  const createUser = (email,password) => {
    return createUserWithEmailAndPassword(auth,email,password);
};

    const login = (email,password) => {
        return signInWithEmailAndPassword (auth, email,password);
    };
    

  const authInfo = {
    user,
    setUser,
    login,
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
