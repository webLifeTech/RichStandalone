import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CabBreadcrumbComponent } from './cab-breadcrumb/cab-breadcrumb.component';
import { PagesBreadcrumbComponent } from './pages-breadcrumb/pages-breadcrumb.component';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [
    CommonModule,
    CabBreadcrumbComponent,
    PagesBreadcrumbComponent
  ],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {

  @Input() type: string;
  @Input() bg_image: string;
  @Input() title: string;
  @Input() parent: string;
  @Input() subParent: string;
  @Input() child: string;
  @Input() days: number;
  @Input() date: string;
  @Input() slider: boolean = false;
  @Input() birdAnimation: boolean = false;
  @Input() tourVideo: boolean = false;
  @Input() tourBreadcrumb: boolean = false;
  @Input() FlightDetails: boolean;
  @Input() sectionClass: string;
  @Input() paddingClass: boolean = false;

}
