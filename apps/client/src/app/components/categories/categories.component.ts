import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { XTableComponent } from '../../shared/components/x-table/x-table.component';
import { ThreeDotMenuComponent } from '../../shared/three-dot-menu/three-dot-menu.component';
import { Category } from '../../_models';
import {
  AlertService,
  DynamicDialogService,
  LoaderService,
  PermissionService,
} from '../../_services';
import { CategoriesService } from './categories.service';
import { CommonModule } from '@angular/common';
import { CategoryFormComponent } from './category-form/category-form.component';
import { DialogService } from 'primeng/dynamicdialog';
import { HasPermissionDirective } from '../../_directives';

@Component({
  selector: 'quiz-app-categories',
  templateUrl: './categories.component.html',
  standalone: true,
  imports: [
    HasPermissionDirective,
    XTableComponent,
    ThreeDotMenuComponent,
    CommonModule,
    ContextMenuModule,
  ],
  providers: [
    CategoriesService,
    AlertService,
    LoaderService,
    DialogService,
    DynamicDialogService,
  ],
})
export class CategoriesComponent implements OnInit {
  cols: any;
  rows: Array<Category> = [];
  selectedRow!: Category;
  items!: MenuItem[];
  constructor(
    private permissionService: PermissionService,
    private dynamicDialogService: DynamicDialogService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
    ];
    if (
      this.permissionService.hasPermission([
        'update_category',
        'delete_category',
      ])
    ) {
      this.cols.push({
        field: 'action',
        header: 'Action',
        sort: false,
        filter: false,
      });
    }
    this.getCategories();
    this.prepareMenu();
  }
  prepareMenu() {
    this.items = [];
    if (this.permissionService.hasPermission(['update_category'])) {
      this.items.push({
        label: 'Edit Category',
        icon: 'pi pi-pencil',
        command: () => {
          this.update(this.selectedRow);
        },
      });
    }
    if (this.permissionService.hasPermission(['delete_category'])) {
      this.items.push({
        label: 'Delete Category',
        icon: 'pi pi-times',
        command: () => {
          this.delete(this.selectedRow);
        },
      });
    }
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
  add() {
    const ref = this.dynamicDialogService.showInformationDialog(
      CategoryFormComponent,
      'Add New Category',
      {},
      { width: '60%', height: '100%' }
    );
    ref.onClose.subscribe((data) => {
      if (data) {
        this.rows.push(data);
        this.rows = [...this.rows];
      }
    });
  }
  update(row: Category) {
    const ref = this.dynamicDialogService.showInformationDialog(
      CategoryFormComponent,
      'Edit Category',
      row,
      { width: '60%', height: '100%' }
    );
    ref.onClose.subscribe((data) => {
      if (data) {
        const index = this.rows.findIndex((x: any) => x.id === data.id);
        if (index != -1) {
          this.rows[index] = data;
        }
      }
    });
  }
  delete(row: Category) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the category?',
      accept: () => {
        this.loaderService.start();
        this.categoriesService
          .deleteCategory(row.id)
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
}
