import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';
import { ProfileService } from '../../../../../shared/services/profile.service';
import { ConfirmationModalComponent } from '../../../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';
import { KycDeclineRevertModalComponent } from '../../../../../shared/components/comman/modal/kyc-decline-revert-modal/kyc-decline-revert-modal.component';
import { ToastService } from '../../../../../shared/services/toast.service';

@Component({
  selector: 'app-dynamic-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    NgbActiveModal,
    DatePipe,
  ],
  templateUrl: './dynamic-info-modal.component.html',
  styleUrl: './dynamic-info-modal.component.scss'
})
export class DynamicInfoModalComponent {
  @Input() formType: any = "";
  @Input() kycForm: any = {};
  @Input() viewInfoDetails: any = {};
  @Input() groupedSectionsData: any = [];
  @Input() purpose: any = "";
  @Output() onCancel = new EventEmitter<any>();
  @Output() onConfirm = new EventEmitter<any>();

  masterDropdwonList: any = [];
  workingHours: any = [];
  rolesDocSection: any = "";


  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
    private profileService: ProfileService,
    private datePipe: DatePipe,
    private toast: ToastService,
  ) {
  }

  ngOnInit() {
    console.log("model kycForm >>>", this.kycForm);

    this.getConfigUIFields();
    if (this.formType === 'driver_details') {
      this.workingHours = this.viewInfoDetails.driverDetailsRequest.driverWorkingHours;
    }
    if (this.formType === 'vendor-profile') {
      this.workingHours = this.viewInfoDetails.providerRequest.workingHours;
    }
    if (this.gs.loggedInUserInfo.role === 'helpdesk') {
      this.viewInfoDetails.kycMandatoryDocuments = [...this.viewInfoDetails.kycMandatoryDocuments].sort((a, b) => {
        if (a.isLatest !== b.isLatest) {
          return a.isLatest ? -1 : 1;
        }

        // 2️⃣ Higher version first
        if (a.version !== b.version) {
          return b.version - a.version;
        }

        // 3️⃣ Optional stable ordering (same version)
        return a.documentTypeId - b.documentTypeId;
        // if (a.documentTypeId !== b.documentTypeId) {
        //   return a.documentTypeId - b.documentTypeId;
        // }
        // if (a.isLatest !== b.isLatest) {
        //   return b.isLatest ? 1 : -1;
        // }
        // return b.version - a.version;
      });
    }

    if (this.formType == 'driver') {
      this.rolesDocSection = "41";
    }
    if (this.formType == 'individualCarOwner') {
      this.rolesDocSection = "42";
    }
    if (this.formType == 'vehicleUpload' || this.formType == 'my_vehicle') {
      this.rolesDocSection = "51";
    }
    if (this.formType == 'fleetOwner') {
      this.rolesDocSection = "52";
    }
  }

  // Get Config UI Fields
  getConfigUIFields() {
    this.gs.isSpinnerShow = true;

    let body = {
      "clientID": null,
      "stateCode": this.viewInfoDetails.driveInCity || "42",
      "languageId": 1,
      "roleName": this.purpose == 'approval' ? this.kycForm.roleId : this.gs.loggedInUserInfo.roleName,// You can change this role from above role id
      "countryId": 230,
      "transactionId": 2,
      "formName": this.kycForm.formName,//THis is name you have send form names
      "menuId": this.kycForm.menuId || 27
    }

    if (this.purpose == 'approval') {
      delete body.menuId;
    }

    this.profileService.getConfigUIFields(body).subscribe(async (response: any) => {
      console.log("aaaaaaaaaaaa >>>>>>>>", response);
      const groupedSections = this.groupBy(response, 'sectionID');

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

        const section: any = {
          sectionID: sectionID,
          sectionName: (fieldsArray[0]?.sectionName || ''),
          modalObject: mostFrequentModalObject,
          fields: fieldsArray
        };
        this.groupedSectionsData.push(section);
      });

      // this.getSearchData();
      if (this.formType !== 'my_vehicle') {
        this.getMasterPolicyCodes();
      }
      if (this.formType === 'my_vehicle') {
        this.getMasterVehicleCodes();
      }
      this.gs.isSpinnerShow = false;
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  // Get All Dropdwon List
  getMasterPolicyCodes() {
    let todayDate = new Date();
    const effectiveDate = this.transformDate(todayDate, 'MM/dd/yy');

    let body = {
      "stateCode": this.viewInfoDetails.driveInCity || "42",
      "typeCode": null,
      "effectiveDate": effectiveDate,
    }

    this.profileService.getMasterPolicyCodes(body).subscribe((res: any) => {
      if (res && res.length) {
        this.masterDropdwonList = this.groupBy(res, 'TypeCode');
        console.log("getMasterVehicleCodes >>>>", this.masterDropdwonList);
        this.createForm();
      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  // Get All Dropdwon List
  getMasterVehicleCodes() {
    let todayDate = new Date();
    const effectiveDate = this.transformDate(todayDate, 'MM/dd/yy');

    let body = {
      "stateCode": this.viewInfoDetails.driveInCity || "42",
      "typeCode": null,
      "effectiveDate": effectiveDate,
    }
    this.profileService.getMasterVehicleCodes(body).subscribe(async (res: any) => {
      if (res && res.length) {
        this.masterDropdwonList = this.groupBy(res, 'TypeCode');
        const cancellationFeeMasterDp = await this.profileService.GetMasterCancellationFeeRules({
          "appliesto": "Risk",
        });
        this.masterDropdwonList["FeeRules"] = cancellationFeeMasterDp;
        console.log("getMasterVehicleCodes >>>>", this.masterDropdwonList);

        this.createForm();
      } else {
        this.gs.isSpinnerShow = false;
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }

  createForm() {
    for (let topRow in this.groupedSectionsData) {
      const formArray = this.groupedSectionsData[topRow].fields;
      for (let i in formArray) {
        formArray[i].isOpen = false;
        formArray[i].isConditionValid = (formArray[i].condition && formArray[i].conditionValue) ? false : true;
        formArray[i].dropdownList = this.masterDropdwonList[formArray[i].dropdownValues];
        if (formArray[i].fieldId == 397 || formArray[i].fieldId == 399 || formArray[i].fieldId == 398 || formArray[i].fieldId == 400) { // Upload Document -> Sample field
          formArray[i].isConditionValid = false;
        }

        if (formArray[i].modalObject) {
          const endKey = formArray[i].fieldType === 'TEXTMASK' ? formArray[i].modalValueCode : formArray[i].modalValue;
          const defaultValue = this.getFieldValue(this.viewInfoDetails, formArray[i].modalObject, endKey);
          formArray[i].defaultValue = defaultValue;
          if (formArray[i].fieldType === 'MULTIDROPDOWN') {
            const valueAry = formArray[i].modalObject.split('.').reduce((acc: any, curr: any) => acc && acc[curr], this.viewInfoDetails);
            let att = valueAry.map((item: any) => item[formArray[i].modalValue]);
            formArray[i].defaultValue = att;
          }
        }

      }

      for (let i in formArray) {
        if (formArray[i].defaultValue) {
          if (formArray[i].fieldType === "DROPDOWN") {
            let dataOptions = formArray[i].dropdownList?.find((citem: any) => (citem.ID == formArray[i].defaultValue || citem.Name == formArray[i].defaultValue)) || {};
            if (dataOptions.ID) {
              this.onChangeDrop(dataOptions, formArray[i], this.groupedSectionsData[topRow])
            }
          }

          if (formArray[i].fieldType === "RADIO") {
            this.onChangeRadio(formArray[i], this.groupedSectionsData[topRow])
          }
        }
      }
    }

    console.log("final >>>>", this.groupedSectionsData);
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


  // On Change Dropdwon
  onChangeDrop(event: any, field: any, section: any) {
    let fieldsFmArray = section.fields;
    for (let i in fieldsFmArray) {
      if (fieldsFmArray[i].conditionValue && fieldsFmArray[i].condition) {
        if (fieldsFmArray[i].condition == field.fieldId) {
          if (event.Code == fieldsFmArray[i].conditionValue) {
            fieldsFmArray[i].isConditionValid = true;
          } else {
            fieldsFmArray[i].value = null;
            fieldsFmArray[i].isConditionValid = false;
          }
        }
      }
    }
    section.fields = fieldsFmArray;
  }

  onChangeRadio(field: any, section: any) {
    let fieldsFmArray = section.fields;
    for (let fieldTwo in fieldsFmArray) {
      if (fieldsFmArray[fieldTwo].conditionValue && fieldsFmArray[fieldTwo].condition) {
        if (field.fieldId === 191 || field.fieldId === 196 || field.fieldId === 276) {
          if (fieldsFmArray[fieldTwo].condition == field.fieldId) {
            if (fieldsFmArray[fieldTwo].conditionValue) {
              fieldsFmArray[fieldTwo].isConditionValid = true;
            }
          }
        }
        if (field.fieldId === 193 || field.fieldId === 197 || field.fieldId === 277) {
          if (fieldsFmArray[fieldTwo].conditionValue) {
            fieldsFmArray[fieldTwo].isConditionValid = false;
          }
        }
      }
    }
    section.fields = fieldsFmArray;
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  getSuffix(tblItem: any, row: any) {
    // console.log("field ======>", row);
    // console.log("FeeRules ======>", this.masterDropdwonList["FeeRules"]);

    if (row.fieldId == "344") {
      const slctFeeMasterDp = this.masterDropdwonList["FeeRules"].find((i: any) => i.Description == tblItem[row.modalValue]) || {};
      console.log("row.value >>>>>>", row.defaultValue);

      return "(Between " + slctFeeMasterDp['AdvanceHoursMin'] + " to " + slctFeeMasterDp['AdvanceHoursMax'] + ' Hours)';
    }
    return null;
  }

  getPrefix(tblItem: any, row: any) {
    return null;
  }

  handleCancel() {
    this.onCancel.emit(null);
  }

  isBoolean(value: any) {
    return typeof value === 'boolean';
  }

  approveKyc(updateType: any, data?: any) {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = "Are you sure you want to Approve?";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.updateKycVerificationStatus(2, updateType, data);
      }
    }, () => { });
    return;
  }

  approveDeclineRevert(typeCode: any, updateType: any, data?: any) {
    const modalRef = this.modalService.open(KycDeclineRevertModalComponent, {
      centered: true,
    });
    const type = typeCode == 3 ? 'Decline' : 'Revert Back';
    modalRef.componentInstance.mainTitle = type;
    modalRef.componentInstance.title = `Are you sure you want to ${type}?`;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        this.updateKycVerificationStatus(typeCode, updateType, data, res.reason);
      }
    }, () => { });
    return;
  }

  updateKycVerificationStatus(status: any, updateType: any, data?: any, reason?: any) {
    const body = {
      "userId": this.kycForm.userId,
      "riskId": this.kycForm.riskId,
      "riskType": this.kycForm.riskType,
      "status": status,
      "remarks": reason || "",
      "modifiedBy": this.gs.loggedInUserInfo.userId,

      "type": updateType,
      "documentId": updateType === 'SINGLE' ? data?.id : 0,
      "documentTypeId": updateType === 'SINGLE' ? data?.documentTypeId : 0
    }
    this.gs.isSpinnerShow = true;
    this.profileService.UpdateKycVerificationStatus(body).subscribe((response: any) => {
      console.log('UpdateKycVerificationStatus >>>', response);

      this.gs.isSpinnerShow = false;
      if (response && response.statusCode == "200") {
        this.toast.successToastr(response.message);
        if (updateType === 'ENTIRE') {
          this.onConfirm.emit(true);
          return;
        }
        const parsed = JSON.parse(response.responseData || '{}');
        data.kycStatus = parsed.kycStatus;
        data.kycStatusCd = parsed.kycStatusCd;
        data.kycDescription = parsed.kycDescription;
        data.createdDate = parsed.modifiedDate;
      } else {
        this.toast.errorToastr(response.message);
      }
    }, (error) => {
      this.toast.errorToastr(error.error.message);
      this.gs.isSpinnerShow = false;
    });
  }
}
