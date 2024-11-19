import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { MonitoringIncidentResponse } from '../../model/dto/response/monitoringIncident.model';
import { CamerasService } from '../../services/cameras.service'; // Ajusta la ruta según tu estructura
import { CameraResponse } from '../../model/dto/response/cameraResponse.model'; // Ajusta la ruta según tu estructura
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  alertsGrouped: { date: string; alertsGroupedByCamera: { camera: string; alerts: ProcessedAlert[] }[] }[] = [];

  constructor(private camerasService: CamerasService) {}

  ngOnInit(): void {
    const token =  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb25zdHJ1Y3Rpb25jb3JwQGdtYWlsLmNvbSIsImlhdCI6MTczMTk5MTA2NCwiZXhwIjoxNzM0NTgzMDY0LCJyb2xlcyI6WyJ1c2VyIl19.cQod0nNHdeqt-WC_tZFTjxK-OtG5EFt8DorravU2l5A';
    localStorage.setItem('token', token); 
    localStorage.setItem('userId', '1');
    this.fetchAlerts();
  }

  // Método para obtener las alertas desde el servicio
  fetchAlerts(): void {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    this.camerasService.getCamerasByUserId(userId).subscribe({
      next: (cameras: CameraResponse[]) => {
        this.alertsGrouped = this.processAlerts(cameras);
      },
      error: (err) => {
        console.error('Error al obtener las cámaras:', err);
      }
    });
  }

  // Método para procesar las alertas
  processAlerts(cameras: CameraResponse[]): { date: string; alertsGroupedByCamera: { camera: string; alerts: ProcessedAlert[] }[] }[] {
    const alerts: ProcessedAlert[] = [];

    cameras.forEach((camera) => {
      camera.monitoringSessions.forEach((session) => {
        session.incidents.forEach((incident: MonitoringIncidentResponse) => {
          const date = moment(incident.detectedTime).format('YYYY-MM-DD');
          const time = moment(incident.detectedTime).format('HH:mm');
          alerts.push({
            date,
            time,
            camera: camera.cameraDevice,
            incidentType: incident.incidentType
          });
        });
      });
    });

    // Agrupar alertas por fecha
    const groupedByDate = alerts.reduce((result, alert) => {
      const dateLabel = this.getDateLabel(alert.date);
      if (!result[dateLabel]) {
        result[dateLabel] = [];
      }
      result[dateLabel].push(alert);
      return result;
    }, {} as Record<string, ProcessedAlert[]>);

    // Asegurarse de que todos los grupos de fecha tengan alertas por cámara
    const alertsGroupedByCamera = Object.keys(groupedByDate).map((date) => {
      const alertsByDate = groupedByDate[date];
      const groupedByCamera = alertsByDate.reduce((cameraResult, alert) => {
        if (!cameraResult[alert.camera]) {
          cameraResult[alert.camera] = [];
        }
        cameraResult[alert.camera].push(alert);
        return cameraResult;
      }, {} as Record<string, ProcessedAlert[]>);

      return {
        date,
        alertsGroupedByCamera: Object.keys(groupedByCamera).map(camera => ({
          camera,
          alerts: groupedByCamera[camera]
        }))
      };
    });

    return alertsGroupedByCamera;
  }

  // Método para obtener etiquetas de fecha como 'Today', 'Yesterday', o el día de la semana
  getDateLabel(date: string): string {
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');

    if (date === today) return 'Today';
    if (date === yesterday) return 'Yesterday';
    return moment(date).format('dddd'); // Ejemplo: 'Thursday'
  }
}

// Interfaz para alertas procesadas
interface ProcessedAlert {
  date: string;
  time: string;
  camera: string;
  incidentType: string;
}
