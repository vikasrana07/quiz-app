import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SidebarModule } from 'primeng/sidebar';

import { first } from 'rxjs';
import { XTableComponent } from '../../shared/components/x-table/x-table.component';
import { ThreeDotMenuComponent } from '../../shared/three-dot-menu/three-dot-menu.component';
import { HasPermissionDirective } from '../../_directives';
import { Category, User } from '../../_models';
import { AlertService, LoaderService, PermissionService } from '../../_services';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersService } from './users.service';

@Component({
  selector: 'quiz-app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [HasPermissionDirective, UserFormComponent, XTableComponent, ThreeDotMenuComponent, CommonModule, ContextMenuModule, SidebarModule],
  providers: [UsersService, AlertService, LoaderService]
})
export class UsersComponent implements OnInit {
  cols: any;
  rows!: Array<Category>;
  selectedRow!: User;
  items!: MenuItem[];
  displaySidebar!: boolean;
  action = "add";
  constructor(
    private permissionService: PermissionService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'username', header: 'Username' },
      { field: 'email', header: 'Email' },
      { field: 'action', header: 'Action', sort: false, filter: false }
    ];
    this.getUsers();
    this.prepareMenu();
  }
  prepareMenu() {
    this.items = [];
    if (this.permissionService.hasPermission(["update_user"])) {
      this.items.push({ label: 'Edit User', icon: 'pi pi-pencil', command: () => { this.action = "edit"; this.displaySidebar = true; } });
    }
    if (this.permissionService.hasPermission(["delete_user"])) {
      this.items.push({ label: 'Delete User', icon: 'pi pi-times', command: () => { this.delete(this.selectedRow); } });
    }
  }
  getUsers() {
    this.loaderService.start();
    this.usersService
      .getUsers()
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          this.rows = response;
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

  delete(row: User) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the user?',
      accept: () => {
        this.loaderService.start();
        this.usersService.deleteUser(row.id)
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
  onAdd() {
    this.action = "add";
    this.displaySidebar = true;
  }
  onAddUpdate(data: any) {
    if (data.action === "add") {
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
