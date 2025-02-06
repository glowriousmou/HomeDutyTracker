import { Routes } from '@angular/router';
import { LoginComponent } from '@features/login/login.component';
import { DashboardComponent } from '@features/dashboard/dashboard.component';
import { NotFoundComponent } from '@features/not-found/not-found.component';
import { DASHBOARD_PATH, LIST_ASSIGNATION_PATH, LIST_USER_PATH, LOGIN_PATH, FAMILY_PATH, FORM_USER_PATH, SETTING_PATH, LIST_TASK_PATH, LIST_CRITERE_PATH, FORM_TASK_PATH } from '@constants/routerPath';
import { authenticationGuard } from '@guards/authentication.guard';
import { AssignationsComponent } from '@features/assignations/assignations.component';
import { ListUsersComponent } from '@features/users/list-users/list-users.component';
import { FamilyTreeComponent } from '@features/users/family-tree/family-tree.component';
import { UserFormComponent } from '@features/users/user-form/user-form.component';
import { SettingComponent } from '@features/setting/setting.component';
import { TacheComponent } from '@features/setting/tache/tache.component';
import { CritereValidationComponent } from '@features/setting/critere-validation/critere-validation.component';
import { TacheFormComponent } from './features/setting/tache-form/tache-form.component';


export const routes: Routes = [
    { path: LOGIN_PATH, component: LoginComponent },
    { path: DASHBOARD_PATH, component: DashboardComponent, canActivate: [authenticationGuard] },
    { path: LIST_USER_PATH, component: ListUsersComponent, canActivate: [authenticationGuard] },
    { path: FORM_USER_PATH + "/:action", component: UserFormComponent, canActivate: [authenticationGuard] },
    { path: FAMILY_PATH, component: FamilyTreeComponent, canActivate: [authenticationGuard] },
    { path: LIST_ASSIGNATION_PATH, component: AssignationsComponent, canActivate: [authenticationGuard] },
    { path: SETTING_PATH, component: SettingComponent, canActivate: [authenticationGuard] },
    { path: LIST_TASK_PATH, component: TacheComponent, canActivate: [authenticationGuard] },
    { path: FORM_TASK_PATH + "/:action", component: TacheFormComponent, canActivate: [authenticationGuard] },
    { path: LIST_CRITERE_PATH, component: CritereValidationComponent, canActivate: [authenticationGuard] },
    { path: "", component: DashboardComponent, canActivate: [authenticationGuard] },
    { path: '**', component: NotFoundComponent, canActivate: [authenticationGuard] },
    // { path: '**', redirectTo: NOT_FOUND_PATH, canActivate: [authenticationGuard] },
];
