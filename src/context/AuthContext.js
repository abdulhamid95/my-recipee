import { createContext, useEffect, useState } from "react";
import { Storage } from "@capacitor/storage";
import { IonLoading } from "@ionic/react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [jwt, setJwt] = useState();

    useEffect(() => {
        getAuthenticated();
    },[])

    const getAuthenticated = async () => {
        setShowLoading(true)
        const accessToken = await Storage.get({key: 'accesToken'});
        if(accessToken.value){
            setLoggedIn(true);
            setJwt(accessToken.value);
            setShowLoading(false);
        } else {
            setLoggedIn(false);
            setShowLoading(false);
        }
    }

    return (
        <>
        {showLoading ?
        <IonLoading isOpen={showLoading} />
        : 
        <AuthContext.Provider value={{loggedIn, jwt, setLoggedIn, setJwt}}>
            {props.children}
        </AuthContext.Provider>
        }
        </>

    )
}

export default AuthContextProvider;