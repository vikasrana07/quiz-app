/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  AuthenticationService,
  LoaderService,
} from '../../_services';

@Component({
  selector: 'quiz-app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  displaySidebar = false;
  user: any;
  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.user = this.authenticationService.userData;
  }

  logout() {
    this.loaderService.start();
    this.authenticationService.logout().subscribe({
      next: () => {
        this.loaderService.stop();
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loaderService.stop();
        this.alertService.error(error);
      },
    });
  }
  navigateTo(url: string) {
    this.displaySidebar = false;
    this.router.navigate(['/' + url]);
  }
  toggleSidebar() {
    this.displaySidebar = !this.displaySidebar;
  }
}
