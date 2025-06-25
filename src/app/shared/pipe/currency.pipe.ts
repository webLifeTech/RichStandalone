import { formatCurrency } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CabService } from '../services/cab.service';

@Pipe({
  name: 'currencyPipe',
  standalone: true
})

export class CurrencySymbolPipe implements PipeTransform {


  public currency: number;
  public formateCurrency: string;

  transform(value: number, currencyValue: string) {
    if (currencyValue == 'usd') {
      this.currency = value * 1;
      this.formateCurrency = formatCurrency(this.currency, 'en_US', '$', 'USD', '1.2-2');
      return ` ${this.formateCurrency}`;
    }
    else if (currencyValue === 'inr') {
      this.currency = value * 83.22
      this.formateCurrency = formatCurrency(this.currency, 'en_IN', '₹', 'INR', '1.2-2')
      return `${this.formateCurrency}`;
    }
    else if (currencyValue === 'eur') {
      this.currency = value * 0.95;
      this.formateCurrency = formatCurrency(this.currency, 'en_EU', '€', 'EUR', '1.2-2')
      return `${this.formateCurrency}`;
    }
    else if (currencyValue === 'aud') {
      this.currency = value * 0.018;
      this.formateCurrency = formatCurrency(this.currency, 'en_AUD', 'A$', 'AUD', '1.2-2')
      return `${this.formateCurrency}`;
    }
    return "";
  }

}
