import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Assignation } from '@app/interfaces/assignation';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { AssignationService } from '../assignation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LIST_ASSIGNATION_PATH } from '@app/constants/routerPath';
import { User } from '@app/interfaces/user';
import { Tache } from '@app/interfaces/tache';
import { CritereValidation } from '@app/interfaces/critereValidation';

@Component({
  selector: 'app-assignation-form',
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './assignation-form.component.html',
  styleUrl: './assignation-form.component.css'
})
export class AssignationFormComponent {
  isParent: boolean = false;
  selectedData: Assignation | null = null;
  listData: Assignation[] = [];
  listUser: User[] = [];
  listTache: Tache[] = [];
  listCritere: CritereValidation[] = [];
  action: string = "add";
  form!: FormGroup;
  formFields: any = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private assignationService: AssignationService,
    private fb: FormBuilder,

  ) {

  }
  ngOnInit() {
    this.getPathParams()

  }
  initializeForm(): void {
    // console.log("aa", this.listTache)
    this.form = this.fb.group({});
    this.formFields = [
      { name: 'tache', label: 'Tache', value: this.selectedData?.tache ?? "", type: 'select', validators: [Validators.required], options: this.listTache.map((tache) => tache.nom) },
      { name: 'responsable', label: 'Responsable', value: this.selectedData?.responsable ?? "", type: 'select', validators: [Validators.required], options: this.listUser.map((user) => user.name) },
      { name: 'superviseur', label: 'Superviseur', value: this.selectedData?.superviseur ?? "", type: 'select', validators: [Validators.required], options: this.listUser.map((user) => user.name) },
      { name: 'datelimite', label: 'Date de limite', type: 'date', value: this.selectedData?.datelimite ?? "", validators: [Validators.required] },
      { name: 'dateValidation', label: 'Date de validation', type: 'date', value: this.selectedData?.dateValidation ?? "", validators: [] },
      { name: 'statut', label: 'Statut', type: 'select', value: this.selectedData?.statut ?? "", validators: [Validators.required], options: ["Initialisé", "Fait", "Inachevé", "Complété"] },
    ];
    this.formFields.forEach((field: any) => {
      this.form.addControl(field.name, this.fb.control(field.value || '', field.validators));
    });
  }
  getPathParams(): void {
    this.activatedRoute.params?.subscribe(params => {
      this.action = params['action'];
    });
    this.activatedRoute.queryParams?.subscribe(params => {
      this.isParent = params['isParent']?.toLowerCase() === "true";
      this.selectedData = params['selectedData'] ? JSON.parse(params['selectedData']) : null;
      this.listData = params['listData'] ? JSON.parse(params['listData']) : null;
      this.listTache = params['listTache'] ? JSON.parse(params['listTache']) : null;
      this.listUser = params['listUser'] ? JSON.parse(params['listUser']) : null;
      this.listCritere = params['listCritere'] ? JSON.parse(params['listCritere']) : null;
      this.initializeForm();
    });

  }


  navigateToList(): void {
    this.router.navigate(['/' + LIST_ASSIGNATION_PATH]);
  }
  onSave(assignationTache: Assignation): void {
    const lastId = this.listData.reduce((max, i) => Math.max(max, isNaN(Number(i.id)) ? 0 : Number(i.id)), 0);
    const newItem = { ...assignationTache, ...{ id: `${lastId + 1}` } }
    this.assignationService.addAssignation(newItem).subscribe({
      next: (resp) => {
        // console.log('newItem saved:', resp);
        alert('Enregistrement effectuée avec succès');
        this.navigateToList()
      },
      error: (err) => console.error('Error saving:', err)
    });

  }
  onEdit(assignationTache: Assignation): void {

    const editItem = { ...assignationTache, ...{ id: this.selectedData?.id ?? "" } };
    this.assignationService.editAssignation(editItem).subscribe({
      next: (resp) => {
        // console.log('item edit:', resp);
        alert('Modification effectuée avec succès');
        this.navigateToList()
      },
      error: (err) => console.error('Error editing item:', err)
    });

  }

  onSubmit() {
    if (this.form.valid) {
      const idTache = this.listTache.find((tache) => tache.nom === this.form.value.tache)?.id ?? "";
      const idCreateur = localStorage.getItem('connectedUser') ? JSON.parse(localStorage.getItem('connectedUser')!)?.id : null;
      const idResponsable = this.listUser.find((user) => `${user.prenomUser ?? ''} ${user.nomUser ?? ''}` === this.form.value.responsable)?.id ?? "";
      const idSuperviseur = this.listUser.find((user) => `${user.prenomUser ?? ''} ${user.nomUser ?? ''}` === this.form.value.superviseur)?.id ?? "";
      const assignationTache: Assignation = {
        statut: this.form.value.statut,
        datelimite: this.form.value.datelimite,
        dateValidation: this.form.value.ateValidation,
        idTache,
        idCreateur,
        idResponsable,
        idSuperviseur
      }
      if (this.action === "add") {
        this.onSave(assignationTache);
      } else if (this.action === "edit") {
        this.onEdit(assignationTache);
      }
    }
  }

}
