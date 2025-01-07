<!-- 1111111111111 -->
-> Issue : driveInCity Still not coming
GET : "http://209.10.88.76:2022/TLHUB_API/TLHUB/KYC/getDriverDetails?userId=dce35052-51e8-4091-bada-b1d7108d6bf8"

SAVE : "http://209.10.88.76:2022/TLHUB_API/TLHUB/KYC/InsertAndUpdateDriverKYC?userID=d837179a-44cd-4fec-b45e-bb16bf572966"

{
    "driverInfo": {
        "profilePicturePath": "http://209.10.88.76:2022/TLHUB_API/Documents/UploadedDocuments/DOC_20250104_043916.jpg",
        "driverLicenseState": "NEW YORK",
        "driverLicenseStateCd": 42,
        "driverLicenseNumber": "000000001",
        "licenseDocumentUploadPath": "http://209.10.88.76:2022/TLHUB_API/Documents/UploadedDocuments/DOC_20250104_043910.pdf",
        "firstName": "HAFEDH",
        "middleName": "LUTF",
        "lastName": "ALGAHIM",
        "prefix": "Mr",
        "prefixCd": "13A2E7E5-161E-49A8-9DFF-8DB591FDA8BF",
        "suffix": "2ND",
        "suffixCd": "B7A4A8FC-F9E0-438C-B74A-472C1B01673D",
        "dateOfBirth": "07/03/1972",
        "driverLicenseEffectiveDate": "01/01/2025",
        "driverLicenseExpirationDate": "01/28/2025",
        "isForeignDriverLicense": "Yes",
        "isForeignDriverLicenseCd": "True",
        "foreignDriverLicenseNum": "42342342",
        "issueDate": "01/01/2025",
        "expireDate": "01/17/2025",
        "foreignDriverDocumentPath": "",
        "postalCode": "11001",
        "fdCity": "FLORAL PARK",
        "county": "NASSAU",
        "fdCountry": "UNITED STATES",
        "fdCountryCd": 230,
        "fdState": "NEW YORK",
        "fdStateCd": 42,
        "contactId": 10023,
        "driverId": 0
    },
    "personalInfo": {
        "emailId": "paras@gmail.com",
        "ssn": "33333333",
        "gender": "Male",
        "genderCd": "Male",
        "maritalStatus": "Married",
        "maritalStatusCd": "1F6F56DC-65C7-4181-8130-8221195DC18D",
        "numberOfChildren": "3",
        "contactNumber": "5555555555",
        "emergencyContactNumber": "242342342",
        "emergencyContactPersonName": "paras",
        "relationType": "Father",
        "relationTypeCd": "830"
    },
    "permanentAddress": {
        "address1": "173 BUFFALO AVE FL 3",
        "address2": "ddd",
        "postalCode": "11213",
        "city": "BROOKLYN",
        "country": "UNITED STATES",
        "countryCd": "",
        "state": "NEW YORK",
        "stateCd": 230,
        "isPrimaryAddress": true
    },
    "mailingAddress": {
        "address1": "173 BUFFALO AVE FL 3",
        "address2": "ddd",
        "postalCode": "11213",
        "city": "BROOKLYN",
        "country": "UNITED STATES",
        "countryCd": "",
        "state": "NEW YORK",
        "stateCd": 230,
        "isPrimaryAddress": true
    },
    "billingAddress": {
        "address1": "173 BUFFALO AVE FL 3",
        "address2": "ddd",
        "postalCode": "11213",
        "city": "BROOKLYN",
        "country": "UNITED STATES",
        "countryCd": "",
        "state": "NEW YORK",
        "stateCd": 230,
        "isPrimaryAddress": true
    },
    "otherInfo": [
        {
            "insuranceType": "Life",
            "insuranceTypeCd": "841",
            "companyName": "TATA AIA LIFE INSURANCE",
            "companyNameCd": "843",
            "otherCompanyName": "",
            "policynumber": "44444444444",
            "policyIssueDate": "01/01/2025",
            "policyExpiryDate": "01/22/2025"
        }
    ],
    "driveInCity": 42
}


<!-- 2222222222222 -->

Issue : i have upload only one vehicle but there showing many vehicle. that is issue in :

in Driverwithownedcar and individual car owner

http://209.10.88.76:2022/TLHUB_API/TLHUB/KYC/getVehicleDetails?userId=d837179a-44cd-4fec-b45e-bb16bf572966


<!-- 333333333333333333 -->

Issue : many details are missing in getVehicleDetails

---------- GET -------
http://209.10.88.76:2022/TLHUB_API/TLHUB/KYC/getVehicleDetails?userId=d837179a-44cd-4fec-b45e-bb16bf572966

---------- SAVE -------
http://209.10.88.76:2022/TLHUB_API/TLHUB/KYC/insertAndUpdateVehicleKYC?userID=d837179a-44cd-4fec-b45e-bb16bf572966

{
  "vehicleInfo": {
    "vinNumber": "444444444",
    "vinDocumentUpload": "http://209.10.88.76:2022/TLHUB_API/Documents/UploadedDocuments/DOC_20250104_074233.pdf",
    "plateNumber": "2323323",
    "modelYear": "2014",
    "vehicleAge": "10",
    "make": "LUCID",
    "makeCd": 161,
    "model": "AIR",
    "modelCd": 575,
    "grossvehicleWeight": "0-10,000",
    "grossvehicleWeightCd": 1,
    "seatingCapacity": "4",
    "registrationState": "NEW JERSEY",
    "registrationStateCd": 43,
    "garageZipCode": "11001",
    "territoryCode": "Floral Park",
    "territoryCodeCd": 465,
    "fuelType": "CNG",
    "fuelTypeCd": 187,
    "dashboardCamera": "Yes",
    "dashboardCameraCd": 177,
    "collisionAvoidance": "Yes",
    "collisionAvoidanceCd": 177,
    "transmission": "Automatic",
    "transmissionCd": 200,
    "carCategory": "Church Bus",
    "carCategoryCd": 78,
    "userId": "d837179a-44cd-4fec-b45e-bb16bf572966",
    "vehicleId": 0
  },
  "vehicleInspectionDetails": {
    "isInspectionReportAvailable": "",
    "isReportInitiatedFromTLH": "",
    "validDate": "01/14/2025",
    "uploadInspectionReport": "http://209.10.88.76:2022/TLHUB_API/Documents/UploadedDocuments/DOC_20250104_074328.pdf"
  },
  "vehicleInsuranceDetails": {
    "isInsuranceCovered": "",
    "isInsuranceNotCoveredLookingForQuote": "",
    "carriersName": "Maya1",
    "carriersNameCd": 181,
    "policyNumber": "23423423",
    "limitsAndCoverage": "4",
    "coverageExpireDate": "01/01/2025",
    "coverageEffectiveDate": "01/30/2025"
  },
  "vehicleOtherDetails": {
    "carImageUpload": "http://209.10.88.76:2022/TLHUB_API/Documents/UploadedDocuments/DOC_20250104_074349.jpg",
    "pricePerDay": "10",
    "pricePerWeek": "30",
    "pricePerMonth": "400",
    "vehicleStatus": "Active",
    "vehicleStatusCd": 196
  },
  "driveInCity": 42
}

<!-- 444444444444444444 -->
carriersNameCd and grossvehicleWeight missing in insertAndUpdateVehicleKYC

<!-- 555555555555555555 -->
Issue : Update Buttons missing in Individualcarowner -> CAR OWNER INFO
need to add it

http://209.10.88.76:2022/TLHUB_API/TLHUB/ConfigUI/GetConfigUIFields
{
    "clientID": null,
    "stateCode": 42,
    "languageId": 1,
    "roleName": "E56F8C18-B4F6-4EE4-976D-A693AA6F98FF",
    "countryId": 230,
    "transactionId": 3,
    "formName": "CAR OWNER INFO",
    "menuId": 27
}


<!-- 666666666666666 -->
Update driver not working proper
