import { Component, Input } from '@angular/core';
import { CabService } from '../../../../services/cab.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../../pipe/currency.pipe';
import { GlobalService } from '../../../../services/global.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-subscription-template',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CurrencySymbolPipe
  ],
  templateUrl: './subscription-template.component.html',
  styleUrl: './subscription-template.component.scss'
})
export class SubscriptionTemplateComponent {

  @Input() type: any = "";
  @Input() currentPlan: any = {};

  details: any = {
    "id": 1,
    "transactionID": "SHJG12155215",
    "carName": "Peugeot Citroen",
    "carBrand": "Peugeot",
    "carImage": "assets/images/cab/car/5.png",
    "brandLogo": "assets/images/cab/logo/Avis-Logo.png",
    "carImages": [
      {
        "url": "assets/images/cab/car/12.jpg",
        "fileType": "image"
      },
      {
        "url": "assets/images/cab/car/13.jpg",
        "fileType": "image"
      }
    ],
    "carType": "car_list_page.car_type.sadan",
    "unlimittedMileage": true,
    "price": 1200,
    "offer_discount": 0,
    "fare": 25,
    "per_km": 10,
    "passenger": 5,
    "luggage": 2,
    "gearbox": "car_list_page.car_option.automatic",
    "carOption": "automatic",
    "rating": 4,
    "review": 24,
    "category": "popular",
    "tags": [
      "sadan",
      "four",
      "1_5",
      "automatic"
    ]
  }

  driverDetails: any = {
    "id": 1,
    "carName": "Peugeot Citroen",
    "carImage": "assets/images/cab/car/5.png",
    "carImages": [
      {
        "url": "assets/images/cab/car/12.jpg",
        "fileType": "image"
      },
      {
        "url": "assets/images/cab/car/13.jpg",
        "fileType": "image"
      }
    ],
    "carType": "car_list_page.car_type.sadan",
    "status": "car_list_page.status.booked",
    "price": 1200,
    "offer_discount": 15,
    "fare": 25,
    "per_km": 10,
    "passenger": 5,
    "luggage": 2,
    "gearbox": "car_list_page.car_option.automatic",
    "carOption": "automatic",
    "rating": 2,
    "reviews": 64,
    "category": "popular",
    "tags": ["sadan", "two", "1_5", "automatic"],
    "driverName": "John Doe",
    "driverImage": "assets/images/driver/d1.png",
    "location": "New York, NY",
    "experience": 5
  }

  constructor(
    public gs: GlobalService
  ) {
    setTimeout(() => {
      this.downloadPDF();
    }, 500);
  }

  downloadPDF() {
    const invoiceElement = document.getElementById('invoice-template');

    if (invoiceElement) {
      html2canvas(invoiceElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a5');
        const imgWidth = 147; // A4 width in mm
        const pageHeight = 220; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save(this.details.transactionID + '.pdf');
      });
    }
  }

}
