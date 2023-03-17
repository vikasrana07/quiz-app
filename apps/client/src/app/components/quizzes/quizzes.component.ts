import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { first } from 'rxjs';
import { XTableComponent } from '../../shared/components/x-table/x-table.component';
import { ThreeDotMenuComponent } from '../../shared/three-dot-menu/three-dot-menu.component';
import { HasPermissionDirective } from '../../_directives';
import { Quiz } from '../../_models';
import {
  AlertService,
  LoaderService,
  PermissionService,
} from '../../_services';
import { QuizFormComponent } from './quiz-form/quiz-form.component';
import { QuizzesService } from './quizzes.service';

@Component({
  selector: 'quiz-app-quizzes',
  templateUrl: './quizzes.component.html',
  standalone: true,
  imports: [
    HasPermissionDirective,
    QuizFormComponent,
    XTableComponent,
    ThreeDotMenuComponent,
    CommonModule,
    SidebarModule,
    ContextMenuModule,
  ],
  providers: [
    QuizzesService,
    AlertService,
    DatePipe,
    LoaderService,
    DialogService,
  ],
})
export class QuizzesComponent implements OnInit {
  cols: any;
  rows: Array<Quiz> = [];
  selectedRow!: Quiz;
  items!: MenuItem[];
  displaySidebar!: boolean;
  action = 'add';
  constructor(
    private datePipe: DatePipe,
    private permissionService: PermissionService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private quizzesService: QuizzesService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'startTime', header: 'Start Time' },
      { field: 'endTime', header: 'End Time' },
    ];
    if (this.permissionService.hasPermission(['update_quiz', 'delete_quiz'])) {
      this.cols.push({
        field: 'action',
        header: 'Action',
        sort: false,
        filter: false,
      });
    }
    this.getQuizzes();
    this.prepareMenu();
  }
  prepareMenu() {
    this.items = [];
    if (this.permissionService.hasPermission(['update_quiz'])) {
      this.items.push({
        label: 'Edit Quiz',
        icon: 'pi pi-pencil',
        command: () => {
          this.action = 'edit';
          this.displaySidebar = true;
        },
      });
    }
    if (this.permissionService.hasPermission(['delete_quiz'])) {
      this.items.push({
        label: 'Delete Quiz',
        icon: 'pi pi-times',
        command: () => {
          this.delete(this.selectedRow);
        },
      });
    }
  }
  getQuizzes() {
    this.loaderService.start();
    this.quizzesService
      .getQuizzes()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          response.params.forEach((element: Quiz) => {
            element.startTime =
              this.datePipe.transform(
                element.startTime,
                'yyyy-MM-dd hh:mm a'
              ) || '';
            element.endTime =
              this.datePipe.transform(element.endTime, 'yyyy-MM-dd hh:mm a') ||
              '';
          });
          this.rows = response.params;
          this.loaderService.stop();
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        },
      });
  }

  openMenu(event: any, cm: any, data: any) {
    this.selectedRow = data;
    event.preventDefault();
    event.stopPropagation();
    cm.show(event);
    return false;
  }

  delete(row: Quiz) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the quiz?',
      accept: () => {
        this.loaderService.start();
        this.quizzesService
          .deleteQuiz(row.id)
          .pipe(first())
          .subscribe({
            next: (response: any) => {
              this.loaderService.stop();
              this.alertService.success(response['message']);
              const index = this.rows.findIndex(
                (x: any) => x.id === this.selectedRow.id
              );
              this.rows = this.rows
                .slice(0, index)
                .concat(this.rows.slice(index + 1));
            },
            error: (error: any) => {
              this.loaderService.stop();
              this.alertService.error(error);
            },
          });
      },
    });
  }
  onAdd() {
    this.action = 'add';
    this.displaySidebar = true;
  }
  onAddUpdate(data: any) {
    if (data.action === 'add') {
      this.rows.push(data.params);
      this.rows = [...this.rows];
    } else {
      const index = this.rows.findIndex((x: any) => x.id === data.params.id);
      if (index != -1) {
        this.rows[index] = data.params;
      }
    }
    this.displaySidebar = false;
  }
}
