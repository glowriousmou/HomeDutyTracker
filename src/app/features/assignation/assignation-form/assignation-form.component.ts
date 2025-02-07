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
import { ValidationAssignation } from '@app/interfaces/validationAssignation';
import { ValidationAssignationService } from '@app/services/validation-assignation.service';

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
  selectedCritere: CritereValidation[] = [];
  listValidationAssignation: ValidationAssignation[] = [];
  action: string = "add";
  form!: FormGroup;
  formFields: any = []
  connectedUser!: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private assignationService: AssignationService,
    private validationAssignationService: ValidationAssignationService,
    private fb: FormBuilder,

  ) {

  }
  ngOnInit() {
    this.connectedUser = localStorage.getItem('connectedUser') ? JSON.parse(localStorage.getItem('connectedUser')!) : null;
    this.getPathParams()

  }
  initializeForm(): void {
    // console.log("aa", this.listTache)
    let statut = ["Initialisé", "Fait", "Inachevé", "Complété"]
    if (!this.isParent && this.connectedUser.id === this.selectedData?.idResponsable) {
      statut = ["Initialisé", "Fait"]
    }
    if (!this.isParent && this.connectedUser.id === this.selectedData?.idSuperviseur) {
      statut = ["Inachevé", "Complété"]
    }
    this.form = this.fb.group({});
    this.formFields = [
      { name: 'tache', label: 'Tache', value: this.selectedData?.tache ?? "", type: 'select', validators: [Validators.required], options: this.listTache.map((tache) => tache.nom) },
      { name: 'responsable', label: 'Responsable', value: this.selectedData?.responsable ?? "", type: 'select', validators: [Validators.required], options: this.listUser.map((user) => user.name) },
      { name: 'superviseur', label: 'Superviseur', value: this.selectedData?.superviseur ?? "", type: 'select', validators: [Validators.required], options: this.listUser.map((user) => user.name) },
      { name: 'datelimite', label: 'Date de limite', type: 'date', value: this.selectedData?.datelimite ?? "", validators: [Validators.required] },
      { name: 'dateValidation', label: 'Date de validation', type: 'date', value: this.selectedData?.dateValidation ?? "", validators: [] },
      { name: 'statut', label: 'Statut', type: 'select', value: this.selectedData?.statut ?? "", validators: [Validators.required], options: statut },
      { name: 'critere', label: 'Critere de validation', value: this.selectedData?.statut ?? "", type: 'checkbox', validators: [] },
    ];
    this.formFields.forEach((field: any) => {
      this.form.addControl(
        field.name,
        this.fb.control(
          //field.type === 'checkbox' ? (field.value || []) : (field.value || ''),
          field.value || '',
          field.validators
        )
      );
    });
    if (this.action === "view") {
      this.form.controls['tache'].disable();
      this.form.controls['responsable'].disable();
      this.form.controls['superviseur'].disable();
      this.form.controls['datelimite'].disable();
      if (this.connectedUser.id !== this.selectedData?.idSuperviseur) {
        this.form.controls['dateValidation'].disable();
      }
    }

    // console.log("ee", this.isParent, this.action)
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
      if (this.selectedData && this.selectedData?.id) {
        this.validationAssignationService.getAllByAssignation(this.selectedData?.id).subscribe((data) => {
          this.listValidationAssignation = data;
          this.selectedCritere = this.listCritere.filter((i: CritereValidation) => this.listValidationAssignation.some((x: ValidationAssignation) => i.id === x.idCritere));
          this.initializeForm();
        });
      } else {
        this.initializeForm();
      }
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
        const validation = this.selectedCritere.map((i: CritereValidation) => {
          return {
            id: `${lastId + 1}${i.id}`,
            idAssignation: String(lastId + 1),
            idCritere: String(i.id),
            etat: "en attente",
          }
        })
        this.validationAssignationService.addMultiValidationAssignation(validation).subscribe({
          next: (resp) => {
            // console.log('newItem saved:', resp);
            alert('Enregistrement effectuée avec succès');
            this.navigateToList()
          },
          error: (err) => console.error('Error saving:', err)
        });
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
      } else if (this.action === "edit" || this.action === "view") {
        let editvalue: Assignation = assignationTache
        if (!this.isParent) {
          editvalue = {
            statut: this.form.value.statut,
            datelimite: this.selectedData?.datelimite ? new Date(this.selectedData.datelimite) : new Date(),
            dateValidation: this.form.value.dateValidation,
            idTache: this.selectedData?.idTache ?? "",
            idCreateur: this.selectedData?.idCreateur ?? '',
            idResponsable: this.selectedData?.idResponsable ?? "",
            idSuperviseur: this.selectedData?.idSuperviseur ?? ""
          }
        }
        this.onEdit(editvalue);
      }
    }
  }
  onSelectCritere(critere: CritereValidation, event: any): void {
    if (event.target.checked) {
      this.selectedCritere.push(critere);
    } else {
      const index = this.selectedCritere.findIndex((i: any) => i.id === critere.id);
      console.log("ddd", index)
      if (index !== -1) {
        this.selectedCritere.splice(index, 1);
      }
    }
    // console.log("this.selectedCritere", this.selectedCritere)
  }

  isSelectedCritere(critere: CritereValidation): boolean {
    return this.selectedCritere.some((selectedCritere: any) => selectedCritere.id === critere.id);
  }

}
