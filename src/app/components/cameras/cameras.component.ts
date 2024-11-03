import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil, WebcamModule} from 'ngx-webcam';

@Component({
  selector: 'app-cameras',
  standalone: true,
  imports: [CommonModule, WebcamModule],
  templateUrl: './cameras.component.html',
  styleUrl: './cameras.component.css'
})
export class CamerasComponent {
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage | null = null;
  public multipleWebcamsAvailable = false;
  public triggerObservable: Observable<void> = this.trigger.asObservable();

  constructor() {
    WebcamUtil.getAvailableVideoInputs().then((mediaDevices: MediaDeviceInfo[]) => {
      this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public handleInitError(error: WebcamInitError): void {
    console.warn('Error initializing webcam: ', error);
  }

}
