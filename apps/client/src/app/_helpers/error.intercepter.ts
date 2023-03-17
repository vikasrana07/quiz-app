/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthenticationService, LoaderService } from '../_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  isSessionExpired = false;
  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (
          err?.status === 401 &&
          (err?.error?.name === 'TokenExpiredError' ||
            err?.error?.message === 'invalid signature')
        ) {
          // auto logout if 401 response returned from api
          if (!this.isSessionExpired) {
            this.isSessionExpired = true;

            this.authenticationService
              .logoutOnSessionExpire()
              .pipe(first())
              .subscribe(() => {
                this.confirmationService.confirm({
                  header: 'Session Expired',
                  message: 'Your session has been expired, Please relogin!',
                  accept: () => {
                    this.isSessionExpired = false;
                    this.router.navigate(['/login']);
                  },
                  acceptLabel: 'Ok',
                  rejectVisible: false,
                });
              });
          }
        }
        if (err.status === 0) {
          this.loaderService.stop();
        }
        const error = err.error;
        return throwError(error);
      })
    );
  }
}
