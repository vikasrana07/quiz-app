/* eslint-disable no-prototype-builtins */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';

import { Constants } from '../../../_constants';

export interface ITemplateType {
  template: TemplateRef<any>;
  type: string;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'x-table',
  templateUrl: './x-table.component.html',
  styleUrls: ['./x-table.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TableModule,
    TooltipModule,
    InputTextModule,
    ChipModule,
    CheckboxModule,
    DropdownModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class XTableComponent implements OnInit {
  selectedColumns: [] = [];
  globalFilterFields: any[] = [];
  paginationObject: any;
  @Input() captionTemplate: any;
  @Input() name: any = 'Records';
  @Input() dataKey!: string;
  @Input() cols: any;
  @Input() rows: any;
  @Input() templates!: ITemplateType[];
  header!: boolean;
  body!: boolean;
  rowexpansion!: boolean;
  constructor(private constants: Constants) {}

  ngOnInit(): void {
    this.paginationObject = this.constants.pagination;
    if (this.templates) {
      for (let i = 0; i < this.templates.length; i++) {
        if (this.templates[i].type == 'header') {
          this.header = true;
        }
        if (this.templates[i].type == 'body') {
          this.body = true;
        }
        if (this.templates[i].type == 'rowexpansion') {
          this.rowexpansion = true;
        }
      }
    }
    if (!this.dataKey) {
      this.dataKey = this.cols[0].field;
    }
    this.cols.forEach((element: any) => {
      if (!element.hasOwnProperty('sort')) {
        element.sort = true;
      }
      if (!element.hasOwnProperty('filter')) {
        element.filter = true;
      }
      if (element.filter) {
        this.globalFilterFields.push(element.field);
      }
    });
    this.selectedColumns = this.cols;
  }
}
