/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { first } from 'rxjs';
import { AlertService, LoaderService } from '../../../../../_services';
import { WidgetService } from '../../widget.service';
@Component({
  selector: 'quiz-app-dashboard-widget-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class DashboardWidgetPieChartComponent implements OnInit, OnChanges {
  data: any;
  chartOptions: any;
  @Input() isPreview!: boolean;
  @Input() widget: any;
  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private widgetService: WidgetService
  ) {}

  ngOnInit(): void {
    this.data = {
      labels: ['A', 'B'],
      datasets: [
        {
          data: [100, 50],
          backgroundColor: ['#42A5F5', '#66BB6A'],
          hoverBackgroundColor: ['#64B5F6', '#81C784'],
        },
      ],
    };

    this.getWidgetData();
  }

  getWidgetData() {
    this.loaderService.start(this.widget.id);

    this.loaderService.start(this.widget.id);
    this.widgetService
      .getWidgetData(this.widget.code, this.widget.type)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          const options: any = {};
          this.data.labels = options.labels;
          this.data.datasets[0].data = options.data;
          this.loaderService.stop(this.widget.id);
        },
        error: (error: any) => {
          this.loaderService.stop(this.widget.id);
          this.alertService.error(error);
        },
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getWidgetData();
  }
}
