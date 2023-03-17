/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dashboard } from '../../_models';
import { HttpService } from '../../_services';
@Injectable()
export class DashboardService {
  constructor(private httpService: HttpService) {}

  getDashboards(): Observable<HttpResponse<Dashboard>> {
    return this.httpService.get('dashboards');
  }
  createDashboard(payload: Dashboard): Observable<HttpResponse<Dashboard>> {
    return this.httpService.post('dashboards', payload);
  }

  updateDashboard(
    id: any,
    payload: Dashboard
  ): Observable<HttpResponse<Dashboard>> {
    return this.httpService.patch('dashboards/' + id, payload);
  }
  deleteDashboard(id: any): Observable<HttpResponse<Dashboard>> {
    return this.httpService.delete('dashboards/' + id);
  }
  saveWidgetPositions(
    id: number,
    payload: any
  ): Observable<HttpResponse<Dashboard>> {
    return this.httpService.patch('widgets/' + id, payload);
  }

  getDefaultDashboard(dashboards: any) {
    return dashboards.find(
      (item: { isPrimary: number }) => item.isPrimary === 1
    );
  }
}
