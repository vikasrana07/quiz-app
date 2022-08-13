/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, AuthenticationService, LoaderService } from '../../_services';

@Component({
  selector: 'quiz-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isSideMenuOpen = true;
  user: any;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService
  ) {

  }

  ngOnInit() {
    this.user = this.authenticationService.userData;
  }

  logout() {
    this.loaderService.start();
    this.authenticationService.logout()
      .subscribe({
        next: () => {
          this.loaderService.stop();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loaderService.stop();
          this.alertService.error(error);
        }
      });
  }
}