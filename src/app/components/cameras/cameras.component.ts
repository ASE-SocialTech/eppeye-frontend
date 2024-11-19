import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil, WebcamModule } from 'ngx-webcam';
import { CamerasService } from '../../services/cameras.service';
import { FormsModule } from '@angular/forms';
import moment from 'moment';


// Interfaz para alertas procesadas
interface ProcessedAlert {
  time: string;
  camera: string;
  incidentType: string;
}

@Component({
  selector: 'app-cameras',
  standalone: true,
  imports: [FormsModule, CommonModule, WebcamModule], 
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent implements OnInit {
  private trigger: Subject<void> = new Subject<void>();
  public webcamImage: WebcamImage | null = null;
  public multipleWebcamsAvailable = false;
  public triggerObservable: Observable<void> = this.trigger.asObservable();

  cameras: any[] = [];
  selectedCamera: any = null;
  alertsToday: ProcessedAlert[] = []; // Filtrado solo por alertas del día
  safetyHelmet: boolean = false;
  reflectiveVest: boolean = false;
  safetyGloves: boolean = false;

  @ViewChild('cameraFeed') cameraFeed!: ElementRef<HTMLVideoElement>;
  isCameraActive = false;

  constructor(private camerasService: CamerasService) {}

  ngOnInit(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.camerasService.getCamerasByUserId(userId).subscribe((cameras) => {
      this.cameras = cameras;
    });

    // Verificar si hay múltiples webcams disponibles
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

  onCameraSelect(event: any): void {
    const cameraId = event.target.value;
    this.camerasService.getCameraById(cameraId).subscribe((camera) => {
      this.selectedCamera = camera;

      // Obtener alertas solo para el día de hoy
      this.camerasService.getCameraById(cameraId).subscribe((alerts) => {
        this.alertsToday = this.filterAlertsForToday(alerts.monitoringSessions);
      });

      this.startCamera();
    });
  }

  // Filtrar alertas solo del día actual
  filterAlertsForToday(sessions: any[]): ProcessedAlert[] {
    const today = moment().startOf('day'); // Aseguramos que solo comparamos la fecha (sin hora)
    console.log('today', today);
    const alerts: ProcessedAlert[] = [];
  
    sessions.forEach((session) => {
      session.incidents.forEach((incident: any) => {
        const incidentDate = moment(incident.detectedTime).startOf('day'); // Convertimos la fecha de la alerta a "inicio del día"
  
        // Solo agregar alertas que ocurrieron hoy
        if (incidentDate.isSame(today, 'day')) {  // Comparamos solo la parte de la fecha (día)
          const time = moment(incident.detectedTime).format('HH:mm');
          alerts.push({
            time,
            camera: incident.camera || 'Unknown',
            incidentType: incident.incidentType || 'Unknown',
          });
        }
        console.log('Today:', today.format('YYYY-MM-DD'));
        console.log('Incident Date:', incidentDate.format('YYYY-MM-DD'));

      });
    });
  
    return alerts;
  }
  

  startCamera(): void {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('Camera API is not supported in this browser.');
      return;
    }

    const constraints = {
      video: {
        deviceId: this.selectedCamera?.id ? { exact: this.selectedCamera.id } : undefined,
      },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.isCameraActive = true;
        const videoElement = this.cameraFeed.nativeElement;
        videoElement.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
        this.isCameraActive = false;
      });
  }

  onSave(): void {
    const safetyData = {
      safetyHelmet: this.safetyHelmet,
      reflectiveVest: this.reflectiveVest,
      safetyGloves: this.safetyGloves,
    };
    console.log('Safety settings saved:', safetyData);
    // Aquí puedes implementar lógica para guardar esta información en tu backend.
  }
}
