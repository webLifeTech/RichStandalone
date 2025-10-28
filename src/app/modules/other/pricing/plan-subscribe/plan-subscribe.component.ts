import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { BookingCreditCardComponent } from '../../../../shared/components/comman/booking/booking-credit-card/booking-credit-card.component';
import { BookingMyWalletComponent } from '../../../../shared/components/comman/booking/booking-my-wallet/booking-my-wallet.component';
import { BookingNetBankingComponent } from '../../../../shared/components/comman/booking/booking-net-banking/booking-net-banking.component';
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
import { BookingCryptoComponent } from '../../../../shared/components/comman/booking/booking-crypto/booking-crypto.component';
import { PaymentService } from '../../../../shared/services/payment.service';
import { WebViewUrlModalComponent } from '../../../../shared/components/comman/modal/webview-url-modal/webview-url-modal.component';
import { CabPromoCodeComponent } from '../../../cab/booking/widgets/cab-promo-code/cab-promo-code.component';

@Component({
  selector: 'app-plan-subscribe',
  standalone: true,
  imports: [
    BookingCreditCardComponent,
    BookingMyWalletComponent,
    BookingNetBankingComponent,
    BookingCryptoComponent,
    CabPromoCodeComponent,
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
  coinList: any = [];
  selectedCoin = ""; // LTCT
  customOrderId: any = null;
  appliedCouponCode: any = "";
  isCouponApplied: boolean = false;

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
    private paymentService: PaymentService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.getPricingDetails();
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
    this.getCrypto();
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
    }).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        this.packageObj = response;
        this.gs.couponList = this.packageObj.couponDetails;
      }
    });
  }

  getPackageSummaryDetails() {
    this.gs.isSpinnerShow = true;
    const body = {
      "userId": this.gs.loggedInUserInfo.userId || null,
      "packageId": this.params.packageId,
      "startDate": this.transformDate(this.summaryObj.start_time, 'MM/dd/yy'),
      "endDate": this.transformDate(this.summaryObj.end_time, 'MM/dd/yy'),
      "noOfMonths": this.summaryObj.timeType == "Monthly" ? parseInt(this.summaryObj.timeDuration) : parseInt(this.summaryObj.timeDuration) * 12,
      "couponCode": this.appliedCouponCode || "",
    }

    this.pricingS.getPackageSummaryDetails(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;

      if (response.response && response.response.statusCode == "200") {
        this.packageSummaryObj = response.packageSummary;
      } else {
        this.toast.errorToastr(response.message);
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
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  getCrypto() {
    this.paymentService.getSupportedCoins().subscribe((response: any) => {
      if (response.status == 200) {
        for (const property in response.data) {
          response.data[property]['coin'] = property;
          this.coinList.push(response.data[property])
        }
      }
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

  async goPayment() {
    if (this.type == 'Crypto') {
      this.makeCryptoPayment();
    } else {
      this.payNow();
    }
  }

  async makeCryptoPayment() {
    if (!this.selectedCoin) {
      this.toast.errorToastr("Please select crypto coin");
      return;
    }

    this.customOrderId = await this.paymentService.GetCryptoPaymentOrderId();
    if (!this.customOrderId) {
      this.toast.errorToastr("Something went wrong");
      return;
    }

    let cryptoBody = {
      "price": this.packageSummaryObj.totalAmount,
      "currency": this.selectedCoin, //
      "buyerEmail": "customer_email@gmail.com", // this.gs.loggedInUserInfo.username
      "customOrderId": this.customOrderId || null,
      "notificationURL": "https://uat.maya-avante.com/PostData/IsoSearch/PostMatchResponseData"
    }
    this.gs.isSpinnerShow = true;

    this.paymentService.CryptoPaymentRequestResponse({
      "userId": this.gs.loggedInUserInfo.userId,
      "orderId": this.customOrderId,
      "paymentReqResData": JSON.stringify(cryptoBody),
      "paymentReqResType": "Payment Initiated Request",
      "source": "Web",
      "paymentType": "4",
    }).subscribe(res => { });

    this.paymentService.createTransaction(cryptoBody).subscribe(response => {
      this.gs.isSpinnerShow = false;

      this.paymentService.CryptoPaymentRequestResponse({
        "userId": this.gs.loggedInUserInfo.userId,
        "orderId": this.customOrderId,
        "paymentReqResData": JSON.stringify(response.data),
        "paymentReqResType": "Payment Initiated Response",
        "source": "Web",
        "paymentType": "4",
      }).subscribe(res => { });

      if (response.status == 201) {
        let responseData = response.data;
        if (responseData && responseData.url) {
          this.toast.successToastr("Transaction created successfully");
          const modalRef = this.modalService.open(WebViewUrlModalComponent, {
            centered: true,
            backdrop: 'static',
            windowClass: 'document-modal',
            size: 'lg'
          });
          modalRef.componentInstance.documentIframe = responseData.url;
          modalRef.result.then((signModalRes: any) => {
            if (signModalRes.confirmed) {
              this.payNow();
            }
          }, () => { });
        } else {
          this.toast.errorToastr("Something went wrong");
        }
      } else {
        this.toast.errorToastr("Something went wrong");
      }
    }, err => {
      this.toast.errorToastr("Something went wrong");
      // this.isLoader = false;
    })
  }

  async payNow() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.packageSummaryObj.startDate, this.packageSummaryObj.endDate);

    let body: any = {
      "userId": this.gs.loggedInUserInfo.userId,
      "amount": this.packageSummaryObj.totalAmount,
      "remarks": "Package " + this.params.packageStatus,
      "paymentMethod": this.type, // CreditCard, ACH
      "currency": "USD",
      "customOrderId": this.customOrderId,
      "discountId": this.packageSummaryObj.discountId || 0,
      "discountAmount": this.packageSummaryObj.discount,
      "baseAmount": this.packageSummaryObj.packagePrice,
      "taxFee": this.packageSummaryObj.tax,
      "siteFee": this.packageSummaryObj.siteFee || 0,
      "otherFee": this.packageSummaryObj.otherFee,
      "subscrptionPackageDetails": {
        "packageId": this.packageSummaryObj.packageId,
        "startDate": startDate,
        "endDate": endDate,
        "noOfMonths": this.packageSummaryObj.noOfMonths,
        "payckageStatus": this.params.packageStatus
      }
    };

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
    }

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

  onChange(value: any) {
    this.calculateDropTime();
    if (value == 'coupon') {
      this.isCouponApplied = true;
      this.toast.successToastr("Coupon Applied!");
      for (let i in this.gs.couponList) {
        this.gs.couponList[i].checked = false;
        if (this.gs.couponList[i].couponCode == this.appliedCouponCode?.trim()) {
          this.gs.couponList[i].checked = true;
        }
      }
    }
  }

  selectPaymentMode(details: any, type: any) {
    this.type = type;
    for (let i in this.paymentOptions) {
      this.paymentOptions[i].checked = false;
    }
    details.checked = true;
  }

  onSelectCoin(event: any) {
    this.selectedCoin = event;
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
    this.calculateDropTime();
  }
}
