/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

import { first, Subscription } from 'rxjs';
import { WidgetService } from '../../widget.service';

import { NGXLogger } from 'ngx-logger';
import { AlertService, LoaderService } from '../../../../../_services';
import { DashboardWidgetDefaultComponent } from '../../widget-type/default/default.component';
@Component({
  selector: 'quiz-app-dashboard-widget-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css'],
})
export class DashboardWidgetCounterComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() widget: any;
  @Input() isPreview!: boolean;
  widgetData: any;
  defaultTemplate = [];
  widgetDataSubscription!: Subscription;
  public components: any;
  public component: any;
  loaderId!: string;
  constructor(
    private loaderService: LoaderService,
    private alertService: AlertService,
    private widgetService: WidgetService,
    private logger: NGXLogger
  ) {}

  ngOnInit(): void {
    this.logger.info('DashboardWidgetCounterComponent: ngOnInit()');
    this.getComponents();
    if (this.isPreview) {
      this.loaderId = 'preview-' + this.widget.id;
    } else {
      this.loaderId = this.widget.id;
    }
    this.getWidgetData();
    if (this.components[this.widget?.code]) {
      this.component = this.components[this.widget?.code];
    } else {
      this.component = this.components['default'];
    }
  }

  public getComponents() {
    this.components = {
      default: DashboardWidgetDefaultComponent,
    };
  }

  getWidgetData() {
    this.logger.info('DashboardWidgetCounterComponent: getWidgetData()');
    console.log(this.widget);
    const widgetData: any = {
      total: 0,
      type: this.widget.type,
      name: this.widget.name,
      class: '',
    };
    if (this.isPreview) {
      widgetData.class = 'preview-counter';
    } else {
      widgetData.class = 'p-2';
    }
    this.loaderService.start(this.loaderId);
    this.widgetDataSubscription = this.widgetService
      .getWidgetData(this.widget.code, this.widget.type)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.loaderService.stop(this.loaderId);
          widgetData.total = data.total;
          this.widgetData = widgetData;
        },
        error: (error: any) => {
          this.widgetData = widgetData;
          this.loaderService.stop(this.loaderId);
          this.alertService.error(error);
        },
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.logger.info('DashboardWidgetCounterComponent: ngOnChanges()');
    //this.getWidgetData();
    //this.loaderService.stop();
  }
  ngOnDestroy(): void {
    this.widgetDataSubscription.unsubscribe();
  }
}
