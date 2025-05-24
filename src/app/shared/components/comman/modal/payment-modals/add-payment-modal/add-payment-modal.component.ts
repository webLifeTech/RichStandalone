import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookingCreditCardComponent } from '../../../booking/booking-credit-card/booking-credit-card.component';
import { BookingMyWalletComponent } from '../../../booking/booking-my-wallet/booking-my-wallet.component';
import { BookingNetBankingComponent } from '../../../booking/booking-net-banking/booking-net-banking.component';
import { BookingCryptoComponent } from '../../../booking/booking-crypto/booking-crypto.component';
import { TranslateModule } from '@ngx-translate/core';
import { cabDetails } from '../../../../../interface/cab';
import { PaymentService } from '../../../../../services/payment.service';
import { CabService } from '../../../../../services/cab.service';
import { WalletService } from '../../../../../services/wallet.service';
import { GlobalService } from '../../../../../services/global.service';
import { OnlynumberDirective } from '../../../../../directives/number-only.directive';
import { ToastService } from '../../../../../services/toast.service';

@Component({
  selector: 'app-add-payment-modal',
  standalone: true,
  imports: [
    BookingCreditCardComponent,
    BookingMyWalletComponent,
    BookingNetBankingComponent,
    BookingCryptoComponent,
    TranslateModule,
    NgbModule,
    CommonModule,
    FormsModule,
    OnlynumberDirective
  ],
  templateUrl: './add-payment-modal.component.html',
  styleUrl: './add-payment-modal.component.scss'
})
export class AddPaymentModalComponent {

  @Input() title: string;
  @Input() paymentType: any;
  @Input() walletId: any;
  reason: any = "";
  public cabDetail: cabDetails;
  type: any = "CreditCard";
  amount: any;
  coinList: any = [];

  constructor(
    private cabService: CabService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService,
    public gs: GlobalService,
    public walletService: WalletService,
    private toast: ToastService,
  ) {
    this.getCrypto()
    this.cabService.getCabById().subscribe(response => {
      this.cabDetail = response;
      console.log("this.cabDetail >>>>", this.cabDetail.cabBooking);
      this.cabDetail.cabBooking = this.cabDetail.cabBooking.filter((i: any) => i.value != "wallet");

    })
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  // GetPaymentEncryptvalue() {
  //   this.gs.isSpinnerShow = true;
  //   this.walletService.GetPaymentEncryptvalue({
  //     "inputValue": this.gs.loggedInUserInfo.userId
  //   }).subscribe((response: any) => {
  //     console.log("response >>>>", response);
  //     // if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
  //     // }
  //     this.gs.isSpinnerShow = false;
  //   })
  // }

  async addFunds() {

    console.log("this.amount >>>", this.amount);



    let body: any = {
      "userId": this.gs.loggedInUserInfo.userId,
      "walletId": this.walletId,
      "amount": this.amount,
      "remarks": null,
      "paymentType": this.type, // CreditCard,ACH
      "currency": "USD", // USD,INR,EUR
    }

    console.log("this.gs.paymentDetails >>>", this.gs.paymentDetails);

    if (!this.amount) {
      this.toast.errorToastr("Please Enter Amount");
      return;
    }
    console.log("this.type >>>>>>>", this.type);
    if (this.type === 'CreditCard') {
      if (!this.gs.paymentDetails.creditCard.valid) {
        this.toast.errorToastr("Invalid Credit Card Details");
        return;
      }
      const cardNumber = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.creditCard?.value?.cardNumber?.replaceAll(/\s/g, '') })
      const encryptCvv = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.creditCard?.value.cvc })
      console.log("cardNumber >>>>>>>", cardNumber);
      console.log("encryptCvv >>>>>>>", encryptCvv);
      // return;

      body["creditCardInfo"] = {
        "cardNumber": cardNumber,
        "expirationDate": this.gs.paymentDetails.creditCard?.value?.expirationDate?.replaceAll(/\s/g, ''),
        "cvv": encryptCvv,
        // "cardNumber": this.gs.paymentDetails.creditCard?.value?.cardNumber?.replaceAll(/\s/g, ''),
        // "cvv": this.gs.paymentDetails.creditCard?.value.cvc,
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
      console.log("rountingNo >>>>>>>", rountingNo);
      console.log("accountNo >>>>>>>", accountNo);
      // return;

      body["bankAccount"] = {
        "bank": this.gs.paymentDetails.ach.value?.bank,
        "rountingNo": rountingNo,
        "accountNo": accountNo,
        "accountType": this.gs.paymentDetails.ach.value?.accountType,
        "accountName": this.gs.paymentDetails.ach.value?.accountName,
        "accountEntityType": this.gs.paymentDetails.ach.value?.accountEntityType
      }
    }
    console.log("body >>>>", body);
    // return;
    this.gs.isSpinnerShow = true;
    this.walletService.addWalletFunds(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      console.log("response >>>>", response);
      if (response && response.statusCode == "200") {
        if (this.paymentType === 'add') {
          this.toast.successToastr(response.message);
        }
        if (this.paymentType === 'withdrawal') {
          this.toast.successToastr(response.message);
        }
        this.activeModal.close({ confirmed: true });
      } else {
        this.toast.errorToastr(response.message);
      }
    })
    // this.activeModal.close({ confirmed: true, reason: this.reason });
  }

  withdrawFunds() {
    if (!this.amount) {
      this.toast.errorToastr("Please Enter Amount");
      return;
    }

    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "walletId": this.walletId,
      "amount": this.amount,
      "remarks": null,
      "paymentType": this.type, // CreditCard,ACH
      "currency": "USD", // USD,INR,EUR
    }

    this.gs.isSpinnerShow = true;
    this.walletService.withDrawWalletFunds(body).subscribe((response: any) => {
      console.log("response >>>>", response);
      if (response && response.statusCode == "200") {
        if (this.paymentType === 'add') {
          this.toast.successToastr("Added successfully");
        }
        if (this.paymentType === 'withdrawal') {
          this.toast.successToastr("Withdrawal successfully");
        }
        this.activeModal.close({ confirmed: true });
      }
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

  change(type: any) {
    this.type = type;
  }

}
