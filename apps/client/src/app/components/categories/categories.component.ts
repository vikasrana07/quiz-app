import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { XTableComponent } from '../../shared/components/x-table/x-table.component';
import { ThreeDotMenuComponent } from '../../shared/three-dot-menu/three-dot-menu.component';
import { Category } from '../../_models';
import { AlertService, LoaderService } from '../../_services';
import { CategoriesService } from './categories.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'quiz-app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [XTableComponent, ThreeDotMenuComponent, CommonModule, ContextMenuModule],
  providers: [CategoriesService]
})
export class CategoriesComponent implements OnInit {
  cols: any;
  rows!: Array<Category>;
  selectedRow!: Category;
  items!: MenuItem[];
  constructor(
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'action', header: 'Action', sort: false, filter: false }
    ];
    this.getCategories();
    this.prepareMenu();
  }
  prepareMenu() {
    this.items = [];
    this.items.push({ label: 'Edit Category', icon: 'pi pi-pencil', command: () => { this.update(this.selectedRow); } });
    this.items.push({ label: 'Delete Category', icon: 'pi pi-times', command: () => { this.delete(this.selectedRow); } });
  }
  getCategories() {
    this.loaderService.start();
    this.categoriesService
      .getCategories()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
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
  update(row: Category) {

  }
  delete(row: Category) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the category?',
      accept: () => {
        this.loaderService.start();
        this.categoriesService.deleteCategory(row.id)
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
}
