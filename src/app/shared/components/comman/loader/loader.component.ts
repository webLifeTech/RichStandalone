import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader.component';
import { LoaderOneComponent } from './loader-one/loader-one.component';
import { LoaderTwoComponent } from './loader-two/loader-two.component';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    CommonModule,
    SkeletonLoaderComponent,
    LoaderOneComponent,
    LoaderTwoComponent
  ],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {

  @Input() loaderType: string;
  @Input() gridType: string;
  @Input() filter: boolean;
  @Input() skeletonType: string;
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
  @Input() creativeList: boolean;
  @Input() mix: boolean;
}
