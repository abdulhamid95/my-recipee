import { IonList, IonItem, IonLabel, IonInput, IonButton, IonToast } from "@ionic/react";
import { useState } from "react";

const UserDetails = (props) => {

    const [name, setName] = useState(props.name);
    const [password, setPassword] = useState();
    const [disabled, setDisabled] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [showToastPass, setShowToastPass] = useState(false)

    const handleClick = () => {
        if(name && password) {
            if(password.length < 5){
                setShowToastPass(true)
            } else {
                props.userName(name);
                props.password(password);
                props.showAlert(true)
            }
        } else {
            setShowToast(true)
        }
    }

    return(
    <IonList>
        <IonItem>
            <IonLabel color="warning" position="floating">اسم المستخدم</IonLabel>
            <IonInput 
            value={name}
            onIonChange={(e) => {setName(e.target.value)}}
            />
        </IonItem>
        <IonItem>
            <IonLabel color="warning" position="floating">البريد الإلكتروني</IonLabel>
            <IonInput value={props.email} disabled />
        </IonItem>
        <IonItem>
            <IonLabel color="warning" position="floating">كلمة المرور</IonLabel>
            <IonInput 
            type="password"
            value={password}
            onIonChange={(e) => {
                setPassword(e.target.value);
                setDisabled(false);
            }}
            />
        </IonItem>
        <div className="btn">
            <IonButton expand="block" disabled={disabled} onClick={() => handleClick()}>تعديل البيانات</IonButton>
        </div>
        <IonToast 
        isOpen={showToast}
        onDidDismiss={() => {setShowToast(false)}}
        duration={1500}
        message="يجب عليك إدخال جميع الحقول"
        color="danger"
        />
        <IonToast 
        isOpen={showToastPass}
        onDidDismiss={() => {setShowToastPass(false)}}
        duration={1500}
        message="يجب ان تكون كلمة المرور أكثر من خمسة محارف"
        color="danger"
        />
    </IonList>
    )
}

export default UserDetails;