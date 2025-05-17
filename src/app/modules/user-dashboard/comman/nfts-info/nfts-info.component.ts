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
import { RolePermissionService } from '../../../../shared/services/rolepermission.service';
import { NgSelectModule } from '@ng-select/ng-select';

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
    NgSelectModule,
  ],
  templateUrl: './nfts-info.component.html',
  styleUrl: './nfts-info.component.scss'
})

export class NftsInfoComponent {
  pageSize: number = 5;
  currentPage: number = 1; //

  totalRecord: any = 0;
  searchText: any;
  editIndex: any = 0;
  tableData: any = [];
  walletAddress: string | null = null;
  nftDetails: any = null;
  search: any = null;
  pageHeading: any = null;
  roleId: any = null;
  rolesList: any = []

  constructor(
    private toast: ToastService,
    private modalService: NgbModal,
    private nftService: NftService,
    public gs: GlobalService,
    private roleService: RolePermissionService,
  ) {
  }

  public ngOnInit() {

    // this.driverService.getVerifiedDriver().subscribe((apiRes: any) => {
    //   console.log("apiRes >>>>>>>", apiRes);
    //   const driverList = apiRes.driver.filter((item: any) => item.kyc_id)
    //   this.totalRecord = driverList.length;
    //   this.tableData = this.nftService.checkNFTPurchased(driverList);
    // });
    this.onSearch();
    this.getRolesList();
  }

  getRolesList() {
    this.roleService.GetRolesList({
      userRole: 'general'
    }).subscribe((res: any) => {
      this.rolesList = res;
    })
  }

  onSearch(searchFrom?: any) {
    if (searchFrom == 'search') {
      this.currentPage = 1;
    }

    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "roleId": this.roleId,
      "masterSearch": this.search?.trim() || "",
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize
    }

    this.gs.isSpinnerShow = true;
    this.nftService.GetNftDocDetails(body).subscribe((res: any) => {
      console.log("GetNftDocDetails >>>>>", res);
      this.gs.isSpinnerShow = false;
      this.totalRecord = res.viewModel?.totalCount || 0;
      this.pageHeading = res.viewModel?.pageHeading || 0;
      this.tableData = res.nftDocsInfos || [];

    })
  }

  onReset() {
    this.search = null;
    this.roleId = null;
    this.onSearch();
  }

  pageChanged(event: any) {
    this.currentPage = event;
    this.onSearch();
  }

  async connectWallet() {
    try {
      this.walletAddress = await this.nftService.connectWallet(this.tableData[0].recieverContractId);
      console.log("this.walletAddress >>>>>", this.walletAddress);
    } catch (error) {
      console.error(error);
    }
  }

  async purchaseNFT(item: any) {
    try {
      if (!this.walletAddress) {
        this.walletAddress = await this.nftService.connectWallet(item.recieverContractId);
      }
      console.log("item >>>>>>", item);
      console.log("this.walletAddress >>>>>", this.walletAddress);

      await this.nftService.purchaseNFT(item);
      this.onSearch();
      // this.tableData = this.nftService.checkNFTPurchased(this.tableData);
    } catch (error) {
      console.error(error);
    }
  }

  async viewNFT(item: any, type: any) {
    console.log("item >>>>>", item);

    if (type === 'view') {
      window.open(item.nftUrl);
    }
    if (type === 'download') {
      this.gs.downloadFile(item.contactname + ' KYC', item.nftUrl);
    }
    return;
    try {
      if (!this.walletAddress) {
        this.walletAddress = await this.nftService.connectWallet("");
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
}
