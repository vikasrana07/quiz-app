/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { CategoriesService } from '../categories.service';
import { AlertService, LoaderService } from '../../../_services';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'quiz-app-category-form',
  templateUrl: './category-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DropdownModule, CommonModule]
})
export class CategoryFormComponent implements OnInit {
  isSubmitted!: boolean;
  selectedRow: any;
  categoryForm: FormGroup | any;
  constructor(
    private categoriesService: CategoriesService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.selectedRow = config.data;
    this.createCategoryForm();
  }

  ngOnInit(): void {
    this.preSelect();
  }
  preSelect() {
    if (Object.keys(this.selectedRow).length) {
      this.categoryForm.setValue({
        name: this.selectedRow.name,
        categoryId: this.selectedRow.categoryId
      });
    }
  }
  createCategoryForm() {
    this.categoryForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }
  get formControls(): any { return this.categoryForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    if (this.categoryForm.invalid) {
      return;
    }

    const data: any = {
      "name": this.formControls.name.value
    }
    if (Object.keys(this.selectedRow).length) {
      this.updateCategory(data);
    } else {
      this.createCategory(data);
    }
  }
  createCategory(data: any) {
    this.loaderService.start();
    this.categoriesService
      .createCategory(data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
          data.id = response?.data?.id;
          this.closeDialog(data);
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
  updateCategory(data: any) {
    this.loaderService.start();
    this.categoriesService
      .updateCategory(this.selectedRow.id, data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response["message"]);
          data.id = this.selectedRow.id;
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
