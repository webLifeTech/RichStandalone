import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CabService } from '../../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImportantNoticeDialogComponent } from '../../../dialoge/important-notice-dialog/important-notice-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../../pipe/currency.pipe';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../../../services/global.service';
import { ToastService } from '../../../../services/toast.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { FavoriteService } from '../../../../services/favorite.service';

@Component({
  selector: 'app-cab-card-view',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CurrencySymbolPipe,
    NgbModule
  ],
  templateUrl: './cab-card-view.component.html',
  styleUrl: './cab-card-view.component.scss'
})
export class CabCardViewComponent {

  @Input() type: string = "";
  @Input() from: string = "";
  @Input() singleItem: any = {};
  @Input() couponDetails: any = {};
  @Output() onCheckAvailability = new EventEmitter<any>();

  public params: Params;

  details: any = {
    "id": 1,
    "carName": "Peugeot Citroen",
    "carBrand": "Peugeot",
    "carImage": "assets/images/cab/car/5.png",
    "brandLogo": "assets/images/cab/logo/Avis-Logo.png",
    "carImages": [
      {
        "url": "assets/images/cab/car/12.jpg",
        "fileType": "image"
      },
      {
        "url": "assets/images/cab/car/13.jpg",
        "fileType": "image"
      }
    ],
    "carType": "car_list_page.car_type.sadan",
    "unlimittedMileage": true,
    "price": 1200,
    "offer_discount": 0,
    "fare": 25,
    "per_km": 10,
    "passenger": 5,
    "luggage": 2,
    "gearbox": "car_list_page.car_option.automatic",
    "carOption": "automatic",
    "rating": 4,
    "review": 24,
    "category": "popular",
    "tags": [
      "sadan",
      "four",
      "1_5",
      "automatic"
    ]
  }

  driverDetails: any = {
    "id": 1,
    "carName": "Peugeot Citroen",
    "carImage": "assets/images/cab/car/5.png",
    "carImages": [
      {
        "url": "assets/images/cab/car/12.jpg",
        "fileType": "image"
      },
      {
        "url": "assets/images/cab/car/13.jpg",
        "fileType": "image"
      }
    ],
    "carType": "car_list_page.car_type.sadan",
    "status": "car_list_page.status.booked",
    "price": 1200,
    "offer_discount": 15,
    "fare": 25,
    "per_km": 10,
    "passenger": 5,
    "luggage": 2,
    "gearbox": "car_list_page.car_option.automatic",
    "carOption": "automatic",
    "rating": 2,
    "reviews": 64,
    "category": "popular",
    "tags": ["sadan", "two", "1_5", "automatic"],
    "driverName": "John Doe",
    "driverImage": "assets/images/driver/d1.png",
    "location": "New York, NY",
    "experience": 5
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cabService: CabService,
    public gs: GlobalService,
    private toast: ToastService,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private favoriteService: FavoriteService,
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['type']) {
        this.params = params;
        this.type = params['type'] || null;
      }
    })
  }

  ngOnInit() {
    this.details = this.singleItem;
  }

  // User for Car/Driver
  addRemoveWishlist(item: any): void {
    let Body = {
      "favId": 1,
      "userId": this.gs.loggedInUserInfo.userId,
      "riskId": this.type === 'car' ? item.vehicleId : item.driverId,
      "risktype": this.type === 'car' ? 'Vehicle' : 'Driver',
      "isActive": !item.favorite
    }

    this.favoriteService.insertUpdateFavourite(Body).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (Body.isActive) {
        this.toast.successToastr("Added to your Favourite");
      } else {
        this.toast.successToastr("Removed from your Favourite");
      }
      item.favorite = !item.favorite;
    }, (err: any) => {
      this.toast.errorToastr("Something went wrong");
      this.gs.isSpinnerShow = false;
    })
  }

  openImportantNoticeDialog(): void {
    this.dialog.open(ImportantNoticeDialogComponent, {
      width: '60%',
      data: {}
    });
  }


  onBook() {
    if (!this.gs.isLicenseVerified) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = "Please complete your KYC";
      modalRef.result.then((res: any) => {
        if (res.confirmed) {
          this.router.navigateByUrl('/user/my-profile')
        }
      }, () => { });
      return;
    }
    this.onCheckAvailability.emit(null);
  }
}
