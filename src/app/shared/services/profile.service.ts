import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
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
      .set('stateCode', dataParams.stateCode)
      .set('typeCode', dataParams.typeCode)
      .set('effectiveDate', dataParams.effectiveDate);
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterPolicyCodes', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> Vehicle / getMasterVehicleCodes
  public getMasterVehicleCodes(dataParams: any) {
    const params = new HttpParams()
      .set('stateCode', dataParams.stateCode)
      .set('typeCode', dataParams.typeCode)
      .set('effectiveDate', dataParams.effectiveDate);
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterVehicleCodes', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> Vehicle / getVehicleModelByID
  public getVehicleModelByID(dataParams: any) {
    const params = new HttpParams()
      .set('makeId', dataParams.MakeId)
      .set('description', dataParams.description)
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetVehicleModelByID', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterPostalCodes
  public getMasterPostalCodes(dataParams: any) {
    const params = new HttpParams().set('postalCode', dataParams.postalCode);
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterPostalCodes', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterCountriesList
  public getMasterCountriesList(dataParams: any) {
    const params = new HttpParams().set('code', dataParams.Code);
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterCountriesList', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterStatesList
  public getMasterStatesList(dataParams: any) {
    const params = new HttpParams()
      .set('countryCode', dataParams.CountryCode)
      .set('code', dataParams.Code);
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterStatesList', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetMasterTerritoryZip
  public GetMasterTerritoryZip(dataParams: any) {
    const params = new HttpParams()
      .set('zipCode', dataParams.zipCode)
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterTerritoryZip', { params }).pipe(
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
    return this.http.get(this.baseUrl1 + 'TLHUB/MVR/GetMVRDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // DriverKYC -> Single getDriverDetails
  public getDriverDetails(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('driverId', dataParams.driverId);
    return this.http.get(this.baseUrl1 + 'TLHUB/DriverKYC/GetDriverDetailsByDriverId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> All getAllDrivers
  public getAllDrivers(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB/DriverKYC/GetAllDrivers', { params }).pipe(
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

  // Master -> GetConfigMasterDropDown
  public getConfigMasterDropDown() {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/Master/GetConfigMasterDropDown').subscribe((result) => {
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
    return this.http.post(this.baseUrl1 + 'TLHUB/ConfigUI/GetConfigUIForms', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // ConfigUI -> GetConfigUIFields
  public getConfigUIFields(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/ConfigUI/GetConfigUIFields', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }


  // Driver KYC -> InsertAndUpdateDriverKYC
  public insertAndUpdateDriverKYC(data: any, userId: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverKYC/InsertAndUpdateDriverKYC?userID=${userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Vehicle KYC -> InsertAndUpdateVehicleKYC
  public insertAndUpdateVehicleKYC(data: any, userId: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleKYC/InsertAndUpdateVehicleKYC?userID=${userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> updateDriverInfo
  public updateDriverInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverKYC/UpdateDriverInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> UpdateDriverTlcInfo
  public updateDriverTlcInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverKYC/UpdateDriverTlcInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> UpdateForeignDriverInfo
  public updateForeignDriverInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverKYC/UpdateForeignDriverInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> UpdatePersonalInfo
  public updatePersonalInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverKYC/UpdatePersonalInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> updateDriverKycAddress
  public updateDriverKycAddress(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverKYC/UpdateDriverKycAddress`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> UpdateDriverKycOtherInfo
  public updateDriverKycOtherInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverKYC/UpdateDriverKycOtherInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Driver KYC -> UpdateVehicleOtherInfo
  public updateVehicleOtherInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleKYC/UpdateVehicleOtherInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  // Driver KYC -> UpdateVehicleInspection
  public updateVehicleInspection(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleKYC/UpdateVehicleInspectionInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  // Driver KYC -> UpdateVehicleInsuranceInfo
  public updateVehicleInsuranceInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleKYC/UpdateVehicleInsuranceInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  // Driver KYC -> UpdateVehicleInfo
  public updateVehicleInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleKYC/UpdateVehicleInfo`, data).pipe(
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
    return this.http.get(this.baseUrl1 + 'TLHUB/VehicleKYC/GetVehicleDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Vehicle KYC -> All getAllVehicles
  public getAllVehicles(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB/VehicleKYC/GetAllVehicles', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Document -> UploadedDocument
  public uploadedDocument(data: any, dataParams: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Document/UploadedDocument?userId=${dataParams.UserId}&documentType=${dataParams.DocumentType}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getMasterTypeIds
  public getMasterTypeIds(dataParams: any) {
    const params = new HttpParams()
      .set('stateCode', dataParams.stateCode)
      .set('typeCode', dataParams.typeCode)
      .set('effectiveDate', dataParams.effectiveDate);

    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterPolicyCodes', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }


  // MVR -> Get MVR Details By GetVindecode
  public getVindecode(dataParams: any) {
    const params = new HttpParams()
      .set('vinNumber', dataParams.vinNumber)
      .set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB/VIN/GetVindecode', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // MVR -> Get MVR Details by GetVinQuery
  public getVinQuery(dataParams: any) {
    const params = new HttpParams()
      .set('vinNumber', dataParams.vinNumber)
    return this.http.get(this.baseUrl1 + 'TLHUB/VIN/GetVinQuery', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // CompanyKYC -> InsertAndUpdateCompanyKyc
  public insertAndUpdateCompanyKyc(data: any, dataParams: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/CompanyKYC/InsertAndUpdateCompanyKyc?userId=${dataParams.userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // CompanyKYC -> GetCompanyDetailsByCompanyId
  public getCompanyDetailsByCompanyId(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('fleetCompanyId', dataParams.fleetCompanyId)
    return this.http.get(this.baseUrl1 + 'TLHUB/CompanyKYC/GetCompanyDetailsByCompanyId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // CompanyKYC -> getAllCompanies
  public getAllCompanies(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB/CompanyKYC/GetAllCompanies', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // CompanyKYC -> UpdateCompanyInfo
  public updateCompanyInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/CompanyKYC/UpdateCompanyInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // CompanyKYC -> UpdateFleetOwnerInfo
  public updateFleetOwnerInfo(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/CompanyKYC/UpdateFleetOwnerInfo`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> getTermsAndConditionTypes
  public getTermsAndConditionTypes(dataParams: any) {
    const params = new HttpParams()
      .set('code', dataParams.code)
    return this.http.get(this.baseUrl1 + 'TLHUB/TermsAndCondition/GetTermsAndConditionTypes', { params }).pipe(
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
    return this.http.get(this.baseUrl1 + 'TLHUB/TermsAndCondition/GetTermsAndConditions', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> BulkVehicleUpload
  public bulkVehicleUpload(data: any, dataParams: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleKYC/BulkVehicleUpload?userId=${dataParams.userId}`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> GetKYCDraftByUserId
  public GetKYCDraftByUserId(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
    return this.http.get(this.baseUrl1 + 'TLHUB/VehicleKYC/GetKYCDraftByUserId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> KYCInsertDraft
  public KYCInsertDraft(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleKYC/KYCInsertDraft`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> GetDriverWorkingHours
  public GetDriverWorkingHours(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('driverId', dataParams.driverId)
    return this.http.get(this.baseUrl1 + 'TLHUB/DriverKYC/GetDriverWorkingHours', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // KYC -> UpdateDriverWorkingHours
  public UpdateDriverWorkingHours(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/DriverKYC/UpdateDriverWorkingHours`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Vehicle KYC -> UpdateVehicleStatus
  public UpdateVehicleStatus(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleKYC/UpdateVehicleStatus?userId=${data.userId}&vehicleId=${data.vehicleId}&vehicleStatus=${data.vehicleStatus}`, {}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // COMMON -> UpdateDriverAndProviderStatus
  public UpdateDriverAndProviderStatus(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/COMMON/UpdateDriverAndProviderStatus?userId=${data.userId}&status=${data.status}&risktype=${data.risktype}`, {}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // COMMON -> checkDriverVehicleExist
  public checkDriverVehicleExist(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('riskType', dataParams.riskType)
      .set('vin', dataParams.vin)
      .set('licenseNumber', dataParams.licenseNumber)
    return this.http.get(this.baseUrl1 + 'TLHUB/COMMON/IsDriverVehicleExist', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // COMMON -> GetKycByUserId
  public GetKycByUserId(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB/COMMON/GetKycByUserId', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetMasterCancellationFeeType
  public GetMasterCancellationFeeType(dataParams: any) {
    return this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterCancellationFeeType').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Master -> GetMasterCancellationFeeRules
  public GetMasterCancellationFeeRules(dataParams: any) {
    const params = new HttpParams().set('appliesto', dataParams.appliesto);
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/Master/GetMasterCancellationFeeRules', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }

  // Cancellation -> GetCancellationFeeRules
  public GetCancellationFeeRules(dataParams: any) {
    const params = new HttpParams().set('riskId', dataParams.riskId);
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/Cancellation/GetCancellationFeeRules', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }

  // Cancellation -> AddRiskCancellationFeeRules
  public AddRiskCancellationFeeRules(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/Cancellation/AddRiskCancellationFeeRules`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // VehicleKYC -> GetMyCarListDetails
  public GetMyCarListDetails(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/VehicleKYC/GetMyCarListDetails`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // DriverKYC -> GetDriverDetailsByDriverId
  public GetDriverDetailsByDriverId(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('driverId', dataParams.driverId);

    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/DriverKYC/GetDriverDetailsByDriverId', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })

    // return this.http.get(this.baseUrl1 + 'TLHUB/DriverKYC/GetDriverDetailsByDriverId', { params }).pipe(
    //   map((res: any) => {
    //     return res;
    //   })
    // );
  }

  // CompanyKYC -> GetCompanyDetailsByCompanyId
  public GetCompanyDetailsByCompanyId(dataParams: any) {
    const params = new HttpParams()
      .set('userId', dataParams.userId)
      .set('fleetCompanyId', dataParams.fleetCompanyId);

    // return this.http.get(this.baseUrl1 + 'TLHUB/CompanyKYC/GetCompanyDetailsByCompanyId', { params }).pipe(
    //   map((res: any) => {
    //     return res;
    //   })
    // );

    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl1 + 'TLHUB/CompanyKYC/GetCompanyDetailsByCompanyId', { params }).subscribe((result) => {
        resolve(result)
      }, (err) => {
        reject(err)
      })
    })
  }

  // User -> UpdateEmailPhoneNumbreVerification
  public UpdateEmailPhoneNumbreVerification(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/User/UpdateEmailPhoneNumbreVerification`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // COMMON -> GetGeneratedDocuments
  public GetGeneratedDocuments(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/COMMON/GetGeneratedDocuments`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // COMMON -> GetUploadedDocuments
  public GetUploadedDocuments(data: any) {
    return this.http.post(this.baseUrl1 + `TLHUB/COMMON/GetUploadedDocuments`, data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
