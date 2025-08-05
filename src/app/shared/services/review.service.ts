import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { apiResultFormat } from './model/model';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  baseUrl = environment.apiUrl;
  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  public getUserReview() {
    return this.http.get<apiResultFormat>('assets/json/pages/user-review.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  public getUserActivities() {
    return this.http.get<apiResultFormat>('assets/json/pages/user-activities.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }

  // RiskReviews -> InsertAndUpdateRiskReviews
  public InsertAndUpdateRiskReviews(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/RiskReviews/InsertAndUpdateRiskReviews', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // RiskReviews -> GetAllRiskReviews
  public GetAllRiskReviews(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/RiskReviews/GetAllRiskReviews', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // RiskReviews -> GetUserReviews
  public GetUserReviews(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/RiskReviews/GetUserReviews', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }




}
