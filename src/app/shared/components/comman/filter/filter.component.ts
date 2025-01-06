import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CabFilterComponent } from './cab-filter/cab-filter.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    CabFilterComponent
  ],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {

  @Input() type: string;
  @Input() mapFilter: boolean;

  @Input() district: boolean = true;
  @Input() facility: boolean = true;
  @Input() rating: boolean = true;
  @Input() price: boolean = true;
  @Input() language: boolean = true;
  @Input() hotels: boolean = false;
  @Input() cabHorizontal: boolean = false;
  @Input() shadowClass: boolean = false;
  @Input() horizontalFilter: boolean = false;
  @Input() tags: boolean = true;
  @Input() restaurant: boolean = false;
  @Input() cuisines: boolean = true;
  @Input() time: boolean = true
}
