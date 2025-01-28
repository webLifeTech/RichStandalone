import { Component, Input } from '@angular/core';
import { cabDetail, cabDetails } from '../../../../shared/interface/cab';
import { CabService } from '../../../../shared/services/cab.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BookingCreditCardComponent } from './booking-credit-card/booking-credit-card.component';
import { BookingDebitCardComponent } from './booking-debit-card/booking-debit-card.component';
import { BookingMyWalletComponent } from './booking-my-wallet/booking-my-wallet.component';
import { BookingNetBankingComponent } from './booking-net-banking/booking-net-banking.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../../services/payment.service';
import { BookingCryptoComponent } from './booking-crypto/booking-crypto.component';
import { ToastService } from '../../../services/toast.service';
import { GlobalService } from '../../../services/global.service';
import { CommonModule } from '@angular/common';

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
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent {

  @Input() flight: boolean = false;
  @Input() title: boolean = false;
  @Input() itemId: any;
  @Input() params: any;

  coinList: any = [];
  selectedCoin = "LTCT";
  type = "";
  isLoader: boolean = false;

  public cabDetail: cabDetails;

  constructor(
    private cabService: CabService,
    private router: Router,
    private paymentService: PaymentService,
    private toast: ToastService,
    private gs: GlobalService,
    // private route: ActivatedRoute,
  ) {
    this.getCrypto();
    this.cabService.getCabById().subscribe(response => {
      this.cabDetail = response;
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

  bookNow() {
    if (this.type === "crypto") {
      this.makePayment();
    } else {
      this.router.navigate(['/cab/booking/booking-success', this.params.type]);
    }
  }

  makePayment() {
    this.isLoader = true;
    let body = {
      "amount": 1,
      "currency1": "USD",
      "currency2": this.selectedCoin,
      "buyerEmail": this.gs.loggedInUserInfo.username || "customer_email@gmail.com",
      "customOrderId": this.gs.loggedInUserInfo.id || "1"
    }
    this.paymentService.createTransaction(body).subscribe(response => {
      this.isLoader = false;
      if (response.status == 201) {
        let responseData = response.data;
        if (responseData && responseData.checkout_url) {
          localStorage.setItem("cryptoTransaction", JSON.stringify(responseData));
          this.toast.successToastr("Transaction created successfully");
          if (!this.gs.loggedInUserInfo.cryptoTransactions) {
            this.gs.loggedInUserInfo.cryptoTransactions = [];
          }
          this.gs.loggedInUserInfo.cryptoTransactions.push(responseData.txn_id);
          localStorage.setItem('loggedInUser', JSON.stringify(this.gs.loggedInUserInfo));
          setTimeout(() => {
            window.open(responseData.status_url, "_blank");
            window.open(responseData.checkout_url, "_blank");
            this.router.navigate(['/cab/booking/booking-success', this.params.type], {
              queryParams: { paymentType: 'crypto' },
              queryParamsHandling: "merge"
            });
          }, 1000);
        } else {
          this.toast.errorToastr("Something went wrong");
        }
      }
    }, err => {
      this.isLoader = false;
    })
  }

  bookCancel() {
    this.router.navigate(['/cab/booking/booking-failed', this.itemId], {
      queryParams: this.params,
      queryParamsHandling: "merge"
    });
  }
}
