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
import { CommonModule, DatePipe } from '@angular/common';
import { PricingService } from '../../../services/pricing.service';

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
    private datePipe: DatePipe,
    private pricingS: PricingService,
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

      // const body = {
      //   "packageId": this.params.packageId,
      //   "userId": this.gs.loggedInUserInfo.userId || null,
      //   "paymentId": "pay-123",
      //   "startDate": "2025-03-21",
      //   "endDate": "2025-09-21",
      //   "noOfMonths": 6,
      //   "remarks": "Package subscription for 6 months",
      //   "payckageStatus": "Subscribe"
      // }

      // console.log("body >>>", body);
      // this.gs.isSpinnerShow = true;
      // this.pricingS.payPackagePaymentDummyTest(body).subscribe((response: any) => {
      //   this.gs.isSpinnerShow = false;
      //   if (response && response.statusCode == "200") {
      //     this.router.navigate(['/cab/booking/booking-success', this.params.type]);
      //     this.toast.successToastr(response.message);
      //     // this.packageSummaryObj = response.packageSummary;
      //     // console.log("packageSummaryObj <<<", response);
      //   }
      // });
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

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }
}
