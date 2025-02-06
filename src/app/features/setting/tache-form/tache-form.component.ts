import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tache } from '@app/interfaces/tache';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { TacheService } from '../tache/tache.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LIST_TASK_PATH } from '@app/constants/routerPath';

@Component({
  selector: 'app-tache-form',
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './tache-form.component.html',
  styleUrl: './tache-form.component.css'
})
export class TacheFormComponent {
  isParent: boolean = false;
  selectedData: Tache | null = null;
  listData: Tache[] = [];
  action: string = "add";
  form!: FormGroup;
  formFields: any = []

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private tacheService: TacheService, private fb: FormBuilder,) {
  }
  initializeForm(): void {
    this.form = this.fb.group({});
    this.formFields = [
      { name: 'nom', label: 'Nom', value: this.selectedData?.nom ?? "", type: 'text', validators: [Validators.required] },
      { name: 'description', label: 'Description', value: this.selectedData?.description ?? "", type: 'text', validators: [Validators.required] },
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
    });
    this.initializeForm();
  }

  navigateToList(): void {
    this.router.navigate(['/' + LIST_TASK_PATH]);
  }
  onSave(): void {
    const lastId = Math.max(...this.listData.map(i => Number(i.id)));
    const newItem = { ...this.form.value, ...{ id: `${lastId + 1}` } }
    this.tacheService.addTache(newItem).subscribe({
      next: (resp) => {
        console.log('newItem saved:', resp);
        alert('Enregistrement effectuée avec succès');
        this.navigateToList()
      },
      error: (err) => console.error('Error saving:', err)
    });

  }
  onEdit(): void {

    const editItem = { ...this.form.value, ...{ id: this.selectedData?.id } };
    this.tacheService.editTache(editItem).subscribe({
      next: (resp) => {
        console.log('item edit:', resp);
        alert('Modification effectuée avec succès');
        this.navigateToList()
      },
      error: (err) => console.error('Error editing item:', err)
    });

  }

  onSubmit() {
    if (this.form.valid) {
      if (this.action === "add") {
        this.onSave();
      } else if (this.action === "edit") {
        this.onEdit();
      }
    }
  }

}
