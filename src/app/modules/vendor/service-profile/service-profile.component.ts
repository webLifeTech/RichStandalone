import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../shared/services/alert.service';
import { GlobalService } from '../../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfirmationModalComponent } from '../../../shared/components/comman/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-service-profile',
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    MatExpansionModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './service-profile.component.html',
  styleUrl: './service-profile.component.scss'
})

export class ServiceProfileComponent {
  @Input() activeKycTab: any;
  @Input() kycForm: any;
  @Input() fleetOwnerForm: any;
  @Input() isEditInfo: any;
  @Input() upload_type: any;
  @Input() isVehicleInfoEdit: any;

  // @Input() isHaveForeignLicense: any;

  @Output() onDivInfoSubmit = new EventEmitter<any>();
  @Output() vfVehicleKycUpdate = new EventEmitter<any>();
  @Output() changeKycTab = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  profileUrl: any = "";
  isEdit: boolean = false;
  driverInfoForm: any = {
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
  mainCatList = [
    {
      name: 'Attorney',
      id: "1",
      logo: 'https://content.jdmagicbox.com/comp/vadodara/62/0265p265std160662/catalogue/kalpeshkumar-j-parekh-makarpura-vadodara-lawyers-0p6urwx8zi.jpg',

    },
    {
      name: 'Mortgage brokers',
      id: "2",
      logo: 'https://assets.bizclikmedia.net/668/033068c58c737acd3de0c69df92e5828:017186ccbc78d5d6b9ad8cb45995b45e/fannae-mae-1.jpg',
    },
    {
      name: 'Insurance Agent',
      id: "3",
      logo: 'https://cdn-icons-png.freepik.com/512/4599/4599163.png',
    },
    {
      name: 'Vehicle Inspections',
      id: "4",
      logo: 'https://static.thenounproject.com/png/1076534-200.png',
    },
  ]

  filteredSubCategories: any = [];
  subCategories = [
    { parentId: "1", name: "Bankruptcy", value: "Bankruptcy" },
    { parentId: "1", name: "Contracts", value: "Contracts" },
    { parentId: "1", name: "Criminal defense", value: "Criminal defense" },
    { parentId: "1", name: "Family and estate", value: "Family and estate" },
    { parentId: "1", name: "General litigation", value: "General litigation" },
    { parentId: "1", name: "Government", value: "Government" },
    { parentId: "1", name: "Health, injury and disability", value: "Health, injury and disability" },
    { parentId: "1", name: "Real estate", value: "Real estate" },
    { parentId: "1", name: "Vehicular", value: "Vehicular" },

    { parentId: "2", name: "Auto", value: "Auto" },
    { parentId: "2", name: "Business", value: "Business" },
    { parentId: "2", name: "Credit card", value: "Credit card" },
    { parentId: "2", name: "Mortgage", value: "Mortgage" },
    { parentId: "2", name: "Personal", value: "Personal" },
    { parentId: "2", name: "Student", value: "Student" },
    { parentId: "2", name: "Title", value: "Title" },


    { parentId: "3", name: "Business", value: "Business" },
    { parentId: "3", name: "Health", value: "Health" },
    { parentId: "3", name: "Identity protection", value: "Identity protection" },
    { parentId: "3", name: "Jewelry", value: "Jewelry" },
    { parentId: "3", name: "Life", value: "Life" },
    { parentId: "3", name: "Overseas", value: "Overseas" },
    { parentId: "3", name: "Pet", value: "Pet" },
    { parentId: "3", name: "Property", value: "Property" },
    { parentId: "3", name: "Travel", value: "Travel" },
    { parentId: "3", name: "Umbrella", value: "Umbrella" },
    { parentId: "3", name: "Vehicle", value: "Vehicle" },

    { parentId: "4", name: "Car Inspectors", value: "Car Inspectors" },
    { parentId: "4", name: "Oil Change Stations", value: "Oil Change Stations" },
    { parentId: "4", name: "Auto Repair", value: "Auto Repair" },
    { parentId: "4", name: "Transmission Repair", value: "Transmission Repair" },
    { parentId: "4", name: "Smog Check Stations", value: "Smog Check Stations" },
    { parentId: "4", name: "Tires", value: "Tires" },
  ]

  usaStatesArray: any = [];

  businessTypeList: any = [
    { name: 'Individual', value: 'Individual' },
    { name: 'Company', value: 'Company' },
  ];

  yesNoList: any = [
    { name: 'Yes', value: 'Yes' },
    { name: 'No', value: 'No' },
  ];
  statusList: any = [
    { name: 'Active', value: 'Active' },
    { name: 'Inactive', value: 'Inactive' },
  ];
  countryList: any = [
    { name: 'USA', value: 'USA' },
    { name: 'China', value: 'China' },
  ];
  stateList: any = [
    { name: 'New York', value: 'New York', country: "USA" },
    { name: 'New York City', value: 'New York City', country: "USA" },
    { name: 'North Carolina', value: 'North Carolina', country: "USA" },
    { name: 'Hebei', value: 'Hebei', country: "China" },
    { name: 'Shanxi', value: 'Shanxi', country: "China" },
  ];
  cityList: any = [
    { name: 'Albany', value: 'Albany', country: "USA" },
    { name: 'Raleigh', value: 'Raleigh', country: "USA" },
    { name: 'Shijiazhuang', value: 'Shijiazhuang', country: "China" },
    { name: 'Taiyuan', value: 'Taiyuan', country: "China" },
  ];

  constructor(
    public gs: GlobalService,
    private modalService: NgbModal,
  ) {
    this.gs.usStates().subscribe(response => {
      this.usaStatesArray = response;
    })
  }

  ngOnInit() {
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
  }

  onChangeServices(value: any) {
    console.log("value >>>>", value);

    const selected: any = this.mainCatList.find((item: any) => item.id === value);
    this.filteredSubCategories = this.subCategories.filter((item: any) => item.parentId === selected.id);
  }

  async changeStatus(item: any) {
    let newStatus = item.status === 'ON' ? 'OFF' : 'ON';
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.title = 'Are sure you want to change status to ' + newStatus;
    modalRef.componentInstance.confirmButton = "Yes";
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        item.status = newStatus;
      }
    }, () => { });
  }

  onChangeTime(event: any) {
  }

  onSubmit() {

  }
  onUpdate() {

  }
  onCancel() {

  }
}
