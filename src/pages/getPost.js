import { 
    IonPage,
    IonContent, 
    IonImg, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonIcon, 
    IonText, 
    IonCardSubtitle, 
    IonCard, 
    IonAvatar, 
    IonList, 
    IonListHeader, 
    IonItem, 
    IonItemDivider, 
    IonLoading 
} from "@ionic/react"
import Header from "../components/Header/header";
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Pagination, Navigation, Autoplay} from 'swiper';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css';
import { chatboxEllipsesOutline } from "ionicons/icons";
import './styles/getPost.css';
import avatar from './assets/images/avatar.png';
import axios from '../config/axios'
import { GET_ALL_POSTS } from "../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from 'moment';
import 'moment/locale/ar';
import Like from '../components/Like/Like';
import GetComment from '../components/Comment/GetComment';
import CreateComment from '../components/Comment/CreateComment';
import { Editor, EditorState, convertFromRaw } from "draft-js";

moment.locale('ar')

const GetPost = () => {

    const [post, setPost] = useState();
    const [showLoading, setShowLoading] = useState(false);
    const [likeCount, setLikeCount] = useState();
    const [newComment, setNewComment] = useState();
    const [editor, setEditor] = useState()

    const {jwt} = useContext(AuthContext);

    const postId = window.location.pathname.split('/')[3];

    SwiperCore.use([Pagination, Navigation, Autoplay]);

    useEffect(() => {
        getPost()
    },[])
    
    const getPost = async () => {
        setShowLoading(true)
        try {
            await axios.get(GET_ALL_POSTS + '/' + postId, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                setPost(res.data);
                const contentState = convertFromRaw(JSON.parse(res.data.steps));
                const editorState = EditorState.createWithContent(contentState);
                setEditor(editorState);
                setShowLoading(false)
            })
        } catch(e) {
            console.log(e);
            setShowLoading(false)
        }
    }

    const settings_swiper = {
        observer: true,
        observeParents: true,
        pagination: {
            clickable: true
        },
        navigation: true,
        autoplay: {
            delay: 3000,
        },
    }

    return (
        <IonPage>
            {showLoading ? 
            <IonLoading isOpen={showLoading} />
            : post &&
            <>
            <Header headerTitle={post.title} />
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="7" offset-md="1">
                            <Swiper {...settings_swiper}>
                                {post.post_images.map((img) => {
                                    return (
                                        <SwiperSlide key={img.id}><IonImg src={img.img_uri} /></SwiperSlide>
                                    )
                                })}
                            </Swiper>
                            <IonGrid>
                                <IonRow>
                                    <Like sendToParent={setLikeCount} />
                                    <IonCol size="3">
                                        <IonIcon icon={chatboxEllipsesOutline} color="primary" className="post-icon" />
                                    </IonCol>
                                </IonRow>
                                <IonRow>
                                    <IonCardSubtitle className="post-like">{likeCount} إعجاب</IonCardSubtitle>
                                </IonRow>
                            </IonGrid>
                            <IonCard className="ion-no-margin ion-margin-bottom">
                                <IonGrid>
                                    <IonRow className="ion-margin-top">
                                        <IonAvatar>
                                            {post.user.img_uri ? 
                                            <IonImg src={post.user.img_uri} />
                                            :
                                            <IonImg src={avatar} />
                                            }
                                        </IonAvatar>
                                        <IonCol>
                                            <IonCardSubtitle className="post-username">{post.user.name}</IonCardSubtitle>
                                            <IonCardSubtitle className="post-time" color="warning">{moment(post.createdAt).fromNow()}</IonCardSubtitle>
                                        </IonCol>
                                        <IonCol className="ion-text-center">
                                            <IonCardSubtitle>{post.country} ،</IonCardSubtitle>
                                            <IonCardSubtitle>{post.region}</IonCardSubtitle>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                <IonList className="ion-no-padding">
                                    <IonListHeader>
                                        <IonText color="primary">
                                            <h3>المكونات</h3>
                                        </IonText>
                                    </IonListHeader>
                                    <IonItem lines="none">
                                        <IonText>
                                            <p>{post.contents}</p>
                                        </IonText>
                                    </IonItem>
                                </IonList>
                                <IonList className="ion-no-padding">
                                    <IonListHeader>
                                        <IonText color="primary">
                                            <h3>خطوات التحضير</h3>
                                        </IonText>
                                    </IonListHeader>
                                    <IonItem lines="none">
                                        <IonText>
                                            <Editor editorState={editor} readOnly={true} />
                                        </IonText>
                                    </IonItem>
                                </IonList>
                            </IonCard>
                            <IonItemDivider color="light">
                                <IonText color="primary">
                                    <h3 className="ion-no-margin">التعليقات</h3>
                                </IonText>
                            </IonItemDivider>
                            <GetComment newComment={newComment} />
                            <IonItemDivider color="light">
                                <IonText color="primary">
                                    اكتب تعليقًا
                                </IonText>
                            </IonItemDivider>
                            <CreateComment sendToParent={setNewComment} />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            </>
            }
        </IonPage>
    )
}

export default GetPost;