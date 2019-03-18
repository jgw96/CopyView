import { Component, Element, Prop } from '@stencil/core';

import { identify, getText } from '../../services/vision';

declare var ImageCapture: any;

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css'
})
export class AppHome {

  @Element() el: HTMLElement;

  @Prop({ connect: 'ion-loading-controller' }) loadingCtrl: HTMLIonLoadingControllerElement | null = null;
  @Prop({ connect: 'ion-action-sheet-controller' }) actionSheetCtrl: HTMLIonActionSheetControllerElement | null = null;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement | null = null;

  stream: MediaStream;
  imageCapture: any;

  async componentDidLoad() {
    const constraints = {
      video: { facingMode: "environment" },
      audio: false
    };

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('here');

      const video = this.el.querySelector("video");
      video.srcObject = this.stream;
      console.log(video);


      this.imageCapture = new ImageCapture(this.stream.getVideoTracks()[0]);
      /* use the stream */
    } catch (err) {
      /* handle the error */
      console.error(err);
    }
  }

  async takePhoto() {
    if (this.imageCapture) {
      const loading = await this.loadingCtrl.create({
        message: 'Thinking...'
      });
      await loading.present();

      const imageBlob = await this.imageCapture.takePhoto();

      try {
        const idTextCall = await identify(imageBlob);
        console.log(idTextCall);

        setTimeout(async () => {
          const data = await getText(idTextCall);

          console.log(data.recognitionResult.lines.join())

          const fullTextArray = [];
          data.recognitionResult.lines.forEach((line) => {
            fullTextArray.push(line.text);
          });

          const text = fullTextArray.join();
          this.displayText(text);

          await loading.dismiss();
        }, 5000);

      }
      catch (err) {
        await loading.dismiss();
        console.error(err);
      }
    }
  }

  async displayText(text: string) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: "Text Seen",
      subHeader: `${text}\n`,
      buttons: [
        {
          text: 'Share',
          icon: 'share',
          handler: () => {
            console.log('Share clicked');

            if ((navigator as any).share) {
              (navigator as any).share({
                title: 'Check this out: ',
                text: `${text}\n`
              })
            }
          }
        },
        {
          text: 'Copy',
          icon: 'copy',
          handler: async () => {
            if ((navigator as any).clipboard) {
              try {
                await (navigator as any).clipboard.writeText(`${text}\n`);
                
                const toast = await this.toastCtrl.create({
                  message: 'Text copied to clipboard',
                  duration: 1300
                });
                await toast.present();
              }
              catch (err) {
                console.error(err);
              }
            }
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    await actionSheet.present();
  }

  render() {
    return [
      <ion-content>
        <video autoplay></video>

        <ion-fab vertical="bottom" horizontal="center" slot="fixed">
          <ion-fab-button onClick={() => this.takePhoto()}>
            <ion-icon name="aperture"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-content>
    ];
  }
}
