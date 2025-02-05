import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { FamilyTree } from './family-tree.interface';
import { UserService } from '../user.service';
import { User } from '@app/interfaces/user';
import { FORM_USER_PATH } from '@app/constants/routerPath';
// import { FamilyTreeNodeComponent } from '@features/users/family-tree-node/family-tree-node.component';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@app/guards/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-tree',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './family-tree.component.html',
  styleUrl: './family-tree.component.css'
})
export class FamilyTreeComponent implements OnInit {
  familyTree: any = [];
  listUser: User[] = [];
  isParent: boolean = false;
  selectedUser: User | null = null;


  constructor(private userService: UserService, private authenticationService: AuthenticationService, private router: Router) {
    this.isParent = this.authenticationService.checkRole("Parent");
  }

  convertToFamilyOrgNode(users: User[]): any[] {
    const parents = users.filter(user => user.idRole?.toLowerCase() === 'parent');
    const children = users.filter(user => user.idRole?.toLowerCase() === 'enfant');

    const parentNodes: FamilyTree[] = parents.map(parent => ({
      ...parent,
      role: 'Parent',
      name: `${parent.prenomUser} ${parent.nomUser}`,
    }));
    const childNodes: FamilyTree[] = children.map(child => ({
      ...child,
      role: 'Enfant',
      name: `${child.prenomUser} ${child.nomUser}`,
    }))

    const familyNode = [
      { level: 1, members: parentNodes },
      { level: 2, members: childNodes },
    ];
    return familyNode;
  }

  onfetchData(): void {
    this.userService.getAllUser().subscribe((data) => {
      this.listUser = data;
      const orgChartData = this.convertToFamilyOrgNode(data);
      // console.log("aaa", orgChartData);
      this.familyTree = orgChartData;

    });
  }
  ngOnInit(): void {
    this.onfetchData()
  }

  navigateToForm(selectedUser: User | null): void {
    // console.log("selectedUser", selectedUser)
    // this.router.navigate(['/' + FORM_USER_PATH, selectedUser]);
    let action = "add"
    if (selectedUser) {
      if (this.isParent) {
        action = "edit"
      } else {
        action = "view"
      }
    }
    this.router.navigate(['/' + FORM_USER_PATH, action], { queryParams: { isParent: this.isParent, selectedUser: JSON.stringify(selectedUser), listUser: JSON.stringify(this.listUser) } });
  }


}
