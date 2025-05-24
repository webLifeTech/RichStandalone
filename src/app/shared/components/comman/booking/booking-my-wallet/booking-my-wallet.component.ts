import { Component } from '@angular/core';
import { walletDetails } from '../../../data/data/booking';
import { CabService } from '../../../../services/cab.service';
import { GlobalService } from '../../../../services/global.service';
import { WalletService } from '../../../../services/wallet.service';
import { CurrencySymbolPipe } from '../../../../pipe/currency.pipe';

@Component({
  selector: 'app-booking-my-wallet',
  standalone: true,
  imports: [
    CurrencySymbolPipe,
  ],
  templateUrl: './booking-my-wallet.component.html',
  styleUrls: ['./booking-my-wallet.component.scss']
})
export class BookingMyWalletComponent {

  // public walletDetails = walletDetails;
  public walletDetails: any = {};

  constructor(
    public cabService: CabService,
    public gs: GlobalService,
    public walletService: WalletService,

  ) {
    this.getWalletDetails();
  }

  getWalletDetails() {
    this.gs.isSpinnerShow = true;
    this.walletService.getWalletDetails({
      "userId": this.gs.loggedInUserInfo.userId
    }).subscribe((response: any) => {
      console.log("response >>>>", response);
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        this.walletDetails = response.walletDetails;
      }
      this.gs.isSpinnerShow = false;
    })
  }

}
