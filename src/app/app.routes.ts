import { Routes } from '@angular/router';
import { LoginComponent } from '@features/login/login.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { NotFoundComponent } from '@features/not-found/not-found.component';
import { DASHBOARD_PATH, LIST_ASSIGNATION_PATH, LIST_USER_PATH, LOGIN_PATH } from '@constants/routerPath';
import { authenticationGuard } from '@guards/authentication.guard';
import { UtilisateursComponent } from '@features/utilisateurs/utilisateurs.component';
import { AssignationsComponent } from '@features/assignations/assignations.component';


export const routes: Routes = [
    { path: LOGIN_PATH, component: LoginComponent },
    { path: DASHBOARD_PATH, component: DashboardComponent, canActivate: [authenticationGuard] },
    { path: LIST_USER_PATH, component: UtilisateursComponent, canActivate: [authenticationGuard] },
    { path: LIST_ASSIGNATION_PATH, component: AssignationsComponent, canActivate: [authenticationGuard] },
    { path: "", component: DashboardComponent, canActivate: [authenticationGuard] },
    { path: '**', component: NotFoundComponent, canActivate: [authenticationGuard] },
    // { path: '**', redirectTo: NOT_FOUND_PATH, canActivate: [authenticationGuard] },
];
