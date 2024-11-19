import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CamerasService {
  private apiUrl = `${environment.apiUrl}/cameras`;

  constructor(private http: HttpClient) {}

  // Método para obtener cámara por ID y devolver solo 'data'
  getCameraById(id: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map((response) => response.data), // Devolvemos solo la propiedad 'data'
      catchError((error) => this.handleError(error))
    );
  }

  // Método para obtener cámaras por ID de usuario y devolver solo 'data'
  getCamerasByUserId(userId: number): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`, { headers }).pipe(
      map((response) => response.data), // Devolvemos solo la propiedad 'data'
      catchError((error) => this.handleError(error))
    );
  }

  // Método para crear cámara
  createCamera(camera: any): Observable<any> {
    const headers = this.createAuthHeaders();
    return this.http.post<any>(this.apiUrl, camera, { headers }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // Crear encabezados de autenticación
  private createAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Manejo de errores
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error.message || 'Something went wrong');
  }
}
