import { IonAlert, IonAvatar, IonButton, IonCol, IonContent, IonGrid, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonRouterLink, IonRow, IonText } from "@ionic/react"
import Header from "../components/Header/header";
import avatar from "./assets/images/avatar.png";
import "./styles/register.css";
import {Formik} from 'formik';
import * as yup from 'yup';
import axios from '../config/axios';
import { REGISTER_URL } from "../config/urls";
import { useState } from "react";
import { useHistory } from "react-router";

const validationSchema = yup.object({
    name: yup
        .string()
        .nullable()
        .required("يجب عليك إدخال اسم المستخدم"),
    email: yup
        .string()
        .nullable()
        .email("يجب عليك إدخال بريد إلكتروني صحيح")
        .required("يجب عليك إدخال البريد الإلكتروني"),
    password: yup
        .string()
        .nullable()
        .min(5, 'يجب عليك إدخال 5 محارف على الأقل')
        .required("يجب عليك إدخال كلمة مرور"),
});

const Register = () => {

    const [showLoading, setShowLoading] = useState(false);
    const [alertError, setAlertError] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const history = useHistory();

    const onSubmit = async (values) => {
        setShowLoading(true);
        try{
            await axios.post(REGISTER_URL, values, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods":
                    "GET, POST, PUT, DELETE, OPTIONS, UPDATE",
                    "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token",
                    "Content-Type": "application/json",
                }
            }).then(res => {
                setShowLoading(false);
                setShowAlert(true);
            })
        } catch(e) {
            if(e.response.status === 400) {
                setShowLoading(false);
                setAlertError(true);
            } else {
                console.log(e.message);
                setShowLoading(false);
            }
        }
    } 

    return (
        <IonPage>
            {showLoading 
            ?
            <IonLoading isOpen={showLoading} />
            :
                <>
                <IonAlert
                isOpen={alertError}
                header="تنبيه!"
                subHeader="هذا البريد الإلكتروني مستخدم"
                message="هذا البريد الإلكتروني مستخدم بالفعل فهل ترغب بتسجيل الدخول؟"
                buttons={[
                    {
                        text: "موافق",
                        handler: () => {
                            history.push('/account/login')
                        }
                    },
                    {
                        text: "إلغاء",
                        role: "cancel"
                    }
                ]}
                />
                <IonAlert
                isOpen={showAlert}
                header="تنبيه!"
                subHeader="لقد تم تسجيل حسابك بالفعل"
                message="يمكنك الانتقال إلى صفحة تسجيل الدخول"
                buttons={[
                    {
                        text: "تسجيل الدخول",
                        handler: () => {
                            history.push('/account/login')
                        }
                    }
                ]}
                />
                <Header headerTitle="تسجيل مستخدم جديد" />
                <IonContent>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-md="6" offset-md="3" size-lg="4" offset-lg="4">
                                <IonAvatar className="avatar">
                                    <IonImg src={avatar} />
                                </IonAvatar>
                                <Formik
                                    initialValues={{
                                    name: null,
                                    email: null,
                                    password: null
                                    }}
                                    validationSchema={validationSchema}
                                    onSubmit={(values, {resetForm}) => {
                                        onSubmit(values)
                                        resetForm({values: ''})
                                    }}
                                >
                                {formikProps => (
                                <form onSubmit={formikProps.handleSubmit}>
                                    <IonItem>
                                        <IonLabel color="warning" position="floating">الاسم</IonLabel>
                                        <IonInput
                                        name="name"
                                        value={formikProps.values.name}
                                        onIonChange={formikProps.handleChange}
                                        />
                                    </IonItem>
                                    <IonText className="error">{formikProps.touched.name && formikProps.errors.name}</IonText>
                                    <IonItem>
                                        <IonLabel color="warning" position="floating">البريد الإلكتروني</IonLabel>
                                        <IonInput
                                        name="email"
                                        value={formikProps.values.email}
                                        onIonChange={formikProps.handleChange}
                                        />
                                    </IonItem>
                                    <IonText className="error">{formikProps.touched.email && formikProps.errors.email}</IonText>
                                    <IonItem>
                                        <IonLabel color="warning" position="floating">كلمة المرور</IonLabel>
                                        <IonInput
                                        type="password"
                                        name="password"
                                        value={formikProps.values.password}
                                        onIonChange={formikProps.handleChange}
                                        />
                                    </IonItem>
                                    <IonText className="error">{formikProps.touched.password && formikProps.errors.password}</IonText>
                                    <div className="ion-text-center btn">
                                        <IonButton type="submit" className="button">إنشاء حساب</IonButton>
                                        <IonRouterLink color="warning" className="router-link" routerLink="/account/login">تسجيل الدخول</IonRouterLink>
                                    </div>
                                </form>
                                )}
                                </Formik>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
                </>
             }

        </IonPage>
    )
}

export default Register;