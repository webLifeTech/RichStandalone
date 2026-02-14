import { Component, Input } from '@angular/core';
import { CabService } from '../../../shared/services/cab.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { CarStatusChangeModalComponent } from '../../../shared/components/comman/modal/my-car-modals/car-status-change-modal/car-status-change-modal.component';
import { AdminService } from '../../../shared/services/admin.service';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { ExcelExportService } from '../../../shared/services/excel-export.service';
import { RolePermissionService } from '../../../shared/services/rolepermission.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BookingService } from '../../../shared/services/booking.service';
import { SettingsService } from '../../../shared/services/setting.service';
import { DynamicInfoModalComponent } from '../comman/modal/dynamic-info-modal/dynamic-info-modal.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-users-approval-kyc',
  standalone: true,
  imports: [
    DynamicInfoModalComponent,
    CommonModule,
    FormsModule,
    RouterLink,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgSelectModule,
    MatExpansionModule
  ],
  providers: [DatePipe],
  templateUrl: './users-approval-kyc.component.html',
  styleUrl: './users-approval-kyc.component.scss'
})
export class UsersApprovalKycComponent {
  public tableData: any = [];
  public selectedFilter = null;
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  dateTimeRange: any = "";

  public tableDataSecond: any = [];
  public searchDataValueSecond = '';
  public pageSizeSecond = 10;
  public totalDataSecond = 0;
  public currentPageSecond = 1;

  public searchFilter: any = {
    status: 'All Status',
  };
  public activeTab = '';
  activeTabName: any = '';
  sortColumn: any = "";
  sortOrder: any = "DESC";

  tabs: any = [];

  vehicleStatusList: any = [
    { id: 1, name: 'All Status', value: 'All Status' },
    { id: 1, name: 'Active', value: 'Active' },
    { id: 3, name: 'Inactive', value: 'Inactive' },
    { id: 3, name: "KYC Pending", value: "KYC Pending" },
  ]
  filterTypes: any = [];

  type: any = 'driver';
  viewInfoDetails: any = {
    "driverInfo": {
      "contactId": 12442,
      "driverId": 1,
      "profilePicturePath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260212_010136.jpg",
      "driverLicenseNumber": "000000003",
      "maskDriverLicenseNumber": "XXXXX0003",
      "encryptedDriverLicenseNumber": "ANislS8mH0yQmGB/u5rVBwIAAAAILRAyREwTTrSzfhcqBgkayJxoWwMR5fFbax6tJFvkTBwknVmHXg9G1mVcugaTBjc=",
      "driverLicenseState": "NEW YORK",
      "driverLicenseStateCd": "42",
      "licenseDocumentUploadPath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260212_010212.pdf",
      "firstName": "THEIN",
      "middleName": "PARAS",
      "lastName": "WIN",
      "prefix": "Mr",
      "prefixCd": "13A2E7E5-161E-49A8-9DFF-8DB591FDA8BF",
      "suffix": "4TH",
      "suffixCd": "4F3D3642-067F-4E5F-A472-0F00158792AC",
      "dateOfBirth": "05-03-1957 00:00:00",
      "maskDateOfBirth": "XX/XX/1957",
      "encryptedDateOfBirth": "AAQHTHoZBUOu6CZ8QiWyiwIAAAD++KUwAb21dQkxxx7MLfgtRil+8kJ94BdarMW1NiMZiNLvn0x8GhlEn0GErUkNIZs=",
      "driverLicenseEffectiveDate": "10-01-2025 00:00:00",
      "driverLicenseExpirationDate": "10-01-2030 00:00:00",
      "isForeignDriverLicense": "No",
      "isForeignDriverLicenseCd": "false",
      "fdCountry": null,
      "fdCountryCd": 0,
      "fdState": null,
      "fdStateCd": 0,
      "fdCity": null,
      "fdCityCd": 0,
      "postalCode": null,
      "issueDate": null,
      "expireDate": null,
      "foreignDriverLicenseNum": null,
      "foreignDriverDocumentPath": null,
      "doYouWantToGetQuotesFromTLH": true,
      "doYouHaveInsurance": "No",
      "doYouHaveInsuranceCd": "false",
      "riskRating": 0,
      "requestedURL": "https://mvrnow.usdtest.com/usd/Mvr/MVRPdfFile/bc6caa21-63cc-47ef-8976-0a7ea3db350d"
    },
    "personalInfo": {
      "gender": "Male",
      "genderCd": "823",
      "maritalStatus": "Un-Married",
      "maritalStatusCd": "0AA9C318-3178-4F69-A0DC-8C7520E2A17E",
      "numberOfChildren": 0,
      "contactNumber": "5464539888",
      "isPhoneNumberVerified": true,
      "emailId": "tarigok116@desiys.com",
      "isEmailVerified": true,
      "emergencyContactNumber": "9847777727",
      "emergencyContactPersonName": "Lala",
      "relationType": "Brother",
      "relationTypeCd": 913,
      "ssn": "111111111",
      "maskSSN": "XXXXX1111",
      "encryptedSSN": "AHKrgCXvvEiBPuMvvc88NgIAAADsHR0K+Jbo6/ZvT77NGRlpiHVB6Lvn9JpX74yIH5K7hJqrEi9k4sSysA8RARK+uEI=",
      "creditScore": "Very Good ",
      "creditScoreCd": 837,
      "location": null
    },
    "permanentAddress": {
      "address1": "8619 ELMHURST AVE 3B",
      "address2": null,
      "postalCode": "10022",
      "city": "ELMHURST",
      "cityCd": "ELMHURST",
      "state": "NEW YORK",
      "stateCd": 42,
      "country": "UNITED STATES",
      "countryCd": 230,
      "county": null,
      "isPrimaryAddress": true,
      "addressId": "9C515256-DF7F-437E-9417-AC26D9ACA457",
      "addressTypeId": "7D826BEB-91B0-429F-8598-6FFC4388A219"
    },
    "mailingAddress": {
      "address1": "8619 ELMHURST AVE 3B",
      "address2": "Surat",
      "postalCode": "10022",
      "city": "ELMHURST",
      "cityCd": null,
      "state": "NEW YORK",
      "stateCd": 42,
      "country": "UNITED STATES",
      "countryCd": 230,
      "county": null,
      "isPrimaryAddress": false,
      "addressId": "0C4FB047-9761-4C3A-8412-CC596F877D22",
      "addressTypeId": "C7AD53B1-54D8-48B5-8792-6FEF2B7A78B5"
    },
    "billingAddress": {
      "address1": "8619 ELMHURST AVE 3B",
      "address2": null,
      "postalCode": "10022",
      "city": "ELMHURST",
      "cityCd": null,
      "state": "NEW YORK",
      "stateCd": 42,
      "country": "UNITED STATES",
      "countryCd": 230,
      "county": null,
      "isPrimaryAddress": false,
      "addressId": "ABF78649-9D21-440F-B753-535BE62BD019",
      "addressTypeId": "90867F5E-1859-4304-8539-E440A93D7B3B"
    },
    "otherInfo": [],
    "tlcLicenseInfo": {
      "tlcLicenseNumber": null,
      "tlcLicenseDocumentPath": null,
      "tlcFirstName": "WIN",
      "tlcLastName": "THEIN",
      "licenseState": "NEW YORK",
      "licenseStateCd": 0,
      "tlcLicenseEffectiveDate": null,
      "tlcLicenseExpirationDate": null
    },
    "kycMandatoryDocuments": [
      {
        "id": 159,
        "documentTypeName": "Social Security Number document",
        "documentTypeId": 943,
        "userId": "7e5ea663-3d3c-42ea-ac40-88c3de7cb9af",
        "documentPath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260212_064621.jpeg",
        "isEdit": false
      },
      {
        "id": 167,
        "documentTypeName": "Proof of Address",
        "documentTypeId": 942,
        "userId": "7e5ea663-3d3c-42ea-ac40-88c3de7cb9af",
        "documentPath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260212_074347.jpg",
        "isEdit": false
      }
    ],
    "driveInCity": 42,
    "response": {
      "statusCode": "200",
      "status": "Success",
      "message": null,
      "responseData": null
    }
  }


  vctype: any = 'my_vehicle';
  vcViewInfoDetails = {
    "vehicleInfo": {
      "userId": "0c7ce3e1-d859-4d1e-9b59-2bc4ff06a36c",
      "vehicleId": 7781,
      "vinNumber": "JTDKN3DU8B0319013",
      "vinDocumentUpload": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260213_065157.jpg",
      "plateNumber": "GJ-12-1234",
      "modelYear": 2011,
      "vehicleAge": 15,
      "make": "TOYOTA",
      "makeCd": "11",
      "model": "PRIUS",
      "modelCd": "46",
      "grossvehicleWeight": "0-10,000",
      "grossvehicleWeightCd": "1",
      "seatingCapacity": 5,
      "registrationState": "NEW YORK",
      "registrationStateCd": "42",
      "territoryCode": "20-Bellerose Village",
      "territoryCodeCd": "463",
      "garageZipCode": "11001",
      "fuelType": "HYBRID",
      "fuelTypeCd": null,
      "dashboardCamera": "No",
      "dashboardCameraCd": "false",
      "collisionAvoidance": "No",
      "collisionAvoidanceCd": "false",
      "transmission": "Manual",
      "transmissionCd": "199",
      "carCategory": "Driving School",
      "carCategoryCd": "79",
      "riskRating": 3.5
    },
    "vehicleInspectionDetails": {
      "validDate": "01-01-1900 00:00:00",
      "uploadInspectionReport": null,
      "isInspectionReportAvailable": false,
      "isReportInitiatedFromTLH": true
    },
    "vehicleInsuranceDetails": {
      "summaryId": 879,
      "coverageId": 0,
      "isInsuranceCovered": false,
      "isInsuranceNotCoveredLookingForQuote": false,
      "carriersName": null,
      "carriersNameCd": null,
      "policyNumber": null,
      "coverages": null,
      "coveragesCd": 0,
      "coverageLimits": null,
      "coverageLimitsCd": 0,
      "coverageExpireDate": "01-01-0001 00:00:00",
      "coverageEffectiveDate": "01-01-0001 00:00:00"
    },
    "vehicleOtherDetails": {
      "summaryId": 879,
      "carImageUpload": null,
      "pricePerDay": 0,
      "pricePerWeek": 0,
      "pricePerMonth": 0,
      "pricePerYear": 0,
      "vehicleStatus": null,
      "vehicleStatusCd": null,
      "branch": null,
      "branchCd": null,
      "shiftStatus": null,
      "shiftStatusCd": 0,
      "insuranceFeeIncluded": null,
      "insuranceFeeIncludedCd": null,
      "insuranceFee": 0,
      "otherFee": 0,
      "location": {
        "id": 0,
        "ownerId": null,
        "riskId": null,
        "riskType": null,
        "pickUpInstruction": null,
        "dropInstruction": null,
        "addr1": null,
        "addr2": null,
        "city": null,
        "stateProvCd": null,
        "stateProv": null,
        "postalCode": null,
        "countryCd": null,
        "country": null,
        "county": null,
        "isActive": false
      }
    },
    "vehicleCancellationRules": [],
    "kycMandatoryDocuments": [
      {
        "id": 2784,
        "documentTypeName": "Proof of Address",
        "documentTypeId": 942,
        "userId": "0c7ce3e1-d859-4d1e-9b59-2bc4ff06a36c",
        "documentPath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260213_065021.pdf",
        "isEdit": false
      },
      {
        "id": 2785,
        "documentTypeName": "Social Security Number document",
        "documentTypeId": 943,
        "userId": "0c7ce3e1-d859-4d1e-9b59-2bc4ff06a36c",
        "documentPath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260213_065032.pdf",
        "isEdit": false
      },
      {
        "id": 2786,
        "documentTypeName": "Proof of Insurance",
        "documentTypeId": 944,
        "userId": "0c7ce3e1-d859-4d1e-9b59-2bc4ff06a36c",
        "documentPath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260213_065049.pdf",
        "isEdit": false
      }
    ],
    "driveInCity": 42,
    "response": {
      "statusCode": "200",
      "status": "Success",
      "message": "Vehicle found",
      "responseData": null
    }
  };

  kycForm: any = {
    formName: "Driver Information",
    menuId: ""
  }

  isApproval: boolean = false;
  actionIndex: any = 0;

  tempVehicles: any = {
    "gridList": [
      {
        "userId": "7171fbc0-a8f5-40fa-88b3-08da11e1b0e3",
        "roleName": "Driver with owned car",
        "ownerName": "BADRUL HASAN",
        "userStatus": "Active",
        "totalCount": 14
      },
      {
        "userId": "18bc92f2-1b64-41f9-8725-9f2dfaa36c08",
        "roleName": "Fleet owner",
        "ownerName": "HAFEDH LUTF ALGAHIM",
        "userStatus": "Active",
        "totalCount": 14
      },
      {
        "userId": "c2ce3535-1321-4944-ae12-b8439ded32b1",
        "roleName": "Fleet owner",
        "ownerName": "HAFEDH LUTF ALGAHIM",
        "userStatus": "Active",
        "totalCount": 14
      },
      {
        "userId": "0171c3d8-4398-487d-bc02-9b33d05b1aa9",
        "roleName": "Fleet owner",
        "ownerName": "JAMEL A KILLIBREW",
        "userStatus": "Active",
        "totalCount": 14
      },
      {
        "userId": "313ab892-6dd8-42b5-851b-3e209bbc0bc1",
        "roleName": "Driver with owned car",
        "ownerName": "JAMEL A KILLIBREW",
        "userStatus": "Active",
        "totalCount": 14
      },
      {
        "userId": "ee34ded9-1836-402d-9738-d27bbfab56c2",
        "roleName": "Fleet owner",
        "ownerName": "JAMEL A KILLIBREW",
        "userStatus": "Active",
        "totalCount": 14
      },
      {
        "userId": "40805954-3074-418e-a99b-315cc110af9a",
        "roleName": "Fleet owner",
        "ownerName": "THANKGOD O AMEDU",
        "userStatus": "Active",
        "totalCount": 14
      },
      {
        "userId": "a0a4c458-86ec-45c1-b8cf-b0bc26e6f39f",
        "roleName": "Driver with owned car",
        "ownerName": "THANKGOD O AMEDU",
        "userStatus": "Active",
        "totalCount": 14
      },
      {
        "userId": "e1bec3b6-43f6-4bdb-9bde-35d5eef25fb3",
        "roleName": "Fleet owner",
        "ownerName": "THANKGOD O AMEDU",
        "userStatus": "Active",
        "totalCount": 14
      },
      {
        "userId": "823a31f8-7591-4c1e-966a-e45af49f00f6",
        "roleName": "Fleet owner",
        "ownerName": "THEIN WIN",
        "userStatus": "Active",
        "totalCount": 14
      }
    ],
    "filterList": null,
    "viewModel": {
      "pageHeading": "All vehicle owners",
      "totalCount": 10
    },
    "response": {
      "statusCode": "200",
      "status": "Success",
      "message": "vehicle owners Found",
      "responseData": null
    }
  }

  tempOwnerVehicles: any = {
    "gridList": [
      {
        "userId": "c2ce3535-1321-4944-ae12-b8439ded32b1",
        "roleName": "Fleet owner",
        "ownerName": "HAFEDH LUTF ALGAHIM",
        "carName": "FORD TAURUS",
        "vehicleId": 6960,
        "vehicleStatus": "In Active",
        "vin": "2G4WS52J621117060",
        "carImage": "http://209.10.88.76:2025/TLHUB_API_TEST/Images/Car_Image/FORD_TRANSIT.png",
        "perDayPrice": 32,
        "riskRating": 0,
        "ratingAverage": 0,
        "plateNumber": null,
        "totalCount": 2,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Review Pending",
        "statusCode": 1,
      },
      {
        "userId": "c2ce3535-1321-4944-ae12-b8439ded32b1",
        "roleName": "Fleet owner",
        "ownerName": "HAFEDH LUTF ALGAHIM",
        "carName": "ACURA INTEGRA",
        "vehicleId": 6905,
        "vehicleStatus": "Booked",
        "vin": "JH4DB1550MS003978",
        "carImage": "http://209.10.88.76:2025/TLHUB_API_TEST/Images/Car_Image/NO_IMAGE.png",
        "perDayPrice": 55,
        "riskRating": 3.5,
        "ratingAverage": 0,
        "plateNumber": "23451",
        "totalCount": 2,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Decline",
        "statusCode": 4,
      },
      {
        "userId": "c2ce3535-1321-4944-ae12-b8439ded32b1",
        "roleName": "Fleet owner",
        "ownerName": "HAFEDH LUTF ALGAHIM",
        "carName": "TOYOTA TACOMA",
        "vehicleId": 6960,
        "vehicleStatus": "In Active",
        "vin": "2G4WS52J621117060",
        "carImage": "http://209.10.88.76:2025/TLHUB_API_TEST/Images/Car_Image/TOYOTA_CAMRY_HYBRID.png",
        "perDayPrice": 32,
        "riskRating": 0,
        "ratingAverage": 0,
        "plateNumber": null,
        "totalCount": 2,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Revert Back",
        "statusCode": 3,
      },
      {
        "userId": "c2ce3535-1321-4944-ae12-b8439ded32b1",
        "roleName": "Fleet owner",
        "ownerName": "HAFEDH LUTF ALGAHIM",
        "carName": "ACURA INTEGRA",
        "vehicleId": 6905,
        "vehicleStatus": "Booked",
        "vin": "JH4DB1550MS003978",
        "carImage": "http://209.10.88.76:2025/TLHUB_API_TEST/Images/Car_Image/NO_IMAGE.png",
        "perDayPrice": 55,
        "riskRating": 3.5,
        "ratingAverage": 0,
        "plateNumber": "23451",
        "totalCount": 2,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Approved",
        "statusCode": 2,
      }
    ],
    "filterList": null,
    "viewModel": {
      "pageHeading": "All vehicle owners",
      "totalCount": 2
    },
    "response": {
      "statusCode": "200",
      "status": "Success",
      "message": "Owner's vehicles Found",
      "responseData": null
    }
  }

  tempKyc: any = {
    "gridList": [
      {
        "userId": "18bc92f2-1b64-41f9-8725-9f2dfaa36c08",
        "id": "18bc92f2-1b64-41f9-8725-9f2dfaa36c08",
        "userName": "HAFEDH LUTF ALGAHIM",
        "profilePath": null,
        "rolename": "Fleet owner",
        "licenseNumber": "XXXXX0001",
        "kycStatus": "Completed",
        "firstName": "HAFEDH",
        "middleName": "LUTF",
        "lastName": "ALGAHIM",
        "emailId": "bharath.g.2312@gmail.com",
        "phoneNumber": "9876543456",
        "address": "GOLDENCARS  Schenectady NEW YORK 12345 UNITED STATES",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Review Pending",
        "statusCode": 1,
      },
      {
        "userId": "e3c8468f-502d-469d-85e2-6f83403b675b",
        "id": "e3c8468f-502d-469d-85e2-6f83403b675b",
        "userName": "Haran  KR",
        "profilePath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260212_044651.png",
        "rolename": "Driver",
        "licenseNumber": "XXXXX0002",
        "kycStatus": "Completed",
        "firstName": "Haran",
        "middleName": null,
        "lastName": "KR",
        "emailId": "jamom13739@flemist.com",
        "phoneNumber": "3233223333",
        "address": "Raqa  FLORAL PARK NEW YORK 11001 UNITED STATES",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Decline",
        "statusCode": 4,
      },
      {
        "userId": "097abf4f-32fd-4e54-a679-cdcec6c7fdfe",
        "id": "097abf4f-32fd-4e54-a679-cdcec6c7fdfe",
        "userName": "Naveen  ",
        "profilePath": null,
        "rolename": "Driver with owned car",
        "licenseNumber": null,
        "kycStatus": "KYC Pending",
        "firstName": "Naveen",
        "middleName": null,
        "lastName": "",
        "emailId": "nipop57735@desiys.com",
        "phoneNumber": null,
        "address": "     ",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Revert Back",
        "statusCode": 3,
      },
      {
        "userId": "5491287e-57ad-4910-a88c-39d015bc7127",
        "id": "5491287e-57ad-4910-a88c-39d015bc7127",
        "userName": "Kiran  R.P",
        "profilePath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260212_043605.png",
        "rolename": "Driver",
        "licenseNumber": "XXXXX0001",
        "kycStatus": "Completed",
        "firstName": "Kiran",
        "middleName": null,
        "lastName": "R.P",
        "emailId": "ginom64055@desiys.com",
        "phoneNumber": "3232322222",
        "address": "G.N grden  FLORAL PARK NEW YORK 11001 UNITED STATES",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Approved",
        "statusCode": 2,
      },
      {
        "userId": "5a24ed0a-d0bc-45d2-a074-119817b936f2",
        "id": "5a24ed0a-d0bc-45d2-a074-119817b936f2",
        "userName": "Driver  ",
        "profilePath": null,
        "rolename": "Driver",
        "licenseNumber": null,
        "kycStatus": "KYC Pending",
        "firstName": "Driver",
        "middleName": null,
        "lastName": "",
        "emailId": "driver1@gmail.com",
        "phoneNumber": null,
        "address": "     ",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Approved",
        "statusCode": 2,
      },
      {
        "userId": "6e200e4a-256f-4141-9f35-211a31ec89c6",
        "id": "6e200e4a-256f-4141-9f35-211a31ec89c6",
        "userName": "HAFEDH LUTF ALGAHIM",
        "profilePath": null,
        "rolename": "Fleet owner",
        "licenseNumber": "XXXXX0001",
        "kycStatus": "Completed",
        "firstName": "HAFEDH",
        "middleName": "LUTF",
        "lastName": "ALGAHIM",
        "emailId": "nayobo1921@desiys.com",
        "phoneNumber": "4432233444",
        "address": "173 BUFFALO AVE FL 3  BROOKLYN NEW YORK 11213 UNITED STATES",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Revert Back",
        "statusCode": 3,
      },
      {
        "userId": "dc13af0d-f000-48ad-8cf5-a0b9a12f2cea",
        "id": "dc13af0d-f000-48ad-8cf5-a0b9a12f2cea",
        "userName": "kireetidrivere  ",
        "profilePath": null,
        "rolename": "Driver",
        "licenseNumber": null,
        "kycStatus": "KYC Pending",
        "firstName": "kireetidrivere",
        "middleName": null,
        "lastName": "",
        "emailId": "kireetidriver2@gmail.com",
        "phoneNumber": null,
        "address": "     ",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Decline",
        "statusCode": 4,
      },
      {
        "userId": "d0e86e9d-052e-4dec-be33-4e1cfad89176",
        "id": "d0e86e9d-052e-4dec-be33-4e1cfad89176",
        "userName": "kireeti  ",
        "profilePath": null,
        "rolename": "Driver with owned car",
        "licenseNumber": null,
        "kycStatus": "KYC Pending",
        "firstName": "kireeti",
        "middleName": null,
        "lastName": "",
        "emailId": "kireetidriver@gmail.com",
        "phoneNumber": null,
        "address": "     ",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Approved",
        "statusCode": 2,
      },
      {
        "userId": "34a98ec3-a7a1-4a6b-b6b3-42d2a4ff4c48",
        "id": "34a98ec3-a7a1-4a6b-b6b3-42d2a4ff4c48",
        "userName": "bharath LUTF ALGAHIM",
        "profilePath": "http://209.10.88.76:2025/TLHUB_API_TEST/Documents/UploadedDocuments/DOC_20260212_021920.png",
        "rolename": "Driver",
        "licenseNumber": "XXXXX0001",
        "kycStatus": "Completed",
        "firstName": "bharath",
        "middleName": "LUTF",
        "lastName": "ALGAHIM",
        "emailId": "bharath23yadav@gmail.com",
        "phoneNumber": "5343434343",
        "address": "173 BUFFALO AVE FL 3  Brooklyn NEW YORK 11213 UNITED STATES",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Revert Back",
        "statusCode": 3,
      },
      {
        "userId": "40805954-3074-418e-a99b-315cc110af9a",
        "id": "40805954-3074-418e-a99b-315cc110af9a",
        "userName": "THANKGOD O AMEDU",
        "profilePath": null,
        "rolename": "Fleet owner",
        "licenseNumber": "XXXXX0004",
        "kycStatus": "Completed",
        "firstName": "THANKGOD",
        "middleName": "O",
        "lastName": "AMEDU",
        "emailId": "kireeticompany@gmail.com",
        "phoneNumber": "4324532344",
        "address": "New York  Schenectady NEW YORK 12345 UNITED STATES",
        "totalCount": 26,
        "categoryName": null,
        "subCategoryName": null,
        "createdDate": "11-06-2025 05:14:53",
        "status": "Decline",
        "statusCode": 4,
      }
    ],
    "filterList": null,
    "viewModel": {
      "pageHeading": "All KYC",
      "totalCount": 26
    },
    "response": {
      "statusCode": "200",
      "status": "Success",
      "message": "Users Found",
      "responseData": null
    }
  }

  tempTabs: any = [
    {
      "menuID": 57,
      "menuName": "ALL KYC",
      "menuUrl": "/user/payments",
      "parentMenuId": 36,
      "isParentMenuId": 0,
      "sortPriority": 1,
      "name": "All KYC",
      "actionName": null,
      "controllerName": null,
      "menuIcon": null,
      "menuClass": null,
      "isActive": true,
      "carrierId": 1,
      "systemId": "tlcHubAuthApp",
      "createdBy": "Ashish",
      "createdDate": "11-06-2025 05:14:53",
      "modifiedBy": "Ashish",
      "modifiedDate": "11-06-2025 05:14:53"
    },
    {
      "menuID": 58,
      "menuName": "DRIVER",
      "menuUrl": "/user/payments",
      "parentMenuId": 36,
      "isParentMenuId": 0,
      "sortPriority": 2,
      "name": "Driver",
      "actionName": null,
      "controllerName": null,
      "menuIcon": null,
      "menuClass": null,
      "isActive": true,
      "carrierId": 1,
      "systemId": "tlcHubAuthApp",
      "createdBy": "Ashish",
      "createdDate": "11-06-2025 05:14:53",
      "modifiedBy": "Ashish",
      "modifiedDate": "11-06-2025 05:14:53"
    },
    {
      "menuID": 61,
      "menuName": "INDIVIDUAL CAR OWNER",
      "menuUrl": "/user/payments",
      "parentMenuId": 36,
      "isParentMenuId": 0,
      "sortPriority": 4,
      "name": "Car Owner",
      "actionName": null,
      "controllerName": null,
      "menuIcon": null,
      "menuClass": null,
      "isActive": true,
      "carrierId": 1,
      "systemId": "tlcHubAuthApp",
      "createdBy": "Ashish",
      "createdDate": "11-06-2025 05:14:53",
      "modifiedBy": "Ashish",
      "modifiedDate": "11-06-2025 05:14:53"
    },
    {
      "menuID": 60,
      "menuName": "FLEET OWNER",
      "menuUrl": "/user/payments",
      "parentMenuId": 36,
      "isParentMenuId": 0,
      "sortPriority": 4,
      "name": "Fleet owner",
      "actionName": null,
      "controllerName": null,
      "menuIcon": null,
      "menuClass": null,
      "isActive": true,
      "carrierId": 1,
      "systemId": "tlcHubAuthApp",
      "createdBy": "Ashish",
      "createdDate": "11-06-2025 05:14:53",
      "modifiedBy": "Ashish",
      "modifiedDate": "11-06-2025 05:14:53"
    },
    {
      "menuID": 59,
      "menuName": "DRIVER WITH OWNED CAR",
      "menuUrl": "/user/payments",
      "parentMenuId": 36,
      "isParentMenuId": 0,
      "sortPriority": 3,
      "name": "Driver with owned vehicle",
      "actionName": null,
      "controllerName": null,
      "menuIcon": null,
      "menuClass": null,
      "isActive": true,
      "carrierId": 1,
      "systemId": "tlcHubAuthApp",
      "createdBy": "Ashish",
      "createdDate": "11-06-2025 05:14:53",
      "modifiedBy": "Ashish",
      "modifiedDate": "11-06-2025 05:14:53"
    },
    {
      "menuID": 62,
      "menuName": "VENDOR",
      "menuUrl": "/user/payments",
      "parentMenuId": 36,
      "isParentMenuId": 0,
      "sortPriority": 5,
      "name": "Vendor",
      "actionName": null,
      "controllerName": null,
      "menuIcon": null,
      "menuClass": null,
      "isActive": true,
      "carrierId": 1,
      "systemId": "tlcHubAuthApp",
      "createdBy": "Ashish",
      "createdDate": "11-06-2025 05:14:53",
      "modifiedBy": "Ashish",
      "modifiedDate": "11-06-2025 05:14:53"
    },
    {
      "menuID": 62,
      "menuName": "VEHICLE",
      "menuUrl": "/user/payments",
      "parentMenuId": 36,
      "isParentMenuId": 0,
      "sortPriority": 5,
      "name": "Vehicles",
      "actionName": null,
      "controllerName": null,
      "menuIcon": null,
      "menuClass": null,
      "isActive": true,
      "carrierId": 1,
      "systemId": "tlcHubAuthApp",
      "createdBy": "Ashish",
      "createdDate": "11-06-2025 05:14:53",
      "modifiedBy": "Ashish",
      "modifiedDate": "11-06-2025 05:14:53"
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adminService: AdminService,
    public cabService: CabService,
    public gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,
    private datePipe: DatePipe,
    private excelExport: ExcelExportService,
    public roleService: RolePermissionService,
    private bookingService: BookingService,
    private settingsService: SettingsService,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    // this.roleService.getButtons("AUSR");
    roleService.permissions['AUSEARCH'] = {
      "StateCode": null,
      "CarierID": null,
      "PolicyType": null,
      "LOB": null,
      "SubLOB": null,
      "Code": "AUSEARCH",
      "Name": "SEARCH",
      "TransactionCode": "AUSR",
      "Roles": "A49F58D3-D878-4438-9579-FB7AF3B29A87",
      "Class": null,
      "ActionIcon": null,
      "ActionType": null,
      "Priority": 1,
      "IsActive": true
    };
    roleService.permissions['AUEXP'] = {
      "StateCode": null,
      "CarierID": null,
      "PolicyType": null,
      "LOB": null,
      "SubLOB": null,
      "Code": "AUEXP",
      "Name": "EXPORT",
      "TransactionCode": "AUSR",
      "Roles": "A49F58D3-D878-4438-9579-FB7AF3B29A87",
      "Class": null,
      "ActionIcon": null,
      "ActionType": null,
      "Priority": 2,
      "IsActive": true
    }
    this.route.queryParams.subscribe((params) => {
      this.getGridTabsDetails(params);
      this.getFilterParameters();
    })
  }

  getTableData() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "userType": JSON.stringify([this.activeTab]),
      "userStatus": this.searchFilter.status == 'All Status' ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
      "type": this.selectedFilter,
    }
    this.gs.isSpinnerShow = true;
    this.adminService.GetAllUsers(body).subscribe((response1: any) => {
      this.tableData = [];
      this.gs.isSpinnerShow = false;
      const response: any = this.tempKyc;
      if (response.response && response.response.statusCode == "200") {
        this.tableData = response.gridList;
        this.totalData = response.viewModel?.totalCount || 0;

        if (this.activeTab === 'VEHICLE') {
          this.getVehiclesData();
        }

        // this.tabs = response.filterList ? JSON.parse(response.filterList) : [];
      } else {
        this.toast.errorToastr(response.message);
      }
    });
  }

  getFilterParameters() {
    const body = {
      menuId: "36",
      type: "Users",
    }
    this.bookingService.GetFilterParameters(body).subscribe(async (response: any) => {
      this.filterTypes = response || [];
    }, (err: any) => {
      console.log(err?.error?.message || "Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  getGridTabsDetails(params: any) {
    const body = {
      roleId: this.gs.loggedInUserInfo.roleName,
      menuId: "36",
    }
    this.gs.isSpinnerShow = true;
    this.roleService.GetGridTabsDetails(body).subscribe(async (response: any) => {
      // this.tabs = response || [];
      this.tabs = this.tempTabs;
      console.log("this.tabs >>>", this.tabs);
      this.activeTab = params['activeTab'] ? params['activeTab'] : this.tabs[0].menuName;
      this.activeTabName = this.tabs.find((m: any) => m.menuName === this.activeTab)?.name || '';
      this.getTableData();
    }, (err: any) => {
      console.log(err?.error?.message || "Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  getVehiclesData() {
    this.tempVehicles.gridList[0].isOpen = true;
    this.tableData = this.tempVehicles.gridList;
    this.totalData = this.tempVehicles.viewModel?.totalCount || 0;
    this.tableDataSecond = this.tempOwnerVehicles.gridList;
    this.totalDataSecond = this.tempOwnerVehicles.viewModel?.totalCount || 0;
  }

  selectStatus() {
    this.getTableData();
  }

  selectBranch() {
    this.getTableData();
  }


  changeBookTab(item: any) {
    this.activeTab = item.menuName;
    this.activeTabName = item.name;

    this.dateTimeRange = "";
    this.selectedFilter = null;
    this.searchDataValue = "";
    this.searchFilter.status = 'All Status';

    this.currentPage = 1;
    let params = {
      activeTab: this.activeTab,
      status: this.searchFilter.status
    }
    this.getTableData();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.getTableData();
  }

  pageChangedSecond(event: any, section: any) {
    this.currentPageSecond = event;

    // this.getOwnerVehicles(section.userId);
  }

  onSort(column: any) {
    this.sortColumn = column;
    this.sortOrder = this.sortOrder === "DESC" ? "ASC" : "DESC";
    this.getTableData();
  }

  searchData() {
    this.currentPage = 1;
    this.getTableData();
  }

  checkKyc(data: any, index: any) {
    this.isApproval = true;
    this.actionIndex = index;
    window.scrollTo({ top: 510, behavior: 'smooth' });
  }
  cancelApproval() {
    this.isApproval = false;
    window.scrollTo({ top: 510, behavior: 'smooth' });
  }

  onConfirm(event: any) {
    console.log("event >>>", event);
    const statusInfo: any = {
      "Review Pending": 1,
      "Decline": 4,
      "Revert Back": 3,
      "Approved": 2,
    };

    this.isApproval = false;
    if (this.activeTab === 'VEHICLE') {
      this.tableDataSecond[this.actionIndex].statusCode = statusInfo[event.status];
      this.tableDataSecond[this.actionIndex].status = event.status;
    } else {
      this.tableData[this.actionIndex].statusCode = statusInfo[event.status];
      this.tableData[this.actionIndex].status = event.status;
    }
    window.scrollTo({ top: 510, behavior: 'smooth' });
  }

  onToggle(value: any, section: any) {
    section.isOpen = value;
    this.currentPageSecond = 1;
    // if (section.isOpen) {
    //   this.getOwnerVehicles(section.userId);
    // }
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  exportToExcel() {
    const { startDate, endDate } = this.gs.normalizeDateRange(this.dateTimeRange[0], this.dateTimeRange[1]);
    const body = {
      "globalSearch": this.searchDataValue?.trim() || "",
      "userType": JSON.stringify([this.activeTab]),
      "status": this.searchFilter.status == 'All Status' ? null : JSON.stringify([this.searchFilter.status]),
      "startDate": startDate,
      "endDate": endDate,
      "type": this.selectedFilter,
    }
    this.excelExport.exportToExcelPost(body, 'ExportAllUsersToExcel').subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      let tableData = JSON.parse(response);
      let finalData: any = [];
      const style = {
        border: {
          top: { style: "medium" },
          left: { style: "medium" },
          bottom: { style: "medium" },
          right: { style: "medium" }
        },
        alignment: { vertical: 'middle', horizontal: 'left', wrapText: true }
      }
      const kycStatus: any = {
        "KYC Pending": "FF0000",
        "Completed": "1FBC2F"
      }
      const status: any = {
        "InActive": "FF9307", // danger
        "Active": "1FBC2F", // success
      }
      for (let i in tableData) {
        finalData.push({
          "SL": {
            ...style,
            value: Number(i) + 1,
          },
          "User Name": {
            ...style,
            value: tableData[i].userName || '-',
          },
          "User Type": {
            ...style,
            value: tableData[i].rolename || '-',
          },
          "License Number": {
            ...style,
            value: tableData[i].licenseNumber || '-',
          },
          "KYC status": {
            ...style,
            value: tableData[i].kycStatus || '-',
            font: { bold: true, color: { argb: kycStatus[tableData[i].kycStatus] } },
          },
          "Email": {
            ...style,
            value: tableData[i].emailId || '-',
          },
          "Phone Number": {
            ...style,
            value: tableData[i].phoneNumber || '-',
          },
          "Category Name": {
            ...style,
            value: tableData[i].categoryName || '-',
          },
          "Sub Category": {
            ...style,
            value: tableData[i].subCategoryName || '-',
          },
          "Status": {
            ...style,
            value: tableData[i].status || '-',
            font: { bold: true, color: { argb: status[tableData[i].status] } },
          },
        });

        if (this.activeTab == 'Vendor') {
          delete finalData[i]['User Type'];
          delete finalData[i]['License Number'];
          delete finalData[i]['KYC status'];
        }
        if (this.activeTab != 'Vendor') {
          delete finalData[i]['Email'];
          delete finalData[i]['Phone Number'];
          delete finalData[i]['Category Name'];
          delete finalData[i]['Sub Category'];
        }
      }
      let title = this.activeTab + ' - ' + this.searchFilter.status;
      this.excelExport.exportToExcelCustom(finalData, "Users", title);

    });
  }

}
