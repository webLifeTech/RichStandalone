import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { apiResultFormat } from './model/model';


@Injectable({
  providedIn: 'root'
})
export class MyCarsService {

  constructor(private http: HttpClient) { }

  public getMyCars() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/user-cars.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }




}
