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
import { AuthService } from '../../../../services/auth.service';
import { InformationModalComponent } from '../../modal/information-modal/information-modal.component';
import { EmailQuoteModalComponent } from '../../modal/email-quote-modal/email-quote-modal.component';

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

  details: any = {}

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public cabService: CabService,
    public gs: GlobalService,
    public auth: AuthService,
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


  checkAvailability() {
    if (!this.gs.isLicenseVerified) {
      const modalRef = this.modalService.open(ConfirmationModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = "Please complete your KYC";
      modalRef.result.then((res: any) => {
        if (res.confirmed) {
          this.router.navigateByUrl('/user/profile')
        }
      }, () => { });
      return;
    }
    this.onCheckAvailability.emit(null);
  }

  async bookNow(details: any) {
    if (details.isBooked) {
      const modalRef = this.modalService.open(InformationModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = `${this.type === 'car' ? 'Vehicle' : 'Driver'} is already booked, cannot book now.`;
      modalRef.result.then((res: any) => {
        if (res.confirmed) { }
      });
      return;
    }

    let searchObj = this.gs.getLastSearch();
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    searchObj.type = "driver";
    searchObj.timeType = "Daily";
    searchObj.pick_time = today.toISOString();
    searchObj.drop_time = tomorrow.toISOString();
    searchObj.same_location = details.location;
    localStorage.setItem('lastSearch', JSON.stringify(searchObj));
    this.gs.lastSearch = searchObj;

    let params = {
      type: "car",
    }
    this.router.navigate(['/cab/booking/booking', this.type === 'car' ? details.vehicleId : details.driverId, details.summaryId], {
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  openEmailQuoteDialog(item: any): void {
    const modalRef = this.modalService.open(EmailQuoteModalComponent, {
      centered: true,
      size: 'md',
      windowClass: "car-enquiry-modal"
    });
    modalRef.componentInstance.type = "car";
    modalRef.componentInstance.details = item;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
        // this.router.navigateByUrl('/auth/log-in');
      }
    });
  }
}
