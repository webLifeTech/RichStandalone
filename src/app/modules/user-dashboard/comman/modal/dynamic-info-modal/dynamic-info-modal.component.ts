import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';
import { ProfileService } from '../../../../../shared/services/profile.service';

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
  @Input() viewInfoDetails: any = {};
  @Input() groupedSectionsData: any = {};
  masterDropdwonList: any = [];

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
    private profileService: ProfileService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    console.log("1111111 groupedSectionsData >>>>>>>", this.groupedSectionsData);
    console.log("1111111 viewInfoDetails >>>>>>>", this.viewInfoDetails);
    console.log("1111111 formType >>>>>>>", this.formType);

    if (this.formType !== 'my_vehicle') {
      this.getMasterPolicyCodes();
    }
    if (this.formType === 'my_vehicle') {
      this.getMasterVehicleCodes();
    }
    // this.createForm();
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
    this.profileService.getMasterVehicleCodes(body).subscribe((res: any) => {
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
        formArray[i].dropdownList = this.masterDropdwonList[formArray[i].dropdownValues]

        if (formArray[i].modalObject) {
          const endKey = formArray[i].fieldType === 'TEXTMASK' ? formArray[i].modalValueCode : formArray[i].modalValue;
          const defaultValue = this.getFieldValue(this.viewInfoDetails, formArray[i].modalObject, endKey);
          formArray[i].defaultValue = defaultValue;
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

}
