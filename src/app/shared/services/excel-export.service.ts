import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { saveAs } from 'file-saver';
import * as ExcelJS from 'exceljs';


@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  baseUrl1 = environment.apiUrl1;

  endpoints: any = {
    "ExportUserBookingsToExcel": "TLHUB/Excel/ExportUserBookingsToExcel",
    "ExportUserBookingPaymentsToExcel": "TLHUB/Excel/ExportUserBookingPaymentsToExcel",
    "ExportUserWalletPaymentsToExcel": "TLHUB/Excel/ExportUserWalletPaymentsToExcel",
    "ExportUserCarListDetailsToExcel": "TLHUB/Excel/ExportUserCarListDetailsToExcel",
    "ExportUserActivityLogsToExcel": "TLHUB/Excel/ExportUserActivityLogsToExcel",
    "ExportAllBookingPaymentsToExcel": "TLHUB/Excel/ExportAllBookingPaymentsToExcel",
    "ExportAllPendingConfirmationPaymentsToExcel": "TLHUB/Excel/ExportAllPendingConfirmationPaymentsToExcel",
    "ExportAllPendingClearancePaymentsToExcel": "TLHUB/Excel/ExportAllPendingClearancePaymentsToExcel",
    "ExportAllBookingRefundDetailsToExcel": "TLHUB/Excel/ExportAllBookingRefundDetailsToExcel",
    "ExportAllVehiclesToExcel": "TLHUB/Excel/ExportAllVehiclesToExcel",
    "ExportAllUsersToExcel": "TLHUB/Excel/ExportAllUsersToExcel",
    "ExportAllBookingOverviewToExcel": "TLHUB/Excel/ExportAllBookingOverviewToExcel",
    "ExportAllProviderEnquiryToExcel": "TLHUB/Excel/ExportAllProviderEnquiryToExcel",

    // ExportAllBookingPaymentsToExcel
    // ExportAllPendingConfirmationPaymentsToExcel
    // ExportAllPendingClearancePaymentsToExcel
    // ExportAllBookingRefundDetailsToExcel
    // ExportAllProviderEnquiryToExcel
    // ExportAllVehiclesToExcel
    // ExportAllUsersToExcel
    // ExportAllBookingOverviewToExcel
  }

  constructor(private http: HttpClient) { }

  // Excel -> exportToExcelPost
  public exportToExcelPost(data: any, name: string) {
    return this.http.post(this.baseUrl1 + this.endpoints[name], data).pipe(
      map((res: any) => {
        return res;
      })
    );
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

}
