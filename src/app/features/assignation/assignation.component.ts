import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_ASSIGNATION_PATH, FORM_TASK_PATH } from '@app/constants/routerPath';
import { AuthenticationService } from '@app/guards/authentication.service';
import { Assignation } from '@app/interfaces/assignation';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { AssignationService } from './assignation.service';
import { UserService } from '@app/features/users/user.service';
import { TacheService } from '@app/features/setting/tache/tache.service';
import { CritereValidationService } from '@app/features/setting/critere-validation/critere-validation.service';
import { forkJoin } from 'rxjs';
import { NgxDatatableModule, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '@app/interfaces/user';
import { Tache } from '@app/interfaces/tache';
import { CritereValidation } from '@app/interfaces/critereValidation';
import dateFormat from '@app/utils/dateFormat';



@Component({
  selector: 'app-assignation',
  imports: [NavbarComponent, NgxDatatableModule, FormsModule, CommonModule],
  templateUrl: './assignation.component.html',
  styleUrl: './assignation.component.css'
})
export class AssignationComponent {
  isParent: boolean = false;
  selectedData: Assignation | null = null;
  listData: Assignation[] = [];
  searchText: string = '';
  filteredData: Assignation[] = [];
  sortType: SortType = SortType.multi;
  selectionType: SelectionType = SelectionType.single;
  listUser: User[] = [];
  listTache: Tache[] = [];
  listCritere: CritereValidation[] = [];
  selectedCritere: CritereValidation[] = [];
  DataTableColumns = [
    { prop: 'tache', name: 'Tache' },
    { prop: 'responsable', name: 'Responsable' },
    { prop: 'superviseur', name: 'Superviseur' },
    { prop: 'deadline', name: 'Date limite' },
    { prop: 'statut', name: 'Statut' },
  ];
  messages = {
    emptyMessage: 'Aucune donnée trouvé',
    totalMessage: 'ligne (s) ',
    // selectedMessage: 'Lignes sélectionnées : {{ selected }}',

  };
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private assignationService: AssignationService,
    private userService: UserService,
    private tacheService: TacheService,
    private critereValidationService: CritereValidationService
  ) {
    this.isParent = this.authenticationService.checkRole("Parent");
  }

  navigateToForm(selectedData: Assignation | null): void {
    let action = "add"
    if (selectedData) {
      if (this.isParent) {
        action = "edit"
      } else {
        action = "view"
      }
    }
    this.router.navigate(
      ['/' + FORM_ASSIGNATION_PATH, action],
      {
        queryParams: {
          isParent: this.isParent,
          selectedData: JSON.stringify(selectedData),
          listData: JSON.stringify(this.listData),
          listTache: JSON.stringify(this.listTache),
          listUser: JSON.stringify(this.listUser),
          listCritere: JSON.stringify(this.listCritere),
        }
      });
  }

  onfetchData(): void {
    forkJoin({
      assignations: this.assignationService.getAllAssignation(),
      taches: this.tacheService.getAllTache(),
      users: this.userService.getAllUser(),
      criteres: this.critereValidationService.getAllCritereValidation()
    }).subscribe({
      next: (result) => {
        const dataAssignation = result.assignations.map((assignation: Assignation) => {
          const createur = result.users.find((i: User) => i.id === assignation.idCreateur);
          const responsable = result.users.find((i: User) => i.id === assignation.idResponsable);
          const superviseur = result.users.find((i: User) => i.id === assignation.idSuperviseur);
          const tache = result.taches.find((i: Tache) => i.id === assignation.idTache);

          return {
            ...assignation,
            tache: tache ? tache.nom : 'Introuvable',
            createur: createur ? `${createur.prenomUser ?? ''} ${createur.nomUser ?? ''}` : 'Introuvable',
            responsable: responsable ? `${responsable.prenomUser ?? ''} ${responsable.nomUser ?? ''}` : 'Introuvable',
            superviseur: superviseur ? `${superviseur.prenomUser ?? ''} ${superviseur.nomUser ?? ''}` : 'Introuvable',
            deadline: dateFormat(assignation.datelimite)

          };
        });
        this.listData = dataAssignation;

        if (!this.isParent) {
          const connectedUser = localStorage.getItem('connectedUser') ? JSON.parse(localStorage.getItem('connectedUser')!) : null;
          this.listData = dataAssignation.filter((i: Assignation) => i.idSuperviseur === connectedUser.id || i.idResponsable === connectedUser.id);
        }
        this.filteredData = this.listData;
        this.listTache = result.taches;
        this.listUser = result.users.map((user: User) => ({ ...user, ...{ name: `${user.prenomUser ?? ''} ${user.nomUser ?? ''}` } }));
        this.listCritere = result.criteres;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  filterDataTable() {
    this.filteredData = this.listData.filter(data =>
      data.tache?.toLowerCase().includes(this.searchText?.toLowerCase()) ||
      data.responsable?.toLowerCase().includes(this.searchText?.toLowerCase())
    );
  }
  ngOnInit(): void {
    this.onfetchData()
  }
  ngAfterViewInit() {
    // console.log('ListData after view init:', this.listData);
  }

  getStatusClass(statut: string): string {

    switch (statut) {
      case '':
        return 'Complété';
      case 'Fait':
        return 'bg-yellow';
      case 'Inachevé':
        return 'bg-red';
      default:
        return 'bg-default';
    }
  }
}
