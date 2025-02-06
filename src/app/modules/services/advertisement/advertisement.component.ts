import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnquiriesModalComponent } from '../../../shared/components/comman/modal/enquiries-modal/enquiries-modal.component';
import { OtpVerificationModalComponent } from '../../user-dashboard/user-settings/modals/otp-verification-modal/otp-verification-modal.component';
import { VerificationSuccessModalComponent } from '../../user-dashboard/user-settings/modals/verification-success-modal/verification-success-modal.component';

@Component({
  selector: 'app-advertisement',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.scss'
})
export class AdvertisementComponent {

  categories = [
    {
      title: 'Carpenters',
      listings: 7951,
      imageUrl: 'https://advocatesidhantdhingra.com/assets/images/blog/lawyers-near-me.jpg'
    },
    {
      title: 'Packers And Movers',
      listings: 3981,
      imageUrl: 'https://pinskymortgages.ca/wp-content/uploads/2022/01/iStock-511728582-1600x1067.jpg'
    },
    {
      title: 'Real Estate Agents',
      listings: 21010,
      imageUrl: 'https://content.jdmagicbox.com/comp/surat/v7/0261px261.x261.160820140127.g8v7/catalogue/s-kedia-olpad-surat-life-insurance-agents-lic-0lqidbrqxq.jpg'
    },
    {
      title: 'Car Rental',
      listings: 13315,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvRC2RaEhh10INABM03m9iwtFF4lW4e05GJA&s'
    },
    {
      title: 'Beauty Parlours',
      listings: 23528,
      imageUrl: 'https://pinskymortgages.ca/wp-content/uploads/2022/01/iStock-511728582-1600x1067.jpg'
    }
  ];;

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
    private modalService: NgbModal,
  ) {

  }


  openEnquirieModal() {
    const modalRef = this.modalService.open(EnquiriesModalComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
      }
    }, () => {
    });
  }
}
