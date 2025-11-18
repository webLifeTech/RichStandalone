import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  // Settings -> GetSettingsDetails
  public GetSettingsDetails(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('type', dataParams.type)
    return this.http.get(this.baseUrl1 + 'TLHUB/Settings/GetSettingsDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Settings -> UpdateSettingsDetails
  public UpdateSettingsDetails(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Settings/UpdateSettingsDetails`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Account -> ChangePassword
  public ChangePassword(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Account/ChangePassword`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
