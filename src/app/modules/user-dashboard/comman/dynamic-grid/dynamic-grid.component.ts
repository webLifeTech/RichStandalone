import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DynamicInfoModalComponent } from '../modal/dynamic-info-modal/dynamic-info-modal.component';
import { DeleteModalComponent } from '../../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { ProfileService } from '../../../../shared/services/profile.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-dynamic-grid',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './dynamic-grid.component.html',
  styleUrl: './dynamic-grid.component.scss'
})
export class DynamicGridComponent {

  public params: Params;
  @Input() type: any = "";
  @Input() driverInfoData: any = {};
  @Input() selectedTabObj: any = {};
  @Output() onEditInfo = new EventEmitter<any>();

  formName: string = '';
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() actions: string[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 1;
  totalData: any = 0;
  filteredData: any[] = [];
  paginatedData: any[] = [];

  @Output() actionEvent = new EventEmitter<any>();


  formArray: any[] = [];
  groupedSectionsData: any = [];

  constructor(
    public cabService: CabService,
    public profileService: ProfileService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toast: ToastService,
    public gs: GlobalService
  ) {
  }

  ngOnInit() {
    if (this.type === 'my_vehicle') {
      this.formName = 'VEHICLE UPLOAD';
      // this.onEdit(this.filteredData[2]); // need to do
    } else if (this.type === 'fleetOwner') {
      this.formName = 'COMPANY INFO';
      this.filteredData = this.data;
      this.totalData = this.data.length;

      // this.onEdit(this.filteredData[0]); // need to do
    } else {
      if (this.type === 'driver') {
        this.formName = 'DRIVER INFO';
      }
      if (this.type === 'individualCarOwner') {
        this.formName = 'CAR OWNER INFO';
      }
      this.filteredData = this.data;
      this.totalData = this.data.length;

      // this.onEdit(this.filteredData[0]); // need to do
    }
    this.getConfigUIFields();
  }

  getSearchData() {
    if (this.type === 'my_vehicle') {
      const body = {
        userId: this.gs.loggedInUserInfo.userId
      }
      this.profileService.getAllVehicles(body).subscribe(async (response: any) => {
        console.log("getVehicleDetails >>>>>>>>", response);
        if (response && response.length) {
          this.filteredData = response;
          this.totalData = response.length;
        }
      })
    }
  }

  // Get Config UI Fields
  getConfigUIFields() {
    this.gs.isSpinnerShow = true;

    let body = {
      "clientID": null,
      "stateCode": 42,
      "languageId": 1,
      "roleName": this.gs.loggedInUserInfo.roleName,// You can change this role from above role id
      "countryId": 230,
      "transactionId": 2,
      "formName": this.formName,//THis is name you have send form names
      "menuId": 27
    }

    console.log("body >>>>", body);

    this.profileService.getConfigUIFields(body).subscribe(async (response: any) => {
      this.formArray = response;
      console.log("aaaaaaaaaaaa >>>>>>>>", this.formArray);
      const groupedSections = this.groupBy(this.formArray, 'sectionID');

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

      this.getSearchData();
      console.log("this.groupedSectionsData >>>>>>>>>>", this.groupedSectionsData);

      this.gs.isSpinnerShow = false;
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
      this.toast.errorToastr(err || "Something went wrong");
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

  onView(item: any) {
    console.log("item >>>>>>", item);

    if (this.type === 'driver' || this.type === 'individualCarOwner') {
      const body = {
        userId: this.gs.loggedInUserInfo.userId,
        driverId: item.driverId,
      }

      this.profileService.getDriverDetails(body).subscribe(async (response: any) => {
        console.log("getDriverDetails >>>>>>>>", response);
        if (response && response.driverInfo.driverId) {
          const modalRef = this.modalService.open(DynamicInfoModalComponent, {
            size: 'lg'
          });
          modalRef.componentInstance.viewInfoDetails = response;
          modalRef.componentInstance.groupedSectionsData = this.groupedSectionsData;
          modalRef.result.then((res: any) => {
          });
        }
      })
    }

    if (this.type === 'fleetOwner') {
      const body = {
        companyId: item.companyId,
      }

      this.profileService.getCompanyKyc(body).subscribe(async (response: any) => {
        console.log("getDriverDetails >>>>>>>>", response);
        if (response && response.userId) {
          const modalRef = this.modalService.open(DynamicInfoModalComponent, {
            size: 'lg'
          });
          modalRef.componentInstance.viewInfoDetails = response;
          modalRef.componentInstance.groupedSectionsData = this.groupedSectionsData;
          modalRef.result.then((res: any) => {
          });
        }
      })
    }

    if (this.type === 'my_vehicle') {
      const body = {
        userId: this.gs.loggedInUserInfo.userId,
        vehicleId: item.vehicleId
      }

      this.profileService.getVehicleDetails(body).subscribe(async (response: any) => {
        console.log("getVehicleDetails >>>>>>>>", response);
        if (response && response.driveInCity) {
          const modalRef = this.modalService.open(DynamicInfoModalComponent, {
            size: 'lg'
          });
          modalRef.componentInstance.viewInfoDetails = response;
          modalRef.componentInstance.groupedSectionsData = this.groupedSectionsData;
          modalRef.result.then((res: any) => {
          });
        }
      })
    }
  }

  onEdit(item: any) {
    console.log("item >>>>>>", item);
    const singleDetail = item;
    this.actionEvent.emit({ singleDetail });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async onDelete(index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }


  pageChanged(event: any) {
    this.currentPage = event;
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  sortData() {
    if (this.sortColumn) {
      this.filteredData.sort((a, b) => {
        const aValue = a[this.sortColumn];
        const bValue = b[this.sortColumn];
        if (aValue < bValue) {
          return this.sortDirection === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return this.sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
  }

}
