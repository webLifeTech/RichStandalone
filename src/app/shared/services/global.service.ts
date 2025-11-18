import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { usaStates } from '../interface/common';
import { ImageFileModalComponent } from '../components/comman/modal/image-file-modal/image-file-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModalComponent } from '../components/comman/modal/pdf-viewer-modal/pdf-viewer-modal.component';
import { ToastService } from './toast.service';
import * as XLSX from 'xlsx';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  baseUrl1 = environment.apiUrl1;
  isLicenseVerified: boolean = false;
  isModificationOn: boolean = false;

  isFleetOwnerLicenseVerified: boolean = false;
  isIndCarOwnerLicenseVerified: boolean = false;
  isDivComeOwnedCarLicenseVerified: boolean = false;
  lastSearch: any = {};
  loggedInUserInfo: any = {};
  paymentDetails: any = {
    creditCard: {},
    ach: {},
    wallet: {},
    crypto: {},
  };
  bookingSummaryDetails: any = {};
  vehicleCancellationPolicy: any = [];
  couponList: any = [];

  // Get Currency
  public currencyItem = localStorage.getItem("currency");
  public currency: string = 'usd';

  // Loader
  isSpinnerShow: boolean = false;

  passRequirement = {
    passwordMinUpperCase: 1,
    passwordMinLowerCase: 1,
    passwordMinNumber: 1,
    passwordMinSymbol: 1,
    passwordMinCharacters: 8
  };
  passPattern = [
    `(?=([^A-Z]*[A-Z]){${this.passRequirement.passwordMinUpperCase},})`,
    `(?=([^a-z]*[a-z]){${this.passRequirement.passwordMinLowerCase},})`,
    `(?=([^0-9]*[0-9])\{${this.passRequirement.passwordMinNumber},\})`,
    `(?=(\.\*[\$\@\$\!\%\*\#\^\(\)\&])\{${this.passRequirement.passwordMinSymbol},\})`,
    `[A-Za-z\\d\$\@\$\!\%\*\#\^\(\)\&]{${this.passRequirement.passwordMinCharacters},}`
  ].map(item => item.toString()).join('');

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

  // COMMON -> GetUserDashboardDetails
  public GetUserDashboardDetails(dataParams: any) {
    const params = new HttpParams().set('userId', dataParams.userId);
    return this.http.get(this.baseUrl1 + 'TLHUB/COMMON/GetUserDashboardDetails', { params }).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // COMMON -> GetUserActivityLogs
  public GetUserActivityLogs(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/COMMON/GetUserActivityLogs', data).pipe(
      map((res: any) => {
        return res;
      })
    );
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
      a.download = filename;
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

  // Convert 12-hour (12:00 AM/PM) format to 24-hour (00:00) format
  convertTo24Hour(time: string): string {
    const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
    if (!match) return time;

    let [_, hours, minutes, period] = match;
    let hourNum = parseInt(hours, 10);

    if (period === 'PM' && hourNum !== 12) {
      hourNum += 12;
    } else if (period === 'AM' && hourNum === 12) {
      hourNum = 0;
    }

    return `${hourNum.toString().padStart(2, '0')}:${minutes}`;
  }

  // Convert 24-hour format (00:00) back to 12-hour format (12:00 AM/PM)
  convertTo12Hour(time: string): string {
    const [hourStr, minuteStr] = time.split(':');
    let hours = parseInt(hourStr, 10);
    const minutes = minuteStr;
    const period = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
      hours -= 12;
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  }



  getThisWeekRange() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek);
    startDate.setHours(0, 0, 0, 0);
    return { startDate };
  }

  getThisMonthRange() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate.setHours(0, 0, 0, 0);
    return { startDate };
  }

  getLast30DaysRange() {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);
    return { startDate };
  }

  normalizeDateRange(startD: string, endD: string, useUTC = false) {
    const startDate: any = startD ? new Date(startD) : null;
    const endDate: any = endD ? new Date(endD) : null;

    if (!startD || !endD) {
      return { startDate, endDate };
    }

    if (useUTC) {
      startDate.setUTCHours(0, 0, 0, 0);
      endDate.setUTCHours(23, 59, 59, 999);
    } else {
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
    }

    return { startDate, endDate };
  }
}
