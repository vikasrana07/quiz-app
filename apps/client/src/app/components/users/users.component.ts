import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogService } from 'primeng/dynamicdialog';
import { first } from 'rxjs';
import { XTableComponent } from '../../shared/components/x-table/x-table.component';
import { ThreeDotMenuComponent } from '../../shared/three-dot-menu/three-dot-menu.component';
import { Category, User } from '../../_models';
import { AlertService, DynamicDialogService, LoaderService } from '../../_services';
import { UserFormComponent } from './user-form/user-form.component';
import { UsersService } from './users.service';

@Component({
  selector: 'quiz-app-users',
  templateUrl: './users.component.html',
  standalone: true,
  imports: [XTableComponent, ThreeDotMenuComponent, CommonModule, ContextMenuModule],
  providers: [UsersService, AlertService, LoaderService, DialogService, DynamicDialogService]
})
export class UsersComponent implements OnInit {
  cols: any;
  rows!: Array<Category>;
  selectedRow!: User;
  items!: MenuItem[];
  constructor(
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dynamicDialogService: DynamicDialogService,
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
    this.items.push({ label: 'Edit User', icon: 'pi pi-pencil', command: () => { this.update(this.selectedRow); } });
    this.items.push({ label: 'Delete User', icon: 'pi pi-times', command: () => { this.delete(this.selectedRow); } });
  }
  getUsers() {
    this.loaderService.start();
    this.usersService
      .getUsers()
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
  add() {
    const ref = this.dynamicDialogService.showInformationDialog(UserFormComponent, 'Add New User', {}, { width: '60%', height: '100%' });
    ref.onClose.subscribe((data) => {
      if (data) {
        this.rows.push(data);
        this.rows = [...this.rows];
      }
    });
  }
  update(row: User) {
    const ref = this.dynamicDialogService.showInformationDialog(UserFormComponent, 'Edit User', row, { width: '60%', height: '100%' });
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
