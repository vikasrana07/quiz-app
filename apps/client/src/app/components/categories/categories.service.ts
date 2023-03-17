/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../../_models';
import { HttpService } from '../../_services';
@Injectable()
export class CategoriesService {
  constructor(private httpService: HttpService) {}

  getCategories(): Observable<HttpResponse<Category>> {
    return this.httpService.get('categories');
  }

  createCategory(data: any): Observable<HttpResponse<any>> {
    return this.httpService.post('categories', data);
  }
  updateCategory(id: number, data: any): Observable<HttpResponse<any>> {
    return this.httpService.patch('categories/' + id, data);
  }
  deleteCategory(id: number): Observable<HttpResponse<any>> {
    return this.httpService.delete('categories/' + id);
  }
}
