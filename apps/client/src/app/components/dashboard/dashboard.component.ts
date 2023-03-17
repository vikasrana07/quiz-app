import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { GridsterModule } from 'angular-gridster2';
import { NGXLogger } from 'ngx-logger';
import { first, Subscription } from 'rxjs';
import { DynamicModule } from 'ng-dynamic-component';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import {
  DashboardConfig,
  DashboardItemComponentInterface,
  DisplayGrid,
  GridType,
  DashboardWidget,
  Dashboard,
} from '../../_models';
import {
  AlertService,
  DynamicDialogService,
  LoaderService,
  PermissionService,
} from '../../_services';
import { DashboardService } from './dashboard.service';
import {
  DashboardWidgetCounterComponent,
  DashboardWidgetPieChartComponent,
} from './widgets';
import { WidgetsModule } from './widgets/widgets.module';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from '../../_directives';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfigureWidgetComponent } from './widgets/configure-widget/configure-widget.component';
import { DashboardFormComponent } from './dashboard-form/dashboard-form.component';

@Component({
  selector: 'quiz-app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    GridsterModule,
    DynamicModule,
    CommonModule,
    ToolbarModule,
    MenuModule,
    DropdownModule,
    SidebarModule,
    ButtonModule,
    WidgetsModule,
    FormsModule,
    DashboardFormComponent,
    HasPermissionDirective,
  ],
  providers: [DashboardService, DialogService, DynamicDialogService],
})
export class DashboardComponent implements OnInit, OnDestroy {
  displaySidebar!: boolean;
  action = 'add';
  isLocked!: boolean;
  public components: any;
  dashboards: Dashboard[] = [];
  selectedDashboard!: Dashboard;
  public options!: DashboardConfig;
  lockIcon = 'pi pi-lock';
  lockTooltip = 'Unlock Dashboard';
  items!: MenuItem[];
  protected dashboardSubscription!: Subscription;
  protected savewidgetPositionSubscription!: Subscription;
  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dashboardService: DashboardService,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionService,
    private dynamicDialogService: DynamicDialogService,
    private logger: NGXLogger
  ) {
    this.getOptions();
  }

  ngOnInit(): void {
    this.logger.info('DashboardComponent: ngOnInit()');

    this.items = [];
    if (this.permissionService.hasPermission(['create_widget'])) {
      this.items.push({
        label: 'Add Widget',
        icon: 'pi pi-plus',
        command: () => {
          this.onConfigureWidget();
        },
      });
    }
    if (this.permissionService.hasPermission(['update_dashboard'])) {
      this.items.push({
        label: 'Edit Dashboard',
        icon: 'pi pi-pencil',
        command: () => {
          this.onEditDashboard();
        },
      });
    }
    if (this.permissionService.hasPermission(['delete_dashboard'])) {
      this.items.push({
        label: 'Delete Dashboard',
        icon: 'pi pi-trash',
        command: () => {
          this.onDeleteDashboard();
        },
      });
    }
    this.getComponents();
    this.getDashboards();
  }

  public getComponents() {
    this.components = {
      instant: DashboardWidgetCounterComponent,
      'pie-chart': DashboardWidgetPieChartComponent,
    };
  }
  public getOptions() {
    this.options = {
      compactType: 'compactUp',
      margin: 10,
      outerMargin: true,
      mobileBreakpoint: 300,
      disablePushOnDrag: true,
      displayGrid: DisplayGrid.None,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: false,
        ignoreContent: true,
        dropOverItems: false,
        dragHandleClass: 'drag-handler',
        ignoreContentClass: 'no-drag',
      },
      gridType: GridType.Fit,
      itemChangeCallback: this.itemChange.bind(this),
      // maxCols: 6,
      // maxRows: 6,
      minCols: 10, // 6
      minRows: 10, // 6
      pushDirections: { north: true, east: true, south: true, west: true },
      pushItems: true,
      resizable: { enabled: false },
    };
  }
  getDashboards() {
    this.loaderService.start();
    this.dashboardSubscription = this.dashboardService
      .getDashboards()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          this.dashboards = response;
          this.selectedDashboard = this.dashboardService.getDefaultDashboard(
            this.dashboards
          );
          if (this.selectedDashboard) {
            this.isLocked =
              this.selectedDashboard.isLocked === 1 ? true : false;
            if (!this.isLocked) {
              this.unlockDashboard();
            }
          }
          this.loaderService.stop();
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        },
      });
  }

  public ngOnDestroy() {
    this.unsubscribe();
  }
  protected unsubscribe() {
    this.logger.info('DashboardComponent: unsubscribe()');
    if (this.dashboardSubscription) {
      this.dashboardSubscription.unsubscribe();
    }
    if (this.savewidgetPositionSubscription) {
      this.savewidgetPositionSubscription.unsubscribe();
    }
  }
  public itemChange(
    item: DashboardWidget,
    itemComponent: DashboardItemComponentInterface
  ) {
    const changedElements = [
      {
        id: itemComponent.el.id,
        rows: item.rows,
        cols: item.cols,
        xpos: item.x,
        ypos: item.y,
      },
    ];
    if (this.permissionService.hasPermission(['edit_widget'])) {
      this.saveWidgetPositions(changedElements);
    }
  }

  saveWidgetPositions(changedElements: any) {
    this.logger.info('DashboardComponent: saveWidgetPositions()');
    const { id, ...payload } = changedElements[0];
    this.savewidgetPositionSubscription = this.dashboardService
      .saveWidgetPositions(+id, payload)
      .pipe(first())
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        next: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        error: () => {},
      });
  }

  onDashboardChange() {
    const index = this.dashboards.findIndex(
      (x) => x.id == this.selectedDashboard.id
    );
    this.selectedDashboard = this.dashboards[index];
  }

  toggleEdit() {
    if (this.isLocked) {
      this.unlockDashboard();
    } else {
      this.confirmLockDashboard();
    }
    this.changedOptions();
  }
  changedOptions(): void {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }
  confirmLockDashboard() {
    this.confirmationService.confirm({
      message: `Are you sure you want to lock the dashboard?
      <div class="small mt-3">Note: No activity can be performed on locked dashboard.</div>`,
      accept: () => {
        this.lockDashboard();
      },
    });
  }
  lockDashboard() {
    this.isLocked = true;
    if (this.options.resizable) {
      this.options.resizable.enabled = false;
    }
    if (this.options.draggable) {
      this.options.draggable.enabled = false;
    }
    this.lockIcon = 'pi pi-lock';
    this.lockTooltip = 'Unlock Dashboard';
    const payload = {
      isLocked: '1',
    };
    this.updateDashboard(payload);
  }
  unlockDashboard() {
    this.isLocked = false;
    if (this.options.resizable) {
      this.options.resizable.enabled = true;
    }
    if (this.options.draggable) {
      this.options.draggable.enabled = true;
    }
    this.lockIcon = 'pi pi-lock-open';
    this.lockTooltip = 'Lock Dashboard';
    const payload = {
      isLocked: '0',
    };
    this.updateDashboard(payload);
  }
  updateDashboard(payload: any) {
    this.changedOptions();
    /* payload.ModifiedBy = this.user.userid;
    this.dashboardService
      .updateDashboard(this.dashboard?.id, payload)
      .subscribe({
        next: () => { },
        error: (error: any) => {
          this.alertService.error(error);
        }
      }); */
  }

  onConfigureWidget() {
    const data = {
      dashboardId: this.selectedDashboard?.id,
    };
    const ref = this.dynamicDialogService.showInformationDialog(
      ConfigureWidgetComponent,
      'Configure Widget',
      data,
      { height: '80%' }
    );
    ref.onClose.subscribe((data) => {
      if (data) {
        this.alertService.success('Widget added successfully');
        const widget = {
          name: data.name,
          type: data.type,
          code: data.code,
          x: 0,
          y: 0,
          cols: 3,
          rows: 3,
        };
        const index = +this.dashboards.findIndex(
          (x) => x.id == this.selectedDashboard?.id
        );
        if (this.dashboards[index]?.widgets?.length) {
          widget.rows = this.selectedDashboard[index].widgets[0].rows;
          widget.cols = this.selectedDashboard[index].widgets[0].cols;
        }
        this.selectedDashboard[index].widgets.push(widget);
      }
    });
  }
  onAddDashboard() {
    this.action = 'add';
    this.displaySidebar = true;
  }
  onEditDashboard() {
    this.action = 'edit';
    this.displaySidebar = true;
  }
  onAddUpdate(data: any) {
    data.widgets = [];
    if (data.action === 'add') {
      this.dashboards.push(data);
      this.dashboards = [...this.dashboards];
    } else {
      const index = this.dashboards.findIndex((x: any) => x.id === data.id);
      if (index != -1) {
        this.dashboards[index] = data;
        this.selectedDashboard = data;
      }
    }
    this.displaySidebar = false;
  }

  onDeleteDashboard() {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the dashboard?`,
      accept: () => {
        this.deleteDeleteDashboard();
      },
    });
  }
  deleteDeleteDashboard() {
    this.dashboardService
      .deleteDashboard(this.selectedDashboard?.id)
      .subscribe({
        next: (response: any) => {
          this.alertService.success(response.message);
          this.dashboards.splice(
            this.dashboards.indexOf(this.selectedDashboard),
            1
          );
          this.selectedDashboard = this.dashboards[0];
        },
        error: (error: any) => {
          this.alertService.error(error);
        },
      });
  }
}
