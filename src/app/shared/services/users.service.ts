import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { apiResultFormat } from './model/model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  public getAllUsers() {
    return this.http
      .get<apiResultFormat>('assets/json/pages/all-users.json')
      .pipe(
        map((res: apiResultFormat) => {
          return res;
        })
      );
  }




}
