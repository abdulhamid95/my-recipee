import { IonHeader, IonPage, IonToolbar, IonContent, IonAvatar, IonImg, IonList, IonItem, IonLabel, IonInput, IonIcon, IonButton, IonLoading, IonAlert, IonGrid, IonRow, IonCol } from "@ionic/react";
import axios from "../config/axios";
import { addOutline } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/header";
import { AuthContext } from "../context/AuthContext";
import avatar from './assets/images/avatar.png';
import './styles/profile.css'
import { PROFILE_UPDATE_URL, PROFILE_URL } from "../config/urls";
import UserDetails from "../components/UserProfile/UserDetails";
import UserAvatar from "../components/UserProfile/UserAvatar";

const Profile = () => {

    const [showLoading, setShowLoading] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [userImg, setUserImg] = useState();
    const [password, setPassword] = useState();
    const [showAlert, setShowAlert] = useState(false);

    const {jwt} = useContext(AuthContext);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        setShowLoading(true);
        try{
            await axios.get(PROFILE_URL, {
                headers: {
                    Authorization: jwt
                }
            }).then((res) => {
                console.log(res);
                setName(res.data.name);
                setEmail(res.data.email);
                setUserImg(res.data.img_uri)
                setShowLoading(false)
            })
        } catch(e) {
            console.log(e);
            setShowLoading(false)
        }
    }

    const onSubmit = async () => {
        setShowLoading(true);
        try{
            const updateForm = {
                'name': name,
                'password': password
            }
            await axios.put(PROFILE_UPDATE_URL, updateForm, {
                headers: {
                    Authorization: jwt
                }
            }).then((res) => {
                console.log(res);
                setShowLoading(false);
            })
        } catch(e) {
            console.log(e);
            setShowLoading(false);
        }
    }


    return (
        <IonPage>
            {showLoading ? 
            <IonLoading isOpen={showLoading} />
            :
            <>
            <IonAlert
            isOpen={showAlert}
            header="تنبيه!"
            message="هل أنت تريد بالفعل تعديل البيانات الشخصية"
            onDidDismiss={() => setShowAlert(false)}
            buttons={[
                {
                    text: "موافق",
                    handler: () => {onSubmit()}
                },
                {
                    text: "إلغاء",
                    role: "cancel"
                }
            ]}
            />
            <Header headerTitle="صفحة المستخدم" />
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="6" offset-md="3" size-lg="4" offset-lg="4">
                            <UserAvatar userImg={userImg} />
                            <UserDetails 
                            name={name} 
                            email={email}
                            userName={setName}
                            password={setPassword}
                            showAlert={setShowAlert}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            </>
            }

        </IonPage>
    )
}

export default Profile;