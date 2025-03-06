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
    const params = new HttpParams()
      .set('MakeId', dataParams.MakeId)
      .set('description', dataParams.description)
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

  // MVR -> Get MVR Details
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

  // KYC -> Single getDriverDetails
  public getDriverDetails(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('driverId', dataParams.driverId);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/getDriverDetailsByDriverId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> All getAllDrivers
  public getAllDrivers(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/getAllDrivers', { params }).pipe(
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

  // Driver KYC -> updateDriverInfo
  public updateDriverInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateDriverInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> updateDriverTlcInfo
  public updateDriverTlcInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateDriverTlcInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> updateForeignDriverInfo
  public updateForeignDriverInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateForeignDriverInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> updatePersonalInfo
  public updatePersonalInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updatePersonalInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> updateDriverKycAddress
  public updateDriverKycAddress(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateDriverKycAddress`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> updateDriverKycOtherInfo
  public updateDriverKycOtherInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateDriverKycOtherInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> updateVehicleOtherInfo
  public updateVehicleOtherInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateVehicleOtherInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  // Driver KYC -> UpdateVehicleInspection
  public updateVehicleInspection(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/UpdateVehicleInspectionInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  // Driver KYC -> updateVehicleInsuranceInfo
  public updateVehicleInsuranceInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateVehicleInsuranceInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  // Driver KYC -> updateVehicleInfo
  public updateVehicleInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateVehicleInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Vehicle KYC -> Single getVehicleDetails
  public getVehicleDetails(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('vehicleId', dataParams.vehicleId);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/getVehicleDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Vehicle KYC -> All getAllVehicles
  public getAllVehicles(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/getAllVehicles', { params }).pipe(
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


  // MVR -> Get MVR Details By GetVindecode
  public getVindecode(dataParams: any) {
    // GET TLHUB/VIN/GetVindecode ? vinNumber = { vinNumber } & userId={ userId }
    const params = new HttpParams()
      .set('vinNumber', dataParams.vinNumber)
      .set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/VIN/GetVindecode', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // MVR -> Get MVR Details by GetVinQuery
  public getVinQuery(dataParams: any) {
    // GET TLHUB/VIN/GetVindecode ? vinNumber = { vinNumber } & userId={ userId }
    const params = new HttpParams()
      .set('vinNumber', dataParams.vinNumber)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/VIN/GetVinQuery', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Company KYC -> insertAndUpdateCompanyKyc
  public insertAndUpdateCompanyKyc(data: any, dataParams: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/insertAndUpdateCompanyKyc?userId=${dataParams.userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> getCompanyDetailsByCompanyId
  public getCompanyDetailsByCompanyId(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('fleetCompanyId', dataParams.fleetCompanyId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/getCompanyDetailsByCompanyId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> getAllCompanies
  public getAllCompanies(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/getAllCompanies', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Company KYC -> updateCompanyInfo
  public updateCompanyInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateCompanyInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Company KYC -> updateFleetOwnerInfo
  public updateFleetOwnerInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/updateFleetOwnerInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getTermsAndConditionTypes
  public getTermsAndConditionTypes(dataParams: any) {
    const params = new HttpParams()
      .set('code', dataParams.code)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/GetTermsAndConditionTypes', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getTermsAndConditions
  public getTermsAndConditions(dataParams: any) {
    const params = new HttpParams()
      .set('code', dataParams.code)
      .set('city', dataParams.city)
      .set('state', dataParams.state)
      .set('country', dataParams.country)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/Master/GetTermsAndConditions', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> bulkVehicleUpload
  public bulkVehicleUpload(data: any, dataParams: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/bulkVehicleUpload?userId=${dataParams.userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> GetKYCDraftByUserId
  public GetKYCDraftByUserId(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB_API/TLHUB/KYC/GetKYCDraftByUserId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> KYCInsertDraft
  public KYCInsertDraft(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB_API/TLHUB/KYC/KYCInsertDraft`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
