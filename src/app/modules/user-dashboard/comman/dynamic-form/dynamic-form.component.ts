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
    NgxMaskDirective
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
  @Input() kycForm: any;
  @Input() formType: any = "";
  @Input() formArray: any[] = []; // Input data from API
  @Output() onHandleSubmit = new EventEmitter<any>();
  @Output() onVehicleUploadSubmit = new EventEmitter<any>();
  @Output() onDivInfoSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

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
    '0': { pattern: new RegExp('[a-zA-Z0-9]') }  // Define the pattern for 0 (alphanumeric)
  };


  profileUrl: any = "";

  constructor(
    private fb: FormBuilder,
    public gs: GlobalService,
    private toast: ToastService,
    private profileService: ProfileService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    this.dynamicForm = this.fb.group({
      sections: this.fb.array([])
    });
  }

  ngOnInit() {
    this.getConfigUIFields();
    console.log("singleDetailInfo >>>>>>", this.singleDetailInfo);
    this.gs.isModificationOn = true;
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
      "menuId": 27
    }
    this.profileService.getConfigUIFields(body).subscribe(async (response: any) => {
      this.formArray = response;
      this.configMasterDp = await this.profileService.getConfigMasterDropDown();

      if (response && response.length) {
        for (let i in this.formArray) {
          this.formArray[i].isOpen = false;

          if (this.formArray[i].fieldType == "ARRAY") {
            this.formArray[i].isMandatory = false;
          }

          // if (this.isEditInfo && this.formType === 'fleetOwner' && this.formArray[i].modalObject) {
          // this.formArray[i].modalObject = this.formArray[i].modalObject + '.' + this.formArray[i].modalValue;
          this.formArray[i].fValue = this.getFieldValue(this.singleDetailInfo, this.formArray[i].modalObject, this.formArray[i].modalValue);
          this.formArray[i].fValueCode = this.getFieldValue(this.singleDetailInfo, this.formArray[i].modalObject, this.formArray[i].modalValueCode);
          // this.formArray[i].defaultValue = this.resolveNestedValue(this.formArray[i].modalObject, this.singleDetailInfo) || this.formArray[i].defaultValue;
          // console.log("this.value >>>>>>>", this.formArray[i].defaultValue);
          // }
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
        console.log("this.formArray >>>", this.formArray);
        console.log("this.formType >>>", this.formType);
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

    let addressTypeIds = addressTypes.find((sItem: any) => sItem.Name == "Home") || {};
    let emailTypeIds = emailTypes.find((sItem: any) => sItem.Name == "Personal") || {};
    let phoneTypeIds = phoneTypes.find((sItem: any) => sItem.Name == "Home") || {};


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

    this.profileService.GetMasterTerritoryZip({ zipCode: zipCode }).subscribe((res: any) => {

      if (res && res.length) {
        const vehicleModelArray = res.map((item: any) => ({ Name: item.TownName, ...item }));
        this.sections.controls.forEach((section: any) => {
          const fieldsArray = section.get('fields') as FormArray;
          fieldsArray.controls.forEach((field: any) => {
            if (field.get('fieldCode').value === 'FLD_VEH_TERR_CODE') {
              field.get('dropdownList').setValue(vehicleModelArray);
            }
          });
        });
      } else {
        this.gs.isSpinnerShow = false;
        this.toast.errorToastr("Something went wrong");
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
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
              lineBreak: [(field.staticValue && field.staticValue?.includes('col-')) ? field.staticValue : null],
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
              // fValue
              // fValueCode
              value: [
                field.fieldType === "DATE"
                  ? this.parseDate(this.isEditInfo ? field.fValue : null)
                  : (this.isEditInfo ? field.fValue : field.fieldType === "CHECKBOX" ? JSON.parse(field.defaultValue) : (field.defaultValue || null)),
                this.getValidators(field)
              ],
              valueCd: [
                field.fieldType === "DROPDOWN" && this.isEditInfo
                  ? field.fValueCode
                  : null
              ],
              // value: [
              //   field.fieldType === "DATE"
              //     ? this.parseDate(this.singleDetailInfo && this.singleDetailInfo[field.modalObject] ? this.singleDetailInfo[field.modalObject][field.modalValue] : null)
              //     : (this.singleDetailInfo && this.singleDetailInfo[field.modalObject] ? this.singleDetailInfo[field.modalObject][field.modalValue] : field.fieldType === "CHECKBOX" ? JSON.parse(field.defaultValue) : (field.defaultValue || null)),
              //   this.getValidators(field)
              // ],
              // valueCd: [
              //   field.fieldType === "DROPDOWN" && this.singleDetailInfo && this.singleDetailInfo[field.modalObject] && this.singleDetailInfo[field.modalObject][field.modalValueCode]
              //     ? this.singleDetailInfo[field.modalObject][field.modalValueCode]
              //     : null
              // ],
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
            }
          }

          if (fieldTwo.value.fieldName === 'SSN') {
            this.addMaskLayer(fieldTwo);
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
            if (field.get('fieldId')?.value === 155) {
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
      this.profileService.getMasterPostalCodes(body).subscribe((cityRes: any) => {
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
      let dataParams = {
        "userId": this.gs.loggedInUserInfo.userId,
        "vinNumber": event.target.value, // "KMUMADTB9NU073089"
      }
      this.profileService.getVindecode(dataParams).subscribe((res: any) => {
        if (res && res.responseDtos && res.responseDtos.statusCode == "200") {
          let resObj = res.vinMasterResponseDtos;

          const autoFillObj: any = {
            "vinNumber": "vin",
            "make": "make",
            "model": "model",
            "modelYear": "modelYear",
            "seatingCapacity": "numberofSeats",
            "fuelType": "fuelTypePrimary",
            // "manufacturerName" : null,
            // "trim" : null,
            // "plantCountry" : null,
            // "bodyClass" : null,
            // "transmissionStyle" : null,
            // "transmissionSpeeds" : null,
            // "driveType" : null,
            // "engineModel" : null,
            // "antiLockBrakingSystemABS" : null,
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
    }

    if (fieldRow.value.fieldName === 'SSN') {
      const rawValue = fieldRow.value.value.replace(/\D/g, ''); // Remove non-digits
      if (rawValue.length == 9) {
        fieldRow.get('valueCd')?.setValue(rawValue);
        fieldRow.get('value')?.setValue(
          `XXX-XX-${rawValue.slice(-4)}`,
          { emitEvent: false }
        );
      }
    }
    if (fieldRow.value.fieldName === 'TAX ID') {
      const rawValue = fieldRow.value.value.replace(/\D/g, ''); // Remove non-digits
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
    const rawValue = fieldRow.value.value.replace(/\D/g, ''); // Remove non-digits

    if (rawValue.length == 9) {
      fieldRow.get('valueCd')?.setValue(rawValue);
      fieldRow.get('value')?.setValue(
        `XXX-XX-${rawValue.slice(-4)}`,
        { emitEvent: false }
      );
    }
  }

  // On Select Menu
  onCallDpField(dpItem: any, field: any, section: any) {

    if (!field.value.value) {
      this.toast.errorToastr("Please enter " + field.value.fieldName);
      return;
    }

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

        this.profileService.getMVRDetails(dataParams).subscribe((res: any) => {
          console.log("res.mvrDriverDetails >>>>>", res.mvrDriverDetails);

          if (res && res.responseMessage && !res.responseMessage.status) {
            this.toast.errorToastr(res.responseMessage.message);
            return;
          }
          if (res && res.mvrDriverDetails) {
            this.mvrDriverDetailsRes = res.mvrDriverDetails;

            this.mvrDriverDetailsRes.country = 230;

            for (let adI in field.value.apiDropdownList) {
              if (field.value.apiDropdownList[adI].dropDownClass === "1") {
                field.value.apiDropdownList[adI].isVisible = false;
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
        })
      }

      console.log("this.sections >>>>>>>", this.sections);


      if (dpItem.id === 3) { // for "VIEW_MVR_DETAILS"
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
            fieldTwo.get('value')?.setValue(null);
            fieldTwo.get('isConditionValid')?.setValue(false);
          }
        }
      }

      // for unable selectUnique dropdownList
      if (fieldTwo.get('fieldType')?.value === "DROPDOWN") {
        if (fieldTwo.get('selectUnique')?.value) {
          let dpdOptions = fieldTwo.value.dropdownList
          for (let i in dpdOptions) {
            dpdOptions[i].disabled = false;
          }
          fieldTwo.get('dropdownList').setValue(dpdOptions);
        }
      }

      // for oper addNew
      if (fieldTwo.get('fieldType')?.value === 'BUTTON' && fieldTwo.get('isMandatory')?.value && fieldTwo.get('action')?.value === 'ADD') {
        this.addNew(section);
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
      if (section.value.tableGridValueList.length) {
        section.get('tableGridValueList')?.setValue([]);
        const loopArray = section.get('loopArray') as FormArray;
        loopArray.clear();
      }
      console.log("section >>>>>>", section);
    }

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
        if (field.value.fieldId === 191 || field.value.fieldId === 196) {
          if (fieldTwo.get('condition').value === field.value.fieldId) {
            if (fieldTwo.get('conditionValue').value) {
              fieldTwo.get('isConditionValid')?.setValue(true);
            }
          }
        }
        if (field.value.fieldId === 193 || field.value.fieldId === 197) {
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

    console.log("fields >>>>>",);

    fields.controls.forEach((field: any) => {
      if (field.get('isVisible')?.value === false) {
        field.get('isVisible')?.setValue(true);
        field.get('isConditionValid')?.setValue(true);
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
          if (field.get('fieldId')?.value === 155) {
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
            let dpdOptions = field.value.dropdownList
            for (let i in dpdOptions) {
              if (field.get('value')?.value === dpdOptions[i].Name) {
                dpdOptions[i].disabled = true;
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
      console.log("loopArray.value >>>>>", loopArray.value)
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
      console.log("field.get('isVisible')?.value >>>>>>", field.get('isVisible')?.value);

      if (field.get('isVisible')?.value === false) {
        field.get('isVisible')?.setValue(true);
        field.get('isConditionValid')?.setValue(true);

        if (field.get('fieldType')?.value === "DATE" || field.get('fieldType')?.value === "date") { // Date MM/dd/yyyy
          field.get('value')?.setValue(this.parseDate(itemValue[field.get('modalValue').value]));
        } else {
          field.get('value')?.setValue(itemValue[field.get('modalValue').value]);
        }

        if (field.get('fieldType')?.value === "DROPDOWN") {
          field.get('valueCd')?.setValue(itemValue[field.get('valueCode').value]);
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
        console.log("section >>>>>", section);
        const loopArray: any = (section.get('loopArray') as FormArray).value;
        console.log("loopArray >>>>>", loopArray);
        loopArray[index].isActive = false;

        const tempTableGridValueList = loopArray.filter((tRow: any) => tRow.isActive);
        section.get('loopArray').setValue(loopArray);
        section.get('tableGridValueList').setValue(tempTableGridValueList);
        // loopArray[index].isActive = false;
        // loopArray.setValue(loopArray);
        this.toast.successToastr("Deleted successfully");
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
      console.log("res >>>>>", res);
      if (res) {
        field.get('value').setValue(res);
      }
      if (this.submitted) {
        this.findInvalidControls();
      }
    })
  }

  // All From Submit
  async onSubmit() {

    const getFormInfo = this.findInvalidControls();
    console.log("this.gs.loggedInUserInfo >>>>", this.gs.loggedInUserInfo);
    console.log('this.kycForm.state >>>>', this.kycForm.state);
    console.log('findInvalidControls >>>>', getFormInfo);
    console.log('sections >>>>', this.dynamicForm.value.sections);
    // return
    this.submitted = true;
    if (getFormInfo.valid) { // need to do
      let finalBody: any = {};

      if (this.formType === 'driver' || this.formType === 'individualCarOwner' || this.formType === 'vehicleUpload') {
        this.dynamicForm.value.sections.forEach((section: any) => {
          section.fields.forEach((field: any) => {
            let sectionData: any = {};
            if (field.fieldType === "DATE" || field.fieldType === "date") { // Date MM/dd/yyyy
              sectionData[field.modalValue] = this.transformDate(field.value, 'MM/dd/yyyy');;
            } else {
              // console.log("field.fieldName >>>>>", field.fieldName);

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

      console.log("this.formType >>>>>", this.formType)

      if (this.formType === 'driver' || this.formType === 'individualCarOwner') {

        console.log("finalBody >>>>>>", finalBody);

        finalBody.driveInCity = this.kycForm.state;
        finalBody.driverInfo["contactId"] = this.gs.loggedInUserInfo.contactId;
        finalBody.driverInfo["driverId"] = 0// this.gs.generateUniqueId();

        finalBody.driverInfo["maskDriverLicenseNumber"] = "XXXXX0001"
        finalBody.driverInfo["maskDateOfBirth"] = "XX/XX/1972"
        finalBody.driverInfo["encryptedDriverLicenseNumber"] = "";
        finalBody.driverInfo["encryptedDateOfBirth"] = "";
        finalBody.personalInfo["encryptedSSN"] = "";


        console.log("finalBody >>>>>>", finalBody);

        // return; // need to do

        this.profileService.insertAndUpdateDriverKYC(finalBody, this.gs.loggedInUserInfo.userId).subscribe((res: any) => {
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
        console.log("finalBody >>>>>>", finalBody);
        finalBody.driveInCity = this.kycForm.state;
        finalBody.vehicleInfo["userId"] = this.gs.loggedInUserInfo.userId;
        finalBody.vehicleInfo["vehicleId"] = 0// this.gs.generateUniqueId();

        console.log("finalBody >>>>>>", finalBody);

        // return // need to do

        this.profileService.insertAndUpdateVehicleKYC(finalBody, this.gs.loggedInUserInfo.userId).subscribe((res: any) => {
          console.log("res >>>>>", res);
          this.gs.isSpinnerShow = false;
          if (res && res.statusCode == "200") {
            this.toast.successToastr(res.message);
            this.onVehicleUploadSubmit.emit({ type: "vehicle_upload" });
          } else {
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
              "contactId": null,
              "entityTypeId": null,
              "personNumber": null,
            },
            "fleetCompanyId": 0,
          },
          "fleetOwnerDetails": {
            "contactInfo": {
              "contactId": null, // 9268B933-71C7-4E25-A035-D3C146D43055
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
                  createObj.addressTypeId = field.MasterTypeIds.ID;
                  createObj.isPrimaryAddress = true;
                  createObj.currentInd = true;
                }

                if (keys[2] == 'emails') {
                  createObj.personEmailId = null;
                  createObj.emailTypeId = field.MasterTypeIds.ID;
                  createObj.primaryEmailFlag = true;
                  createObj.currentInd = true;
                }

                if (keys[2] == 'phoneNumbers') {
                  createObj.phoneId = null;
                  createObj.phoneTypeId = field.MasterTypeIds.ID;
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

        // return; // need to do

        this.profileService.insertCompanyKyc(finalBody).subscribe((res: any) => {
          console.log("res >>>>>", res);
          this.gs.isSpinnerShow = false;
          if (res && res.messageCode == "200") {
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


    let finalBody: any = {};
    let sectionData: any = {};

    section.value.fields.forEach((field: any) => {
      if (field.modalValue && field.fieldType !== "BUTTON") {
        if (field.fieldType === "DATE" || field.fieldType === "date") { // Date MM/dd/yyyy
          sectionData[field.modalValue] = this.transformDate(field.value, 'MM/dd/yyyy');;
        } else {
          sectionData[field.modalValue] = field.value || "";
        }

        if (field.county) { // set county
          sectionData["county"] = field.county || "";
        }
        if (field.fieldType === "DROPDOWN") { // Dropdown set Cd
          sectionData[field.valueCode] = field.valueCd || "";
        }

        if (field.fieldType === "TEXTMASK") {
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

    console.log("finalBody >>>>>", finalBody);
    console.log("section >>>>>", section);

    if (section.value.sectionID === "1" || section.value.sectionID === "18") {
      this.updateDriverInfo(finalBody);
    }

    if (section.value.sectionID === "2") { // TLC only for driver
      this.updateDriverTlcInfo(finalBody);
    }

    if (section.value.sectionID === "3" || section.value.sectionID === "19") {
      this.updateForeignDriverInfo(finalBody);
    }

    if (section.value.sectionID === "4" || section.value.sectionID === "20") {
      this.updatePersonalInfo(finalBody);
    }

    if (section.value.sectionID === "5" || section.value.sectionID === "6" || section.value.sectionID === "7" || section.value.sectionID === "21" || section.value.sectionID === "22" || section.value.sectionID === "23") {
      this.updateDriverKycAddress(finalBody, section);
    }

    if (section.value.sectionID === "8" || section.value.sectionID === "24") {
      console.log("finalBody >>>>>>", finalBody);

      this.updateDriverKycOtherInfo(finalBody);
    }
  }

  // updateForeignDriverInfo
  async updateForeignDriverInfo(finalBody: any) {

    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "contactId": this.singleDetailInfo.driverInfo.contactId,
      "driverId": this.singleDetailInfo.driverInfo.driverId,
      ...finalBody
    }

    // return
    this.profileService.updateForeignDriverInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr("Updated successfully");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateDriverInfo
  async updateDriverInfo(finalBody: any) {

    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "contactId": this.singleDetailInfo.driverInfo.contactId,
      "driverId": this.singleDetailInfo.driverInfo.driverId,
      ...finalBody
    }

    // return
    this.profileService.updateDriverInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr("Updated successfully");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateDriverTlcInfo
  async updateDriverTlcInfo(finalBody: any) {

    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "contactId": this.gs.loggedInUserInfo.contactId,
      "driverId": this.singleDetailInfo.driverInfo.driverId,
      "tlcLicenseInfo": finalBody
    }

    // return
    this.profileService.updateDriverTlcInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr("Updated successfully");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updatePersonalInfo
  async updatePersonalInfo(finalBody: any) {

    let Body = {
      "contactId": this.gs.loggedInUserInfo.contactId,
      "userId": this.gs.loggedInUserInfo.userId,
      "pInfo": finalBody
    }

    // return
    this.profileService.updatePersonalInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr("Updated successfully");
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
      "7": "Billing"
    }

    let addressTypeIds = addressTypes.find((sItem: any) => sItem.Name === addType[section.value.sectionID]) || {};
    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "contactId": this.gs.loggedInUserInfo.contactId,
      "addressTypeId": addressTypeIds.ID || null,
      "address": finalBody
    }
    // return
    this.profileService.updateDriverKycAddress(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr("Updated successfully");
      } else {
        this.toast.errorToastr(res.message);
      }
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  // updateDriverKycOtherInfo
  async updateDriverKycOtherInfo(finalBody: any) {
    let Body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "driverId": this.singleDetailInfo.driverInfo.driverId,
      "doYouWantToGetQuotesFromTLH": finalBody["doYouWantToGetQuotesFromTLH"] || false,
      "doYouHaveInsurance": finalBody["doYouHaveInsurance"],
      "doYouHaveInsuranceCd": finalBody["doYouHaveInsuranceCd"],
      "otherInfo": finalBody['otherInfo']
    }

    // return
    this.profileService.updateDriverKycOtherInfo(Body).subscribe((res: any) => {
      console.log("res >>>>>", res);
      this.gs.isSpinnerShow = false;
      if (res && res.statusCode == "200") {
        this.toast.successToastr("Updated successfully");
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
    this.cancel.emit(null);
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
      PDF: '.pdf',
      EXCEL: '.xls,.xlsx',
      WORD: '.doc,.docx',
    };

    const types = validationType.split(',').map((type) => typeMapping[type] || '');
    return types.filter((t) => t).join(',');
  }

}
