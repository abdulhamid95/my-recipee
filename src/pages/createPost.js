import { IonHeader, IonPage, IonToolbar, IonContent, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonIcon, IonButton, IonText, IonImg, IonToast, IonAlert, IonGrid, IonRow, IonCol } from "@ionic/react"
import { images } from "ionicons/icons";
import Header from "../components/Header/header";
import './styles/createPost.css'
import TextEditor from "../components/TextEditor/TextEditor";
import { useContext, useEffect, useRef, useState } from "react";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore, {Pagination, Navigation, Autoplay} from 'swiper';
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css';
import './styles/createPost.css'
import GetLocation from "../components/Location/GetLocation";
import axios from "../config/axios";
import { CREATE_POST } from "../config/urls";
import { AuthContext } from "../context/AuthContext";
import { useHistory } from "react-router";
import {EditorState} from 'draft-js'

const CreatePost = () => {

    const [steps, setSteps] = useState();
    const [photos, setPhotos] = useState([]);
    const [country, setCountry] = useState();
    const [region, setRegion] = useState();
    const [title, setTitle] = useState();
    const [contents, setContents] = useState();
    const [showImageToast, setShowImageToast] = useState(false);
    const [showContentToast, setShowContentToast] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const takePhotoRef = useRef();

    const {jwt} = useContext(AuthContext);

    const history = useHistory();

    const {takePhoto, blobUrl} = usePhotoGallery();

    SwiperCore.use([Pagination, Navigation, Autoplay]);

    useEffect(() => {
        if(blobUrl){
            const imgUrls = [blobUrl, ...photos]
            setPhotos(imgUrls);
        }
    },[blobUrl]);

    const onSubmit = async () => {
        const postData = new FormData();
        try {
            postData.append('title', title)
            postData.append('contents', contents)
            postData.append('steps', steps)
            postData.append('country', country)
            postData.append('region', region)
            for(let i = 0; i < photos.length; i++) {
                const response = await fetch(photos[i])
                const blob = await response.blob()
                postData.append('postImg', blob);
            }

            await axios.post(CREATE_POST, postData, {
                headers: {
                    Authorization: jwt
                }
            }).then(res => {
                setPhotos([]);
                setTitle("");
                setContents("");
                setShowAlert(true);
            })
        } catch(e) {
            console.log(e);
        }
    }

    const validator = () => {
        if(photos.length > 0) {
            if(title && contents && steps) {
                onSubmit()
            } else {
                setShowContentToast(true);
            }
        } else {
            setShowImageToast(true);
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
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                cssClass='my-custom-class'
                header={'عملية النشر تمت بنجاح'}
                message={'لقد تم نشر المنشور، هل ترغب بالانتقال لصفحة المنشورات؟'}
                buttons={[
                    {
                        text: 'موافق',
                        handler: () => {
                            history.push('/my-recipe/all-posts')
                        }
                    }
                ]}
            />
            <Header headerTitle="نشر منشور" />
            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol size-md="7" offset-md="1">
                        <IonList>
                            <IonItem>
                                <IonLabel position="floating" color="warning">العنوان</IonLabel>
                                <IonInput
                                value={title} 
                                onIonChange={(e) => {setTitle(e.target.value)}} 
                                />
                            </IonItem>
                            <IonItem className="ion-margin-bottom">
                                <IonLabel position="floating" color="warning">المكونات</IonLabel>
                                <IonTextarea 
                                value={contents}
                                onIonChange={(e) => {setContents(e.target.value)}}
                                />
                            </IonItem>
                            <IonLabel className="ion-margin">خطوات التحضير</IonLabel>
                            <IonItem className="ion-margin">
                                <TextEditor sendToParent={setSteps} editorState={EditorState.createEmpty()} />
                            </IonItem>
                            <IonItem lines="none" ref={takePhotoRef} onClick={takePhoto}>
                                <IonText>اضغط هنا لإضافة صورة</IonText>
                            </IonItem>
                            <IonItem lines="none" className="ion-margin-bottom">
                                {photos.length > 0 ? 
                                    <Swiper {...settings_swiper}>
                                    {photos.map((img, index) => {
                                        return(
                                            <SwiperSlide key={index}>
                                                <IonImg src={img} onClick={() => takePhotoRef.current.click()} />
                                            </SwiperSlide>
                                        )
                                    })}
                                    </Swiper>
                                    :
                                    <div className="icon-container">
                                        <IonIcon icon={images} color="primary" className="icon-images" onClick={() => takePhotoRef.current.click()} />
                                    </div>
                                }
                            </IonItem>
                            <GetLocation country={setCountry} region={setRegion} />
                            <IonButton expand="block" className="ion-margin" onClick={validator}>
                                نشر
                            </IonButton>
                            </IonList>
                            <IonToast 
                            isOpen={showImageToast} 
                            onDidDismiss={() => setShowImageToast(false)}
                            message="يجب عليك إدخال صورة على الأقل"
                            duration={1500}
                            color="danger"
                            />
                            <IonToast 
                            isOpen={showContentToast} 
                            onDidDismiss={() => setShowContentToast(false)}
                            message="يجب عليك إدخال جميع الحقول"
                            duration={1500}
                            color="danger"
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default CreatePost;