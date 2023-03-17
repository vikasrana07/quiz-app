/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../_models';
import { HttpService } from '../../_services';
@Injectable()
export class UsersService {
  constructor(private httpService: HttpService) {}

  getUsers(): Observable<HttpResponse<User>> {
    return this.httpService.get('users');
  }
  createUser(data: any): Observable<HttpResponse<any>> {
    return this.httpService.post('users', data);
  }
  updateUser(id: number, data: any): Observable<HttpResponse<any>> {
    return this.httpService.patch('users/' + id, data);
  }
  deleteUser(id: number): Observable<HttpResponse<any>> {
    return this.httpService.delete('users/' + id);
  }
}
