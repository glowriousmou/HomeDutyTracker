import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_CRITERE_PATH } from '@app/constants/routerPath';
import { AuthenticationService } from '@app/guards/authentication.service';
import { CritereValidation } from '@app/interfaces/critereValidation';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { CritereValidationService } from '@features/setting/critere-validation/critere-validation.service';;
import { NgxDatatableModule, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-critereValidation',
  imports: [NavbarComponent, NgxDatatableModule, FormsModule, CommonModule],
  templateUrl: './critere-validation.component.html',
  styleUrl: './critere-validation.component.css'
})
export class CritereValidationComponent {
  isParent: boolean = false;
  selectedData: CritereValidation | null = null;
  listData: CritereValidation[] = [];
  searchText: string = '';
  filteredData: CritereValidation[] = [];
  sortType: SortType = SortType.multi;
  selectionType: SelectionType = SelectionType.single;
  DataTableColumns = [
    { prop: 'nom', name: 'Nom' },
    { prop: 'description', name: 'Description' }
  ];
  messages = {
    emptyMessage: 'Aucune donnée trouvé',
    totalMessage: 'ligne (s) ',
    // selectedMessage: 'Lignes sélectionnées : {{ selected }}',

  };
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
      this.filteredData = data;
      // console.log('ListData onfetchData:', this.listData);

    });
  }
  filterDataTable() {
    this.filteredData = this.listData.filter(data =>
      data.nom.toLowerCase().includes(this.searchText.toLowerCase()) ||
      data.description.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
  ngOnInit(): void {
    this.onfetchData()
  }
  ngAfterViewInit() {
    // console.log('ListData after view init:', this.listData);
  }

}
