import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ToastModule } from 'primeng/toast';

import { Subscription } from 'rxjs';
import { LayoutModule } from './_layout/layout.module';
/* import { Message } from '@quiz-app/api-interfaces'; */

@Component({
  selector: 'quiz-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    LayoutModule,
    CommonModule,
    RouterModule,
    NgxUiLoaderModule,
    ToastModule
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  /*  hello$ = this.http.get<Message>('/api/hello');
   constructor(private http: HttpClient) {} */
  navigationSubscription!: Subscription;
  appLayout = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private logger: NGXLogger
  ) {

  }

  ngOnInit(): void {
    this.logger.info('AppComponent: ngOnInit()');
    this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.appLayout = this.activatedRoute?.firstChild?.snapshot.data['appLayout'] !== false;
      }
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
