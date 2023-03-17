import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { first } from 'rxjs';
import { XTableComponent } from '../../shared/components/x-table/x-table.component';
import { ThreeDotMenuComponent } from '../../shared/three-dot-menu/three-dot-menu.component';
import { HasPermissionDirective } from '../../_directives';
import { Question } from '../../_models';
import {
  AlertService,
  LoaderService,
  PermissionService,
} from '../../_services';
import { QuestionFormComponent } from './question-form/question-form.component';
import { QuestionsService } from './questions.service';

@Component({
  selector: 'quiz-app-questions',
  templateUrl: './questions.component.html',
  standalone: true,
  imports: [
    HasPermissionDirective,
    QuestionFormComponent,
    XTableComponent,
    ThreeDotMenuComponent,
    CommonModule,
    SidebarModule,
    ContextMenuModule,
  ],
  providers: [QuestionsService, AlertService, LoaderService, DialogService],
})
export class QuestionsComponent implements OnInit {
  cols: any;
  rows!: Array<Question>;
  selectedRow!: Question;
  items!: MenuItem[];
  displaySidebar!: boolean;
  action = 'add';
  constructor(
    private permissionService: PermissionService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private questionsService: QuestionsService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'questionTypeName', header: 'Question Type' },
      { field: 'categoryName', header: 'Category' },
      { field: 'question', header: 'Question' },
    ];
    if (
      this.permissionService.hasPermission([
        'update_question',
        'delete_question',
      ])
    ) {
      this.cols.push({
        field: 'action',
        header: 'Action',
        sort: false,
        filter: false,
      });
    }
    this.getQuestions();
    this.prepareMenu();
  }
  prepareMenu() {
    this.items = [];
    if (this.permissionService.hasPermission(['update_question'])) {
      this.items.push({
        label: 'Edit Question',
        icon: 'pi pi-pencil',
        command: () => {
          this.action = 'edit';
          this.displaySidebar = true;
        },
      });
    }
    if (this.permissionService.hasPermission(['delete_question'])) {
      this.items.push({
        label: 'Delete Question',
        icon: 'pi pi-times',
        command: () => {
          this.delete(this.selectedRow);
        },
      });
    }
  }
  getQuestions() {
    this.loaderService.start();
    this.questionsService
      .getQuestions()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          response.params.forEach((item: any) => {
            item.categoryId = item.category?.id;
            item.categoryName = item.category?.name;
            item.questionTypeId = item.questionType?.id;
            item.questionTypeName = item.questionType?.name;
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

  delete(row: Question) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the question?',
      accept: () => {
        this.loaderService.start();
        this.questionsService
          .deleteQuestion(row.id)
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
