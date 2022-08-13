/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { SidebarToggleDirective, SidebarMenuToggleDirective } from '../_directives';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    SidebarToggleDirective,
    SidebarMenuToggleDirective
  ],
  providers: [ConfirmationService]
})
export class LayoutModule { }
