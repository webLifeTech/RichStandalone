import { Component } from '@angular/core';
import { cabClassic } from '../../../shared/interface/cab-classic';
import { CabService } from '../../../shared/services/cab.service';
import { CabClassicTestimonialComponent } from './cab-classic-testimonial/cab-classic-testimonial.component';
import { CabClassicBannerComponent } from './cab-classic-banner/cab-classic-banner.component';
import { CabClassicCarTypeComponent } from './cab-classic-car-type/cab-classic-car-type.component';
import { CabClassicBookingComponent } from './cab-classic-booking/cab-classic-booking.component';
import { CabClassicRicaBenefitsComponent } from './cab-classic-rica-benefits/cab-classic-rica-benefits.component';
import { CabClassicHomeSectionComponent } from './cab-classic-home-section/cab-classic-home-section.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cab-home',
  standalone: true,
  imports: [
    CabClassicHomeSectionComponent,
    CabClassicRicaBenefitsComponent,
    CabClassicBookingComponent,
    CabClassicCarTypeComponent,
    CabClassicBannerComponent,
    CabClassicTestimonialComponent,
    CommonModule
  ],
  templateUrl: './cab-home.component.html',
  styleUrls: ['./cab-home.component.scss']
})
export class CabHomeComponent {

  public cabClassic: cabClassic | any;

  constructor(private cabService: CabService) {
    this.cabService.cabClassic().subscribe(response => {
      this.cabClassic = response;
    })
  }

  ngOnInit() {
    document.documentElement.style.setProperty('--theme-color1', '233, 179, 14');
    document.documentElement.style.setProperty('--theme-color2', '239, 63, 62');
  }

  ngOnDestroy() {
    document.documentElement.style.removeProperty('--theme-color1');
    document.documentElement.style.removeProperty('--theme-color2');
  }
}
