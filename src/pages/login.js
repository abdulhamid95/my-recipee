import { IonHeader, IonPage, IonToolbar, IonContent, IonIcon, IonList, IonItem, IonLabel, IonInput, IonButton, IonRouterLink, IonLoading, IonAlert, IonGrid, IonRow, IonCol } from "@ionic/react"
import axios from "../config/axios";
import { LOGIN_URL } from "../config/urls";
import { logIn } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header/header";
import "./styles/login.css"
import { Storage } from '@capacitor/storage';
import { useHistory } from "react-router";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showLoading, setShowLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const history = useHistory();

    const {setLoggedIn, setJwt} = useContext(AuthContext);

    const onSubmit = async () => {
        setShowLoading(true);
        const logInForm = {
            email,
            password
        }
        try{
            await axios.post(LOGIN_URL, logInForm).then((res) => {
                Storage.set({
                    key: 'accesToken',
                    value: res.data.accessToken
                });
                setLoggedIn(true);
                setJwt(res.data.accessToken)
                setShowLoading(false);
                history.push('/my-recipe/all-posts')
            });
        } catch(e) {
            if(e.response.status === 401) {
                setShowLoading(false);
                setShowAlert(true)
                console.log(e.response);
            }
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
            header="تحذير!"
            message="البريد الإلكتروني أو اسم المستخدم غير صحيح"
            buttons={[
                {
                    text: 'موافق',
                    role: 'ok'
                }
            ]}
            />
            <Header headerTitle="تسجيل الدخول" />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="6" offset-md="3" size-lg="4" offset-lg="4">
                            <IonIcon icon={logIn} className="icon" />
                            <IonList>
                                <IonItem className="ion-margin-bottom">
                                    <IonLabel color="warning" position="floating">البريد الإلكتروني</IonLabel>
                                    <IonInput value={email} onIonChange={(e) => {setEmail(e.target.value)}} />
                                </IonItem>
                                <IonItem>
                                    <IonLabel color="warning" position="floating">كلمة المرور</IonLabel>
                                    <IonInput type="password" value={password} onIonChange={(e) => {setPassword(e.target.value)}} />
                                </IonItem>
                            </IonList>
                            <div className="ion-text-center btn">
                                <IonButton className="button" onClick={() => onSubmit()}>تسجيل الدخول</IonButton>
                                <IonRouterLink className="router-link" routerLink={"/account/register"} color="warning">تسجيل مستخدم جديد</IonRouterLink>
                            </div>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            </>
            }
        </IonPage>
    )
}

export default Login;