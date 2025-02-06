import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_CRITERE_PATH } from '@app/constants/routerPath';
import { AuthenticationService } from '@app/guards/authentication.service';
import { CritereValidation } from '@app/interfaces/critereValidation';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { CritereValidationService } from './critere-validation.service';

@Component({
  selector: 'app-critere-validation',
  imports: [NavbarComponent],
  templateUrl: './critere-validation.component.html',
  styleUrl: './critere-validation.component.css'
})
export class CritereValidationComponent {
  isParent: boolean = false;
  selectedData: CritereValidation | null = null;
  listData: CritereValidation[] = [];

  constructor(private authenticationService: AuthenticationService, private router: Router, private critereValidationService: CritereValidationService) {
    this.isParent = this.authenticationService.checkRole("Parent");
  }
  navigateToForm(selectedData: CritereValidation | null): void {
    let action = "add"
    if (selectedData) {
      if (this.isParent) {
        action = "edit"
      } else {
        action = "view"
      }
    }
    this.router.navigate(['/' + FORM_CRITERE_PATH, action], { queryParams: { isParent: this.isParent, selectedData: JSON.stringify(selectedData), listData: JSON.stringify(this.listData) } });
  }
  onfetchData(): void {
    this.critereValidationService.getAllCritereValidation().subscribe((data) => {
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
