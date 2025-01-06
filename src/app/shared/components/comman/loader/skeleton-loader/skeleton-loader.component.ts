import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MenuSkeletonComponent } from './menu-skeleton/menu-skeleton.component';
import { CabSkeletonComponent } from '../cab-skeleton/cab-skeleton.component';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [
    CommonModule,
    MenuSkeletonComponent,
    CabSkeletonComponent
  ],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {

  @Input() skeletonType: string;
  @Input() gridType: string;
  @Input() filter: boolean;
  @Input() filterType: string;
  @Input() mapFilter: boolean;
  @Input() mapSide: string;
  @Input() list: boolean;
  @Input() grid: boolean;
  @Input() withOutTopPage: boolean;
  @Input() breadcrumbSection: boolean;
  @Input() hotel: boolean = false;
  @Input() tour: boolean = false;
  @Input() tourClassicGallery: boolean;
  @Input() flight: boolean;
  @Input() map: boolean;
  @Input() horizontalFilter: boolean;
  @Input() restaurantBreadcrumb: boolean;

  public loaderHide: boolean = false;

  constructor() {
    setTimeout(() => {
      this.loaderHide = true;
    }, 1000);
  }
}
