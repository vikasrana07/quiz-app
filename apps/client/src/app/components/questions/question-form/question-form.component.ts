/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { QuestionsService } from '../questions.service';
import { AlertService, LoaderService } from '../../../_services';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../categories/categories.service';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'quiz-app-question-form',
  templateUrl: './question-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DropdownModule, InputTextModule, CommonModule],
  providers: [CategoriesService]
})
export class QuestionFormComponent implements OnInit {
  isSubmitted!: boolean;
  selectedRow: any;
  questionForm: FormGroup | any;;
  categories: any;
  answers: any = [];
  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private questionsService: QuestionsService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
    ,) {
    this.selectedRow = config.data;
    this.createQuestionForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getCategories();

      this.addOption();
      this.addOption();
      this.addOption();
      this.addOption();

      this.questionForm.get('options').controls.forEach((element: any, index: number) => {
        this.answers.push({
          id: index,
          name: "Option " + (index + 1)
        });
      });
    });

  }
  preSelect() {
    if (Object.keys(this.selectedRow).length) {
      this.questionForm.setValue({
        name: this.selectedRow.name,
        categoryId: this.selectedRow.categoryId
      });
    }
  }
  get options(): FormArray {
    return this.questionForm.get("options") as FormArray;
  }
  newOption(): FormGroup {
    return this.fb.group({
      name: new FormControl('', [Validators.required]),
    })
  }

  addOption() {
    this.options.push(this.newOption());
  }
  removeOption(i: number) {
    this.options.removeAt(i);
  }
  getCategories() {
    this.loaderService.start();
    this.categoriesService
      .getCategories()
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.categories = response.data;
          this.preSelect();
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
  createQuestionForm() {
    this.questionForm = new FormGroup({
      question: new FormControl('', [Validators.required]),
      categoryId: new FormControl('', [Validators.required]),
      options: this.fb.array([]),
      answer: new FormControl('', [Validators.required]),
    });
  }
  get formControls(): any { return this.questionForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    if (this.questionForm.invalid) {
      return;
    }
    const data: any = {
      "question": this.formControls.question.value,
      "category": this.formControls.categoryId.value
    }
    const options: any = [];
    this.formControls?.options?.value?.forEach((element: any) => {
      options.push(element.name);
    });
    data.answer = options[this.formControls.answer.value];
    data.options = options.join(",");
    if (Object.keys(this.selectedRow).length) {
      this.updateQuestion(data);
    } else {
      this.createQuestion(data);
    }
  }
  createQuestion(data: any) {
    this.loaderService.start();
    this.questionsService
      .createQuestion(data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
          const category = this.categories.find((item: any) => item.id == data.category);
          data.id = response?.data?.id;
          data.categoryId = category.id;
          data.categoryName = category.name;
          this.closeDialog(data);
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
  updateQuestion(data: any) {
    this.loaderService.start();
    this.questionsService
      .updateQuestion(this.selectedRow.id, data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
          const category = this.categories.find((item: any) => item.id == data.category);
          data.id = this.selectedRow.id;
          data.categoryId = category.id;
          data.categoryName = category.name;
          this.closeDialog(data);
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
  closeDialog(data?: any) {
    this.ref.close(data);
  }
}
