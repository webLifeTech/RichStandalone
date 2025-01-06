import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FleetOwnerDetailsComponent } from '../../widgets/fleet-owner-details/fleet-owner-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MyVehicleViewModalComponent } from '../modal/my-vehicle-view-modal/my-vehicle-view-modal.component';


@Component({
  selector: 'app-my-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatMenuModule,
    MatButtonModule,
    FleetOwnerDetailsComponent
  ],
  templateUrl: './my-vehicles.component.html',
  styleUrl: './my-vehicles.component.scss'
})
export class MyVehiclesComponent {
  @Input() activeKycTab: any;
  @Input() isEditInfo: any;

  @Input() driverInfoForm: any;

  @Input() from: any;
  @Input() allComplateKycVehicleList: any;
  @Input() isVehicleInfoView: any;
  @Input() isVehicleInfoEdit: any;
  @Input() vehicleInfoObj: any;

  @Output() viewVehicle = new EventEmitter<any>();
  @Output() backMyVehicle = new EventEmitter<any>();
  @Output() editFile = new EventEmitter<any>();
  @Output() deleteFile = new EventEmitter<any>();

  @Output() onDivInfoSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() changeKycTab = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  profileUrl: any = "";


  constructor(
    private modal: NgbModal,
    public gs: GlobalService,
    private modalService: NgbModal,
  ) {

  }

  openModal() {
  }

  handleUpload(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.profileUrl = reader.result;
    };
  }

  documentUpload(type: any) {
    if (type === 'tlc') {
      this.driverInfoForm.tlc_firstName = "John";
      this.driverInfoForm.tlc_lastName = "Doe";
      this.driverInfoForm.tlc_dl_state = "CA (California)";
      this.driverInfoForm.tlc_dl_effective_date = "2023-01-01";
      this.driverInfoForm.tlc_dl_expiration_date = "2025-01-01";
    }
  }


  onViewVehicle(item: any, idx: any) {
    // this.viewVehicle.emit({ item, idx })
    const modalRef = this.modalService.open(MyVehicleViewModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.result.then((res: any) => {

      // array.splice(index, 1);
      // this.toast.successToastr("Deleted successfully");
    }, () => {
    });
  }
  onEditFile(item: any, idx: any) {
    this.editFile.emit({ item, idx })
  }
  onDeleteFile(allComplateKycVehicleList: any, idx: any) {
    this.deleteFile.emit({ array: allComplateKycVehicleList, index: idx })
  }
  onBackMyVehicle() {
    this.backMyVehicle.emit(null)
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
