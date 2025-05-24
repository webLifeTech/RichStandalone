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
import { NgbModal, NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { InformationModalComponent } from '../../modal/information-modal/information-modal.component';
import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { ToastService } from '../../../../services/toast.service';
import { NftService } from '../../../../services/nft.service';
import { FavoriteService } from '../../../../services/favorite.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApexchartsComponent } from '../../../../../modules/admin-dashboard/widgets/apexcharts/apexcharts.component';

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
    NgbPopoverModule,
    ApexchartsComponent
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
  searchInfo: any = {};

  stars = [
    { label: 'Very Good', percentage: "★★★★★" },
    { label: 'Good', percentage: "★★★★" },
    { label: 'Average', percentage: "★★★" },
    { label: 'Below Average', percentage: "★★" },
    { label: 'Poor', percentage: "★" }
  ];

  ratingInfo: any = {};
  isShowBatchChart: boolean = false;
  batchChart: any = {
    series: [],
    chartLabels: []
  };

  userDetails: any = {
    "data": {
      "series": [
        {
          name: "Active",
          data: [44, 55, 57, 56]
        },
        {
          name: "Inactive",
          data: [76, 85, 101, 98]
        },
        {
          name: "KYC Pending",
          data: [35, 41, 36, 26]
        },
      ],
      "chartLabels": ["Car Owners (155)", "Drivers (181)", "Fleet Company (194)", "Driver Owned Cars (180)"],
      "chartColors": ["#dcc7fa", "#8e33ff"],
    }
  };

  riskScore: number = 24;

  constructor(
    public cabService: CabService,
    private paginationService: PaginationService,
    private router: Router,
    private route: ActivatedRoute,
    public auth: AuthService,
    public gs: GlobalService,
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
    // this.searchResult.vehicleMatches[0].riskRating = 5;
    // this.searchResult.vehicleMatches[1].riskRating = 3.6;
    // this.searchResult.vehicleMatches[2].riskRating = 2;
    for (let i in this.searchResult.vehicleMatches) {
      if (this.searchResult.vehicleMatches[i].type === 'car' && !this.auth.isLoggedIn) {
        this.searchResult.vehicleMatches[i].maxRate = Math.ceil(this.searchResult.vehicleMatches[i].ratingAverage);
      }
      if (this.searchResult.vehicleMatches[i].type === 'driver' && !this.auth.isLoggedIn) {
        this.searchResult.vehicleMatches[i].maxRate = Math.ceil(this.searchResult.vehicleMatches[i].driverRating);
      }
      if (this.auth.isLoggedIn) {
        this.searchResult.vehicleMatches[i].maxRate = Math.ceil(this.searchResult.vehicleMatches[i].riskRating);
      }
    }
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
            this.router.navigateByUrl('/user/profile')
          }
        }, () => { });
        return;
      }

      if (this.gs.loggedInUserInfo.userId === details.userId && this.type === 'car' || this.gs.loggedInUserInfo.userId === details.userid && this.type === 'driver') {
        details.isSelfWarn = true;
        setTimeout(() => {
          details.isSelfWarn = false;
        }, 5000);
        // this.toast.warningToastr("You can't book your own vehicle");
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

  async onHover(item: any) {

    console.log("item >>>", item);
    this.ratingInfo = {};
    let res: any = {};
    this.isShowBatchChart = false;
    this.batchChart.series = [];
    this.batchChart.chartLabels = [];
    if (this.type === 'car') {
      res = await this.cabService.GetVehicleRates({
        "vehicleId": item.vehicleId,
        "vin": item.vin
      });

      this.ratingInfo = res;
    }
    if (this.type === 'driver') {
      res = await this.cabService.GetDriverRates({
        "driverId": item.driverId,
        "licenseNo": item.licenseNo || "",
      });
      this.ratingInfo = res;
      // this.ratingInfo = {
      //   "driverBatchId": 331,
      //   "averageBatchRiskScore": 18,
      //   "averageBatchStarRating": 4.00,
      //   "batchQuality": {
      //     "veryGood": 0,
      //     "good": 1,
      //     "average": 0,
      //     "belowAverage": 0,
      //     "poor": 0
      //   },
      //   "totalRecords": 1,
      //   "riskAssessments": [
      //     {
      //       "licenseNumber": "XXXXX0003",
      //       "activityId": "",
      //       "calculatedDriverRiskScore": 18,
      //       "calculatedAt": "05/08/2025",
      //       "maxRiskScore": 51,
      //       "minRiskScore": 8,
      //       "starRating": 4.00,
      //       "recommendations": [
      //         {
      //           "attribute": "Accident Analysis",
      //           "recommendtions": [
      //             "Review accident details and provide targeted training.",
      //             "Maintain current safety measures and monitoring."
      //           ]
      //         },
      //         {
      //           "attribute": "Driver Analysis",
      //           "recommendtions": [
      //             "Regular health and vision check-ups in addition to standard safety training.",
      //             "Provide extensive training and mentorship programs."
      //           ]
      //         },
      //         {
      //           "attribute": "License Status",
      //           "recommendtions": [
      //             "Renew license as soon as possible. Check for any other compliance issues that need to be addressed."
      //           ]
      //         },
      //         {
      //           "attribute": "Violation Analysis",
      //           "recommendtions": [
      //             "Continue safe driving practices.",
      //             "Maintain current practices; monitor for changes."
      //           ]
      //         }
      //       ],
      //       "isClearanceHistoryPresent": false,
      //       "isDriverLossHistoryPresent": false
      //     }
      //   ],
      //   "responseResultDtos": {
      //     "statusCode": "200",
      //     "status": "Success",
      //     "message": "Rates found"
      //   }
      // }
    }
    console.log(this.type + " res >>>>>>", res);

    if (res && res.responseResultDtos && res.responseResultDtos.statusCode == "200") {
      const tempBatchQuality: any = {
        "veryGood": "Very Good",
        "good": "Good",
        "average": "Average",
        "belowAverage": "Below Average",
        "poor": "Poor"
      }
      for (let i in this.ratingInfo.batchQuality) {
        this.batchChart.series.push(this.ratingInfo.batchQuality[i]);
        this.batchChart.chartLabels.push(tempBatchQuality[i]);
        if (this.ratingInfo.batchQuality[i]) {
          this.ratingInfo.type = tempBatchQuality[i];
        }
      }
      const riskAs = this.ratingInfo?.riskAssessments[0] || {};
      this.ratingInfo.riskPercentage = (((riskAs.calculatedDriverRiskScore || riskAs.calculatedVehicleRiskScore) - riskAs.minRiskScore) / (riskAs.maxRiskScore - riskAs.minRiskScore)) * 100 || 0;

      // this.batchChart.series = [3, 2, 3, 4, 5];
      this.isShowBatchChart = true;
      console.log("this.batchChart >>>>>>", this.batchChart);
      console.log("percentage >>>>>>", this.ratingInfo.riskPercentage);
      console.log("ratingInfo >>>>>>", this.ratingInfo);
    }
  }

  ariaValueText(current: number, max: number) {
    return `${current} out of ${max} hearts`;
  }
  checkDisabled(details: any) {
    let disablePopover = false;
    if (this.type === 'car' && !details.ratingAverage && !this.auth.isLoggedIn) {
      disablePopover = true;
    }
    if (this.type === 'driver' && !details.driverRating && !this.auth.isLoggedIn) {
      disablePopover = true;
    }
    if (!details.riskRating && this.auth.isLoggedIn) {
      disablePopover = true;
    }
    return disablePopover;
  }

}
