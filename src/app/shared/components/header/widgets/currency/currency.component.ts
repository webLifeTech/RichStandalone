import { Component } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent {

  public currencies = [
    {
      name: 'Dollar',
      currency: 'USD',
      value: "usd",
      symbol: "$",
      price: 1 // price of usd
    },
    {
      name: 'Rupees',
      currency: 'INR',
      value: "inr",
      symbol: "₹",
      price: 83.22 // price of inr
    },
    {
      name: 'Europe',
      currency: 'EUR',
      value: "eur",
      symbol: "€",
      price: 0.95 // price of eur
    },
  ]
  public selectedCur: string;
  constructor(private cabService: CabService) {
    this.selectedCur = localStorage.getItem('currency') || 'usd';
  }

  getCurrency(event: Event) {
    if (event) {
      this.selectedCur = (event.target as HTMLInputElement).value;
      this.cabService.currency = (event.target as HTMLInputElement).value;
      localStorage.setItem('currency', (event.target as HTMLInputElement).value)
    }
  }
}
