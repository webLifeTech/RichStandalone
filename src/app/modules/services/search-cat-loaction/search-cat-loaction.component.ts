import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgSelectModule } from '@ng-select/ng-select';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map, Observable, startWith } from 'rxjs';
import { VendorServService } from '../../../shared/services/vendor-service.service';
import { CabService } from '../../../shared/services/cab.service';
import { GlobalService } from '../../../shared/services/global.service';

export interface Category {
  Name: string;
  logo: string;
  id: string;
}

export interface Location {
  address: string;
  logo: string;
}


@Component({
  selector: 'app-search-cat-loaction',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgSelectModule,

    MatFormFieldModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,

    CommonModule,
    FormsModule
  ],
  templateUrl: './search-cat-loaction.component.html',
  styleUrl: './search-cat-loaction.component.scss'
})
export class SearchCatLoactionComponent {

  location: string = ''; // 11001  // need to do
  selectedCategory: any = ''; // Vehicle Inspections // need to do

  @Input() providerCategories: any = [];
  @Output() onHandleSubmit = new EventEmitter<any>();

  stateCtrl = new FormControl('');
  locationCtrl = new FormControl('');
  filteredStates: Observable<Category[]>;
  filteredLocation: Observable<Location[]>;

  locations: Location[] = [
    {
      address: 'Your Location',
      logo: 'assets/images/cab/icon/location-pin.svg',
    },
  ];

  constructor(
    private vendorService: VendorServService,
    public gs: GlobalService,
    public cabService: CabService,
  ) {
    this.getVendorTypes();
    this.filteredLocation = this.locationCtrl.valueChanges.pipe(
      startWith(''),
      map(state => (state ? this._filterLocation(state) : this.locations.slice())),
    );
  }

  private _filterStates(value: any): Category[] {
    const filterValue = value.toLowerCase();
    return this.providerCategories.filter((state: any) => state);
  }
  private _filterLocation(value: any): Location[] {
    const filterValue = value.toLowerCase();
    return this.locations.filter(i => i);
  }

  getVendorTypes() {
    this.vendorService.getMasterProviderCategories().subscribe((res: any) => {
      this.providerCategories = res;
      this.filteredStates = this.stateCtrl.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this._filterStates(state) : this.providerCategories.slice())),
      );

    })
  }

  clearLocation() {
    this.location = '';
  }


  onSearchLocation() {
    if (this.location.length < 2) {
      return;
    }
    let body = {
      "location": this.location,
      "risktype": 'Vendor'
    }
    this.gs.isSpinnerShow = true;
    this.cabService.GetLocations(body).subscribe((response: any) => {
      this.gs.isSpinnerShow = false;
      if (response.response && response.response.statusCode == "200") {
        this.locations = response.gridList || [];
        this.filteredLocation = this.locationCtrl.valueChanges.pipe(
          startWith(''),
          map(state => (state ? this._filterLocation(state) : this.locations.slice())),
        );
      }
    }, err => {
      this.gs.isSpinnerShow = false;
    })
  }

  onSearch() {
    const categoryInfo = this.providerCategories.find((cat: any) => cat.Name === this.selectedCategory);
    this.onHandleSubmit.emit({
      selectedCategory: this.selectedCategory,
      location: this.location,
      categoryInfo: categoryInfo,
    })
  }
}
