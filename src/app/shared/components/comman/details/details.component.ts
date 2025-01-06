import { Component, Input } from '@angular/core';
import { CabListDetailsComponent } from './cab-list-details/cab-list-details.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    CabListDetailsComponent,
  ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  @Input() type: string;
  @Input() selectedTabValue: string;
  @Input() gridType: string;
  @Input() responsiveLatestFilter: boolean;
  @Input() mapFilter: boolean;
  @Input() imageSlider: boolean = false;
  @Input() thumbnailImages: boolean = false;
  @Input() description: boolean = false;
  @Input() thumbnailVideo: boolean = false;
  @Input() includeText: boolean = true;
  @Input() calender: boolean = true;
  @Input() flightClass: boolean = false;
  @Input() roundTrip: boolean = false;
  @Input() marginClass: boolean = false;
  @Input() noSidebar: boolean = false;

}
