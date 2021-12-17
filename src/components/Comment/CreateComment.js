import { IonButtons, IonIcon, IonItem, IonTextarea, IonToast } from "@ionic/react"
import { send } from "ionicons/icons"
import { useContext, useState } from "react"
import axios from '../../config/axios';
import { GET_ALL_POSTS } from "../../config/urls";
import { AuthContext } from "../../context/AuthContext";



const CreateComment = (props) => {

    const [newComment, setNewComment] = useState();
    const [showToast, setShowToast] = useState(false);

    const {jwt} = useContext(AuthContext);

    const postId = window.location.pathname.split('/')[3]

    const createComment = async () => {
        if(newComment) {
            const comment = {
                'text': newComment
            }
            try{
                await axios.post(GET_ALL_POSTS + '/' + postId + '/create-comment', comment, {
                    headers: {
                        Authorization: jwt
                    }
                }).then(res => {
                    setNewComment("");
                })
            } catch(e) {
                console.log(e);
            }
        } else {
            setShowToast(true);
        }
    }

    return (
        <>
        <IonItem className="ion-margin-bottom">
            <IonTextarea 
            className="ion-margin"
            value={newComment}
            onIonChange={(e) => {setNewComment(e.target.value)}}
            />
            <IonButtons onClick={() => {
                createComment();
                props.sendToParent(newComment);
            }}>
                <IonIcon icon={send} className="send-icon" color="light" />
            </IonButtons>
        </IonItem>
        <IonToast
            isOpen={showToast} 
            onDidDismiss={() => setShowToast(false)}
            message="يجب عليك إدخال تعليق"
            duration={1500}
            color="danger"
        />
        </>
    )
}

export default CreateComment;