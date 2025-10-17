import { Component, Input } from '@angular/core';
import { cabDetail, cabDetails } from '../../../../shared/interface/cab';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BookingCreditCardComponent } from './booking-credit-card/booking-credit-card.component';
import { BookingDebitCardComponent } from './booking-debit-card/booking-debit-card.component';
import { BookingMyWalletComponent } from './booking-my-wallet/booking-my-wallet.component';
import { BookingNetBankingComponent } from './booking-net-banking/booking-net-banking.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../../services/payment.service';
import { BookingCryptoComponent } from './booking-crypto/booking-crypto.component';
import { ToastService } from '../../../services/toast.service';
import { GlobalService } from '../../../services/global.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PricingService } from '../../../services/pricing.service';
import { DocumentSignModalComponent } from '../modal/document-sign-modal/document-sign-modal.component';
import { WalletService } from '../../../services/wallet.service';
import { ProfileService } from '../../../services/profile.service';
import { ConfirmationModalComponent } from '../modal/confirmation-modal/confirmation-modal.component';
import { WebViewUrlModalComponent } from '../modal/webview-url-modal/webview-url-modal.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    BookingCreditCardComponent,
    BookingDebitCardComponent,
    BookingMyWalletComponent,
    BookingNetBankingComponent,
    BookingCryptoComponent,

    TranslateModule,
    NgbModule,
    CommonModule
  ],
  providers: [DatePipe],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {

  @Input() flight: boolean = false;
  @Input() title: boolean = false;
  @Input() singleItem: any = {};
  // singleItem.vehicleId
  @Input() params: any;

  paymentOptions: any = [];
  firstPayOpt: any = {};
  coinList: any = [];
  selectedCoin = ""; // LTCT
  type = "CreditCard";
  isLoader: boolean = false;
  riskType = "";

  public cabDetail: cabDetails;

  constructor(
    private cabService: CabService,
    private router: Router,
    private paymentService: PaymentService,
    private toast: ToastService,
    private gs: GlobalService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    public walletService: WalletService,
    private profileService: ProfileService,
  ) {

    this.route.queryParams.subscribe((params) => {
      this.riskType = params['type'] ? params['type'] : "car";
    })
    this.getCrypto();
    this.getConfigUIForms();
    this.cabService.getCabById().subscribe(response => {
      this.cabDetail = response;
    })
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

  getCrypto() {
    this.paymentService.getSupportedCoins().subscribe((response: any) => {
      console.log(response);
      if (response.status == 200) {
        for (const property in response.data) {
          response.data[property]['coin'] = property;
          this.coinList.push(response.data[property])
        }
      }
    })
  }

  change(details: any, type: any) {
    this.type = type;
    for (let i in this.paymentOptions) {
      this.paymentOptions[i].checked = false;
    }
    details.checked = true;
  }

  async bookNow() {

    let body: any = {
      "bookingId": null,
      "userId": this.gs.loggedInUserInfo.userId,
      "BookingPaymentRequest": {
        "userId": this.gs.loggedInUserInfo.userId,
        "amount": this.gs.bookingSummaryDetails.totalFare,
        "bankAccount": null,
        "creditCardInfo": null,
        "transactionType": null,
        "remarks": null,
        "walletId": null,
        "paymentMethod": this.type, // CreditCard,ACH,Wallet
        "currency": "USD", // USD,INR,EUR
        "customOrderId": null,
      },
      "riskId": this.riskType === 'car' ? this.singleItem.vehicleId : this.singleItem.driverId,
      "riskType": this.riskType === 'car' ? 'Vehicle' : 'Driver',
      "bookingRefNumber": null,
      "pickupLocation": this.gs.bookingSummaryDetails.location,
      "dropLocation": this.gs.bookingSummaryDetails.location,
      "pickupDate": this.transformDate(this.gs.bookingSummaryDetails.pickUpTime, 'MM/dd/yyyy HH:mm:ss.SSS'), // this.gs.lastSearch.pick_time
      "dropDate": this.transformDate(this.gs.bookingSummaryDetails.dropTime, 'MM/dd/yyyy HH:mm:ss.SSS'), // this.gs.lastSearch.drop_time
      "duration": parseInt(this.gs.lastSearch.timeDuration),
      "rentType": this.gs.lastSearch.timeTypeId, // this.gs.lastSearch.timeType
      "discountId": this.gs.bookingSummaryDetails.discountId,
      "totalAmount": this.gs.bookingSummaryDetails.totalFare,
      "basePrice": this.gs.bookingSummaryDetails.basePrice,
      "discountAmount": this.gs.bookingSummaryDetails.discount,
      "taxFee": this.gs.bookingSummaryDetails.tax,
      "insuranceFee": this.gs.bookingSummaryDetails.insuranceFee,
      "siteFee": 0,
      "otherFee": this.gs.bookingSummaryDetails.otherFee,
      "bookingStatus": null,
      "bookingStatusRemarks": null,
      "remarks": null
    }

    if (this.type === 'CreditCard') {
      if (!this.gs.paymentDetails.creditCard.valid) {
        this.toast.errorToastr("Invalid Credit Card Details");
        return;
      }
      const cardNumber = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.creditCard?.value?.cardNumber?.replaceAll(/\s/g, '') })
      const encryptCvv = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.creditCard?.value.cvc })
      body["BookingPaymentRequest"]["creditCardInfo"] = {
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
      body["BookingPaymentRequest"]["bankAccount"] = {
        "bank": this.gs.paymentDetails.ach.value?.bank,
        "rountingNo": rountingNo,
        "accountNo": accountNo,
        "accountType": this.gs.paymentDetails.ach.value?.accountType,
        "accountName": this.gs.paymentDetails.ach.value?.accountName,
        "accountEntityType": this.gs.paymentDetails.ach.value?.accountEntityType
      }
    }
    if (this.type === 'Wallet') {
      body["BookingPaymentRequest"]["walletId"] = this.gs.paymentDetails.wallet.walletId;
    }
    if (this.type === 'Crypto') {
      if (!this.selectedCoin) {
        this.toast.errorToastr("Please select crypto coin");
        return;
      }
    }

    console.log("body >>>>>>", body);
    // return;

    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = `Are you sure you want to book this ${this.riskType} ?`;
    modalRef.componentInstance.confirmButton = "Yes";
    modalRef.componentInstance.cancelButton = "No";
    modalRef.result.then(async (res: any) => {
      if (res.confirmed) {
        if (this.type == 'Crypto') {
          this.makeCryptoPayment(body);
        } else {
          this.bookingAgreement(body);
        }
      }
    }, () => { });
  }

  async makeCryptoPayment(bodyObj: any) {

    if (!this.selectedCoin) {
      this.toast.errorToastr("Please select crypto coin");
      return;
    }

    const customOrderId = await this.paymentService.GetCryptoPaymentOrderId();

    if (!customOrderId) {
      this.toast.errorToastr("Something went wrong");
      return;
    }

    this.isLoader = true;
    let body = {
      "price": this.gs.bookingSummaryDetails.totalFare,
      "currency": this.selectedCoin, //
      "buyerEmail": "customer_email@gmail.com", // this.gs.loggedInUserInfo.username
      "customOrderId": customOrderId || null,
      "notificationURL": "https://uat.maya-avante.com/PostData/IsoSearch/PostMatchResponseData"
    }

    this.paymentService.CryptoPaymentRequestResponse({
      "userId": this.gs.loggedInUserInfo.userId,
      "orderId": customOrderId,
      "paymentReqResData": JSON.stringify(body),
      "paymentReqResType": "Payment Initiated Request",
      "source": "Web",
      "paymentType": "1",
    }).subscribe(res => { });

    this.paymentService.createTransaction(body).subscribe(response => {
      this.isLoader = false;
      console.log("response >>>>>", response);

      this.paymentService.CryptoPaymentRequestResponse({
        "userId": this.gs.loggedInUserInfo.userId,
        "orderId": customOrderId,
        "paymentReqResData": JSON.stringify(response.data),
        "paymentReqResType": "Payment Initiated Response",
        "source": "Web",
        "paymentType": "1",
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
              bodyObj.BookingPaymentRequest.customOrderId = customOrderId || null;
              this.bookingAgreement(bodyObj);
            }
          }, () => { });
          // setTimeout(() => {
          //   window.open(responseData.url, "_blank");
          //   this.router.navigate(['/cab/booking/booking-success', this.params.type], {
          //     queryParams: { paymentType: 'crypto' },
          //     queryParamsHandling: "merge"
          //   });
          // }, 1000);
        } else {
          this.toast.errorToastr("Something went wrong");
        }
      } else {
        this.toast.errorToastr("Something went wrong");
      }
    }, err => {
      this.isLoader = false;
    })
  }

  bookingAgreement(body: any) {
    this.gs.isSpinnerShow = true;
    this.cabService.CreateBookingAgreement(body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(res.message);
        const modalRef = this.modalService.open(DocumentSignModalComponent, {
          centered: true,
          backdrop: 'static',
          windowClass: 'document-modal',
          size: 'xl'
        });
        modalRef.componentInstance.documentIframe = res.AgreementLink;
        modalRef.result.then((signModalRes: any) => {
          if (signModalRes.confirmed) {
            this.toast.successToastr("Booking successfully.");
            this.router.navigate(['/user/booking']);
            // this.router.navigate(['/cab/booking/booking-success', this.params.type]);
          }
        }, () => { });
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }



  bookCancel() {
    const itemId = this.riskType === 'car' ? this.singleItem.vehicleId : this.singleItem.driverId;
    this.router.navigate(['/cab/booking/booking-failed', itemId], {
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  onSelectCoin(event: any) {
    console.log("event >>>>>>>>", event);
    this.selectedCoin = event;
  }
}
