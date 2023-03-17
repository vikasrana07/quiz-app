/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MenuItem } from 'primeng/api';

import { DashboardWidgetCounterComponent } from '../widget-style/counter/counter.component';
import { DashboardWidgetPieChartComponent } from '../widget-style/pie-chart/pie-chart.component';
import { WidgetService } from '../widget.service';
import { DashboardService } from '../../dashboard.service';
import {
  AlertService,
  AuthenticationService,
  LoaderService,
} from '../../../../_services';

@Component({
  selector: 'quiz-app-configure-widget',
  templateUrl: './configure-widget.component.html',
  styleUrls: ['./configure-widget.component.css'],
})
export class ConfigureWidgetComponent implements OnInit {
  configureWidgetForm!: UntypedFormGroup;
  items!: MenuItem[];
  activeIndex = 0;
  widgetStyles: any;
  widgetTypes: any;
  public components: any;
  isFormSubmitted = false;
  isPreview = false;
  widget: any = {
    code: null,
    label: null,
    type: 'instant',
  };
  masterData: any = [];
  constructor(
    public authenticationService: AuthenticationService,
    public alertService: AlertService,
    public loaderService: LoaderService,
    public dashboardService: DashboardService,
    public widgetService: WidgetService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private formBuilder: UntypedFormBuilder
  ) {}
  ngOnInit(): void {
    this.masterData = [
      { code: 'categories', label: 'Categories' },
      { code: 'questions', label: 'Questions' },
    ];
    this.widgetStyles = [
      {
        id: 1,
        name: 'Counter',
        component: 'counter',
        icon: 'fa fa-stopwatch-20',
      },
      {
        id: 2,
        name: 'Pie Chart',
        component: 'pie-chart',
        icon: 'fa fa-pie-chart',
      },
    ];

    this.items = [
      {
        label: 'Widget Type',
        command: () => {
          this.activeIndex = 0;
        },
      },
      {
        label: 'Filters',
        command: () => {
          this.activeIndex = 1;
        },
      },
      {
        label: 'Widget Style',
        command: () => {
          this.activeIndex = 2;
        },
      },
    ];
    this.components = {
      counter: DashboardWidgetCounterComponent,
      'pie-chart': DashboardWidgetPieChartComponent,
    };

    this.configureWidgetForm = this.formBuilder.group({
      widgetCode: ['', Validators.required],
      labelName: [''],
      widgetStyle: [''],
      widgetType: [''],
    });
  }

  get formControls(): any {
    return this.configureWidgetForm.controls;
  }

  onSubmit() {
    /* const isValid = this.validateStep3();
    if (isValid) {
      this.loaderService.start();
      this.widget.label = this.formControls.labelName.value;;
      this.widget.created_by = this.user.userid;
      this.widget.modified_by = this.user.userid;
      this.dashboardService.configureWidget(this.configData.dashboardId, this.widget)
        .subscribe({
          next: () => {
            this.loaderService.stop();
            this.ref.close(this.widget);
          },
          error: (error: any) => {
            this.loaderService.stop();
            this.alertService.error(error);
          }
        });
    } */
  }
}
