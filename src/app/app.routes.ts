import { Routes } from '@angular/router';
import { LoginComponent } from '@features/login/login.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { NotFoundComponent } from '@features/not-found/not-found.component';
import { DASHBOARD_PATH, LIST_ASSIGNATION_PATH, LIST_USER_PATH, LOGIN_PATH, FAMILY_PATH } from '@constants/routerPath';
import { authenticationGuard } from '@guards/authentication.guard';
import { AssignationsComponent } from '@features/assignations/assignations.component';
import { ListUsersComponent } from '@features/users/list-users/list-users.component';
import { FamilyTreeComponent } from '@features/users/family-tree/family-tree.component';


export const routes: Routes = [
    { path: LOGIN_PATH, component: LoginComponent },
    { path: DASHBOARD_PATH, component: DashboardComponent, canActivate: [authenticationGuard] },
    { path: LIST_USER_PATH, component: ListUsersComponent, canActivate: [authenticationGuard] },
    { path: FAMILY_PATH, component: FamilyTreeComponent, canActivate: [authenticationGuard] },
    { path: LIST_ASSIGNATION_PATH, component: AssignationsComponent, canActivate: [authenticationGuard] },
    { path: "", component: DashboardComponent, canActivate: [authenticationGuard] },
    { path: '**', component: NotFoundComponent, canActivate: [authenticationGuard] },
    // { path: '**', redirectTo: NOT_FOUND_PATH, canActivate: [authenticationGuard] },
];
