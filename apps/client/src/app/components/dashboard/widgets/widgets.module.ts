/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { StepsModule } from 'primeng/steps';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DynamicModule } from 'ng-dynamic-component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';

import { DashboardWidgetCounterComponent } from './widget-style/counter/counter.component';
import { DashboardWidgetPieChartComponent } from './widget-style/pie-chart/pie-chart.component';

import { WidgetService } from './widget.service';
import { DashboardWidgetDefaultComponent } from './widget-type/default/default.component';
import { ConfigureWidgetComponent } from './configure-widget/configure-widget.component';

const widgets = [
  ConfigureWidgetComponent,
  DashboardWidgetDefaultComponent,
  DashboardWidgetCounterComponent,
  DashboardWidgetPieChartComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    NgxUiLoaderModule,
    TooltipModule,
    StepsModule,
    ConfirmDialogModule,
    ChartModule,
    CardModule,
    DynamicModule,
    RadioButtonModule,
    CheckboxModule,
    InputSwitchModule,
  ],
  declarations: [...widgets],
  exports: [...widgets],
  providers: [WidgetService],
})
export class WidgetsModule {}
