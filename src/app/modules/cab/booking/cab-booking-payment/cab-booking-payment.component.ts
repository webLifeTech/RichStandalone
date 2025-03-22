import { Component } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CabSearchComponent } from '../../listing/widgets/cab-search/cab-search.component';
import { CabCardViewComponent } from '../../../../shared/components/comman/booking/cab-card-view/cab-card-view.component';
import { BookingComponent } from '../../../../shared/components/comman/booking/booking.component';
import { CabBookingSummaryComponent } from '../widgets/cab-booking-summary/cab-booking-summary.component';
import { CabPromoCodeComponent } from '../widgets/cab-promo-code/cab-promo-code.component';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { GlobalService } from '../../../../shared/services/global.service';
import { PickDropInstructionsComponent } from '../widgets/pick-drop-instructions/pick-drop-instructions.component';

@Component({
  selector: 'app-cab-booking-payment',
  standalone: true,
  imports: [
    CabSearchComponent,
    CabCardViewComponent,
    BookingComponent,
    CabBookingSummaryComponent,
    CabPromoCodeComponent,
    PickDropInstructionsComponent,

    CommonModule,
    TranslateModule,
    CurrencySymbolPipe
  ],
  templateUrl: './cab-booking-payment.component.html',
  styleUrl: './cab-booking-payment.component.scss'
})
export class CabBookingPaymentComponent {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'cab payment';
  public parent = 'Home';
  public child = 'cab payment';
  public vehicleId = '';
  public summaryId = '';
  public searchFrom = 'checkout';
  public params: Params;
  public searchObj: any = {};
  public bookingDetails: any = {};

  constructor(
    public cabService: CabService,
    private router: Router,
    private route: ActivatedRoute,
    public gs: GlobalService,
  ) {
    this.vehicleId = route.snapshot.params['vehicleId'];
    this.summaryId = route.snapshot.params['summaryId'];

    this.searchObj = this.gs.getLastSearch();
    this.searchObj.vehicleId = route.snapshot.params['vehicleId'];
    this.searchObj.summaryId = route.snapshot.params['summaryId'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.getBookingVehicleDetails();
    })
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    document.documentElement.style.setProperty('--theme-color1', '233, 179, 14');
    document.documentElement.style.setProperty('--theme-color2', '233, 179, 14');
  }

  ngOnDestroy() {
    document.documentElement.style.removeProperty('--theme-color1');
    document.documentElement.style.removeProperty('--theme-color2');
  }

  // Get Booking VehicleDetails
  getBookingVehicleDetails() {
    let body = {
      "rentType": this.searchObj.timeType || "Daily",
      "pickUpTime": this.searchObj.pick_time,
      "dropTime": this.searchObj.drop_time,
      "vehicleId": this.searchObj.vehicleId,
      "summaryId": this.searchObj.summaryId,
      "userId": this.gs.loggedInUserInfo.userId
    }

    this.cabService.getBookingVehicleDetails(body).subscribe((res: any) => {
      if (res && res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
        this.bookingDetails = res.vehicleBookingInfoDetails;
      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  backToDeal() {
    this.router.navigate(['/cab/booking/booking', this.vehicleId, this.summaryId], {
      // relativeTo: this.route,
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }
}
