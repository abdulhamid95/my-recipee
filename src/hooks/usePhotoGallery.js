import {
    Camera,
    CameraResultType,
    CameraSource
} from "@capacitor/camera";
import { useState } from "react";

export function usePhotoGallery () {

    const [blobUrl, setBlobUrl] = useState();

    const takePhoto = async () => {
        try {
            const cameraPhoto = await Camera.getPhoto({
                resultType: CameraResultType.Uri,
                source: CameraSource.Prompt,
                quality: 70,
                promptLabelHeader: 'صورة',
                promptLabelPhoto: 'من ملفات الصور',
                promptLabelPicture: 'التقط صورة'
            });
            setBlobUrl(cameraPhoto.webPath);
        } catch(e) {
            console.log("User canceled camera");
        }
    }

    return {
        takePhoto,
        blobUrl
    };
}