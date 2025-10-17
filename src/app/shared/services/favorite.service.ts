import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  // Favorite -> getAllFavourite
  public getAllFavourite(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('riskType', dataParams.riskType)
    return this.http.get(this.baseUrl1 + 'TLHUB/Favorite/GetAllFavourite', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Favorite -> GetInterestOnDriverFavourites
  // public GetInterestOnDriverFavourites(dataParams: any) {
  //   const params = new HttpParams().set('userId', dataParams.userId);
  //   return this.http.get(this.baseUrl1 + 'TLHUB/Favorite/GetInterestOnDriverFavourites', { params }).pipe(
  //     map((res: any) => {
  //       return res;
  //     })
  //   );
  // }

  // Favorite -> GetInterestOnDriverFavourites
  public GetInterestOnDriverFavourites(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Favorite/GetInterestOnDriverFavourites', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Favorite -> GetCarOwnerVehicles
  public GetCarOwnerVehicles(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Favorite/GetCarOwnerVehicles', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Favorite -> insertUpdateFavourite
  public insertUpdateFavourite(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Favorite/InsertAndUpdateFavourite', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

}
