import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbAccordionModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, FormsModule, FormArray, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../shared/services/toast.service';
import { ProfileService } from '../../../../shared/services/profile.service';
import { MatSelectModule } from '@angular/material/select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { DeleteModalComponent } from '../../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { NgxMaskDirective, provideNgxMask, NgxMaskPipe } from 'ngx-mask';
import { TermsAndCModalComponent } from '../../../../shared/components/comman/modal/t-and-c-modal/t-and-c-modal.component';
import { BranchService } from '../../../../shared/services/branch.service';
import { ConfirmationModalComponent } from '../../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';
import { VendorServService } from '../../../../shared/services/vendor-service.service';


@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    // InputTypeTextComponent,
    CommonModule,
    NgSelectModule,
    MatExpansionModule,
    MatSelectModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatMenuModule,
    MatButtonModule,
    NgxMaskDirective,
  ],
  providers: [
    DatePipe,
    // GlobalService,
    provideNgxMask()
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  @Input() selectedTabObj: any = {};
  @Input() singleDetailInfo: any = {};
  @Input() isEditInfo: any;
  @Input() kycForm: any = {};
  @Input() formType: any = "";
  @Input() formArray: any[] = []; // Input data from API
  @Output() onHandleSubmit = new EventEmitter<any>();
  @Output() onVehicleUploadSubmit = new EventEmitter<any>();
  @Output() onDivInfoSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  todayDate: any = new Date();
  items = ['First', 'Second', 'Third'];

  formGroup: FormGroup;
  groupedFields: { [key: string]: any[] } = {}; // Group fields by sectionName
  dynamicForm: FormGroup;
  submitted: boolean = false;
  masterDropdwonList: any = [];
  configMasterDp: any = [];
  isTableVisible: boolean = false;
  isTableEdit: boolean = false;
  isTableEditIndex: any = 0;
  mvrDriverDetailsRes: any = {};

  customPatterns = {
    '0': { pattern: new RegExp('[X-X0-9]') }  // Define the pattern for 0 (alphanumeric)
  };

  isAgreeTerms: boolean = false;
  isRequiredTermsAgree: boolean = true;
  profileUrl: any = "";
  workingHours: any = [];
  isPrivateBooking: boolean = false; //

  constructor(
    private fb: FormBuilder,
    public gs: GlobalService,
    private toast: ToastService,
    private profileService: ProfileService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private branchService: BranchService,
    private vendorServ: VendorServService,
  ) {
    this.dynamicForm = this.fb.group({
      sections: this.fb.array([])
    });
  }

  ngOnInit() {
    console.log("singleDetailInfo >>>>>>", this.singleDetailInfo);
    console.log("this.formType >>>>>>", this.formType);
    this.getConfigUIFields();
    this.gs.isModificationOn = true;
    if (this.formType === 'branch' || this.formType === 'vendor-profile') {
      this.isRequiredTermsAgree = false;
    }
    if (this.formType === 'driver_details') {
      this.workingHours = this.singleDetailInfo.driverDetailsRequest.driverWorkingHours;
      this.isRequiredTermsAgree = false;
    }
    if (this.formType === 'vendor-profile') {
      this.workingHours = this.singleDetailInfo.providerRequest.workingHours;
    }
  }


  editWorkingHours(item: any) {
    item.isEdit = true;
    item.fromTime = this.gs.convertTo24Hour(item.fromTime);
    item.toTime = this.gs.convertTo24Hour(item.toTime);
  }
  saveWorkingHours(item: any) {
    item.isEdit = false;
    item.fromTime = this.gs.convertTo12Hour(item.fromTime);
    item.toTime = this.gs.convertTo12Hour(item.toTime);
  }

  // Get Config UI Fields
  getConfigUIFields() {
    this.gs.isSpinnerShow = true;
    let transactionId = 1;
    if (this.isEditInfo) {
      transactionId = 3
    }
    let body = {
      "clientID": null,
      "stateCode": this.kycForm.state,
      "languageId": 1,
      "roleName": this.selectedTabObj.roleName,// You can change this role from above role id
      "countryId": 230,
      "transactionId": transactionId,
      "formName": this.selectedTabObj.formName,//THis is name you have send form names
      "menuId": this.kycForm?.menuId || 27
    }
    this.profileService.getConfigUIFields(body).subscribe(async (response: any) => {
      this.formArray = response;
      if (this.selectedTabObj.formName == "VEHICLE DETAILS") {
        this.formArray = [...this.formArray, ...[
          { // first
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_SHIFT",
            "fieldId": 1001,
            "fieldType": "DROPDOWN",
            "sectionID": 100,
            "fieldName": "CANCELLATION TIME",
            "description": "CANCELLATION TIME",
            "modalValue": "cancellationTime",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 1,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": "CANCELLATION_TIME",
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": null,
            "conditionValue": null,
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": null,
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": "cancellationTimeCd",
            "relatedFields": null
          },
          {
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_INSU_FEE_INCLUDE",
            "fieldId": 1002,
            "fieldType": "DROPDOWN",
            "sectionID": 100,
            "fieldName": "CANCELLATION TYPE",
            "description": "CANCELLATION TYPE",
            "modalValue": "cancellationType",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 2,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": "CANCELLATION_TYPE",
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": null,
            "conditionValue": null,
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": "Percentage",
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": "cancellationTypeCd",
            "relatedFields": null
          },
          {
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_INSU_FEE",
            "fieldId": 1003,
            "fieldType": "TEXT",
            "sectionID": 100,
            "fieldName": "AMOUNT",
            "description": "AMOUNT",
            "modalValue": "insuranceFee",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 3,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": null,
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": 1002,
            "conditionValue": "Fixed", // "Percentage" "Fixed"
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": null,
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": null,
            "relatedFields": null
          },
          {
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_INSU_FEE",
            "fieldId": 1004,
            "fieldType": "TEXT",
            "sectionID": 100,
            "fieldName": "PERCENTAGE",
            "description": "PERCENTAGE",
            "modalValue": "insuranceFee",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 3,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": null,
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": 1002,
            "conditionValue": "Percentage", // "Percentage" "Fixed"
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": null,
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": null,
            "relatedFields": null
          },
          { // second
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_SHIFT",
            "fieldId": 1005,
            "fieldType": "DROPDOWN",
            "sectionID": 100,
            "fieldName": "CANCELLATION TIME",
            "description": "CANCELLATION TIME",
            "modalValue": "cancellationTime",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 4,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": "CANCELLATION_TIME",
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": null,
            "conditionValue": null,
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": null,
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": "cancellationTimeCd",
            "relatedFields": null
          },
          {
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_INSU_FEE_INCLUDE",
            "fieldId": 1006,
            "fieldType": "DROPDOWN",
            "sectionID": 100,
            "fieldName": "CANCELLATION TYPE",
            "description": "CANCELLATION TYPE",
            "modalValue": "cancellationType",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 5,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": "CANCELLATION_TYPE",
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": null,
            "conditionValue": null,
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": "Percentage",
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": "cancellationTypeCd",
            "relatedFields": null
          },
          {
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_INSU_FEE",
            "fieldId": 1007,
            "fieldType": "TEXT",
            "sectionID": 100,
            "fieldName": "AMOUNT",
            "description": "AMOUNT",
            "modalValue": "insuranceFee",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 6,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": null,
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": 1006,
            "conditionValue": "Fixed", // "Percentage" "Fixed"
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": null,
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": null,
            "relatedFields": null
          },
          {
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_INSU_FEE",
            "fieldId": 1008,
            "fieldType": "TEXT",
            "sectionID": 100,
            "fieldName": "PERCENTAGE",
            "description": "PERCENTAGE",
            "modalValue": "insuranceFee",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 6,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": null,
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": 1006,
            "conditionValue": "Percentage", // "Percentage" "Fixed"
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": null,
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": null,
            "relatedFields": null
          },
          { // third
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_SHIFT",
            "fieldId": 1009,
            "fieldType": "DROPDOWN",
            "sectionID": 100,
            "fieldName": "CANCELLATION TIME",
            "description": "CANCELLATION TIME",
            "modalValue": "cancellationTime",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 7,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": "CANCELLATION_TIME",
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": null,
            "conditionValue": null,
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": null,
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": "cancellationTimeCd",
            "relatedFields": null
          },
          {
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_INSU_FEE_INCLUDE",
            "fieldId": 1010,
            "fieldType": "DROPDOWN",
            "sectionID": 100,
            "fieldName": "CANCELLATION TYPE",
            "description": "CANCELLATION TYPE",
            "modalValue": "cancellationType",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 8,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": "CANCELLATION_TYPE",
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": null,
            "conditionValue": null,
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": "Percentage",
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": "cancellationTypeCd",
            "relatedFields": null
          },
          {
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_INSU_FEE",
            "fieldId": 1011,
            "fieldType": "TEXT",
            "sectionID": 100,
            "fieldName": "AMOUNT",
            "description": "AMOUNT",
            "modalValue": "insuranceFee",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 9,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": null,
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": 1010,
            "conditionValue": "Fixed", // "Percentage" "Fixed"
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": null,
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": null,
            "relatedFields": null
          },
          {
            "languageId": "1",
            "formId": 14,
            "formName": "VEHICLE DETAILS",
            "fieldCode": "FLD_VIN_OTH_INSU_FEE",
            "fieldId": 1012,
            "fieldType": "TEXT",
            "sectionID": 100,
            "fieldName": "PERCENTAGE",
            "description": "PERCENTAGE",
            "modalValue": "insuranceFee",
            "sectionName": "REFUND POLICY",
            "fieldOrder": 9,
            "isVisible": true,
            "isMandatory": false,
            "transactionId": 2,
            "isReadOnly": false,
            "validationType": "",
            "roles": null,
            "isActive": false,
            "dropdownValues": null,
            "modalObject": "vehicleOtherDetails",
            "dependentFields": null,
            "condition": 1010,
            "conditionValue": "Percentage", // "Percentage" "Fixed"
            "fieldClass": "col-lg-4 col-md-4",
            "defaultValue": null,
            "staticValue": null,
            "selectUnique": false,
            "action": null,
            "modalValueCode": null,
            "relatedFields": null
          },
        ]];
      }

      console.log("this.formArray >>>>>", this.formArray);

      this.configMasterDp = await this.profileService.getConfigMasterDropDown();

      if (response && response.length) {
        for (let i in this.formArray) {
          this.formArray[i].isOpen = false;

          if (this.formArray[i].fieldType == "ARRAY") {
            this.formArray[i].isMandatory = false;
          }
          // if (this.formArray[i].fieldId == 222) {
          //   this.formArray[i].selectUnique = true;
          // }
          // if (this.formArray[i].fieldId == 156) {
          //   this.formArray[i].defaultValue = null;
          // }

          this.formArray[i].fValue = this.getFieldValue(this.singleDetailInfo, this.formArray[i].modalObject, this.formArray[i].modalValue);
          this.formArray[i].fValueCode = this.getFieldValue(this.singleDetailInfo, this.formArray[i].modalObject, this.formArray[i].modalValueCode);


          if (this.formArray[i].fieldType === 'LOGO' || this.formArray[i].fieldType === 'SELECTION') {
            this.formArray[i].acceptedTypes = this.getAcceptUploadTypes(this.formArray[i].validationType);
          }

          for (let mdItem in this.configMasterDp) {
            if (this.configMasterDp[mdItem].fieldID === this.formArray[i].fieldId) {
              if (this.configMasterDp[mdItem].dropDownClass === "1") {
                this.configMasterDp[mdItem].isVisible = true;
              } else {
                this.configMasterDp[mdItem].isVisible = false;
              }

              if (!this.formArray[i].apiDropdownList) {
                this.formArray[i].apiDropdownList = [];
              }
              this.formArray[i].apiDropdownList.push(this.configMasterDp[mdItem]);
            }
          }
        }
        if (this.formType !== 'vehicleUpload') {
          this.getMasterPolicyCodes();
        }
        if (this.formType === 'vehicleUpload') {
          this.getMasterVehicleCodes();
        }
      } else {
        this.gs.isSpinnerShow = false;
        this.toast.errorToastr("Something went wrong");
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err || "Something went wrong");
    })
  }


  getFieldValue(obj: any, path: string, key: string): any {
    try {
      const value = path
        .split('.')
        .reduce((acc, curr) => acc && acc[curr], obj);
      return Array.isArray(value) ? value[0]?.[key] : value?.[key];
    } catch (error) {
      return null;
    }
  }

  resolveNestedValue(path: string, obj: any): any {
    const keys = path.split('.');

    return keys.reduce((acc, key) => {
      if (Array.isArray(acc)) {
        const match = key.match(/(\w+)\[(\d+)\]/);
        if (match) {
          const index = parseInt(match[3], 10); // e.g., 0
          return acc.find((item, idx) => idx === index) || null;
        }
      }
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  // Get All Dropdwon List
  getMasterPolicyCodes() {
    let todayDate = new Date();
    const effectiveDate = this.transformDate(todayDate, 'MM/dd/yy');

    let body = {
      "stateCode": this.kycForm.state || "42",
      "typeCode": null,
      "effectiveDate": effectiveDate,
    }

    this.profileService.getMasterPolicyCodes(body).subscribe((res: any) => {
      if (res && res.length) {
        this.masterDropdwonList = this.groupBy(res, 'TypeCode');
        console.log("masterDropdwonList >>>>", this.masterDropdwonList);

        this.createForm();
      } else {
        this.gs.isSpinnerShow = false;
        this.toast.errorToastr("Something went wrong");
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err || "Something went wrong");
    })
  }

  // Get All Dropdwon List
  getMasterVehicleCodes() {
    let todayDate = new Date();
    const effectiveDate = this.transformDate(todayDate, 'MM/dd/yy');

    let body = {
      "stateCode": this.kycForm.state || "42",
      "typeCode": null,
      "effectiveDate": effectiveDate,
    }
    this.profileService.getMasterVehicleCodes(body).subscribe((res: any) => {
      if (res && res.length) {


        this.masterDropdwonList = this.groupBy(res, 'TypeCode');
        console.log("getMasterVehicleCodes >>>>", this.masterDropdwonList);

        this.masterDropdwonList["CANCELLATION_TIME"] = [
          {
            "ID": "222",
            "StateCode": 0,
            "Code": "Before 12 Hours",
            "Type": 26,
            "TypeCode": "cancellationTime",
            "Name": "Before 12 Hours",
            "Description": "Before 12 Hours",
            "IsActive": true
          },
          {
            "ID": "220",
            "StateCode": 0,
            "Code": "Before 24 Hours",
            "Type": 26,
            "TypeCode": "SHIFT_STATUS",
            "Name": "Before 24 Hours",
            "Description": "Before 24 Hours",
            "IsActive": true
          },
          {
            "ID": "221",
            "StateCode": 0,
            "Code": "Before 48 Hours",
            "Type": 26,
            "TypeCode": "SHIFT_STATUS",
            "Name": "Before 48 Hours",
            "Description": "Before 48 Hours",
            "IsActive": true
          },

        ]


        this.masterDropdwonList["CANCELLATION_TYPE"] = [
          {
            "ID": "2222",
            "StateCode": 0,
            "Code": "Percentage",
            "Type": 26,
            "TypeCode": "cancellationType",
            "Name": "Percentage",
            "Description": "Percentage",
            "IsActive": true
          },
          {
            "ID": "2223",
            "StateCode": 0,
            "Code": "Fixed",
            "Type": 26,
            "TypeCode": "cancellationType",
            "Name": "Fixed",
            "Description": "Fixed",
            "IsActive": true
          }
        ]

        this.createForm();
      } else {
        this.gs.isSpinnerShow = false;
        this.toast.errorToastr("Something went wrong");
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err || "Something went wrong");
    })
  }

  // Get Countries
  fetchMasterCountriesList() {
    let body = {
      "Code": "",
    }
    this.profileService.getMasterCountriesList(body).subscribe((res: any) => {
      if (res && res.length) {
        this.updateCountryDropdownList(res);
      } else {
        this.toast.errorToastr("Something went wrong");
      }
    }, (err: any) => {
      this.toast.errorToastr(err || "Something went wrong");
    })
  }

  // Get Countries // addresses, emails, phoneNumbers
  async getAndSetMasterTypeIds() {
    const effectiveDate = this.transformDate(this.todayDate, 'MM/dd/yy');

    let addressTypes: any = await this.profileService.getMasterTypeIds({
      "stateCode": this.kycForm.state || "42",
      "typeCode": 11,
      "effectiveDate": effectiveDate,
    });
    let emailTypes: any = await this.profileService.getMasterTypeIds({
      "stateCode": this.kycForm.state || "42",
      "typeCode": 12,
      "effectiveDate": effectiveDate,
    });
    let phoneTypes: any = await this.profileService.getMasterTypeIds({
      "stateCode": this.kycForm.state || "42",
      "typeCode": 13,
      "effectiveDate": effectiveDate,
    });

    const phoneTYP = this.formType === 'vendor-profile' ? "Cell" : "Home"

    let addressTypeIds = addressTypes.find((sItem: any) => sItem.Name == "Home") || {};
    let emailTypeIds = emailTypes.find((sItem: any) => sItem.Name == "Personal") || {};
    let phoneTypeIds = phoneTypes.find((sItem: any) => sItem.Name == phoneTYP) || {}; // Cell


    this.sections.controls.forEach((section: any) => {
      const fieldsArray = section.get('fields') as FormArray;
      fieldsArray.controls.forEach((field: any) => {
        if (field.get('fieldName').value == 'EMAIL ID') {
          field.addControl("MasterTypeIds", new FormControl(emailTypeIds));
        }
        if (field.get('fieldName').value == 'CONTACT NUMBER') {
          field.addControl("MasterTypeIds", new FormControl(phoneTypeIds));
        }
        if (field.get('fieldName').value == 'ADDRESS 1') {
          field.addControl("MasterTypeIds", new FormControl(addressTypeIds));
        }
      });
    });
  }

  // Get Master States List
  drivLicnStateDropdownList() {
    let body = {
      "CountryCode": "230",
      "Code": "",
    }
    this.profileService.getMasterStatesList(body).subscribe((res: any) => {
      if (res && res.length) {
        const statesArray = res;
        this.sections.controls.forEach((section: any) => {
          const fieldsArray = section.get('fields') as FormArray;
          fieldsArray.controls.forEach((field: any) => {
            // For 'DRIVER LICENSE STATE' and 'LICENSE STATE'
            if (this.formType !== 'vehicleUpload') {
              if (field.get('fieldId').value === 2 || field.get('fieldId').value === 52 || field.get('fieldId').value === 98 || field.get('fieldId').value === 73 || (this.isEditInfo && field.get('fieldName').value === "STATE")) {
                field.get('dropdownList').setValue(statesArray);
              }
            }
            if (this.formType === 'vehicleUpload') {
              if (field.get('fieldId').value === 88) {
                field.get('dropdownList').setValue(statesArray);
              }
            }
          });
        });
      }
    })
  }

  // Get All Dropdwon List
  fetchGetMasterTerritoryZip(zipCode: any) {
    this.gs.isSpinnerShow = true;
    this.profileService.GetMasterTerritoryZip({ zipCode: zipCode }).subscribe((res: any) => {

      // if (res && res.length) {
      const vehicleModelArray = res.map((item: any) => ({ Name: item.ZoneTownName, ...item })) || [];
      this.sections.controls.forEach((section: any) => {
        const fieldsArray = section.get('fields') as FormArray;
        fieldsArray.controls.forEach((field: any) => {
          if (field.get('fieldCode').value === 'FLD_VEH_TERR_CODE') {
            field.get('dropdownList').setValue(vehicleModelArray);
          }
        });
      });
      this.gs.isSpinnerShow = false;
      // } else {
      // }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err || "Something went wrong");
    })
  }

  // Get Countries
  fetchMasterCategoriesList() {
    this.vendorServ.getMasterProviderCategories().subscribe((res: any) => {
      if (res && res.length) {
        this.sections.controls.forEach((section: any) => {
          const fieldsArray = section.get('fields') as FormArray;
          fieldsArray.controls.forEach((field: any) => {
            if (field.get('fieldName').value === 'CATEGORY') {
              field.get('dropdownList').setValue(res);
            }
          });
        });
      } else {
        this.toast.errorToastr("Something went wrong");
      }
    }, (err: any) => {
      this.toast.errorToastr(err || "Something went wrong");
    })
  }

  get sections(): FormArray | any {
    return this.dynamicForm.get('sections') as FormArray;
  }

  createForm() {
    // Group fields by sectionID

    console.log("this.isEditInfo >>>>>>>", this.isEditInfo);
    const groupedSections: any = this.groupBy(this.formArray, 'sectionID');
    Object.keys(groupedSections).forEach((sectionID, index) => {

      const fieldsArray: any = groupedSections[sectionID].sort(
        (a: any, b: any) => a.fieldOrder - b.fieldOrder
      );

      const modalObjectCounts: { [key: string]: number } = {};
      fieldsArray.forEach((item: any) => {
        modalObjectCounts[item.modalObject] = (modalObjectCounts[item.modalObject] || 0) + 1;
      });
      const mostFrequentModalObject = Object.keys(modalObjectCounts).reduce((a, b) =>
        modalObjectCounts[a] > modalObjectCounts[b] ? a : b
      );

      let tableGrid: any = [];
      let tableGridValueList: any = [];
      let loopArray: any = [];

      if (this.singleDetailInfo && this.singleDetailInfo[mostFrequentModalObject] && this.singleDetailInfo[mostFrequentModalObject].length) {
        loopArray = this.singleDetailInfo[mostFrequentModalObject];
      }

      const section: any = this.fb.group({
        sectionID: [sectionID],
        isOpen: [index === 0 ? true : false], // need to do
        isInvalidSection: false,
        sectionName: [fieldsArray[0]?.sectionName || ''],
        modalObject: [fieldsArray[0]?.modalObject || ''],
        tableGrid: [tableGrid], // for table header
        tableGridValueList: [tableGridValueList], // for table value
        loopArray: this.fb.array(loopArray), // for value
        fields: this.fb.array(
          fieldsArray.map((field: any) =>
            this.fb.group({
              fieldName: [field.fieldName],
              fieldCode: [field.fieldCode],
              description: [field.description],
              fieldType: [field.fieldType],
              isVisible: [field.isVisible],
              isActive: [field.isActive],
              isMandatory: [field.isMandatory],
              isReadOnly: [field.isReadOnly],
              modalValue: [field.modalValue],
              valueCode: [field.modalValueCode],
              fieldClass: [field.fieldClass],
              modalObject: [field.modalObject],
              checkUnique: [field.checkUnique],
              dependentFields: [field.dependentFields ? JSON.parse(field.dependentFields) : []],
              lineBreak: [(field.staticValue && typeof field.staticValue === 'string' && field.staticValue?.includes('col-')) ? field.staticValue : field.fieldId == 58 ? "col-md-8" : null],
              selectUnique: [field.selectUnique],
              fieldId: [field.fieldId],
              validationType: [field.validationType],

              staticValue: [field.staticValue],
              condition: [parseInt(field.condition)],
              conditionValue: [field.conditionValue],
              isConditionValid: [(field.condition && field.conditionValue) ? false : true],
              dropdownList: [this.masterDropdwonList[field.dropdownValues] || []],
              apiDropdownList: [field.apiDropdownList || []],
              action: [field.action],
              acceptedTypes: [field.acceptedTypes],
              defaultValue: [field.defaultValue],
              value: [
                field.fieldType === "DATE" ? this.parseDate(this.isEditInfo ? field.fValue : field.defaultValue || null)
                  : (this.isEditInfo ? (field.fValue || field.defaultValue) : field.fieldType === "CHECKBOX" ? JSON.parse(field.defaultValue) : (field.defaultValue || null)), this.getValidators(field)
              ],
              valueCd: [
                field.fieldType === "DROPDOWN" && this.isEditInfo ? field.fValueCode : null
              ]
            })
          )
        )
      });
      this.sections.push(section);
    });


    this.sections.controls.forEach((section: any) => {
      const privFieldsArray = section.get('fields') as FormArray;
      privFieldsArray.controls.forEach((fieldTwo: any) => {

        if (fieldTwo.value.value) {
          if (fieldTwo.value.fieldType === "DROPDOWN") {
            let dataOptions = fieldTwo.value.dropdownList.find((citem: any) => (citem.ID == fieldTwo.value.value || citem.Name == fieldTwo.value.value)) || {};
            if (dataOptions.ID) {
              fieldTwo.get('value')?.setValue(dataOptions.Name);
              this.onChangeDrop(dataOptions, fieldTwo, section)
              if (fieldTwo.get('valueCd')?.value) {
                fieldTwo.get('valueCd')?.setValue(dataOptions.ID);
              } else {
                fieldTwo.addControl("valueCd", new FormControl(dataOptions.ID));
              }
            } else if (fieldTwo.value.fieldId === 323) {
              this.onChangeDrop({
                ID: fieldTwo.value.valueCd,
                Code: fieldTwo.value.value,
                isValue: true
              }, fieldTwo, section)

            }
          }
          if (fieldTwo.value.fieldType === "MULTIDROPDOWN") {
            const valueAry = fieldTwo.value.modalObject.split('.').reduce((acc: any, curr: any) => acc && acc[curr], this.singleDetailInfo);
            let att = valueAry.map((item: any) => item[fieldTwo.value.modalValue]);
            console.log("att >>>>", att);
            fieldTwo.get('value')?.setValue(att);
          }
          if (fieldTwo.value.fieldType === "RADIO") {
            this.onChangeRadio(fieldTwo.value.value, fieldTwo, section)
          }


          if (fieldTwo.get('fieldName').value === "CITY") {
            const county = this.getFieldValue(this.singleDetailInfo, fieldTwo.value.modalObject, "county");
            fieldTwo.addControl("county", new FormControl(county));
          }

          if (fieldTwo.value.fieldType === 'TEXTMASK' && fieldTwo.value.action === 'MASK') {
            this.addMaskLayer(fieldTwo);
          }

          // if (fieldTwo.value.fieldName === 'SSN') {
          //   this.addMaskLayer(fieldTwo);
          // }

          if (fieldTwo.value.fieldId === 1) { //FIELD DRIVER LICENSE NUMBER
            for (let adI in fieldTwo.value.apiDropdownList) {
              if (fieldTwo.value.apiDropdownList[adI].dropDownClass === "1") {
                fieldTwo.value.apiDropdownList[adI].isVisible = false;
              } else {
                fieldTwo.value.apiDropdownList[adI].isVisible = true;
              }
            }
          }
        }

        if (!this.isEditInfo && this.singleDetailInfo.vehicleInfo) {
          if (fieldTwo.value.fieldId === 79) {
            const event = { target: { value: this.singleDetailInfo.vehicleInfo.vinNumber } };
            this.onChangeInput(event, fieldTwo, section)
            // this.addMaskLayer(fieldTwo);
          }
        }

        if (fieldTwo.value.action === "SAVE") {
          this.bindTable(fieldTwo, section);
        }
      });
    });

    console.log("sections >>>>>>>", this.sections);

    this.gs.isSpinnerShow = false;
    this.fetchMasterCountriesList();
    this.drivLicnStateDropdownList();
    this.getAndSetMasterTypeIds();
    this.fetchMasterCategoriesList();
  }

  bindTable(fieldRow: any, section: any) {

    const fields = section.get('fields') as FormArray;
    const loopArray = (section.get('loopArray') as FormArray).value;
    const tempTableGridValueList = loopArray.filter((tRow: any) => tRow.isActive);
    let tableGridTemp: any = [];
    let tableGridBySort: any = [];
    let expiryDate: any = null;
    let tableFields = JSON.parse(JSON.stringify(fieldRow?.value.dependentFields));
    tableFields = tableFields.splice(0, 4);

    fields.controls.forEach((field: any) => {

      if (field.get('modalValue')?.value && fieldRow?.value.dependentFields.indexOf(field.get('fieldId')?.value) !== -1) {
        tableGridTemp.push(field.value);
        if (field.get('fieldType')?.value === "DATE" || field.get('fieldType')?.value === "date") { // Date MM/dd/yyyy
          for (let i in tempTableGridValueList) {
            if (field.get('fieldId')?.value === 155 || field.get('fieldId')?.value === 226) {
              expiryDate = this.parseDate(tempTableGridValueList[i][field.get('modalValue')?.value]);
            }
            if (expiryDate) {
              if (this.todayDate.toISOString() < expiryDate.toISOString()) {
                tempTableGridValueList[i].status = true;
              } else {
                tempTableGridValueList[i].status = false;
              }
            }
          }
        }

        if (field.get('fieldType')?.value === "DROPDOWN") {
          if (field.get('selectUnique')?.value) {
            let dpdOptions = field.value.dropdownList;
            console.log("dpdOptions >>>>>", dpdOptions);

            for (let i in dpdOptions) {
              for (let tgl in tempTableGridValueList) {
                if (tempTableGridValueList[tgl].insuranceType === dpdOptions[i].Name) {
                  dpdOptions[i].disabled = true;
                }
              }
            }
            field.get('dropdownList').setValue(dpdOptions);
          }
        }

        field.get('isVisible')?.setValue(false);
        // reset value
        field.get('value')?.setValue(null);
        field.get('valueCd')?.setValue(null);
        field.get('isConditionValid')?.setValue(false);
      }

      if (field.get('action')?.value === "ADD" || field.get('action')?.value === "Add") {
        field.get('isMandatory')?.setValue(true);
      }
      if (field.get('action')?.value === "SAVE" || field.get('action')?.value === "Save") {
        field.get('isMandatory')?.setValue(false);
      }

      this.isTableVisible = true;
    });

    const statusField = {
      "fieldName": "Status",
      "modalValue": "status",
      "fieldId": 100100
    }
    if (statusField.fieldId) {
      tableGridTemp.push(statusField)
      tableFields.push(statusField.fieldId);
    }

    for (let j in tableFields) {
      for (let i in tableGridTemp) {
        if (tableFields[j] == tableGridTemp[i].fieldId) {
          tableGridBySort.push(tableGridTemp[i]);
        }
      }
    }

    if (loopArray.length) {
      this.isTableEdit = false;
    }

    section.get('tableGrid').setValue(tableGridBySort);
    section.get('tableGridValueList').setValue(tempTableGridValueList);
  }

  groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  }


  // On Change Input
  async onChangeInput(event: any, fieldRow: any, section: any) {

    let fieldsFmArray: any = section.get('fields') as FormArray;
    if (event.target.value.length >= 5 && fieldRow.value.fieldName === 'POSTAL CODE') {

      let body = {
        "postalCode": event.target.value || "",
      }
      this.gs.isSpinnerShow = true;
      this.profileService.getMasterPostalCodes(body).subscribe((cityRes: any) => {
        this.gs.isSpinnerShow = false;
        if (cityRes && cityRes.length) {

          const cityObj = cityRes[0];
          fieldsFmArray.controls.forEach((fieldTwo: any) => {
            if (fieldTwo.get('fieldName').value === "CITY") {
              fieldTwo.get('value').setValue(cityObj.City);
              if (fieldTwo.get('county')?.value) {
                fieldTwo.get('county')?.setValue(cityObj.County);
              } else {
                fieldTwo.addControl("county", new FormControl(cityObj.County));
              }
            }

            if (fieldTwo.get('fieldName').value === "COUNTRY") {
              let countryOptions = fieldTwo.value.dropdownList.find((citem: any) => citem.ID == cityRes[0].CountryCd) || {};
              if (countryOptions.ID) {
                fieldTwo.get('value').setValue(countryOptions.Name);
                fieldTwo.get('valueCd')?.setValue(countryOptions.ID);
              }
              if (this.submitted) {
                this.findInvalidControls();
              }
            }
          });

          let countryBody = {
            "CountryCode": cityRes[0].CountryCd || null,
            "Code": "",
          }
          this.profileService.getMasterStatesList(countryBody).subscribe((res: any) => {
            if (res && res.length) {
              const statesArray = res;
              fieldsFmArray.controls.forEach((fieldTwo: any) => {
                if (fieldTwo.get('fieldName').value === "STATE") {
                  fieldTwo.get('dropdownList').setValue(statesArray);
                  let stateOptions = statesArray.find((sItem: any) => sItem.ID == cityRes[0].StateCd) || {};
                  if (stateOptions.ID) {
                    fieldTwo.get('value').setValue(stateOptions.Name);
                    fieldTwo.get('valueCd')?.setValue(stateOptions.ID);
                  }
                  if (this.submitted) {
                    this.findInvalidControls();
                  }
                }
              });
            }
          })
        }
      }, (err: any) => {
        this.gs.isSpinnerShow = false;
      })
    }

    if (event.target.value.length >= 5 && fieldRow.value.fieldId === 90) {
      this.fetchGetMasterTerritoryZip(fieldRow.value.value);
    }


    if (event.target.value.length === 4 && fieldRow.value.fieldId === 82) {
      fieldsFmArray.controls.forEach((fieldTwo: any) => {
        if (fieldTwo.value.fieldId === 83) {
          const currentYear = new Date().getFullYear();
          const vehicleAge = currentYear - fieldRow.value.value;
          fieldTwo.get('value').setValue(vehicleAge);
          if (this.submitted) {
            this.findInvalidControls();
          }
        }
      });
    }

    if (event.target.value.length === 17 && fieldRow.value.fieldId === 79) {

      this.profileService.checkDriverVehicleExist({
        riskType: 'Vehicle',
        vin: event.target.value,
        licenseNumber: null
      }).subscribe((existRes: any) => {
        console.log("existRes >>>>>", existRes);

        if (existRes && existRes.statusCode !== '200') {
          if (fieldRow.value.value) {
            this.toast.errorToastr(existRes.message);
          }
          fieldRow.get('value').setValue("");
          return;
        }

        let dataParams = {
          "userId": this.gs.loggedInUserInfo.userId,
          "vinNumber": event.target.value, // "KMUMADTB9NU073089"
        }
        this.profileService.getVinQuery(dataParams).subscribe((res: any) => {
          if (res && res.responseDtos && res.responseDtos.statusCode == "200") {
            let resObj = res.vinMasterResponseDtos;

            const autoFillObj: any = {
              "vinNumber": "vin",
              "make": "make",
              "model": "model",
              "modelYear": "modelYear",
              "seatingCapacity": "numberofSeats",
              "fuelType": "fuelTypePrimary"
            }

            this.sections.controls.forEach((sectionMain: any) => {
              const fieldsArray = sectionMain.get('fields') as FormArray;
              fieldsArray.controls.forEach((fieldTwo: any) => {
                if (autoFillObj && autoFillObj[fieldTwo.value.modalValue] && resObj[autoFillObj[fieldTwo.value.modalValue]]) {
                  if (fieldTwo.value.fieldType === "DATE" || fieldTwo.value.fieldType === "date") { // Date MM/dd/yyyy
                    fieldTwo.get('value')?.setValue(this.parseDate(resObj[autoFillObj[fieldTwo.value.modalValue]]));
                  } else {
                    fieldTwo.get('value')?.setValue(resObj[autoFillObj[fieldTwo.value.modalValue]]);
                  }

                  if (fieldTwo.value.fieldId === 82) {

                    const vModelIndex = this.findControlIndexByFieldId(fieldsFmArray, 83);
                    if (vModelIndex !== -1) {
                      const makeField: any = fieldsFmArray.at(vModelIndex);
                      const currentYear = new Date().getFullYear();
                      const vehicleAge = currentYear - fieldTwo.value.value;
                      makeField.get('value')?.setValue(vehicleAge);
                    }
                  }

                  if (fieldTwo.value.fieldType === "DROPDOWN") {
                    let dataOptions = fieldTwo.value.dropdownList.find((citem: any) => (citem.Name.toLowerCase() == fieldTwo.value.value.toLowerCase())) || {};

                    if (dataOptions.ID) {
                      fieldTwo.get('value')?.setValue(dataOptions.Name);
                      this.onChangeDrop(dataOptions, fieldTwo, section);
                    }
                  }
                }
              });
            });
          }
        })
      })

    }

    if (fieldRow.value.fieldName === 'SSN') {
      const rawValue = fieldRow.value?.value?.replace(/\D/g, ''); // Remove non-digits
      if (rawValue.length == 9) {
        fieldRow.get('valueCd')?.setValue(rawValue);
        fieldRow.get('value')?.setValue(
          `XXX-XX-${rawValue.slice(-4)}`,
          { emitEvent: false }
        );
      }
    }
    if (fieldRow.value.fieldName === 'TAX ID') {
      const rawValue = fieldRow.value?.value?.replace(/\D/g, ''); // Remove non-digits
      console.log("rawValue.length >>>>>", rawValue.length);

      if (rawValue.length == 9) {
        fieldRow.get('valueCd')?.setValue(rawValue);
        fieldRow.get('value')?.setValue(
          `XX-XXX${rawValue.slice(-4)}`,
          { emitEvent: false }
        );
      }
    }


    if (this.submitted) {
      this.findInvalidControls();
    }
  }

  addMaskLayer(fieldRow: any) { // will use later
    const rawValue = fieldRow.value?.value?.replace(/\D/g, ''); // Remove non-digits

    if (rawValue.length == 9) {
      fieldRow.get('valueCd')?.setValue(rawValue);
      if (fieldRow.value.fieldName === 'SSN') {
        fieldRow.get('value')?.setValue(
          `XXX-XX-${rawValue.slice(-4)}`,
          { emitEvent: false }
        );
      }
      if (fieldRow.value.fieldName === 'TAX ID') {
        fieldRow.get('value')?.setValue(
          `XX-XXX${rawValue.slice(-4)}`,
          { emitEvent: false }
        );
      }
    }
  }

  // On Select Menu
  onCallDpField(dpItem: any, field: any, section: any) {

    if (!field.value.value) {
      this.toast.errorToastr("Please enter " + field.value.fieldName);
      return;
    }

    console.log("dpItem >>>>>>>", dpItem);

    if (dpItem.action === "DRIVER") {
      if (dpItem.dropDownCode === "GET_MVR") { // for "GET_MVR"

        if (!field.value.dependentFields || !field.value.dependentFields?.length) {
          this.toast.errorToastr("Invalid State");
          return;
        }

        let fieldsFmArray = section.get('fields') as FormArray;
        const stateIndex = this.findControlIndexByFieldId(fieldsFmArray, field.value.dependentFields[0]);
        if (stateIndex === -1 || !fieldsFmArray.value[stateIndex].value) {
          this.toast.errorToastr("Please enter " + fieldsFmArray.value[stateIndex].fieldName);
          return;
        }

        let selectedState = fieldsFmArray.value[stateIndex].dropdownList.find((sItem: any) => sItem.ID == fieldsFmArray.value[stateIndex].valueCd) || {};

        let dataParams = {
          "licenseNo": field.value.value,
          "state": selectedState.Code,
          "userId": this.gs.loggedInUserInfo.userId,
        }
        this.gs.isSpinnerShow = true;
        this.profileService.getMVRDetails(dataParams).subscribe((res: any) => {
          console.log("res.mvrDriverDetails >>>>>", res.mvrDriverDetails);
          this.gs.isSpinnerShow = false;
          if (res && res.responseMessage && !res.responseMessage.status) {
            this.toast.errorToastr(res.responseMessage.message);
            return;
          }
          if (res && res.mvrDriverDetails) {
            this.mvrDriverDetailsRes = res.mvrDriverDetails;

            this.mvrDriverDetailsRes.country = 230;

            for (let adI in field.value.apiDropdownList) {
              if (field.value.apiDropdownList[adI].dropDownClass === "1") {
                // field.value.apiDropdownList[adI].isVisible = false; // TLH-557
              } else {
                field.value.apiDropdownList[adI].isVisible = true;
              }
            }
            const autoFillObj: any = {
              4: "firstName",
              5: "middleName",
              6: "lastName",
              8: "nameSuffix",
              9: "dReference",
              13: "genderCd",
              15: "maritalStatusCd",
              48: "tLCLicenseNo",
              53: "tLCEffectiveDt",
              54: "tLCExpirationDt",
              21: "address1",
              22: "address2",
              23: "zipcode",
              24: "city",
              10: "licenseissuedate",
              11: "expiration",

              100: "firstName",
              101: "middleName",
              102: "lastName",
              104: "nameSuffix",
              105: "dReference",
              111: "genderCd",
              113: "maritalStatusCd",
              119: "address1",
              120: "address2",
              121: "zipcode",
              122: "city",
              106: "licenseissuedate",
              107: "expiration",

              64: "firstName",
              65: "middleName",
              66: "lastName",
              68: "nameSuffix",
              74: "licenseissuedate",
              75: "expiration",
            }

            this.sections.controls.forEach((sectionMain: any) => {
              const fieldsArray = sectionMain.get('fields') as FormArray;
              fieldsArray.controls.forEach((fieldRow: any) => {
                if (autoFillObj[fieldRow.value.fieldId]) {
                  if (fieldRow.value.fieldType === "DATE" || fieldRow.value.fieldType === "date") { // Date MM/dd/yyyy
                    fieldRow.get('value')?.setValue(this.parseDate(this.mvrDriverDetailsRes[autoFillObj[fieldRow.value.fieldId]]));
                  } else {
                    fieldRow.get('value')?.setValue(this.mvrDriverDetailsRes[autoFillObj[fieldRow.value.fieldId]]);
                  }

                  if (fieldRow.value.fieldType === "DROPDOWN") {
                    let dpObj = fieldRow.value.dropdownList.find((sItem: any) => sItem.Name == this.mvrDriverDetailsRes[autoFillObj[fieldRow.value.fieldId]]) || {};
                    fieldRow.get('valueCd')?.setValue(dpObj.ID);
                  }
                }

                const checkCountryIncl = [157, 190];
                if (checkCountryIncl.includes(fieldRow.value.fieldId)) {
                  let countryOptions = fieldRow.value.dropdownList.find((sItem: any) => sItem.ID == this.mvrDriverDetailsRes.country) || {};

                  fieldRow.get('value')?.setValue(countryOptions.Name);
                  fieldRow.get('valueCd')?.setValue(countryOptions.ID);

                  let body = {
                    "CountryCode": this.mvrDriverDetailsRes.country || "", // "11001"
                    "Code": "",
                  }
                  this.profileService.getMasterStatesList(body).subscribe((res: any) => {
                    if (res && res.length) {
                      const statesArray = res;
                      let stateOptions = statesArray.find((sItem: any) => sItem.ID == this.mvrDriverDetailsRes.stateCd) || {};
                      if (stateOptions.ID) {
                        const stateIndex = this.findControlIndex(fieldsArray, 'STATE');
                        if (stateIndex !== -1) {
                          const statusField: any = fieldsArray.at(stateIndex);

                          statusField.get('value')?.setValue(stateOptions.Name);
                          statusField.get('dropdownList')?.setValue(statesArray);
                          if (statusField.get('valueCd')?.value || ('valueCd' in statusField.value)) {
                            statusField.get('valueCd')?.setValue(stateOptions.ID);
                          } else {
                            statusField.addControl("valueCd", new FormControl(stateOptions.ID));
                          }
                        }
                      }
                    }
                  })
                }

                const checkDateIncl = [10, 11, 106, 107, 74, 75];
                if (checkDateIncl.includes(fieldRow.value.fieldId)) {
                  fieldRow.get('value')?.setValue(this.parseDate(this.mvrDriverDetailsRes['mvrLicenseInformation'][autoFillObj[fieldRow.value.fieldId]]));
                }

              });
            });
          }
        }, (err) => {
          this.gs.isSpinnerShow = false;
        })
      }

      if (dpItem.dropDownCode === "VIEW_MVR_DETAILS") { // for "VIEW_MVR_DETAILS"
        window.open(this.mvrDriverDetailsRes?.mvrlog?.requestedURL, "_blank");
      }
    }
  }

  // On Change Dropdwon
  onChangeDrop(event: any, field: any, section: any) {

    if (field.get('valueCd')?.value || ('valueCd' in field.value)) {
      field.get('valueCd')?.setValue(event.ID);
    } else {
      field.addControl("valueCd", new FormControl(event.ID));
    }

    let fieldsFmArray = section.get('fields') as FormArray;

    fieldsFmArray.controls.forEach((fieldTwo: any) => {
      if (fieldTwo?.get('conditionValue')?.value && fieldTwo?.get('condition')?.value) {
        if (fieldTwo.get('condition').value === field.value.fieldId) {
          if (event.Code === fieldTwo.get('conditionValue').value) {
            fieldTwo.get('isConditionValid')?.setValue(true);
          } else {
            if (field.value.fieldId === 56) {
              // no value reset for IS AVAILABLE FOR PRIVATE BOOKING? ->  Driver Details
            } else {
              fieldTwo.get('value')?.setValue(null);
            }
            fieldTwo.get('isConditionValid')?.setValue(false);
          }
        }
      }

      // for unable selectUnique dropdownList
      if (fieldTwo.get('fieldType')?.value === "DROPDOWN") {
        if (fieldTwo.get('selectUnique')?.value) {
          let dpdOptions = fieldTwo.value.dropdownList;
          let tempTableGridValueList = fieldTwo.value.tempTableGridValueList;
          for (let i in dpdOptions) {
            for (let tgl in tempTableGridValueList) {
              if (tempTableGridValueList[tgl].insuranceType === dpdOptions[i].Name) {
                dpdOptions[i].disabled = true;
              }
            }
          }
          // for (let i in dpdOptions) {
          //   dpdOptions[i].disabled = false;
          // }
          fieldTwo.get('dropdownList').setValue(dpdOptions);
        }
      }

      // for oper addNew
      if (fieldTwo.get('fieldType')?.value === 'BUTTON' && fieldTwo.get('isMandatory')?.value && fieldTwo.get('action')?.value === 'ADD') {
        if (!section.value.tableGridValueList.length) {
          this.addNew(section);
        }
      }
    });

    if (field.value.fieldName === 'COUNTRY') {

      let body = {
        "CountryCode": event.ID || "", // "11001"
        "Code": "",
      }
      this.profileService.getMasterStatesList(body).subscribe((res: any) => {
        if (res && res.length) {
          const statesArray = res;
          const stateIndex = this.findControlIndex(fieldsFmArray, 'STATE');
          if (stateIndex !== -1) {
            fieldsFmArray.at(stateIndex).get('dropdownList')?.setValue(statesArray);
          }
        }
      })
    }

    if (field.value.fieldName === 'MAKE') {
      let body = {
        "MakeId": event.ID,
        "description": null,
      }
      this.profileService.getVehicleModelByID(body).subscribe((res: any) => {
        if (res && res.length) {
          const vehicleModelArray = res.map((item: any) => ({ Name: item.Description, ...item }));
          const vModelIndex = this.findControlIndex(fieldsFmArray, 'MODEL');
          if (vModelIndex !== -1) {

            fieldsFmArray.at(vModelIndex).get('dropdownList')?.setValue(vehicleModelArray);
            const makeField: any = fieldsFmArray.at(vModelIndex);
            if (makeField.get('value')?.value) {
              let dataOptions = vehicleModelArray.find((item: any) => (item.Name.toLowerCase() == makeField.get('value')?.value.toLowerCase())) || {};

              if (makeField.get('valueCd')?.value || ('valueCd' in makeField.value)) {
                makeField.get('valueCd')?.setValue(dataOptions.ID);
              } else {
                makeField.addControl("valueCd", new FormControl(dataOptions.ID));
              }
            }
          }
        }
      })
    }

    if (field.value.fieldId === 150) {
      if (field.get('valueCd')?.value == "true") {
        this.isTableVisible = true;
      } else {
        this.isTableVisible = false;
      }
    }

    if (field.value.fieldName === 'CATEGORY') {
      this.vendorServ.getMasterProviderSubCategories({
        categoryId: event.ID
      }).subscribe((res: any) => {
        const statesArray = res;
        const stateIndex = this.findControlIndexByCode(fieldsFmArray, 'FLD_VEN_SUB_CATEGORY');
        if (stateIndex !== -1) {
          fieldsFmArray.at(stateIndex).get('dropdownList')?.setValue(statesArray);
          if (!event.isValue) { // not clear if value on edit
            fieldsFmArray.at(stateIndex).get("value")?.patchValue([])
          }
        }
      })
    }

    if (field.value.fieldId === 56) { //fieldId 56 is "IS AVAILABLE FOR PRIVATE BOOKING?"
      if (field.value.value == "Yes") {
        this.isPrivateBooking = true;
      } else {
        this.isPrivateBooking = false;
      }
    }
    console.log("section >>>>>>", section);

    if (this.submitted) {
      this.findInvalidControls();
    }
  }

  // On Select Checkbox
  onChangeCheckbox(field: any, sectionRow: any) {

    if (field.value.value === true) {
      if (field.value.fieldId === field.value.dependentFields[0]) {
        let currentFieldsFmArray = sectionRow.get('fields') as FormArray;
        this.sections.controls.forEach((section: any) => {
          const privFieldsArray = section.get('fields') as FormArray;

          if (section.get('sectionID')?.value === String(field.value.dependentFields[1])) {
            currentFieldsFmArray.controls.forEach((field: any) => {
              privFieldsArray.controls.forEach((fieldTwo: any) => {
                if (field.get('fieldType').value !== 'CHECKBOX') {

                  if (field.get('modalValue').value && field.get('modalValue').value === fieldTwo.get('modalValue').value) {
                    field.get('value')?.setValue(fieldTwo.get('value')?.value || null);
                    if (field.get('fieldType').value === "DROPDOWN") {
                      if (field.get('valueCd')?.value || ('valueCd' in field.value)) {
                        field.get('valueCd')?.setValue(fieldTwo.get('valueCd')?.value || null);
                      } else {
                        field.addControl("valueCd", new FormControl(fieldTwo.get('valueCd')?.value || null));
                      }
                      field.get('dropdownList')?.setValue(fieldTwo.get('dropdownList')?.value);
                    }
                  }
                }
              });
            });
          }
        });
      }
    } else {
      // section: any, fieldId:any, key:any, value:any
      if (field.value.fieldId == 156 || field.value.fieldId == 227) {
        this.updateValueByFieldId(sectionRow, field.value.fieldId, "value", "")
      }
    }

    if (field.value.fieldName === "primary_address") {
      const exceptFields = [27, 35, 133, 125];
      const checkAllFill = this.findInvalidControlsBySection(sectionRow, exceptFields);
      if (!checkAllFill.valid) {
        this.toast.errorToastr("Please fill all the details of " + sectionRow.value.sectionName);
        field.get('value')?.setValue(false);
        return;
      }
      this.setPrimaryAddress(field);

    }

    if (this.submitted) {
      this.findInvalidControls();
    }
  }

  setPrimaryAddress(currentField: any) {
    if (!currentField.value.value) {
      currentField.get('value')?.setValue(true);
      return;
    }
    this.sections.controls.forEach((section: any) => {
      const fieldsArray = section.get('fields') as FormArray;
      fieldsArray.controls.forEach((fieldTwo: any) => {
        if (fieldTwo.value.fieldType === 'CHECKBOX') {
          if (fieldTwo.value.fieldName === currentField.value.fieldName && fieldTwo.value.fieldId !== currentField.value.fieldId) {
            fieldTwo.get('value')?.setValue(false);
          }
        }
      });
    });
  }

  // On Select Radio
  onChangeRadio(fieldValue: any, field: any, section: any) {

    if (fieldValue && fieldValue.target) {
      field.get('value')?.setValue(fieldValue.target.checked); // on click radio
    } else {
      field.get('value')?.setValue(fieldValue); // on defaultValue create form
    }

    let fieldsFmArray = section.get('fields') as FormArray;
    fieldsFmArray.controls.forEach((fieldTwo: any) => {

      if (fieldTwo.value.fieldId !== field.value.fieldId && fieldTwo.value.fieldName === field.value.fieldName) {
        fieldTwo.get('value')?.setValue(false);
      }
      if (fieldTwo?.get('conditionValue')?.value && fieldTwo?.get('condition')?.value) {
        if (field.value.fieldId === 191 || field.value.fieldId === 196 || field.value.fieldId === 276) {
          if (fieldTwo.get('condition').value == field.value.fieldId) {
            if (fieldTwo.get('conditionValue').value) {
              fieldTwo.get('isConditionValid')?.setValue(true);
            }
          }
        }
        if (field.value.fieldId === 193 || field.value.fieldId === 197 || field.value.fieldId === 277) {
          if (fieldTwo.get('conditionValue').value) {
            fieldTwo.get('isConditionValid')?.setValue(false);
          }
        }
      }

    });


    if (this.submitted) {
      this.findInvalidControls();
    }
  }

  // On Select Date
  onDateSelect() {
    if (this.submitted) {
      this.findInvalidControls();
    }
  }

  // Table Add
  addNew(section: any) {
    const fields = section.get('fields') as FormArray;

    fields.controls.forEach((field: any) => {
      if (field.get('isVisible')?.value === false) {
        field.get('isVisible')?.setValue(true);
        if (field.get('fieldName')?.value !== "OTHER") {
          field.get('isConditionValid')?.setValue(true);
        }
      }

      if (field.get('action')?.value === "ADD" || field.get('action')?.value === "Add") {
        field.get('isMandatory')?.setValue(false);
      }
      if (field.get('action')?.value === "SAVE" || field.get('action')?.value === "Save") {
        field.get('isMandatory')?.setValue(true);
      }
    });

    this.isTableVisible = false;
  }

  // Table Save and Update
  saveSubmit(fieldRow: any, section: any) {
    const exceptFields = [27, 35, 133, 125];
    const checkAllFill = this.findInvalidControlsBySection(section, exceptFields);
    console.log("checkAllFill >>>>>>>", checkAllFill);

    if (!checkAllFill.valid) {
      this.toast.errorToastr("Please fill all the details of " + section.value.sectionName);
      fieldRow.get('value')?.setValue(false);
      return;
    }

    const fields = section.get('fields') as FormArray;
    const loopArray = section.get('loopArray') as FormArray;


    const tempTableGridValueList = section.value?.tableGridValueList;

    let tableFields = JSON.parse(JSON.stringify(fieldRow?.value.dependentFields));
    tableFields = tableFields.splice(0, 4);

    let tableGridTemp: any = [];
    let tableGridBySort: any = [];
    let status: any = false;
    let expiryDate: any = null;
    let sectionData: any = {};
    fields.controls.forEach((field: any) => {

      if (field.get('modalValue')?.value && fieldRow?.value.dependentFields.indexOf(field.get('fieldId')?.value) !== -1) {
        tableGridTemp.push(field.value);
        if (field.get('fieldType')?.value === "DATE" || field.get('fieldType')?.value === "date") { // Date MM/dd/yyyy
          if (field.get('fieldId')?.value === 155 || field.get('fieldId')?.value === 226) {
            expiryDate = new Date(field.get('value')?.value);
          }
          if (expiryDate) {
            if (this.todayDate.toISOString() < expiryDate.toISOString()) {
              status = true;
            } else {
              status = false;
            }
          }
          sectionData[field.get('modalValue')?.value] = this.transformDate(field.get('value')?.value, 'MM/dd/yyyy');;
        } else {
          sectionData[field.get('modalValue')?.value] = (field.get('value')?.value || "");
        }

        if (field.get('county')?.value) { // set county
          sectionData["county"] = field.get('county')?.value || "";
        }
        if (field.get('fieldType')?.value === "DROPDOWN") {
          if (field.get('selectUnique')?.value) {
            let dpdOptions = field.value.dropdownList;
            if (!tempTableGridValueList.length) {
              for (let i in dpdOptions) {
                if (field.get('value')?.value === dpdOptions[i].Name) {
                  dpdOptions[i].disabled = true;
                }
              }
            } else {
              for (let i in dpdOptions) {
                dpdOptions[i].disabled = false;
                for (let tgl in tempTableGridValueList) {
                  if (tempTableGridValueList[tgl].insuranceType === dpdOptions[i].Name || field.get('value')?.value === dpdOptions[i].Name) {
                    dpdOptions[i].disabled = true;
                  }
                }
              }
            }
            field.get('dropdownList').setValue(dpdOptions);
          }
          sectionData[field.get('valueCode')?.value] = field.get('valueCd')?.value || "";
        }
        field.get('isVisible')?.setValue(false);

        // reset value
        field.get('value')?.setValue(null);
        field.get('valueCd')?.setValue(null);
        // field.get('isConditionValid')?.setValue(false);
      }

      if (field.get('action')?.value === "ADD" || field.get('action')?.value === "Add") {
        field.get('isMandatory')?.setValue(true);
      }
      if (field.get('action')?.value === "SAVE" || field.get('action')?.value === "Save") {
        field.get('isMandatory')?.setValue(false);
      }

      this.isTableVisible = true;
    });

    const tempSectionData = JSON.parse(JSON.stringify(sectionData));
    const statusField = {
      "fieldName": "Status",
      "modalValue": "status",
      "fieldId": 100100
    }
    if (statusField.fieldId) {
      tableGridTemp.push(statusField)
      tableFields.push(statusField.fieldId);
      tempSectionData[statusField.modalValue] = status;
    }

    for (let j in tableFields) {
      for (let i in tableGridTemp) {
        if (tableFields[j] == tableGridTemp[i].fieldId) {
          tableGridBySort.push(tableGridTemp[i]);
        }
      }
    }

    if (!this.isTableEdit) {
      sectionData.isActive = true;
      tempTableGridValueList.push(tempSectionData);
      loopArray.push(this.fb.group({ ...sectionData }));
    } else {
      tempTableGridValueList[this.isTableEditIndex] = tempSectionData;
      loopArray.value[this.isTableEditIndex] = { ...loopArray.value[this.isTableEditIndex], ...sectionData };
      section.get('loopArray').setValue(loopArray.value);
      this.isTableEdit = false;
    }

    section.get('tableGrid').setValue(tableGridBySort);
    section.get('tableGridValueList').setValue(tempTableGridValueList);
  }

  // Table Edit
  editTableItem(tgIndex: any, itemValue: any, section: any) {
    const fields = section.get('fields') as FormArray;

    fields.controls.forEach((field: any) => {
      if (field.get('isVisible')?.value === false) {
        field.get('isVisible')?.setValue(true);

        if (field.get('fieldType')?.value === "DATE" || field.get('fieldType')?.value === "date") { // Date MM/dd/yyyy
          field.get('value')?.setValue(this.parseDate(itemValue[field.get('modalValue').value]));
        } else {
          field.get('value')?.setValue(itemValue[field.get('modalValue').value]);
        }

        if (field.get('fieldType')?.value === "DROPDOWN") {
          field.get('valueCd')?.setValue(itemValue[field.get('valueCode').value]);
        }

        if (field.get('fieldName')?.value !== "OTHER" || field.get('value')?.value) {
          field.get('isConditionValid')?.setValue(true);
        }
      }

      if (field.get('action')?.value === "ADD" || field.get('action')?.value === "Add") {
        field.get('isMandatory')?.setValue(false);
      }
      if (field.get('action')?.value === "SAVE" || field.get('action')?.value === "Save") {
        field.get('isMandatory')?.setValue(true);
      }
    });
    this.isTableEdit = true;
    this.isTableVisible = false;
    this.isTableEditIndex = tgIndex;
  }

  // Table From Cancel
  cancelForm(fieldRow: any, section: any) {
    const fields = section.get('fields') as FormArray;

    fields.controls.forEach((field: any) => {
      if (field.get('modalValue')?.value && fieldRow?.value.dependentFields.indexOf(field.get('fieldId')?.value) !== -1) {
        field.get('isVisible')?.setValue(false);
        // reset value
        field.get('value')?.setValue(null);
        field.get('valueCd')?.setValue(null);
        field.get('isConditionValid')?.setValue(false);
      }

      if (field.get('action')?.value === "ADD" || field.get('action')?.value === "Add") {
        field.get('isMandatory')?.setValue(true);
      }
      if (field.get('action')?.value === "SAVE" || field.get('action')?.value === "Save") {
        field.get('isMandatory')?.setValue(false);
      }
      this.isTableVisible = true;
      this.isTableEdit = false;
    });
  }

  // Table Item Delete
  async onDelete(index: any, section: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        const loopArray: any = (section.get('loopArray') as FormArray);
        let tempLoopArray = loopArray.value;
        let tempTableGridValueList: any = (section.get('tableGridValueList') as FormArray);
        const loopIndex = tempLoopArray.findIndex((lItem: any) => lItem.insuranceType === tempTableGridValueList.value[index].insuranceType);
        tempTableGridValueList.value.splice(index, 1);
        // if (this.isEditInfo) {
        if (tempLoopArray[loopIndex]?.othersId) {
          tempLoopArray[loopIndex].isActive = false;
        } else {
          tempLoopArray.splice(loopIndex, 1);
          const fields = section.get('fields') as FormArray;
          fields.controls.forEach((field: any) => {

            if (field.get('fieldType')?.value === "DROPDOWN") {
              if (field.get('selectUnique')?.value) {
                let dpdOptions = field.value.dropdownList;
                console.log("dpdOptions >>>>>", dpdOptions);
                dpdOptions.map((a: any) => a.disabled = false);

                for (let i in dpdOptions) {
                  for (let tgl in tempLoopArray) {
                    if (tempLoopArray[tgl].insuranceType === dpdOptions[i].Name) {
                      dpdOptions[i].disabled = true;
                    }
                  }
                }
                field.get('dropdownList').setValue(dpdOptions);
              }
            }
          });
        }

        console.log("111 tempLoopArray -->", tempLoopArray);

        if (!tempLoopArray.length) {
          section.get('loopArray').clear();
        } else {
          loopArray.clear();
          tempLoopArray.forEach((val: any) => {
            loopArray.push(this.fb.control(val));
          });
          // section.get('loopArray').patchValue(tempLoopArray);
        }
        section.get('tableGridValueList').patchValue(tempTableGridValueList.value);
        // this.toast.successToastr("Deleted successfully");
      }
    }, () => {
    });
  }

  // On Upload
  handleUpload(event: any, field: any) {
    const file = event.target.files[0];

    if (file && field.value.acceptedTypes) {
      const validType = field.value.acceptedTypes.split(',');
      const validExtensions = validType.map((type: any) => type.toLowerCase());
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        this.toast.errorToastr('Invalid file type. Please upload a valid file.')
        event.target.value = ''; // Reset the input value
        return;
      }
    }
    this.uploadFile(file, field);

  }

  uploadFile(file: any, field: any) {

    let dataParams = {
      "UserId": this.gs.loggedInUserInfo.userId,
      "DocumentType": field.value.staticValue,
    }
    let fileFormData: any = new FormData();
    fileFormData.append('Doc', file, file.name);
    this.profileService.uploadedDocument(fileFormData, dataParams).subscribe((res: any) => {
      if (res) {
        field.get('value').setValue(res);
      }
      if (this.submitted) {
        this.findInvalidControls();
      }
    })
  }

  deleteProfile(field: any) {
    field.get('value').setValue("");
  }

  // All From Submit
  async onSubmit() {

    const getFormInfo = this.findInvalidControls();
    console.log("this.gs.loggedInUserInfo >>>>", this.gs.loggedInUserInfo);
    console.log('sections >>>>', this.dynamicForm.value.sections);

    // return;
    this.submitted = true;
    if (getFormInfo.valid) {
      let finalBody: any = {};

      if (this.formType === 'driver' || this.formType === 'individualCarOwner' || this.formType === 'vehicleUpload' || this.formType === 'branch') {
        this.dynamicForm.value.sections.forEach((section: any) => {
          section.fields.forEach((field: any) => {
            let sectionData: any = {};
            if (field.fieldType === "DATE" || field.fieldType === "date") { // Date MM/dd/yyyy
              if (field.value) {
                sectionData[field.modalValue] = this.transformDate(field.value, 'MM/dd/yyyy');
              }
            } else {
              if (field.value || field.value == false || field.value == 0) {
                sectionData[field.modalValue] = field.value;
              }
              // if (field.modalValue) {
              // }
              // else {
              //   if (field.valueCd || field.valueCd == false || field.valueCd == 0) {
              //     sectionData[field.valueCode] = field.valueCd;
              //   }
              // }
            }

            if (field.county) { // set county
              sectionData["county"] = field.county;
            }
            if (field.fieldType === "DROPDOWN" && field.modalValue) { // Dropdown set Cd
              if (field.valueCd || field.valueCd == false || field.valueCd == 0) {
                sectionData[field.valueCode] = field.valueCd;
              }
            }

            if (field.fieldType === "TEXTMASK" && field.valueCd && field.value) {
              sectionData[field.modalValue] = field.valueCd;
              sectionData[field.valueCode] = field.value;
            }

            if (!finalBody[field.modalObject]) {
              finalBody[field.modalObject] = sectionData;
            } else {
              finalBody[field.modalObject] = { ...finalBody[field.modalObject], ...sectionData };
            }
          });

          if (section.loopArray.length) {
            finalBody[section.tableGrid[0]['modalObject']] = section.loopArray;
          }
        });
      }

      if (this.formType === 'driver' || this.formType === 'individualCarOwner') {

        console.log("finalBody >>>>>>", finalBody);

        finalBody.driveInCity = this.kycForm.state;
        finalBody.driverInfo["contactId"] = this.gs.loggedInUserInfo.contactId;
        finalBody.driverInfo["driverId"] = 0// this.gs.generateUniqueId();

        finalBody.driverInfo["maskDriverLicenseNumber"] = "XXXXX0001"
        finalBody.driverInfo["maskDateOfBirth"] = "XX/XX/1972"

        for (const key in finalBody) {
          if (finalBody.hasOwnProperty(key)) {
            const keyValue = finalBody[key];
            if (typeof keyValue === 'object' && keyValue !== null && !Array.isArray(keyValue)) {
              if (!Object.keys(keyValue).length) {
                delete finalBody[key];
              }
            }
          }
        }

        // finalBody.driverInfo["encryptedDriverLicenseNumber"] = "";
        // finalBody.driverInfo["encryptedDateOfBirth"] = "";
        // finalBody.personalInfo["encryptedSSN"] = "";
        console.log("finalBody >>>>>>", finalBody);
        // return;
        this.gs.isSpinnerShow = true;
        this.profileService.insertAndUpdateDriverKYC(finalBody, this.gs.loggedInUserInfo.userId).subscribe((res: any) => {
          console.log("res >>>>>", res);
          this.gs.isSpinnerShow = false;
          if (res && res.statusCode == "200") {
            this.toast.successToastr(res.message);
            this.gs.loggedInUserInfo.isKYCCompleted = true;
            localStorage.setItem('loggedInUser', JSON.stringify(this.gs.loggedInUserInfo));
            this.onHandleSubmit.emit(null);
          } else {
            this.toast.errorToastr(res.message);
          }
        }, (err: any) => {
          this.toast.errorToastr("Something went wrong");
          this.gs.isSpinnerShow = false;
        })
      }

      if (this.formType === 'branch') {

        finalBody.branch["branchContactId"] = null;
        finalBody.branch["branchPersonNum"] = 0;
        finalBody.branch["companyPersonNum"] = 0;
        finalBody.branch["companyContactId"] = this.kycForm.contactId;
        finalBody.branch["contactId"] = null;
        finalBody.branch["phoneTypeId"] = null;
        finalBody.branch["emailTypeId"] = null;
        finalBody.branch["mapLocation"] = null;
        finalBody.branch["addressTypeId"] = null;
        finalBody.branch["addressId"] = null;
        finalBody.branch["currentInd"] = true;
        finalBody.branch["isPrimaryAddress"] = true;

        console.log("finalBody >>>>>>", finalBody);

        // return;
        this.gs.isSpinnerShow = true;
        this.branchService.InsertAndUpdateCompanyBranch(finalBody, {
          userId: this.gs.loggedInUserInfo.userId,
        }).subscribe((res: any) => {
          console.log("res >>>>>", res);
          this.gs.isSpinnerShow = false;
          if (res && res.statusCode == "200") {
            this.toast.successToastr(res.message);
            this.onHandleSubmit.emit(null)
          } else {
            this.toast.errorToastr(res.message);
          }
        }, (err: any) => {
          this.toast.errorToastr("Something went wrong");
          this.gs.isSpinnerShow = false;
        })
      }

      if (this.formType === 'vehicleUpload') {
        finalBody.driveInCity = this.kycForm.state;
        finalBody.vehicleInfo["userId"] = this.gs.loggedInUserInfo.userId;
        finalBody.vehicleInfo["vehicleId"] = 0// this.gs.generateUniqueId();

        console.log("finalBody >>>>>>", finalBody);

        this.gs.isSpinnerShow = true;
        this.profileService.insertAndUpdateVehicleKYC(finalBody, this.gs.loggedInUserInfo.userId).subscribe((res: any) => {
          console.log("res >>>>>", res);
          this.gs.isSpinnerShow = false;
          if (res && res.statusCode == "200") {
            if (this.kycForm.draftVehicles && this.kycForm.draftVehicles.draftData) {
              let draftData = JSON.parse(this.kycForm.draftVehicles.draftData);
              draftData = draftData.filter((drow: any) => drow.vehicleInfo.vinNumber != this.singleDetailInfo.vehicleInfo.vinNumber);
              this.kycForm.draftVehicles.draftData = JSON.stringify(draftData);
              this.kycForm.draftVehicles.isActive = true;

              this.profileService.KYCInsertDraft(this.kycForm.draftVehicles).subscribe((draftRes: any) => {
                this.toast.successToastr(res.message);
                this.onVehicleUploadSubmit.emit({ type: "vehicle_upload" });
              }, (err: any) => {
                this.toast.errorToastr("Something went wrong");
                this.gs.isSpinnerShow = false;
              })
            } else {
              this.toast.successToastr(res.message);
              this.onVehicleUploadSubmit.emit({ type: "vehicle_upload" });
            }
          } else {
            this.gs.isSpinnerShow = false;
            this.toast.errorToastr(res.message);
          }
        }, (err: any) => {
          this.toast.errorToastr("Something went wrong");
          this.gs.isSpinnerShow = false;
        })
      }

      if (this.formType === 'fleetOwner') {
        finalBody = {
          "companyDetails": {
            "contactInfo": {
              "userId": this.gs.loggedInUserInfo.userId,
              "contactId": null,
              "entityTypeId": null,
              "personNumber": null,
            },
            "fleetCompanyId": 0,
          },
          "fleetOwnerDetails": {
            "contactInfo": {
              "userId": this.gs.loggedInUserInfo.userId,
              "contactId": null,
              "entityTypeId": null,
              "personNumber": this.gs.loggedInUserInfo.contactId,
            },
            "maskDriverLicNum": "XXXXX0001",
            "encryptedDriverLicNum": ""
          },
          "userId": null,
          "driveInCity": 0
        }

        this.dynamicForm.value.sections.forEach((section: any) => {
          section.fields.forEach(async (field: any) => {
            const keys = field.modalObject.split(".");
            let sectionData: any = {};

            if (field.fieldType === "DATE" || field.fieldType === "date") { // Date MM/dd/yyyy
              sectionData[field.modalValue] = this.transformDate(field.value, 'MM/dd/yyyy');;
            } else {

              if (field.modalValue) {
                sectionData[field.modalValue] = field.value;
              } else {
                sectionData[field.valueCode] = field.valueCd;
              }
            }

            if (field.county) { // set county
              sectionData["county"] = field.county;
            }
            if (field.fieldType === "DROPDOWN" && field.modalValue) { // Dropdown set Cd
              sectionData[field.valueCode] = field.valueCd;
            }

            if (field.fieldType === "TEXTMASK") {
              sectionData[field.modalValue] = field.valueCd;
              sectionData[field.valueCode] = field.value;
            }

            if (keys.length == 1) {
              finalBody[keys[0]] = { ...finalBody[keys[0]], ...sectionData }
            }
            if (keys.length == 2) {
              finalBody[keys[0]][keys[1]] = { ...finalBody[keys[0]][keys[1]], ...sectionData }
            }
            if (keys.length == 3) {
              if (!(finalBody[keys[0]][keys[1]][keys[2]] && finalBody[keys[0]][keys[1]][keys[2]]?.length)) {
                finalBody[keys[0]][keys[1]][keys[2]] = [{}];

                let createObj: any = {};

                if (keys[2] == 'addresses') {
                  createObj.addressId = null;
                  createObj.addressTypeId = null; // field?.MasterTypeIds?.ID
                  createObj.isPrimaryAddress = true;
                  createObj.currentInd = true;
                }

                if (keys[2] == 'emails') {
                  createObj.personEmailId = null;
                  createObj.emailTypeId = null; // field.MasterTypeIds.ID
                  createObj.primaryEmailFlag = true;
                  createObj.currentInd = true;
                }

                if (keys[2] == 'phoneNumbers') {
                  createObj.phoneId = null;
                  createObj.phoneTypeId = null; // field.MasterTypeIds.ID
                  createObj.extension = 4;
                  createObj.primaryPhoneFlag = true;
                  createObj.currentInd = true;
                }

                finalBody[keys[0]][keys[1]][keys[2]][0] = createObj;

              }
              finalBody[keys[0]][keys[1]][keys[2]][0] = { ...finalBody[keys[0]][keys[1]][keys[2]][0], ...sectionData };
            }
          });

          if (section.loopArray.length) {
            finalBody[section.tableGrid[0]['modalObject']] = section.loopArray;
          }
        });
      }

      if (this.formType === 'fleetOwner') {

        finalBody.driveInCity = this.kycForm.state;
        finalBody.userId = this.gs.loggedInUserInfo.userId;
        console.log("finalBody >>>>>>", finalBody);

        this.gs.isSpinnerShow = true;
        this.profileService.insertAndUpdateCompanyKyc(finalBody, {
          userId: this.gs.loggedInUserInfo.userId
        }).subscribe((res: any) => {
          console.log("res >>>>>", res);
          this.gs.isSpinnerShow = false;
          if (res && res.statusCode == "200") {
            this.toast.successToastr(res.message);
            this.onHandleSubmit.emit(null)
          } else {
            this.toast.errorToastr(res.message);
          }
        }, (err: any) => {
          this.toast.errorToastr("Something went wrong");
          this.gs.isSpinnerShow = false;
        })
      }
    } else {
      console.log('Form Invalid');
      this.toast.errorToastr("Please fill all the required fields");
    }
  }

  arrayToNestedObject(keys: string[]): any {
    const result = {};
    let current: any = result;

    keys.forEach((key, index) => {
      current[key] = index === keys.length - 1 ? {} : {};
      current = current[key];
    });

    return result;
  }

  // All From Handle Update
  async updateDetails(section: any) {

    const exceptFields: any = [];
    const checkAllFill = this.findInvalidControlsBySection(section, exceptFields);
    console.log("checkAllFill >>>>", checkAllFill)
    this.submitted = true;
    if (!checkAllFill.valid) { // nned to do
      this.toast.errorToastr("Please fill all the details of " + section.value.sectionName);
      return;
    }

    let finalBody: any = {};
    let sectionData: any = {};

    if (this.formType !== 'fleetOwner' && section.value.sectionID != "25" && section.value.sectionID != "27") {
      section.value.fields.forEach((field: any) => {
        if (field.modalValue && field.fieldType !== "BUTTON") {
          if (field.fieldType === "DATE" || field.fieldType === "date") { // Date MM/dd/yyyy
            if (field.value) {
              sectionData[field.modalValue] = this.transformDate(field.value, 'MM/dd/yyyy');;
            }
          } else {
            if (field.value || field.value == false || field.value == 0) {
              sectionData[field.modalValue] = field.value;
            }
          }

          if (field.county) { // set county
            sectionData["county"] = field.county || "";
          }
          if (field.fieldType === "DROPDOWN") { // Dropdown set Cd
            if (field.valueCd || field.valueCd == false || field.valueCd == 0) {
              sectionData[field.valueCode] = field.valueCd || "";
            }
          }

          if (field.fieldType === "TEXTMASK" && field.valueCd && field.value) {
            sectionData[field.modalValue] = field.valueCd;
            sectionData[field.valueCode] = field.value;
          }

          if (!finalBody) {
            finalBody = sectionData;
          } else {
            finalBody = { ...finalBody, ...sectionData };
          }

          if (section.value.loopArray && section.value.loopArray.length) {
            finalBody[section.value.tableGrid[0]['modalObject']] = section.value.loopArray;
          }
        }
      });
    }

    if (this.formType === 'fleetOwner') {
      finalBody = {
        "companyDetails": {
          "contactInfo": {
            "contactId": this.singleDetailInfo.companyDetails.contactInfo.contactId,
            "entityTypeId": this.singleDetailInfo.companyDetails.contactInfo.entityTypeId,
            "personNumber": this.singleDetailInfo.companyDetails.contactInfo.personNumber,
          },
          "fleetCompanyId": this.singleDetailInfo.companyDetails.fleetCompanyId,
        },
        "fleetOwnerDetails": {
          "contactInfo": {
            "contactId": this.singleDetailInfo.fleetOwnerDetails.contactInfo.contactId,
            "entityTypeId": this.singleDetailInfo.fleetOwnerDetails.contactInfo.entityTypeId,
            "personNumber": this.singleDetailInfo.fleetOwnerDetails.contactInfo.personNumber,
          }
        },
      }
    }

    if (section.value.sectionID === "25") {
      finalBody = {
        "vehicleOtherDetails": {
          "location": {
            "ownerId": this.singleDetailInfo.vehicleInfo.userId,
            "riskId": this.singleDetailInfo.vehicleInfo.vehicleId,
            "riskType": "Vehicle",
            "isActive": true,
          },
          "userId": this.singleDetailInfo.vehicleInfo.userId,
          "vehicleId": this.singleDetailInfo.vehicleInfo.vehicleId,
        },
      }
    }

    if (section.value.sectionID === '27') {
      finalBody = {
        "providerRequest": {
          "workingHours": this.workingHours, //  this.singleDetailInfo.providerRequest.workingHours
          "contactInfo": {
            "userId": this.singleDetailInfo.providerRequest.contactInfo.userId,
            "contactId": this.singleDetailInfo.providerRequest.contactInfo.contactId || null,
            "entityTypeId": this.singleDetailInfo.providerRequest.contactInfo.entityTypeId || null,
            "personNumber": this.singleDetailInfo.providerRequest.contactInfo.personNumber || null,
          },
        },
      }
    }

    if (this.formType === 'fleetOwner' || section.value.sectionID === "25" || section.value.sectionID === "27") {
      section.value.fields.forEach(async (field: any) => {
        if (field.modalValue && field.fieldType !== "BUTTON") {
          const keys = field.modalObject.split(".");
          let sectionData: any = {};

          if (field.fieldType === "DATE" || field.fieldType === "date") { // Date MM/dd/yyyy
            sectionData[field.modalValue] = this.transformDate(field.value, 'MM/dd/yyyy') || null;
          } else if (field.fieldType === "MULTIDROPDOWN" && field.modalValue) { // Array set with Cd
            sectionData = [];
            field.value.forEach(async (multiField: any) => {
              // if (!sectionData["providerSubCategories"]) {
              // }
              let subCatOptions = field.dropdownList.find((subCatItem: any) => subCatItem.Name == multiField) || {};
              if (subCatOptions.ID) {
                sectionData.push({
                  [field.modalValue]: subCatOptions.Name,
                  [field.valueCode]: subCatOptions.ID
                });

              }
            })
          } else {
            if (field.value || field.value == false || field.value == 0) {
              sectionData[field.modalValue] = field.value;
            }
            // if (field.modalValue) {
            // } else {
            //   if (field.valueCd || field.valueCd == false || field.valueCd == 0) {
            //     sectionData[field.valueCode] = field.valueCd;
            //   }
            // }
          }
          if (field.county) { // set county
            sectionData["county"] = field.county;
          }
          if (field.fieldType === "DROPDOWN" && field.modalValue) { // Dropdown set Cd
            if (field.valueCd || field.valueCd == false || field.valueCd == 0) {
              sectionData[field.valueCode] = field.valueCd;
            }
          }

          if (field.fieldType === "TEXTMASK" && field.valueCd && field.value) {
            sectionData[field.modalValue] = field.valueCd;
            sectionData[field.valueCode] = field.value;
          }
          if (keys.length == 1) {
            finalBody[keys[0]] = { ...finalBody[keys[0]], ...sectionData }
          }
          if (keys.length == 2) {
            if (Array.isArray(sectionData)) {
              finalBody[keys[0]][keys[1]] = sectionData;
            } else {
              finalBody[keys[0]][keys[1]] = { ...finalBody[keys[0]][keys[1]], ...sectionData }
            }
          }
          if (keys.length == 3) {
            if (!(finalBody[keys[0]][keys[1]][keys[2]] && finalBody[keys[0]][keys[1]][keys[2]]?.length)) {
              finalBody[keys[0]][keys[1]][keys[2]] = [{}];

              let createObj: any = {};

              if (keys[2] == 'addresses') {
                createObj.addressId = this.getFieldValue(this.singleDetailInfo, field.modalObject, "addressId");
                createObj.addressTypeId = this.getFieldValue(this.singleDetailInfo, field.modalObject, "addressTypeId") || field?.MasterTypeIds?.ID;
                const isPrimaryAddress = this.getFieldValue(this.singleDetailInfo, field.modalObject, "isPrimaryAddress");
                createObj.isPrimaryAddress = isPrimaryAddress == false ? false : true;
                createObj.currentInd = this.getFieldValue(this.singleDetailInfo, field.modalObject, "currentInd");
              }

              if (keys[2] == 'emails') {
                createObj.personEmailId = this.getFieldValue(this.singleDetailInfo, field.modalObject, "personEmailId");
                createObj.emailTypeId = this.getFieldValue(this.singleDetailInfo, field.modalObject, "emailTypeId") || field?.MasterTypeIds?.ID;
                createObj.primaryEmailFlag = this.getFieldValue(this.singleDetailInfo, field.modalObject, "primaryEmailFlag");
                createObj.currentInd = this.getFieldValue(this.singleDetailInfo, field.modalObject, "currentInd");
              }

              if (keys[2] == 'phoneNumbers') {
                createObj.phoneId = this.getFieldValue(this.singleDetailInfo, field.modalObject, "phoneId");
                createObj.phoneTypeId = this.getFieldValue(this.singleDetailInfo, field.modalObject, "phoneTypeId") || field?.MasterTypeIds?.ID;
                createObj.extension = this.getFieldValue(this.singleDetailInfo, field.modalObject, "extension");
                const primaryPhoneFlag = this.getFieldValue(this.singleDetailInfo, field.modalObject, "primaryPhoneFlag");
                createObj.primaryPhoneFlag = primaryPhoneFlag == false ? false : true;
                createObj.currentInd = this.getFieldValue(this.singleDetailInfo, field.modalObject, "currentInd");
              }
              finalBody[keys[0]][keys[1]][keys[2]][0] = createObj;
            }
            finalBody[keys[0]][keys[1]][keys[2]][0] = { ...finalBody[keys[0]][keys[1]][keys[2]][0], ...sectionData };
          }
        }
      });
    }

    console.log("finalBody >>>>>", finalBody);
    console.log("section >>>>>", section);

    // return;

    if (section.value.sectionID === "1" || section.value.sectionID === "18") {
      this.updateDriverInfo(finalBody, section);
    }

    if (section.value.sectionID === "2") { // TLC only for driver
      this.updateDriverTlcInfo(finalBody, section);
    }

    if (section.value.sectionID === "3" || section.value.sectionID === "19") {
      this.updateForeignDriverInfo(finalBody, section);
    }

    if (section.value.sectionID === "4" || section.value.sectionID === "20") {
      this.updatePersonalInfo(finalBody, section);
    }

    if (section.value.sectionID === "5" || section.value.sectionID === "6" || section.value.sectionID === "7" || section.value.sectionID === "21" || section.value.sectionID === "22" || section.value.sectionID === "23") {
      this.updateDriverKycAddress(finalBody, section);
    }

    if (section.value.sectionID === "8" || section.value.sectionID === "24") {
      this.updateDriverKycOtherInfo(finalBody, section);
    }

    if (section.value.sectionID === "11") {
      this.updateCompanyInfo(finalBody, section);
    }
    if (section.value.sectionID === "12") {
      this.updateFleetOwnerInfo(finalBody, section);
    }
    if (section.value.sectionID === "13") {
      this.updateCompanyBranch(finalBody, section);
    }
    if (section.value.sectionID === "14") {
      this.updateVehicleInfo(finalBody, section);
    }
    if (section.value.sectionID === "15") {
      this.updateVehicleInspection(finalBody, section);
    }
    if (section.value.sectionID === "16" || section.value.sectionID === "26") {
      this.updateVehicleInsuranceInfo(finalBody, section);
    }
    if (section.value.sectionID === "17" || section.value.sectionID === "25") {
      this.updateVehicleOtherInfo(finalBody, section);
    }
    if (section.value.sectionID == "9") {
      this.updateDriverWorkingHours(finalBody, section);
    }
    if (section.value.sectionID == "27") {
      this.updateProviderDetails(finalBody, section);
    }

  }

  // updateForeignDriverInfo
  async updateForeignDriverInfo(finalBody: any, section: any) {

    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "contactId": this.singleDetailInfo.driverInfo.contactId,
      "driverId": this.singleDetailInfo.driverInfo.driverId,
      ...finalBody
    }

    // return
    this.gs.isSpinnerShow = true;
    this.profileService.updateForeignDriverInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateDriverInfo
  async updateDriverInfo(finalBody: any, section: any) {

    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "contactId": this.singleDetailInfo.driverInfo.contactId,
      "driverId": this.singleDetailInfo.driverInfo.driverId,
      ...finalBody
    }

    // return
    this.gs.isSpinnerShow = true;
    this.profileService.updateDriverInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateDriverTlcInfo
  async updateDriverTlcInfo(finalBody: any, section: any) {

    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "contactId": this.gs.loggedInUserInfo.contactId,
      "driverId": this.singleDetailInfo.driverInfo.driverId,
      "tlcLicenseInfo": finalBody
    }

    // return
    this.gs.isSpinnerShow = true;
    this.profileService.updateDriverTlcInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updatePersonalInfo
  async updatePersonalInfo(finalBody: any, section: any) {

    let Body = {
      "contactId": this.gs.loggedInUserInfo.contactId,
      "userId": this.gs.loggedInUserInfo.userId,
      "pInfo": finalBody
    }

    // return
    this.gs.isSpinnerShow = true;
    this.profileService.updatePersonalInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateDriverKycAddress
  async updateDriverKycAddress(finalBody: any, section: any) {
    const effectiveDate = this.transformDate(this.todayDate, 'MM/dd/yy');
    let addressTypes: any = await this.profileService.getMasterTypeIds({
      "stateCode": this.kycForm.state || "42",
      "typeCode": 11,
      "effectiveDate": effectiveDate,
    });

    const addType: any = {
      "5": "Home",
      "6": "Mailing",
      "7": "Billing",

      "21": "Home",
      "22": "Mailing",
      "23": "Billing"
    }

    let addressTypeIds = addressTypes.find((sItem: any) => sItem.Name === addType[section.value.sectionID]) || {};
    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "contactId": this.gs.loggedInUserInfo.contactId,
      "addressTypeId": addressTypeIds.ID || null,
      "address": finalBody
    }
    // return
    this.gs.isSpinnerShow = true;
    this.profileService.updateDriverKycAddress(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateDriverKycOtherInfo
  async updateDriverKycOtherInfo(finalBody: any, section: any) {

    if (finalBody["doYouHaveInsuranceCd"] == "true") {
      console.log("finalBody['otherInfo'] >>>>>>", finalBody['otherInfo']);
      const checkOne = finalBody['otherInfo'].find((item: any) => item.isActive)
      console.log("checkOne >>>>>>", checkOne);

      if (!checkOne || !finalBody['otherInfo'] || !(finalBody['otherInfo'] && finalBody['otherInfo'].length)) {
        this.toast.errorToastr("Please add insurance details.");
        return;
      }
    } else {
      if (!finalBody["doYouWantToGetQuotesFromTLH"]) {
        // section: any, fieldId:any, key:any, value:any
        this.updateValueByFieldId(section, "156", "value", "")
        this.toast.errorToastr("Please fill all the required fields");
        return;
      }
    }
    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "driverId": this.singleDetailInfo.driverInfo.driverId,
      "doYouWantToGetQuotesFromTLH": finalBody["doYouWantToGetQuotesFromTLH"] || false,
      "doYouHaveInsurance": finalBody["doYouHaveInsurance"],
      "doYouHaveInsuranceCd": finalBody["doYouHaveInsuranceCd"],
      "otherInfo": finalBody['otherInfo']
    }

    // return
    this.gs.isSpinnerShow = true;
    this.profileService.updateDriverKycOtherInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
        if (this.formType === 'driver' || this.formType === 'individualCarOwner') {
          const body = {
            userId: this.gs.loggedInUserInfo.userId,
            driverId: this.singleDetailInfo.driverInfo.driverId,
          }
          this.profileService.getDriverDetails(body).subscribe(async (response: any) => {
            if (response && response.driveInCity) {
              this.singleDetailInfo = response;
              let expiryDate: any = null;
              let tempTableGridValueList: any = this.singleDetailInfo[section.value.modalObject];
              section.get('loopArray').clear();
              section.value.fields.forEach((field: any) => {
                if (field.fieldType === "DATE" || field.fieldType === "date") {
                  for (let i in tempTableGridValueList) {
                    if (field.fieldId === 155 || field.fieldId === 226) {
                      expiryDate = this.parseDate(tempTableGridValueList[i][field.modalValue]);
                    }
                    if (expiryDate) {
                      if (this.todayDate.toISOString() < expiryDate.toISOString()) {
                        tempTableGridValueList[i].status = true;
                      } else {
                        tempTableGridValueList[i].status = false;
                      }
                    }
                  }
                }
              })

              const fields = section.get('fields') as FormArray;
              fields.controls.forEach((field: any) => {

                if (field.get('fieldType')?.value === "DROPDOWN") {
                  if (field.get('selectUnique')?.value) {
                    let dpdOptions = field.value.dropdownList;
                    console.log("dpdOptions >>>>>", dpdOptions);
                    dpdOptions.map((a: any) => a.disabled = false);

                    for (let i in dpdOptions) {
                      for (let tgl in tempTableGridValueList) {
                        if (tempTableGridValueList[tgl].insuranceType === dpdOptions[i].Name) {
                          dpdOptions[i].disabled = true;
                        }
                      }
                    }
                    field.get('dropdownList').setValue(dpdOptions);
                  }
                }
              });
              setTimeout(() => {
                section.setControl('loopArray', this.fb.array(tempTableGridValueList || []));
                section.get('tableGridValueList').patchValue(tempTableGridValueList);
                console.log("section >>>>>", section);

              }, 500);
            }
          })
        }
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateCompanyInfo
  async updateCompanyInfo(finalBody: any, section: any) {
    let Body = {
      "userId": this.singleDetailInfo.userId,
      "driveInCity": this.singleDetailInfo.driveInCity,
      "companyDetails": finalBody['companyDetails']
    }

    console.log("Body >>>>>", Body)
    // return;
    this.gs.isSpinnerShow = true;
    this.profileService.updateCompanyInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateFleetOwnerInfo
  async updateFleetOwnerInfo(finalBody: any, section: any) {
    let Body = {
      "userId": this.singleDetailInfo.userId,
      "fleetCompanyId": this.singleDetailInfo.companyDetails.fleetCompanyId,
      "fleetOwnerDetails": finalBody['fleetOwnerDetails']
    }
    console.log("Body >>>>>", Body)
    // return;
    this.gs.isSpinnerShow = true;
    this.profileService.updateFleetOwnerInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateVehicleInfo
  async updateVehicleInfo(finalBody: any, section: any) {
    let Body = {
      "userId": this.singleDetailInfo.vehicleInfo.userId,
      "vehicleId": this.singleDetailInfo.vehicleInfo.vehicleId,
      ...finalBody
    }
    console.log("Body >>>>>", Body)
    // return;
    this.gs.isSpinnerShow = true;
    this.profileService.updateVehicleInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateVehicleInspection
  async updateVehicleInspection(finalBody: any, section: any) {
    let Body = {
      "userId": this.singleDetailInfo.vehicleInfo.userId,
      "vehicleId": this.singleDetailInfo.vehicleInfo.vehicleId,
      "vehicleInspectionDetails": finalBody
    }
    console.log("Body >>>>>", Body)
    // return;
    this.gs.isSpinnerShow = true;
    this.profileService.updateVehicleInspection(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateVehicleInsuranceInfo
  async updateVehicleInsuranceInfo(finalBody: any, section: any) {
    let Body = {
      "userId": this.singleDetailInfo.vehicleInfo.userId,
      "vehicleId": this.singleDetailInfo.vehicleInfo.vehicleId,
      "coverageId": this.singleDetailInfo.vehicleInsuranceDetails.coverageId,
      ...finalBody
    }
    console.log("Body >>>>>", Body)
    this.gs.isSpinnerShow = true;
    this.profileService.updateVehicleInsuranceInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateVehicleOtherInfo
  async updateVehicleOtherInfo(finalBody: any, section: any) {
    let Body = finalBody['vehicleOtherDetails'];
    console.log("Body >>>>>", Body)
    // return;
    this.gs.isSpinnerShow = true;
    this.profileService.updateVehicleOtherInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateVehicleInfo
  async updateCompanyBranch(finalBody: any, section: any) {
    console.log("singleDetailInfo >>>>>>", this.singleDetailInfo);

    let Body = {
      "branch": {
        "branchContactId": this.singleDetailInfo.branch.branchContactId,
        "branchPersonNum": this.singleDetailInfo.branch.branchPersonNum,
        "companyPersonNum": this.singleDetailInfo.branch.companyPersonNum,
        "companyContactId": this.singleDetailInfo.branch.companyContactId,
        "contactId": this.singleDetailInfo.branch.contactId,
        "phoneTypeId": this.singleDetailInfo.branch.phoneTypeId,
        "emailTypeId": this.singleDetailInfo.branch.emailTypeId,
        "mapLocation": this.singleDetailInfo.branch.mapLocation,
        "addressTypeId": this.singleDetailInfo.branch.addressTypeId,
        "addressId": this.singleDetailInfo.branch.addressId,
        "currentInd": this.singleDetailInfo.branch.currentInd,
        "isPrimaryAddress": this.singleDetailInfo.branch.isPrimaryAddress,
        ...finalBody
      },
    }

    this.gs.isSpinnerShow = true;
    this.branchService.InsertAndUpdateCompanyBranch(Body, {
      userId: this.gs.loggedInUserInfo.userId,
    }).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
        this.handleCancel();
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateDriverWorkingHours
  async updateDriverWorkingHours(finalBody: any, section: any) {
    const checkPending = this.workingHours.find((row: any) => row.isEdit == true) || null;
    if (checkPending) {
      this.toast.warningToastr("First save to working hours");
      return;
    }

    // if (!this.isPrivateBooking) {
    //   for (let i in this.workingHours) {
    //     this.workingHours[i].status = false
    //   }
    // }

    let Body = {
      "userId": this.singleDetailInfo.driverDetailsRequest.userId,
      "driverWorkingHours": this.workingHours,
      ...finalBody
    };

    console.log("Body >>>>>", Body)
    // return;

    this.gs.isSpinnerShow = true;
    this.profileService.UpdateDriverWorkingHours(Body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
        this.gs.loggedInUserInfo.activeStatus = Body.isActiveOrInActiveCd;
        localStorage.setItem('loggedInUser', JSON.stringify(this.gs.loggedInUserInfo));
        this.handleCancel();
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateProviderDetails
  async updateProviderDetails(finalBody: any, section: any) {
    const checkPending = this.workingHours.find((row: any) => row.isEdit == true) || null;
    if (checkPending) {
      this.toast.warningToastr("First save to working hours");
      return;
    }

    let Body = finalBody['providerRequest'];
    this.gs.isSpinnerShow = true;
    this.vendorServ.UpdateProviderDetails(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr(section.value.sectionName + " UPDATED SUCCESSFULLY");
        this.gs.loggedInUserInfo.activeStatus = Body.status == "Active" ? true : false;
        // this.gs.loggedInUserInfo.isKYCCompleted = true;
        localStorage.setItem('loggedInUser', JSON.stringify(this.gs.loggedInUserInfo));
        this.handleCancel();
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // From Cancel
  handleCancel() {
    this.onCancel.emit(null);
    // this.cancel.emit(null);
  }

  // Use for full fields
  findInvalidControls() {
    const formStatus: any = {
      valid: true,
      invalidFields: [],
    };
    this.sections.controls.forEach((section: any) => {
      const privFieldsArray = section.get('fields') as FormArray;
      let sectionValid: any = true;
      for (const name in privFieldsArray.controls) {
        if (privFieldsArray.controls[name].invalid) {
          if (privFieldsArray.controls[name]?.value?.isVisible && privFieldsArray.controls[name]?.value?.isMandatory && privFieldsArray.controls[name]?.value?.isConditionValid) {
            formStatus.invalidFields.push(privFieldsArray.controls[name]?.value?.fieldName);
            formStatus.valid = false;
            sectionValid = false;
            section.get('isInvalidSection').setValue(true);
          }
        }
      }

      if (sectionValid) {
        section.get('isInvalidSection').setValue(false);
      }

    })
    return formStatus;
  }

  getValidators(field: any) { // isMandatory : boolean, validationType?: any
    const validators = [];
    if (field.isMandatory && field.fieldType !== 'BUTTON') {
      validators.push(Validators.required);
    }
    const patternExclude = ['BUTTON', 'DATE', 'LOGO', 'SELECTION'];
    if (field.validationType && !patternExclude.includes(field.fieldType) && field.action !== 'MASK') {
      validators.push(Validators.pattern(field.validationType));
    }
    return validators;
  }

  // Use for full fields
  findInvalidControlsBySection(section: any, except?: any) {
    const formStatus: any = {
      valid: true,
    };
    const privFieldsArray = section.get('fields') as FormArray;
    for (const name in privFieldsArray.controls) {
      if (privFieldsArray.controls[name].invalid && (except && !except.includes(privFieldsArray.controls[name]?.value?.fieldId))) {
        if (privFieldsArray.controls[name]?.value?.isVisible && privFieldsArray.controls[name]?.value?.isMandatory && privFieldsArray.controls[name]?.value?.isConditionValid) {
          formStatus.valid = false;
        }
      }
    }
    return formStatus;
  }

  updateCountryDropdownList(countryOptions: any[]) {
    this.sections.controls.forEach((section: any) => {
      const fieldsArray = section.get('fields') as FormArray;
      fieldsArray.controls.forEach((field: any) => {
        if (field.get('fieldName').value === 'COUNTRY') {
          field.get('dropdownList').setValue(countryOptions);
        }
      });
    });
  }

  updateValueByFieldId(section: any, fieldId: any, key: any, value: any) { // value update in key
    const fieldsArray = section.get('fields') as FormArray;
    fieldsArray.controls.forEach((field: any) => {
      if (field.get('fieldId').value == fieldId) {
        field.get(key).setValue(value);
      }
    });
  }

  // Find Index by fieldName
  findControlIndex(formAry: any, value: string) {
    return formAry.controls.findIndex((control: any) => control.value.fieldName === value);
  }

  // Find Index by fieldCode
  findControlIndexByCode(formAry: any, value: string) {
    return formAry.controls.findIndex((control: any) => control.value.fieldCode === value);
  }

  // Find Index by fieldCode
  findControlIndexByFieldId(formAry: any, fieldId: any) {
    return formAry.controls.findIndex((control: any) => control.value.fieldId === fieldId);
  }

  getFutureDate() {
    const date = new Date();
    const last = new Date(date.getTime() + (15 * 24 * 60 * 60 * 1000));
    return last;
  }

  getPastDate() {
    const date = new Date();
    const last = new Date(date.getTime() - (15 * 24 * 60 * 60 * 1000));
    return last;
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  parseDate(dateString: string) {
    if (dateString) {
      const [month, day, year] = dateString.split('/').map(Number);
      return new Date(year, month - 1, day);
    } else {
      return null;
    }
  }

  onToggle(value: any, section: any) {
    section.get('isOpen').setValue(value);
  }

  getAcceptUploadTypes(validationType: string): string {
    if (!validationType) return '';
    const typeMapping: { [key: string]: string } = {
      PNG: '.png',
      JPG: '.jpg,.jpeg',
      JPEG: '.jpeg,.jpg',
      GIF: '.gif',
      PDF: 'application/pdf,.pdf',
      EXCEL: '.xls,.xlsx',
      WORD: '.doc,.docx',
    };

    const types = validationType.split(',').map((type) => typeMapping[type] || '');
    return types.filter((t) => t).join(',');
  }

  viewTermsConditions() {
    this.isAgreeTerms = false;
    console.log("this.selectedTabObj >>>>>", this.selectedTabObj);

    const modalRef = this.modalService.open(TermsAndCModalComponent, {
      size: 'lg',
      scrollable: true,
    });
    modalRef.componentInstance.termCode = this.selectedTabObj.termCode;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.isAgreeTerms = true;
      }
    }, () => {
    });
  }

  async changeStatus(item: any) {
    console.log("singleDetailInfo.driverWorkingHours >>>>", this.singleDetailInfo.driverWorkingHours);

    let newStatus = item.status === 'ON' ? 'OFF' : 'ON';
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Are sure you want to change status to ' + newStatus;
    modalRef.componentInstance.confirmButton = "Yes";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.status = !item.status;
      }
    }, () => { });
  }

}
