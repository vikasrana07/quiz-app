/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../_models';
import { HttpService } from '../../_services';
@Injectable()
export class RolesService {
  constructor(
    private httpService: HttpService
  ) { }

  getRoles(): Observable<HttpResponse<Role>> {
    return this.httpService.get('roles');
  }
  createRole(data: any): Observable<HttpResponse<Role>> {
    return this.httpService.post('roles', data);
  }
  updateRole(id: number, data: any): Observable<HttpResponse<Role>> {
    return this.httpService.patch('roles/' + id, data);
  }
  deleteRole(id: number): Observable<HttpResponse<any>> {
    return this.httpService.delete('roles/' + id);
  }

}
