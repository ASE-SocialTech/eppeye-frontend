import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CamerasComponent } from './components/cameras/cameras.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { SettingsComponent } from './components/settings/settings.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'cameras', component: CamerasComponent },
  { path: 'alerts', component: AlertsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: '**', redirectTo: '/home' } 
];
