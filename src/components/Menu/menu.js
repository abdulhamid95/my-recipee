import { IonContent, IonHeader, IonMenu, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon, IonAvatar, IonImg, IonText, IonLoading } from "@ionic/react"
import { clipboardOutline, logOutOutline, personCircleOutline } from "ionicons/icons";
import avatar from '../../pages/assets/images/avatar.png';
import axios from "../../config/axios";
import { PROFILE_URL } from "../../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Storage } from "@capacitor/storage";
import { useHistory } from "react-router";


const Menu = () => {

    const [name, setName] = useState();
    const [profileImg, setProfileImg] = useState()
    const [slot, setSlot] = useState()

    const {jwt, setLoggedIn} = useContext(AuthContext);

    const history = useHistory();

    useEffect(() => {
        getProfile()
    },[])

    const getProfile = async () => {
        try {
            await axios.get(PROFILE_URL, {
                headers: {
                    Authorization: jwt
                }
            }).then((res) => {
                setName(res.data.name);
                setProfileImg(res.data.img_uri);
            })
        } catch(e) {
            console.log(e);
        }
    }

    const logOut = async () => {
        await Storage.remove({ key: 'accesToken' });
        setLoggedIn(false)
        history.push('/account/login')
    }

    const myFunction = (x) => {
        if (x.matches) { 
          setSlot("end")
        } else {
         setSlot("start")
        }
      }
      
      let x = window.matchMedia("(max-width: 992px)")


      useEffect(() => {
        myFunction(x);
        x.addListener(myFunction);
      },[])
      
      

    return(
        <IonMenu side={slot} contentId="menu">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>قائمة</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonAvatar className="avatar">
                    {profileImg ? 
                    <IonImg src={profileImg} />
                    :
                    <IonImg src={avatar} />
                    }
                </IonAvatar>
                <div className="ion-text-center ion-margin-top">
                    <IonText color="warning"><h3>{name}</h3></IonText>
                </div>
                <IonList>
                    <IonItem button routerLink="/my-recipe/account/profile">
                        <IonIcon color="primary" icon={personCircleOutline} />
                        <IonLabel className="ion-margin">الصفحة الشخصية</IonLabel>
                    </IonItem>
                    <IonItem button routerLink="/my-recipe/my-posts">
                        <IonIcon color="primary" icon={clipboardOutline} />
                        <IonLabel className="ion-margin">منشوراتي</IonLabel>
                    </IonItem>
                    <IonItem button onClick={() => logOut()}>
                        <IonIcon color="primary" icon={logOutOutline} />
                        <IonLabel className="ion-margin">تسجيل الخروج</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonMenu>
    )
}

export default Menu;