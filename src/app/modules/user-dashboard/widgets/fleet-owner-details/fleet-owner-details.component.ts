import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ImageFileModalComponent } from '../../../../shared/components/comman/modal/image-file-modal/image-file-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyInfoModalComponent } from '../../comman/modal/company-info-modal/company-info-modal.component';

@Component({
  selector: 'app-fleet-owner-details',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './fleet-owner-details.component.html',
  styleUrl: './fleet-owner-details.component.scss'
})
export class FleetOwnerDetailsComponent {

  public params: Params;
  public type: any = "";
  @Input() fleetOwnerInfoData: any = {};
  @Input() onlyVehicleInfo: boolean;
  @Input() onlyCompanyInfo: boolean;
  @Output() onEditInfo = new EventEmitter<any>();

  allBranchList: any = [
    {
      "no": 1,
      "vin_number": "1HGCM82633A004352",
      "tlc_plate_number": "TLC1234",
      "car_category": "Sedan",
      "fuel_type": "Gasoline",
      "transmission": "Automatic",
      "kyc": true
    },
    {
      "no": 2,
      "vin_number": "2T1BU4EE9DC123456",
      "tlc_plate_number": "TLC5678",
      "car_category": "SUV",
      "fuel_type": "Hybrid",
      "transmission": "Automatic",
      "kyc": true
    },
    {
      "no": 3,
      "vin_number": "3FAHP0HA4CR123456",
      "tlc_plate_number": "TLC9101",
      "car_category": "Coupe",
      "fuel_type": "Gasoline",
      "transmission": "Manual",
      "kyc": false
    },
    {
      "no": 4,
      "vin_number": "1FTFW1EF1EFC12345",
      "tlc_plate_number": "TLC1122",
      "car_category": "Pickup Truck",
      "fuel_type": "Diesel",
      "transmission": "Automatic",
      "kyc": true
    },
    {
      "no": 5,
      "vin_number": "JH4KA8270MC012345",
      "tlc_plate_number": "TLC3344",
      "car_category": "Convertible",
      "fuel_type": "Gasoline",
      "transmission": "Manual",
      "kyc": false
    }
  ];

  constructor(
    public cabService: CabService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private modalService: NgbModal,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.type = this.params['type'];
    })
  }

  viewDocumentFile(): void {
    this.dialog.open(ImageFileModalComponent, {
      width: '600px',
      data: {}
    });
  }

  onView(item: any) {
    this.fleetOwnerInfoData.company_logo = "assets/images/cab/logo/Fiat-logo.png";
    const modalRef = this.modalService.open(CompanyInfoModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.fleetOwnerInfoData = this.fleetOwnerInfoData;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

  onEdit(item: any, index: any) {
    this.onEditInfo.emit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
