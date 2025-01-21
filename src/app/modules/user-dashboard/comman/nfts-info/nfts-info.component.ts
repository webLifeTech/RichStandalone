import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../../../shared/services/alert.service';
import { PaginationService } from '../../../../shared/services/pagination.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CommonModule } from '@angular/common';
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

  userList: any = [
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
    private nftService: NftService
  ) {
  }

  ngOnInit() {
  }

  async connectWallet() {
    try {
      this.walletAddress = await this.nftService.connectWallet();
      console.log("this.walletAddress >>>>>", this.walletAddress);

    } catch (error) {
      console.error(error);
    }
  }

  async purchaseNFT() {
    try {
      await this.nftService.purchaseNFT(this.uniqIdToPurchase, this.priceToPurchase);
    } catch (error) {
      console.error(error);
    }
  }

  async viewNFT() {
    try {
      this.nftDetails = await this.nftService.viewNFT(this.uniqIdToView);
    } catch (error) {
      console.error(error);
    }
  }

  connectedAccount: string | null = null;
  metaMaskChecked: boolean = false;



  async connectToMetaMask() {
    this.metaMaskChecked = true;
    this.connectedAccount = await this.connectMetaMask();

    console.log("this.connectedAccount >>>>>>>", this.connectedAccount);

  }

  async checkMetaMask(): Promise<boolean> {
    if (typeof (window as any).ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
      return true;
    } else {
      console.error('MetaMask is not installed.');
      return false;
    }
  }

  // Connect to MetaMask and retrieve accounts
  async connectMetaMask(): Promise<string | null> {
    if (await this.checkMetaMask()) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });

        console.log('Connected account:', accounts[0]);
        this.toast.successToastr("Wallet Connected")
        return accounts[0];
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        return null;
      }
    } else {
      alert('MetaMask not installed. Please install it from https://metamask.io/');
      return null;
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
