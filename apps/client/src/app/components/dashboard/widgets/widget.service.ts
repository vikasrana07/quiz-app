/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../_services';
@Injectable()
export class WidgetService {
  constructor(protected httpService: HttpService) {}

  public getWidgetData(
    widgetCode: string,
    widgetType: string
  ): Observable<any> {
    return this.httpService.get('dashboards/' + widgetCode + '/' + widgetType);
  }
}
