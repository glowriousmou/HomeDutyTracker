import { Component } from '@angular/core';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { NgxDatatableModule, SelectionType, SortType } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent {
  // rows = [
  //   { id: 1, name: 'Jean Dupont', age: 30, email: 'jean@example.com' },
  //   { id: 2, name: 'Marie Curie', age: 40, email: 'marie@example.com' },
  //   { id: 3, name: 'Albert Einstein', age: 50, email: 'albert@example.com' },
  //   { id: 4, name: 'Isaac Newton', age: 45, email: 'isaac@example.com' }
  // ];

  rows = [
    {
      img: 'https://mdbootstrap.com/img/new/avatars/8.jpg',
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      title: 'Software Engineer',
      department: 'IT',
      status: 'Active',
      position: 'Senior'
    },
    {
      img: 'https://mdbootstrap.com/img/new/avatars/6.jpg',
      name: 'Alex Ray',
      email: 'alex.ray@gmail.com',
      title: 'Consultant',
      department: 'Finance',
      status: 'Onboarding',
      position: 'Junior'
    },
    {
      img: 'https://mdbootstrap.com/img/new/avatars/7.jpg',
      name: 'Kate Huntington',
      email: 'kate.huntington@gmail.com',
      title: 'Designer',
      department: 'UI/UX',
      status: 'Awaiting',
      position: 'Senior'
    }
  ];
  filteredRows = [...this.rows];
  searchQuery = '';
  sortType: SortType = SortType.multi;
  selectionType: SelectionType = SelectionType.single;
  selected: any[] = [];
  // Filtrage du tableau
  filterTable() {
    this.filteredRows = this.rows.filter(row =>
      row.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      row.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Action sur le clic d'une ligne
  onRowClick(row: any) {
    alert(`Vous avez cliqué sur : ${row.name}`);
  }
  onSelect({ selected }: { selected: any[] }) {
    this.selected = selected;
    console.log('Ligne sélectionnée:', this.selected);
  }

}
