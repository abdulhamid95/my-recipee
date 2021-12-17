import { IonAvatar, IonCard, IonCardSubtitle, IonGrid, IonImg, IonList, IonRow, IonText } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import axios from '../../config/axios';
import { GET_ALL_POSTS } from "../../config/urls";
import { AuthContext } from "../../context/AuthContext";
import avatar from '../../pages/assets/images/avatar.png'


const GetComment = (props) => {

    const [comments, setComments] = useState();

    const {jwt} = useContext(AuthContext)
    
    const postId = window.location.pathname.split('/')[3];

    useEffect(() => {
        getComments();
    },[props.newComment])

const getComments = async () => {
    try {
        await axios.get(GET_ALL_POSTS + '/' + postId + '/get-comments', {
            headers: {
                Authorization: jwt
            }
        }).then(res => {
            setComments(res.data);
        })
    } catch(e) {
        console.log(e);
    }
}

    return(
        <IonList>
            <IonGrid className="ion-margin-right">
                {comments &&
                comments.map((comment) => {
                    return(
                        <IonRow key={comment.id}>
                            <IonAvatar className="comment-avatar">
                                {comment.user.img_uri ? 
                                <IonImg src={comment.user.img_uri} />
                                :
                                <IonImg src={avatar} />
                                }
                            </IonAvatar>
                            <IonCard className="comment-card">
                                <IonCardSubtitle color="warning">
                                    {comment.user.name}
                                </IonCardSubtitle>
                                <IonText className="comment-text">
                                    <p>{comment.text}</p>
                                </IonText>
                            </IonCard>
                        </IonRow>
                    )
                })}
            </IonGrid>
        </IonList>
    )
}

export default GetComment;