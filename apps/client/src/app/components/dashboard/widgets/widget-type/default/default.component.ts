import { Component, Input } from '@angular/core';
@Component({
  selector: 'quiz-app-dashboard-widget-default',
  templateUrl: './default.component.html',
})
export class DashboardWidgetDefaultComponent {
  @Input() widget: any;

  constructor() {}
}
