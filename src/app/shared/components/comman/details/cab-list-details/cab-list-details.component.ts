import { Component, Input } from '@angular/core';
import { cab, pagination, priceFilter } from '../../../../../shared/interface/cab';
import { driver, d_pagination, d_priceFilter } from '../../../../../shared/interface/driver';
import { PaginationService } from '../../../../../shared/services/pagination.service';
import { CabService } from '../../../../../shared/services/cab.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgxsModule, Select, Store } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { cabState } from '../../../../../shared/store/state/cab.state';
import { driverState } from '../../../../../shared/store/state/driver.state';
import { Observable } from 'rxjs';
import { getCab } from '../../../../store/action/cab.action';
import { getDriver } from '../../../../store/action/driver.action';
import { AuthService } from '../../../../services/auth.service';
import { AlertService } from '../../../../services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { ImportantNoticeDialogComponent } from '../../../dialoge/important-notice-dialog/important-notice-dialog.component';
import { EmailQuoteDialogComponent } from '../../../dialoge/email-quote-dialog/email-quote-dialog.component';
import { carTypes } from '../../../data/data/filter/cab';
import { GlobalService } from '../../../../services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CurrencySymbolPipe } from '../../../../pipe/currency.pipe';
import { NoDataComponent } from '../../../ui/no-data/no-data.component';
import { PaginationComponent } from '../../../ui/pagination/pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InformationModalComponent } from '../../modal/information-modal/information-modal.component';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { ToastService } from '../../../../services/toast.service';
import { NftService } from '../../../../services/nft.service';
// import { provideStore } from '@ngxs/store';

@Component({
  selector: 'app-cab-list-details',
  standalone: true,
  imports: [
    NoDataComponent,
    PaginationComponent,
    ImportantNoticeDialogComponent,
    EmailQuoteDialogComponent,
    CommonModule,
    TranslateModule,
    CurrencySymbolPipe,
    NgxsModule,
    NgxsReduxDevtoolsPluginModule,
    NgxsStoragePluginModule,
  ],
  // providers: [provideStore()],
  templateUrl: './cab-list-details.component.html',
  styleUrl: './cab-list-details.component.scss'
})
export class CabListDetailsComponent {

  @Input() marginClass: boolean;
  @Input() responsiveLatestFilter: boolean;
  @Input() noSidebar: boolean;

  public type: string = "";
  public getCarLocationParams: string[] = [];
  public getCarTypeParams: string[] = [];
  public getOwnerTypeParams: string[] = [];
  public getCarSupplierParams: string[] = [];
  public getCarCapacityParams: string[] = [];
  public getRatingParams: string[] = [];
  public getCarOptionParams: string[] = [];
  public minPrice: number;
  public maxPrice: number;
  public priceData: priceFilter;
  public paramsTag: string[];
  public params: Params;

  public cabDetails: cab[] = [];
  public driverDetails: driver[];

  public totalCabAvailable: number = 0;

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

  @Select(cabState.cab) cab$: Observable<cab[]>;
  @Select(driverState.driver) driver$: Observable<driver[]>;

  public carTypes = carTypes;
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
    private alert: AlertService,
    private modalService: NgbModal,
    private toast: ToastService,
    private nftService: NftService,
    private dialog: MatDialog
  ) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.searchInfo = this.gs.getLastSearch();

    this.route.queryParams.subscribe((params) => {
      this.params = params;
      this.type = params['type'] ? params['type'] : "car";
      this.pageNo = params['page'] ? params['page'] : this.pageNo;
      this.getCarLocationParams = params['car_location'] ? params['car_location'].split(',') : [];
      this.getCarTypeParams = params['car_type'] ? params['car_type'].split(',') : [];
      this.getOwnerTypeParams = params['owner_type'] ? params['owner_type'].split(',') : [];
      this.getCarSupplierParams = params['car_sup'] ? params['car_sup'].split(',') : [];
      this.getCarCapacityParams = params['capacity'] ? params['capacity'].split(',') : [];
      this.getRatingParams = params['rating'] ? params['rating'].split(',') : [];
      this.getCarOptionParams = params['car_option'] ? params['car_option'].split(',') : [];
      this.minPrice = params['minPrice'] ? params['minPrice'] : [];
      this.maxPrice = params['maxPrice'] ? params['maxPrice'] : [];
      this.priceData = {
        minPrice: this.minPrice,
        maxPrice: this.maxPrice
      }

      this.selectedCarType = this.getCarTypeParams;

      if (this.type === 'car') {
        if (!Object.keys(params).length) {
          this.paramsTag = [];
          this.store.dispatch(new getCab(this.paramsTag, this.priceData));
        }

        this.paramsTag = [...this.getCarLocationParams, ...this.getCarTypeParams, ...this.getOwnerTypeParams, ...this.getCarSupplierParams, ...this.getCarCapacityParams, ...this.getRatingParams, ...this.getCarOptionParams];
        this.cab$.subscribe((res) => {
          this.totalCabAvailable = res.length;
          this.cabDetails = res || [];
          this.paginate = this.paginationService.getPager(this.cabDetails?.length, +this.pageNo, 10);
          this.cabDetails = this.cabDetails?.slice(this.paginate.startIndex, this.paginate.endIndex + 1);
        }, err => {
        })
      }
      if (this.type === 'driver') {

        if (!Object.keys(params).length) {
          this.paramsTag = [];
          this.store.dispatch(new getDriver(this.paramsTag, this.priceData));
        }

        this.paramsTag = [...this.getCarLocationParams, ...this.getRatingParams];
        this.driver$.subscribe((res) => {
          this.totalCabAvailable = res.length;
          this.driverDetails = this.nftService.checkNFTPurchased(res);
          console.log("this.driverDetails >>>>>", this.driverDetails);
          this.d_pagination = this.paginationService.getPager(this.driverDetails?.length, +this.pageNo, 10);
          this.driverDetails = this.driverDetails?.slice(this.d_pagination.startIndex, this.d_pagination.endIndex + 1);
        })
      }

    })
  }

  ngOnChanges() {
    // If No Sidebar
    if (this.noSidebar) {
      if (!Object.keys(this.params).length) {
        this.paramsTag = [];
        this.store.dispatch(new getCab(this.paramsTag, this.priceData));
      }
    }
  }

  setPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: "merge"
    });
  }

  removeTag(value: string) {
    this.getCarLocationParams = this.getCarLocationParams.filter((car_location: string) => car_location != value);
    this.getCarTypeParams = this.getCarTypeParams.filter((car_type: string) => car_type != value);
    this.getCarCapacityParams = this.getCarCapacityParams.filter((capacity: string) => capacity != value);
    this.getRatingParams = this.getRatingParams.filter((rating: string) => rating != value);
    this.getCarOptionParams = this.getCarOptionParams.filter((car_option: string) => car_option != value);


    let params = {
      car_location: this.getCarLocationParams.length ? this.getCarLocationParams.join(',') : null,
      car_type: this.getCarTypeParams.length ? this.getCarTypeParams.join(',') : null,
      capacity: this.getCarCapacityParams.length ? this.getCarCapacityParams.join(',') : null,
      rating: this.getRatingParams.length ? this.getRatingParams.join(',') : null,
      car_option: this.getCarOptionParams.length ? this.getCarOptionParams.join(',') : null
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });

  }

  openResponsiveFilter() {
    this.cabService.isOpenResponsiveFilter = true;
  }

  async bookNow(details: any) {
    if (this.auth.isLoggedIn) {
      if (this.gs.isLicenseVerified) { // need to do
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
        car_location: this.getCarLocationParams.length ? this.getCarLocationParams.join(',') : null,
        car_type: this.getCarTypeParams.length ? this.getCarTypeParams.join(',') : null,
        capacity: this.getCarCapacityParams.length ? this.getCarCapacityParams.join(',') : null,
        rating: this.getRatingParams.length ? this.getRatingParams.join(',') : null,
        car_option: this.getCarOptionParams.length ? this.getCarOptionParams.join(',') : null
      }
      this.router.navigate(['/cab/booking/booking', details.id], {
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

  addRemoveWishlist(item: any): void {
    if (this.auth.isLoggedIn) {
      item.isAddWishlist = !item.isAddWishlist;
      let myWishlist = this.gs.getMyWishlistData();
      if (item.isAddWishlist) {
        myWishlist.push(item);
        this.toast.successToastr("Added to your Favourite");
      } else {
        let index = myWishlist.findIndex((i: any) => i.id === item.id);
        myWishlist.splice(index, 1);
        this.toast.successToastr("Removed from your Favourite");
      }
      localStorage.setItem('MyWishlistStore', JSON.stringify(myWishlist));
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

  openImportantNoticeDialog(): void {
    this.dialog.open(ImportantNoticeDialogComponent, {
      width: '60%',
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
      queryParams: { car_type: this.selectedCarType.length ? this.selectedCarType.join(",") : null },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
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
      // this.tableData = this.nftService.checkNFTPurchased(this.tableData);
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
