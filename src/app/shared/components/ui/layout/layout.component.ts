import { Component, Input } from '@angular/core';
import { CustomizerComponent } from '../customizer/customizer.component';
import { TapToTopComponent } from '../tap-to-top/tap-to-top.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  standalone: true,
  imports: [
    CustomizerComponent,
    TapToTopComponent,
  ],
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  @Input() loaderType: string;
  @Input() gridType: string;
  @Input() filter: boolean;
  @Input() skeletonType: string;
  @Input() filterType: string;
  @Input() mapFilter: boolean = false;
  @Input() mapSide: string;
  @Input() list: boolean = false;
  @Input() grid: boolean = true;
  @Input() withOutTopPage: boolean = false;
  @Input() breadcrumbSection: boolean = true;
  @Input() hotel: boolean = false;
  @Input() tour: boolean = false;
  @Input() tourClassicGallery: boolean = false;
  @Input() flight: boolean = false;
  @Input() map: boolean;
  @Input() horizontalFilter: boolean = false;
  @Input() restaurantBreadcrumb: boolean = false;
  @Input() creativeList: boolean = false;
  @Input() mix: boolean = false;

}
