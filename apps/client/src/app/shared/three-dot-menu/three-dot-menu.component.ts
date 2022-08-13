import { CommonModule } from '@angular/common';
import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'quiz-app-three-dot-menu',
  templateUrl: './three-dot-menu.component.html',
  styleUrls: ['./three-dot-menu.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ThreeDotMenuComponent implements OnInit {

  @Output() clickFunction = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  openMenu(event: any) {
    this.clickFunction.emit(event);
  }
}
