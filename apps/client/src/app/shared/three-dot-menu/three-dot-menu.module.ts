/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeDotMenuComponent } from './three-dot-menu.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ThreeDotMenuComponent
  ],
  exports: [
    ThreeDotMenuComponent
  ]
})
export class ThreeDotMenuModule { }
