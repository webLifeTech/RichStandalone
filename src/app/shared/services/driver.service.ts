import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { cabClassic } from '../interface/cab-classic';
import { cabMap } from '../interface/cab-map';
import { cabDetails, cabs, cab, blog, testimonials, services } from '../interface/cab';
import { driverDetails, drivers, driver } from '../interface/driver';


@Injectable({
  providedIn: 'root'
})
export class DriverService {

  public isOpenResponsiveFilter: boolean = false;
  public isOpenHorizontalFilter: boolean = false;
  public isOpenResponsiveHorizontal: boolean = false;
  public isOpenMapFilter: boolean = false;

  // Get Currency
  public currencyItem = localStorage.getItem("currency");

  public currency: string = 'usd';


  constructor(private http: HttpClient) {
    if (!localStorage.getItem('currency')?.length) {
      this.currency = 'usd';
      localStorage.setItem('currency', 'usd')
    } else {
      if (this.currencyItem !== null) {
        this.currency = this.currencyItem;
      }
    }
  }



  // Cab Classic
  cabClassic(): Observable<cabClassic> {
    return this.http.get<cabClassic>('assets/json/theme/cab-classic.json');
  }

  // Cab Map
  cabMapDemo(): Observable<cabMap> {
    return this.http.get<cabMap>('assets/json/theme/cab-map.json');
  }


  // Cabs
  cab(): Observable<cabs> {
    return this.http.get<cabs>('assets/json/grid/cabs.json')
  }
  // Cabs
  driver(): Observable<drivers> {
    return this.http.get<drivers>('assets/json/grid/drivers.json')
  }

  public getVerifiedDriver() {
    return this.http.get('assets/json/grid/drivers.json').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Cab SinglePage
  cabPage(): Observable<cabDetails> {
    return this.http.get<cabDetails>('assets/json/pages/cab-details.json')
  }

  // Cab Filter
  public drivers: string | undefined;
  getDriverDetails(filter: any): Observable<driver[]> {
    return this.driver().pipe(map((driver) =>
      driver.driver.filter((item) => {
        if (!filter.length) {
          return true
        }

        this.drivers = filter.find((data: any) => {
          if (item.tags) {
            if (item.tags.includes(data))
              return data
          }
        })
        // this.drivers = filter.find((data: string) => {
        //   return data
        // })
        return this.drivers
      })
    ));
  }

  // Get Max Price
  getMaxPrice(): Observable<number> {
    return this.cab().pipe(map((cab) => Math.max(...cab.cab.map((price) => price.price))));
  }


  // Testimonial
  testimonial(): Observable<testimonials> {
    return this.http.get<testimonials>('assets/json/testimonial.json')
  }

}
