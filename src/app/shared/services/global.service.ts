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
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';


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

  async exportToExcelCustom(data: any[], fileName: string, title: string) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    let border: any = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    }

    if (!data || data.length === 0) return;

    // Extract headers
    const headers = Object.keys(data[0]);

    // Title Row
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    titleRow.height = 35;
    worksheet.mergeCells(1, 1, 1, headers.length);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.border = border;

    // Header Row
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "ffffff" } };
      cell.border = border;
      cell.alignment = { vertical: "middle", horizontal: "left" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "001940" },
      };
    });
    headerRow.height = 25;

    // Track totals
    const totalColumns: Record<string, { colIndex: number; values: number[] }> = {};

    // Add Data Rows
    data.forEach((row) => {
      const newRow: any[] = [];

      headers.forEach((key) => {
        const col = row[key];
        if (col && typeof col === "object" && "value" in col) {
          newRow.push(col.value);

          // If column marked as total → collect numeric value
          if (col.isTotal) {
            if (!totalColumns[key]) {
              totalColumns[key] = { colIndex: headers.indexOf(key) + 1, values: [] };
            }
            const num = parseFloat(String(col.value).replace(/[^\d.-]/g, ""));
            if (!isNaN(num)) totalColumns[key].values.push(num);
          }
        } else {
          newRow.push(col);
        }
      });

      const excelRow = worksheet.addRow(newRow);
      headers.forEach((key, colIndex) => {
        const col = row[key];
        if (col && typeof col === "object") {
          const cell = excelRow.getCell(colIndex + 1);
          if (col.font) cell.font = col.font;
          if (col.border) cell.border = col.border;
          if (col.alignment) cell.alignment = col.alignment;
          if (col.fill) cell.fill = col.fill;
        }
      });
    });

    // Add Total Row if needed
    if (Object.keys(totalColumns).length > 0) {
      const totalRow = worksheet.addRow([]);
      Object.keys(totalColumns).forEach((key) => {
        const { colIndex, values } = totalColumns[key];
        totalRow.getCell(colIndex - 1).value = "TOTAL";
        totalRow.getCell(colIndex - 1).font = { bold: true };
        totalRow.getCell(colIndex - 1).border = border;
        totalRow.getCell(colIndex - 1).alignment = { horizontal: "right" };

        const sum = values.reduce((a, b) => a + b, 0);
        const cell = totalRow.getCell(colIndex);
        cell.value = sum;
        cell.font = { bold: true, color: { argb: "0000FF" } }; // blue for total
        cell.border = border;
        cell.alignment = { horizontal: "right" };
      });
    }

    // Auto-fit columns
    worksheet.columns.forEach((column: any) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell: any) => {
        if (cell.value != title) {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        }
      });
      column.width = maxLength + 4;
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  }

  async exportToExcelWithNested(data: any[], fileName: string, title: string): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vehicles');
    let currentRow = 2;
    let border: any = {
      top: { style: "medium" },
      left: { style: "medium" },
      bottom: { style: "medium" },
      right: { style: "medium" },
    }

    // Column Headers for Vehicles
    const headers = [
      'SL',
      'Vin Number',
      'Car Name',
      'Owner Name',
      'Plate Number',
      'Per Day Price',
      'Vehicle Status',
      'Status'
    ];

    // Title Row
    const titleRow = worksheet.addRow([title]);
    titleRow.font = { bold: true, size: 16 };
    titleRow.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    titleRow.height = 35;
    worksheet.mergeCells(1, 1, 1, headers.length);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.border = border;

    // ====== Loop Owners ======
    data.forEach((owner, index) => {
      // Owner Header
      const ownerRow = worksheet.addRow([
        `${index + 1}. ${owner.ownerName} - ${owner.userStatus} - ${owner.roleName}`
      ]);
      worksheet.mergeCells(currentRow, 1, currentRow, 8);
      ownerRow.getCell(1).font = { bold: true, size: 13 };
      ownerRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
      ownerRow.height = 30;
      currentRow++;

      const headerRow = worksheet.addRow(headers);
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: "ffffff" } };
        cell.border = border;
        cell.alignment = { vertical: "middle", horizontal: "left" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "001940" },
        };
      });
      headerRow.height = 25;
      currentRow++;

      // Vehicle Rows
      owner.allVehicles.forEach((vehicle: any, idx: any) => {
        const row = worksheet.addRow([
          idx + 1,
          vehicle.vin || '-',
          vehicle.carName || '-',
          vehicle.ownerName || '-',
          vehicle.plateNumber || '-',
          vehicle.perDayPrice || '-',
          vehicle.vehicleStatus || '-',
          vehicle.status || '-',
        ]);
        row.eachCell(cell => {
          cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
          cell.border = border;
        });
        currentRow++;
      });

      // Leave space between owners
      worksheet.addRow([]);
      currentRow++;
    });

    // Auto column width (ignore Title Row + Owner Rows)
    worksheet.columns.forEach((col: any, colIndex) => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, (cell: any, rowNumber: any) => {
        const value = cell.value ? cell.value.toString() : '';
        const isTitleRow = rowNumber === 1;
        const row = worksheet.getRow(rowNumber);
        const isOwnerRow =
          row.getCell(1).font?.bold &&
          row.getCell(1).font?.size === 13 &&
          row.getCell(1).alignment?.horizontal === 'left'
        if (!isTitleRow && !isOwnerRow && value.length > maxLength) {
          maxLength = value.length;
        }
      });
      col.width = maxLength + 4;
    });

    // Save file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  }

  async exportToExcelWithNested2(
    data: any[],
    fileName: string,
    title: string,
  ) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // --- Add Title Row ---
    const firstDataRow = data.find((row) => row && !row.isHeader);
    const columnsCount = firstDataRow ? Object.keys(firstDataRow).length : 1;
    const titleRow = worksheet.addRow([title]);

    worksheet.mergeCells(1, 1, 1, columnsCount);
    titleRow.getCell(1).font = { size: 16, bold: true };
    titleRow.getCell(1).alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    titleRow.height = 25;
    worksheet.addRow([]); // blank row after title

    const totalColumns: Record<number, number[]> = {};

    // Recursive function for adding rows
    function addRows(rows: any[], depth = 0) {
      for (const row of rows) {
        if (!row || typeof row !== "object") continue;

        const values: any[] = [];
        const keys: string[] = [];
        const nestedKeys: string[] = [];

        // Separate direct keys and nested arrays
        for (const [key, val] of Object.entries(row)) {
          if (Array.isArray(val)) nestedKeys.push(key);
          else keys.push(key);
        }

        // Add current row values
        keys.forEach((key) => {
          const cellData = row[key];
          if (cellData && typeof cellData === "object" && "value" in cellData) {
            values.push(cellData.value);
          } else {
            values.push(cellData);
          }
        });

        const newRow = worksheet.addRow(values);

        // Style cells
        keys.forEach((key, index) => {
          const cellData = row[key];
          const cell = newRow.getCell(index + 1);
          cell.alignment = { vertical: "middle", wrapText: true };
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };

          // Apply font/border from config
          if (cellData && typeof cellData === "object") {
            if (cellData.font) cell.font = cellData.font;
            if (cellData.border) cell.border = cellData.border;
            if (cellData.isTotal) {
              if (!totalColumns[index + 1]) totalColumns[index + 1] = [];
              const numericValue = parseFloat(cellData.value);
              if (!isNaN(numericValue)) totalColumns[index + 1].push(numericValue);
            }
          }
        });

        // Handle nested arrays (e.g., allVehicles)
        nestedKeys.forEach((nestedKey) => {
          const nestedData = row[nestedKey];
          if (Array.isArray(nestedData) && nestedData.length > 0) {
            // Add a header row for nested data
            const nestedHeader = Object.keys(nestedData[0]);
            const headerRow = worksheet.addRow(nestedHeader);
            headerRow.font = { bold: true };
            headerRow.eachCell((cell) => {
              cell.border = {
                top: { style: "medium" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
              };
            });
            addRows(nestedData, depth + 1);
          }
        });
      }
    }

    // Add all rows recursively
    addRows(data);

    // --- Add Totals ---
    const totalRow = worksheet.addRow([]);
    totalRow.font = { bold: true };
    totalRow.getCell(1).value = "Total";

    Object.keys(totalColumns).forEach((colIndexStr) => {
      const colIndex = parseInt(colIndexStr, 10);
      const total = totalColumns[colIndex].reduce((a, b) => a + b, 0);
      const totalCell = totalRow.getCell(colIndex);
      totalCell.value = total;
      totalCell.font = { bold: true, color: { argb: "008000" } };
      totalCell.alignment = { horizontal: "right" };
    });

    // --- Auto-fit columns (skip title row) ---
    worksheet.columns.forEach((col: any) => {
      let maxLength = 10;
      col.eachCell({ includeEmpty: true }, (cell: any, rowNum: any) => {
        if (rowNum <= 2) return; // skip title + empty row
        const cellValue = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, cellValue.length + 2);
      });
      col.width = maxLength;
    });

    // --- Save ---
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${fileName}.xlsx`);
  }


  // Helper function to convert a column number to an Excel letter
  numberToColumnLetter(num: number) {
    let letter = '';
    while (num > 0) {
      let temp = (num - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      num = (num - temp - 1) / 26;
    }
    return letter;
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
}
