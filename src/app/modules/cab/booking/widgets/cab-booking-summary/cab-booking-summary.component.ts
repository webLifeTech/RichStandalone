import { Component, Input } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../../../shared/pipe/currency.pipe';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../../../shared/services/global.service';
import { ProfileService } from '../../../../../shared/services/profile.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-cab-booking-summary',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CurrencySymbolPipe,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    NgSelectModule,
  ],
  providers: [DatePipe],
  templateUrl: './cab-booking-summary.component.html',
  styleUrl: './cab-booking-summary.component.scss'
})
export class CabBookingSummaryComponent {

  @Input() singleItem: any = {}
  public params: Params;
  public type: any = "";
  public searchObj: any = {};
  rentTypeList: any = [];
  duration: any = [];
  labels: any = {
    "Daily": "Numbers of Days",
    "Weekly": "Numbers of Weeks",
    "Monthly": "Numbers of Months",
    "Yearly": "Numbers of Years",
  };
  bookingSummaryDetails: any = {};
  todayDate = new Date();

  constructor(
    public cabService: CabService,
    private route: ActivatedRoute,
    public gs: GlobalService,
    private profileService: ProfileService,
    private datePipe: DatePipe
  ) {
    this.searchObj = this.gs.getLastSearch();
    this.searchObj.vehicleId = route.snapshot.params['vehicleId'];
    this.searchObj.summaryId = route.snapshot.params['summaryId'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.type = this.params['type'];
      this.searchObj.timeType = "Monthly";
      console.log("this.type >>>>>>", this.type);

      this.searchObj.timeDuration = 1;
      if (this.type === 'car') {
        this.getVehicleBookingSummaryDetails();
      }
      if (this.type === 'driver') {
        this.getDriverBookingSummary();
      }
    })
    this.getRentType();
    for (let step = 0; step < 12; step++) {
      this.duration.push({ value: step + 1 })
    }
  }

  // Get All Dropdwon List
  getRentType() {
    let todayDate = new Date();
    const effectiveDate = this.transformDate(todayDate, 'MM/dd/yy');

    let body = {
      "stateCode": "0",
      "typeCode": 28,
      "effectiveDate": effectiveDate,
    }
    this.profileService.getMasterVehicleCodes(body).subscribe((res: any) => {
      if (res && res.length) {
        this.rentTypeList = this.gs.groupByMasterDropdown(res, 'TypeCode');
      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  onChange() {
    this.calculateDropTime();
  }

  // Get Booking VehicleDetails
  getVehicleBookingSummaryDetails() {

    console.log("111 >>>>>>", this.searchObj);

    let body = {
      "rentType": this.searchObj.timeType,
      "duration": parseInt(this.searchObj.timeDuration),
      "pickUpTime": this.transformDate(this.searchObj.pick_time, 'MM/dd/yy'),
      "dropTime": this.transformDate(this.searchObj.drop_time, 'MM/dd/yy'),
      "vehicleId": this.searchObj.vehicleId,
      "summaryId": this.searchObj.summaryId,
      "couponCode": this.searchObj.couponCode,
      "userId": this.gs.loggedInUserInfo.userId
    }

    this.cabService.getVehicleBookingSummaryDetails(body).subscribe((res: any) => {
      console.log("getBookingVehicleDetails >>>>", res);
      if (res && res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
        this.bookingSummaryDetails = res.vehicleBookingSummaryDetails.bookingSummaryDetails;
        this.gs.bookingSummaryDetails = this.bookingSummaryDetails;
        console.log("this.gs.bookingSummaryDetails >>>>>>", this.gs.bookingSummaryDetails);

      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  // Get Booking getDriverBookingSummary
  getDriverBookingSummary() {
    let body = {
      "rentType": this.searchObj.timeType,
      "duration": parseInt(this.searchObj.timeDuration),
      "pickUpTime": this.transformDate(this.searchObj.pick_time, 'MM/dd/yy'),
      "dropTime": this.transformDate(this.searchObj.drop_time, 'MM/dd/yy'),
      "driverId": this.searchObj.vehicleId,
      "summaryId": this.searchObj.summaryId,
      "couponCode": this.searchObj.couponCode,
      "userId": this.gs.loggedInUserInfo.userId
    }

    this.cabService.getDriverBookingSummary(body).subscribe((res: any) => {
      console.log("getDriverBookingSummary >>>>", res);
      if (res && res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
        this.bookingSummaryDetails = res.driverBookingSummaryDetails.bookingSummaryDetails;
        this.gs.bookingSummaryDetails = this.bookingSummaryDetails;
        console.log("this.gs.bookingSummaryDetails >>>>>>", this.gs.bookingSummaryDetails);

      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  calculateDropTime() {
    const { pick_time, timeType, timeDuration } = this.searchObj;
    if (!pick_time || !timeType || !timeDuration) return;

    let dropTime = new Date(pick_time);
    switch (timeType) {
      case "Daily":
        this.searchObj.drop_time = addDays(dropTime, Number(timeDuration));
        break;
      case "Weekly":
        this.searchObj.drop_time = addWeeks(dropTime, Number(timeDuration));
        break;
      case "Monthly":
        this.searchObj.drop_time = addMonths(dropTime, Number(timeDuration));
        break;
      case "Yearly":
        this.searchObj.drop_time = addYears(dropTime, timeDuration);
        break;
    }

    this.gs.lastSearch = this.searchObj;

    if (this.type === 'car') {
      this.getVehicleBookingSummaryDetails();
    }
    if (this.type === 'driver') {
      this.getDriverBookingSummary();
    }
    // this.getVehicleBookingSummaryDetails();
  }
}
