import { Component } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CabSearchComponent } from '../../listing/widgets/cab-search/cab-search.component';
import { CabCardViewComponent } from '../../../../shared/components/comman/booking/cab-card-view/cab-card-view.component';
import { CabInformationComponent } from '../widgets/cab-information/cab-information.component';
import { CabBookingSummaryComponent } from '../widgets/cab-booking-summary/cab-booking-summary.component';
import { CabPromoCodeComponent } from '../widgets/cab-promo-code/cab-promo-code.component';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { MatDialog } from '@angular/material/dialog';
import { PickupDropInstructionDialogComponent } from '../../../../shared/components/dialoge/pickup-drop-instruction-dialog/pickup-drop-instruction-dialog.component';
import { GlobalService } from '../../../../shared/services/global.service';
import { PickDropInstructionsComponent } from '../widgets/pick-drop-instructions/pick-drop-instructions.component';

@Component({
  selector: 'app-cab-booking',
  standalone: true,
  imports: [
    CabCardViewComponent,
    CabInformationComponent,
    CabBookingSummaryComponent,
    PickDropInstructionsComponent,

    CommonModule,
    TranslateModule,
    CurrencySymbolPipe
  ],
  providers: [DatePipe],
  templateUrl: './cab-booking.component.html',
  styleUrl: './cab-booking.component.scss'
})
export class CabBookingComponent {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'cab booking';
  public parent = 'Home';
  public child = 'cab booking';
  public itemId = '';
  public params: Params;
  public searchObj: any = {};
  public bookingDetails: any = {};

  constructor(
    public cabService: CabService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public gs: GlobalService,
    private datePipe: DatePipe
  ) {
    this.searchObj = this.gs.getLastSearch();
    this.searchObj.vehicleId = route.snapshot.params['vehicleId'];
    this.searchObj.summaryId = route.snapshot.params['summaryId'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      console.log("this.itemId >>>>", this.itemId);
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
      console.log("getBookingVehicleDetails >>>>", res);
      if (res && res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
        this.bookingDetails = res.vehicleBookingInfoDetails;
        console.log("this.bookingDetails >>>>>>", this.bookingDetails);

      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  backtoResult() {
    this.router.navigate(['/cab/listing/list-view'], {
      // relativeTo: this.route,
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }
  continueToBook() {
    this.router.navigate(['/cab/booking/booking-payment', this.searchObj.vehicleId, this.searchObj.summaryId], {
      // relativeTo: this.route,
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }

  onDateChange(value: any) {
    console.log("ddddddddddd>>>", value);
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }
}
