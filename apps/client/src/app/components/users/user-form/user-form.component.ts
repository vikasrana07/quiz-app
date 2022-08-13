/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { UsersService } from '../users.service';
import { AlertService, LoaderService } from '../../../_services';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'quiz-app-user-form',
  templateUrl: './user-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DropdownModule, InputTextModule, CommonModule]
})
export class UserFormComponent implements OnInit {
  isSubmitted!: boolean;
  selectedRow: any;
  userForm: FormGroup | any;;
  categories: any;
  constructor(
    private usersService: UsersService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.selectedRow = config.data;
    this.createuserForm();
  }

  ngOnInit(): void {
    this.preSelect();
  }
  preSelect() {
    if (Object.keys(this.selectedRow).length) {
      this.userForm.patchValue({
        firstName: this.selectedRow.firstName,
        lastName: this.selectedRow.lastName,
        username: this.selectedRow.username,
        email: this.selectedRow.email,
      });
    }
  }

  createuserForm() {
    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('')
    });
  }
  get formControls(): any { return this.userForm.controls; }

  onSubmit() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const data: any = {
      "firstName": this.formControls.firstName.value,
      "lastName": this.formControls.lastName.value,
      "username": this.formControls.username.value,
      "email": this.formControls.email.value
    }
    if (Object.keys(this.selectedRow).length) {
      this.updateUser(data);
    } else {
      this.createUser(data);
    }
  }
  createUser(data: any) {
    this.loaderService.start();
    this.usersService
      .createUser(data)
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
  updateUser(data: any) {
    this.loaderService.start();
    this.usersService
      .updateUser(this.selectedRow.id, data)
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
