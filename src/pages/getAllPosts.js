import { IonHeader, IonPage, IonToolbar, IonContent, IonMenuButton, IonButtons, IonTitle, IonCard, IonImg, IonCardContent, IonAvatar, IonGrid, IonRow, IonCol, IonText, IonCardTitle, IonCardSubtitle, IonLoading, useIonRouter, IonRefresher, IonRefresherContent } from "@ionic/react"
import Header from "./../components/Header/header";
import avatar from './assets/images/avatar.png';
import './styles/getAllPosts.css';
import axios from '../config/axios';
import { GET_ALL_POSTS } from "../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from 'moment';
import 'moment/locale/ar';
import { useHistory } from "react-router";


moment.locale('ar')

const GetAllPosts = () => {

    const [showLoading, setShowLoading] = useState(false);
    const [posts, setPosts] = useState();

    const {jwt} = useContext(AuthContext);

    const ionRouter = useIonRouter()

    useEffect(() => {
        getPosts();
    },[ionRouter.routeInfo]);

    function doRefresh(event) {
        setTimeout(() => {
            getPosts();
        }, 1000);
    }

    const getPosts = async () => {
        setShowLoading(true);
        try{
            await axios.get(GET_ALL_POSTS, {
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

    return (
        <IonPage>
            {showLoading ? 
            <IonLoading isOpen={showLoading} />
            :
            posts &&
            <>
            <Header headerTitle="وصفاتي" defaultHref="/my-recipe/all-posts" />
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                    <IonRefresherContent
                    refreshingText="جاري جلب المنشورات...">
                    </IonRefresherContent>
                </IonRefresher>
                <IonGrid>
                    <IonRow>
                        {posts.length > 0 ?
                        posts.slice(0).reverse().map((post) => {
                            return (
                                <IonCol size="12" size-md="6" key={post.id}>
                                    <IonCard className="ion-margin card" routerLink={`/my-recipe/all-posts/${post.id}`}>
                                        <IonImg src={post.post_images[0].img_uri} className="post-image" />
                                        <IonCardContent>
                                            <IonGrid>
                                                <IonRow>
                                                    <IonAvatar className="post-avatar">
                                                        {post.user.img_uri ? 
                                                        <IonImg src={post.user.img_uri} />
                                                        :
                                                        <IonImg src={avatar} />
                                                        }
                                                    </IonAvatar>
                                                    <IonCol>
                                                        <IonText className="post-user">{post.user.name}</IonText>
                                                        <IonText className="post-moment" color="warning">{moment(post.createdAt).fromNow()}</IonText>
                                                    </IonCol>
                                                </IonRow>
                                                <IonCardTitle color="primary" className="post-title">{post.title}</IonCardTitle>
                                                <IonCardSubtitle className="post-contents">{post.contents}</IonCardSubtitle>
                                            </IonGrid>
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

export default GetAllPosts;