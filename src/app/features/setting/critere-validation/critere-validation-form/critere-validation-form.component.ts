import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CritereValidation } from '@app/interfaces/critereValidation';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { CritereValidationService } from '@features/setting/critere-validation/critere-validation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LIST_CRITERE_PATH } from '@app/constants/routerPath';

@Component({
  selector: 'app-critereValidation-form',
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './critere-validation-form.component.html',
  styleUrl: './critere-validation-form.component.css'
})
export class CritereValidationFormComponent {
  isParent: boolean = false;
  selectedData: CritereValidation | null = null;
  listData: CritereValidation[] = [];
  action: string = "add";
  form!: FormGroup;
  formFields: any = []

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private critereValidationService: CritereValidationService, private fb: FormBuilder,) {
  }
  ngOnInit() {
    this.getPathParams()

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
    this.router.navigate(['/' + LIST_CRITERE_PATH]);
  }
  onSave(): void {
    const lastId = this.listData.reduce((max, i) => Math.max(max, isNaN(Number(i.id)) ? 0 : Number(i.id)), 0);
    const newItem = { ...this.form.value, ...{ id: `${lastId + 1}` } }
    this.critereValidationService.addCritereValidation(newItem).subscribe({
      next: (resp) => {
        // console.log('newItem saved:', resp);
        alert('Enregistrement effectuée avec succès');
        this.navigateToList()
      },
      error: (err) => console.error('Error saving:', err)
    });

  }
  onEdit(): void {

    const editItem = { ...this.form.value, ...{ id: this.selectedData?.id } };
    this.critereValidationService.editCritereValidation(editItem).subscribe({
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
      if (this.action === "add") {
        this.onSave();
      } else if (this.action === "edit") {
        this.onEdit();
      }
    }
  }

}
