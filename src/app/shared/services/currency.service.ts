import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  // Get Currency
  public currencyItem = localStorage.getItem("currency");

  public currency: string = 'usd';


  constructor() {
    if (!localStorage.getItem('currency')?.length) {
      this.currency = 'usd';
      localStorage.setItem('currency', 'usd')
    } else {
      if (this.currencyItem !== null) {
        this.currency = this.currencyItem;
      }
    }
  }

}
