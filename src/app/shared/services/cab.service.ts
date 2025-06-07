import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { cabClassic } from '../interface/cab-classic';
import { cabMap } from '../interface/cab-map';
import { cabDetails, cabs, cab, testimonials } from '../interface/cab';
import { drivers } from '../interface/driver';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CabService {

  public isOpenResponsiveFilter: boolean = false;
  public isOpenHorizontalFilter: boolean = false;
  public isOpenResponsiveHorizontal: boolean = false;
  public isOpenMapFilter: boolean = false;
  baseUrl1 = environment.apiUrl1;

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

  // Cab SinglePage
  cabPage(): Observable<cabDetails> {
    return this.http.get<cabDetails>('assets/json/pages/cab-details.json')
  }

  // Cab SinglePage
  getCabById(): Observable<cabDetails> {
    return this.http.get<cabDetails>('assets/json/grid/cabs.json')
  }

  // Cab Filter
  public cabs: string | any;
  getCabDetails(filter: string[]): Observable<cab[]> {
    return this.cab().pipe(map((cab) =>

      cab.cab.filter((item) => {
        if (!filter.length) {
          return true
        }

        this.cabs = filter.find((data: any) => {
          if (item.tags) {
            if (item.tags.includes(data))
              return data
          }
        })
        return this.cabs
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

  // Master -> GetImportantNotice
  public getImportantNotice(dataParams: any) {
    const params = new HttpParams()
      .set('code', dataParams.code)
      .set('noticeType', dataParams.noticeType)
    return this.http.get(this.baseUrl1 + 'TLHUB/ImportantNotice/GetImportantNotice', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Location -> GetLocations
  public GetLocations(dataParams: any) {
    const params = new HttpParams()
      .set('location', dataParams.location)
      .set('risktype', dataParams.risktype)
    return this.http.get(this.baseUrl1 + 'TLHUB/Location/GetLocations', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // VehicleSearch -> VehicleSearachResult
  public VehicleSearchResult(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleSearch/VehicleSearchResult`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // VehicleSearch -> GetVehicleBookingSummaryDetails
  public getVehicleBookingSummaryDetails(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleSearch/GetVehicleBookingSummaryDetails`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // VehicleSearch -> GetBookingVehicleDetails
  public getBookingVehicleDetails(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleSearch/GetBookingVehicleDetails`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // DriverSearch -> DriverSearchResult
  public DriverSearchResult(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverSearch/DriverSearchResult`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }


  // DriverSearch -> getDriverBookingSummary
  public getDriverBookingSummary(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverSearch/GetDriverBookingSummary`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // DriverSearch -> GetBookingDriverDetails
  public getBookingDriverDetails(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverSearch/GetBookingDriverDetails`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // DriverKyc -> GetDriverRates
  public GetDriverRates(dataParams: any) {
    return new Promise((resolve, reject) => {
      const params = new HttpParams().set('driverId', dataParams.driverId).set('licenseNo', dataParams.licenseNo);
      this.http.get(this.baseUrl1 + 'TLHUB/DriverKyc/GetDriverRates', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }

  // VehicleKYC -> GetVehicleRates
  public GetVehicleRates(dataParams: any) {
    return new Promise((resolve, reject) => {
      const params = new HttpParams().set('vehicleId', dataParams.vehicleId).set('vin', dataParams.vin);
      this.http.get(this.baseUrl1 + 'TLHUB/VehicleKYC/GetVehicleRates', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }

  // ENQUIRY -> AddDriverOrVehicleEnquiry
  public AddDriverOrVehicleEnquiry(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/ENQUIRY/AddDriverOrVehicleEnquiry?userId=${data.userId}&riskId=${data.riskId}&riskType=${data.riskType}&remarks=${data.remarks}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // BookingAgreement -> CreateBookingAgreement
  public CreateBookingAgreement(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/BookingAgreement/CreateBookingAgreement`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
