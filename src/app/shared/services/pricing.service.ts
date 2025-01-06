import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiResultFormat } from './model/model';


@Injectable({
  providedIn: 'root'
})
export class PricingService {

  constructor(private http: HttpClient) { }

  public getPricing() {
    return this.http.get<apiResultFormat>('assets/json/pages/pricing.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getPricingById(data: any) {
    return this.http.get<apiResultFormat>('assets/json/pages/pricing.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }



}
