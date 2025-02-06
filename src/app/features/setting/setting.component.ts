import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LIST_CRITERE_PATH, LIST_TASK_PATH } from '@app/constants/routerPath';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-setting',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.css'
})
export class SettingComponent {
  constructor(private router: Router) { }
  settingData = [
    { label: "Tâches", onClick: () => this.router.navigate(['/' + LIST_TASK_PATH]), icon: "fa-tasks" },
    { label: "Critère de Validation", onClick: () => this.router.navigate(['/' + LIST_CRITERE_PATH]), icon: "fa-check-circle" },
  ]
  navigateToTask(): void {
    this.router.navigate(['/' + LIST_TASK_PATH]);
  }
  navigateToCritere(): void {
    this.router.navigate(['/' + LIST_CRITERE_PATH]);
  }

}
