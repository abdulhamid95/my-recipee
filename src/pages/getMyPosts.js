import { 
    IonPage, 
    IonContent, 
    IonButtons, 
    IonCard, 
    IonImg, 
    IonCardContent, 
    IonGrid, 
    IonRow, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonLoading, 
    IonIcon, 
    useIonActionSheet,
    IonAlert,
    IonCol
 } from "@ionic/react"
import Header from "./../components/Header/header";
import './styles/getMyPosts.css';
import axios from '../config/axios';
import { DELETE_POST, GET_MY_POSTS } from "../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from 'moment';
import 'moment/locale/ar';
import { useHistory } from "react-router";
import { ellipsisVertical } from "ionicons/icons";



moment.locale('ar')

const GetMyPosts = () => {

    const [showLoading, setShowLoading] = useState(false);
    const [posts, setPosts] = useState();
    const [postId, setPostId] = useState();
    const [showAlert, setShowAlert] = useState(false);

    const [present, dismiss] = useIonActionSheet();

    const {jwt} = useContext(AuthContext);

    const history = useHistory();

    useEffect(() => {
        getPosts();
    },[]);

    const getPosts = async () => {
        setShowLoading(true);
        try{
            await axios.get(GET_MY_POSTS, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                setPosts(res.data);
                setShowLoading(false)
            })
        } catch(e) {
            console.log(e);
            setShowLoading(false)
        }
    }

    const deletePost = async () => {
        try {
            await axios.delete(DELETE_POST, {
                data: {
                    'postId': postId
                },
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                console.log(res);
                getPosts()
            })
        } catch(e) {
            console.log(e);
        }
    } 

    return (
        <IonPage>
            {showLoading ? 
            <IonLoading isOpen={showLoading} />
            :
            posts &&
            <>
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                cssClass='my-custom-class'
                header={'تنبيه!'}
                message={'هل تود بالفعل حذف المنشور'}
                buttons={[
                    {
                        text: 'نعم',
                        handler: () => {
                            deletePost();
                        }
                    },
                    {
                        text: 'لا',
                        role: 'cancel'
                    }
                ]}
            />
            <Header headerTitle="منشوراتي" defaultHref="/my-recipe/all-posts" />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        {posts.length > 0 ?
                        posts.slice(0).reverse().map((post) => {
                            return (
                            <IonCol size="12" size-md="6" key={post.id}>
                                <IonCard className="ion-margin card">
                                    <IonImg src={post.post_images[0].img_uri} className="post-image" />
                                    <IonCardContent>
                                        <IonGrid>
                                            <IonRow className="ion-justify-content-between">
                                                <IonCardTitle color="primary" className="post-title">{post.title}</IonCardTitle>
                                                <IonButtons
                                                        onClick={() =>
                                                        present([{ text: 'تعديل المنشور',
                                                        handler: () => {
                                                            history.push(`/my-recipe/my-posts/${post.id}`);
                                                            } },
                                                            { text: 'الانتقال للمنشور',
                                                            handler: () => {
                                                            history.push(`/my-recipe/all-posts/${post.id}`);
                                                            } },
                                                            { text: 'حذف المنشور',
                                                            handler: () => {
                                                                setShowAlert(true);
                                                                setPostId(post.id);
                                                            }
                                                            },
                                                            {
                                                            text: 'إلغاء',
                                                            role: 'Cancel'
                                                        }], 'تفاصيل المنشور')
                                                    }>
                                                    <IonIcon icon={ellipsisVertical} className="post-icon" />
                                                </IonButtons>
                                            </IonRow>
                                        </IonGrid>
                                        <IonCardSubtitle className="post-contents">{post.contents}</IonCardSubtitle>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                            )
                        })
                        :
                        <IonCard className="ion-padding ion-text-center" >
                            <IonCardTitle color="primary">لايوجد منشورات لعرضها</IonCardTitle>
                        </IonCard>
                        }
                    </IonRow>
                </IonGrid>
            </IonContent>
            </>
            }
        </IonPage>
    )
}

export default GetMyPosts;