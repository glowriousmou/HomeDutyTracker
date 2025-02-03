import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from './navbar.interface';
import { DASHBOARD_PATH, LIST_ASSIGNATION_PATH, LIST_USER_PATH, SETTING_PATH } from '@constants/routerPath';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isNavbarOpen = false;
  isNotificationOpen = false;
  isProfilOpen = false;
  menuItems: Navbar[] = [
    { title: 'Dashboard', routePath: DASHBOARD_PATH },
    { title: 'Famille', routePath: LIST_USER_PATH },
    { title: 'Assingation de tâche', routePath: LIST_ASSIGNATION_PATH },
    { title: 'Paramettre', routePath: SETTING_PATH },
    // { title: 'Logout', routePath: '/logout' }
  ]
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
    this.isNotificationOpen = false;
    this.isProfilOpen = false;
  }
  toggleNotification() {
    this.isNotificationOpen = !this.isNotificationOpen;
    this.isNavbarOpen = false;
    this.isProfilOpen = false;
  }
  toggleProfil() {
    this.isProfilOpen = !this.isProfilOpen;
    this.isNavbarOpen = false;
    this.isNotificationOpen = false;
  }
  toggleMenus() {
    this.isProfilOpen = false;
    this.isNavbarOpen = false;
    this.isNotificationOpen = false;
  }

}
