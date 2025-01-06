import { Component } from '@angular/core';
import { walletDetails } from '../../../data/data/booking';

@Component({
  selector: 'app-booking-my-wallet',
  standalone: true,
  imports: [],
  templateUrl: './booking-my-wallet.component.html',
  styleUrls: ['./booking-my-wallet.component.scss']
})
export class BookingMyWalletComponent {

  public walletDetails = walletDetails;

}
