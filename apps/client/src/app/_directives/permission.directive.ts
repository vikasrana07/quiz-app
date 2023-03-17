/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from '../_services';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasPermission]',
  standalone: true,
})
export class HasPermissionDirective {
  private permissions: string[] = [];
  logicalOp = 'OR';
  private isHidden = true;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) {}

  @Input()
  set hasPermission(val: Array<string>) {
    this.permissions = val;
    this.updateView();
  }

  @Input()
  set hasPermissionOp(permop: string) {
    this.logicalOp = permop;
    this.updateView();
  }

  private updateView() {
    if (this.permissions) {
      if (
        this.permissionService.hasPermission(this.permissions, this.logicalOp)
      ) {
        if (this.isHidden) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.isHidden = false;
        }
      } else {
        this.isHidden = true;
        this.viewContainer.clear();
      }
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isHidden = false;
    }
  }
}
