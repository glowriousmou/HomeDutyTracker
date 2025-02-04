import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { FamilyTree } from './family-tree.interface';
import { UserService } from '../user.service';
import { User } from '@app/interfaces/user';
// import { FamilyTreeNodeComponent } from '@features/users/family-tree-node/family-tree-node.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-family-tree',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './family-tree.component.html',
  styleUrl: './family-tree.component.css'
})
export class FamilyTreeComponent implements OnInit {
  familyTree: any = {
    id: "0",
    name: ""
  };


  constructor(private userService: UserService) {
  }

  convertToFamilyOrgNode(users: User[]): any[] {
    // Filtrer les parents (idRole "Parent" ou "parent")
    const parents = users.filter(user => user.idRole?.toLowerCase() === 'parent');

    // Filtrer les enfants (idRole "Enfant")
    const children = users.filter(user => user.idRole?.toLowerCase() === 'enfant');

    // Créer les nœuds pour les parents
    const parentNodes: FamilyTree[] = parents.map(parent => ({
      ...parent,
      role: 'Parent',
      name: `${parent.prenomUser} ${parent.nomUser}`,
      level: 'top',
    }));

    // Créer les nœuds pour les enfants
    const childNodes: FamilyTree[] = children.map(child => ({
      ...child,
      role: 'Enfant',
      name: `${child.prenomUser} ${child.nomUser}`,
    }))


    // Construire le nœud "Famille" englobant les parents et les enfants
    /* const familyNode: FamilyTree = {
      id: "0", // ID fictif pour le nœud "Famille"
      name: 'Famille SOW',
      children: [
        ...parentNodes,
        {
          id: "-1", // ID fictif pour le nœud "Enfants"
          name: 'Enfants',
          children: childNodes
        }
      ]
    }; */
    // console.log("familyNode", familyNode);
    // const familyNode = [...parentNodes, ...[{ level: 'split' }], ...[{ level: 'bottom', subordinates: childNodes }]];
    const familyNode = [
      { level: 1, members: parentNodes },
      { level: 2, members: childNodes },
    ];
    return familyNode;
  }

  onfetchData(): void {
    this.userService.getAllUser().subscribe((data) => {
      const orgChartData = this.convertToFamilyOrgNode(data);
      console.log("aaa", orgChartData);
      this.familyTree = orgChartData;

    });
  }
  ngOnInit(): void {
    this.onfetchData()
  }
  // orgChart = [
  //   { name: 'Daniel Anilkumar', title: 'VP - Global Procurement & Real Estate', level: 'top' },
  //   { name: 'Santhosh Mathias', title: 'Director - Global Travel & Related Services', level: 'mid' },
  //   { level: 'split' },
  //   {
  //     level: 'bottom',
  //     subordinates: [
  //       { name: 'Anuja Malhotra', title: 'Sr. Manager - Global & Travel & Related Services' },
  //       { name: 'Masood Ahmed', title: 'Manager - Global Travel & Related Services' }
  //     ]
  //   },
  //   { name: 'Gopal Verma', title: 'Contact Staff - MIS & Administrative Handling', level: 'contact' }
  // ];
  orgChartData = [
    { level: 1, members: [{ name: "Daniel Anilkumar", title: "VP - Global Procurement & Real Estate" }, { name: "Santhosh Mathias", title: "Director - Global Travel & Related Services" }] },
    { level: 2, members: [{ name: "Santhosh Mathias", title: "Director - Global Travel & Related Services" }] },
    {
      level: 3, members: [
        { name: "Anuja Malhotra", title: "Sr. Manager - Global Travel" },
        { name: "Masood Ahmed", title: "Manager - Global Travel" }
      ]
    },
    { level: 4, members: [{ name: "Gopal Verma", title: "Contact Staff - MIS & Admin Handling" }] }
  ];

}
