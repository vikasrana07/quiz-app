import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(
    private messageService: MessageService
  ) {

  }

  success(message: string, title: string = 'Success'): void {
    this.showMessage(title, message, 'success');
  }

  info(message: string, title: string = 'Info'): void {
    this.showMessage(title, message, 'info');
  }

  error(response: any, title: string = 'Error'): void {
    const message = response['message'] || response;
    this.showMessage(title, message, 'error');
  }

  clear(): void {
    this.messageService.clear();
  }

  showMessage(title: string, message: string, type: string): void {
    this.messageService.add({ severity: type, summary: title, detail: message });
  }
}
