/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Setting } from '../../_models';
import { HttpService } from '../../_services';
@Injectable()
export class SettingsService {
  constructor(
    private httpService: HttpService
  ) { }

  getSettings(): Observable<HttpResponse<Setting>> {
    return this.httpService.get('settings');
  }
  updateSetting(data: any): Observable<HttpResponse<any>> {
    return this.httpService.patch('settings', data);
  }

}
