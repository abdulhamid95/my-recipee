import { IonItem, IonLabel, IonInput } from "@ionic/react";
import { Geolocation } from '@capacitor/geolocation';
import { useEffect, useState } from "react";
import axios from "axios";

const GetLocation = (props) => {

    const [region, setRegion] = useState('جاري جلب المنطقة ...');
    const [country, setCountry] = useState('جاري جلب الدولة ...');

    useEffect(() => {
        printCurrentPosition()
    },[])

    useEffect(() => {
        handleLocation()
    },[country, region])

    const printCurrentPosition = async () => {
        try {
            const coordinates = await Geolocation.getCurrentPosition();
            await axios.get(
                `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.coords.latitude}&lon=${coordinates.coords.longitude}&format=json&accept-language=ar`
                ).then(res => {
                    setCountry(res.data.address.country);
                    setRegion(res.data.address.region);
            })
        } catch(e) {
            console.log(e);
            setCountry("")
            setRegion("")
        }
    };

    const handleLocation = () => {
        props.country(country)
        props.region(region)
    }

      
    return(
        <IonItem>
            <IonLabel color="warning">الدولة</IonLabel>
            <IonInput value={country} disabled />
            <IonLabel color="warning">المنطقة</IonLabel>
            <IonInput value={region} disabled />
        </IonItem>
    )
}

export default GetLocation;
