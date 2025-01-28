import { Component, EventEmitter, Inject, Input, Output, Renderer2 } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BranchInfoModalComponent } from '../modal/branch-info-modal/branch-info-modal.component';
import { DeleteModalComponent } from '../../../../shared/components/comman/modal/booking-modals/delete-modal/delete-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { NftService } from '../../../../shared/services/nft.service';
import { DriverService } from '../../../../shared/services/driver.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-nfts-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    TranslateModule,
    NgxPaginationModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './nfts-info.component.html',
  styleUrl: './nfts-info.component.scss'
})

export class NftsInfoComponent {
  currentPage: number = 1; //
  pageSize: number = 1;
  totalRecord: any = 0;
  searchText: any;
  editIndex: any = 0;

  @Input() formType: any;
  editInfo: any = {}
  isAdd: boolean = false;

  menuForm: any = {
    menu_name: "",
    status: null,
    sub_menu_name: "",
    parent_menu: null,
    redirect_url: "",
    description: "",
  };

  statusList: any = [
    { name: 'Active', value: true },
    { name: 'Deactive', value: false },
  ];

  tableData: any = [
    {
      "id": 1,
      "driver_name": "Jhon",
      "purchased_status": true,
    },
    {
      "id": 2,
      "driver_name": "Smith",
      "purchased_status": false,
    }
  ];

  walletAddress: string | null = null;
  uniqIdToPurchase: string = '';
  priceToPurchase: string = '';
  uniqIdToView: string = '';
  nftDetails: any = null;

  constructor(
    private toast: ToastService,
    private alert: AlertService,
    private paginationService: PaginationService,
    private modalService: NgbModal,
    private nftService: NftService,
    private driverService: DriverService,
    public gs: GlobalService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document
  ) {
  }

  public ngOnInit() {
    this.driverService.getVerifiedDriver().subscribe((apiRes: any) => {
      console.log("apiRes >>>>>>>", apiRes);
      const driverList = apiRes.driver.filter((item: any) => item.kyc_id)
      this.totalRecord = driverList.length;
      this.tableData = this.nftService.checkNFTPurchased(driverList);
    });
  }


  async connectWallet() {
    try {
      this.walletAddress = await this.nftService.connectWallet();
      console.log("this.walletAddress >>>>>", this.walletAddress);
    } catch (error) {
      console.error(error);
    }
  }

  async purchaseNFT(uniqId: any) {
    try {
      if (!this.walletAddress) {
        this.walletAddress = await this.nftService.connectWallet();
      }
      console.log("uniqId >>>>>>", uniqId);
      console.log("this.walletAddress >>>>>", this.walletAddress);

      await this.nftService.purchaseNFT(uniqId);
      this.tableData = this.nftService.checkNFTPurchased(this.tableData);
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
      for (let i in this.tableData) {
        if (this.tableData[i].kyc_id == item.kyc_id) {
          this.tableData[i].hash_key = hashKey;
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

  onView(item: any) {
    const modalRef = this.modalService.open(BranchInfoModalComponent, {
      size: 'lg'
    });
    modalRef.componentInstance.singleDetails = item;
    modalRef.result.then((res: any) => {

    }, () => {
    });
  }

  pageChanged(event: any) {
    this.currentPage = event;
  }
}
