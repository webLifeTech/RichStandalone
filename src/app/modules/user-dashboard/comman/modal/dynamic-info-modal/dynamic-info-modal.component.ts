import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../../../../shared/services/global.service';

@Component({
  selector: 'app-dynamic-info-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './dynamic-info-modal.component.html',
  styleUrl: './dynamic-info-modal.component.scss'
})
export class DynamicInfoModalComponent {
  @Input() driverInfoData: any = {};
  @Input() groupedSectionsData: any = {};

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService
  ) {
  }

  ngOnInit() {
    console.log("1111111 groupedSectionsData >>>>>>>", this.groupedSectionsData);
    console.log("1111111 driverInfoData >>>>>>>", this.driverInfoData);

    for (let topRow in this.groupedSectionsData) {
      const formArray = this.groupedSectionsData[topRow].fields;
      for (let i in formArray) {
        formArray[i].isOpen = false;

        if (formArray[i].modalObject) {
          const endKey = formArray[i].fieldType === 'TEXTMASK' ? formArray[i].modalValueCode : formArray[i].modalValue;
          // console.log("endKey >>>", endKey);

          // if (this.isEditInfo && this.formType === 'fleetOwner' && this.formArray[i].modalObject) {
          //   this.formArray[i].modalObject = this.formArray[i].modalObject + '.' + this.formArray[i].modalValue;
          //   this.formArray[i].defaultValue = this.resolveNestedValue(this.formArray[i].modalObject, this.singleDetailInfo) || this.formArray[i].defaultValue;
          //   // console.log("this.value >>>>>>>", this.formArray[i].defaultValue);
          // }


          // const keys = formArray[i].modalObject.split('.');
          // if (keys.length === 3) {
          //   formArray[i].modalObject = formArray[i].modalObject + '[0].' + endKey;
          // } else {
          //   formArray[i].modalObject = formArray[i].modalObject + '.' + endKey;
          // }
          // console.log("formArray[i].modalObject >>>>>>>", formArray[i].modalObject);
          // formArray[i].defaultValue = this.resolveNestedValue(formArray[i].modalObject, this.driverInfoData);
          // console.log("this.value >>>>>>>", formArray[i].defaultValue);


          const defaultValue = this.getFieldValue(this.driverInfoData, formArray[i].modalObject, endKey);

          formArray[i].defaultValue = defaultValue;

          console.log("this.value >>>>>>>", defaultValue);
        }
      }
    }
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
        // Check if the key specifies an index (e.g., "emails[0]")
        const match = key.match(/(\w+)\[(\d+)\]/);
        console.log("key >>>>>>>", key);
        console.log("match >>>>>>>", match);

        if (match) {
          const arrayKey = match[1]; // e.g., "emails"
          const index = parseInt(match[2], 10); // e.g., 0
          return acc.find((item, idx) => idx === index) || null;
        }
      }
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
