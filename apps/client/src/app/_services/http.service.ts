import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  url: string;
  constructor(public httpClient: HttpClient) {
    this.url = environment.apiUrl;
  }

  post(apiRoute: string, body: any): Observable<any> {
    return this.httpClient.post(`${this.url + apiRoute}`, body, { headers: this.getHttpHeaders() });
  }

  get(apiRoute: string): Observable<any> {
    const params: any = {};
    params.headers = this.getHttpHeaders();
    return this.httpClient.get(`${this.url + apiRoute}`, params);
  }

  put(apiRoute: string, body: any): Observable<any> {
    return this.httpClient.put(`${this.url + apiRoute}`, body, { headers: this.getHttpHeaders() });
  }

  delete(apiRoute: string): Observable<any> {
    return this.httpClient.delete(`${this.url + apiRoute}`, { headers: this.getHttpHeaders() });
  }

  getHttpHeaders(): HttpHeaders {
    return new HttpHeaders().set('key', 'value');
  }
}