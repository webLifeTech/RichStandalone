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
import { addDays, addWeeks, addMonths, addYears, getDay, differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';
import { NgSelectModule } from '@ng-select/ng-select';
import { CabPromoCodeComponent } from '../cab-promo-code/cab-promo-code.component';
import { ToastService } from '../../../../../shared/services/toast.service';


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
    CabPromoCodeComponent,
  ],
  providers: [DatePipe],
  templateUrl: './cab-booking-summary.component.html',
  styleUrl: './cab-booking-summary.component.scss'
})
export class CabBookingSummaryComponent {

  @Input() singleItem: any = {};
  @Input() bookingStep: any = 1;
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
  appliedCouponCode: any = "";
  isCouponApplied: boolean = false;

  timeTypeList: any = [
    {
      "ID": "224",
      "StateCode": 0,
      "Code": "Now",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Now",
      "Description": "Now",
      "IsActive": true
    },
    {
      "ID": "225",
      "StateCode": 0,
      "Code": "Schedule for later",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Schedule for later",
      "Description": "Schedule for later",
      "IsActive": true
    }
  ];

  carTypeList: any = [
    {
      "ID": "224",
      "StateCode": 0,
      "Code": "Manual", // Manual, Automatic
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Manual",
      "Description": "Manual",
      "IsActive": true
    },
    {
      "ID": "225",
      "StateCode": 0,
      "Code": "Automatic",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Automatic",
      "Description": "Automatic",
      "IsActive": true
    }
  ];

  carCatTypeList: any = [
    {
      "ID": "224",
      "StateCode": 0,
      "Code": "Hatchback",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Hatchback",
      "Description": "Hatchback",
      "IsActive": true
    },
    {
      "ID": "225",
      "StateCode": 0,
      "Code": "Sedan",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Sedan",
      "Description": "Sedan",
      "IsActive": true
    },
    {
      "ID": "226",
      "StateCode": 0,
      "Code": "SUV",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "SUV",
      "Description": "SUV",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "Luxury",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Luxury",
      "Description": "Luxury",
      "IsActive": true
    }
  ];

  packageList: any = [
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "2 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "2 Hours",
      "Description": "2 Hours",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "4 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "4 Hours",
      "Description": "4 Hours",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "6 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "6 Hours",
      "Description": "6 Hours",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "8 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "8 Hours",
      "Description": "8 Hours",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "12 Hours",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "12 Hours",
      "Description": "12 Hours",
      "IsActive": true
    }
  ]

  tripTypeList: any = [
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "Round Trip",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "Round Trip",
      "Description": "Round Trip",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "One Way Trip",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "One Way Trip",
      "Description": "One Way Trip",
      "IsActive": true
    },
  ]

  usageList: any = [
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "12 Hrs",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "12 Hrs",
      "Description": "12 Hrs",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "16 Hrs",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "16 Hrs",
      "Description": "16 Hrs",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "20 Hrs",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "20 Hrs",
      "Description": "20 Hrs",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "1 Day",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "1 Day",
      "Description": "1 Day",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "2 Days",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "2 Days",
      "Description": "2 Days",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "3 Days",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "3 Days",
      "Description": "3 Days",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "4 Days",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "4 Days",
      "Description": "4 Days",
      "IsActive": true
    },
    {
      "ID": "227",
      "StateCode": 0,
      "Code": "5 Days",
      "Type": 28,
      "TypeCode": "RENT_TYPE",
      "Name": "5 Days",
      "Description": "5 Days",
      "IsActive": true
    },
  ]

  constructor(
    public cabService: CabService,
    private route: ActivatedRoute,
    public gs: GlobalService,
    private profileService: ProfileService,
    private datePipe: DatePipe,
    private toast: ToastService,
  ) {
    this.searchObj = this.gs.getLastSearch();
    this.searchObj.vehicleId = route.snapshot.params['vehicleId'];
    this.searchObj.summaryId = route.snapshot.params['summaryId'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      console.log("this.searchObj >>>>>>", this.searchObj);
      this.type = this.params['type'];
      const pickTime = new Date(this.searchObj.pick_time);
      const dropTime = new Date(this.searchObj.drop_time);
      // this.searchObj.timeType = "Daily";
      // const durationInDays = differenceInDays(dropTime, pickTime);
      // console.log("durationInDays >>>>>>", durationInDays);
      // for (let step = 0; step < durationInDays; step++) {
      //   this.duration.push({ value: step + 1 })
      // }
      // this.searchObj.timeDuration = durationInDays;

      switch (this.searchObj.timeType) {
        case "Daily":
          this.searchObj.timeDuration = differenceInDays(dropTime, pickTime);
          console.log("this.searchObj.timeDuration >>>>>", this.searchObj.timeDuration);

          break;
        case "Weekly":
          this.searchObj.timeDuration = differenceInWeeks(dropTime, pickTime);
          break;
        case "Monthly":
          this.searchObj.timeDuration = differenceInMonths(dropTime, pickTime);
          break;
        case "Yearly":
          this.searchObj.timeDuration = differenceInYears(dropTime, pickTime);
          break;
      }

      let range = 0;
      if (this.searchObj.timeType == 'Daily') {
        range = 31;
      }
      if (this.searchObj.timeType == 'Weekly') {
        range = 4;
      }
      if (this.searchObj.timeType == 'Monthly') {
        range = 12;
      }
      if (this.searchObj.timeType == 'Yearly') {
        range = 20;
      }

      for (let step = 0; step < range; step++) {
        this.duration.push({ value: step + 1 })
      }

      this.calculateDropTime(null);
    })
    this.getRentType();
  }

  ngOnInit() {
    console.log("CouponCode 111111111 >>>>", this.appliedCouponCode);

    if (this.type === 'car') {
      this.getVehicleBookingSummaryDetails();
    }
    if (this.type === 'driver') {
      this.getDriverBookingSummary();
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
        const slctType = this.rentTypeList['RENT_TYPE'].find((item: any) => item.Code === this.searchObj.timeType);
        if (slctType) {
          this.searchObj.timeTypeId = slctType.ID
          this.gs.lastSearch = this.searchObj;
        }

        // this.rentTypeList.this.searchObj.timeType
      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  onChange(value: any) {
    this.calculateDropTime(value);
    if (value == 'coupon') {
      this.isCouponApplied = true;
      this.toast.successToastr("Coupon Applied!");
    }
  }

  // Get Booking VehicleDetails
  getVehicleBookingSummaryDetails() {

    let body = {
      "rentType": this.searchObj.timeType,
      "duration": parseInt(this.searchObj.timeDuration),
      "pickUpTime": this.transformDate(this.searchObj.pick_time, 'MM/dd/yy'),
      "dropTime": this.transformDate(this.searchObj.drop_time, 'MM/dd/yy'),
      "vehicleId": this.searchObj.vehicleId,
      "summaryId": this.searchObj.summaryId,
      "couponCode": this.appliedCouponCode || "",
      "userId": this.gs.loggedInUserInfo.userId
    }

    this.cabService.getVehicleBookingSummaryDetails(body).subscribe((res: any) => {
      console.log("getBookingVehicleDetails >>>>", res);
      if (res && res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
        this.bookingSummaryDetails = res.vehicleBookingSummaryDetails.bookingSummaryDetails;
        this.gs.bookingSummaryDetails = this.bookingSummaryDetails;
        this.gs.vehicleCancellationPolicy = res.vehicleCancellationRules;
        this.gs.bookingSummaryDetails.bookingStep = this.bookingStep;
        console.log("this.gs.bookingSummaryDetails >>>>>>", this.gs.bookingSummaryDetails);

      } else {
        this.gs.isSpinnerShow = false;
        this.gs.bookingSummaryDetails.isRestrict = true;
        this.gs.bookingSummaryDetails.restrictMessage = res.responseResultDtos.message;
        this.toast.errorToastr(res.responseResultDtos.message);
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
      "couponCode": this.appliedCouponCode || "",
      "userId": this.gs.loggedInUserInfo.userId
    }

    this.cabService.getDriverBookingSummary(body).subscribe((res: any) => {
      console.log("getDriverBookingSummary >>>>", res);
      if (res && res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
        this.bookingSummaryDetails = res.driverBookingSummaryDetails.bookingSummaryDetails;
        this.gs.bookingSummaryDetails = this.bookingSummaryDetails;
        this.gs.bookingSummaryDetails.bookingStep = this.bookingStep;
        console.log("this.gs.bookingSummaryDetails >>>>>>", this.gs.bookingSummaryDetails);
      } else {
        this.gs.bookingSummaryDetails.isRestrict = true;
        this.gs.bookingSummaryDetails.restrictMessage = res.responseResultDtos.message;
        console.log("this.gs.bookingSummaryDetails >>>>>>", this.gs.bookingSummaryDetails);
        this.toast.errorToastr(res.responseResultDtos.message);
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  calculateDropTime(value: any) {
    let { pick_time, timeType, timeDuration } = this.searchObj;
    if (!pick_time || !timeType || !timeDuration) return;

    console.log("value >>>>>", value);
    console.log("timeType >>>>>", timeType);

    if (value == 'type') {
      let range = 0;
      if (timeType == 'Daily') {
        range = 31;
      }
      if (timeType == 'Weekly') {
        range = 4;
      }
      if (timeType == 'Monthly') {
        range = 12;
      }
      if (timeType == 'Yearly') {
        range = 20;
      }

      this.searchObj.timeDuration = 1;
      timeDuration = 1;
      this.duration = [];
      for (let step = 0; step < range; step++) {
        this.duration.push({ value: step + 1 })
      }
      const slctType = this.rentTypeList['RENT_TYPE'].find((item: any) => item.Code === this.searchObj.timeType);
      if (slctType) {
        this.searchObj.timeTypeId = slctType.ID
      }

    }

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

  applyCoupon(event: any) {
    this.appliedCouponCode = (event && event.couponCode) ? event.couponCode : "";
    if (this.appliedCouponCode) {
      this.isCouponApplied = true;
    } else {
      this.isCouponApplied = false;
      for (let i in this.gs.couponList) {
        this.gs.couponList[i].checked = false;
      }
    }
    if (this.type === 'car') {
      this.getVehicleBookingSummaryDetails();
    }
    if (this.type === 'driver') {
      this.getDriverBookingSummary();
    }
  }
}
