import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CabSearchSkeletonComponent } from './cab-search-skeleton/cab-search-skeleton.component';
import { CabFilterSkeletonComponent } from './cab-filter-skeleton/cab-filter-skeleton.component';
import { CabListDetailsSkeletonComponent } from './cab-list-details-skeleton/cab-list-details-skeleton.component';
import { CabDetailsSkeletonComponent } from './cab-details-skeleton/cab-details-skeleton.component';
import { CabGridSkeletonComponent } from './cab-grid-skeleton/cab-grid-skeleton.component';

@Component({
  selector: 'app-cab-skeleton',
  standalone: true,
  imports: [
    CommonModule,
    CabSearchSkeletonComponent,
    CabFilterSkeletonComponent,
    CabListDetailsSkeletonComponent,
    CabDetailsSkeletonComponent,
    CabGridSkeletonComponent,
  ],
  templateUrl: './cab-skeleton.component.html',
  styleUrl: './cab-skeleton.component.scss'
})
export class CabSkeletonComponent {

  @Input() filterType: string;
  @Input() skeletonType: string;
  @Input() gridType: string;
  @Input() grid: boolean = true;
  @Input() filter: boolean;
  @Input() mapSide: string;
  @Input() map: boolean = false;
}
