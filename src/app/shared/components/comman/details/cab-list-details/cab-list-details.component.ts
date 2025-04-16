import { Component, Input } from '@angular/core';
import { pagination } from '../../../../../shared/interface/cab';
import { driver, d_pagination } from '../../../../../shared/interface/driver';
import { PaginationService } from '../../../../../shared/services/pagination.service';
import { CabService } from '../../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxsModule, Select, Store } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ImportantNoticeDialogComponent } from '../../../dialoge/important-notice-dialog/important-notice-dialog.component';
import { EmailQuoteDialogComponent } from '../../../dialoge/email-quote-dialog/email-quote-dialog.component';
import { GlobalService } from '../../../../services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CurrencySymbolPipe } from '../../../../pipe/currency.pipe';
import { NoDataComponent } from '../../../ui/no-data/no-data.component';
import { PaginationComponent } from '../../../ui/pagination/pagination.component';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InformationModalComponent } from '../../modal/information-modal/information-modal.component';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { ToastService } from '../../../../services/toast.service';
import { NftService } from '../../../../services/nft.service';
import { FavoriteService } from '../../../../services/favorite.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-cab-list-details',
  standalone: true,
  imports: [
    NoDataComponent,
    PaginationComponent,
    CommonModule,
    TranslateModule,
    CurrencySymbolPipe,
    NgxsModule,
    NgxsReduxDevtoolsPluginModule,
    NgxsStoragePluginModule,
    NgbModule,
    NgxPaginationModule,
  ],
  templateUrl: './cab-list-details.component.html',
  styleUrl: './cab-list-details.component.scss'
})
export class CabListDetailsComponent {

  @Input() marginClass: boolean;
  @Input() responsiveLatestFilter: boolean;
  @Input() noSidebar: boolean;
  @Input() pageSize: number;
  @Input() searchResult: any = {};
  @Input() carTypes: any = {};

  public type: string = "";
  public getCarTypeParams: string[] = [];
  public params: Params;
  public driverDetails: driver[];

  public paginate: pagination;
  public d_pagination: d_pagination;
  public pageNo: number = 1;

  public icon: string = 'assets/images/cab/car/2.png';
  public title: string = 'cars';
  public description: string = 'no cars were found for this route and date combination. modify your search and try again';

  public d_icon: string = 'assets/images/driver/Male.jpg';
  public d_title: string = 'drivers';
  public d_description: string = 'no drivers were found for this route and date combination. modify your search and try again';


  walletAddress: string | null = null;
  uniqIdToPurchase: string = '';
  priceToPurchase: string = '';
  uniqIdToView: string = '';
  nftDetails: any = null;
  public selectedCarType: string[] = [];
  searchInfo: any = {}

  constructor(
    public cabService: CabService,
    private paginationService: PaginationService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private auth: AuthService,
    private gs: GlobalService,
    private modalService: NgbModal,
    private toast: ToastService,
    private nftService: NftService,
    private dialog: MatDialog,
    private favoriteService: FavoriteService,
  ) {

    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.type = params['type'] ? params['type'] : "car";
      this.getCarTypeParams = params['VEHICLETYPE'] ? params['VEHICLETYPE'].split(',') : [];
      this.pageNo = params['page'] ? params['page'] : 0;
      this.selectedCarType = this.getCarTypeParams;
    })
  }

  ngOnInit() {
    this.paginate = this.paginationService.getPager(this.searchResult.viewModel?.totalCount, this.pageNo, this.pageSize);
    this.searchInfo = this.gs.getLastSearch();
    this.checkFav();
  }

  setPage(page: number) {
    this.pageNo = page;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: "merge"
    });
  }

  openResponsiveFilter() {
    this.cabService.isOpenResponsiveFilter = true;
  }

  async bookNow(details: any) {
    if (this.auth.isLoggedIn) {
      this.gs.isLicenseVerified = true // need to do
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

      let params = {
        car_type: this.getCarTypeParams.length ? this.getCarTypeParams.join(',') : null,
      }
      this.router.navigate(['/cab/booking/booking', this.type === 'car' ? details.vehicleId : details.driverId, details.summaryId], {
        queryParams: params,
        queryParamsHandling: "merge"
      });
      return;
    } else {
      const modalRef = this.modalService.open(InformationModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = "Please login to book";
      modalRef.result.then((res: any) => {
        if (res.confirmed) {
          this.router.navigateByUrl('/auth/log-in');
        }
      }, () => { });
    }
  }

  // User for Car/Driver
  addRemoveWishlist(item: any): void {
    if (this.auth.isLoggedIn) {
      let Body = {
        "favId": 1,
        "userId": this.gs.loggedInUserInfo.userId,
        "riskId": this.type === 'car' ? item.vehicleId : item.driverId,
        "risktype": this.type === 'car' ? 'Vehicle' : 'Driver',
        "isActive": !item.isAddWishlist
      }

      this.favoriteService.insertUpdateFavourite(Body).subscribe((res: any) => {
        this.gs.isSpinnerShow = false;
        if (Body.isActive) {
          this.toast.successToastr("Added to your Favourite");
        } else {
          this.toast.successToastr("Removed from your Favourite");
        }
        item.isAddWishlist = !item.isAddWishlist;
      }, (err: any) => {
        this.toast.errorToastr("Something went wrong");
        this.gs.isSpinnerShow = false;
      })
    } else {
      const modalRef = this.modalService.open(InformationModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.title = "Please login to book";
      modalRef.result.then((res: any) => {
        if (res.confirmed) {
          this.router.navigateByUrl('/auth/log-in');
        }
      }, () => { });
    }
  }

  checkFav() {
    this.favoriteService.getAllFavourite({
      "userId": this.gs.loggedInUserInfo.userId,
      "riskType": this.type === 'car' ? 'Vehicle' : 'Driver',
    }).subscribe((response: any) => {
      if (response && response.responseResultDtos && response.responseResultDtos.statusCode == "200") {
        for (let i in this.searchResult.vehicleMatches) {
          for (let j in response.favoriteList) {
            if (this.type === 'car' && this.searchResult.vehicleMatches[i].vehicleId == response.favoriteList[j].vehicleId) {
              this.searchResult.vehicleMatches[i].isAddWishlist = true;
            }
            if (this.type === 'driver' && this.searchResult.vehicleMatches[i].driverId == response.favoriteList[j].driverId) {
              this.searchResult.vehicleMatches[i].isAddWishlist = true;
            }
          }
        }
      }
    })
  }

  openImportantNoticeDialog(): void {
    this.dialog.open(ImportantNoticeDialogComponent, {
      width: '60%',
      position: {
        top: `24px`,
      },
      data: {}
    });
  }

  openEmailQuoteDialog(): void {
    this.dialog.open(EmailQuoteDialogComponent, {
      width: '600px',
      data: {}
    });
  }

  applyFilter(value: any) {
    const index = this.selectedCarType.indexOf(value);  // checked and unchecked value

    if (index === -1) {
      this.selectedCarType.push(value)
    } else {
      this.selectedCarType.splice(index, 1)
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ['VEHICLETYPE']: this.selectedCarType.length ? this.selectedCarType.join(",") : null },
      queryParamsHandling: 'merge',
      skipLocationChange: false
    });
  }

  checked(item: string) {
    if (this.selectedCarType?.includes(item)) {
      return true;
    }
    return false;
  }

  async purchaseNFT(uniqId: any) {
    try {
      if (!this.walletAddress) {
        this.walletAddress = await this.nftService.connectWallet();
      }
      await this.nftService.purchaseNFT(uniqId);
    } catch (error) {
      console.error(error);
    }
  }

  async viewNFT(item: any, type: any) {
    try {

      if (!this.walletAddress) {
        this.walletAddress = await this.nftService.connectWallet();
      }
      this.nftDetails = await this.nftService.viewNFT(item.kyc_id);
      const hashKey = this.nftDetails[2][this.nftDetails[2].length - 1];

      for (let i in this.driverDetails) {
        if (this.driverDetails[i].kyc_id == item.kyc_id) {
          this.driverDetails[i].hash_key = hashKey;
        }
      }
      if (!hashKey) {
        this.toast.warningToastr("You dont have access to this driver profile");
        return;
      }
      if (type === 'view') {
        window.open('https://indigo-magnetic-yak-978.mypinata.cloud/ipfs/' + hashKey, "_blank");
      }
      if (type === 'download') {
        this.gs.downloadFile(item.driverName + ' KYC', 'https://indigo-magnetic-yak-978.mypinata.cloud/ipfs/' + hashKey)
      }
    } catch (error) {
      console.error(error);
    }
  }
}
