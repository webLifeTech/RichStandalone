import { CommonModule } from '@angular/common';
import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-card-types',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './card-types.component.html',
  styleUrl: './card-types.component.scss'
})
export class CardTypesComponent {
  @Input() card_type: string;
}
