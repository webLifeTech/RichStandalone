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
import { ProfileService } from '../../../../../services/profile.service';

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
  type: any = "CreditCard";
  amount: any;
  coinList: any = [];
  paymentOptions: any = [];
  firstPayOpt: any = {};

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private paymentService: PaymentService,
    public gs: GlobalService,
    public walletService: WalletService,
    private toast: ToastService,
    private profileService: ProfileService,
  ) {
    this.getCrypto();
    this.getConfigUIForms();
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
        this.paymentOptions = this.paymentOptions.filter((i: any) => i.formId != 23);
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

  closeModal() {
    this.modalService.dismissAll();
  }

  async addFunds() {

    let body: any = {
      "userId": this.gs.loggedInUserInfo.userId,
      "walletId": this.walletId,
      "amount": this.amount,
      "remarks": null,
      "paymentMethod": this.type, // CreditCard,ACH
      "currency": "USD", // USD,INR,EUR
    }

    if (!this.amount) {
      this.toast.errorToastr("Please Enter Amount");
      return;
    }
    if (this.type === 'CreditCard') {
      if (!this.gs.paymentDetails.creditCard.valid) {
        this.toast.errorToastr("Invalid Credit Card Details");
        return;
      }
      this.gs.isSpinnerShow = true;
      const cardNumber = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.creditCard?.value?.cardNumber?.replaceAll(/\s/g, '') })
      const encryptCvv = await this.walletService.GetPaymentEncryptvalue({ inputValue: this.gs.paymentDetails.creditCard?.value.cvc })
      // return;
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

      this.gs.isSpinnerShow = true;
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
    console.log("body >>>>", body);
    // return;
    this.gs.isSpinnerShow = true;
    this.walletService.addWalletFunds(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
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
      "paymentMethod": this.type, // CreditCard,ACH
      "currency": "USD", // USD,INR,EUR
    }

    this.gs.isSpinnerShow = true;
    this.walletService.withDrawWalletFunds(body).subscribe((response: any) => {
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

}
