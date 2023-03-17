/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { DashboardService } from '../dashboard.service';
import {
  AlertService,
  AuthenticationService,
  LoaderService,
} from '../../../_services';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';

import { Dashboard } from '../../../_models';

@Component({
  selector: 'quiz-app-dashboard-form',
  templateUrl: './dashboard-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    CommonModule,
  ],
})
export class DashboardFormComponent implements OnInit {
  isSubmitted!: boolean;
  dashboardForm: FormGroup | any;
  user: any;
  @Input() action!: string;
  @Input()
  selectedDashboard!: Dashboard;
  @Output() onAddUpdate: EventEmitter<any> = new EventEmitter();
  constructor(
    private authenticationService: AuthenticationService,
    private dashboardService: DashboardService,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.user = this.authenticationService.userData;
    this.createDashboardForm();
    if (this.action == 'edit') {
      this.preSelect();
    }
  }
  preSelect() {
    this.dashboardForm.patchValue({
      name: this.selectedDashboard.name,
      description: this.selectedDashboard.description,
      isPrimary: this.selectedDashboard.isPrimary == 1 ? true : false,
    });
  }

  createDashboardForm() {
    const formObj: any = {
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      isPrimary: new FormControl(''),
    };
    this.dashboardForm = new FormGroup(formObj);
  }
  get formControls(): any {
    return this.dashboardForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.dashboardForm.invalid) {
      return;
    }

    const data: any = {
      name: this.formControls.name.value,
      description: this.formControls.description.value,
      isPrimary: this.formControls.isPrimary.value ? 1 : 0,
      createdBy: this.user.userid,
      modifiedBy: this.user.userid,
    };
    if (this.action == 'add') {
      this.createDashboard(data);
    } else {
      this.updateDashboard(data);
    }
  }
  createDashboard(data: any) {
    this.loaderService.start();
    this.dashboardService.createDashboard(data).subscribe({
      next: (response: any) => {
        this.loaderService.stop();
        this.alertService.success(response['message']);
        const dataToEmit = response.data;
        dataToEmit.action = this.action;
        this.onAddUpdate.emit(dataToEmit);
      },
      error: (error: any) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
  updateDashboard(data: any) {
    this.loaderService.start();
    this.dashboardService
      .updateDashboard(this.selectedDashboard.id, data)
      .subscribe({
        next: (response: any) => {
          this.loaderService.stop();
          this.alertService.success(response['message']);
          const dataToEmit = response.data;
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
