import { IonButtons, IonCol, IonIcon } from "@ionic/react"
import { heart, heartOutline } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import axios from '../../config/axios';
import { GET_ALL_POSTS } from "../../config/urls";
import { AuthContext } from "../../context/AuthContext";


const Like = (props) => {

    const [likeCount, setLikeCount] = useState();
    const [userLiked, setUserLiked] = useState(false);

    const {jwt} = useContext(AuthContext);
    
    const postId = window.location.pathname.split('/')[3];

    useEffect(() => {
        getLikes();
        sendLikeCount();
    },[likeCount, userLiked])

    const getLikes = async () => {
        try {
            await axios.get(GET_ALL_POSTS + '/' + postId + '/like-count', {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                setLikeCount(res.data.likes);
                if(!res.data.userLiked){
                    setUserLiked(false)
                } else {
                    setUserLiked(true)
                }
            })
        } catch(e) {
            console.log(e);
        }
    }

    const like = async () => {
        try {
            await axios.put(GET_ALL_POSTS + '/' + postId + '/like', {}, {
                headers: {
                    Authorization: jwt
                }
            }).then((res) => {
                console.log(res);
            })
        } catch(e) {
            console.log(e.response);
        }
    }

    const sendLikeCount = () => {
        props.sendToParent(likeCount)
    }


    return (
        <IonCol size="2">
            <IonButtons onClick={() => {
                like();
                setUserLiked(!userLiked)
                }}>
                {userLiked ?
                <IonIcon icon={heart} color="danger" className="post-icon" />
                :
                <IonIcon icon={heartOutline} color="primary" className="post-icon" />
                }
            </IonButtons>
        </IonCol>
    )
}

export default Like;