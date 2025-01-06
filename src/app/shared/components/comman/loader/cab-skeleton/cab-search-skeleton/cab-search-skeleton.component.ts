import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cab-search-skeleton',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './cab-search-skeleton.component.html',
  styleUrl: './cab-search-skeleton.component.scss'
})
export class CabSearchSkeletonComponent {

  @Input() skeletonType: string;
  @Input() map: boolean;

}
