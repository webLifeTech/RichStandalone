import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { apiResultFormat } from './model/model';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }

  public getAllNotifications() {
    return this.http.get('assets/json/pages/notifications.json').pipe(map((res: any) => {
      return res;
    }));
  }




}
