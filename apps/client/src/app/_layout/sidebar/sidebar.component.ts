/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Component, OnInit } from '@angular/core';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'quiz-app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems!: Array<any>;
  constructor(

  ) {

  }
  ngOnInit() {
    this.setMenuItems();
  }
  setMenuItems() {
    this.menuItems = [
      {
        name: '',
        menu: [
          {
            name: 'Dashboard',
            href: ['/dashboard'],
            icon: 'pi-home'
          }
        ]
      },
      {
        name: 'Manage Quiz',
        menu: [
          {
            name: 'Categories',
            icon: 'pi-bookmark',
            submenu: [
              {
                name: 'List',
                href: ['/categories'],
                icon: 'pi-list',
              }
            ]
          },
          {
            name: 'Questions',
            icon: 'pi-question',
            submenu: [
              {
                name: 'List',
                href: ['/questions'],
                icon: 'pi-list',
              }
            ]
          }
        ]
      },
      {
        name: 'Manage Users',
        menu: [
          {
            name: 'Users',
            icon: 'pi-users',
            href: ['/users']
          },
          {
            name: 'Roles',
            icon: 'pi-shield',
            href: ['/roles']
          }
        ]
      },
      {
        name: 'Manage Settings',
        menu: [
          {
            name: 'Settings',
            icon: 'pi-cog',
            href: ['/settings'],
          }
        ]
      }
    ];
  }
}
