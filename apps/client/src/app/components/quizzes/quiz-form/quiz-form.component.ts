/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { QuizzesService } from '../quizzes.service';
import { AlertService, LoaderService } from '../../../_services';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../categories/categories.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { Quiz } from '../../../_models';

@Component({
  selector: 'quiz-app-quiz-form',
  templateUrl: './quiz-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CalendarModule,
    ButtonModule,
    EditorModule,
    DropdownModule,
    InputTextModule,
    CommonModule,
  ],
  providers: [CategoriesService],
})
export class QuizFormComponent implements OnInit {
  isSubmitted!: boolean;
  quizForm: FormGroup | any;
  @Input() action!: string;
  @Input() selectedRow!: Quiz;
  @Output() onAddUpdate: EventEmitter<any> = new EventEmitter();
  constructor(
    private quizzesService: QuizzesService,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {
    this.createQuizForm();
  }

  ngOnInit(): void {
    this.preSelect();
  }
  preSelect() {
    if (this.action == 'edit') {
      this.quizForm.patchValue({
        name: this.selectedRow.name,
        description: this.selectedRow.description,
        startTime: this.selectedRow.startTime,
        endTime: this.selectedRow.endTime,
      });
    }
  }

  createQuizForm() {
    this.quizForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
    });
  }
  get formControls(): any {
    return this.quizForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.quizForm.invalid) {
      return;
    }
    const data: any = {
      name: this.formControls.name.value,
      description: this.formControls.description.value,
      startTime: this.formControls.startTime.value,
      endTime: this.formControls.endTime.value,
    };

    if (this.action == 'add') {
      this.createQuiz(data);
    } else {
      this.updateQuiz(data);
    }
  }
  createQuiz(data: any) {
    this.loaderService.start();
    this.quizzesService.createQuiz(data).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.alertService.success(response['message']);
        const dataToEmit = response;
        dataToEmit.action = this.action;
        this.onAddUpdate.emit(dataToEmit);
      },
      error: (error: any) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
  updateQuiz(data: any) {
    this.loaderService.start();
    this.quizzesService.updateQuiz(this.selectedRow.id, data).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.alertService.success(response['message']);
        const dataToEmit = response;
        dataToEmit.action = this.action;
        this.onAddUpdate.emit(dataToEmit);
      },
      error: (error: any) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
}
