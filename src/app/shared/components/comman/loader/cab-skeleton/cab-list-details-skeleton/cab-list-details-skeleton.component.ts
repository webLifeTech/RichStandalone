import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cab-list-details-skeleton',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './cab-list-details-skeleton.component.html',
  styleUrl: './cab-list-details-skeleton.component.scss'
})
export class CabListDetailsSkeletonComponent {

  @Input() map: boolean;

}
