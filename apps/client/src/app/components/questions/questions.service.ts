/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question, QuestionType } from '../../_models';
import { HttpService } from '../../_services';
@Injectable()
export class QuestionsService {
  constructor(private httpService: HttpService) {}

  getQuestions(): Observable<HttpResponse<Question>> {
    return this.httpService.get('questions');
  }
  getQuestionTypes(): Observable<HttpResponse<QuestionType>> {
    return this.httpService.get('questions/types');
  }
  createQuestion(data: any): Observable<HttpResponse<Question>> {
    return this.httpService.post('questions', data);
  }
  updateQuestion(id: number, data: any): Observable<HttpResponse<Question>> {
    return this.httpService.patch('questions/' + id, data);
  }
  deleteQuestion(id: number): Observable<HttpResponse<any>> {
    return this.httpService.delete('questions/' + id);
  }
}
