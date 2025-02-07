import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_TASK_PATH } from '@app/constants/routerPath';
import { AuthenticationService } from '@app/guards/authentication.service';
import { Tache } from '@app/interfaces/tache';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { TacheService } from './tache.service';
import { NgxDatatableModule, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-tache',
  imports: [NavbarComponent, NgxDatatableModule, FormsModule, CommonModule],
  templateUrl: './tache.component.html',
  styleUrl: './tache.component.css'
})
export class TacheComponent {
  isParent: boolean = false;
  selectedData: Tache | null = null;
  listData: Tache[] = [];
  searchText: string = '';
  filteredData: Tache[] = [];
  sortType: SortType = SortType.multi;
  selectionType: SelectionType = SelectionType.single;
  currentPage = 1;
  pageSize = 10;
  pagedData: Tache[] = [];
  DataTableColumns = [
    { prop: 'nom', name: 'Nom' },
    { prop: 'description', name: 'Description' }
  ];
  messages = {
    emptyMessage: 'Aucune donnée trouvé',
    // totalMessage: 'ligne (s) ',
    // selectedMessage: 'Lignes sélectionnées : {{ selected }}',

  };
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
