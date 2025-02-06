import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencySymbolPipe } from '../../../shared/pipe/currency.pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnquiriesModalComponent } from '../../../shared/components/comman/modal/enquiries-modal/enquiries-modal.component';
import { OtpVerificationModalComponent } from '../../user-dashboard/user-settings/modals/otp-verification-modal/otp-verification-modal.component';
import { VerificationSuccessModalComponent } from '../../user-dashboard/user-settings/modals/verification-success-modal/verification-success-modal.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent {

  categories = [
    {
      name: "Brijesh Lathiya Advocate",
      category_name: "Attorney",
      logo: "https://advocatesidhantdhingra.com/assets/images/blog/lawyers-near-me.jpg",
      rating: "4.8",
      review: "25",
      location: "Downtown, New York",
      sub_category: ["Criminal Lawyer", "Family Lawyer"],
      mobile_number: "0987654321",
      whatsapp_number: "0987654321",
      isTrusted: true,
      isVerified: true,
      preference: {
        icon: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/topsearch.svg",
        label: "Top Search"
      }
    },
    {
      name: "Panwala Group",
      category_name: "Mortgage Brokers",
      logo: "https://pinskymortgages.ca/wp-content/uploads/2022/01/iStock-511728582-1600x1067.jpg",
      rating: "4.7",
      review: "30",
      location: "Financial District, San Francisco",
      sub_category: ["Home Loans", "Commercial Loans"],
      mobile_number: "0123456789",
      whatsapp_number: "0123456789",
      isTrusted: true,
      isVerified: false,
      preference: {
        icon: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/trending.svg",
        label: "Trending"
      }
    },
    {
      name: "Untvadvala Insurance",
      category_name: "Insurance Agent",
      logo: "https://content.jdmagicbox.com/comp/surat/v7/0261px261.x261.160820140127.g8v7/catalogue/s-kedia-olpad-surat-life-insurance-agents-lic-0lqidbrqxq.jpg",
      rating: "4.5",
      review: "18",
      location: "Uptown, Chicago",
      sub_category: ["Health Insurance", "Life Insurance"],
      mobile_number: "0876543210",
      whatsapp_number: "0876543210",
      isTrusted: true,
      isVerified: false,
      preference: {
        icon: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/responsive.svg",
        label: "Responsive"
      }
    },
    {
      name: "GoMechanic - Smart Car Workshop",
      category_name: "Vehicle Inspections",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvRC2RaEhh10INABM03m9iwtFF4lW4e05GJA&s",
      rating: "4.9",
      review: "45",
      location: "Midtown, Houston",
      sub_category: ["Emission Tests", "Safety Inspections"],
      mobile_number: "0567890123",
      whatsapp_number: "0567890123",
      isTrusted: true,
      isVerified: true,
      preference: {
        icon: "https://akam.cdn.jdmagicbox.com/images/icontent/newwap/web2022/topsearch.svg",
        label: "Top Search"
      }
    }
  ];

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

  @Input() activeTabName: any;
  @Input() filteredSubCategories: any = [];

  constructor(
    private modalService: NgbModal,
  ) {

  }


  openEnquirieModal() {
    const modalRef = this.modalService.open(EnquiriesModalComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.title = this.activeTabName;
    modalRef.componentInstance.filteredSubCategories = this.filteredSubCategories;
    modalRef.result.then((res: any) => {
      if (res.confirmed) {
      }
    }, () => {
    });
  }
}
