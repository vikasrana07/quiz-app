import { Injectable } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor(private ngxService: NgxUiLoaderService) {}

  start(loaderId: string = ''): void {
    if (loaderId != '') {
      this.ngxService.startLoader(loaderId);
    } else {
      this.ngxService.start();
    }
  }

  stop(loaderId: string = ''): void {
    if (loaderId != '') {
      const loader = this.ngxService.getLoader(loaderId);
      if (loader && loader.loaderId == loaderId) {
        this.ngxService.stopLoader(loaderId);
      }
    } else {
      this.ngxService.stop();
    }
  }
}
