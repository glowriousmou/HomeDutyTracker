import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FamilyTree } from '../family-tree/family-tree.interface';

@Component({
  selector: 'app-family-tree-node',
  imports: [CommonModule],
  templateUrl: './family-tree-node.component.html',
  styleUrl: './family-tree-node.component.css'
})
export class FamilyTreeNodeComponent {
  @Input() familyTreeNode!: FamilyTree;
}
