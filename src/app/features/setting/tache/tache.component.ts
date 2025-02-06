import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_TASK_PATH } from '@app/constants/routerPath';
import { AuthenticationService } from '@app/guards/authentication.service';
import { Tache } from '@app/interfaces/tache';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { TacheService } from './tache.service';

@Component({
  selector: 'app-tache',
  imports: [NavbarComponent],
  templateUrl: './tache.component.html',
  styleUrl: './tache.component.css'
})
export class TacheComponent {
  isParent: boolean = false;
  selectedData: Tache | null = null;
  listData: Tache[] = [];
  constructor(private authenticationService: AuthenticationService, private router: Router, private tacheService: TacheService) {
    this.isParent = this.authenticationService.checkRole("Parent");
  }

  navigateToForm(selectedData: Tache | null): void {
    let action = "add"
    if (selectedData) {
      if (this.isParent) {
        action = "edit"
      } else {
        action = "view"
      }
    }
    this.router.navigate(['/' + FORM_TASK_PATH, action], { queryParams: { isParent: this.isParent, selectedData: JSON.stringify(selectedData), listData: JSON.stringify(this.listData) } });
  }
  onfetchData(): void {
    this.tacheService.getAllTache().subscribe((data) => {
      this.listData = data;

    });
  }
  ngOnInit(): void {
    this.onfetchData()
  }
  ngAfterViewInit() {
    console.log('ListData after view init:', this.listData);
  }

}
