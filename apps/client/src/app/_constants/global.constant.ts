import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Constants {
  public pagination = {
    availableLimits: [10, 20, 50, 100, 200, { showAll: 'All' }],
    itemsPerPage: 10,
  };
}
