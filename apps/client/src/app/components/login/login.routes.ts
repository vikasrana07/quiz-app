import { Routes } from '@angular/router';
import { IsLoggedIn } from '../../_services';
import { LoginComponent } from './login.component';

export const LOGIN_ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
    resolve: [IsLoggedIn],
  },
];
