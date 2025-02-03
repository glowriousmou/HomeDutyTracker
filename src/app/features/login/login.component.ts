import { Component } from '@angular/core';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '@guards/authentication.service';
import { User } from '@app/interfaces/user';
import { DASHBOARD_PATH } from '@app/constants/routerPath';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'HDT | Login';
  loginForm: FormGroup;
  errorMsg = '';
  constructor(private fb: FormBuilder, private authenticationService: AuthenticationService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email with validation
      password: ['', [Validators.required, Validators.minLength(6)]] // Password with minLength
    });
  }
  // Getter for the 'password' control
  get passwordControl() {
    return this.loginForm.get('password');
  }

  // Getter for the 'email' control
  get emailControl() {
    return this.loginForm.get('email');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.errorMsg = '';
      console.log('Form Submitted:', this.loginForm.value);
      this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
        (isAuthenticated) => {
          if (isAuthenticated) {
            console.log("isAuthenticated", isAuthenticated)
            const connectedUser: User | null = localStorage.getItem('connectedUser') ? JSON.parse(localStorage.getItem('connectedUser')!)
              : null;
            console.log("connectedUser", connectedUser)
            this.router.navigate([DASHBOARD_PATH]);
            /* if (connectedUser?.fonction === "Directeur") {
              this.router.navigate(['/home']);
            } else if (connectedUser?.fonction === "Responsable des études") {
              this.router.navigate(['/etudiants']);
            } */
          } else {
            this.errorMsg = 'Email ou Mot de passe incorrect';
          }
        },
        (err) => {

          this.errorMsg = "Une erreur s'est produite";
          console.error('Erreur d\'authentification:', err); // Enregistrer l'erreur pour débogage
        }
      );
    } else {
      console.log('Form Invalid');
    }
  }

}
