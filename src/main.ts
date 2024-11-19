import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Import withInterceptorsFromDi

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule), // Import animations if using Angular Material
    provideHttpClient(withInterceptorsFromDi()) // Use withInterceptorsFromDi to apply interceptors
  ]
}).catch(err => console.error(err));
