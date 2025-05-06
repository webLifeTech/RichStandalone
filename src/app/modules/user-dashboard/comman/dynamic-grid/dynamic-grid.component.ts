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
import { BranchService } from '../../../../shared/services/branch.service';
import { FormsModule } from '@angular/forms';
import { CarStatusChangeModalComponent } from '../../../../shared/components/comman/modal/my-car-modals/car-status-change-modal/car-status-change-modal.component';

@Component({
  selector: 'app-dynamic-grid',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './dynamic-grid.component.html',
  styleUrl: './dynamic-grid.component.scss'
})
export class DynamicGridComponent {

  public params: Params;
  @Input() type: any = "";
  @Input() driverInfoData: any = {};
  @Input() selectedTabObj: any = {};
  @Input() kycForm: any = {};
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

  isAdd: boolean = false;
  searchText: any = '';

  @Output() actionEvent = new EventEmitter<any>();


  formArray: any[] = [];
  groupedSectionsData: any = [];

  constructor(
    public cabService: CabService,
    public profileService: ProfileService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toast: ToastService,
    public gs: GlobalService,
    private branchService: BranchService,
  ) {
  }

  ngOnInit() {
    console.log("this.type >>>>>", this.type);
    console.log("selectedTabObj >>>>>", this.selectedTabObj);

    if (this.type === 'my_vehicle') {
      this.formName = this.selectedTabObj.formName || 'VEHICLE UPLOAD';
    } else {

      if (this.type === 'driver') {
        this.formName = 'DRIVER INFO';
      }
      if (this.type === 'individualCarOwner') {
        this.formName = 'CAR OWNER INFO';
      }
      if (this.type === 'fleetOwner') {
        this.formName = 'COMPANY INFO';
      }
      if (this.type === 'branch' || this.type === 'driver_details' || this.type === 'vendor-profile') {
        this.formName = this.selectedTabObj.formName;
      }
      this.filteredData = this.data;
      console.log("this.filteredData >>>>>", this.filteredData);

      this.totalData = this.data.length;
    }
    this.getConfigUIFields();
  }

  getSearchData() {
    if (this.type === 'my_vehicle') {
      const body = {
        userId: this.gs.loggedInUserInfo.userId
      }
      this.profileService.getAllVehicles(body).subscribe(async (response: any) => {
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
      "menuId": this.kycForm?.menuId || 27
    }

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

  onAdd() {
    this.actionEvent.emit({ add: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onView(item: any) {
    console.log("item >>>>>>", item);
    console.log("this.type >>>>>>", this.type);

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
          modalRef.componentInstance.formType = this.type;
          modalRef.componentInstance.viewInfoDetails = response;
          modalRef.componentInstance.groupedSectionsData = this.groupedSectionsData;
          modalRef.result.then((res: any) => {
          });
        }
      })
    }

    if (this.type === 'fleetOwner') {
      const body = {
        userId: item.userId,
        fleetCompanyId: item.fleetCompanyId,
      }

      this.profileService.getCompanyDetailsByCompanyId(body).subscribe(async (response: any) => {
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
        if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
          const modalRef = this.modalService.open(DynamicInfoModalComponent, {
            size: 'lg'
          });
          modalRef.componentInstance.formType = this.type;
          modalRef.componentInstance.viewInfoDetails = response;
          modalRef.componentInstance.groupedSectionsData = this.groupedSectionsData;
          modalRef.result.then((res: any) => {
          });
        }
      })
    }

    if (this.type === 'branch') {
      const body = {
        userId: this.gs.loggedInUserInfo.userId,
        branchPersonNum: item.branchPersonNum
      }

      this.branchService.GetCompanyBranchByBrnachId(body).subscribe(async (response: any) => {
        if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
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

    if (this.type === 'driver_details') {
      const modalRef = this.modalService.open(DynamicInfoModalComponent, {
        size: 'lg'
      });
      console.log("this.groupedSectionsData >>>>", this.groupedSectionsData);

      modalRef.componentInstance.formType = this.type;
      modalRef.componentInstance.viewInfoDetails = { [this.groupedSectionsData[0].modalObject]: item };
      modalRef.componentInstance.groupedSectionsData = this.groupedSectionsData;
      modalRef.result.then((res: any) => {
      });
    }

    if (this.type === 'vendor-profile') {
      const modalRef = this.modalService.open(DynamicInfoModalComponent, {
        size: 'lg'
      });
      console.log("this.groupedSectionsData >>>>", this.groupedSectionsData);

      modalRef.componentInstance.formType = this.type;
      modalRef.componentInstance.viewInfoDetails = { "providerRequest": item };
      modalRef.componentInstance.groupedSectionsData = this.groupedSectionsData;
      modalRef.result.then((res: any) => {
      });
    }
  }

  onEdit(item: any) {
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

  async changeCarStatus(item: any) {
    // let newStatus = item.status === 'Active' ? 'Inactive' : 'Active';
    const modalRef = this.modalService.open(CarStatusChangeModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.componentInstance.title = 'Are sure you want to change status ?';
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.status = res.status;
        this.toast.successToastr("Status successfully");
      }
    }, () => { });
  }

}
