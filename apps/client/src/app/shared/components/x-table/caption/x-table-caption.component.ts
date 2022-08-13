/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { GlobalConstants } from '@client-app/_constants';
import { HttpCacheManager } from '@ngneat/cashew';
import * as FileSaver from 'file-saver';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'x-table-caption',
  templateUrl: './x-table-caption.component.html',
  styleUrls: ['./x-table-caption.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class XTableCaptionComponent implements OnInit {
  showColunnCaption = false;
  showSearchOptions = false;
  filterColumn: string;
  filterType: string;
  searchInput: string;
  filterObject: any;
  filterOptions: any;
  left: number;
  @Input() dataTable: any;
  @Input() selectedFilters: any;
  @Input() cols: any;
  @Input() filter: boolean;
  @Input() exportCSV: boolean;
  @Input() exportExcel: boolean;
  @Input() exportData: any;
  @Input() fileName: any;
  @Input() filteredValues: any;
  @Input() captionTemplate: any;
  @Output() selectedColumnsOutput = new EventEmitter();
  _selectedColumns: any[];
  @ViewChild('searchIcon') searchIcon: ElementRef;

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter((col: any) => val.includes(col));
    this.selectedColumnsOutput.emit(this._selectedColumns);
  }
  constructor(
    private _elementRef: ElementRef,
    private manager: HttpCacheManager,
    private globalConstants: GlobalConstants
  ) {

  }

  ngOnInit(): void {
    this.filterObject = this.globalConstants.filter;
    this._selectedColumns = this.cols;
    this.initFilters();
  }
  initFilters() {
    this.filterColumn = this.cols[0]?.field;
    this.filterType = this.filterObject?.type[0]?.value;
    this.searchInput = null;
    const filterOptionsTemp = [];
    this.cols.forEach((element: any) => {
      if (element.filter) {
        filterOptionsTemp.push(element);
      }
    });
    this.filterOptions = filterOptionsTemp;

    if (this.selectedFilters) {
      this.selectedFilters.forEach((filter) => {
        this.dataTable.filter(filter.value, filter.key, filter.constraint);
      });
    }
  }
  @HostListener('document:click', ['$event.path'])
  public onGlobalClick(targetElementPath: Array<any>) {
    if (targetElementPath) {
      const elementRefInPath = targetElementPath.find(e => e === this._elementRef.nativeElement);
      if (!elementRefInPath) {
        this.showColunnCaption = false;
        this.showSearchOptions = false;
      }
    }
  }

  toggleCaption() {
    this.showColunnCaption = !this.showColunnCaption;
    this.showSearchOptions = false;
  }
  toggleSearch() {
    const { x } = this.searchIcon.nativeElement.getBoundingClientRect();
    const leftMenuElement = document.querySelector('.dropdown-left-menu-slide');
    const leftMargin = parseInt(leftMenuElement["style"].marginLeft.replace("px", ""));
    const offsetWidth = leftMenuElement["offsetWidth"];
    this.left = x - 375;
    if (leftMargin == 0) {
      this.left -= offsetWidth;
    }
    this.showSearchOptions = !this.showSearchOptions;
    this.showColunnCaption = false;
    this.initFilters();
  }

  clearFilter(key: string, filterType: string) {
    this.dataTable.filter('', key, filterType);
    this.manager.delete('customerSearchFormFilter');
  }
  parseExportData(tempArray: any) {
    const dataToExport = [];
    tempArray.forEach((item: any) => {
      const obj = {};
      this._selectedColumns.forEach((col) => {
        obj[col.header] = item[col.field];
      })
      dataToExport.push(obj);
    });
    return dataToExport;
  }

  downloadCSV() {
    if (typeof this.fileName != 'undefined' && typeof this.fileName == 'string') {
      this.dataTable.exportFilename = this.fileName;
    } else {
      this.dataTable.exportFilename = 'download';
    }
    if (this.exportData && this.exportData.length > 0) {
      let tempArray = [];
      tempArray = this.exportData;
      const dataToExport = this.parseExportData(tempArray);

      import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(dataToExport);
        const csv = xlsx.utils.sheet_to_csv(worksheet);
        const csvBuffer = this.getCSVBuffer(csv);
        FileSaver.saveAs(new Blob([csvBuffer], { type: "application/octet-stream" }), this.dataTable.exportFilename+".CSV");
      });
    } else {
      this.dataTable.exportCSV();
    }
  }

  getCSVBuffer(s: any) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  downloadExcel() {
    if (typeof this.fileName != 'undefined' && typeof this.fileName == 'string') {
      this.dataTable.exportFilename = this.fileName;
    } else {
      this.dataTable.exportFilename = 'download';
    }
    let tempArray = [];
    if (this.filteredValues) {
      tempArray = [...this.filteredValues];
    } else {
      tempArray = [...this.dataTable._value];
    }
    if (this.exportData && this.exportData.length > 0) {
      tempArray = this.exportData;
    }
    const dataToExport = this.parseExportData(tempArray);
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(dataToExport);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, this.dataTable.exportFilename);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }
}
