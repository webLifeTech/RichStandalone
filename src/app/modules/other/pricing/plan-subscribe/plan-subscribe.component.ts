import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { CabPromoCodeComponent } from '../../../cab/booking/widgets/cab-promo-code/cab-promo-code.component';
import { BookingCreditCardComponent } from '../../../../shared/components/comman/booking/booking-credit-card/booking-credit-card.component';
import { BookingMyWalletComponent } from '../../../../shared/components/comman/booking/booking-my-wallet/booking-my-wallet.component';
import { BookingNetBankingComponent } from '../../../../shared/components/comman/booking/booking-net-banking/booking-net-banking.component';
import { cabDetails } from '../../../../shared/interface/cab';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../shared/services/global.service';
import { PricingService } from '../../../../shared/services/pricing.service';
import { FormsModule } from '@angular/forms';
import { TermsAndCModalComponent } from '../../../../shared/components/comman/modal/t-and-c-modal/t-and-c-modal.component';
import { ProfileService } from '../../../../shared/services/profile.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { addMonths, addYears } from 'date-fns';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-plan-subscribe',
  standalone: true,
  imports: [
    BookingCreditCardComponent,
    BookingMyWalletComponent,
    BookingNetBankingComponent,
    CommonModule,
    TranslateModule,
    NgbModule,
    CurrencySymbolPipe,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgSelectModule,
  ],
  providers: [DatePipe],
  templateUrl: './plan-subscribe.component.html',
  styleUrl: './plan-subscribe.component.scss'
})
export class PlanSubscribeComponent {
  @Input() from: string;
  @Output() onHandleBack = new EventEmitter<any>();
  @Output() onHandleSubmit = new EventEmitter<any>();

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'cab payment';
  public parent = 'Home';
  public child = 'cab payment';
  public packageId = '';
  public packageFor = '';
  public searchFrom = 'checkout';
  public params: any = {};
  public cabDetail: cabDetails;
  isAgreeTerms: boolean = false;
  today: any = new Date();
  summaryObj: any = {
    timeType: "Monthly",
    timeDuration: 1,
    start_time: new Date()
  };
  packageTypeList: any = [];
  labels: any = {
    "Monthly": "Numbers of Months",
    "Yearly": "Numbers of Years",
  };
  duration: any = [];
  packageSummaryObj: any = {};
  packageObj: any = {
    package: {},
    packageDetails: []
  };
  payckageStatus: any = null

  constructor(
    public cabService: CabService,
    private router: Router,
    private route: ActivatedRoute,
    private pricingS: PricingService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private datePipe: DatePipe,
    private toast: ToastService,
  ) {
    this.payckageStatus = route.snapshot.params['payckageStatus'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.getPricingDetails();
      console.log("this.params >>>>", this.params);
    })
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.cabService.getCabById().subscribe(response => {
      this.cabDetail = response;
    })
    for (let step = 0; step < 12; step++) {
      this.duration.push({ value: step + 1 })
    }
    this.getPackageType();
    this.calculateDropTime();
  }

  getPricingDetails() {
    this.gs.isSpinnerShow = true;
    this.pricingS.getPackageSubscriptionDetails({
      userId: this.gs.loggedInUserInfo.userId || null,
      packageId: this.params.packageId
    }).subscribe((apiRes: any) => {
      this.gs.isSpinnerShow = false;
      console.log("getPackageSubscriptionDetails <<<", apiRes);
      this.packageObj = apiRes;
    });
  }

  getPackageSummaryDetails() {
    this.gs.isSpinnerShow = true;
    console.log("this.summaryObj.timeType >>", this.summaryObj.timeType);
    console.log("this.summaryObj.timeDuration >>", this.summaryObj.timeDuration);

    const body = {
      "userId": this.gs.loggedInUserInfo.userId || null,
      "packageId": this.params.packageId,
      "startDate": this.transformDate(this.summaryObj.start_time, 'MM/dd/yy'),
      "endDate": this.transformDate(this.summaryObj.end_time, 'MM/dd/yy'),
      "noOfMonths": this.summaryObj.timeType == "Monthly" ? parseInt(this.summaryObj.timeDuration) : parseInt(this.summaryObj.timeDuration) * 12,
      "couponCode": this.summaryObj.couponCode
    }
    console.log("body >>>", body);

    this.pricingS.getPackageSummaryDetails(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        this.packageSummaryObj = response.packageSummary;
        console.log("packageSummaryObj <<<", response);
      }
    });
  }

  // Get Dropdwon List
  getPackageType() {
    let todayDate = new Date();
    const effectiveDate = this.transformDate(todayDate, 'MM/dd/yy');

    let body = {
      "stateCode": "0",
      "typeCode": 29,
      "effectiveDate": effectiveDate,
    }
    this.profileService.getMasterVehicleCodes(body).subscribe((res: any) => {
      if (res && res.length) {
        this.packageTypeList = this.gs.groupByMasterDropdown(res, 'TypeCode');
        console.log("packageTypeList >>>>", this.packageTypeList);
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  viewTermsConditions() {
    const modalRef = this.modalService.open(TermsAndCModalComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.termCode = "D_KYC_TC";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.isAgreeTerms = true;
      }
    }, () => {
    });
  }

  payNow() {
    // this.onHandleSubmit.emit(null)
    const body = {
      "packageId": this.params.packageId,
      "userId": this.gs.loggedInUserInfo.userId || null,
      "paymentId": "pay-123",
      "startDate": this.transformDate(this.summaryObj.start_time, 'yyyy-MM/dd'), //  "2025-03-21"
      "endDate": this.transformDate(this.summaryObj.end_time, 'yyyy-MM/dd'), //  "2025-09-21"
      "noOfMonths": this.summaryObj.timeType == "Monthly" ? parseInt(this.summaryObj.timeDuration) : parseInt(this.summaryObj.timeDuration) * 12,
      "remarks": "Package " + this.payckageStatus,
      "payckageStatus": this.payckageStatus
    }

    console.log("body >>>", body);

    this.gs.isSpinnerShow = true;
    this.pricingS.payPackagePaymentDummyTest(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.statusCode == "200") {
        this.toast.successToastr(response.message);
        this.onHandleSubmit.emit(null)
      }
    });
    // this.router.navigate(['/pricing/payment-success']);
  }

  bookCancel() {
    this.router.navigate(['/pricing'], {
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }

  backToPackage() {
    this.router.navigate(['/user/master-configuration', this.payckageStatus], {
      queryParams: { packageId: null },
      queryParamsHandling: "merge"
    });
    this.onHandleBack.emit(1)
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  calculateDropTime() {
    const { start_time, timeType, timeDuration } = this.summaryObj;
    if (!start_time || !timeType || !timeDuration) return;

    console.log("timeType >>>>>>", timeType);

    let dropTime = new Date(start_time);
    switch (timeType) {
      case "Monthly":
        this.summaryObj.end_time = addMonths(dropTime, Number(timeDuration));
        break;
      case "Yearly":
        this.summaryObj.end_time = addYears(dropTime, timeDuration);
        break;
    }


    this.getPackageSummaryDetails();
  }

  onChange() {
    this.calculateDropTime();
  }
}
