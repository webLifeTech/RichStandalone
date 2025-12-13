import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GlobalService } from '../../../../../services/global.service';
import { CurrencySymbolPipe } from '../../../../../pipe/currency.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-invoice-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CurrencySymbolPipe,
  ],
  providers: [
    NgbActiveModal,
  ],
  templateUrl: './invoice-modal.component.html',
  styleUrl: './invoice-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InvoiceModalComponent {
  @Input() invoiceDetails: any = {
    bookingDetails: {},
    driverPersonalDetails: {},
    rentaldetails: {},
    vehicleOwnerPersonalDetails: {},
  };

  constructor(
    private modalService: NgbModal,
    public gs: GlobalService,
  ) { }

  ngOnInit() {
    if (this.invoiceDetails && this.invoiceDetails.bookingDetails) {
      this.invoiceDetails.bookingDetails.priceRange = (this.invoiceDetails.bookingDetails.baseAmount / this.invoiceDetails.bookingDetails.duration.split(" ")[0]) || 0;
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  downloadAndPrint(type: string) {
    this.gs.isSpinnerShow = true;
    this.gs.DownloadDocs({
      "documentId": this.invoiceDetails.bookingDetails.documentId,
    }).subscribe((res: any) => {
      this.gs.isSpinnerShow = false;
      if (type === 'print') {
        this.printInvoice(res.base64String)
      } else {
        this.gs.downloadFile(res.fileName, 'data:application/pdf;base64,' + res.base64String)
      }
    }, (error: any) => {
      this.gs.isSpinnerShow = false;
    });
  }

  printInvoice(base64: string) {
    const byteArray = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const win = window.open(blobUrl);
    win?.print();

    // const printContents = document.getElementById('invoice-bill')?.innerHTML;
    // const originalContents = document.body.innerHTML;
    // document.body.innerHTML = printContents!;
    // setTimeout(() => {
    //   window.print();
    //   document.body.innerHTML = originalContents;
    //   window.location.reload();
    // }, 100);
  }

  downloadPDF() {
    const invoiceElement = document.getElementById('invoice-bill');

    if (invoiceElement) {
      html2canvas(invoiceElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Calculate image width and height for A4 size PDF
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // If the content is higher than the first page, add more pages
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('invoice.pdf');
      });
    }
  }
}
