import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../shared/services/toast.service';
import { GlobalService } from '../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../../shared/services/profile.service';
// import { SecurityComponent } from './security/security.component';
// import { PreferencesComponent } from './preferences/preferences.component';
// import { NotificationsComponent } from './notifications/notifications.component';
import { SettingsService } from '../../../shared/services/setting.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-user-documents',
  standalone: true,
  imports: [
    // SecurityComponent,
    // PreferencesComponent,
    // NotificationsComponent,
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    NgxPaginationModule,
  ],
  templateUrl: './user-documents.component.html',
  styleUrl: './user-documents.component.scss'
})
export class UserDocumentsComponent {
  public searchDataValue = '';
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  public tableData: any = [];
  sortColumn: any = "";
  sortOrder: any = "DESC";

  activeTab: any = "";
  activeTabName: any = '';
  sidebarTabs: any = [];


  constructor(
    private route: ActivatedRoute,
    public gs: GlobalService,
    private profileService: ProfileService,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.getConfigUIForms();
    })
  }

  getConfigUIForms() {
    let body = {
      "stateCode": "42",
      "languageId": 1,
      "roleName": this.gs.loggedInUserInfo.roleName || null,
      "countryId": 230,
      "transactionId": 1,
      "menuId": 88
    }
    this.gs.isSpinnerShow = true;
    this.profileService.getConfigUIForms(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response && response.length) {
        this.sidebarTabs = response;
        this.activeTab = this.sidebarTabs[0].formId;
        this.activeTabName = this.sidebarTabs[0].formName;
        this.getUploadedDocuments();
      }
    }, (err: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  changeKycTab(tab: any) {
    this.activeTab = tab.formId;
    this.activeTabName = tab.formName;
    this.tableData = [];
    this.totalData = 0;
    if (this.activeTab === 38) {
      this.getUploadedDocuments();
    }
    if (this.activeTab === 39) {
      this.getGeneratedDocuments();
    }
    window.scrollTo({ top: 300, behavior: 'smooth' });
  }

  pageChanged(event: any) {
    this.currentPage = event;
    // this.getTableData();
    if (this.activeTab === 38) {
      this.getUploadedDocuments();
    }
    if (this.activeTab === 39) {
      this.getGeneratedDocuments();
    }
  }

  getGeneratedDocuments() {
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
    }

    this.gs.isSpinnerShow = true;
    this.profileService.GetGeneratedDocuments(body).subscribe(async (response: any) => {
      console.log("response >>>", response);
      this.gs.isSpinnerShow = false;

      if (response.response && response.response.statusCode == "200") {
        this.tableData = response.gridList;
        this.totalData = response.viewModel.totalCount;
      }
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

  getUploadedDocuments() {
    const body = {
      "userId": this.gs.loggedInUserInfo.userId,
      "pageNumber": this.currentPage,
      "pagesize": this.pageSize,
      "globalSearch": this.searchDataValue?.trim() || "",
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
    }

    this.gs.isSpinnerShow = true;
    this.profileService.GetUploadedDocuments(body).subscribe(async (response: any) => {
      console.log("response >>>", response);
      this.gs.isSpinnerShow = false;

      if (response.response && response.response.statusCode == "200") {
        this.tableData = response.gridList;
        this.totalData = response.viewModel.totalCount;
      }
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    })
  }

}
