import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { apiResultFormat } from './model/model';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUserReview() {
    return this.http.get<apiResultFormat>('assets/json/pages/user-review.json').pipe(
      map((res: apiResultFormat) => {
        return res;
      })
    );
  }




}
