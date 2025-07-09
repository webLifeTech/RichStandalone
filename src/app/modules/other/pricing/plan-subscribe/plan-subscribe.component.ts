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
import { WalletService } from '../../../../shared/services/wallet.service';

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
  paymentOptions: any = [];
  firstPayOpt: any = {};
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
  type: any = "CreditCard";

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
    public walletService: WalletService,
  ) {
    // this.payckageStatus = route.snapshot.params['payckageStatus'];
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.getPricingDetails();
      console.log("this.params >>>>", this.params);
    })
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    for (let step = 0; step < 12; step++) {
      this.duration.push({ value: step + 1 })
    }
    this.getConfigUIForms();
    this.getPackageType();
    this.calculateDropTime();
  }

  getConfigUIForms() {
    let body = {
      "menuId": 26,
      "countryId": 230,
      "transactionId": 1,
      "stateCode": "42",
      "languageId": 1,
      "roleName": this.gs.loggedInUserInfo.roleName || null, // findRoleObj.roleName
    }
    this.profileService.getConfigUIForms(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.length) {
        this.paymentOptions = response;
        this.paymentOptions[0].checked = true;
        this.firstPayOpt = this.paymentOptions[0];
        const types: any = {
          "21": "CreditCard",
          "22": "ACH",
          "23": "Wallet",
          "24": "Crypto"
        }
        for (let i in this.paymentOptions) {
          this.paymentOptions[i].type = types[this.paymentOptions[i].formId] || null;
        }
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
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

  async payNow() {
    let body: any = {
      "userId": this.gs.loggedInUserInfo.userId,
      "amount": this.packageSummaryObj.totalAmount,
      "remarks": "Package " + this.params.packageStatus,
      "paymentMethod": this.type, // CreditCard,ACH
      "currency": "USD",
      "subscrptionPackageDetails": {
        "packageId": this.packageSummaryObj.packageId,
        "startDate": this.packageSummaryObj.startDate,
        "endDate": this.packageSummaryObj.endDate,
        "noOfMonths": this.packageSummaryObj.noOfMonths,
        "payckageStatus": this.params.packageStatus
      }
    }

    if (this.type === 'CreditCard') {
      if (!this.gs.paymentDetails.creditCard.valid) {
        this.toast.errorToastr("Invalid Credit Card Details");
        return;
      }
      const cardNumber = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.creditCard?.value?.cardNumber?.replaceAll(/\s/g, '') })
      const encryptCvv = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.creditCard?.value.cvc })
      body["creditCardInfo"] = {
        "cardNumber": cardNumber,
        "expirationDate": this.gs.paymentDetails.creditCard?.value?.expirationDate?.replaceAll(/\s/g, ''),
        "cvv": encryptCvv,
        "cardHolderName": this.gs.paymentDetails.creditCard?.value.holderName
      }
      // body["creditCardInfo"] = {
      //   "cardNumber": this.gs.paymentDetails.creditCard?.value?.cardNumber?.replaceAll(/\s/g, ''),
      //   "expirationDate": this.gs.paymentDetails.creditCard?.value?.expirationDate?.replaceAll(/\s/g, ''),
      //   "cvv": this.gs.paymentDetails.creditCard?.value.cvc,
      //   "cardHolderName": this.gs.paymentDetails.creditCard?.value.holderName
      // }
    }
    if (this.type === 'ACH') {
      if (!this.gs.paymentDetails.ach.valid) {
        this.toast.errorToastr("Invalid ACH Details");
        return;
      }
      const rountingNo = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.ach.value?.rountingNo })
      const accountNo = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.ach.value?.accountNo })
      body["bankAccount"] = {
        "bank": this.gs.paymentDetails.ach.value?.bank,
        "rountingNo": rountingNo,
        "accountNo": accountNo,
        "accountType": this.gs.paymentDetails.ach.value?.accountType,
        "accountName": this.gs.paymentDetails.ach.value?.accountName,
        "accountEntityType": this.gs.paymentDetails.ach.value?.accountEntityType
      }
      // body["bankAccount"] = {
      //   "bank": this.gs.paymentDetails.ach.value?.bank,
      //   "rountingNo": this.gs.paymentDetails.ach.value?.rountingNo,
      //   "accountNo": this.gs.paymentDetails.ach.value?.accountNo,
      //   "accountType": this.gs.paymentDetails.ach.value?.accountType,
      //   "accountName": this.gs.paymentDetails.ach.value?.accountName,
      //   "accountEntityType": this.gs.paymentDetails.ach.value?.accountEntityType
      // }
    }
    console.log("body >>>", body);

    // return;
    this.gs.isSpinnerShow = true;
    this.pricingS.payForSubscribePackage(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.statusCode == "200") {
        this.toast.successToastr(response.message);
        this.onHandleSubmit.emit(null);
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

  bookCancel() {
    this.router.navigate(['/pricing'], {
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }

  backToPackage() {
    this.router.navigate(['/user/configuration'], { // , this.payckageStatus
      queryParams: { packageId: null, packageStatus: this.params.packageStatus },
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

  selectPaymentMode(details: any, type: any) {
    this.type = type;
    for (let i in this.paymentOptions) {
      this.paymentOptions[i].checked = false;
    }
    details.checked = true;
  }
}
