<!-- 666666666666 -->
 Car Owner Info Update missing


<!-- 666666666666 -->
 MY VEHICLE details not coming proper


<!-- 444444444444444444 -->
carriersNameCd and grossvehicleWeight missing in insertAndUpdateVehicleKYC

<!-- 555555555555555555 -->
Add conditionValue in vahicle upload

http://209.10.88.76:2022/TLHUB_API/TLHUB/ConfigUI/GetConfigUIFields
{
  "clientID": null,
  "stateCode": 42,
  "languageId": 1,
  "roleName": "E56F8C18-B4F6-4EE4-976D-A693AA6F98FF",
  "countryId": 230,
  "transactionId": 1,
  "formName": "VEHICLE UPLOAD",
  "menuId": 27
}
Individualcarowner

<!-- 1111111111111 -->
-> Issue : driveInCity not coming
"http://209.10.88.76:2022/TLHUB_API/TLHUB/KYC/InsertAndUpdateDriverKYC?userID=d837179a-44cd-4fec-b45e-bb16bf572966"

{
    "driverInfo": {
      "profilePicturePath": "http://209.10.88.76:2022/TLHUB_API/Documents/UploadedDocuments/DOC_20250102_000337.jpg",
      "driverLicenseState": "NEW YORK",
      "driverLicenseStateCd": 42,
      "driverLicenseNumber": "000000001",
      "licenseDocumentUploadPath": "http://209.10.88.76:2022/TLHUB_API/Documents/UploadedDocuments/DOC_20250102_000339.pdf",
      "firstName": "HAFEDH",
      "middleName": "LUTF",
      "lastName": "ALGAHIM",
      "prefix": "Mr",
      "prefixCd": "13A2E7E5-161E-49A8-9DFF-8DB591FDA8BF",
      "suffix": "2ND",
      "suffixCd": "B7A4A8FC-F9E0-438C-B74A-472C1B01673D",
      "dateOfBirth": "07/03/1972",
      "driverLicenseEffectiveDate": "01/01/2025",
      "driverLicenseExpirationDate": "01/22/2025",
      "isForeignDriverLicense": "Yes",
      "isForeignDriverLicenseCd": "True",
      "foreignDriverLicenseNum": "2432432",
      "issueDate": "01/01/2025",
      "expireDate": "01/16/2025",
      "foreignDriverDocumentPath": "",
      "postalCode": "11001",
      "fdCity": "FLORAL PARK",
      "county": "NASSAU",
      "fdCountry": "UNITED STATES",
      "fdCountryCd": 230,
      "fdState": "NEW YORK",
      "fdStateCd": 42,
      "contactId": 297,
      "driverId": 0
    },
    "tlcLicenseInfo": {
      "tlcLicenseNumber": "42423423",
      "tlcLicenseDocumentPath": "http://209.10.88.76:2022/TLHUB_API/Documents/UploadedDocuments/DOC_20250102_000422.pdf",
      "tlcFirstName": "paras",
      "tlcLastName": "M",
      "licenseState": "NEW YORK",
      "licenseStateCd": 42,
      "tlcLicenseEffectiveDate": "01/14/2025",
      "tlcLicenseExpirationDate": "01/24/2025"
    },
    "personalInfo": {
      "gender": "Male",
      "genderCd": "",
      "ssn": "23432434",
      "creditScore": "Good ",
      "creditScoreCd": "836",
      "maritalStatus": "Married",
      "maritalStatusCd": "1F6F56DC-65C7-4181-8130-8221195DC18D",
      "numberOfChildren": "432432423",
      "contactNumber": "34534534534",
      "emailId": "paras@gmail.com",
      "emergencyContactNumber": "34534543534",
      "emergencyContactPersonName": "paras",
      "relationType": "Daughter",
      "relationTypeCd": "833",
      "location": "paras"
    },
    "permanentAddress": {
      "address1": "173 BUFFALO AVE FL 3",
      "address2": "surat",
      "postalCode": "11001",
      "city": "FLORAL PARK",
      "county": "NASSAU",
      "country": "UNITED STATES",
      "countryCd": 230,
      "state": "NEW YORK",
      "stateCd": 42,
      "isPrimaryAddress": true
    },
    "mailingAddress": {
      "address1": "173 BUFFALO AVE FL 3",
      "address2": "surat",
      "postalCode": "11001",
      "city": "FLORAL PARK",
      "state": "NEW YORK",
      "stateCd": 42,
      "country": "UNITED STATES",
      "countryCd": 230,
      "isPrimaryAddress": true
    },
    "billingAddress": {
      "address1": "173 BUFFALO AVE FL 3",
      "address2": "surat",
      "postalCode": "11001",
      "city": "FLORAL PARK",
      "state": "NEW YORK",
      "stateCd": 42,
      "country": "UNITED STATES",
      "countryCd": 230,
      "isPrimaryAddress": true
    },
    "otherInfo": [
      {
        "insuranceType": "Home",
        "insuranceTypeCd": "840",
        "companyName": "TATA AIA LIFE INSURANCE",
        "companyNameCd": "843",
        "otherCompanyName": "",
        "policynumber": "4354534534",
        "policyIssueDate": "01/01/2025",
        "policyExpiryDate": "01/23/2025"
      }
    ],
    "driveInCity": 53
}


"http://209.10.88.76:2022/TLHUB_API/TLHUB/KYC/getDriverDetails?userId=d837179a-44cd-4fec-b45e-bb16bf572966"


<!-- 2222222222222 -->
http://209.10.88.76:2022/TLHUB_API/Help/Api/POST-TLHUB-KYC-insertAndUpdateVehicleKYC_userId

-> Issue : can you check vehicleInfo, vehicleInspectionDetails, vehicleInsuranceDetails, vehicleOtherDetails
in this many "fields" and  "Cd" missing that's we have showing in form 


<!-- 333333333333333333 -->
-> Issue : getDriverDetails Error
http://209.10.88.76:2022/TLHUB_API/TLHUB/KYC/getDriverDetails?userId=f438ebd8-a2d3-4cc6-addf-2d29aff084d7

{
    "Message": "An error has occurred.",
    "ExceptionMessage": "The parameter at index 7 in the parameters array is null.",
    "ExceptionType": "System.InvalidOperationException",
    "StackTrace": "   at System.Data.Entity.Core.Objects.ObjectContext.CreateEntityCommandForFunctionImport(String functionName, EdmFunction& functionImport, ObjectParameter[] parameters)\r\n   at System.Data.Entity.Core.Objects.ObjectContext.ExecuteFunction(String functionName, ObjectParameter[] parameters)\r\n   at TLHUBLibrary.DataLayer.TLHUBEntities.USP_INSERT_APP_ERROR_LOG(Nullable`1 errorDate, String errorLibrary, String errorSource, String errorMessage, String remoteHostName, String remoteHostAddress, String createdBy, ObjectParameter rESPONSEMESSAGE, ObjectParameter rESPONSESTATUS) in D:\\MAYA2.0_BITBUCKET\\TLHUB\\API\\TLHUBLibrary\\DataLayer\\TLHUB.Context.cs:line 183\r\n   at TLHUBLibrary.Controller.Concrete.KYC.KYCRepository.GetDriverDetails(String userId) in D:\\MAYA2.0_BITBUCKET\\TLHUB\\API\\TLHUBLibrary\\Controller\\Concrete\\KYC\\KYCRepository.cs:line 115\r\n   at TLCHUB_WEB_API.Controllers.KYC.KYCController.GetDriverDetails(String userId) in D:\\MAYA2.0_BITBUCKET\\TLHUB\\API\\TLCHUB_WEB_API\\Controllers\\KYC\\KYCController.cs:line 38\r\n   at lambda_method(Closure , Object , Object[] )\r\n   at System.Web.Http.Controllers.ReflectedHttpActionDescriptor.ActionExecutor.<>c__DisplayClass6_2.<GetExecutor>b__2(Object instance, Object[] methodParameters)\r\n   at System.Web.Http.Controllers.ReflectedHttpActionDescriptor.ExecuteAsync(HttpControllerContext controllerContext, IDictionary`2 arguments, CancellationToken cancellationToken)\r\n--- End of stack trace from previous location where exception was thrown ---\r\n   at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()\r\n   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)\r\n   at System.Web.Http.Controllers.ApiControllerActionInvoker.<InvokeActionAsyncCore>d__1.MoveNext()\r\n--- End of stack trace from previous location where exception was thrown ---\r\n   at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()\r\n   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)\r\n   at System.Web.Http.Controllers.ActionFilterResult.<ExecuteAsync>d__5.MoveNext()\r\n--- End of stack trace from previous location where exception was thrown ---\r\n   at System.Runtime.ExceptionServices.ExceptionDispatchInfo.Throw()\r\n   at System.Runtime.CompilerServices.TaskAwaiter.HandleNonSuccessAndDebuggerNotification(Task task)\r\n   at System.Web.Http.Dispatcher.HttpControllerDispatcher.<SendAsync>d__15.MoveNext()"
}

