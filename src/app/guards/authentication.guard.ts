import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '@guards/authentication.service';
import { LOGIN_PATH } from '@constants/routerPath';

export const authenticationGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService); // Inject the AuthService
  const router = inject(Router); // Inject the Router

  if (authenticationService.isAuthenticated()) {
    return true; // Allow access
  } else {
    // router.navigate([LOGIN_PATH], { queryParams: { returnUrl: state.url } }); // Redirect to login
    router.navigate([LOGIN_PATH]); // Redirect to login
    return false;
  }
};
