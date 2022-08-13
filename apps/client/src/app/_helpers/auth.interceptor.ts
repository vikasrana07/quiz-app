import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticationService } from '../_services';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add header with basic auth credentials if user is logged in and request is to the api url
    const token = this.authenticationService.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (request.url.includes('generateToken')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/x-www-form-urlencoded',
          'correlationid': `${uuidv4()}`
        }
      });
    } else {
      if (token && isApiUrl) {
        request = request.clone({
          setHeaders: {
            'authorization': `Bearer ${token}`,
            'content-type': 'application/json',
            'correlationid': `${uuidv4()}`
          }
        });
      }
    }
    return next.handle(request);
  }
}
