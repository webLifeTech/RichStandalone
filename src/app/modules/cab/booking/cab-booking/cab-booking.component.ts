import { Component } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CabCardViewComponent } from '../../../../shared/components/comman/booking/cab-card-view/cab-card-view.component';
import { CabInformationComponent } from '../widgets/cab-information/cab-information.component';
import { CabBookingSummaryComponent } from '../widgets/cab-booking-summary/cab-booking-summary.component';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { GlobalService } from '../../../../shared/services/global.service';
import { PickDropInstructionsComponent } from '../widgets/pick-drop-instructions/pick-drop-instructions.component';
import { BookingComponent } from '../../../../shared/components/comman/booking/booking.component';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-cab-booking',
  standalone: true,
  imports: [
    CabCardViewComponent,
    CabInformationComponent,
    CabBookingSummaryComponent,
    PickDropInstructionsComponent,
    BookingComponent,

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
  public params: any;
  public searchObj: any = {};
  public bookingDetails: any = {};
  bookingStep: number = 1;
  couponDetails: any = [];
  appliedCouponCode: any = "";
  loadSummary: boolean = false;

  constructor(
    public cabService: CabService,
    private router: Router,
    private route: ActivatedRoute,
    public gs: GlobalService,
    private datePipe: DatePipe,
    private toast: ToastService,
  ) {
    this.searchObj = this.gs.getLastSearch();
    this.gs.lastSearch = this.searchObj;
    this.searchObj.vehicleId = route.snapshot.params['vehicleId'];
    this.searchObj.summaryId = route.snapshot.params['summaryId'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      console.log("this.params.type >>>>>", this.params.type);

      if (this.params.type == 'car') {
        this.getBookingVehicleDetails();
      }
      if (this.params.type == 'driver') {
        this.getBookingDriverDetails();
      }
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

    this.loadSummary = false;
    this.cabService.getBookingVehicleDetails(body).subscribe((res: any) => {
      this.loadSummary = true;
      if (res.response && res.response.statusCode == "200") {
        this.bookingDetails = res.vehicleBookingInfoDetails;
        this.gs.couponList = this.bookingDetails.couponDetails;
      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  // Get Booking DriverDetails
  getBookingDriverDetails() {
    let body = {
      "rentType": this.searchObj.timeType || "Daily",
      "pickUpTime": this.searchObj.pick_time,
      "dropTime": this.searchObj.drop_time,
      "driverId": this.searchObj.vehicleId,
      "summaryId": this.searchObj.summaryId,
      "userId": this.gs.loggedInUserInfo.userId
    }

    this.cabService.getBookingDriverDetails(body).subscribe((res: any) => {
      if (res.response && res.response.statusCode == "200") {
        this.bookingDetails = res.driverBookingInfoDetails;
        this.bookingDetails.vehicleDetails = this.bookingDetails.driverDetails;
        this.gs.couponList = this.bookingDetails.couponDetails;
      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  backtoResult() {
    if (this.searchObj.isDriverHireSearch) {
      this.router.navigate(['/cab/hire-drivers/list-view'], {
        queryParams: this.params,
        queryParamsHandling: "merge"
      });
      return;
    }
    this.router.navigate(['/cab/listing/list-view'], {
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }
  continueToBook() {
    if (this.gs.bookingSummaryDetails.isRestrict) {
      this.toast.errorToastr(this.gs.bookingSummaryDetails.restrictMessage);
      return;
    }
    this.bookingStep = 2;
    this.gs.bookingSummaryDetails.bookingStep = this.bookingStep;
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  backStep() {
    this.bookingStep = 1;
    this.gs.bookingSummaryDetails.bookingStep = this.bookingStep;
  }
}
