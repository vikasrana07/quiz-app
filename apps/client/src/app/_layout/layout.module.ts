/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';

import {
  SidebarToggleDirective,
  SidebarMenuToggleDirective,
} from '../_directives';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ConfirmDialogModule,
    TooltipModule,
    SidebarModule,
    AvatarModule,
  ],
  exports: [FooterComponent, HeaderComponent, SidebarComponent],
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    SidebarToggleDirective,
    SidebarMenuToggleDirective,
  ],
})
export class LayoutModule {}
