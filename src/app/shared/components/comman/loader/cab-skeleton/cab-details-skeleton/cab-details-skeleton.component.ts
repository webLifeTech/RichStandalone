import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cab-details-skeleton',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './cab-details-skeleton.component.html',
  styleUrl: './cab-details-skeleton.component.scss'
})
export class CabDetailsSkeletonComponent {

  @Input() gridType: string;
}
