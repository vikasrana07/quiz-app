// app.routes.ts

import { Routes } from '@angular/router';
import { AuthGuard } from './_helpers';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '404', loadComponent: () => import('./components/notfound/notfound.component').then(m => m.NotFoundComponent), data: { appLayout: false } },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.routes').then(m => m.LOGIN_ROUTES),
    title: 'Login', data: { appLayout: false }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    title: 'Dashboard'
  },
  {
    path: 'categories',
    loadChildren: () => import('./components/categories/categories.routes').then(m => m.CATEGORIES_ROUTES),
    canActivate: [AuthGuard],
    title: 'Categories'
  },
  {
    path: 'questions',
    loadComponent: () => import('./components/questions/questions.component').then(m => m.QuestionsComponent),
    canActivate: [AuthGuard],
    title: 'Questions'
  },
  {
    path: 'users',
    loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
    canActivate: [AuthGuard],
    title: 'Users'
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard],
    title: 'Settings'
  },
  // otherwise redirect to 404
  { path: '**', redirectTo: '/404' }
];