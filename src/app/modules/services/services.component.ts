import { Component } from '@angular/core';
import { SearchCatLoactionComponent } from './search-cat-loaction/search-cat-loaction.component';
import { CommonModule } from '@angular/common';
import { ServiceListComponent } from './service-list/service-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../shared/services/booking.service';
import { CabService } from '../../shared/services/cab.service';
import { GlobalService } from '../../shared/services/global.service';
import { AdvertisementComponent } from './advertisement/advertisement.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    SearchCatLoactionComponent,
    ServiceListComponent,
    AdvertisementComponent,

    CommonModule
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

  public bg_image = 'assets/images/cab/breadcrumb.jpg';
  public title = 'booking success';
  public parent = 'Home';
  public child = 'booking success';

  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection = [];
  public totalPages = 0;

  public activeTab = '';
  activeTabName: any = '';
  public tableData: any = [];

  mainCatList = [
    {
      name: 'Attorney',
      id: "1",
      logo: 'https://content.jdmagicbox.com/comp/vadodara/62/0265p265std160662/catalogue/kalpeshkumar-j-parekh-makarpura-vadodara-lawyers-0p6urwx8zi.jpg',

    },
    {
      name: 'Mortgage brokers',
      id: "2",
      logo: 'https://assets.bizclikmedia.net/668/033068c58c737acd3de0c69df92e5828:017186ccbc78d5d6b9ad8cb45995b45e/fannae-mae-1.jpg',
    },
    {
      name: 'Insurance Agent',
      id: "3",
      logo: 'https://cdn-icons-png.freepik.com/512/4599/4599163.png',
    },
    {
      name: 'Vehicle Inspections',
      id: "4",
      logo: 'https://static.thenounproject.com/png/1076534-200.png',
    },
  ]

  // { name: "Top Rated", value: "Top Rated" },
  filteredSubCategories: any = [];

  subCategories = [
    { parentId: "1", name: "Bankruptcy", value: "Bankruptcy" },
    { parentId: "1", name: "Contracts", value: "Contracts" },
    { parentId: "1", name: "Criminal defense", value: "Criminal defense" },
    { parentId: "1", name: "Family and estate", value: "Family and estate" },
    { parentId: "1", name: "General litigation", value: "General litigation" },
    { parentId: "1", name: "Government", value: "Government" },
    { parentId: "1", name: "Health, injury and disability", value: "Health, injury and disability" },
    { parentId: "1", name: "Real estate", value: "Real estate" },
    { parentId: "1", name: "Vehicular", value: "Vehicular" },

    { parentId: "2", name: "Auto", value: "Auto" },
    { parentId: "2", name: "Business", value: "Business" },
    { parentId: "2", name: "Credit card", value: "Credit card" },
    { parentId: "2", name: "Mortgage", value: "Mortgage" },
    { parentId: "2", name: "Personal", value: "Personal" },
    { parentId: "2", name: "Student", value: "Student" },
    { parentId: "2", name: "Title", value: "Title" },


    { parentId: "3", name: "Business", value: "Business" },
    { parentId: "3", name: "Health", value: "Health" },
    { parentId: "3", name: "Identity protection", value: "Identity protection" },
    { parentId: "3", name: "Jewelry", value: "Jewelry" },
    { parentId: "3", name: "Life", value: "Life" },
    { parentId: "3", name: "Overseas", value: "Overseas" },
    { parentId: "3", name: "Pet", value: "Pet" },
    { parentId: "3", name: "Property", value: "Property" },
    { parentId: "3", name: "Travel", value: "Travel" },
    { parentId: "3", name: "Umbrella", value: "Umbrella" },
    { parentId: "3", name: "Vehicle", value: "Vehicle" },

    { parentId: "4", name: "Car Inspectors", value: "Car Inspectors" },
    { parentId: "4", name: "Oil Change Stations", value: "Oil Change Stations" },
    { parentId: "4", name: "Auto Repair", value: "Auto Repair" },
    { parentId: "4", name: "Transmission Repair", value: "Transmission Repair" },
    { parentId: "4", name: "Smog Check Stations", value: "Smog Check Stations" },
    { parentId: "4", name: "Tires", value: "Tires" },
  ]


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
    public cabService: CabService,
    public gs: GlobalService,
  ) {
    window.scrollTo({ top: 180, behavior: 'smooth' });
    this.route.queryParams.subscribe((params) => {
      this.activeTab = params['activeTab'] ? params['activeTab'] : "all_bookings";
      this.getTableData(this.activeTab);
    })

    this.onHandleSubmit({ selectedCategory: 'Attorney' })
  }

  getTableData(type: any) {
    if (type === "all_bookings") {
      this.bookingService.getUserBookings().subscribe((apiRes: any) => {
        this.totalData = apiRes.totalData;
        this.tableData = apiRes.data;
      });
    }
  }

  changeBookTab(item: any) {
    // item.isSelected = true;
    this.activeTab = item.value;
    let params = {
      activeTab: this.activeTab
    }
    this.getTableData(this.activeTab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: "merge"
    });
  }

  onHandleSubmit(value: any) {
    console.log("value >>>>>>>>>", value);
    this.activeTabName = value.selectedCategory;

    console.log("this.subCategories >>>>>>", this.subCategories);

    const selected: any = this.mainCatList.find((item: any) => item.name === value.selectedCategory);
    console.log("selected >>>>>>", selected);

    this.filteredSubCategories = this.subCategories.filter((item: any) => item.parentId === selected.id);

    console.log("this.filteredSubCategories >>>>>>", this.filteredSubCategories);

  }


  // Attorney
  // --------------
  // Bankruptcy
  // Contracts
  // Criminal defense
  // Family and estate
  // General litigation
  // Government
  // Health, injury and disability
  // Real estate
  // Vehicular

  // Mortgage brokers
  // -----------------
  // Auto
  // Business
  // Credit card
  // Mortgage
  // Personal
  // Student
  // Title

  // Insurance Agent
  // -----------------
  // Business
  // Health
  // Identity protection
  // Jewelry
  // Life
  // Overseas
  // Pet
  // Property
  // Travel
  // Umbrella
  // Vehicle

  // Vehicle Inspections
  // ---------------------
  // Car Inspectors
  // Oil Change Stations
  // Auto Repair
  // Transmission Repair
  // Smog Check Stations
  // Tires

}
