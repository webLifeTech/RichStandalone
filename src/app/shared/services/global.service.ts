import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { usaStates } from '../interface/common';
import { ImageFileModalComponent } from '../components/comman/modal/image-file-modal/image-file-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModalComponent } from '../components/comman/modal/pdf-viewer-modal/pdf-viewer-modal.component';
import { ToastService } from './toast.service';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
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

  downloadFile(filename: any, url: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const fileURL = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileURL;
      a.download = filename + ' KYC';
      a.click();
      window.URL.revokeObjectURL(fileURL);
    });
  }

  public getEnquiries() {
    return this.http.get('assets/json/pages/enquiries.json').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  readExcel(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });
        resolve(jsonData);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  }

  groupByMasterDropdown(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  }
}
