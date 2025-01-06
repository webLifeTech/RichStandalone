import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-vehicle-info-form',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    MatExpansionModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './vehicle-info-form.component.html',
  styleUrl: './vehicle-info-form.component.scss'
})
export class VehicleInfoFormComponent {
  @Input() from: any;
  @Input() activeKycTab: any;
  @Input() kycForm: any;
  @Input() vehicleInfoForm: any;
  @Input() vehicleInfoObj: any;
  @Input() isEditInfo: any;
  @Input() upload_type: any;
  @Input() isVehicleInfoEdit: any;

  @Output() vehicleKycSaveAsDraft = new EventEmitter<any>();
  @Output() vfVehicleKycSubmit = new EventEmitter<any>();
  @Output() vfOnIndCarCwnerSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() vfOnFleetOwnerSubmit = new EventEmitter<any>();
  @Output() vfChangeKycTab = new EventEmitter<any>();
  @Output() vfCancel = new EventEmitter<any>();

  profileUrl: any = "";

  usaStatesArray: any = [];

  vehicleInfoTabs: any = [
    {
      title: "userDashboard.kyc.vehicles_info.title",
      tab: "vehicles_info",
      isOpen: true,
    },
    {
      title: "userDashboard.kyc.vehicle_inspection_detail.title",
      tab: "vehicle_inspection_detail",
      isOpen: false,
    },
    {
      title: "userDashboard.kyc.vehicle_insurance_detail.title",
      tab: "vehicle_insurance_detail",
      isOpen: false,
    },
    {
      title: "userDashboard.kyc.other_details.title",
      tab: "other_details",
      isOpen: false,
    },
  ]

  makeList: any = [
    { id: 1, name: "Engine Type", value: "Engine Type" },
    { id: 2, name: "Interior Material", value: "Interior Material" },
    { id: 3, name: "Fuel Efficiency", value: "Fuel Efficiency" }
  ]

  modelList: any = [
    { id: 1, name: "Mustang GT", value: "Mustang GT" },
    { id: 2, name: "Civic Type R", value: "Civic Type R" },
    { id: 3, name: "Model S Plaid", value: "Model S Plaid" }
  ]

  grossWeightList: any = [
    { id: 1, name: "5000 lbs", value: "5000 lbs" },
    { id: 2, name: "7000 lbs", value: "7000 lbs" },
    { id: 3, name: "6000 lbs", value: "6000 lbs" }
  ]

  territoryCodeList: any = [
    { id: 1, name: "001-North Region", value: "001-North Region" },
    { id: 2, name: "002-South Region", value: "002-South Region" },
    { id: 3, name: "003-West Region", value: "003-West Region" }
  ]

  fuelTypeList: any = [
    { name: 'Fully Electric', value: 'Fully Electric' },
    { name: 'Hybrid', value: 'Hybrid' },
    { name: 'Gas', value: 'Gas' },
  ];

  transmissionList: any = [
    { name: 'Gas', value: 'Gas' },
    { name: 'Automatic', value: 'Manual' },
  ];

  carCategoryList: any = [
    { name: 'Mini', value: 'Mini' },
    { name: 'Medium', value: 'Medium' },
    { name: 'Standrad', value: 'Standrad' },
    { name: 'Luxury', value: 'Luxury' },
    { name: 'Tempo', value: 'Tempo' },
    { name: 'SUV', value: 'SUV' },
  ];

  carrierList: any = [
    { id: 1, name: 'FedEx', value: 'FedEx' },
    { id: 2, name: 'UPS', value: 'UPS' },
    { id: 3, name: 'DHL', value: 'DHL' },
  ]

  branchList: any = [
    { id: 1, name: 'Main Branch', value: 'Main Branch' },
    { id: 2, name: 'East Side Branch', value: 'East Side Branch' },
    { id: 3, name: 'West End Branch', value: 'West End Branch' },
  ]

  vehicleStatusList: any = [
    { id: 1, name: 'Active', value: 'Active' },
    { id: 2, name: 'Inactive', value: 'Inactive' },
    { id: 3, name: 'Repair', value: 'Repair' },
  ]

  yesNoList: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];

  constructor(
    private modal: NgbModal,
    public gs: GlobalService,
  ) {
    this.gs.usStates().subscribe(response => {
      this.usaStatesArray = response;
    })
  }

  openModal() {
  }

  vinDocUpload() {
    this.vehicleInfoForm.vin_number = "1HGCM82633A004352";
    this.vehicleInfoForm.plate_number = "TLC3344";
    this.vehicleInfoForm.fuel_type = "Hybrid";
    this.vehicleInfoForm.transmission = "Manual";
    this.vehicleInfoForm.car_category = "SUV";
  }

  onSaveAsDraft() {
    this.vehicleKycSaveAsDraft.emit(null)
  }
  vehicleKycSubmit() {
    this.vfVehicleKycSubmit.emit(null)
  }
  onIndCarCwnerSubmit() {
    this.vfOnIndCarCwnerSubmit.emit(null)
  }
  vehicleKycUpdate() {
    this.vfVehicleKycUpdate.emit(null)
  }
  onFleetOwnerSubmit() {
    this.vfOnFleetOwnerSubmit.emit(null)
  }
  changeKycTab(value: any) {
    this.vfChangeKycTab.emit(value)
  }
  cancel(type: any) {
    this.vfCancel.emit(type || null)
  }
}
