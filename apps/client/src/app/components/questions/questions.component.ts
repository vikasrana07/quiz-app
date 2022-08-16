import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService } from 'primeng/dynamicdialog';
import { first } from 'rxjs';
import { XTableComponent } from '../../shared/components/x-table/x-table.component';
import { ThreeDotMenuComponent } from '../../shared/three-dot-menu/three-dot-menu.component';
import { Question } from '../../_models';
import { AlertService, DynamicDialogService, LoaderService } from '../../_services';
import { QuestionFormComponent } from './question-form/question-form.component';
import { QuestionsService } from './questions.service';

@Component({
  selector: 'quiz-app-questions',
  templateUrl: './questions.component.html',
  standalone: true,
  imports: [XTableComponent, ThreeDotMenuComponent, CommonModule, ContextMenuModule],
  providers: [QuestionsService, AlertService, LoaderService, DialogService, DynamicDialogService]
})
export class QuestionsComponent implements OnInit {
  cols: any;
  rows!: Array<Question>;
  selectedRow!: Question;
  items!: MenuItem[];
  constructor(
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dynamicDialogService: DynamicDialogService,
    private questionsService: QuestionsService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'question', header: 'Question' },
      { field: 'categoryName', header: 'Category' },
      { field: 'action', header: 'Action', sort: false, filter: false }
    ];
    this.getQuestions();
    this.prepareMenu();
  }
  prepareMenu() {
    this.items = [];
    this.items.push({ label: 'Edit Question', icon: 'pi pi-pencil', command: () => { this.update(this.selectedRow); } });
    this.items.push({ label: 'Delete Question', icon: 'pi pi-times', command: () => { this.delete(this.selectedRow); } });
  }
  getQuestions() {
    this.loaderService.start();
    this.questionsService
      .getQuestions()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          response.data.forEach((item: any) => {
            item.categoryId = item.category?.id;
            item.categoryName = item.category?.name;
          })
          this.rows = response.data;
          this.loaderService.stop();
        },
        error: (error: any) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
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
        this.questionsService.deleteQuestion(row.id)
          .pipe(first())
          .subscribe({
            next: (response: any) => {
              this.loaderService.stop();
              this.alertService.success(response['message']);
              const index = this.rows.findIndex((x: any) => x.id === this.selectedRow.id);
              this.rows = this.rows.slice(0, index).concat(this.rows.slice(index + 1));
            },
            error: (error: any) => {
              this.loaderService.stop();
              this.alertService.error(error);
            }
          });
      }
    });
  }
  add() {
    const ref = this.dynamicDialogService.showInformationDialog(QuestionFormComponent, 'Add New Question', {}, { width: '60%', height: '100%' });
    ref.onClose.subscribe((data) => {
      if (data) {
        this.rows.push(data);
        this.rows = [...this.rows];
      }
    });
  }
  update(row: Question) {
    const ref = this.dynamicDialogService.showInformationDialog(QuestionFormComponent, 'Edit Question', row, { width: '60%', height: '100%' });
    ref.onClose.subscribe((data) => {
      if (data) {
        const index = this.rows.findIndex((x: any) => x.id === data.id);
        if (index != -1) {
          this.rows[index] = data;
        }
      }
    });
  }
}
