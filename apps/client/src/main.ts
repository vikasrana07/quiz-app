// main.ts

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';

import { environment } from './environments/environment';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthInterceptor, ErrorInterceptor } from './app/_helpers';

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  PB_DIRECTION,
} from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsSize: 20,
  pbColor: "#1e8a95",
  fgsColor: "#1e8a95",
  bgsType: SPINNER.rectangleBounce,
  fgsType: SPINNER.threeStrings,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
  text: 'Please wait...',
  gap: 10
};

const logger = {
  level: environment.production ? NgxLoggerLevel.OFF : NgxLoggerLevel.DEBUG
};


if (environment.production) {
  enableProdMode();
}
bootstrapApplication(AppComponent, {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    importProvidersFrom(RouterModule.forRoot(APP_ROUTES)),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)),
    importProvidersFrom(LoggerModule.forRoot(logger)),
    MessageService,
    ConfirmationService
  ]
});