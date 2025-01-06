import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { apiResultFormat } from './model/model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseUrl = environment.apiUrl;
  baseUrl1 = environment.apiUrl1;

  constructor(private http: HttpClient) { }

  // Master -> getMasterPolicyCodes
  public getMasterPolicyCodes(dataParams: any) {
    const params = new HttpParams()
      .set('StateCode', dataParams.stateCode)
      .set('TypeCode', dataParams.typeCode)
      .set('EffectiveDate', dataParams.effectiveDate);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/getMasterPolicyCodes', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> Vehicle / getMasterVehicleCodes
  public getMasterVehicleCodes(dataParams: any) {
    const params = new HttpParams()
      .set('StateCode', dataParams.stateCode)
      .set('TypeCode', dataParams.typeCode)
      .set('EffectiveDate', dataParams.effectiveDate);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/getMasterVehicleCodes', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> Vehicle / getVehicleModelByID
  public getVehicleModelByID(dataParams: any) {
    const params = new HttpParams().set('MakeId', dataParams.MakeId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/getVehicleModelByID', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterPostalCodes
  public getMasterPostalCodes(dataParams: any) {
    const params = new HttpParams().set('postalCode', dataParams.postalCode);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/getMasterPostalCodes', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterCountriesList
  public getMasterCountriesList(dataParams: any) {
    const params = new HttpParams().set('Code', dataParams.Code);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/getMasterCountriesList', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterStatesList
  public getMasterStatesList(dataParams: any) {
    const params = new HttpParams()
      .set('CountryCode', dataParams.CountryCode)
      .set('Code', dataParams.Code);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/getMasterStatesList', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetMasterTerritoryZip
  public GetMasterTerritoryZip(dataParams: any) {
    const params = new HttpParams()
      .set('zipCode', dataParams.zipCode)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/GetMasterTerritoryZip', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  public getMVRDetails(dataParams: any) {
    const params = new HttpParams()
      .set('licenseNo', dataParams.licenseNo)
      .set('state', dataParams.state)
      .set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/MVR/GetMVRDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> getDriverDetails
  public getDriverDetails(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/getDriverDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterPostalCodes
  public getBySelectDropdown(apiPoint: any) {
    return this.http.get(this.baseUrl1 + apiPoint).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterCountriesList
  public getConfigMasterDropDown() {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/getConfigMasterDropDown').subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }

  public storeJSON(data: any) {
    return this.http.post(this.baseUrl + 'storeJSON', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // ConfigUI -> GetConfigUIForms
  public getConfigUIForms(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB_API/TLHUB/ConfigUI/GetConfigUIForms', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // ConfigUI -> GetConfigUIFields
  public getConfigUIFields(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB_API/TLHUB/ConfigUI/GetConfigUIFields', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> InsertAndUpdateDriverKYC
  public insertAndUpdateDriverKYC(data: any, userId: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/InsertAndUpdateDriverKYC?userID=${userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Vehicle KYC -> insertAndUpdateVehicleKYC
  public insertAndUpdateVehicleKYC(data: any, userId: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/insertAndUpdateVehicleKYC?userID=${userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Vehicle KYC -> updatePersonalInfo
  public updatePersonalInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updatePersonalInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Vehicle KYC -> updateDriverKycAddress
  public updateDriverKycAddress(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateDriverKycAddress`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Vehicle KYC -> getVehicleDetails
  public getVehicleDetails(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/getVehicleDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Document -> UploadedDocument
  public uploadedDocument(data: any, dataParams: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/Document/UploadedDocument?UserId=${dataParams.UserId}&DocumentType=${dataParams.DocumentType}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterTypeIds
  public getMasterTypeIds(dataParams: any) {
    const params = new HttpParams()
      .set('StateCode', dataParams.stateCode)
      .set('TypeCode', dataParams.typeCode)
      .set('EffectiveDate', dataParams.effectiveDate);

    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/getMasterPolicyCodes', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }
}
