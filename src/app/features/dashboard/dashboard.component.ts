import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { Chart, registerables, ChartData } from 'chart.js';

import { AssignationService } from '@features/assignation/assignation.service';
import { UserService } from '@app/features/users/user.service';
import { TacheService } from '@app/features/setting/tache/tache.service';
import { CritereValidationService } from '@app/features/setting/critere-validation/critere-validation.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { Assignation } from '@app/interfaces/assignation';
import { User } from '@app/interfaces/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',
  imports: [NavbarComponent, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  title = 'HDT | Dashboard';
  listAssignationCompte: { label: string[], count: number[], color: string[] } = { label: [], count: [], color: [] }
  listData: Assignation[] = []
  // listUser: User[] = []
  listUser = new BehaviorSubject<User[]>([]);

  barChartData: ChartData<'bar'> = { labels: [], datasets: [] }
  constructor(
    private assignationService: AssignationService,
    private userService: UserService,
    private tacheService: TacheService,
    private critereValidationService: CritereValidationService) { }
  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  @ViewChild('barCanvas') barCanvas!: ElementRef;
  pieChart!: Chart;
  barChart!: Chart;

  ngAfterViewInit() {
    this.onfetchData()
    // this.createPieChart();
  }
  ngOnInit() {
    // this.onfetchData()
  }
  setPieChartData(array: Assignation[]) {
    // const countData = this.setPieChartData(data);

    const countObj = array.reduce((acc: { [key: string]: number }, assignation) => {
      const statut = assignation.statut;
      acc[statut] = (acc[statut] || 0) + 1;
      return acc;
    }, {});

    // Transformation en tableau d'objets avec couleur
    const countData = Object.keys(countObj).map(statut => {
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
    this.listAssignationCompte = { label: countData.map((i) => i.statut), count: countData.map((i) => i.count), color: countData.map((i) => i.color) }
    this.createPieChart();
  }
  setBarChartData(dataArray: Assignation[]) {
    const labels = [...new Set(dataArray.map(item => item.responsable))];

    // Catégories (statuts des animaux)
    const statuts = [
      { statut: "En attente", color: "gray" },
      { statut: "En cours", color: "blue" },
      { statut: "Fait", color: "yellow" },
      { statut: "En retard", color: "red" },
      { statut: "Inachevé", color: "orange" },
      { statut: "Complété", color: "green" }
    ];

    const counts: { [key: string]: { [key: string]: number } } = {};
    labels.forEach((user: string | undefined) => {
      if (user) {
        counts[user] = {};
        statuts.forEach(statut => {
          counts[user][statut.statut] = dataArray.filter(item => item.responsable === user && item.statut === statut.statut).length;
        });
      }
    });
    const datasets = statuts.map((statut, index) => ({
      label: statut.statut,
      data: labels.map(user => user ? counts[user][statut.statut] : 0), // On récupère le nombre d'occurrences
      backgroundColor: statut.color
    }));
    this.barChartData = {
      labels, // Noms des utilisateurs
      datasets // Données classées par statut
    };
    this.createBarChart();
  }
  setChartData(data: Assignation[]): void {
    this.setPieChartData(data);
    this.setBarChartData(data);

  }
  onfetchData(): void {
    forkJoin({
      assignations: this.assignationService.getAllAssignation(),
      taches: this.tacheService.getAllTache(),
      users: this.userService.getAllUser(),
      criteres: this.critereValidationService.getAllCritereValidation()
    }).subscribe({
      next: (result) => {
        this.listUser.next(result.users.map((i: User) => ({ ...i, name: `${i.prenomUser ?? ''} ${i.nomUser ?? ''}` })))
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
        this.listData = dataAssignation
        this.setChartData(dataAssignation);
        console.log("ss", this.listUser)
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
  createBarChart() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: this.barChartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

  }
  onFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedIndex = target.options.selectedIndex; // Index de l'option sélectionnée
    const userId = target.options[selectedIndex].value;
    // console.log("ss", userId)
    let dataAssignation = this.listData
    if (userId !== "") {
      dataAssignation = this.listData.filter((i: Assignation) => i.idResponsable === userId)
    }

    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.barChart) {
      this.barChart.destroy();
    }
    this.setChartData(dataAssignation);
  }
}
