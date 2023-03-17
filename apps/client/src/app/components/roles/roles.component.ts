import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SidebarModule } from 'primeng/sidebar';

import { first } from 'rxjs';
import { XTableComponent } from '../../shared/components/x-table/x-table.component';
import { ThreeDotMenuComponent } from '../../shared/three-dot-menu/three-dot-menu.component';
import { Role } from '../../_models';
import { AlertService, LoaderService } from '../../_services';
import { RoleFormComponent } from './role-form/role-form.component';
import { RolesService } from './roles.service';

@Component({
  selector: 'quiz-app-roles',
  templateUrl: './roles.component.html',
  standalone: true,
  imports: [
    RoleFormComponent,
    XTableComponent,
    ThreeDotMenuComponent,
    CommonModule,
    ContextMenuModule,
    SidebarModule,
  ],
  providers: [RolesService, AlertService, LoaderService],
})
export class RolesComponent implements OnInit {
  cols: any;
  rows!: Array<Role>;
  selectedRow!: Role;
  items!: MenuItem[];
  displaySidebar!: boolean;
  action = 'add';
  constructor(
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private rolesService: RolesService
  ) {}

  ngOnInit(): void {
    this.cols = [
      { field: 'name', header: 'Role Name' },
      { field: 'resources', header: 'Permissions' },
      { field: 'action', header: 'Action', sort: false, filter: false },
    ];
    this.getRoles();
    this.prepareMenu();
  }
  prepareMenu() {
    this.items = [];
    this.items.push({
      label: 'Edit Role',
      icon: 'pi pi-pencil',
      command: () => {
        this.action = 'edit';
        this.displaySidebar = true;
      },
    });
    this.items.push({
      label: 'Delete Role',
      icon: 'pi pi-times',
      command: () => {
        this.delete(this.selectedRow);
      },
    });
  }
  getRoles() {
    this.loaderService.start();
    this.rolesService
      .getRoles()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          this.rows = response;
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

  delete(row: Role) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the role?',
      accept: () => {
        this.loaderService.start();
        this.rolesService
          .deleteRole(row.id)
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
      this.rows.push(data);
      this.rows = [...this.rows];
    } else {
      const index = this.rows.findIndex((x: any) => x.id === data.id);
      if (index != -1) {
        this.rows[index] = data;
      }
    }
    this.displaySidebar = false;
  }
}
