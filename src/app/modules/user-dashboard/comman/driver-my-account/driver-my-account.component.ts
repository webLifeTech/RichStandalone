import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationModalComponent } from '../../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-driver-my-account',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './driver-my-account.component.html',
  styleUrl: './driver-my-account.component.scss'
})
export class DriverMyAccountComponent {
  @Input() activeKycTab: any;
  @Input() isEditInfo: any;

  @Input() driverInfoForm: any;

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
    private modalService: NgbModal,
  ) {

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

  onChangeTime(event: any) {

  }

  vehicleKycUpdate() {
    this.vfVehicleKycUpdate.emit(null)
  }
  onSubmit() {
    this.onDivInfoSubmit.emit(null)
  }
  onChangeKycTab(value: any) {
    this.changeKycTab.emit(value)
  }
  onCancel() {
    this.cancel.emit(null)
  }
}
