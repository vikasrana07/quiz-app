/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../../_models';
import { HttpService } from '../../_services';
@Injectable()
export class QuizzesService {
  constructor(private httpService: HttpService) {}

  getQuizzes(): Observable<HttpResponse<Quiz>> {
    return this.httpService.get('quizzes');
  }

  createQuiz(data: any): Observable<HttpResponse<Quiz>> {
    return this.httpService.post('quizzes', data);
  }
  updateQuiz(id: number, data: any): Observable<HttpResponse<Quiz>> {
    return this.httpService.patch('quizzes/' + id, data);
  }
  deleteQuiz(id: number): Observable<HttpResponse<any>> {
    return this.httpService.delete('quizzes/' + id);
  }
}
