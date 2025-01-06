import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastService } from '../../../../shared/services/toast.service';
import { CurrencySymbolPipe } from '../../../../shared/pipe/currency.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination';
import { DriverDetailsModalComponent } from '../modal/driver-details-modal/driver-details-modal.component';
import { DeleteModalComponent } from '../../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { ConfirmationModalComponent } from '../../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-driver-details-form',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    TranslateModule,
    FormsModule,
    NgbModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './driver-details-form.component.html',
  styleUrl: './driver-details-form.component.scss'
})
export class DriverDetailsFormComponent {
  @Input() activeKycTab: any;
  @Input() isEditInfo: any;
  // @Input() driverInfoForm: any;

  driverInfoForm: any = {
    is_active_inactive: null,
    is_available_for_private_booking: null,
    price_per_day: "",
    price_per_week: "",
    price_per_month: "",
    workingHours: [
      { no: 1, name: 'Monday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 2, name: 'Tuesday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 3, name: 'Wednesday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 4, name: 'Thursday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 5, name: 'Friday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 6, name: 'Saturday', from_time: "10:00", to_time: "10:00", status: 'ON' },
      { no: 7, name: 'Sunday', from_time: "10:00", to_time: "10:00", status: 'OFF' },
    ]
  };
  driverInfoData: any = {};
  isAdd: boolean = true;
  isEdit: boolean = false;

  @Output() onDivInfoSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() changeKycTab = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  profileUrl: any = "";

  availableForPrivate: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];
  statusList: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];

  constructor(
    private modal: NgbModal,
    public gs: GlobalService,
    private alert: AlertService,
    private toast: ToastService,
    private modalService: NgbModal,
  ) {
    this.driverInfoData = this.gs.getDriverDetailsData();
    if (!this.driverInfoData.id) {
      this.isAdd = true;
    } else {
      this.isAdd = false;
    }
  }

  async changeStatus(item: any) {
    let newStatus = item.status === 'ON' ? 'OFF' : 'ON';
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Are sure you want to change status to ' + newStatus;
    modalRef.componentInstance.confirmButton = "Yes";
    // modalRef.componentInstance.cancelButton = "Close";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.status = newStatus;
      }
    }, () => { });
  }

  onEdit(item: any, index: any) {
    this.driverInfoForm = JSON.parse(JSON.stringify(this.driverInfoData));
    this.isEdit = true;
  }

  onChangeTime(event: any) {

  }

  vehicleKycUpdate() {
    // this.vfVehicleKycUpdate.emit(null)
    this.driverInfoForm.id = 1;
    localStorage.setItem('driverDetailsData', JSON.stringify(this.driverInfoForm));
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.driverInfoData = this.gs.getDriverDetailsData();
    this.isEdit = false;
    this.toast.successToastr("Updated Successfully");
  }
  onSubmit() {
    // this.onDivInfoSubmit.emit(null)
    // this.driverInfoData = this.driverInfoForm;
    this.driverInfoForm.id = 1;
    localStorage.setItem('driverDetailsData', JSON.stringify(this.driverInfoForm));
    window.scrollTo({ top: 300, behavior: 'smooth' });
    this.driverInfoData = this.gs.getDriverDetailsData();
    this.isAdd = false;
    this.toast.successToastr("Saved Successfully");
  }

  async onDelete(index: any) {
    const modalRef = this.modalService.open(DeleteModalComponent, {
      centered: true,
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        localStorage.removeItem('driverDetailsData');
        this.driverInfoData = this.gs.getDriverDetailsData();
        this.onCancelDriverdetails();
        this.isAdd = true;
      }
    }, () => {
    });
  }
  onChangeKycTab(value: any) {
    this.changeKycTab.emit(value)
  }
  onCancel() {
    this.cancel.emit(null)
  }

  onCancelDriverdetails() {
    this.driverInfoForm.is_active_inactive = null;
    this.driverInfoForm.is_available_for_private_booking = null;
    this.driverInfoForm.price_per_day = "";
    this.driverInfoForm.price_per_week = "";
    this.driverInfoForm.price_per_month = "";
    if (this.isEdit) {
      this.isEdit = false;
    }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  onView(item: any) {
    const modalRef = this.modalService.open(DriverDetailsModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.driverInfoData = this.driverInfoData;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

  // onEdit(item: any, index: any) {
  //   this.onEditInfo.emit();
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }

  // async onDelete(index: any) {
  //   const modalRef = this.modalService.open(DeleteModalComponent, {
  //     centered: true,
  //   });
  //   modalRef.result.then((res: any) => {
  //
  //   }, () => {
  //   });
  // }
}
