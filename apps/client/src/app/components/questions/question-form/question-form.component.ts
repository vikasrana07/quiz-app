/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { combineLatest } from 'rxjs';
import { QuestionsService } from '../questions.service';
import { AlertService, LoaderService } from '../../../_services';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../categories/categories.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { Category, Question, QuestionType } from '../../../_models';

@Component({
  selector: 'quiz-app-question-form',
  templateUrl: './question-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    EditorModule,
    DropdownModule,
    InputTextModule,
    CommonModule,
  ],
  providers: [CategoriesService],
})
export class QuestionFormComponent implements OnInit {
  isSubmitted!: boolean;
  questionForm: FormGroup | any;
  categories!: Category[];
  questionTypes!: QuestionType[];
  answers: any = [];
  @Input() action!: string;
  @Input() selectedRow!: Question;
  @Output() onAddUpdate: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private questionsService: QuestionsService,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {
    this.createQuestionForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.init();
    });
  }
  preSelect() {
    if (this.action == 'edit') {
      const options = this.selectedRow.options.split(',');
      options.forEach((option: string, index: number) => {
        this.addOption(index, option);
      });
      const index = options.findIndex((option) => {
        return option == this.selectedRow.answer;
      });
      this.questionForm.patchValue({
        question: this.selectedRow.question,
        answer: index,
        categoryId: this.selectedRow.categoryId,
        questionTypeId: this.selectedRow.questionTypeId,
      });
    } else {
      const options = [1, 2, 3, 4];
      options.forEach((_option: number, index: number) => {
        this.addOption(index);
      });
    }
  }
  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }
  newOption(value: string): FormGroup {
    return this.fb.group({
      name: new FormControl(value, [Validators.required]),
    });
  }

  addOption(index: number, value: any = '') {
    this.options.push(this.newOption(value));
    this.answers.push({
      id: index,
      name: 'Option ' + (index + 1),
    });
  }
  removeOption(i: number) {
    this.options.removeAt(i);
  }
  init() {
    this.loaderService.start();
    combineLatest({
      categories: this.categoriesService.getCategories(),
      questionTypes: this.questionsService.getQuestionTypes(),
    }).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.categories = response.categories.params;
        this.questionTypes = response.questionTypes.params;
        this.preSelect();
      },
      error: (error: any) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
  createQuestionForm() {
    this.questionForm = new FormGroup({
      question: new FormControl('', [Validators.required]),
      questionTypeId: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      options: this.fb.array([]),
      answer: new FormControl('', [Validators.required]),
    });
  }
  get formControls(): any {
    return this.questionForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.questionForm.invalid) {
      return;
    }
    const data: any = {
      question: this.formControls.question.value,
      category: this.formControls.categoryId.value,
      questionType: this.formControls.questionTypeId.value,
    };
    const options: any = [];
    this.formControls?.options?.value?.forEach((element: any) => {
      options.push(element.name);
    });
    data.answer = options[this.formControls.answer.value];
    data.options = options.join(',');
    const hasDuplicates = (options: any) =>
      options.length !== new Set(options).size;
    if (hasDuplicates(options)) {
      this.alertService.error('Please enter unique value for options');
      return;
    }
    if (this.action == 'add') {
      this.createQuestion(data);
    } else {
      this.updateQuestion(data);
    }
  }
  createQuestion(data: any) {
    this.loaderService.start();
    this.questionsService.createQuestion(data).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.alertService.success(response['message']);
        const dataToEmit = response;
        dataToEmit.action = this.action;
        const category = this.categories.find(
          (item: any) => item.id == response.params.category
        );
        const questionType = this.questionTypes.find(
          (item: any) => item.id == response.params.questionType
        );
        if (category) {
          dataToEmit.params.categoryId = category.id;
          dataToEmit.params.categoryName = category.name;
        }
        if (questionType) {
          dataToEmit.params.questionTypeId = questionType.id;
          dataToEmit.params.questionTypeName = questionType.name;
        }
        this.onAddUpdate.emit(dataToEmit);
      },
      error: (error: any) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
  updateQuestion(data: any) {
    this.loaderService.start();
    this.questionsService.updateQuestion(this.selectedRow.id, data).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.alertService.success(response['message']);
        const dataToEmit = response;
        dataToEmit.action = this.action;
        const category = this.categories.find(
          (item: any) => item.id == response.params.category.id
        );
        const questionType = this.questionTypes.find(
          (item: any) => item.id == response.params.questionType.id
        );
        if (category) {
          dataToEmit.params.categoryId = category.id;
          dataToEmit.params.categoryName = category.name;
        }
        if (questionType) {
          dataToEmit.params.questionTypeId = questionType.id;
          dataToEmit.params.questionTypeName = questionType.name;
        }
        this.onAddUpdate.emit(dataToEmit);
      },
      error: (error: any) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
}
