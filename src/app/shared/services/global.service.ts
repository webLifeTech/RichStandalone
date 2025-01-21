import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { usaStates } from '../interface/common';
import { ImageFileModalComponent } from '../components/comman/modal/image-file-modal/image-file-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModalComponent } from '../components/comman/modal/pdf-viewer-modal/pdf-viewer-modal.component';
import { ToastService } from './toast.service';
// import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isLicenseVerified: boolean = false;
  isModificationOn: boolean = false;

  isFleetOwnerLicenseVerified: boolean = false;
  isIndCarOwnerLicenseVerified: boolean = false;
  isDivComeOwnedCarLicenseVerified: boolean = false;
  lastSearch: any = {};
  loggedInUserInfo: any = {};

  // Get Currency
  public currencyItem = localStorage.getItem("currency");
  public currency: string = 'usd';

  // Loader
  isSpinnerShow: boolean = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private toast: ToastService,
    // private datePipe: DatePipe
  ) {
    this.isLicenseVerified = localStorage.getItem('isLicenseVerified') === 'true' || false;
    this.isFleetOwnerLicenseVerified = localStorage.getItem('isFleetOwnerLicenseVerified') === 'true' || false;
    this.isIndCarOwnerLicenseVerified = localStorage.getItem('isIndCarOwnerLicenseVerified') === 'true' || false;
    this.isDivComeOwnedCarLicenseVerified = localStorage.getItem('isDivComeOwnedCarLicenseVerified') === 'true' || false;
    this.loggedInUserInfo = localStorage.getItem('loggedInUser') ? JSON.parse(localStorage.getItem('loggedInUser') || "") : {};

    if (!localStorage.getItem('currency')?.length) {
      this.currency = 'usd';
      localStorage.setItem('currency', 'usd')
    } else {
      if (this.currencyItem !== null) {
        this.currency = this.currencyItem;
      }
    }
  }

  // usStates
  usStates(): Observable<usaStates> {
    return this.http.get<usaStates>('assets/json/states.json');
  }

  getLastSearch() {
    return localStorage.getItem('lastSearch') ? JSON.parse(localStorage.getItem('lastSearch') || '{}') : {};
  }

  licenseVerified() {
    this.isLicenseVerified = true;
    localStorage.setItem('isLicenseVerified', 'true');
  }

  getDriverInfo() {
    return localStorage.getItem('driverInfoData') ? JSON.parse(localStorage.getItem('driverInfoData') || '{}') : {};
  }

  fleetOwnerLicenseVerified() {
    this.isFleetOwnerLicenseVerified = true;
    localStorage.setItem('isFleetOwnerLicenseVerified', 'true');
  }

  getFleetOwnerInfo() {
    return localStorage.getItem('fleetOwnerKycData') ? JSON.parse(localStorage.getItem('fleetOwnerKycData') || '{}') : {};
  }

  indCarOwnerLicenseVerified() {
    this.isIndCarOwnerLicenseVerified = true;
    localStorage.setItem('isIndCarOwnerLicenseVerified', 'true');
  }

  getIndCarOwnerInfo() {
    return localStorage.getItem('individualCarOwnerKycData') ? JSON.parse(localStorage.getItem('individualCarOwnerKycData') || '{}') : {};
  }

  divComeOwnedCarLicenseVerified() {
    this.isDivComeOwnedCarLicenseVerified = true;
    localStorage.setItem('isDivComeOwnedCarLicenseVerified', 'true');
  }

  getDivComeOwnedCarInfo() {
    return localStorage.getItem('divComeOwnedCarKycData') ? JSON.parse(localStorage.getItem('divComeOwnedCarKycData') || '{}') : {};
  }

  getDriverDetailsData() {
    return localStorage.getItem('driverDetailsData') ? JSON.parse(localStorage.getItem('driverDetailsData') || '{}') : {};
  }

  getMyWishlistData() {
    return localStorage.getItem('MyWishlistStore') ? JSON.parse(localStorage.getItem('MyWishlistStore') || '[]') : [];
  }


  viewDocumentFile(documentFile?: any): void {

    if (!documentFile) {
      this.toast.warningToastr("File Not Uploaded!");
      return;
    }

    if (documentFile.includes('.pdf')) {
      const modalRef = this.modalService.open(PdfViewerModalComponent, {
        centered: true,
        size: 'lg'
      });
      modalRef.componentInstance.pdfIframe = documentFile;
    } else {

      // PdfViewerModalComponent
      const modalRef = this.modalService.open(ImageFileModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.image = documentFile;
    }

  }

  viewTest() {
    this.dialog.open(ImageFileModalComponent, {
      width: '600px',
      panelClass: 'custom-dialog',
      data: {}
    });
  }

  generateUniqueId() {
    return Math.floor(100000 + Math.random() * 900000); // Ensures a 6-digit number
  }

  // transformDate(date: any, format: any) {
  //   return this.datePipe.transform(date, format);
  // }
}
