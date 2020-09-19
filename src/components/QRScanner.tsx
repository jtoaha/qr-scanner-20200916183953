import React from 'react';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import './QRScanner.css';

interface ContainerProps {
  name: string;
}

interface ContainerState {
  scanActive: boolean;
  scanResult: string;
  // videoElement: any;
}

class QRScanner extends React.Component<ContainerProps, ContainerState> {

  constructor(props: ContainerProps){
    super(props);
    this.state = {
      scanActive: false,
      scanResult: '',
      // videoElement: this.video.nativeElement
    }
  }
  startScan(){

  }

  stopScan(){
    this.setState({scanActive: false});
  }

  refresh(){
    this.setState({scanResult: ''});
  }

  render(){

  return (
    <div className="container">
      <strong>{this.props.name}</strong>
      <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      <p> Hello World!</p>

      {/* -- Fallback for iOS PWA -- */}
      {/* <input type="file" accept="image/*;capture=camera" hidden onChange={handleFile($event.target.files)}/> */}


      {/* --Trigger the file input-- */}
      <IonButton shape="round" onClick={this.startScan} color="primary">Scan</IonButton>
      <IonButton shape="round" onClick={this.refresh} color="warning">Reset</IonButton>

      {/* --Shows our camera stream-- */}
      <video hidden={!this.state.scanActive} width="100%"> </video>

      {/* --Used to render the camera stream images-- */}
      <canvas hidden></canvas>

      {/* --Stop our scanner preview if active-- */}
      {this.state.scanActive ? <IonButton shape="round" onClick={this.stopScan} color="danger">Reset</IonButton>: null}

      {/* --Display scanner result-- */}
      <IonCard>
        <IonCardHeader>
        <IonCardTitle>QR Scan Result:</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>{this.state.scanResult}</IonCardContent>
     </IonCard>
    </div>

  );
  }
}

export default QRScanner;
