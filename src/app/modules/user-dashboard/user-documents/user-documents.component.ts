import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileService } from '../../../shared/services/profile.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-user-documents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule,
    NgxPaginationModule,
    NgSelectModule,
  ],
  providers: [
    DatePipe,
  ],
  templateUrl: './user-documents.component.html',
  styleUrl: './user-documents.component.scss'
})
export class UserDocumentsComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
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

  documentList: any = [];
  documentTypeCode: any = null;
  isShow: boolean = false;



  constructor(
    private route: ActivatedRoute,
    public gs: GlobalService,
    private profileService: ProfileService,
    private datePipe: DatePipe,
  ) {
    this.route.queryParams.subscribe((params) => {
      this.getConfigUIForms();
      this.getDocumentTypes();
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

  async getDocumentTypes() {
    let todayDate = new Date();
    const effectiveDate = this.transformDate(todayDate, 'MM/dd/yy');
    this.documentList = await this.profileService.getMasterTypeIds({
      "stateCode": "42",
      "typeCode": 26,
      "effectiveDate": effectiveDate,
    });
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

  downloadDoc(documentId: any) {
    this.gs.isSpinnerShow = true;
    this.gs.DownloadDocs({
      "documentId": documentId,
    }).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      this.gs.downloadBase64File(res.fileName, res.base64String, res.fileType)
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    });
  }

  searchData() {
    this.currentPage = 1;
    if (this.activeTab === 38) {
      this.getUploadedDocuments();
    }
    if (this.activeTab === 39) {
      this.getGeneratedDocuments();
    }
  }

  onAddNew() {
    this.isShow = true;
  }

  onUpload() {

  }
  onReset() {
    this.isShow = false;
    this.documentTypeCode = null;
    this.fileInput.nativeElement.value = null;
  }

  transformDate(date: any, format: any) {
    return this.datePipe.transform(date, format);
  }
}
