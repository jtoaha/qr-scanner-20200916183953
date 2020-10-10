import React, { createRef } from 'react';
import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import './QRScanner.css';
import jsQR from 'jsqr';


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
  private fileInput: any;
  // loading: HTMLIonLoadingElement = null;

  private canvasElement: any;
  private canvasContext: any;
  private videoElement: any;
  private stream: any;
  // private loading!: HTMLIonLoadingElement;

  constructor(props: ContainerProps) {
    super(props);
    this.state = {
      scanActive: false,
      scanResult: '',
      videoSrc: ''
    }

    this.videoError = this.videoError.bind(this);
    this.startScan = this.startScan.bind(this);
    this.scan = this.scan.bind(this);
    this.stopScan = this.stopScan.bind(this)
    this.refresh = this.refresh.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
  }

  componentDidMount() {
    //  this.canvasElement = this.canvas.current!
    //  this.videoElement = this.video.current!
    //  this.canvasContext = this.canvasElement.getContext('2d')
  }

  async componentDidUpdate() {
    this.canvasElement = this.canvas.current!
    this.videoElement = this.video.current!
    this.canvasContext = this.canvasElement.getContext('2d')
    this.fileInput = document.getElementById('file-input')
  }


  videoError() {

  }

  updateVideoStream() {

  }


  /*
   startScan sets up the stream and then sets up a continuous call to scan via requestAnimationFrame
  */
  async startScan() {
    // Not working on iOS standalone mode!
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });

    this.setState({ scanActive: true });

    this.videoElement.srcObject = this.stream;
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
          scanResult: code.data
        });
        //this.showQrToast();
      } else {
        if (this.state.scanActive) {
          requestAnimationFrame(this.scan);
        }
        // else {
        //   this.videoElement.srcObject = null;
        // }
      }
    } else {
      requestAnimationFrame(this.scan);
    }
  }

  /**
   * stops scan when user presses corresponding button.
   * - stops stream and sets the state of scanActive to false
   */
  stopScan() {
    this.videoElement.setAttribute('playsinline', false);
    this.stream.getTracks()[0].stop();
    this.setState({ scanActive: false });
  }

  refresh() {
    this.stream.getTracks()[0].stop();
    this.setState({ scanResult: '', scanActive: false });
  }


  handleFile(event: React.ChangeEvent<HTMLElement>): void {
    const file = this.fileInput.files.item(0);

    var img = new Image();
    img.onload = () => {
      this.canvasContext.drawImage(img, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code) {
        this.setState({ scanResult: code.data });
        // this.showQrToast();
      }
    };
    img.src = URL.createObjectURL(file);
  }

  uploadImage() {
    this.fileInput.click();
  }


  render() {
    console.log(this.videoElement, "jooo")
    return (
      <div className="container">
        <strong>{this.props.name}</strong>
        <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
        <p> Hello World!</p>

        {/* -- Fallback for iOS PWA -- */}
        <input id="file-input" type="file" accept="image/*;capture=camera" hidden onChange={this.handleFile} ref={this.fileInput} />


        {/* --Trigger the file input-- */}
        <IonButton id="camera" shape="round" onClick={this.uploadImage} color="primary">Upload Image</IonButton>  - or -
        <IonButton id="qr-scanner" shape="round" onClick={this.startScan} color="primary">Start Scan</IonButton> <br />
        <IonButton id="refresh" shape="round" onClick={this.refresh} color="warning">Reset</IonButton>

        {/* --Shows our camera stream-- */}
        {/* <video width="50%" ref={this.video} autoPlay={true}/> */}

        <video hidden={!this.state.scanActive} width="100%" ref={this.video} autoPlay={true} />
        {/* <Video videoRef={this.video} srcObject={new MediaStream()}/> */}

        {/* --Used to render the camera stream images-- */}
        <canvas hidden ref={this.canvas}></canvas>

        {/* --Stop our scanner preview if active-- */}
        {this.state.scanActive ? <IonButton shape="round" onClick={this.stopScan} color="danger">Stop Scan</IonButton> : null}

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
