import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable()
export class DynamicDialogService {
  ref!: DynamicDialogRef;
  constructor(private dialogService: DialogService) {}

  showInformationDialog(component: any, title: any, data: any, options?: any) {
    let width = '80%';
    let height = '500px';
    let footer = null;
    let styleClass = null;
    if (options) {
      if (options.width) {
        width = options.width;
      }
      if (options.height) {
        height = options.height;
      }
      if (options.footer) {
        footer = options.footer;
      }
      if (options.class) {
        styleClass = options.class;
      }
    }
    this.ref = this.dialogService.open(component, {
      header: title,
      footer: footer,
      width: width,
      contentStyle: {
        height: height,
      },
      styleClass: styleClass,
      data: data,
    });
    return this.ref;
  }
}
