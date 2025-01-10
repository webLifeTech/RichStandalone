<!-- 1111111111111 -->


<!-- updateForeignDriverInfo -->
issue :  I have not this fields for updateForeignDriverInfo
{
  "fdCity": "sample string 10",
  "fdCityCd": "sample string 11",
  "postalCode": "sample string 12",
  "doYouWantToGetQuotesFromTLH": true,
  "doYouHaveInsurance": "sample string 18",
  "doYouHaveInsuranceCd": true
}



<!-- updateDriverKycOtherInfo -->
Issue  : UserId or DriverId or OthersId is invalid
http://209.10.88.76:2022/TLHUB_API/TLHUB/KYC/updateDriverKycOtherInfo

{
  "userId": "99ea64c3-17b4-4bb4-bcbc-c9ed65708ff5",
  "driverId": 368,
  "otherInfo": {
    "othersId": 262,
    "insuranceType": "Auto",
    "insuranceTypeCd": 839,
    "companyName": "TATA AIA LIFE INSURANCE",
    "companyNameCd": 843,
    "otherCompanyName": "",
    "policynumber": "111111111111",
    "policyIssueDate": "01/01/2031",
    "policyExpiryDate": "01/30/2031"
}
}
















<!-- 2222222222222 -->
Issue in http://209.10.88.76:2022/TLHUB_API/TLHUB/VIN/GetVinQuery?vinNumber=1XP5DB9X2YN532871


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

<!-- 555555555555555555 -->


<!-- 666666666666666 -->
Update driver not working proper
