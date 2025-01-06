import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-tlc-license-info-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule
  ],
  templateUrl: './tlc-license-info-form.component.html',
  styleUrl: './tlc-license-info-form.component.scss'
})
export class TlcLicenseInfoFormComponent {
  @Input() activeKycTab: any;
  @Input() kycForm: any;
  @Input() isEditInfo: any;
  @Input() tlcDriverLicenseForm: any;
  usaStatesArray: any = [];

  @Output() onDivInfoSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() changeKycTab = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  profileUrl: any = "";


  constructor(
    private modal: NgbModal,
    public gs: GlobalService,
    private alert: AlertService,
  ) {
    this.gs.usStates().subscribe(response => {
      this.usaStatesArray = response;
    })
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
      this.tlcDriverLicenseForm.tlc_firstName = "John";
      this.tlcDriverLicenseForm.tlc_lastName = "Doe";
      this.tlcDriverLicenseForm.tlc_dl_state = "CA (California)";
      this.tlcDriverLicenseForm.tlc_dl_effective_date = "2023-01-01";
      this.tlcDriverLicenseForm.tlc_dl_expiration_date = "2025-01-01";
    }
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
