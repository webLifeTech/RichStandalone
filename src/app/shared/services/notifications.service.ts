import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { apiResultFormat } from './model/model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  public getAllNotifications() {
    return this.http.get('assets/json/pages/notifications.json').pipe(map((res: any) => {
      return res;
    }));
  }

  // Notification -> GetUserNotifications
  public GetUserNotifications(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Notification/GetUserNotifications`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }




}
