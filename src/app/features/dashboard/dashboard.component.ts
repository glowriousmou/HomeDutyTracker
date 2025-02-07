import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { Chart, registerables } from 'chart.js';

import { AssignationService } from '@features/assignation/assignation.service';
import { UserService } from '@app/features/users/user.service';
import { TacheService } from '@app/features/setting/tache/tache.service';
import { CritereValidationService } from '@app/features/setting/critere-validation/critere-validation.service';
import { forkJoin } from 'rxjs';
import { Assignation } from '@app/interfaces/assignation';
import { User } from '@app/interfaces/user';

Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent,],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  title = 'HDT | Dashboard';
  listAssignationCompte: { label: string[], count: number[], color: string[] } = { label: [], count: [], color: [] }
  constructor(
    private assignationService: AssignationService,
    private userService: UserService,
    private tacheService: TacheService,
    private critereValidationService: CritereValidationService) { }
  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  pieChart!: Chart;

  ngAfterViewInit() {
    this.onfetchData()
    // this.createPieChart();
  }
  ngOnInit() {
    // this.onfetchData()
  }
  compterOccurrencesStatut(array: Assignation[]) {
    const countObj = array.reduce((acc: { [key: string]: number }, assignation) => {
      const statut = assignation.statut;
      acc[statut] = (acc[statut] || 0) + 1;
      return acc;
    }, {});

    // Transformation en tableau d'objets avec couleur
    return Object.keys(countObj).map(statut => {
      let color = "gray"
      if (statut === "En cours") {
        color = "blue"
      } else if (statut === "Fait") {
        color = "yellow"
      } else if (statut === "En retard") {
        color = "red"
      } else if (statut === "Inachevé") {
        color = "orange"
      } else if (statut === "Complété") {
        color = "green"
      }
      return {
        statut,
        count: countObj[statut],
        color
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
          // const tache = result.taches.find((i: Tache) => i.id === assignation.idTache);

          return {
            ...assignation,
            // tache: tache ? tache.nom : 'Introuvable',
            createur: createur ? `${createur.prenomUser ?? ''} ${createur.nomUser ?? ''}` : 'Introuvable',
            responsable: responsable ? `${responsable.prenomUser ?? ''} ${responsable.nomUser ?? ''}` : 'Introuvable',
            superviseur: superviseur ? `${superviseur.prenomUser ?? ''} ${superviseur.nomUser ?? ''}` : 'Introuvable',
            // deadline: dateFormat(assignation.datelimite)

          };
        });
        const countData = this.compterOccurrencesStatut(dataAssignation);
        this.listAssignationCompte = { label: countData.map((i) => i.statut), count: countData.map((i) => i.count), color: countData.map((i) => i.color) }
        this.createPieChart();
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  createPieChart() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        // labels: ["En attente", "En cours", "Fait", "En retard", "Inachevé", "Complété"],
        labels: this.listAssignationCompte?.label,
        datasets: [{
          // data: [35, 25, 40],
          data: this.listAssignationCompte?.count,
          // backgroundColor: ['#5AA454', '#E44D25', '#CFC0BB'],
          backgroundColor: this.listAssignationCompte?.color,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { enabled: true }
        }
      }
    });
  }

}
