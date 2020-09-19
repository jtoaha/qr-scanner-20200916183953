import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import QRScanner from '../components/QRScanner';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>QR Scanner</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">QR Scanner</IonTitle>
          </IonToolbar>
        </IonHeader>
        <QRScanner name="QR Scanner" />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
