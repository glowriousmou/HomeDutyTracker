import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/interfaces/user';
import { UserService } from './../user.service';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FAMILY_PATH } from '@app/constants/routerPath';

@Component({
  selector: 'app-user-form',
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  isParent: boolean = false;
  listUser: User[] = [];
  selectedUser: User | null = null;
  action: string = "add";
  form!: FormGroup;
  formFields: any = []
  // myForm!: FormGroup;
  errorMsg = '';


  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private userService: UserService, private router: Router) {


  }
  initializeForm(): void {
    this.form = this.fb.group({});
    this.formFields = [
      { name: 'prenomUser', label: 'Prénom', value: this.selectedUser?.prenomUser ?? "", type: 'text', validators: [Validators.required] },
      { name: 'nomUser', label: 'Nom', value: this.selectedUser?.nomUser ?? "", type: 'text', validators: [Validators.required] },
      { name: 'email', label: 'Email', type: 'email', value: this.selectedUser?.email ?? "", validators: [Validators.required, Validators.email] },
      { name: 'telephone', label: 'Téléphone', type: 'number', value: this.selectedUser?.telephone ?? "", validators: [Validators.required, Validators.minLength(8), Validators.maxLength(8)] },
      // { name: 'telephone', label: 'Téléphone', type: 'text', validators: [Validators.required, Validators.pattern(/^/d{8}$/)] },
      { name: 'dateNaissance', label: 'Date de naissance', type: 'date', value: this.selectedUser?.dateNaissance ?? "", validators: [Validators.required] },
      { name: 'sexe', label: 'Sexe', type: 'select', value: this.selectedUser?.sexe ?? "", validators: [Validators.required], options: ['M', 'F'] }
    ];
    // console.log("sss", this.formFields);
    /* this.formFields.forEach((field: any) => {
      this.form?.addControl(field.name, this.fb.control('', field.validators), new FormControl(field.value || ''));
    }); */
    this.formFields.forEach((field: any) => {
      this.form.addControl(field.name, this.fb.control(field.value || '', field.validators));
    });
  }
  ngOnInit() {
    this.getPathParams()

  }
  ngAfterViewInit() {
    // console.log('isParent after view init:', this.isParent, typeof this.isParent);
    // console.log('form.invalid after view init:', this.form.invalid);
  }


  getPathParams(): void {
    this.activatedRoute.params?.subscribe(params => {

      // console.log("ParamsAction:", params);
      this.action = params['action'];
      //console.log("Action:", this.action);

    });
    this.activatedRoute.queryParams?.subscribe(params => {
      //console.log("Params:", params);
      this.isParent = params['isParent']?.toLowerCase() === "true";
      this.selectedUser = params['selectedUser'] ? JSON.parse(params['selectedUser']) : null;
      this.listUser = params['listUser'] ? JSON.parse(params['listUser']) : null;

      // console.log("Is Parent:", isParent);
      // console.log("Selected User:", this.selectedUser);
      // console.log("Selected User:", params['listUser']);
    });
    this.initializeForm();
  }

  navigateToFamilyTree(): void {

    this.router.navigate(['/' + FAMILY_PATH]);
  }
  onSave(): void {
    const lastId = Math.max(...this.listUser.map(i => Number(i.id)));
    let photo = "assets/avatar/son.jpg"
    if (this.form.value.sexe == "F") {
      photo = "assets/avatar/daughter.jpg"
    }
    const newItem = { ...this.form.value, ...{ id: `${lastId + 1}`, idRole: "Enfant", photo } }
    this.userService.addUser(newItem).subscribe({
      next: (resp) => {
        console.log('newItem saved:', resp);
        alert('Enregistrement effectuée avec succès');
        this.navigateToFamilyTree()
      },
      error: (err) => console.error('Error saving etudiante:', err)
    });

  }
  onEdit(): void {
    let photo = "assets/avatar/son.jpg"
    if (this.form.value.sexe == "F" && this.selectedUser?.idRole === "Enfant") {
      photo = "assets/avatar/daughter.jpg"
    } else if (this.form.value.sexe == "F" && this.selectedUser?.idRole === "Parent") {
      photo = "assets/avatar/mother.jpg"
    } else if (this.form.value.sexe == "M" && this.selectedUser?.idRole === "Parent") {
      photo = "assets/avatar/father.jpg"
    }

    const editItem = { ...this.form.value, ...{ photo, id: this.selectedUser?.id, idRole: this.selectedUser?.idRole } }
    this.userService.editUser(editItem).subscribe({
      next: (resp) => {
        console.log('item edit:', resp);
        alert('Modification effectuée avec succès');
        this.navigateToFamilyTree()

      },
      error: (err) => console.error('Error editing item:', err)
    });

  }

  onSubmit() {
    this.errorMsg = '';

    if (this.form.valid) {
      console.log('Form Submitted: out ', this.action);
      if (this.action === "add") {
        this.onSave();
      } else if (this.action === "edit") {
        this.onEdit();
      }

      console.log('Form Submitted:', this.form.value);
    }
    // console.log('Form Submitted:', this.loginForm.value);
    /* this.authenticationService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          // console.log("isAuthenticated", isAuthenticated)
          const connectedUser: User | null = localStorage.getItem('connectedUser') ? JSON.parse(localStorage.getItem('connectedUser')!)
            : null;
          // console.log("connectedUser", connectedUser)
          this.router.navigate([DASHBOARD_PATH]);
        } else {
          this.errorMsg = 'Email ou Mot de passe incorrect';
        }
      },
      (err) => {
 
        this.errorMsg = "Une erreur s'est produite";
        console.error('Erreur d\'authentification:', err); // Enregistrer l'erreur pour débogage
      }
    ); */
  }

}


