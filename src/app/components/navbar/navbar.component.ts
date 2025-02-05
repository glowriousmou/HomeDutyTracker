import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Navbar } from './navbar.interface';
import { DASHBOARD_PATH, LIST_ASSIGNATION_PATH, FAMILY_PATH, LOGIN_PATH, SETTING_PATH } from '@constants/routerPath';
import { AuthenticationService } from '@app/guards/authentication.service';

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
  connectedUser = localStorage.getItem('connectedUser') ? JSON.parse(localStorage.getItem('connectedUser')!) : null;
  menuItems: Navbar[] = [
    { title: 'Dashboard', routePath: DASHBOARD_PATH },
    { title: 'Famille', routePath: FAMILY_PATH },
    { title: 'Assignation de tâches', routePath: LIST_ASSIGNATION_PATH },
    { title: 'Paramètres', routePath: SETTING_PATH },
    // { title: 'Logout', routePath: '/logout' }
  ]

  constructor(private authenticationService: AuthenticationService, private router: Router) { }
  logout() {
    this.authenticationService.logout()
    this.router.navigate([LOGIN_PATH]);
  }
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
