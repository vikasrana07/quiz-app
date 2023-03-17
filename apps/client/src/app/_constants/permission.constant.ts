import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PermissionConstants {
  public ROUTES = {
    INVENTORY: 'admin_view_inventory',
    EMPLOYEE_USERS: 'admin_view_employee_users',
    EMPLOYEE_USERS_ASSOCIATION: 'get_customer_association',
    CUSTOMERS: 'read_all_customer_account',
    VNF_DASHBOARD: 'get_vnf_history',
    PORT_INFORMATION: 'get_vnf_history',
    CHANGE_PASSWORD: 'employee_change_password',
  };

  public MENU = {
    INVENTORY: [this.ROUTES.INVENTORY],
    EMPLOYEE_USER_MANAGEMENT: [
      this.ROUTES.EMPLOYEE_USERS,
      this.ROUTES.EMPLOYEE_USERS_ASSOCIATION,
      this.ROUTES.CUSTOMERS,
    ],
    REPORTS: [this.ROUTES.VNF_DASHBOARD, this.ROUTES.PORT_INFORMATION],
    SETTINGS: [this.ROUTES.CHANGE_PASSWORD],
  };
}
