/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { QuestionsService } from '../questions.service';
import { AlertService, LoaderService } from '../../../_services';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../categories/categories.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'quiz-app-question-form',
  templateUrl: './question-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DropdownModule, CommonModule],
  providers: [CategoriesService]
})
export class QuestionFormComponent implements OnInit {
  isSubmitted!: boolean;
  selectedRow: any;
  employeeUsers: any;
  customers: any;
  questionForm: FormGroup | any;;
  itemSize = 30;
  user: any;
  categories: any;
  constructor(
    private categoriesService: CategoriesService,
    private questionsService: QuestionsService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.selectedRow = config.data.selectedRow;
    this.createQuestionForm();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getCategories();
    });
  }
  getCategories() {
    this.loaderService.start();
    this.categoriesService
      .getCategories()
      .subscribe({
        next: (response: any) => {
          this.categories = response.data;
          this.loaderService.stop();
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
  createQuestionForm() {
    this.questionForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required])
    });
  }
  get formControls(): any { return this.questionForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    if (this.questionForm.invalid) {
      return;
    }

    const data: any = {
      "name": this.formControls.name.value,
      "category": this.formControls.category.value
    }
    this.createQuestion(data);
    //this.updateAssociation(data);
  }
  createQuestion(data: any) {
    this.loaderService.start();
    this.questionsService
      .createQuestion(data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
          this.closeDialog(data);
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
  /*  updateAssociation(data) {
     this.loaderService.start();
     this.questionsService
       .updateAssociation(data)
       .pipe(first())
       .subscribe({
         next: () => {
           this.loaderService.stop();
           if (this.selectedRow) {
             this.alertService.success("Customer associations updated successfully.");
           } else {
             this.alertService.success("Customer associations created successfully.");
           }
           this.closeDialog(data);
         },
         error: (error: any) => {
           this.loaderService.stop();
           this.alertService.error(error);
         }
       });
   } */
  closeDialog(data?: any) {
    if (data) {
      data.allCustomers = this.customers;
    }
    this.ref.close(data);
  }
}
