import { Routes } from '@angular/router';
import { LoginComponent } from '@features/login/login.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { NotFoundComponent } from '@features/not-found/not-found.component';
import { DASHBOARD_PATH, LOGIN_PATH } from '@constants/routerPath';
import { authenticationGuard } from '@guards/authentication.guard';


export const routes: Routes = [
    { path: LOGIN_PATH, component: LoginComponent },
    { path: DASHBOARD_PATH, component: DashboardComponent, canActivate: [authenticationGuard] },
    { path: "", component: DashboardComponent, canActivate: [authenticationGuard] },
    { path: '**', component: NotFoundComponent, canActivate: [authenticationGuard] },
    // { path: '**', redirectTo: NOT_FOUND_PATH, canActivate: [authenticationGuard] },
];
