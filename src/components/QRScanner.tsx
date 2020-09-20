import React, {createRef, VideoHTMLAttributes} from 'react';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import './QRScanner.css';
import jsQR from 'jsqr';


type PropsType = VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream
  refVideo: Object

}


interface ContainerProps {
  name: string;
}

interface ContainerState {
  scanActive: boolean;
  scanResult: string;
  videoSrc: string
}

class QRScanner extends React.Component<ContainerProps, ContainerState> {
private video = createRef<HTMLVideoElement>();
private canvas = createRef<HTMLCanvasElement>();
private fileInput = createRef<HTMLInputElement>();
// loading: HTMLIonLoadingElement = null;

private canvasElement: any;
private videoElement: any;
private canvasContext: any;
// private loading!: HTMLIonLoadingElement;

  constructor(props: ContainerProps){
    super(props);
    this.state = {
      scanActive: false,
      scanResult: '',
      videoSrc: ''
    }

    //this.handleVideo = this.handleVideo.bind(this);
    this.videoError = this.videoError.bind(this);
    this.startScan = this.startScan.bind(this);
    this.scan = this.scan.bind(this);
    this.stopScan = this.stopScan.bind(this)
    this.refresh = this.refresh.bind(this)

  }

  componentDidMount(){
     this.canvasElement = this.canvas.current!
     this.videoElement = this.video.current!
     this.canvasContext = this.canvasElement.getContext('2d')



    }

  componentDidUpdate(){
    this.canvasElement = this.canvas.current!
    this.videoElement = this.video.current!
    this.canvasContext = this.canvasElement.getContext('2d')
  }

  // handleVideo (stream: MediaStream):void {
  //   // Update the state, triggering the component to re-render with the correct stream

  //   try {
  //     const srcObject = stream;
  //   } catch (error) {
  //     const  src = window.URL.createObjectURL(stream);
  //     this.setState({ videoSrc: src});
  //   }


  // }

  videoError (){

  }

  updateVideoStream() {

  }

  captureImage(){

  }

  async startScan(){
  // Not working on iOS standalone mode!
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });


    console.log(stream, "STREAAM")


    //wait this.handleVideo(stream)

    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);

    // this.loading = await this.loadingCtrl.create({});
    // await this.loading.present();


    this.videoElement.play();
    requestAnimationFrame(this.scan);
  }

  async scan() {
    console.log(this.canvas, "TESTING")
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      // if (this.loading) {
      //   await this.loading.dismiss();
      //   this.loading = null;
        this.setState({scanActive: true});
      // }



      this.canvasElement.height = this.videoElement.videoHeight;
      this.canvasElement.width = this.videoElement.videoWidth;

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      console.log(code);
      if (code) {
        this.setState({
          scanActive: false,
          scanResult: code.data});
        //this.showQrToast();
      } else {
        if (this.state.scanActive) {
          requestAnimationFrame(this.scan);
        }
      }
    } else {
      requestAnimationFrame(this.scan);
    }
  }

  stopScan(){
    this.setState({scanActive: false});
  }

  refresh(){
    this.setState({scanResult: ''});
  }

  handleFile(event: React.ChangeEvent<HTMLElement>): void{
    //e.target.value
  }

  render(){
    console.log(this.videoElement, "jooo")
  return (
    <div className="container">
      <strong>{this.props.name}</strong>
      <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      <p> Hello World!</p>

      {/* -- Fallback for iOS PWA -- */}
      <input type="file" accept="image/*;capture=camera" hidden onChange={this.handleFile} ref={this.fileInput}/>


      {/* --Trigger the file input-- */}
      <IonButton id="camera" shape="round" onClick={this.captureImage} color="primary">Capture Image</IonButton>
      <IonButton id="qr-scanner" shape="round" onClick={this.startScan} color="primary">Start Scan</IonButton>
      <IonButton id="refresh" shape="round" onClick={this.refresh} color="warning">Reset</IonButton>

      {/* --Shows our camera stream-- */}
      {/* <video width="50%" ref={this.video} autoPlay={true}/> */}

      <video hidden={!this.state.scanActive} width="100%" ref={this.video} autoPlay={true}/>
      {/* <Video videoRef={this.video} srcObject={new MediaStream()}/> */}

      {/* --Used to render the camera stream images-- */}
      <canvas hidden ref={this.canvas}></canvas>

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
