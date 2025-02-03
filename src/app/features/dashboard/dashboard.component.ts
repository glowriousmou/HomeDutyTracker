import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { LOGIN_PATH } from '@constants/routerPath';
import { AuthenticationService } from '@guards/authentication.service';

@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  title = 'HDT | Dashboard';
  constructor(private authenticationService: AuthenticationService, private router: Router) { }
  logout() {
    this.authenticationService.logout()
    this.router.navigate([LOGIN_PATH]);
  }

}
